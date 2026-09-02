-- =========================================================================
-- MIGRATION: Escopo da Obra (Parcial/Global) e RDO Semanal
-- =========================================================================

ALTER TABLE IF EXISTS public.obras 
  ADD COLUMN IF NOT EXISTS tipo_escopo TEXT CHECK (tipo_escopo IN ('parcial', 'global')) DEFAULT 'global';

ALTER TABLE public.rdos DROP CONSTRAINT IF EXISTS rdos_obra_id_data_key;
ALTER TABLE public.rdos ADD COLUMN IF NOT EXISTS tipo TEXT CHECK (tipo IN ('diario', 'semanal')) DEFAULT 'diario';
ALTER TABLE public.rdos ADD CONSTRAINT rdos_obra_id_data_tipo_key UNIQUE (obra_id, data, tipo);

