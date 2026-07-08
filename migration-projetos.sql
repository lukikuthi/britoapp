-- MIGRATION CDE: Common Data Environment (Controle de Projetos e Revisões)

CREATE TABLE IF NOT EXISTS public.obra_projetos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    obra_id UUID NOT NULL REFERENCES public.obras(id) ON DELETE CASCADE,
    disciplina TEXT NOT NULL, -- Ex: Arquitetura, Elétrica, Estrutural
    nome TEXT NOT NULL, -- Ex: "Prancha 01 - Térreo"
    codigo TEXT, -- Ex: "ARQ-01"
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.obra_projetos_revisoes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    projeto_id UUID NOT NULL REFERENCES public.obra_projetos(id) ON DELETE CASCADE,
    revisao TEXT NOT NULL, -- Ex: "R00", "R01", "R02"
    storage_path TEXT NOT NULL,
    is_vigente BOOLEAN DEFAULT false, -- Apenas UMA revisão por projeto pode ser vigente
    upload_por UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexação para performance
CREATE INDEX IF NOT EXISTS idx_obra_proj_obra ON public.obra_projetos(obra_id);
CREATE INDEX IF NOT EXISTS idx_obra_proj_rev_proj ON public.obra_projetos_revisoes(projeto_id);

-- RLS e Políticas
ALTER TABLE public.obra_projetos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.obra_projetos_revisoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acesso aos Projetos da Obra" ON public.obra_projetos
    FOR ALL USING (public.has_obra_access(auth.uid(), obra_id));

CREATE POLICY "Acesso às Revisões" ON public.obra_projetos_revisoes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.obra_projetos p
            WHERE p.id = obra_projetos_revisoes.projeto_id
            AND public.has_obra_access(auth.uid(), p.obra_id)
        )
    );

-- Storage (Bucket para PDF dos Projetos)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('projetos-cde', 'projetos-cde', true) 
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Projetos Upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'projetos-cde');
CREATE POLICY "Projetos Download" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'projetos-cde');
CREATE POLICY "Projetos Delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'projetos-cde');
