-- ============================================================
-- BRITO ENGENHARIA — Migração: Apontamentos Visuais
-- Criado em: 2026-07-06
-- Execute no SQL Editor do Supabase
-- ============================================================

-- ============================================================
-- 1. OBRA_TORRES
-- ============================================================

CREATE TABLE public.obra_torres (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  obra_id UUID NOT NULL REFERENCES public.obras(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  ordem INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_obra_torres_obra ON public.obra_torres(obra_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.obra_torres TO authenticated;
GRANT ALL ON public.obra_torres TO service_role;

ALTER TABLE public.obra_torres ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_obra_torres_updated_at
BEFORE UPDATE ON public.obra_torres
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Policies: obra_torres
CREATE POLICY "Ver torres de obras acessíveis" ON public.obra_torres
FOR SELECT TO authenticated
USING (public.has_obra_access(auth.uid(), obra_id));

CREATE POLICY "Admin gerencia torres" ON public.obra_torres
FOR ALL TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Campo gerencia torres em suas obras" ON public.obra_torres
FOR ALL TO authenticated
USING (public.can_edit_obra(auth.uid(), obra_id))
WITH CHECK (public.can_edit_obra(auth.uid(), obra_id));

-- ============================================================
-- 2. TORRE_GRUPOS_ANDAR
-- ============================================================

CREATE TABLE public.torre_grupos_andar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  torre_id UUID NOT NULL REFERENCES public.obra_torres(id) ON DELETE CASCADE,
  nome_grupo TEXT NOT NULL,
  andar_inicial INT NOT NULL,
  andar_final INT NOT NULL,
  tipo_andar TEXT NOT NULL DEFAULT 'tipo'
    CHECK (tipo_andar IN ('garagem', 'terreo', 'tipo', 'cobertura', 'comercial')),
  planta_storage_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_torre_grupos_torre ON public.torre_grupos_andar(torre_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.torre_grupos_andar TO authenticated;
GRANT ALL ON public.torre_grupos_andar TO service_role;

ALTER TABLE public.torre_grupos_andar ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_torre_grupos_andar_updated_at
BEFORE UPDATE ON public.torre_grupos_andar
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Policies: torre_grupos_andar (join back to obra_torres for obra_id)
CREATE POLICY "Ver grupos de torres acessíveis" ON public.torre_grupos_andar
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.obra_torres ot
    WHERE ot.id = torre_grupos_andar.torre_id
      AND public.has_obra_access(auth.uid(), ot.obra_id)
  )
);

CREATE POLICY "Admin gerencia grupos" ON public.torre_grupos_andar
FOR ALL TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Campo gerencia grupos em suas obras" ON public.torre_grupos_andar
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.obra_torres ot
    WHERE ot.id = torre_grupos_andar.torre_id
      AND public.can_edit_obra(auth.uid(), ot.obra_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.obra_torres ot
    WHERE ot.id = torre_grupos_andar.torre_id
      AND public.can_edit_obra(auth.uid(), ot.obra_id)
  )
);

-- ============================================================
-- 3. TORRE_ANDARES
-- ============================================================

CREATE TABLE public.torre_andares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  torre_id UUID NOT NULL REFERENCES public.obra_torres(id) ON DELETE CASCADE,
  grupo_id UUID REFERENCES public.torre_grupos_andar(id) ON DELETE CASCADE,
  numero_andar INT NOT NULL,
  apelido TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (torre_id, numero_andar)
);

CREATE INDEX idx_torre_andares_torre ON public.torre_andares(torre_id);
CREATE INDEX idx_torre_andares_grupo ON public.torre_andares(grupo_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.torre_andares TO authenticated;
GRANT ALL ON public.torre_andares TO service_role;

ALTER TABLE public.torre_andares ENABLE ROW LEVEL SECURITY;

-- Policies: torre_andares (join back to obra_torres)
CREATE POLICY "Ver andares de torres acessíveis" ON public.torre_andares
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.obra_torres ot
    WHERE ot.id = torre_andares.torre_id
      AND public.has_obra_access(auth.uid(), ot.obra_id)
  )
);

CREATE POLICY "Admin gerencia andares" ON public.torre_andares
FOR ALL TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Campo gerencia andares em suas obras" ON public.torre_andares
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.obra_torres ot
    WHERE ot.id = torre_andares.torre_id
      AND public.can_edit_obra(auth.uid(), ot.obra_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.obra_torres ot
    WHERE ot.id = torre_andares.torre_id
      AND public.can_edit_obra(auth.uid(), ot.obra_id)
  )
);

-- ============================================================
-- 4. APONTAMENTOS
-- ============================================================

CREATE TABLE public.apontamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  andar_id UUID NOT NULL REFERENCES public.torre_andares(id) ON DELETE CASCADE,
  pos_x NUMERIC(6,4) NOT NULL,
  pos_y NUMERIC(6,4) NOT NULL,
  descricao TEXT NOT NULL,
  autor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'aberto'
    CHECK (status IN ('aberto', 'resolvido')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_apontamentos_andar ON public.apontamentos(andar_id);
CREATE INDEX idx_apontamentos_status ON public.apontamentos(andar_id, status);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.apontamentos TO authenticated;
GRANT ALL ON public.apontamentos TO service_role;

ALTER TABLE public.apontamentos ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_apontamentos_updated_at
BEFORE UPDATE ON public.apontamentos
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Policies: apontamentos (join through torre_andares → obra_torres)
CREATE POLICY "Ver apontamentos de obras acessíveis" ON public.apontamentos
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.torre_andares ta
    JOIN public.obra_torres ot ON ot.id = ta.torre_id
    WHERE ta.id = apontamentos.andar_id
      AND public.has_obra_access(auth.uid(), ot.obra_id)
  )
);

CREATE POLICY "Admin gerencia apontamentos" ON public.apontamentos
FOR ALL TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Campo gerencia apontamentos em suas obras" ON public.apontamentos
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.torre_andares ta
    JOIN public.obra_torres ot ON ot.id = ta.torre_id
    WHERE ta.id = apontamentos.andar_id
      AND public.can_edit_obra(auth.uid(), ot.obra_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.torre_andares ta
    JOIN public.obra_torres ot ON ot.id = ta.torre_id
    WHERE ta.id = apontamentos.andar_id
      AND public.can_edit_obra(auth.uid(), ot.obra_id)
  )
);

-- ============================================================
-- 5. STORAGE: plantas-baixa bucket
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('plantas-baixa', 'plantas-baixa', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for plantas-baixa
-- Path convention: <obra_id>/<torre_id>/<filename>
CREATE POLICY "Storage: ver plantas de obras acessíveis"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'plantas-baixa'
  AND public.has_obra_access(auth.uid(), (split_part(name, '/', 1))::uuid)
);

CREATE POLICY "Storage: admin/campo gerencia plantas"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'plantas-baixa'
  AND public.can_edit_obra(auth.uid(), (split_part(name, '/', 1))::uuid)
);

CREATE POLICY "Storage: admin/campo atualiza plantas"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'plantas-baixa'
  AND public.can_edit_obra(auth.uid(), (split_part(name, '/', 1))::uuid)
)
WITH CHECK (
  bucket_id = 'plantas-baixa'
  AND public.can_edit_obra(auth.uid(), (split_part(name, '/', 1))::uuid)
);

CREATE POLICY "Storage: admin/campo deleta plantas"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'plantas-baixa'
  AND public.can_edit_obra(auth.uid(), (split_part(name, '/', 1))::uuid)
);
