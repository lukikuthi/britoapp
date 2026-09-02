-- ============================================================
-- BRITO ENGENHARIA - Schema completo (espelho do código validado)
-- Gerado em: 2026-06-23
-- Execute inteiro no SQL Editor do Supabase que você configura manualmente
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- ENUMs
-- ============================================================
CREATE TYPE public.app_role AS ENUM ('admin', 'campo', 'cliente');
CREATE TYPE public.obra_status AS ENUM ('em_andamento', 'pausada', 'concluida');
CREATE TYPE public.rdo_status AS ENUM ('rascunho', 'enviado', 'aprovado');
CREATE TYPE public.clima_condicao AS ENUM ('ensolarado', 'nublado', 'chuva_leve', 'chuva_forte', 'tempestade', 'neblina');
CREATE TYPE public.atividade_status AS ENUM ('nao_iniciada', 'em_andamento', 'concluida');
CREATE TYPE public.ocorrencia_gravidade AS ENUM ('baixa', 'media', 'alta');
CREATE TYPE public.equipamento_status AS ENUM ('disponivel', 'em_uso', 'manutencao');
CREATE TYPE public.material_tipo AS ENUM ('entrada', 'saida');
CREATE TYPE public.mao_obra_tipo AS ENUM ('proprio', 'terceirizado');

-- ============================================================
-- FUNÇÕES DE UTILIDADE
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL DEFAULT '',
  email TEXT,
  telefone TEXT,
  avatar_url TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- USER ROLES
-- ============================================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- has_role / is_admin / get_user_role (SECURITY DEFINER)
-- ============================================================
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS public.app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY CASE role WHEN 'admin' THEN 1 WHEN 'campo' THEN 2 WHEN 'cliente' THEN 3 END
  LIMIT 1;
$$;

-- ============================================================
-- Trigger: criar profile + role ao criar usuário
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _role public.app_role;
  _is_first_user BOOLEAN;
BEGIN
  INSERT INTO public.profiles (id, nome, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email
  )
  ON CONFLICT (id) DO NOTHING;

  SELECT NOT EXISTS (SELECT 1 FROM public.user_roles) INTO _is_first_user;

  _role := COALESCE(
    (NEW.raw_user_meta_data->>'role')::public.app_role,
    CASE WHEN _is_first_user THEN 'admin'::public.app_role ELSE 'campo'::public.app_role END
  );

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, _role)
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Policies profiles
CREATE POLICY "Usuários veem seu próprio perfil" ON public.profiles
FOR SELECT TO authenticated USING (id = auth.uid());

CREATE POLICY "Admin vê todos os perfis" ON public.profiles
FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

CREATE POLICY "Usuários atualizam seu próprio perfil" ON public.profiles
FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE POLICY "Admin atualiza qualquer perfil" ON public.profiles
FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Policies user_roles
CREATE POLICY "Usuário vê seu próprio papel" ON public.user_roles
FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Admin vê todos os papéis" ON public.user_roles
FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

CREATE POLICY "Admin gerencia papéis" ON public.user_roles
FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- ============================================================
-- OBRAS
-- ============================================================
CREATE TABLE public.obras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  endereco TEXT,
  cidade TEXT,
  estado TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  cliente_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  responsavel_tecnico TEXT,
  data_inicio DATE,
  data_prevista_termino DATE,
  status public.obra_status NOT NULL DEFAULT 'em_andamento',
  descricao TEXT,
  foto_capa_path TEXT,
  criado_por UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.obras TO authenticated;
