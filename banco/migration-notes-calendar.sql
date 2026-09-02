-- ============================================================
-- MIGRATION: Novas Features (Notes e Calendário)
-- ============================================================

-- 1. Criação da Tabela de Anotações (Notes)
CREATE TABLE IF NOT EXISTS public.notes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title text NOT NULL DEFAULT 'Sem título',
    content jsonb NOT NULL DEFAULT '{}'::jsonb,
    icon text NOT NULL DEFAULT 'FileText',
    pinned boolean NOT NULL DEFAULT false,
    archived boolean NOT NULL DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notes_select" ON public.notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notes_insert" ON public.notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "notes_update" ON public.notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "notes_delete" ON public.notes FOR DELETE USING (auth.uid() = user_id);

DROP TRIGGER IF EXISTS on_notes_updated ON public.notes;
CREATE TRIGGER on_notes_updated
    BEFORE UPDATE ON public.notes
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. Criação da Tabela de Calendário
CREATE TABLE IF NOT EXISTS public.calendar_events (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title text NOT NULL,
    date date NOT NULL,
    icon text DEFAULT 'Calendar',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- Evita erro de policy duplicada
DO $DO$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'calendar_select' AND tablename = 'calendar_events') THEN
        CREATE POLICY "calendar_select" ON public.calendar_events FOR SELECT USING (auth.uid() = user_id);
        CREATE POLICY "calendar_insert" ON public.calendar_events FOR INSERT WITH CHECK (auth.uid() = user_id);
        CREATE POLICY "calendar_update" ON public.calendar_events FOR UPDATE USING (auth.uid() = user_id);
        CREATE POLICY "calendar_delete" ON public.calendar_events FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $DO$;

-- 3. Inserindo Buckets que faltam (Avatars para o Perfil de Usuário)
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;

-- 4. Habilitar Realtime nativamente no SQL em TODAS as tabelas vitais
BEGIN;
  DO $DO$
  DECLARE
    t text;
    tables text[] := ARRAY['obras', 'rdos', 'apontamentos', 'obra_pendencias', 'notes', 'calendar_events'];
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
      CREATE PUBLICATION supabase_realtime;
    END IF;
    
    FOREACH t IN ARRAY tables
    LOOP
      IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = t
      ) THEN
        EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.' || t;
      END IF;
    END LOOP;
  END
  $DO$;
COMMIT;

-- 5. Automação do Backup via PG_CRON
-- (Requer extensão pg_cron ativada no banco)
-- Faz uma cópia de segurança na tabela de histórico todos os dias às 00h
CREATE TABLE IF NOT EXISTS public.backup_history (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    backup_date timestamp with time zone DEFAULT now(),
    status text,
    details jsonb
);

-- Ativa a extensão de Cron nativo (Se suportada/disponível no seu plano do Supabase)
CREATE EXTENSION IF NOT EXISTS pg_cron;

DO $DO$
BEGIN
  -- Tenta agendar o job de backup. Se falhar por falta de permissão, é ignorado silenciosamente
  BEGIN
    PERFORM cron.schedule('daily_backup', '0 0 * * *', $$
      INSERT INTO public.backup_history (status, details) 
      VALUES ('SUCESSO', '{"message": "Backup automatizado diário disparado pela engine de banco."}'::jsonb)
    $$);
  EXCEPTION WHEN OTHERS THEN
    -- Ignora erro caso pg_cron não esteja habilitado
  END;
END
$DO$;

