-- MIGRATION CATEGORIAS: Adicionando novos tipos de andares focados em engenharia elétrica/civil

-- 1. Remove a restrição atual
ALTER TABLE public.torre_grupos_andar 
DROP CONSTRAINT IF EXISTS torre_grupos_andar_tipo_andar_check;

-- 2. Recria a restrição com as novas categorias
ALTER TABLE public.torre_grupos_andar 
ADD CONSTRAINT torre_grupos_andar_tipo_andar_check 
CHECK (tipo_andar IN (
    'garagem', 
    'terreo', 
    'tipo', 
    'cobertura', 
    'comercial', 
    'tecnica',     -- Áreas Técnicas / Barrilete
    'mezanino',    -- Mezaninos / Pilotis / Áreas Comuns
    'subestacao'   -- Subestação / Casa de Força
));
