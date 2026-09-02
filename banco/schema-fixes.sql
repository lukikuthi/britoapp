-- ============================================================
-- BRITO ENGENHARIA — correções idempotentes (execute após schema.sql)
-- Garante buckets de Storage e policies de INSERT para mídias/anexos.
-- Seguro para rodar mais de uma vez.
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES
  ('obra-capas', 'obra-capas', false),
  ('rdo-midias', 'rdo-midias', false),
  ('rdo-anexos', 'rdo-anexos', false)
ON CONFLICT (id) DO NOTHING;

-- Remove policies antigas com os mesmos nomes (se existirem) e recria
DO $do$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname IN (
        'Storage: ver capa de obras acessíveis',
        'Storage: admin/campo gerencia capa',
        'Storage: ver mídias de obras acessíveis',
        'Storage: admin/campo gerencia mídias',
        'Storage: ver anexos de obras acessíveis',
        'Storage: admin/campo gerencia anexos'
      )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
  END LOOP;
END
$do$;

-- obra-capas
CREATE POLICY "Storage: ver capa de obras acessíveis"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'obra-capas'
  AND public.has_obra_access(auth.uid(), (split_part(name, '/', 1))::uuid)
);

CREATE POLICY "Storage: admin/campo gerencia capa"
ON storage.objects FOR ALL TO authenticated
USING (
  bucket_id = 'obra-capas'
  AND public.can_edit_obra(auth.uid(), (split_part(name, '/', 1))::uuid)
)
WITH CHECK (
  bucket_id = 'obra-capas'
  AND public.can_edit_obra(auth.uid(), (split_part(name, '/', 1))::uuid)
);

-- rdo-midias (fotos e vídeos)
CREATE POLICY "Storage: ver mídias de obras acessíveis"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'rdo-midias'
  AND public.has_obra_access(auth.uid(), (split_part(name, '/', 1))::uuid)
);

CREATE POLICY "Storage: admin/campo gerencia mídias"
ON storage.objects FOR ALL TO authenticated
USING (
  bucket_id = 'rdo-midias'
  AND public.can_edit_obra(auth.uid(), (split_part(name, '/', 1))::uuid)
)
WITH CHECK (
  bucket_id = 'rdo-midias'
  AND public.can_edit_obra(auth.uid(), (split_part(name, '/', 1))::uuid)
);

-- rdo-anexos (anexos do RDO + documentos da obra)
CREATE POLICY "Storage: ver anexos de obras acessíveis"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'rdo-anexos'
  AND public.has_obra_access(auth.uid(), (split_part(name, '/', 1))::uuid)
);

CREATE POLICY "Storage: admin/campo gerencia anexos"
ON storage.objects FOR ALL TO authenticated
USING (
  bucket_id = 'rdo-anexos'
  AND public.can_edit_obra(auth.uid(), (split_part(name, '/', 1))::uuid)
)
WITH CHECK (
  bucket_id = 'rdo-anexos'
  AND public.can_edit_obra(auth.uid(), (split_part(name, '/', 1))::uuid)
);
