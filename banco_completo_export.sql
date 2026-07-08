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
-- ============================================================
-- BRITO ENGENHARIA — Seção Fotografia da obra (idempotente)
-- Execute no SQL Editor do Supabase após schema.sql / schema-fixes.sql
-- Armazena fotos em rdo-midias/{obra_id}/fotografia/...
-- ============================================================

CREATE TABLE IF NOT EXISTS public.obra_fotografia_itens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  obra_id UUID NOT NULL REFERENCES public.obras(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL DEFAULT '',
  descricao TEXT,
  storage_path TEXT,
  ordem INT NOT NULL DEFAULT 0,
  enviado_por UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_obra_fotografia_obra ON public.obra_fotografia_itens(obra_id, ordem);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.obra_fotografia_itens TO authenticated;
GRANT ALL ON public.obra_fotografia_itens TO service_role;

ALTER TABLE public.obra_fotografia_itens ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS trg_obra_fotografia_updated ON public.obra_fotografia_itens;
CREATE TRIGGER trg_obra_fotografia_updated
BEFORE UPDATE ON public.obra_fotografia_itens
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Policies (recria se já existirem)
DROP POLICY IF EXISTS "Ver fotografia de obras acessíveis" ON public.obra_fotografia_itens;
DROP POLICY IF EXISTS "Admin gerencia fotografia da obra" ON public.obra_fotografia_itens;
DROP POLICY IF EXISTS "Campo gerencia fotografia em obras suas" ON public.obra_fotografia_itens;

CREATE POLICY "Ver fotografia de obras acessíveis" ON public.obra_fotografia_itens
FOR SELECT TO authenticated
USING (public.has_obra_access(auth.uid(), obra_id));

CREATE POLICY "Admin gerencia fotografia da obra" ON public.obra_fotografia_itens
FOR ALL TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Campo gerencia fotografia em obras suas" ON public.obra_fotografia_itens
FOR ALL TO authenticated
USING (public.can_edit_obra(auth.uid(), obra_id))
WITH CHECK (public.can_edit_obra(auth.uid(), obra_id));
-- ============================================================
-- BRITO ENGENHARIA — correções idempotentes (execute após schema.sql)
-- Garante buckets de Storage e policies de INSERT para mídias/anexos.
-- Seguro para rodar mais de uma vez.
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES
  ('obra-capas', 'obra-capas', false),
  ('rdo-midias', 'rdo-midias', false),
  ('rdo-anexos', 'rdo-anexos', false)
ON CONFLICT (id) DO NOTHING;

-- Remove policies antigas com os mesmos nomes (se existirem) e recria
DO $do$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname IN (
        'Storage: ver capa de obras acessíveis',
        'Storage: admin/campo gerencia capa',
        'Storage: ver mídias de obras acessíveis',
        'Storage: admin/campo gerencia mídias',
        'Storage: ver anexos de obras acessíveis',
        'Storage: admin/campo gerencia anexos'
      )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
  END LOOP;
END
$do$;

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

-- rdo-midias (fotos e vídeos)
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

-- rdo-anexos (anexos do RDO + documentos da obra)
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
-- ============================================================
-- BRITO ENGENHARIA — Migração: Apontamentos Visuais
-- Criado em: 2026-07-06
-- Execute no SQL Editor do Supabase
-- ============================================================

-- ============================================================
-- 1. OBRA_TORRES
-- ============================================================

CREATE TABLE public.obra_torres (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  obra_id UUID NOT NULL REFERENCES public.obras(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  ordem INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_obra_torres_obra ON public.obra_torres(obra_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.obra_torres TO authenticated;
GRANT ALL ON public.obra_torres TO service_role;

ALTER TABLE public.obra_torres ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_obra_torres_updated_at
BEFORE UPDATE ON public.obra_torres
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Policies: obra_torres
CREATE POLICY "Ver torres de obras acessíveis" ON public.obra_torres
FOR SELECT TO authenticated
USING (public.has_obra_access(auth.uid(), obra_id));

CREATE POLICY "Admin gerencia torres" ON public.obra_torres
FOR ALL TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Campo gerencia torres em suas obras" ON public.obra_torres
FOR ALL TO authenticated
USING (public.can_edit_obra(auth.uid(), obra_id))
WITH CHECK (public.can_edit_obra(auth.uid(), obra_id));

-- ============================================================
-- 2. TORRE_GRUPOS_ANDAR
-- ============================================================

CREATE TABLE public.torre_grupos_andar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  torre_id UUID NOT NULL REFERENCES public.obra_torres(id) ON DELETE CASCADE,
  nome_grupo TEXT NOT NULL,
  andar_inicial INT NOT NULL,
  andar_final INT NOT NULL,
  tipo_andar TEXT NOT NULL DEFAULT 'tipo'
    CHECK (tipo_andar IN ('garagem', 'terreo', 'tipo', 'cobertura', 'comercial')),
  planta_storage_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_torre_grupos_torre ON public.torre_grupos_andar(torre_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.torre_grupos_andar TO authenticated;
GRANT ALL ON public.torre_grupos_andar TO service_role;

ALTER TABLE public.torre_grupos_andar ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_torre_grupos_andar_updated_at
BEFORE UPDATE ON public.torre_grupos_andar
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Policies: torre_grupos_andar (join back to obra_torres for obra_id)
CREATE POLICY "Ver grupos de torres acessíveis" ON public.torre_grupos_andar
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.obra_torres ot
    WHERE ot.id = torre_grupos_andar.torre_id
      AND public.has_obra_access(auth.uid(), ot.obra_id)
  )
);

CREATE POLICY "Admin gerencia grupos" ON public.torre_grupos_andar
FOR ALL TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Campo gerencia grupos em suas obras" ON public.torre_grupos_andar
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.obra_torres ot
    WHERE ot.id = torre_grupos_andar.torre_id
      AND public.can_edit_obra(auth.uid(), ot.obra_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.obra_torres ot
    WHERE ot.id = torre_grupos_andar.torre_id
      AND public.can_edit_obra(auth.uid(), ot.obra_id)
  )
);

-- ============================================================
-- 3. TORRE_ANDARES
-- ============================================================

CREATE TABLE public.torre_andares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  torre_id UUID NOT NULL REFERENCES public.obra_torres(id) ON DELETE CASCADE,
  grupo_id UUID REFERENCES public.torre_grupos_andar(id) ON DELETE CASCADE,
  numero_andar INT NOT NULL,
  apelido TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (torre_id, numero_andar)
);

CREATE INDEX idx_torre_andares_torre ON public.torre_andares(torre_id);
CREATE INDEX idx_torre_andares_grupo ON public.torre_andares(grupo_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.torre_andares TO authenticated;
GRANT ALL ON public.torre_andares TO service_role;

ALTER TABLE public.torre_andares ENABLE ROW LEVEL SECURITY;

-- Policies: torre_andares (join back to obra_torres)
CREATE POLICY "Ver andares de torres acessíveis" ON public.torre_andares
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.obra_torres ot
    WHERE ot.id = torre_andares.torre_id
      AND public.has_obra_access(auth.uid(), ot.obra_id)
  )
);

