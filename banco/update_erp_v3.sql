-- ==============================================================================
-- UPDATE ERP V3: O Elo Perdido (Storage, Aprovações, Ponto e Integrações)
-- ==============================================================================



-- ==============================================================================
-- 2. FINANCEIRO: FLUXO DE APROVAÇÃO PELA DIRETORIA
-- ==============================================================================
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='fin_transacoes' AND column_name='status_aprovacao') THEN
    -- status_aprovacao: 'nao_requerida', 'pendente', 'aprovada', 'recusada'
    ALTER TABLE public.fin_transacoes ADD COLUMN status_aprovacao TEXT DEFAULT 'nao_requerida';
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.fin_aprovacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transacao_id UUID REFERENCES public.fin_transacoes(id) ON DELETE CASCADE NOT NULL,
    diretor_id UUID REFERENCES public.profiles(id),
    status TEXT NOT NULL CHECK (status IN ('pendente', 'aprovada', 'recusada')),
    justificativa TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.fin_aprovacoes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Acesso fin_aprovacoes" ON public.fin_aprovacoes;
CREATE POLICY "Acesso fin_aprovacoes" ON public.fin_aprovacoes FOR ALL USING (true);


-- ==============================================================================
-- 3. RECURSOS HUMANOS: APONTAMENTO DIÁRIO (PONTO DA OBRA)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.rh_ponto_diario (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    obra_id UUID REFERENCES public.obras(id) ON DELETE CASCADE NOT NULL,
    funcionario_id UUID REFERENCES public.rh_funcionarios(id) ON DELETE CASCADE NOT NULL,
    apontador_id UUID REFERENCES public.profiles(id) NOT NULL, -- Quem bateu o ponto
    data_ponto DATE NOT NULL DEFAULT CURRENT_DATE,
    presenca TEXT NOT NULL CHECK (presenca IN ('presente', 'falta_justificada', 'falta_injustificada', 'atraso', 'ferias', 'afastado')),
    horas_extras NUMERIC(4,2) DEFAULT 0,
    observacao TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(funcionario_id, data_ponto)
);

ALTER TABLE public.rh_ponto_diario ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Acesso rh_ponto_diario" ON public.rh_ponto_diario;
CREATE POLICY "Acesso rh_ponto_diario" ON public.rh_ponto_diario FOR ALL USING (true);

-- ==============================================================================
-- 4. BUCKETS DE STORAGE (Se ainda não existirem)
-- ==============================================================================
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'financeiro-anexos') THEN
    INSERT INTO storage.buckets (id, name, public) VALUES ('financeiro-anexos', 'financeiro-anexos', true);
  END IF;
END $$;

DROP POLICY IF EXISTS "Acesso publico financeiro-anexos" ON storage.objects;
CREATE POLICY "Acesso publico financeiro-anexos" ON storage.objects FOR ALL USING (bucket_id = 'financeiro-anexos');
