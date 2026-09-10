-- ==========================================
-- UPDATE ERP V8 - AUTOMAÇÃO DE COMPRAS
-- ==========================================

-- 1. FORNECEDORES
CREATE TABLE IF NOT EXISTS public.compras_fornecedores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    razao_social TEXT NOT NULL,
    cnpj TEXT,
    endereco TEXT,
    bairro TEXT,
    municipio TEXT,
    cep TEXT,
    telefone TEXT,
    contato TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. PEDIDOS DE COMPRA
CREATE TABLE IF NOT EXISTS public.compras_pedidos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_pedido TEXT NOT NULL,
    numero_orcamento TEXT,
    obra_id UUID REFERENCES public.obras(id) ON DELETE CASCADE,
    fornecedor_id UUID REFERENCES public.compras_fornecedores(id) ON DELETE SET NULL,
    data_pedido DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'entregue', 'cancelado')),
    valor_total NUMERIC(15,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ITENS DO PEDIDO
CREATE TABLE IF NOT EXISTS public.compras_pedidos_itens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pedido_id UUID REFERENCES public.compras_pedidos(id) ON DELETE CASCADE NOT NULL,
    descricao TEXT NOT NULL,
    quantidade NUMERIC NOT NULL DEFAULT 1,
    unidade TEXT DEFAULT 'un',
    valor_unitario NUMERIC(15,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. ADAPTAÇÃO DA TABELA DE ESTOQUE (PARA IMPORTAÇÃO DO EXCEL)
ALTER TABLE public.compras_itens 
ADD COLUMN IF NOT EXISTS patrimonio TEXT,
ADD COLUMN IF NOT EXISTS data_compra DATE,
ADD COLUMN IF NOT EXISTS nf TEXT,
ADD COLUMN IF NOT EXISTS valor_equipamento NUMERIC(15,2),
ADD COLUMN IF NOT EXISTS fornecedor_nome TEXT,
ADD COLUMN IF NOT EXISTS num_pedido TEXT;