CREATE POLICY "Admin gerencia andares" ON public.torre_andares
FOR ALL TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Campo gerencia andares em suas obras" ON public.torre_andares
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.obra_torres ot
    WHERE ot.id = torre_andares.torre_id
      AND public.can_edit_obra(auth.uid(), ot.obra_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.obra_torres ot
    WHERE ot.id = torre_andares.torre_id
      AND public.can_edit_obra(auth.uid(), ot.obra_id)
  )
);

-- ============================================================
-- 4. APONTAMENTOS
-- ============================================================

CREATE TABLE public.apontamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  andar_id UUID NOT NULL REFERENCES public.torre_andares(id) ON DELETE CASCADE,
  pos_x NUMERIC(6,4) NOT NULL,
  pos_y NUMERIC(6,4) NOT NULL,
  descricao TEXT NOT NULL,
  autor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'aberto'
    CHECK (status IN ('aberto', 'resolvido')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_apontamentos_andar ON public.apontamentos(andar_id);
CREATE INDEX idx_apontamentos_status ON public.apontamentos(andar_id, status);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.apontamentos TO authenticated;
GRANT ALL ON public.apontamentos TO service_role;

ALTER TABLE public.apontamentos ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_apontamentos_updated_at
BEFORE UPDATE ON public.apontamentos
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Policies: apontamentos (join through torre_andares → obra_torres)
CREATE POLICY "Ver apontamentos de obras acessíveis" ON public.apontamentos
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.torre_andares ta
    JOIN public.obra_torres ot ON ot.id = ta.torre_id
    WHERE ta.id = apontamentos.andar_id
      AND public.has_obra_access(auth.uid(), ot.obra_id)
  )
);

