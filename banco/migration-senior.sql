-- MIGRATION: Expansão Sênior (Cronograma, RNC, FVR, Concretagem, BM)

-- Cria a função de trigger caso não exista
CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =========================================================================
-- 1. CRONOGRAMA (Adicionando datas na EAP)
-- =========================================================================

ALTER TABLE IF EXISTS public.obra_eap 
  ADD COLUMN IF NOT EXISTS data_inicio_planejada DATE,
  ADD COLUMN IF NOT EXISTS data_fim_planejada DATE;

-- =========================================================================
-- 2. RNC (Relatório de Não Conformidade)
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.obra_rnc (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  obra_id UUID NOT NULL REFERENCES public.obras(id) ON DELETE CASCADE,
  autor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  descricao TEXT NOT NULL,
  causa_raiz TEXT, -- Ex: 5 Porquês
  acao_corretiva TEXT,
  prazo_resolucao DATE,
  data_fechamento DATE,
  status TEXT NOT NULL CHECK (status IN ('aberta', 'em_andamento', 'fechada', 'cancelada')) DEFAULT 'aberta',
  foto_antes_path TEXT, -- Caminho no storage 'rnc-arquivos'
  foto_depois_path TEXT, -- Caminho no storage 'rnc-arquivos'
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

INSERT INTO storage.buckets (id, name, public) VALUES ('rnc-arquivos', 'rnc-arquivos', true) ON CONFLICT DO NOTHING;
CREATE TRIGGER update_obra_rnc_modtime BEFORE UPDATE ON public.obra_rnc FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- =========================================================================
-- 3. FVR (Ficha de Verificação de Recebimento)
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.materiais_fvr (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  obra_id UUID NOT NULL REFERENCES public.obras(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES public.materiais_itens(id) ON DELETE CASCADE,
  autor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  nota_fiscal TEXT NOT NULL,
  quantidade_recebida NUMERIC(10,2) NOT NULL,
  status_qualidade TEXT NOT NULL CHECK (status_qualidade IN ('aprovado', 'rejeitado', 'aprovado_parcial')) DEFAULT 'aprovado',
  foto_carga_path TEXT, -- Caminho no storage 'fvr-arquivos'
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

INSERT INTO storage.buckets (id, name, public) VALUES ('fvr-arquivos', 'fvr-arquivos', true) ON CONFLICT DO NOTHING;
CREATE TRIGGER update_materiais_fvr_modtime BEFORE UPDATE ON public.materiais_fvr FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- =========================================================================
-- 4. BM (Boletim de Medição)
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.obra_boletins_medicao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  obra_id UUID NOT NULL REFERENCES public.obras(id) ON DELETE CASCADE,
  autor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  empreiteiro TEXT NOT NULL,
  data_medicao DATE NOT NULL DEFAULT CURRENT_DATE,
  periodo_inicio DATE NOT NULL,
  periodo_fim DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('rascunho', 'emitido', 'aprovado', 'cancelado')) DEFAULT 'rascunho',
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.obra_boletins_itens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  boletim_id UUID NOT NULL REFERENCES public.obra_boletins_medicao(id) ON DELETE CASCADE,
  eap_id UUID NOT NULL REFERENCES public.obra_eap(id) ON DELETE CASCADE,
  avanco_medido_pct NUMERIC(5,2) NOT NULL DEFAULT 0, -- Quanto % foi feito nesse período
  valor_calculado NUMERIC(15,2), -- Opcional, se a empresa usar R$
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TRIGGER update_obra_boletins_medicao_modtime BEFORE UPDATE ON public.obra_boletins_medicao FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_obra_boletins_itens_modtime BEFORE UPDATE ON public.obra_boletins_itens FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- =========================================================================
-- 5. CONCRETAGEM (Diário e Rastreabilidade)
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.obra_concretagem (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  obra_id UUID NOT NULL REFERENCES public.obras(id) ON DELETE CASCADE,
  autor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  fornecedor TEXT NOT NULL,
  nota_fiscal TEXT NOT NULL,
  placa_caminhao TEXT NOT NULL,
  volume_m3 NUMERIC(10,2) NOT NULL,
  fck_projeto NUMERIC(10,2) NOT NULL,
  slump_test TEXT, -- Ex: 10±2
  local_lancamento TEXT NOT NULL, -- Ex: "Laje 3º Andar"
  rastreabilidade_corpos_prova JSONB, -- {"cp_7_dias": 25, "cp_28_dias": 31, "status": "aprovado"}
  status TEXT NOT NULL CHECK (status IN ('agendado', 'em_andamento', 'concluido', 'cancelado')) DEFAULT 'concluido',
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TRIGGER update_obra_concretagem_modtime BEFORE UPDATE ON public.obra_concretagem FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- =========================================================================
-- RLS (ROW LEVEL SECURITY)
-- =========================================================================

ALTER TABLE public.obra_rnc ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materiais_fvr ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.obra_boletins_medicao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.obra_boletins_itens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.obra_concretagem ENABLE ROW LEVEL SECURITY;

-- 1. RNC
CREATE POLICY "View RNC if has access" ON public.obra_rnc FOR SELECT USING (has_obra_access(obra_id, auth.uid()));
CREATE POLICY "Insert RNC if has access" ON public.obra_rnc FOR INSERT WITH CHECK (has_obra_access(obra_id, auth.uid()));
CREATE POLICY "Update/Delete RNC Admin/Autor" ON public.obra_rnc FOR ALL USING (is_admin(auth.uid()) OR autor_id = auth.uid());

-- 2. FVR
CREATE POLICY "View FVR if has access" ON public.materiais_fvr FOR SELECT USING (has_obra_access(obra_id, auth.uid()));
CREATE POLICY "Insert FVR if has access" ON public.materiais_fvr FOR INSERT WITH CHECK (has_obra_access(obra_id, auth.uid()));
CREATE POLICY "Update/Delete FVR Admin/Autor" ON public.materiais_fvr FOR ALL USING (is_admin(auth.uid()) OR autor_id = auth.uid());

-- 3. BM (Boletim de Medição)
CREATE POLICY "View BM if has access" ON public.obra_boletins_medicao FOR SELECT USING (has_obra_access(obra_id, auth.uid()));
CREATE POLICY "Insert BM if has access" ON public.obra_boletins_medicao FOR INSERT WITH CHECK (has_obra_access(obra_id, auth.uid()));
CREATE POLICY "Update/Delete BM Admin/Autor" ON public.obra_boletins_medicao FOR ALL USING (is_admin(auth.uid()) OR autor_id = auth.uid());

-- 4. BM Itens
CREATE POLICY "View BM Itens if has access" ON public.obra_boletins_itens FOR SELECT USING (
  EXISTS (SELECT 1 FROM obra_boletins_medicao b WHERE b.id = boletim_id AND has_obra_access(b.obra_id, auth.uid()))
);
CREATE POLICY "Insert BM Itens if has access" ON public.obra_boletins_itens FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM obra_boletins_medicao b WHERE b.id = boletim_id AND has_obra_access(b.obra_id, auth.uid()))
);
CREATE POLICY "Update/Delete BM Itens Admin/Autor" ON public.obra_boletins_itens FOR ALL USING (
  EXISTS (SELECT 1 FROM obra_boletins_medicao b WHERE b.id = boletim_id AND (is_admin(auth.uid()) OR b.autor_id = auth.uid()))
);

-- 5. Concretagem
CREATE POLICY "View Concretagem if has access" ON public.obra_concretagem FOR SELECT USING (has_obra_access(obra_id, auth.uid()));
CREATE POLICY "Insert Concretagem if has access" ON public.obra_concretagem FOR INSERT WITH CHECK (has_obra_access(obra_id, auth.uid()));
CREATE POLICY "Update/Delete Concretagem Admin/Autor" ON public.obra_concretagem FOR ALL USING (is_admin(auth.uid()) OR autor_id = auth.uid());

-- Storage Policies
CREATE POLICY "Ler rnc publicos" ON storage.objects FOR SELECT USING (bucket_id = 'rnc-arquivos');
CREATE POLICY "Inserir rnc autenticados" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'rnc-arquivos' AND auth.role() = 'authenticated');
CREATE POLICY "Deletar rnc autenticados" ON storage.objects FOR DELETE USING (bucket_id = 'rnc-arquivos' AND auth.role() = 'authenticated');

CREATE POLICY "Ler fvr publicos" ON storage.objects FOR SELECT USING (bucket_id = 'fvr-arquivos');
CREATE POLICY "Inserir fvr autenticados" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'fvr-arquivos' AND auth.role() = 'authenticated');
CREATE POLICY "Deletar fvr autenticados" ON storage.objects FOR DELETE USING (bucket_id = 'fvr-arquivos' AND auth.role() = 'authenticated');
