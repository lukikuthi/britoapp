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
-- ==========================================
-- UPDATE V5 - ERP CORPORATIVO
-- Resolvendo pontas soltas operacionais
-- ==========================================

-- 1. Efetivo Terceirizado no RDO
CREATE TABLE IF NOT EXISTS public.rdo_efetivo_terceiro (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    rdo_id UUID REFERENCES public.rdos(id) ON DELETE CASCADE,
    empreiteira_id UUID REFERENCES public.cad_terceiros(id) ON DELETE CASCADE,
    quantidade_profissionais INTEGER NOT NULL DEFAULT 1,
    especialidade_atividade TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

-- 2. Manutenções de Patrimônio
CREATE TABLE IF NOT EXISTS public.patrimonio_manutencoes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    equipamento_id UUID REFERENCES public.cad_equipamentos(id) ON DELETE CASCADE,
    data_ida DATE NOT NULL DEFAULT CURRENT_DATE,
    data_retorno DATE,
    motivo TEXT NOT NULL,
    custo_reparo DECIMAL(15,2) DEFAULT 0.00,
    status TEXT CHECK (status IN ('na_oficina', 'consertado', 'sucata')) DEFAULT 'na_oficina',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

-- 3. Melhorias em Compras e Financeiro
-- Adicionando Fornecedor genérico ou ID na transação financeira para rastreio
ALTER TABLE public.fin_transacoes 
ADD COLUMN IF NOT EXISTS fornecedor TEXT;

-- Adicionando controle de recebimento na requisição de compra original
ALTER TABLE public.compras_requisicoes 
ADD COLUMN IF NOT EXISTS status_recebimento TEXT CHECK (status_recebimento IN ('pendente', 'parcial', 'recebido')) DEFAULT 'pendente',
ADD COLUMN IF NOT EXISTS data_recebimento TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS recebido_por UUID REFERENCES public.profiles(id);

-- Para evitar que exames ASO vencidos passem despercebidos, vamos garantir que a coluna status_aso exista no rh_funcionarios (já devia existir, confirmando)
-- (Já mapeada no projeto original)

-- Habilitando RLS para novas tabelas
ALTER TABLE public.rdo_efetivo_terceiro ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patrimonio_manutencoes ENABLE ROW LEVEL SECURITY;

-- Políticas super permissivas para ambiente de construtora (onde o Auth já filtra o acesso ao modulo via App)
CREATE POLICY "Permitir leitura total efetivo terceiro" ON public.rdo_efetivo_terceiro FOR SELECT USING (true);
CREATE POLICY "Permitir insercao efetivo terceiro" ON public.rdo_efetivo_terceiro FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir update efetivo terceiro" ON public.rdo_efetivo_terceiro FOR UPDATE USING (true);
CREATE POLICY "Permitir delete efetivo terceiro" ON public.rdo_efetivo_terceiro FOR DELETE USING (true);

CREATE POLICY "Permitir leitura total manutencoes" ON public.patrimonio_manutencoes FOR SELECT USING (true);
CREATE POLICY "Permitir insercao manutencoes" ON public.patrimonio_manutencoes FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir update manutencoes" ON public.patrimonio_manutencoes FOR UPDATE USING (true);
CREATE POLICY "Permitir delete manutencoes" ON public.patrimonio_manutencoes FOR DELETE USING (true);
-- ==========================================
-- UPDATE V6 - ERP BLINDADO
-- Consertando RLS e adicionando Fluxos de Negócio
-- ==========================================

-- ==========================================
-- 1. CORREÇÃO DE SEGURANÇA (RLS FALSO DO V5)
-- ==========================================
-- Remove as políticas inseguras antigas
DROP POLICY IF EXISTS "Permitir leitura total efetivo terceiro" ON public.rdo_efetivo_terceiro;
DROP POLICY IF EXISTS "Permitir insercao efetivo terceiro" ON public.rdo_efetivo_terceiro;
DROP POLICY IF EXISTS "Permitir update efetivo terceiro" ON public.rdo_efetivo_terceiro;
DROP POLICY IF EXISTS "Permitir delete efetivo terceiro" ON public.rdo_efetivo_terceiro;

DROP POLICY IF EXISTS "Permitir leitura total manutencoes" ON public.patrimonio_manutencoes;
DROP POLICY IF EXISTS "Permitir insercao manutencoes" ON public.patrimonio_manutencoes;
DROP POLICY IF EXISTS "Permitir update manutencoes" ON public.patrimonio_manutencoes;
DROP POLICY IF EXISTS "Permitir delete manutencoes" ON public.patrimonio_manutencoes;

-- Cria as políticas blindadas baseadas em módulo
CREATE POLICY "RLS_Select_Efetivo" ON public.rdo_efetivo_terceiro FOR SELECT USING (has_module_access('obras') OR has_module_access('rh'));
CREATE POLICY "RLS_Insert_Efetivo" ON public.rdo_efetivo_terceiro FOR INSERT WITH CHECK (has_module_access('obras'));
CREATE POLICY "RLS_Update_Efetivo" ON public.rdo_efetivo_terceiro FOR UPDATE USING (has_module_access('obras'));
CREATE POLICY "RLS_Delete_Efetivo" ON public.rdo_efetivo_terceiro FOR DELETE USING (has_module_access('obras'));

CREATE POLICY "RLS_Select_Manut" ON public.patrimonio_manutencoes FOR SELECT USING (has_module_access('suprimentos'));
CREATE POLICY "RLS_Insert_Manut" ON public.patrimonio_manutencoes FOR INSERT WITH CHECK (has_module_access('suprimentos'));
CREATE POLICY "RLS_Update_Manut" ON public.patrimonio_manutencoes FOR UPDATE USING (has_module_access('suprimentos'));
CREATE POLICY "RLS_Delete_Manut" ON public.patrimonio_manutencoes FOR DELETE USING (has_module_access('suprimentos'));


-- ==========================================
-- 2. RATEIO FINANCEIRO (MÚLTIPLOS CENTROS DE CUSTO)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.fin_transacoes_rateio (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    transacao_id UUID REFERENCES public.fin_transacoes(id) ON DELETE CASCADE,
    obra_id UUID REFERENCES public.obras(id) ON DELETE CASCADE, -- Centro de Custo
    valor_rateado DECIMAL(15,2) NOT NULL,
    percentual DECIMAL(5,2) NOT NULL, -- Ex: 50.00 (%)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

ALTER TABLE public.fin_transacoes_rateio ENABLE ROW LEVEL SECURITY;
CREATE POLICY "RLS_Select_Rateio" ON public.fin_transacoes_rateio FOR SELECT USING (has_module_access('financeiro'));
CREATE POLICY "RLS_Insert_Rateio" ON public.fin_transacoes_rateio FOR INSERT WITH CHECK (has_module_access('financeiro') OR has_module_access('suprimentos'));
CREATE POLICY "RLS_Update_Rateio" ON public.fin_transacoes_rateio FOR UPDATE USING (has_module_access('financeiro'));
CREATE POLICY "RLS_Delete_Rateio" ON public.fin_transacoes_rateio FOR DELETE USING (has_module_access('financeiro'));


-- ==========================================
-- 3. CONSUMO DE ESTOQUE (BAIXA DE ALMOXARIFADO)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.compras_movimentacoes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    item_id UUID REFERENCES public.compras_itens(id) ON DELETE CASCADE,
    obra_id UUID REFERENCES public.obras(id) ON DELETE SET NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('entrada', 'saida')),
    quantidade INTEGER NOT NULL,
    registrado_por UUID REFERENCES public.profiles(id),
    observacao TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

ALTER TABLE public.compras_movimentacoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "RLS_Select_MovEstoque" ON public.compras_movimentacoes FOR SELECT USING (has_module_access('suprimentos') OR has_module_access('obras'));
CREATE POLICY "RLS_Insert_MovEstoque" ON public.compras_movimentacoes FOR INSERT WITH CHECK (has_module_access('suprimentos') OR has_module_access('obras'));


-- ==========================================
-- 4. MEDIÇÃO FINANCEIRA E FATURAMENTO
-- ==========================================
CREATE TABLE IF NOT EXISTS public.obras_medicoes_clientes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    obra_id UUID REFERENCES public.obras(id) ON DELETE CASCADE,
    periodo TEXT NOT NULL, -- Ex: 'Maio/2026'
    valor DECIMAL(15,2) NOT NULL,
    descricao TEXT,
    status TEXT DEFAULT 'aguardando_faturamento' CHECK (status IN ('aguardando_faturamento', 'faturado')),
    transacao_id UUID REFERENCES public.fin_transacoes(id) ON DELETE SET NULL, -- Vinculo com o CR
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

CREATE TABLE IF NOT EXISTS public.obras_medicoes_terceiros (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    obra_id UUID REFERENCES public.obras(id) ON DELETE CASCADE,
    empreiteira_id UUID REFERENCES public.cad_terceiros(id) ON DELETE CASCADE,
    periodo TEXT NOT NULL, -- Ex: 'Maio/2026'
    valor DECIMAL(15,2) NOT NULL,
    descricao TEXT,
    status TEXT DEFAULT 'aguardando_pagamento' CHECK (status IN ('aguardando_pagamento', 'processado')),
    transacao_id UUID REFERENCES public.fin_transacoes(id) ON DELETE SET NULL, -- Vinculo com o CP
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

ALTER TABLE public.obras_medicoes_clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.obras_medicoes_terceiros ENABLE ROW LEVEL SECURITY;

CREATE POLICY "RLS_Select_MedCliente" ON public.obras_medicoes_clientes FOR SELECT USING (has_module_access('obras') OR has_module_access('financeiro'));
CREATE POLICY "RLS_Insert_MedCliente" ON public.obras_medicoes_clientes FOR INSERT WITH CHECK (has_module_access('obras'));
CREATE POLICY "RLS_Update_MedCliente" ON public.obras_medicoes_clientes FOR UPDATE USING (has_module_access('obras') OR has_module_access('financeiro'));

CREATE POLICY "RLS_Select_MedTerceiro" ON public.obras_medicoes_terceiros FOR SELECT USING (has_module_access('obras') OR has_module_access('financeiro'));
CREATE POLICY "RLS_Insert_MedTerceiro" ON public.obras_medicoes_terceiros FOR INSERT WITH CHECK (has_module_access('obras'));
CREATE POLICY "RLS_Update_MedTerceiro" ON public.obras_medicoes_terceiros FOR UPDATE USING (has_module_access('obras') OR has_module_access('financeiro'));