CREATE POLICY "Admin gerencia apontamentos" ON public.apontamentos
FOR ALL TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Campo gerencia apontamentos em suas obras" ON public.apontamentos
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.torre_andares ta
    JOIN public.obra_torres ot ON ot.id = ta.torre_id
    WHERE ta.id = apontamentos.andar_id
      AND public.can_edit_obra(auth.uid(), ot.obra_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.torre_andares ta
    JOIN public.obra_torres ot ON ot.id = ta.torre_id
    WHERE ta.id = apontamentos.andar_id
      AND public.can_edit_obra(auth.uid(), ot.obra_id)
  )
);

-- ============================================================
-- 5. STORAGE: plantas-baixa bucket
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('plantas-baixa', 'plantas-baixa', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for plantas-baixa
-- Path convention: <obra_id>/<torre_id>/<filename>
CREATE POLICY "Storage: ver plantas de obras acessíveis"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'plantas-baixa'
  AND public.has_obra_access(auth.uid(), (split_part(name, '/', 1))::uuid)
);

CREATE POLICY "Storage: admin/campo gerencia plantas"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'plantas-baixa'
  AND public.can_edit_obra(auth.uid(), (split_part(name, '/', 1))::uuid)
);

CREATE POLICY "Storage: admin/campo atualiza plantas"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'plantas-baixa'
  AND public.can_edit_obra(auth.uid(), (split_part(name, '/', 1))::uuid)
)
WITH CHECK (
  bucket_id = 'plantas-baixa'
  AND public.can_edit_obra(auth.uid(), (split_part(name, '/', 1))::uuid)
);

CREATE POLICY "Storage: admin/campo deleta plantas"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'plantas-baixa'
  AND public.can_edit_obra(auth.uid(), (split_part(name, '/', 1))::uuid)
);
-- MIGRATION CATEGORIAS: Adicionando novos tipos de andares focados em engenharia elétrica/civil

-- 1. Remove a restrição atual
ALTER TABLE public.torre_grupos_andar 
DROP CONSTRAINT IF EXISTS torre_grupos_andar_tipo_andar_check;

-- 2. Recria a restrição com as novas categorias
ALTER TABLE public.torre_grupos_andar 
ADD CONSTRAINT torre_grupos_andar_tipo_andar_check 
CHECK (tipo_andar IN (
    'garagem', 
    'terreo', 
    'tipo', 
    'cobertura', 
    'comercial', 
    'tecnica',     -- Áreas Técnicas / Barrilete
    'mezanino',    -- Mezaninos / Pilotis / Áreas Comuns
    'subestacao'   -- Subestação / Casa de Força
));
-- MIGRATION EAP: Gestão de Cronograma e Medição Física
-- Criação da tabela de EAP (Estrutura Analítica do Projeto) e vínculo com RDO Atividades

CREATE TABLE IF NOT EXISTS public.obra_eap (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    obra_id UUID NOT NULL REFERENCES public.obras(id) ON DELETE CASCADE,
    codigo TEXT NOT NULL, -- Ex: "1.1", "1.1.2"
    descricao TEXT NOT NULL,
    peso_percentual NUMERIC DEFAULT 0, -- Peso dessa tarefa no total da obra (0 a 100)
    avanco_planejado NUMERIC DEFAULT 0, -- Avanço físico planejado até o momento (0 a 100)
    avanco_realizado NUMERIC DEFAULT 0, -- Avanço físico real acumulado (0 a 100)
    data_inicio_prevista DATE,
    data_fim_prevista DATE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(obra_id, codigo)
);

