-- ============================================================================
-- Migration: Restauração do Módulo RDO
-- Execute no Supabase SQL Editor para recriar as tabelas do Diário de Obra.
-- ============================================================================

-- 1. ENUMs
DO $$ BEGIN
  CREATE TYPE public.rdo_status AS ENUM ('rascunho', 'enviado', 'aprovado');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.clima_condicao AS ENUM ('ensolarado', 'nublado', 'chuva_leve', 'chuva_forte', 'tempestade', 'neblina');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.atividade_status AS ENUM ('nao_iniciada', 'em_andamento', 'concluida');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.ocorrencia_gravidade AS ENUM ('baixa', 'media', 'alta');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.equipamento_status AS ENUM ('disponivel', 'em_uso', 'manutencao');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.material_tipo AS ENUM ('entrada', 'saida');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.mao_obra_tipo AS ENUM ('proprio', 'terceirizado');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. Tabela Principal (rdos)
CREATE TABLE IF NOT EXISTS public.rdos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  obra_id UUID NOT NULL REFERENCES public.obras(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  numero_sequencial INT NOT NULL,
  autor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status public.rdo_status NOT NULL DEFAULT 'rascunho',
  hora_inicio TIME,
  hora_fim TIME,
  total_horas NUMERIC(5,2),
  observacoes TEXT,
  aprovado_por UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  aprovado_em TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (obra_id, data),
  UNIQUE (obra_id, numero_sequencial)
);
CREATE INDEX IF NOT EXISTS idx_rdos_obra ON public.rdos(obra_id, data DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.rdos TO authenticated;
GRANT ALL ON public.rdos TO service_role;
ALTER TABLE public.rdos ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS trg_rdos_updated_at ON public.rdos;
CREATE TRIGGER trg_rdos_updated_at
BEFORE UPDATE ON public.rdos
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger: número sequencial automático
CREATE OR REPLACE FUNCTION public.set_rdo_numero_sequencial()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.numero_sequencial IS NULL OR NEW.numero_sequencial = 0 THEN
    SELECT COALESCE(MAX(numero_sequencial), 0) + 1
      INTO NEW.numero_sequencial
      FROM public.rdos
     WHERE obra_id = NEW.obra_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_rdos_seq ON public.rdos;
CREATE TRIGGER trg_rdos_seq
BEFORE INSERT ON public.rdos
FOR EACH ROW EXECUTE FUNCTION public.set_rdo_numero_sequencial();

-- Trigger: audit log
CREATE OR REPLACE FUNCTION public.audit_rdo_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.audit_log (tabela, registro_id, acao, ator_id, diff)
  VALUES (
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    auth.uid(),
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE to_jsonb(NEW) END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_audit_rdos ON public.rdos;
CREATE TRIGGER trg_audit_rdos
AFTER INSERT OR UPDATE OR DELETE ON public.rdos
FOR EACH ROW EXECUTE FUNCTION public.audit_rdo_changes();

-- RLS rdos
DROP POLICY IF EXISTS "Ver RDOs de obras acessíveis" ON public.rdos;
CREATE POLICY "Ver RDOs de obras acessíveis" ON public.rdos
FOR SELECT TO authenticated USING (public.has_obra_access(auth.uid(), obra_id));

DROP POLICY IF EXISTS "Admin gerencia RDOs" ON public.rdos;
CREATE POLICY "Admin gerencia RDOs" ON public.rdos
FOR ALL TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Campo cria RDOs em suas obras" ON public.rdos;
CREATE POLICY "Campo cria RDOs em suas obras" ON public.rdos
FOR INSERT TO authenticated
WITH CHECK (public.can_edit_obra(auth.uid(), obra_id));

DROP POLICY IF EXISTS "Campo edita RDOs em suas obras" ON public.rdos;
CREATE POLICY "Campo edita RDOs em suas obras" ON public.rdos
FOR UPDATE TO authenticated
USING (public.can_edit_obra(auth.uid(), obra_id))
WITH CHECK (public.can_edit_obra(auth.uid(), obra_id));


-- 3. Tabelas Filhas do RDO

-- RDO_CLIMA
CREATE TABLE IF NOT EXISTS public.rdo_clima (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rdo_id UUID NOT NULL REFERENCES public.rdos(id) ON DELETE CASCADE,
  periodo TEXT NOT NULL CHECK (periodo IN ('manha','tarde','noite')),
  condicao public.clima_condicao NOT NULL,
  impactou_execucao BOOLEAN NOT NULL DEFAULT false,
  observacao TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (rdo_id, periodo)
);
CREATE INDEX IF NOT EXISTS idx_rdo_clima_rdo ON public.rdo_clima(rdo_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rdo_clima TO authenticated;
GRANT ALL ON public.rdo_clima TO service_role;
ALTER TABLE public.rdo_clima ENABLE ROW LEVEL SECURITY;

-- RDO_MAO_DE_OBRA
CREATE TABLE IF NOT EXISTS public.rdo_mao_de_obra (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rdo_id UUID NOT NULL REFERENCES public.rdos(id) ON DELETE CASCADE,
  funcao TEXT NOT NULL,
  quantidade INT NOT NULL DEFAULT 1 CHECK (quantidade >= 0),
  tipo public.mao_obra_tipo NOT NULL DEFAULT 'proprio',
  observacao TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_rdo_mo_rdo ON public.rdo_mao_de_obra(rdo_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rdo_mao_de_obra TO authenticated;
GRANT ALL ON public.rdo_mao_de_obra TO service_role;
ALTER TABLE public.rdo_mao_de_obra ENABLE ROW LEVEL SECURITY;

-- RDO_EQUIPAMENTOS
CREATE TABLE IF NOT EXISTS public.rdo_equipamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rdo_id UUID NOT NULL REFERENCES public.rdos(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  quantidade INT NOT NULL DEFAULT 1 CHECK (quantidade >= 0),
  status public.equipamento_status NOT NULL DEFAULT 'disponivel',
  observacao TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_rdo_eq_rdo ON public.rdo_equipamentos(rdo_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rdo_equipamentos TO authenticated;
GRANT ALL ON public.rdo_equipamentos TO service_role;
ALTER TABLE public.rdo_equipamentos ENABLE ROW LEVEL SECURITY;

-- RDO_ATIVIDADES
CREATE TABLE IF NOT EXISTS public.rdo_atividades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rdo_id UUID NOT NULL REFERENCES public.rdos(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  status public.atividade_status NOT NULL DEFAULT 'nao_iniciada',
  progresso_pct INT NOT NULL DEFAULT 0 CHECK (progresso_pct BETWEEN 0 AND 100),
  observacao TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_rdo_at_rdo ON public.rdo_atividades(rdo_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rdo_atividades TO authenticated;
GRANT ALL ON public.rdo_atividades TO service_role;
ALTER TABLE public.rdo_atividades ENABLE ROW LEVEL SECURITY;

-- RDO_OCORRENCIAS
CREATE TABLE IF NOT EXISTS public.rdo_ocorrencias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rdo_id UUID NOT NULL REFERENCES public.rdos(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  gravidade public.ocorrencia_gravidade NOT NULL DEFAULT 'baixa',
  resolvido BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_rdo_oc_rdo ON public.rdo_ocorrencias(rdo_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rdo_ocorrencias TO authenticated;
GRANT ALL ON public.rdo_ocorrencias TO service_role;
ALTER TABLE public.rdo_ocorrencias ENABLE ROW LEVEL SECURITY;

-- RDO_MATERIAIS
CREATE TABLE IF NOT EXISTS public.rdo_materiais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rdo_id UUID NOT NULL REFERENCES public.rdos(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  quantidade NUMERIC(12,2) NOT NULL DEFAULT 0,
  unidade TEXT NOT NULL DEFAULT 'un',
  fornecedor TEXT,
  tipo public.material_tipo NOT NULL DEFAULT 'entrada',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_rdo_mat_rdo ON public.rdo_materiais(rdo_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rdo_materiais TO authenticated;
GRANT ALL ON public.rdo_materiais TO service_role;
ALTER TABLE public.rdo_materiais ENABLE ROW LEVEL SECURITY;

-- RDO_COMENTARIOS
CREATE TABLE IF NOT EXISTS public.rdo_comentarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rdo_id UUID NOT NULL REFERENCES public.rdos(id) ON DELETE CASCADE,
  autor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  texto TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_rdo_com_rdo ON public.rdo_comentarios(rdo_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rdo_comentarios TO authenticated;
GRANT ALL ON public.rdo_comentarios TO service_role;
ALTER TABLE public.rdo_comentarios ENABLE ROW LEVEL SECURITY;

-- RDO_MIDIAS
CREATE TABLE IF NOT EXISTS public.rdo_midias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rdo_id UUID NOT NULL REFERENCES public.rdos(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'imagem' CHECK (tipo IN ('imagem','video')),
  legenda TEXT,
  enviado_por UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_rdo_mid_rdo ON public.rdo_midias(rdo_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rdo_midias TO authenticated;
GRANT ALL ON public.rdo_midias TO service_role;
ALTER TABLE public.rdo_midias ENABLE ROW LEVEL SECURITY;

-- RDO_ANEXOS
CREATE TABLE IF NOT EXISTS public.rdo_anexos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rdo_id UUID NOT NULL REFERENCES public.rdos(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  nome_arquivo TEXT NOT NULL,
  mime_type TEXT,
  enviado_por UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_rdo_anx_rdo ON public.rdo_anexos(rdo_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rdo_anexos TO authenticated;
GRANT ALL ON public.rdo_anexos TO service_role;
ALTER TABLE public.rdo_anexos ENABLE ROW LEVEL SECURITY;

-- RDO_ASSINATURA
CREATE TABLE IF NOT EXISTS public.rdo_assinatura (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rdo_id UUID NOT NULL REFERENCES public.rdos(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL DEFAULT 'responsavel_tecnico'
    CHECK (tipo IN ('responsavel_tecnico', 'cliente_fiscal')),
  assinado_por UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  nome_assinante TEXT NOT NULL,
  assinatura_png TEXT NOT NULL,
  assinado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (rdo_id, tipo)
);
CREATE INDEX IF NOT EXISTS idx_rdo_ass_rdo ON public.rdo_assinatura(rdo_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rdo_assinatura TO authenticated;
GRANT ALL ON public.rdo_assinatura TO service_role;
ALTER TABLE public.rdo_assinatura ENABLE ROW LEVEL SECURITY;

-- RDO_CHECKLIST_EPI
CREATE TABLE IF NOT EXISTS public.rdo_checklist_epi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rdo_id UUID NOT NULL REFERENCES public.rdos(id) ON DELETE CASCADE,
  item TEXT NOT NULL,
  presente BOOLEAN NOT NULL DEFAULT true,
  observacao TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_rdo_epi_rdo ON public.rdo_checklist_epi(rdo_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rdo_checklist_epi TO authenticated;
GRANT ALL ON public.rdo_checklist_epi TO service_role;
ALTER TABLE public.rdo_checklist_epi ENABLE ROW LEVEL SECURITY;

-- Policies filhas
DO $do$
DECLARE
  tbl TEXT;
  tbls TEXT[] := ARRAY[
    'rdo_clima','rdo_mao_de_obra','rdo_equipamentos','rdo_atividades',
    'rdo_ocorrencias','rdo_materiais','rdo_comentarios','rdo_midias',
    'rdo_anexos','rdo_assinatura','rdo_checklist_epi'
  ];
BEGIN
  FOREACH tbl IN ARRAY tbls LOOP
    EXECUTE format($f$ DROP POLICY IF EXISTS "Ver filhos de RDOs acessíveis" ON public.%I; $f$, tbl);
    EXECUTE format($f$
      CREATE POLICY "Ver filhos de RDOs acessíveis" ON public.%I
      FOR SELECT TO authenticated USING (
        EXISTS (SELECT 1 FROM public.rdos r
                WHERE r.id = %I.rdo_id AND public.has_obra_access(auth.uid(), r.obra_id))
      );
    $f$, tbl, tbl);

    EXECUTE format($f$ DROP POLICY IF EXISTS "Admin gerencia filhos" ON public.%I; $f$, tbl);
    EXECUTE format($f$
      CREATE POLICY "Admin gerencia filhos" ON public.%I
      FOR ALL TO authenticated
      USING (public.is_admin(auth.uid()))
      WITH CHECK (public.is_admin(auth.uid()));
    $f$, tbl);

    EXECUTE format($f$ DROP POLICY IF EXISTS "Campo gerencia filhos em obras suas" ON public.%I; $f$, tbl);
    EXECUTE format($f$
      CREATE POLICY "Campo gerencia filhos em obras suas" ON public.%I
      FOR ALL TO authenticated
      USING (EXISTS (SELECT 1 FROM public.rdos r
                     WHERE r.id = %I.rdo_id AND public.can_edit_obra(auth.uid(), r.obra_id)))
      WITH CHECK (EXISTS (SELECT 1 FROM public.rdos r
                          WHERE r.id = %I.rdo_id AND public.can_edit_obra(auth.uid(), r.obra_id)));
    $f$, tbl, tbl, tbl);
  END LOOP;
END
$do$;
