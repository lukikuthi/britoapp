-- ============================================================
-- BRITO ENGENHARIA — Migração de Segurança e RLS
-- ============================================================

-- Habilitando RLS nas tabelas
ALTER TABLE public.obra_pavimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.obra_ambientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.obra_pendencias ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  -- ============================================================
  -- 1. OBRA_PAVIMENTOS
  -- ============================================================
  BEGIN
    CREATE POLICY "Ver pavimentos de obras acessíveis" ON public.obra_pavimentos
    FOR SELECT TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.obra_torres ot
        WHERE ot.id = obra_pavimentos.torre_id
          AND public.has_obra_access(auth.uid(), ot.obra_id)
      )
    );
  EXCEPTION WHEN duplicate_object THEN NULL; END;

  BEGIN
    CREATE POLICY "Admin gerencia pavimentos" ON public.obra_pavimentos
    FOR ALL TO authenticated
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));
  EXCEPTION WHEN duplicate_object THEN NULL; END;

  BEGIN
    CREATE POLICY "Campo gerencia pavimentos em suas obras" ON public.obra_pavimentos
    FOR ALL TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.obra_torres ot
        WHERE ot.id = obra_pavimentos.torre_id
          AND public.can_edit_obra(auth.uid(), ot.obra_id)
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.obra_torres ot
        WHERE ot.id = obra_pavimentos.torre_id
          AND public.can_edit_obra(auth.uid(), ot.obra_id)
      )
    );
  EXCEPTION WHEN duplicate_object THEN NULL; END;

  -- ============================================================
  -- 2. OBRA_AMBIENTES
  -- ============================================================
  BEGIN
    CREATE POLICY "Ver ambientes de obras acessíveis" ON public.obra_ambientes
    FOR SELECT TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.obra_pavimentos op
        JOIN public.obra_torres ot ON ot.id = op.torre_id
        WHERE op.id = obra_ambientes.pavimento_id
          AND public.has_obra_access(auth.uid(), ot.obra_id)
      )
    );
  EXCEPTION WHEN duplicate_object THEN NULL; END;

  BEGIN
    CREATE POLICY "Admin gerencia ambientes" ON public.obra_ambientes
    FOR ALL TO authenticated
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));
  EXCEPTION WHEN duplicate_object THEN NULL; END;

  BEGIN
    CREATE POLICY "Campo gerencia ambientes em suas obras" ON public.obra_ambientes
    FOR ALL TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.obra_pavimentos op
        JOIN public.obra_torres ot ON ot.id = op.torre_id
        WHERE op.id = obra_ambientes.pavimento_id
          AND public.can_edit_obra(auth.uid(), ot.obra_id)
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.obra_pavimentos op
        JOIN public.obra_torres ot ON ot.id = op.torre_id
        WHERE op.id = obra_ambientes.pavimento_id
          AND public.can_edit_obra(auth.uid(), ot.obra_id)
      )
    );
  EXCEPTION WHEN duplicate_object THEN NULL; END;

  -- ============================================================
  -- 3. OBRA_PENDENCIAS
  -- ============================================================
  BEGIN
    CREATE POLICY "Ver pendencias de obras acessíveis" ON public.obra_pendencias
    FOR SELECT TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.obra_ambientes oa
        JOIN public.obra_pavimentos op ON op.id = oa.pavimento_id
        JOIN public.obra_torres ot ON ot.id = op.torre_id
        WHERE oa.id = obra_pendencias.ambiente_id
          AND public.has_obra_access(auth.uid(), ot.obra_id)
      )
    );
  EXCEPTION WHEN duplicate_object THEN NULL; END;

  BEGIN
    CREATE POLICY "Admin gerencia pendencias" ON public.obra_pendencias
    FOR ALL TO authenticated
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));
  EXCEPTION WHEN duplicate_object THEN NULL; END;

  BEGIN
    CREATE POLICY "Campo gerencia pendencias em suas obras" ON public.obra_pendencias
    FOR ALL TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.obra_ambientes oa
        JOIN public.obra_pavimentos op ON op.id = oa.pavimento_id
        JOIN public.obra_torres ot ON ot.id = op.torre_id
        WHERE oa.id = obra_pendencias.ambiente_id
          AND public.can_edit_obra(auth.uid(), ot.obra_id)
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.obra_ambientes oa
        JOIN public.obra_pavimentos op ON op.id = oa.pavimento_id
        JOIN public.obra_torres ot ON ot.id = op.torre_id
        WHERE oa.id = obra_pendencias.ambiente_id
          AND public.can_edit_obra(auth.uid(), ot.obra_id)
      )
    );
  EXCEPTION WHEN duplicate_object THEN NULL; END;
END $$;
