-- ==============================================================================
-- MÓDULO DE PATRIMÔNIO E EQUIPAMENTOS (V4)
-- ==============================================================================

-- 1. Cadastro de Equipamentos/Ferramentas
CREATE TABLE IF NOT EXISTS public.cad_equipamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    codigo_patrimonio TEXT UNIQUE, -- Ex: PAT-001
    tipo TEXT NOT NULL CHECK (tipo IN ('ferramenta', 'maquina_leve', 'maquina_pesada', 'veiculo', 'tecnologia')),
    status TEXT NOT NULL DEFAULT 'disponivel' CHECK (status IN ('disponivel', 'em_uso', 'manutencao', 'baixado')),
    valor_aquisicao NUMERIC(15, 2),
    data_aquisicao DATE,
    vida_util_meses INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Movimentação de Equipamentos (Onde está o equipamento?)
CREATE TABLE IF NOT EXISTS public.equipamentos_movimentacao (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    equipamento_id UUID REFERENCES public.cad_equipamentos(id) ON DELETE CASCADE NOT NULL,
    obra_id UUID REFERENCES public.obras(id) ON DELETE SET NULL, -- Se NULL, está na matriz/galpão
    responsavel_id UUID REFERENCES public.rh_funcionarios(id) ON DELETE SET NULL, -- Quem retirou
    data_retirada TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    data_devolucao TIMESTAMP WITH TIME ZONE,
    condicao_retirada TEXT,
    condicao_devolucao TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Manutenções
CREATE TABLE IF NOT EXISTS public.equipamentos_manutencao (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    equipamento_id UUID REFERENCES public.cad_equipamentos(id) ON DELETE CASCADE NOT NULL,
    descricao TEXT NOT NULL,
    custo NUMERIC(15, 2),
    data_inicio DATE NOT NULL,
    data_fim DATE,
    oficina_fornecedor TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS
ALTER TABLE public.cad_equipamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipamentos_movimentacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipamentos_manutencao ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Acesso equipamentos" ON public.cad_equipamentos;
CREATE POLICY "Acesso equipamentos" ON public.cad_equipamentos FOR ALL USING (true);

DROP POLICY IF EXISTS "Acesso equipamentos_movimentacao" ON public.equipamentos_movimentacao;
CREATE POLICY "Acesso equipamentos_movimentacao" ON public.equipamentos_movimentacao FOR ALL USING (true);

DROP POLICY IF EXISTS "Acesso equipamentos_manutencao" ON public.equipamentos_manutencao;
CREATE POLICY "Acesso equipamentos_manutencao" ON public.equipamentos_manutencao FOR ALL USING (true);
