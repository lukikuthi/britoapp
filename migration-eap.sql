-- MIGRATION EAP: Gestão de Cronograma e Medição Física
-- Criação da tabela de EAP (Estrutura Analítica do Projeto) e vínculo com RDO Atividades

CREATE TABLE IF NOT EXISTS public.obra_eap (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    obra_id UUID NOT NULL REFERENCES public.obras(id) ON DELETE CASCADE,
    codigo TEXT NOT NULL, -- Ex: "1.1", "1.1.2"
    descricao TEXT NOT NULL,
    peso_percentual NUMERIC DEFAULT 0, -- Peso dessa tarefa no total da obra (0 a 100)
    avanco_planejado NUMERIC DEFAULT 0, -- Avanço físico planejado até o momento (0 a 100)
    avanco_realizado NUMERIC DEFAULT 0, -- Avanço físico real acumulado (0 a 100)
    data_inicio_prevista DATE,
    data_fim_prevista DATE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(obra_id, codigo)
);

-- Vincular EAP ao RDO Atividades
ALTER TABLE public.rdo_atividades 
ADD COLUMN IF NOT EXISTS eap_id UUID REFERENCES public.obra_eap(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS avanco_informado NUMERIC DEFAULT 0; -- Quanto % avançou NESTE RDO

-- Habilitar RLS e criar Políticas
ALTER TABLE public.obra_eap ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acesso à EAP da Obra" ON public.obra_eap
    FOR ALL USING (public.has_obra_access(auth.uid(), obra_id));
