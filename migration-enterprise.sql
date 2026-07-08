-- MIGRATION: Expansão Enterprise (Materiais, Laudos e SESMT)

-- Cria a função de trigger caso não exista
CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =========================================================================
-- 1. MÓDULO DE MATERIAIS (Requisição de Materiais - RM)
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.materiais_requisicoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  obra_id UUID NOT NULL REFERENCES public.obras(id) ON DELETE CASCADE,
  autor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  numero_sequencial SERIAL,
  status TEXT NOT NULL CHECK (status IN ('rascunho', 'solicitado', 'aprovado', 'comprado', 'entregue', 'cancelado')) DEFAULT 'rascunho',
  prioridade TEXT NOT NULL CHECK (prioridade IN ('baixa', 'normal', 'alta', 'urgente')) DEFAULT 'normal',
  data_necessidade DATE,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.materiais_itens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requisicao_id UUID NOT NULL REFERENCES public.materiais_requisicoes(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  quantidade NUMERIC(10,2) NOT NULL,
  unidade TEXT NOT NULL, -- un, m, kg, cx, rolo, etc.
  status TEXT NOT NULL CHECK (status IN ('pendente', 'comprado', 'entregue', 'cancelado')) DEFAULT 'pendente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================================
-- 2. MÓDULO DE COMISSIONAMENTO E ENSAIOS (Laudos)
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.laudos_ensaios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  obra_id UUID NOT NULL REFERENCES public.obras(id) ON DELETE CASCADE,
  disciplina TEXT NOT NULL CHECK (disciplina IN ('eletrica', 'civil', 'hidraulica', 'incendio', 'climatizacao', 'outro')),
  tipo_ensaio TEXT NOT NULL, -- ex: "Megômetro", "Resistência de Aterramento", "Slump Test"
  arquivo_path TEXT NOT NULL, -- Caminho no storage 'laudos-ensaios'
  data_ensaio DATE NOT NULL,
  status_aprovacao TEXT NOT NULL CHECK (status_aprovacao IN ('pendente', 'aprovado', 'reprovado')) DEFAULT 'pendente',
  aprovado_por UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Novo bucket para os Laudos
INSERT INTO storage.buckets (id, name, public) VALUES ('laudos-ensaios', 'laudos-ensaios', true) ON CONFLICT DO NOTHING;

-- =========================================================================
-- 3. MÓDULO DE SEGURANÇA DO TRABALHO (SESMT)
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.sesmt_dds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  obra_id UUID NOT NULL REFERENCES public.obras(id) ON DELETE CASCADE,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  tema TEXT NOT NULL,
  instrutor TEXT NOT NULL,
  arquivo_lista_presenca TEXT, -- Caminho no storage 'sesmt-arquivos'
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.sesmt_epis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  obra_id UUID NOT NULL REFERENCES public.obras(id) ON DELETE CASCADE,
  funcionario TEXT NOT NULL,
  equipamento TEXT NOT NULL,
  ca_numero TEXT,
  data_entrega DATE NOT NULL DEFAULT CURRENT_DATE,
  data_devolucao DATE,
  termo_assinado_path TEXT, -- Caminho no storage 'sesmt-arquivos'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Novo bucket para Arquivos de Segurança (DDS, Fichas EPI)
INSERT INTO storage.buckets (id, name, public) VALUES ('sesmt-arquivos', 'sesmt-arquivos', true) ON CONFLICT DO NOTHING;

-- =========================================================================
-- TRIGGERS DE UPDATED_AT
-- =========================================================================

CREATE TRIGGER update_materiais_req_modtime BEFORE UPDATE ON public.materiais_requisicoes FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_materiais_itens_modtime BEFORE UPDATE ON public.materiais_itens FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_laudos_ensaios_modtime BEFORE UPDATE ON public.laudos_ensaios FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_sesmt_dds_modtime BEFORE UPDATE ON public.sesmt_dds FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_sesmt_epis_modtime BEFORE UPDATE ON public.sesmt_epis FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- =========================================================================
-- RLS (ROW LEVEL SECURITY)
-- Padrão: Todos que têm acesso à obra podem VER e INSERIR. 
-- Atualizar e Excluir depende do has_obra_access ou is_admin.
-- =========================================================================

ALTER TABLE public.materiais_requisicoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materiais_itens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.laudos_ensaios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sesmt_dds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sesmt_epis ENABLE ROW LEVEL SECURITY;

-- 1. Materiais Requisicoes
CREATE POLICY "View MR if has access" ON public.materiais_requisicoes FOR SELECT USING (has_obra_access(obra_id, auth.uid()));
CREATE POLICY "Insert MR if has access" ON public.materiais_requisicoes FOR INSERT WITH CHECK (has_obra_access(obra_id, auth.uid()));
CREATE POLICY "Update MR Se admin ou autor" ON public.materiais_requisicoes FOR UPDATE USING (is_admin(auth.uid()) OR autor_id = auth.uid());
CREATE POLICY "Delete MR se admin ou autor" ON public.materiais_requisicoes FOR DELETE USING (is_admin(auth.uid()) OR autor_id = auth.uid());

-- 2. Materiais Itens
CREATE POLICY "View Itens se tem acesso a obra" ON public.materiais_itens FOR SELECT USING (
  EXISTS (SELECT 1 FROM materiais_requisicoes r WHERE r.id = requisicao_id AND has_obra_access(r.obra_id, auth.uid()))
);
CREATE POLICY "Insert Itens se tem acesso" ON public.materiais_itens FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM materiais_requisicoes r WHERE r.id = requisicao_id AND has_obra_access(r.obra_id, auth.uid()))
);
CREATE POLICY "Update/Delete Itens se admin ou autor" ON public.materiais_itens FOR ALL USING (
  EXISTS (SELECT 1 FROM materiais_requisicoes r WHERE r.id = requisicao_id AND (is_admin(auth.uid()) OR r.autor_id = auth.uid()))
);

