-- ============================================================================
-- Migration: Remoção do módulo RDO
-- NÃO EXECUTE AUTOMATICAMENTE — revisar e executar manualmente no Supabase.
-- ============================================================================

-- 1. Drop triggers
DROP TRIGGER IF EXISTS trg_audit_rdos ON public.rdos;
DROP TRIGGER IF EXISTS trg_rdos_updated_at ON public.rdos;
DROP TRIGGER IF EXISTS trg_rdos_seq ON public.rdos;

-- 2. Drop functions exclusivas do RDO
DROP FUNCTION IF EXISTS public.set_rdo_numero_sequencial();
DROP FUNCTION IF EXISTS public.audit_rdo_changes();

-- 3. Drop tabelas filhas (ordem inversa de FK)
DROP TABLE IF EXISTS public.rdo_assinatura;
DROP TABLE IF EXISTS public.rdo_comentarios;
DROP TABLE IF EXISTS public.rdo_checklist_epi;
DROP TABLE IF EXISTS public.rdo_materiais;
DROP TABLE IF EXISTS public.rdo_ocorrencias;
DROP TABLE IF EXISTS public.rdo_atividades;
DROP TABLE IF EXISTS public.rdo_equipamentos;
DROP TABLE IF EXISTS public.rdo_mao_de_obra;
DROP TABLE IF EXISTS public.rdo_midias;
DROP TABLE IF EXISTS public.rdo_anexos;
DROP TABLE IF EXISTS public.rdo_clima;

-- 4. Drop tabela principal
DROP TABLE IF EXISTS public.rdos;

-- 5. Drop ENUMs exclusivos do RDO (se não referenciados em outro lugar)
DROP TYPE IF EXISTS public.rdo_status;
DROP TYPE IF EXISTS public.clima_condicao;
DROP TYPE IF EXISTS public.atividade_status;
DROP TYPE IF EXISTS public.ocorrencia_gravidade;
DROP TYPE IF EXISTS public.equipamento_status;
DROP TYPE IF EXISTS public.material_tipo;
DROP TYPE IF EXISTS public.mao_obra_tipo;

-- NÃO remover: audit_log, storage buckets, templates, profiles, user_roles, obras