GRANT ALL ON public.obras TO service_role;
ALTER TABLE public.obras ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_obras_updated_at
BEFORE UPDATE ON public.obras
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- OBRA_USUARIOS (vínculo)
-- ============================================================
CREATE TABLE public.obra_usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  obra_id UUID NOT NULL REFERENCES public.obras(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (obra_id, user_id)
);
CREATE INDEX idx_obra_usuarios_user ON public.obra_usuarios(user_id);
CREATE INDEX idx_obra_usuarios_obra ON public.obra_usuarios(obra_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.obra_usuarios TO authenticated;
GRANT ALL ON public.obra_usuarios TO service_role;
ALTER TABLE public.obra_usuarios ENABLE ROW LEVEL SECURITY;

-- Função: usuário tem acesso à obra?
CREATE OR REPLACE FUNCTION public.has_obra_access(_user_id UUID, _obra_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_admin(_user_id) OR EXISTS (
    SELECT 1 FROM public.obra_usuarios
    WHERE user_id = _user_id AND obra_id = _obra_id
  ) OR EXISTS (
    SELECT 1 FROM public.obras
    WHERE id = _obra_id AND cliente_id = _user_id
  );
$$;

-- Função: pode editar a obra (admin ou campo vinculado)
CREATE OR REPLACE FUNCTION public.can_edit_obra(_user_id UUID, _obra_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_admin(_user_id) OR (
    public.has_role(_user_id, 'campo') AND EXISTS (
      SELECT 1 FROM public.obra_usuarios
      WHERE user_id = _user_id AND obra_id = _obra_id
    )
  );
$$;

-- Policies obras
CREATE POLICY "Admin gerencia obras" ON public.obras
FOR ALL TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Usuários veem suas obras" ON public.obras
FOR SELECT TO authenticated
USING (public.has_obra_access(auth.uid(), id));

CREATE POLICY "Campo edita obras vinculadas" ON public.obras
FOR UPDATE TO authenticated
USING (public.can_edit_obra(auth.uid(), id))
WITH CHECK (public.can_edit_obra(auth.uid(), id));

-- Policies obra_usuarios
CREATE POLICY "Admin gerencia vínculos" ON public.obra_usuarios
FOR ALL TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Usuário vê seus próprios vínculos" ON public.obra_usuarios
FOR SELECT TO authenticated USING (user_id = auth.uid());

-- ============================================================
-- RDOs
-- ============================================================
CREATE TABLE public.rdos (
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
CREATE INDEX idx_rdos_obra ON public.rdos(obra_id, data DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.rdos TO authenticated;
GRANT ALL ON public.rdos TO service_role;
ALTER TABLE public.rdos ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_rdos_updated_at
BEFORE UPDATE ON public.rdos
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger: número sequencial automático por obra
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

CREATE TRIGGER trg_rdos_seq
BEFORE INSERT ON public.rdos
FOR EACH ROW EXECUTE FUNCTION public.set_rdo_numero_sequencial();

-- Policies rdos
CREATE POLICY "Ver RDOs de obras acessíveis" ON public.rdos
FOR SELECT TO authenticated USING (public.has_obra_access(auth.uid(), obra_id));

CREATE POLICY "Admin gerencia RDOs" ON public.rdos
FOR ALL TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Campo cria RDOs em suas obras" ON public.rdos
FOR INSERT TO authenticated
WITH CHECK (public.can_edit_obra(auth.uid(), obra_id));

CREATE POLICY "Campo edita RDOs em suas obras" ON public.rdos
FOR UPDATE TO authenticated
USING (public.can_edit_obra(auth.uid(), obra_id))
WITH CHECK (public.can_edit_obra(auth.uid(), obra_id));

-- ============================================================
-- TABELAS FILHAS DO RDO
-- ============================================================

-- RDO_CLIMA
CREATE TABLE public.rdo_clima (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rdo_id UUID NOT NULL REFERENCES public.rdos(id) ON DELETE CASCADE,
  periodo TEXT NOT NULL CHECK (periodo IN ('manha','tarde','noite')),
  condicao public.clima_condicao NOT NULL,
  impactou_execucao BOOLEAN NOT NULL DEFAULT false,
  observacao TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (rdo_id, periodo)
);
CREATE INDEX idx_rdo_clima_rdo ON public.rdo_clima(rdo_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rdo_clima TO authenticated;
GRANT ALL ON public.rdo_clima TO service_role;
ALTER TABLE public.rdo_clima ENABLE ROW LEVEL SECURITY;

-- RDO_MAO_DE_OBRA
CREATE TABLE public.rdo_mao_de_obra (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rdo_id UUID NOT NULL REFERENCES public.rdos(id) ON DELETE CASCADE,
  funcao TEXT NOT NULL,
  quantidade INT NOT NULL DEFAULT 1 CHECK (quantidade >= 0),
  tipo public.mao_obra_tipo NOT NULL DEFAULT 'proprio',
  observacao TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_rdo_mo_rdo ON public.rdo_mao_de_obra(rdo_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rdo_mao_de_obra TO authenticated;
GRANT ALL ON public.rdo_mao_de_obra TO service_role;
ALTER TABLE public.rdo_mao_de_obra ENABLE ROW LEVEL SECURITY;

-- RDO_EQUIPAMENTOS
CREATE TABLE public.rdo_equipamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rdo_id UUID NOT NULL REFERENCES public.rdos(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  quantidade INT NOT NULL DEFAULT 1 CHECK (quantidade >= 0),
  status public.equipamento_status NOT NULL DEFAULT 'disponivel',
  observacao TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_rdo_eq_rdo ON public.rdo_equipamentos(rdo_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rdo_equipamentos TO authenticated;
GRANT ALL ON public.rdo_equipamentos TO service_role;
ALTER TABLE public.rdo_equipamentos ENABLE ROW LEVEL SECURITY;

-- RDO_ATIVIDADES
CREATE TABLE public.rdo_atividades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rdo_id UUID NOT NULL REFERENCES public.rdos(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  status public.atividade_status NOT NULL DEFAULT 'nao_iniciada',
  progresso_pct INT NOT NULL DEFAULT 0 CHECK (progresso_pct BETWEEN 0 AND 100),
  observacao TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_rdo_at_rdo ON public.rdo_atividades(rdo_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rdo_atividades TO authenticated;
GRANT ALL ON public.rdo_atividades TO service_role;
ALTER TABLE public.rdo_atividades ENABLE ROW LEVEL SECURITY;

-- RDO_OCORRENCIAS
CREATE TABLE public.rdo_ocorrencias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rdo_id UUID NOT NULL REFERENCES public.rdos(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  gravidade public.ocorrencia_gravidade NOT NULL DEFAULT 'baixa',
  resolvido BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_rdo_oc_rdo ON public.rdo_ocorrencias(rdo_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rdo_ocorrencias TO authenticated;
GRANT ALL ON public.rdo_ocorrencias TO service_role;
ALTER TABLE public.rdo_ocorrencias ENABLE ROW LEVEL SECURITY;

-- RDO_MATERIAIS
CREATE TABLE public.rdo_materiais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rdo_id UUID NOT NULL REFERENCES public.rdos(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  quantidade NUMERIC(12,2) NOT NULL DEFAULT 0,
  unidade TEXT NOT NULL DEFAULT 'un',
  fornecedor TEXT,
  tipo public.material_tipo NOT NULL DEFAULT 'entrada',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_rdo_mat_rdo ON public.rdo_materiais(rdo_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rdo_materiais TO authenticated;
GRANT ALL ON public.rdo_materiais TO service_role;
ALTER TABLE public.rdo_materiais ENABLE ROW LEVEL SECURITY;

-- RDO_COMENTARIOS
CREATE TABLE public.rdo_comentarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rdo_id UUID NOT NULL REFERENCES public.rdos(id) ON DELETE CASCADE,
  autor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  texto TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_rdo_com_rdo ON public.rdo_comentarios(rdo_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rdo_comentarios TO authenticated;
GRANT ALL ON public.rdo_comentarios TO service_role;
ALTER TABLE public.rdo_comentarios ENABLE ROW LEVEL SECURITY;

-- RDO_MIDIAS
CREATE TABLE public.rdo_midias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rdo_id UUID NOT NULL REFERENCES public.rdos(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'imagem' CHECK (tipo IN ('imagem','video')),
  legenda TEXT,
  enviado_por UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_rdo_mid_rdo ON public.rdo_midias(rdo_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rdo_midias TO authenticated;
GRANT ALL ON public.rdo_midias TO service_role;
ALTER TABLE public.rdo_midias ENABLE ROW LEVEL SECURITY;

-- RDO_ANEXOS
CREATE TABLE public.rdo_anexos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rdo_id UUID NOT NULL REFERENCES public.rdos(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  nome_arquivo TEXT NOT NULL,
  mime_type TEXT,
  enviado_por UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_rdo_anx_rdo ON public.rdo_anexos(rdo_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rdo_anexos TO authenticated;
GRANT ALL ON public.rdo_anexos TO service_role;
ALTER TABLE public.rdo_anexos ENABLE ROW LEVEL SECURITY;

-- RDO_ASSINATURA — duas assinaturas por RDO (RT + cliente/fiscal)
CREATE TABLE public.rdo_assinatura (
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
CREATE INDEX idx_rdo_ass_rdo ON public.rdo_assinatura(rdo_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rdo_assinatura TO authenticated;
GRANT ALL ON public.rdo_assinatura TO service_role;
ALTER TABLE public.rdo_assinatura ENABLE ROW LEVEL SECURITY;

-- RDO_CHECKLIST_EPI
CREATE TABLE public.rdo_checklist_epi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rdo_id UUID NOT NULL REFERENCES public.rdos(id) ON DELETE CASCADE,
  item TEXT NOT NULL,
  presente BOOLEAN NOT NULL DEFAULT true,
  observacao TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_rdo_epi_rdo ON public.rdo_checklist_epi(rdo_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rdo_checklist_epi TO authenticated;
GRANT ALL ON public.rdo_checklist_epi TO service_role;
ALTER TABLE public.rdo_checklist_epi ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Policies padronizadas para tabelas filhas de RDO
-- ============================================================
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
    EXECUTE format($f$
      CREATE POLICY "Ver filhos de RDOs acessíveis" ON public.%I
      FOR SELECT TO authenticated USING (
        EXISTS (SELECT 1 FROM public.rdos r
                WHERE r.id = %I.rdo_id AND public.has_obra_access(auth.uid(), r.obra_id))
      );
    $f$, tbl, tbl);

    EXECUTE format($f$
      CREATE POLICY "Admin gerencia filhos" ON public.%I
      FOR ALL TO authenticated
      USING (public.is_admin(auth.uid()))
      WITH CHECK (public.is_admin(auth.uid()));
    $f$, tbl);

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

-- ============================================================
-- TEMPLATES
-- ============================================================
CREATE TABLE public.templates_tarefas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  obra_id UUID REFERENCES public.obras(id) ON DELETE CASCADE,
  criado_por UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  itens JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.templates_tarefas TO authenticated;
GRANT ALL ON public.templates_tarefas TO service_role;
ALTER TABLE public.templates_tarefas ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_tpl_tar_updated BEFORE UPDATE ON public.templates_tarefas
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.templates_mao_de_obra (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  obra_id UUID REFERENCES public.obras(id) ON DELETE CASCADE,
  criado_por UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  itens JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.templates_mao_de_obra TO authenticated;
GRANT ALL ON public.templates_mao_de_obra TO service_role;
ALTER TABLE public.templates_mao_de_obra ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_tpl_mo_updated BEFORE UPDATE ON public.templates_mao_de_obra
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Ver templates globais ou de obras acessíveis (tarefas)" ON public.templates_tarefas
FOR SELECT TO authenticated USING (
  obra_id IS NULL OR public.has_obra_access(auth.uid(), obra_id)
);
CREATE POLICY "Editar templates próprios ou admin (tarefas)" ON public.templates_tarefas
FOR ALL TO authenticated
USING (public.is_admin(auth.uid()) OR criado_por = auth.uid())
WITH CHECK (public.is_admin(auth.uid()) OR criado_por = auth.uid());

CREATE POLICY "Ver templates globais ou de obras acessíveis (mo)" ON public.templates_mao_de_obra
FOR SELECT TO authenticated USING (
  obra_id IS NULL OR public.has_obra_access(auth.uid(), obra_id)
);
CREATE POLICY "Editar templates próprios ou admin (mo)" ON public.templates_mao_de_obra
FOR ALL TO authenticated
USING (public.is_admin(auth.uid()) OR criado_por = auth.uid())
WITH CHECK (public.is_admin(auth.uid()) OR criado_por = auth.uid());

CREATE TABLE public.templates_equipamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  obra_id UUID REFERENCES public.obras(id) ON DELETE CASCADE,
  criado_por UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  itens JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.templates_equipamentos TO authenticated;
GRANT ALL ON public.templates_equipamentos TO service_role;
ALTER TABLE public.templates_equipamentos ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_tpl_eq_updated BEFORE UPDATE ON public.templates_equipamentos
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Ver templates equipamentos de obras acessíveis" ON public.templates_equipamentos
FOR SELECT TO authenticated USING (
  obra_id IS NULL OR public.has_obra_access(auth.uid(), obra_id)
);
CREATE POLICY "Editar templates equipamentos próprios ou admin" ON public.templates_equipamentos
FOR ALL TO authenticated
USING (public.is_admin(auth.uid()) OR criado_por = auth.uid())
WITH CHECK (public.is_admin(auth.uid()) OR criado_por = auth.uid());

-- Documentos da obra (metadados; arquivos no bucket rdo-anexos)
CREATE TABLE public.obra_documentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  obra_id UUID NOT NULL REFERENCES public.obras(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  nome_arquivo TEXT NOT NULL,
  mime_type TEXT,
  enviado_por UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_obra_docs_obra ON public.obra_documentos(obra_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.obra_documentos TO authenticated;
GRANT ALL ON public.obra_documentos TO service_role;
ALTER TABLE public.obra_documentos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ver documentos de obras acessíveis" ON public.obra_documentos
FOR SELECT TO authenticated USING (public.has_obra_access(auth.uid(), obra_id));
CREATE POLICY "Admin gerencia documentos da obra" ON public.obra_documentos
FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Campo gerencia documentos em obras suas" ON public.obra_documentos
FOR ALL TO authenticated USING (public.can_edit_obra(auth.uid(), obra_id)) WITH CHECK (public.can_edit_obra(auth.uid(), obra_id));

-- ============================================================
-- AUDIT LOG
-- ============================================================
CREATE TABLE public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tabela TEXT NOT NULL,
  registro_id UUID,
  acao TEXT NOT NULL CHECK (acao IN ('INSERT','UPDATE','DELETE')),
  ator_id UUID,
  diff JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_audit_tabela ON public.audit_log(tabela, created_at DESC);

GRANT SELECT, INSERT ON public.audit_log TO authenticated;
GRANT ALL ON public.audit_log TO service_role;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin vê audit log" ON public.audit_log
FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

CREATE POLICY "Sistema insere audit log" ON public.audit_log
FOR INSERT TO authenticated WITH CHECK (true);

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

CREATE TRIGGER trg_audit_rdos
AFTER INSERT OR UPDATE OR DELETE ON public.rdos
FOR EACH ROW EXECUTE FUNCTION public.audit_rdo_changes();

-- ============================================================
-- STORAGE: buckets + policies (path: <obra_id>/...)
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES
  ('obra-capas', 'obra-capas', false),
  ('rdo-midias', 'rdo-midias', false),
  ('rdo-anexos', 'rdo-anexos', false)
ON CONFLICT (id) DO NOTHING;

-- obra-capas
CREATE POLICY "Storage: ver capa de obras acessíveis"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'obra-capas'
  AND public.has_obra_access(auth.uid(), (split_part(name, '/', 1))::uuid)
);
CREATE POLICY "Storage: admin/campo gerencia capa"
ON storage.objects FOR ALL TO authenticated
USING (
  bucket_id = 'obra-capas'
  AND public.can_edit_obra(auth.uid(), (split_part(name, '/', 1))::uuid)
)
WITH CHECK (
  bucket_id = 'obra-capas'
  AND public.can_edit_obra(auth.uid(), (split_part(name, '/', 1))::uuid)
);

-- rdo-midias
CREATE POLICY "Storage: ver mídias de obras acessíveis"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'rdo-midias'
  AND public.has_obra_access(auth.uid(), (split_part(name, '/', 1))::uuid)
);
CREATE POLICY "Storage: admin/campo gerencia mídias"
ON storage.objects FOR ALL TO authenticated
USING (
  bucket_id = 'rdo-midias'
  AND public.can_edit_obra(auth.uid(), (split_part(name, '/', 1))::uuid)
)
WITH CHECK (
  bucket_id = 'rdo-midias'
  AND public.can_edit_obra(auth.uid(), (split_part(name, '/', 1))::uuid)
);

-- rdo-anexos
CREATE POLICY "Storage: ver anexos de obras acessíveis"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'rdo-anexos'
  AND public.has_obra_access(auth.uid(), (split_part(name, '/', 1))::uuid)
);
CREATE POLICY "Storage: admin/campo gerencia anexos"
ON storage.objects FOR ALL TO authenticated
USING (
  bucket_id = 'rdo-anexos'
  AND public.can_edit_obra(auth.uid(), (split_part(name, '/', 1))::uuid)
)
WITH CHECK (
  bucket_id = 'rdo-anexos'
  AND public.can_edit_obra(auth.uid(), (split_part(name, '/', 1))::uuid)
);
