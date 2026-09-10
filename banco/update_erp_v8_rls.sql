-- ==========================================
-- UPDATE ERP V8 - RLS E POLÍTICAS DE SEGURANÇA
-- ==========================================

-- Habilitar RLS nas novas tabelas da V8
ALTER TABLE public.compras_fornecedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compras_pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compras_pedidos_itens ENABLE ROW LEVEL SECURITY;

-- Criar políticas (Super permissivas para desenvolvimento inicial, igual ao restante do módulo de compras)
CREATE POLICY "Acesso total aos fornecedores" ON public.compras_fornecedores FOR ALL USING (true);
CREATE POLICY "Acesso total aos pedidos" ON public.compras_pedidos FOR ALL USING (true);
CREATE POLICY "Acesso total aos itens dos pedidos" ON public.compras_pedidos_itens FOR ALL USING (true);

-- Recarregar o schema do Supabase (Opcional)
NOTIFY pgrst, 'reload schema';