-- Vincular EAP ao RDO Atividades
ALTER TABLE public.rdo_atividades 
ADD COLUMN IF NOT EXISTS eap_id UUID REFERENCES public.obra_eap(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS avanco_informado NUMERIC DEFAULT 0; -- Quanto % avançou NESTE RDO

-- Habilitar RLS e criar Políticas
ALTER TABLE public.obra_eap ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acesso à EAP da Obra" ON public.obra_eap
    FOR ALL USING (public.has_obra_access(auth.uid(), obra_id));
-- MIGRATION: Expansão Enterprise (Materiais, Laudos e SESMT)

-- Cria a função de trigger caso não exista
CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =========================================================================
-- 1. MÓDULO DE MATERIAIS (Requisição de Materiais - RM)
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.materiais_requisicoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  obra_id UUID NOT NULL REFERENCES public.obras(id) ON DELETE CASCADE,
  autor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  numero_sequencial SERIAL,
  status TEXT NOT NULL CHECK (status IN ('rascunho', 'solicitado', 'aprovado', 'comprado', 'entregue', 'cancelado')) DEFAULT 'rascunho',
  prioridade TEXT NOT NULL CHECK (prioridade IN ('baixa', 'normal', 'alta', 'urgente')) DEFAULT 'normal',
  data_necessidade DATE,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.materiais_itens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requisicao_id UUID NOT NULL REFERENCES public.materiais_requisicoes(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  quantidade NUMERIC(10,2) NOT NULL,
  unidade TEXT NOT NULL, -- un, m, kg, cx, rolo, etc.
  status TEXT NOT NULL CHECK (status IN ('pendente', 'comprado', 'entregue', 'cancelado')) DEFAULT 'pendente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================================
-- 2. MÓDULO DE COMISSIONAMENTO E ENSAIOS (Laudos)
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.laudos_ensaios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  obra_id UUID NOT NULL REFERENCES public.obras(id) ON DELETE CASCADE,
  disciplina TEXT NOT NULL CHECK (disciplina IN ('eletrica', 'civil', 'hidraulica', 'incendio', 'climatizacao', 'outro')),
  tipo_ensaio TEXT NOT NULL, -- ex: "Megômetro", "Resistência de Aterramento", "Slump Test"
  arquivo_path TEXT NOT NULL, -- Caminho no storage 'laudos-ensaios'
  data_ensaio DATE NOT NULL,
  status_aprovacao TEXT NOT NULL CHECK (status_aprovacao IN ('pendente', 'aprovado', 'reprovado')) DEFAULT 'pendente',
  aprovado_por UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Novo bucket para os Laudos
INSERT INTO storage.buckets (id, name, public) VALUES ('laudos-ensaios', 'laudos-ensaios', true) ON CONFLICT DO NOTHING;

-- =========================================================================
-- 3. MÓDULO DE SEGURANÇA DO TRABALHO (SESMT)
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.sesmt_dds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  obra_id UUID NOT NULL REFERENCES public.obras(id) ON DELETE CASCADE,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  tema TEXT NOT NULL,
  instrutor TEXT NOT NULL,
  arquivo_lista_presenca TEXT, -- Caminho no storage 'sesmt-arquivos'
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.sesmt_epis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  obra_id UUID NOT NULL REFERENCES public.obras(id) ON DELETE CASCADE,
  funcionario TEXT NOT NULL,
  equipamento TEXT NOT NULL,
  ca_numero TEXT,
  data_entrega DATE NOT NULL DEFAULT CURRENT_DATE,
  data_devolucao DATE,
  termo_assinado_path TEXT, -- Caminho no storage 'sesmt-arquivos'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Novo bucket para Arquivos de Segurança (DDS, Fichas EPI)
INSERT INTO storage.buckets (id, name, public) VALUES ('sesmt-arquivos', 'sesmt-arquivos', true) ON CONFLICT DO NOTHING;

-- =========================================================================
-- TRIGGERS DE UPDATED_AT
-- =========================================================================

CREATE TRIGGER update_materiais_req_modtime BEFORE UPDATE ON public.materiais_requisicoes FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_materiais_itens_modtime BEFORE UPDATE ON public.materiais_itens FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_laudos_ensaios_modtime BEFORE UPDATE ON public.laudos_ensaios FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_sesmt_dds_modtime BEFORE UPDATE ON public.sesmt_dds FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_sesmt_epis_modtime BEFORE UPDATE ON public.sesmt_epis FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- =========================================================================
-- RLS (ROW LEVEL SECURITY)
-- Padrão: Todos que têm acesso à obra podem VER e INSERIR. 
-- Atualizar e Excluir depende do has_obra_access ou is_admin.
-- =========================================================================

ALTER TABLE public.materiais_requisicoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materiais_itens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.laudos_ensaios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sesmt_dds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sesmt_epis ENABLE ROW LEVEL SECURITY;

-- 1. Materiais Requisicoes
CREATE POLICY "View MR if has access" ON public.materiais_requisicoes FOR SELECT USING (has_obra_access(obra_id, auth.uid()));
CREATE POLICY "Insert MR if has access" ON public.materiais_requisicoes FOR INSERT WITH CHECK (has_obra_access(obra_id, auth.uid()));
CREATE POLICY "Update MR Se admin ou autor" ON public.materiais_requisicoes FOR UPDATE USING (is_admin(auth.uid()) OR autor_id = auth.uid());
CREATE POLICY "Delete MR se admin ou autor" ON public.materiais_requisicoes FOR DELETE USING (is_admin(auth.uid()) OR autor_id = auth.uid());

-- 2. Materiais Itens
CREATE POLICY "View Itens se tem acesso a obra" ON public.materiais_itens FOR SELECT USING (
  EXISTS (SELECT 1 FROM materiais_requisicoes r WHERE r.id = requisicao_id AND has_obra_access(r.obra_id, auth.uid()))
);
CREATE POLICY "Insert Itens se tem acesso" ON public.materiais_itens FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM materiais_requisicoes r WHERE r.id = requisicao_id AND has_obra_access(r.obra_id, auth.uid()))
);
CREATE POLICY "Update/Delete Itens se admin ou autor" ON public.materiais_itens FOR ALL USING (
  EXISTS (SELECT 1 FROM materiais_requisicoes r WHERE r.id = requisicao_id AND (is_admin(auth.uid()) OR r.autor_id = auth.uid()))
);

