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
