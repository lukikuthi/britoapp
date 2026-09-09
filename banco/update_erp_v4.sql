-- ==============================================================================
-- UPDATE ERP V4: PATRIMÔNIO, COTAÇÕES E TERCEIROS
-- ==============================================================================

-- ==============================================================================
-- 1. MÓDULO DE PATRIMÔNIO E EQUIPAMENTOS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.cad_equipamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    codigo_patrimonio TEXT UNIQUE,
    tipo TEXT NOT NULL CHECK (tipo IN ('ferramenta', 'maquina_leve', 'maquina_pesada', 'veiculo', 'tecnologia')),
    status TEXT NOT NULL DEFAULT 'disponivel' CHECK (status IN ('disponivel', 'em_uso', 'manutencao', 'baixado')),
    valor_aquisicao NUMERIC(15, 2),
    data_aquisicao DATE,
    vida_util_meses INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.equipamentos_movimentacao (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    equipamento_id UUID REFERENCES public.cad_equipamentos(id) ON DELETE CASCADE NOT NULL,
    obra_id UUID REFERENCES public.obras(id) ON DELETE SET NULL,
    responsavel_id UUID REFERENCES public.rh_funcionarios(id) ON DELETE SET NULL,
    data_retirada TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    data_devolucao TIMESTAMP WITH TIME ZONE,
    condicao_retirada TEXT,
    condicao_devolucao TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.cad_equipamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipamentos_movimentacao ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Acesso equipamentos" ON public.cad_equipamentos;
CREATE POLICY "Acesso equipamentos" ON public.cad_equipamentos FOR ALL USING (true);
DROP POLICY IF EXISTS "Acesso equipamentos_movimentacao" ON public.equipamentos_movimentacao;
CREATE POLICY "Acesso equipamentos_movimentacao" ON public.equipamentos_movimentacao FOR ALL USING (true);


-- ==============================================================================
-- 2. COTAÇÕES (MÓDULO DE COMPRAS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.compras_cotacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requisicao_id UUID REFERENCES public.compras_requisicoes(id) ON DELETE CASCADE NOT NULL,
    fornecedor TEXT NOT NULL,
    valor_total NUMERIC(15, 2) NOT NULL,
    prazo_entrega_dias INTEGER,
    condicao_pagamento TEXT,
    arquivo_proposta_url TEXT,
    vencedora BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Adiciona a trava de cotação na requisição
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='compras_requisicoes' AND column_name='exige_cotacao') THEN
    ALTER TABLE public.compras_requisicoes ADD COLUMN exige_cotacao BOOLEAN DEFAULT true;
  END IF;
END $$;

ALTER TABLE public.compras_cotacoes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Acesso compras_cotacoes" ON public.compras_cotacoes;
CREATE POLICY "Acesso compras_cotacoes" ON public.compras_cotacoes FOR ALL USING (true);


-- ==============================================================================
-- 3. EMPREITEIROS (TERCEIRIZADOS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.cad_terceiros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    razao_social TEXT NOT NULL,
    cnpj TEXT UNIQUE,
    especialidade TEXT,
    contato_nome TEXT,
    contato_telefone TEXT,
    status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'bloqueado')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.obra_contratos_terceiros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    obra_id UUID REFERENCES public.obras(id) ON DELETE CASCADE NOT NULL,
    terceiro_id UUID REFERENCES public.cad_terceiros(id) ON DELETE CASCADE NOT NULL,
    descricao_servico TEXT NOT NULL,
    valor_contrato NUMERIC(15, 2),
    data_inicio DATE,
    data_fim DATE,
    anexo_contrato_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.cad_terceiros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.obra_contratos_terceiros ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Acesso cad_terceiros" ON public.cad_terceiros;
CREATE POLICY "Acesso cad_terceiros" ON public.cad_terceiros FOR ALL USING (true);
DROP POLICY IF EXISTS "Acesso obra_contratos_terceiros" ON public.obra_contratos_terceiros;
CREATE POLICY "Acesso obra_contratos_terceiros" ON public.obra_contratos_terceiros FOR ALL USING (true);
