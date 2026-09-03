-- ==============================================================================
-- MÓDULO FINANCEIRO - SCHEMA & SECURITY
-- ==============================================================================

-- 1. CONTAS BANCÁRIAS (Onde o dinheiro da empresa está guardado)
CREATE TABLE public.fin_contas_bancarias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_banco TEXT NOT NULL,
    titular TEXT NOT NULL,
    agencia TEXT,
    conta TEXT,
    saldo_atual NUMERIC(15, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. TRANSAÇÕES (Contas a Pagar e Contas a Receber)
CREATE TABLE public.fin_transacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo TEXT NOT NULL CHECK (tipo IN ('pagar', 'receber')),
    descricao TEXT NOT NULL,
    fornecedor_cliente TEXT NOT NULL,
    valor NUMERIC(15, 2) NOT NULL,
    data_vencimento DATE NOT NULL,
    data_pagamento DATE,
    status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'cancelado')),
    obra_id UUID REFERENCES public.obras(id) ON DELETE SET NULL,
    conta_bancaria_id UUID REFERENCES public.fin_contas_bancarias(id) ON DELETE SET NULL,
    boleto_compras_id UUID REFERENCES public.compras_boletos(id) ON DELETE SET NULL, -- Integração direta com setor de Compras
    anexo_nf_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. CONCILIAÇÃO BANCÁRIA (Importação de Extrato)
CREATE TABLE public.fin_conciliacao (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conta_bancaria_id UUID REFERENCES public.fin_contas_bancarias(id) ON DELETE CASCADE NOT NULL,
    data_lancamento DATE NOT NULL,
    descricao_extrato TEXT NOT NULL,
    valor NUMERIC(15, 2) NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('entrada', 'saida')),
    conciliado BOOLEAN DEFAULT false,
    transacao_vinculada_id UUID REFERENCES public.fin_transacoes(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- PROTEÇÃO BLINDADA (ROW LEVEL SECURITY)
-- ==============================================================================
ALTER TABLE public.fin_contas_bancarias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fin_transacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fin_conciliacao ENABLE ROW LEVEL SECURITY;

-- Aplicando a função de segurança 'has_module_access' (criada na fase do RH)
-- Ninguém acessa dinheiro se não tiver permissão de 'financeiro' ou se não for admin
CREATE POLICY "Acesso Financeiro Contas Bancarias" ON public.fin_contas_bancarias FOR ALL USING (public.has_module_access('financeiro'));
CREATE POLICY "Acesso Financeiro Transacoes" ON public.fin_transacoes FOR ALL USING (public.has_module_access('financeiro'));
CREATE POLICY "Acesso Financeiro Conciliacao" ON public.fin_conciliacao FOR ALL USING (public.has_module_access('financeiro'));

-- Apenas a título de integração: O módulo da Diretoria no futuro fará leitura unificada,
-- mas usaremos Views ou estenderemos a política para 'diretoria' apenas de SELECT caso necessário.

-- 4. BUCKET PARA NOTAS FISCAIS
INSERT INTO storage.buckets (id, name, public)
VALUES ('documentos_financeiro', 'documentos_financeiro', true)
ON CONFLICT (id) DO NOTHING;

-- Notificar PostgREST
NOTIFY pgrst, 'reload schema';