-- 3. Laudos
CREATE POLICY "View Laudos if has access" ON public.laudos_ensaios FOR SELECT USING (has_obra_access(obra_id, auth.uid()));
CREATE POLICY "Insert Laudos if has access" ON public.laudos_ensaios FOR INSERT WITH CHECK (has_obra_access(obra_id, auth.uid()));
CREATE POLICY "Update/Delete Laudos Admin" ON public.laudos_ensaios FOR ALL USING (is_admin(auth.uid()));

-- 4. SESMT DDS
CREATE POLICY "View DDS if has access" ON public.sesmt_dds FOR SELECT USING (has_obra_access(obra_id, auth.uid()));
CREATE POLICY "Insert DDS if has access" ON public.sesmt_dds FOR INSERT WITH CHECK (has_obra_access(obra_id, auth.uid()));
CREATE POLICY "Update/Delete DDS Admin" ON public.sesmt_dds FOR ALL USING (is_admin(auth.uid()));

-- 5. SESMT EPIs
CREATE POLICY "View EPIs if has access" ON public.sesmt_epis FOR SELECT USING (has_obra_access(obra_id, auth.uid()));
CREATE POLICY "Insert EPIs if has access" ON public.sesmt_epis FOR INSERT WITH CHECK (has_obra_access(obra_id, auth.uid()));
CREATE POLICY "Update/Delete EPIs Admin" ON public.sesmt_epis FOR ALL USING (is_admin(auth.uid()));

-- Storage Policies para laudos-ensaios
CREATE POLICY "Ler laudos publicos" ON storage.objects FOR SELECT USING (bucket_id = 'laudos-ensaios');
CREATE POLICY "Inserir laudos autenticados" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'laudos-ensaios' AND auth.role() = 'authenticated');
CREATE POLICY "Deletar laudos autenticados" ON storage.objects FOR DELETE USING (bucket_id = 'laudos-ensaios' AND auth.role() = 'authenticated');

-- Storage Policies para sesmt-arquivos
CREATE POLICY "Ler sesmt publicos" ON storage.objects FOR SELECT USING (bucket_id = 'sesmt-arquivos');
CREATE POLICY "Inserir sesmt autenticados" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'sesmt-arquivos' AND auth.role() = 'authenticated');
CREATE POLICY "Deletar sesmt autenticados" ON storage.objects FOR DELETE USING (bucket_id = 'sesmt-arquivos' AND auth.role() = 'authenticated');
