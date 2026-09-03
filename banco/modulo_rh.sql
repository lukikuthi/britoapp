-- ==============================================================================
-- MÓDULO DE RECURSOS HUMANOS (RH) - SCHEMA & SECURITY
-- ==============================================================================

-- 0. FUNÇÃO DE SEGURANÇA BASE (PROGRAMADOR DO DIABO)
-- Essa função garante que NENHUMA tabela possa ser acessada por quem não tem permissão explícita no módulo
CREATE OR REPLACE FUNCTION public.has_module_access(check_modulo TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  has_access BOOLEAN;
  is_admin BOOLEAN;
BEGIN
  -- 1. Verifica se é admin (Acesso a tudo)
  SELECT (role = 'admin') INTO is_admin FROM public.user_roles WHERE user_id = auth.uid();
  IF is_admin THEN
    RETURN true;
  END IF;
  
  -- 2. Verifica acesso específico ao módulo na tabela relacional
  SELECT EXISTS (
    SELECT 1 FROM public.user_modulos WHERE user_id = auth.uid() AND modulo = check_modulo
  ) INTO has_access;
  
  RETURN has_access;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 1. TABELA PRINCIPAL DE FUNCIONÁRIOS
CREATE TABLE public.rh_funcionarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    cpf TEXT UNIQUE,
    cargo TEXT NOT NULL,
    obra_id UUID REFERENCES public.obras(id) ON DELETE SET NULL, -- Se a obra for deletada, o funcionário não some, apenas fica sem obra alocada
    status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'ferias', 'afastado')),
    salario NUMERIC(10, 2),
    data_admissao DATE NOT NULL,
    data_demissao DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. HISTÓRICO FUNCIONAL (Admissão, Promoções, Transferências, Desligamento)
CREATE TABLE public.rh_historico_funcional (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    funcionario_id UUID REFERENCES public.rh_funcionarios(id) ON DELETE CASCADE NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('admissao', 'promocao', 'transferencia', 'demissao', 'outro')),
    descricao TEXT NOT NULL,
    data_evento DATE NOT NULL,
    registrado_por UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. CONTROLE DE FÉRIAS
CREATE TABLE public.rh_ferias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    funcionario_id UUID REFERENCES public.rh_funcionarios(id) ON DELETE CASCADE NOT NULL,
    periodo_aquisitivo_inicio DATE NOT NULL,
    periodo_aquisitivo_fim DATE NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    status TEXT DEFAULT 'agendada' CHECK (status IN ('agendada', 'em_andamento', 'concluida', 'cancelada')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. CONTROLE DE EXAMES (ASO)
CREATE TABLE public.rh_exames (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    funcionario_id UUID REFERENCES public.rh_funcionarios(id) ON DELETE CASCADE NOT NULL,
    tipo_exame TEXT NOT NULL CHECK (tipo_exame IN ('admissional', 'periodico', 'demissional', 'retorno_trabalho', 'mudanca_risco')),
    data_realizacao DATE NOT NULL,
    data_vencimento DATE NOT NULL,
    anexo_url TEXT,
    status TEXT DEFAULT 'valido' CHECK (status IN ('valido', 'vencido', 'agendado')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TREINAMENTOS DE NRs (Normas Regulamentadoras)
CREATE TABLE public.rh_treinamentos_nr (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    funcionario_id UUID REFERENCES public.rh_funcionarios(id) ON DELETE CASCADE NOT NULL,
    norma TEXT NOT NULL, -- Ex: 'NR-35', 'NR-18'
    carga_horaria NUMERIC NOT NULL,
    data_realizacao DATE NOT NULL,
    data_vencimento DATE NOT NULL,
    anexo_certificado_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- ==============================================================================
-- PROTEÇÃO BLINDADA (ROW LEVEL SECURITY)
-- ==============================================================================
ALTER TABLE public.rh_funcionarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rh_historico_funcional ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rh_ferias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rh_exames ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rh_treinamentos_nr ENABLE ROW LEVEL SECURITY;

-- Aplicando a função de segurança para permitir CRUD apenas para quem tem acesso ao módulo 'rh' (ou 'obras' no caso de select de funcionários)
CREATE POLICY "Acesso RH Funcionarios" ON public.rh_funcionarios FOR ALL USING (public.has_module_access('rh') OR public.has_module_access('obras')); 
-- Nota: 'obras' precisa de SELECT nos funcionários para preencher o RDO, então liberei 'obras' tbm na tabela de funcionários. Mas para as demais, só 'rh'.

CREATE POLICY "Acesso RH Historico" ON public.rh_historico_funcional FOR ALL USING (public.has_module_access('rh'));
CREATE POLICY "Acesso RH Ferias" ON public.rh_ferias FOR ALL USING (public.has_module_access('rh'));
CREATE POLICY "Acesso RH Exames" ON public.rh_exames FOR ALL USING (public.has_module_access('rh'));
CREATE POLICY "Acesso RH NRs" ON public.rh_treinamentos_nr FOR ALL USING (public.has_module_access('rh'));


-- 6. CRIAR BUCKET PARA DOCUMENTOS DO RH (ASO, CERTIFICADOS)
INSERT INTO storage.buckets (id, name, public)
VALUES ('documentos_rh', 'documentos_rh', true)
ON CONFLICT (id) DO NOTHING;

-- Notificar PostgREST
NOTIFY pgrst, 'reload schema';
