-- migration-rdo-galeria-plantas.sql

CREATE TABLE IF NOT EXISTS public.rdo_andares_selecionados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rdo_id UUID NOT NULL REFERENCES public.rdos(id) ON DELETE CASCADE,
  andar_id UUID NOT NULL REFERENCES public.torre_andares(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (rdo_id, andar_id)
);

CREATE INDEX IF NOT EXISTS idx_rdo_and_sel_rdo ON public.rdo_andares_selecionados(rdo_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rdo_andares_selecionados TO authenticated;
GRANT ALL ON public.rdo_andares_selecionados TO service_role;

ALTER TABLE public.rdo_andares_selecionados ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'rdo_andares_selecionados' AND policyname = 'Campo gerencia andares selecionados no rdo'
    ) THEN
        CREATE POLICY "Campo gerencia andares selecionados no rdo" ON public.rdo_andares_selecionados
        FOR ALL TO authenticated
        USING (EXISTS (SELECT 1 FROM public.rdos r
                       WHERE r.id = rdo_andares_selecionados.rdo_id AND public.can_edit_obra(auth.uid(), r.obra_id)))
        WITH CHECK (EXISTS (SELECT 1 FROM public.rdos r
                            WHERE r.id = rdo_andares_selecionados.rdo_id AND public.can_edit_obra(auth.uid(), r.obra_id)));
    END IF;
END $$;
