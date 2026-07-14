-- =========================================================================
-- MIGRATION: Medição de Campo (Coleta de Quantidades)
-- Executar no SQL Editor do Supabase
-- =========================================================================

-- 1. Itens de serviço da obra (importados da planilha)
CREATE TABLE IF NOT EXISTS public.obra_medicao_itens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  obra_id UUID NOT NULL REFERENCES public.obras(id) ON DELETE CASCADE,
  numero_item INTEGER NOT NULL,
  descricao TEXT NOT NULL,
  quantidade_total NUMERIC(10,2) NOT NULL,
  grupo TEXT,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(obra_id, numero_item)
);

-- 2. Medições individuais (até 30 por item)
CREATE TABLE IF NOT EXISTS public.obra_medicoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES public.obra_medicao_itens(id) ON DELETE CASCADE,
  numero_medicao INTEGER NOT NULL CHECK (numero_medicao BETWEEN 1 AND 30),
  data_referencia TEXT,
  quantidade_executada NUMERIC(10,2) NOT NULL CHECK (quantidade_executada >= 0),
  criado_por UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(item_id, numero_medicao)
);

-- Triggers de updated_at
CREATE TRIGGER update_obra_medicao_itens_modtime
  BEFORE UPDATE ON public.obra_medicao_itens
  FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

-- Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON public.obra_medicao_itens TO authenticated;
GRANT ALL ON public.obra_medicao_itens TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.obra_medicoes TO authenticated;
GRANT ALL ON public.obra_medicoes TO service_role;

-- RLS
ALTER TABLE public.obra_medicao_itens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.obra_medicoes ENABLE ROW LEVEL SECURITY;

-- Itens: visíveis por quem tem acesso à obra
CREATE POLICY "View medicao items if has access"
  ON public.obra_medicao_itens FOR SELECT
  USING (has_obra_access(auth.uid(), obra_id));

CREATE POLICY "Insert medicao items if can edit"
  ON public.obra_medicao_itens FOR INSERT
  WITH CHECK (can_edit_obra(auth.uid(), obra_id));

CREATE POLICY "Update medicao items if can edit"
  ON public.obra_medicao_itens FOR UPDATE
  USING (can_edit_obra(auth.uid(), obra_id));

CREATE POLICY "Delete medicao items if can edit"
  ON public.obra_medicao_itens FOR DELETE
  USING (can_edit_obra(auth.uid(), obra_id));

-- Medições: visíveis por quem tem acesso à obra do item
CREATE POLICY "View medicoes if has access"
  ON public.obra_medicoes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.obra_medicao_itens i
      WHERE i.id = item_id AND has_obra_access(auth.uid(), i.obra_id)
    )
  );

CREATE POLICY "Insert medicoes if can edit"
  ON public.obra_medicoes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.obra_medicao_itens i
      WHERE i.id = item_id AND can_edit_obra(auth.uid(), i.obra_id)
    )
  );

CREATE POLICY "Update medicoes if can edit"
  ON public.obra_medicoes FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.obra_medicao_itens i
      WHERE i.id = item_id AND can_edit_obra(auth.uid(), i.obra_id)
    )
  );

CREATE POLICY "Delete medicoes if can edit"
  ON public.obra_medicoes FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.obra_medicao_itens i
      WHERE i.id = item_id AND can_edit_obra(auth.uid(), i.obra_id)
    )
  );
