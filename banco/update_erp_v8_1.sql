-- ==========================================================
-- UPDATE ERP V8.1 — PEDIDO DE COMPRA FIEL À PLANILHA BRITO
-- ==========================================================

-- 1. TABELA OBRAS — DADOS PARA FATURAMENTO (10 campos)
ALTER TABLE public.obras
ADD COLUMN IF NOT EXISTS faturamento_razao_social TEXT,
ADD COLUMN IF NOT EXISTS faturamento_cnpj TEXT,
ADD COLUMN IF NOT EXISTS faturamento_cno TEXT,
ADD COLUMN IF NOT EXISTS faturamento_endereco TEXT,
ADD COLUMN IF NOT EXISTS faturamento_bairro TEXT,
ADD COLUMN IF NOT EXISTS faturamento_municipio TEXT,
ADD COLUMN IF NOT EXISTS faturamento_cep TEXT,
ADD COLUMN IF NOT EXISTS faturamento_inscricao_estadual TEXT,
ADD COLUMN IF NOT EXISTS faturamento_telefone TEXT,
ADD COLUMN IF NOT EXISTS faturamento_contato TEXT;

-- 2. TABELA OBRAS — DADOS PARA COBRANÇA (10 campos)
ALTER TABLE public.obras
ADD COLUMN IF NOT EXISTS cobranca_razao_social TEXT,
ADD COLUMN IF NOT EXISTS cobranca_cnpj TEXT,
ADD COLUMN IF NOT EXISTS cobranca_cno TEXT,
ADD COLUMN IF NOT EXISTS cobranca_endereco TEXT,
ADD COLUMN IF NOT EXISTS cobranca_bairro TEXT,
ADD COLUMN IF NOT EXISTS cobranca_municipio TEXT,
ADD COLUMN IF NOT EXISTS cobranca_cep TEXT,
ADD COLUMN IF NOT EXISTS cobranca_inscricao_estadual TEXT,
ADD COLUMN IF NOT EXISTS cobranca_telefone TEXT,
ADD COLUMN IF NOT EXISTS cobranca_contato TEXT;

-- 3. TABELA OBRAS — DADOS PARA ENTREGA (complementar)
ALTER TABLE public.obras
ADD COLUMN IF NOT EXISTS entrega_cno TEXT,
ADD COLUMN IF NOT EXISTS entrega_bairro TEXT,
ADD COLUMN IF NOT EXISTS entrega_cep TEXT,
ADD COLUMN IF NOT EXISTS entrega_telefone TEXT,
ADD COLUMN IF NOT EXISTS entrega_contato TEXT;

-- 4. TABELA FORNECEDORES — INSCRIÇÃO ESTADUAL
ALTER TABLE public.compras_fornecedores
ADD COLUMN IF NOT EXISTS inscricao_estadual TEXT;

-- 5. TABELA PEDIDOS — CAMPOS COMERCIAIS
ALTER TABLE public.compras_pedidos
ADD COLUMN IF NOT EXISTS valor_frete NUMERIC(15,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS outras_despesas NUMERIC(15,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS valor_seguro NUMERIC(15,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS prazo_entrega TEXT DEFAULT 'imediato após aprovação',
ADD COLUMN IF NOT EXISTS condicoes_pagamento TEXT DEFAULT '28 DDL',
ADD COLUMN IF NOT EXISTS autorizador TEXT,
ADD COLUMN IF NOT EXISTS observacoes TEXT;

-- Notificar PostgREST para recarregar schema
NOTIFY pgrst, 'reload schema';
