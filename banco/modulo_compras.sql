-- ==============================================================================
-- MÓDULO DE COMPRAS - SCHEMA
-- ==============================================================================

-- 1. TABELA DE ESTOQUE (EPIs, Ferramentas, Materiais)
CREATE TABLE public.compras_itens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    obra_id UUID REFERENCES public.obras(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL CHECK (tipo IN ('epi', 'ferramenta', 'material')),
    nome TEXT NOT NULL,
    quantidade_atual NUMERIC DEFAULT 0 NOT NULL,
    limite_minimo NUMERIC DEFAULT 0 NOT NULL,
    foto_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. TABELA DE MOVIMENTAÇÕES DE ESTOQUE
CREATE TABLE public.compras_movimentacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID REFERENCES public.compras_itens(id) ON DELETE CASCADE NOT NULL,
    quantidade NUMERIC NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('entrada', 'saida')),
    data_movimentacao TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    usuario_id UUID REFERENCES public.profiles(id),
    observacao TEXT
);

-- 3. TABELA DE CERTIFICADOS DE CALIBRAÇÃO
CREATE TABLE public.compras_certificados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID REFERENCES public.compras_itens(id) ON DELETE CASCADE NOT NULL,
    numero_certificado TEXT,
    data_emissao DATE NOT NULL,
    data_vencimento DATE NOT NULL,
    arquivo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABELA DE BOLETOS E NOTAS
CREATE TABLE public.compras_boletos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    obra_id UUID REFERENCES public.obras(id) ON DELETE CASCADE,
    fornecedor TEXT NOT NULL,
    valor NUMERIC(15,2) NOT NULL,
    data_emissao DATE,
    data_vencimento DATE NOT NULL,
    status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'cancelado')),
    arquivo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TABELA DE MENSAGENS INTERSETORIAIS (Ex: Compras <-> Diretoria)
CREATE TABLE public.mensagens_setor (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    de_modulo TEXT NOT NULL,
    para_modulo TEXT NOT NULL,
    mensagem TEXT NOT NULL,
    lida BOOLEAN DEFAULT false,
    autor_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. SEGURANÇA E RLS
ALTER TABLE public.compras_itens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compras_movimentacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compras_certificados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compras_boletos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mensagens_setor ENABLE ROW LEVEL SECURITY;

-- Políticas super permissivas para desenvolvimento inicial (Refinaremos depois com base nos AppModulos)
CREATE POLICY "Acesso total aos itens" ON public.compras_itens FOR ALL USING (true);
CREATE POLICY "Acesso total as movimentacoes" ON public.compras_movimentacoes FOR ALL USING (true);
CREATE POLICY "Acesso total aos certificados" ON public.compras_certificados FOR ALL USING (true);
CREATE POLICY "Acesso total aos boletos" ON public.compras_boletos FOR ALL USING (true);
CREATE POLICY "Acesso total as mensagens" ON public.mensagens_setor FOR ALL USING (true);

-- Notificar PostgREST
NOTIFY pgrst, 'reload schema';