-- 3. Laudos
CREATE POLICY "View Laudos if has access" ON public.laudos_ensaios FOR SELECT USING (has_obra_access(obra_id, auth.uid()));
CREATE POLICY "Insert Laudos if has access" ON public.laudos_ensaios FOR INSERT WITH CHECK (has_obra_access(obra_id, auth.uid()));
CREATE POLICY "Update/Delete Laudos Admin" ON public.laudos_ensaios FOR ALL USING (is_admin(auth.uid()));

-- 4. SESMT DDS
CREATE POLICY "View DDS if has access" ON public.sesmt_dds FOR SELECT USING (has_obra_access(obra_id, auth.uid()));
CREATE POLICY "Insert DDS if has access" ON public.sesmt_dds FOR INSERT WITH CHECK (has_obra_access(obra_id, auth.uid()));
CREATE POLICY "Update/Delete DDS Admin" ON public.sesmt_dds FOR ALL USING (is_admin(auth.uid()));

-- 5. SESMT EPIs
CREATE POLICY "View EPIs if has access" ON public.sesmt_epis FOR SELECT USING (has_obra_access(obra_id, auth.uid()));
CREATE POLICY "Insert EPIs if has access" ON public.sesmt_epis FOR INSERT WITH CHECK (has_obra_access(obra_id, auth.uid()));
CREATE POLICY "Update/Delete EPIs Admin" ON public.sesmt_epis FOR ALL USING (is_admin(auth.uid()));

-- Storage Policies para laudos-ensaios
CREATE POLICY "Ler laudos publicos" ON storage.objects FOR SELECT USING (bucket_id = 'laudos-ensaios');
CREATE POLICY "Inserir laudos autenticados" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'laudos-ensaios' AND auth.role() = 'authenticated');
CREATE POLICY "Deletar laudos autenticados" ON storage.objects FOR DELETE USING (bucket_id = 'laudos-ensaios' AND auth.role() = 'authenticated');

-- Storage Policies para sesmt-arquivos
CREATE POLICY "Ler sesmt publicos" ON storage.objects FOR SELECT USING (bucket_id = 'sesmt-arquivos');
CREATE POLICY "Inserir sesmt autenticados" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'sesmt-arquivos' AND auth.role() = 'authenticated');
CREATE POLICY "Deletar sesmt autenticados" ON storage.objects FOR DELETE USING (bucket_id = 'sesmt-arquivos' AND auth.role() = 'authenticated');
-- MIGRATION CDE: Common Data Environment (Controle de Projetos e Revisões)

CREATE TABLE IF NOT EXISTS public.obra_projetos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    obra_id UUID NOT NULL REFERENCES public.obras(id) ON DELETE CASCADE,
    disciplina TEXT NOT NULL, -- Ex: Arquitetura, Elétrica, Estrutural
    nome TEXT NOT NULL, -- Ex: "Prancha 01 - Térreo"
    codigo TEXT, -- Ex: "ARQ-01"
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.obra_projetos_revisoes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    projeto_id UUID NOT NULL REFERENCES public.obra_projetos(id) ON DELETE CASCADE,
    revisao TEXT NOT NULL, -- Ex: "R00", "R01", "R02"
    storage_path TEXT NOT NULL,
    is_vigente BOOLEAN DEFAULT false, -- Apenas UMA revisão por projeto pode ser vigente
    upload_por UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexação para performance
