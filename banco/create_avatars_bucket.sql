-- 1. Adicionar a coluna avatar_url na tabela profiles (se não existir)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 2. Criar o bucket de avatars no Storage
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Configurar políticas de segurança para o bucket 'avatars'
-- NÃO precisamos usar ALTER TABLE storage.objects aqui, o Supabase já faz isso nativamente.

-- Qualquer pessoa logada pode visualizar os avatars
CREATE POLICY "Avatars são públicos para usuários autenticados" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- Usuário pode fazer upload apenas para sua própria pasta (ID do usuário)
CREATE POLICY "Usuário pode fazer upload do próprio avatar" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (string_to_array(name, '/'))[1]);

-- Usuário pode atualizar a própria imagem
CREATE POLICY "Usuário pode atualizar o próprio avatar" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'avatars' AND auth.uid()::text = (string_to_array(name, '/'))[1]);

-- Usuário pode apagar a própria imagem
CREATE POLICY "Usuário pode apagar o próprio avatar" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'avatars' AND auth.uid()::text = (string_to_array(name, '/'))[1]);

-- Recarregar schema para garantir que a API reflita
NOTIFY pgrst, 'reload schema';
