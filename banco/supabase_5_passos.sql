-- Migration: "Os 5 Passos"
-- O plano original pediu para preservar as tabelas antigas (torre_andares, etc.)
-- Então criaremos apenas as novas tabelas.

-- 1. obra_pavimentos
CREATE TABLE public.obra_pavimentos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  torre_id uuid REFERENCES public.obra_torres(id) ON DELETE CASCADE NOT NULL,
  numero_andar integer NOT NULL,
  tipo_pavimento text NOT NULL, -- 'Subsolo', 'Garagem', 'Térreo', 'Mezanino', 'Área Técnica', 'Tipo', 'Cobertura'
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. obra_ambientes
CREATE TABLE public.obra_ambientes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  pavimento_id uuid REFERENCES public.obra_pavimentos(id) ON DELETE CASCADE NOT NULL,
  nome text NOT NULL, -- ex: 'Portaria', 'Apartamento'
  numero_final integer, -- ex: 1 para 'Final 1'. Null para áreas comuns.
  planta_storage_path text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. obra_pendencias
CREATE TABLE public.obra_pendencias (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  ambiente_id uuid REFERENCES public.obra_ambientes(id) ON DELETE CASCADE NOT NULL,
  codigo text NOT NULL, -- ex: '42,91'
  localizacao text NOT NULL, -- hierarquia automática ex: 'Torre 1 > Térreo > Portaria'
  descricao text NOT NULL,
  foto_path text NOT NULL, -- A foto é obrigatória na criação
  pos_x numeric, -- Posição X na planta
  pos_y numeric, -- Posição Y na planta
  status text NOT NULL DEFAULT 'aberta', -- 'aberta', 'vencida', 'resolvida'
  prazo timestamp with time zone NOT NULL, -- Default criado via código (data de criação + 5 dias)
  data_baixa timestamp with time zone,
  foto_baixa_path text, -- Foto obrigatória no fechamento
  autor_id uuid REFERENCES auth.users(id),
  baixado_por_id uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS e criar políticas de acesso padrão (Acesso total para usuários logados no MVP)
ALTER TABLE public.obra_pavimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.obra_ambientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.obra_pendencias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all actions for authenticated users on obra_pavimentos" ON public.obra_pavimentos FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable all actions for authenticated users on obra_ambientes" ON public.obra_ambientes FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable all actions for authenticated users on obra_pendencias" ON public.obra_pendencias FOR ALL TO authenticated USING (true) WITH CHECK (true);