CREATE INDEX IF NOT EXISTS idx_obra_proj_obra ON public.obra_projetos(obra_id);
CREATE INDEX IF NOT EXISTS idx_obra_proj_rev_proj ON public.obra_projetos_revisoes(projeto_id);

-- RLS e Políticas
ALTER TABLE public.obra_projetos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.obra_projetos_revisoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acesso aos Projetos da Obra" ON public.obra_projetos
    FOR ALL USING (public.has_obra_access(auth.uid(), obra_id));

CREATE POLICY "Acesso às Revisões" ON public.obra_projetos_revisoes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.obra_projetos p
            WHERE p.id = obra_projetos_revisoes.projeto_id
            AND public.has_obra_access(auth.uid(), p.obra_id)
        )
    );

-- Storage (Bucket para PDF dos Projetos)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('projetos-cde', 'projetos-cde', true) 
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Projetos Upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'projetos-cde');
CREATE POLICY "Projetos Download" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'projetos-cde');
CREATE POLICY "Projetos Delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'projetos-cde');
-- migration-rdo-galeria-plantas.sql

CREATE TABLE IF NOT EXISTS public.rdo_andares_selecionados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rdo_id UUID NOT NULL REFERENCES public.rdos(id) ON DELETE CASCADE,
  andar_id UUID NOT NULL REFERENCES public.torre_andares(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (rdo_id, andar_id)
);

CREATE INDEX IF NOT EXISTS idx_rdo_and_sel_rdo ON public.rdo_andares_selecionados(rdo_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rdo_andares_selecionados TO authenticated;
GRANT ALL ON public.rdo_andares_selecionados TO service_role;

ALTER TABLE public.rdo_andares_selecionados ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'rdo_andares_selecionados' AND policyname = 'Campo gerencia andares selecionados no rdo'
    ) THEN
        CREATE POLICY "Campo gerencia andares selecionados no rdo" ON public.rdo_andares_selecionados
        FOR ALL TO authenticated
        USING (EXISTS (SELECT 1 FROM public.rdos r
                       WHERE r.id = rdo_andares_selecionados.rdo_id AND public.can_edit_obra(auth.uid(), r.obra_id)))
        WITH CHECK (EXISTS (SELECT 1 FROM public.rdos r
                            WHERE r.id = rdo_andares_selecionados.rdo_id AND public.can_edit_obra(auth.uid(), r.obra_id)));
    END IF;
END $$;
-- ============================================================================
-- Migration: Remoção do módulo RDO
-- NÃO EXECUTE AUTOMATICAMENTE — revisar e executar manualmente no Supabase.
-- ============================================================================

-- 1. Drop triggers
DROP TRIGGER IF EXISTS trg_audit_rdos ON public.rdos;
DROP TRIGGER IF EXISTS trg_rdos_updated_at ON public.rdos;
DROP TRIGGER IF EXISTS trg_rdos_seq ON public.rdos;

-- 2. Drop functions exclusivas do RDO
DROP FUNCTION IF EXISTS public.set_rdo_numero_sequencial();
DROP FUNCTION IF EXISTS public.audit_rdo_changes();

-- 3. Drop tabelas filhas (ordem inversa de FK)
DROP TABLE IF EXISTS public.rdo_assinatura;
DROP TABLE IF EXISTS public.rdo_comentarios;
DROP TABLE IF EXISTS public.rdo_checklist_epi;
DROP TABLE IF EXISTS public.rdo_materiais;
DROP TABLE IF EXISTS public.rdo_ocorrencias;
DROP TABLE IF EXISTS public.rdo_atividades;
DROP TABLE IF EXISTS public.rdo_equipamentos;
DROP TABLE IF EXISTS public.rdo_mao_de_obra;
DROP TABLE IF EXISTS public.rdo_midias;
DROP TABLE IF EXISTS public.rdo_anexos;
DROP TABLE IF EXISTS public.rdo_clima;

-- 4. Drop tabela principal
DROP TABLE IF EXISTS public.rdos;

-- 5. Drop ENUMs exclusivos do RDO (se não referenciados em outro lugar)
DROP TYPE IF EXISTS public.rdo_status;
DROP TYPE IF EXISTS public.clima_condicao;
DROP TYPE IF EXISTS public.atividade_status;
DROP TYPE IF EXISTS public.ocorrencia_gravidade;
DROP TYPE IF EXISTS public.equipamento_status;
DROP TYPE IF EXISTS public.material_tipo;
DROP TYPE IF EXISTS public.mao_obra_tipo;

