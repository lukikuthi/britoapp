-- ============================================================
-- BRITO ENGENHARIA — Seção Fotografia da obra (idempotente)
-- Execute no SQL Editor do Supabase após schema.sql / schema-fixes.sql
-- Armazena fotos em rdo-midias/{obra_id}/fotografia/...
-- ============================================================

CREATE TABLE IF NOT EXISTS public.obra_fotografia_itens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  obra_id UUID NOT NULL REFERENCES public.obras(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL DEFAULT '',
  descricao TEXT,
  storage_path TEXT,
  ordem INT NOT NULL DEFAULT 0,
  enviado_por UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_obra_fotografia_obra ON public.obra_fotografia_itens(obra_id, ordem);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.obra_fotografia_itens TO authenticated;
GRANT ALL ON public.obra_fotografia_itens TO service_role;

ALTER TABLE public.obra_fotografia_itens ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS trg_obra_fotografia_updated ON public.obra_fotografia_itens;
CREATE TRIGGER trg_obra_fotografia_updated
BEFORE UPDATE ON public.obra_fotografia_itens
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Policies (recria se já existirem)
DROP POLICY IF EXISTS "Ver fotografia de obras acessíveis" ON public.obra_fotografia_itens;
DROP POLICY IF EXISTS "Admin gerencia fotografia da obra" ON public.obra_fotografia_itens;
DROP POLICY IF EXISTS "Campo gerencia fotografia em obras suas" ON public.obra_fotografia_itens;

CREATE POLICY "Ver fotografia de obras acessíveis" ON public.obra_fotografia_itens
FOR SELECT TO authenticated
USING (public.has_obra_access(auth.uid(), obra_id));

CREATE POLICY "Admin gerencia fotografia da obra" ON public.obra_fotografia_itens
FOR ALL TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Campo gerencia fotografia em obras suas" ON public.obra_fotografia_itens
FOR ALL TO authenticated
USING (public.can_edit_obra(auth.uid(), obra_id))
WITH CHECK (public.can_edit_obra(auth.uid(), obra_id));
