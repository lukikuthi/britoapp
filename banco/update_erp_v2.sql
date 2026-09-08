-- ==============================================================================
-- UPDATE ERP V2: Notificações, Storage, Financeiro e Requisições
-- ==============================================================================

-- 1. NOTIFICAÇÕES (O Sino Realtime)
CREATE TABLE IF NOT EXISTS public.notificacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    modulo_alvo TEXT NOT NULL,          -- Ex: 'diretoria', 'compras'
    titulo TEXT NOT NULL,
    mensagem TEXT NOT NULL,
    lida BOOLEAN DEFAULT false,
    link_url TEXT,                      -- Ex: '/compras?tab=requisicoes'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.notificacoes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Acesso as notificacoes" ON public.notificacoes;
CREATE POLICY "Acesso as notificacoes" ON public.notificacoes FOR ALL USING (true);


-- 2. FINANCEIRO: CATEGORIAS (DRE) E LOGS (TIMELINE)
CREATE TABLE IF NOT EXISTS public.fin_categorias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('despesa', 'receita')),
    cor TEXT DEFAULT 'bg-gray-100 text-gray-700'
);

-- Popular categorias base apenas se tabela estiver vazia
INSERT INTO public.fin_categorias (nome, tipo, cor)
SELECT 'Material de Construção', 'despesa', 'bg-amber-100 text-amber-700 border-amber-300'
WHERE NOT EXISTS (SELECT 1 FROM public.fin_categorias);

INSERT INTO public.fin_categorias (nome, tipo, cor)
SELECT 'Folha de Pagamento', 'despesa', 'bg-purple-100 text-purple-700 border-purple-300'
WHERE NOT EXISTS (SELECT 1 FROM public.fin_categorias WHERE nome = 'Folha de Pagamento');

INSERT INTO public.fin_categorias (nome, tipo, cor)
SELECT 'Impostos', 'despesa', 'bg-red-100 text-red-700 border-red-300'
WHERE NOT EXISTS (SELECT 1 FROM public.fin_categorias WHERE nome = 'Impostos');

INSERT INTO public.fin_categorias (nome, tipo, cor)
SELECT 'Equipamentos / Máquinas', 'despesa', 'bg-orange-100 text-orange-700 border-orange-300'
WHERE NOT EXISTS (SELECT 1 FROM public.fin_categorias WHERE nome = 'Equipamentos / Máquinas');

INSERT INTO public.fin_categorias (nome, tipo, cor)
SELECT 'Administrativo / Escritório', 'despesa', 'bg-slate-100 text-slate-700 border-slate-300'
WHERE NOT EXISTS (SELECT 1 FROM public.fin_categorias WHERE nome = 'Administrativo / Escritório');

INSERT INTO public.fin_categorias (nome, tipo, cor)
SELECT 'Recebimento Cliente', 'receita', 'bg-emerald-100 text-emerald-700 border-emerald-300'
WHERE NOT EXISTS (SELECT 1 FROM public.fin_categorias WHERE nome = 'Recebimento Cliente');

-- Atualizar fin_transacoes (seguro com DO block)
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='fin_transacoes' AND column_name='categoria_id') THEN
    ALTER TABLE public.fin_transacoes ADD COLUMN categoria_id UUID REFERENCES public.fin_categorias(id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='fin_transacoes' AND column_name='valor_pago') THEN
    ALTER TABLE public.fin_transacoes ADD COLUMN valor_pago NUMERIC(15,2) DEFAULT 0.00;
  END IF;
END $$;

-- Logs da transação (Timeline)
CREATE TABLE IF NOT EXISTS public.fin_transacoes_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transacao_id UUID REFERENCES public.fin_transacoes(id) ON DELETE CASCADE NOT NULL,
    autor_id UUID REFERENCES public.profiles(id),
    mensagem TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.fin_categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fin_transacoes_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Acesso categorias" ON public.fin_categorias;
DROP POLICY IF EXISTS "Acesso logs fin" ON public.fin_transacoes_logs;
CREATE POLICY "Acesso categorias" ON public.fin_categorias FOR ALL USING (true);
CREATE POLICY "Acesso logs fin" ON public.fin_transacoes_logs FOR ALL USING (true);


-- 3. REQUISIÇÕES DE MATERIAL (OBRAS -> COMPRAS)
CREATE TABLE IF NOT EXISTS public.compras_requisicoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    obra_id UUID REFERENCES public.obras(id) ON DELETE CASCADE NOT NULL,
    autor_id UUID REFERENCES public.profiles(id),
    status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'cotacao', 'aprovado', 'recusado', 'entregue')),
    observacao TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.compras_requisicoes_itens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requisicao_id UUID REFERENCES public.compras_requisicoes(id) ON DELETE CASCADE NOT NULL,
    nome_item TEXT NOT NULL,
    quantidade NUMERIC NOT NULL,
    unidade TEXT DEFAULT 'un'
);

ALTER TABLE public.compras_requisicoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compras_requisicoes_itens ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Acesso requisicoes" ON public.compras_requisicoes;
DROP POLICY IF EXISTS "Acesso itens req" ON public.compras_requisicoes_itens;
CREATE POLICY "Acesso requisicoes" ON public.compras_requisicoes FOR ALL USING (true);
CREATE POLICY "Acesso itens req" ON public.compras_requisicoes_itens FOR ALL USING (true);


-- 4. RECURSOS HUMANOS (ALOCAÇÃO NA OBRA)
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='rh_funcionarios' AND column_name='obra_id') THEN
    ALTER TABLE public.rh_funcionarios ADD COLUMN obra_id UUID REFERENCES public.obras(id) ON DELETE SET NULL;
  END IF;
END $$;


-- 5. SUPABASE STORAGE (BUCKETS DE ARQUIVOS)
-- Criamos 3 buckets para organizar os uploads
INSERT INTO storage.buckets (id, name, public) VALUES 
('financeiro-anexos', 'financeiro-anexos', true),
('rh-anexos', 'rh-anexos', true),
('compras-anexos', 'compras-anexos', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de acesso público total (para MVP, refinar em produção)
CREATE POLICY "Acesso Publico Financeiro" ON storage.objects FOR ALL USING (bucket_id = 'financeiro-anexos');
CREATE POLICY "Acesso Publico RH" ON storage.objects FOR ALL USING (bucket_id = 'rh-anexos');
CREATE POLICY "Acesso Publico Compras" ON storage.objects FOR ALL USING (bucket_id = 'compras-anexos');


-- 6. HABILITAR REALTIME (Para o Sino funcionar)
-- Configurando o canal de realtime para as tabelas essenciais
begin;
  -- Verifica se a publicação existe, senão cria
  do $$ 
  begin
    if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
      create publication supabase_realtime;
    end if;
  end $$;
  -- Adiciona as tabelas ao realtime
  alter publication supabase_realtime add table public.notificacoes;
  alter publication supabase_realtime add table public.mensagens_setor;
  alter publication supabase_realtime add table public.compras_requisicoes;
commit;

-- Recarregar schema da API
NOTIFY pgrst, 'reload schema';