-- NÃO remover: audit_log, storage buckets, templates, profiles, user_roles, obras
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
-- MIGRATION: Expansão Sênior (Cronograma, RNC, FVR, Concretagem, BM)

-- Cria a função de trigger caso não exista
CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =========================================================================
-- 1. CRONOGRAMA (Adicionando datas na EAP)
-- =========================================================================

ALTER TABLE IF EXISTS public.obra_eap 
  ADD COLUMN IF NOT EXISTS data_inicio_planejada DATE,
  ADD COLUMN IF NOT EXISTS data_fim_planejada DATE;

-- =========================================================================
-- 2. RNC (Relatório de Não Conformidade)
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.obra_rnc (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  obra_id UUID NOT NULL REFERENCES public.obras(id) ON DELETE CASCADE,
  autor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  descricao TEXT NOT NULL,
  causa_raiz TEXT, -- Ex: 5 Porquês
  acao_corretiva TEXT,
  prazo_resolucao DATE,
  data_fechamento DATE,
  status TEXT NOT NULL CHECK (status IN ('aberta', 'em_andamento', 'fechada', 'cancelada')) DEFAULT 'aberta',
  foto_antes_path TEXT, -- Caminho no storage 'rnc-arquivos'
  foto_depois_path TEXT, -- Caminho no storage 'rnc-arquivos'
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

INSERT INTO storage.buckets (id, name, public) VALUES ('rnc-arquivos', 'rnc-arquivos', true) ON CONFLICT DO NOTHING;
CREATE TRIGGER update_obra_rnc_modtime BEFORE UPDATE ON public.obra_rnc FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- =========================================================================
-- 3. FVR (Ficha de Verificação de Recebimento)
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.materiais_fvr (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  obra_id UUID NOT NULL REFERENCES public.obras(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES public.materiais_itens(id) ON DELETE CASCADE,
  autor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  nota_fiscal TEXT NOT NULL,
  quantidade_recebida NUMERIC(10,2) NOT NULL,
  status_qualidade TEXT NOT NULL CHECK (status_qualidade IN ('aprovado', 'rejeitado', 'aprovado_parcial')) DEFAULT 'aprovado',
  foto_carga_path TEXT, -- Caminho no storage 'fvr-arquivos'
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

INSERT INTO storage.buckets (id, name, public) VALUES ('fvr-arquivos', 'fvr-arquivos', true) ON CONFLICT DO NOTHING;
CREATE TRIGGER update_materiais_fvr_modtime BEFORE UPDATE ON public.materiais_fvr FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- =========================================================================
-- 4. BM (Boletim de Medição)
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.obra_boletins_medicao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  obra_id UUID NOT NULL REFERENCES public.obras(id) ON DELETE CASCADE,
  autor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  empreiteiro TEXT NOT NULL,
  data_medicao DATE NOT NULL DEFAULT CURRENT_DATE,
  periodo_inicio DATE NOT NULL,
  periodo_fim DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('rascunho', 'emitido', 'aprovado', 'cancelado')) DEFAULT 'rascunho',
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.obra_boletins_itens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  boletim_id UUID NOT NULL REFERENCES public.obra_boletins_medicao(id) ON DELETE CASCADE,
  eap_id UUID NOT NULL REFERENCES public.obra_eap(id) ON DELETE CASCADE,
  avanco_medido_pct NUMERIC(5,2) NOT NULL DEFAULT 0, -- Quanto % foi feito nesse período
  valor_calculado NUMERIC(15,2), -- Opcional, se a empresa usar R$
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TRIGGER update_obra_boletins_medicao_modtime BEFORE UPDATE ON public.obra_boletins_medicao FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_obra_boletins_itens_modtime BEFORE UPDATE ON public.obra_boletins_itens FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- =========================================================================
-- 5. CONCRETAGEM (Diário e Rastreabilidade)
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.obra_concretagem (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  obra_id UUID NOT NULL REFERENCES public.obras(id) ON DELETE CASCADE,
  autor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  fornecedor TEXT NOT NULL,
  nota_fiscal TEXT NOT NULL,
  placa_caminhao TEXT NOT NULL,
  volume_m3 NUMERIC(10,2) NOT NULL,
  fck_projeto NUMERIC(10,2) NOT NULL,
  slump_test TEXT, -- Ex: 10±2
  local_lancamento TEXT NOT NULL, -- Ex: "Laje 3º Andar"
  rastreabilidade_corpos_prova JSONB, -- {"cp_7_dias": 25, "cp_28_dias": 31, "status": "aprovado"}
  status TEXT NOT NULL CHECK (status IN ('agendado', 'em_andamento', 'concluido', 'cancelado')) DEFAULT 'concluido',
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TRIGGER update_obra_concretagem_modtime BEFORE UPDATE ON public.obra_concretagem FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- =========================================================================
-- RLS (ROW LEVEL SECURITY)
-- =========================================================================

ALTER TABLE public.obra_rnc ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materiais_fvr ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.obra_boletins_medicao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.obra_boletins_itens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.obra_concretagem ENABLE ROW LEVEL SECURITY;

-- 1. RNC
CREATE POLICY "View RNC if has access" ON public.obra_rnc FOR SELECT USING (has_obra_access(obra_id, auth.uid()));
CREATE POLICY "Insert RNC if has access" ON public.obra_rnc FOR INSERT WITH CHECK (has_obra_access(obra_id, auth.uid()));
CREATE POLICY "Update/Delete RNC Admin/Autor" ON public.obra_rnc FOR ALL USING (is_admin(auth.uid()) OR autor_id = auth.uid());

-- 2. FVR
CREATE POLICY "View FVR if has access" ON public.materiais_fvr FOR SELECT USING (has_obra_access(obra_id, auth.uid()));
CREATE POLICY "Insert FVR if has access" ON public.materiais_fvr FOR INSERT WITH CHECK (has_obra_access(obra_id, auth.uid()));
CREATE POLICY "Update/Delete FVR Admin/Autor" ON public.materiais_fvr FOR ALL USING (is_admin(auth.uid()) OR autor_id = auth.uid());

-- 3. BM (Boletim de Medição)
CREATE POLICY "View BM if has access" ON public.obra_boletins_medicao FOR SELECT USING (has_obra_access(obra_id, auth.uid()));
CREATE POLICY "Insert BM if has access" ON public.obra_boletins_medicao FOR INSERT WITH CHECK (has_obra_access(obra_id, auth.uid()));
CREATE POLICY "Update/Delete BM Admin/Autor" ON public.obra_boletins_medicao FOR ALL USING (is_admin(auth.uid()) OR autor_id = auth.uid());

-- 4. BM Itens
CREATE POLICY "View BM Itens if has access" ON public.obra_boletins_itens FOR SELECT USING (
  EXISTS (SELECT 1 FROM obra_boletins_medicao b WHERE b.id = boletim_id AND has_obra_access(b.obra_id, auth.uid()))
);
CREATE POLICY "Insert BM Itens if has access" ON public.obra_boletins_itens FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM obra_boletins_medicao b WHERE b.id = boletim_id AND has_obra_access(b.obra_id, auth.uid()))
);
CREATE POLICY "Update/Delete BM Itens Admin/Autor" ON public.obra_boletins_itens FOR ALL USING (
  EXISTS (SELECT 1 FROM obra_boletins_medicao b WHERE b.id = boletim_id AND (is_admin(auth.uid()) OR b.autor_id = auth.uid()))
);

-- 5. Concretagem
CREATE POLICY "View Concretagem if has access" ON public.obra_concretagem FOR SELECT USING (has_obra_access(obra_id, auth.uid()));
CREATE POLICY "Insert Concretagem if has access" ON public.obra_concretagem FOR INSERT WITH CHECK (has_obra_access(obra_id, auth.uid()));
CREATE POLICY "Update/Delete Concretagem Admin/Autor" ON public.obra_concretagem FOR ALL USING (is_admin(auth.uid()) OR autor_id = auth.uid());

-- Storage Policies
CREATE POLICY "Ler rnc publicos" ON storage.objects FOR SELECT USING (bucket_id = 'rnc-arquivos');
CREATE POLICY "Inserir rnc autenticados" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'rnc-arquivos' AND auth.role() = 'authenticated');
CREATE POLICY "Deletar rnc autenticados" ON storage.objects FOR DELETE USING (bucket_id = 'rnc-arquivos' AND auth.role() = 'authenticated');

CREATE POLICY "Ler fvr publicos" ON storage.objects FOR SELECT USING (bucket_id = 'fvr-arquivos');
CREATE POLICY "Inserir fvr autenticados" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'fvr-arquivos' AND auth.role() = 'authenticated');
CREATE POLICY "Deletar fvr autenticados" ON storage.objects FOR DELETE USING (bucket_id = 'fvr-arquivos' AND auth.role() = 'authenticated');
