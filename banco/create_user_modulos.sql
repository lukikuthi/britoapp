CREATE TABLE public.user_modulos (
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    modulo TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (user_id, modulo)
);

-- Habilitar RLS (Segurança)
ALTER TABLE public.user_modulos ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS
-- Apenas administradores podem ver ou modificar a tabela de módulos
CREATE POLICY "Admins podem gerenciar modulos de todos"
    ON public.user_modulos
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    );

-- Usuários comuns podem ver apenas seus próprios módulos
CREATE POLICY "Usuários podem ver seus proprios modulos"
    ON public.user_modulos
    FOR SELECT
    USING (auth.uid() = user_id);

-- Para garantir que a cache de esquema da API do Supabase atualize:
NOTIFY pgrst, 'reload schema';
