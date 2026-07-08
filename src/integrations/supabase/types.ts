export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          acao: string
          ator_id: string | null
          created_at: string
          diff: Json | null
          id: string
          registro_id: string | null
          tabela: string
        }
        Insert: {
          acao: string
          ator_id?: string | null
          created_at?: string
          diff?: Json | null
          id?: string
          registro_id?: string | null
          tabela: string
        }
        Update: {
          acao?: string
          ator_id?: string | null
          created_at?: string
          diff?: Json | null
          id?: string
          registro_id?: string | null
          tabela?: string
        }
        Relationships: []
      }
      obra_usuarios: {
        Row: {
          created_at: string
          id: string
          obra_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          obra_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          obra_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "obra_usuarios_obra_id_fkey"
            columns: ["obra_id"]
            isOneToOne: false
            referencedRelation: "obras"
            referencedColumns: ["id"]
          },
        ]
      }
      obras: {
        Row: {
          cidade: string | null
          cliente_id: string | null
          created_at: string
          criado_por: string | null
          data_inicio: string | null
          data_prevista_termino: string | null
          descricao: string | null
          endereco: string | null
          estado: string | null
          foto_capa_path: string | null
          id: string
          latitude: number | null
          longitude: number | null
          nome: string
          responsavel_tecnico: string | null
          status: Database["public"]["Enums"]["obra_status"]
          updated_at: string
        }
        Insert: {
          cidade?: string | null
          cliente_id?: string | null
          created_at?: string
          criado_por?: string | null
          data_inicio?: string | null
          data_prevista_termino?: string | null
          descricao?: string | null
          endereco?: string | null
          estado?: string | null
          foto_capa_path?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          nome: string
          responsavel_tecnico?: string | null
          status?: Database["public"]["Enums"]["obra_status"]
          updated_at?: string
        }
        Update: {
          cidade?: string | null
          cliente_id?: string | null
          created_at?: string
          criado_por?: string | null
          data_inicio?: string | null
          data_prevista_termino?: string | null
          descricao?: string | null
          endereco?: string | null
          estado?: string | null
          foto_capa_path?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          nome?: string
          responsavel_tecnico?: string | null
          status?: Database["public"]["Enums"]["obra_status"]
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          ativo: boolean
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          nome: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id: string
          nome?: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          nome?: string
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      rdo_anexos: {
        Row: {
          created_at: string
          enviado_por: string | null
          id: string
          mime_type: string | null
          nome_arquivo: string
          rdo_id: string
          storage_path: string
        }
        Insert: {
          created_at?: string
          enviado_por?: string | null
          id?: string
          mime_type?: string | null
          nome_arquivo: string
          rdo_id: string
          storage_path: string
        }
        Update: {
          created_at?: string
          enviado_por?: string | null
          id?: string
          mime_type?: string | null
          nome_arquivo?: string
          rdo_id?: string
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "rdo_anexos_rdo_id_fkey"
            columns: ["rdo_id"]
            isOneToOne: false
            referencedRelation: "rdos"
            referencedColumns: ["id"]
          },
        ]
      }
      rdo_assinatura: {
        Row: {
          assinado_em: string
          assinado_por: string | null
          assinatura_png: string
          id: string
          nome_assinante: string
          rdo_id: string
          tipo: string
        }
        Insert: {
          assinado_em?: string
          assinado_por?: string | null
          assinatura_png: string
          id?: string
          nome_assinante: string
          rdo_id: string
          tipo?: string
        }
        Update: {
          assinado_em?: string
          assinado_por?: string | null
          assinatura_png?: string
          id?: string
          nome_assinante?: string
          rdo_id?: string
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "rdo_assinatura_rdo_id_fkey"
            columns: ["rdo_id"]
            isOneToOne: true
            referencedRelation: "rdos"
            referencedColumns: ["id"]
          },
        ]
      }
      obra_fotografia_itens: {
        Row: {
          id: string
          obra_id: string
          titulo: string
          descricao: string | null
          storage_path: string | null
          ordem: number
          enviado_por: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          obra_id: string
          titulo?: string
          descricao?: string | null
          storage_path?: string | null
          ordem?: number
          enviado_por?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          obra_id?: string
          titulo?: string
          descricao?: string | null
          storage_path?: string | null
          ordem?: number
          enviado_por?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "obra_fotografia_itens_obra_id_fkey"
            columns: ["obra_id"]
            isOneToOne: false
            referencedRelation: "obras"
            referencedColumns: ["id"]
          },
        ]
      }
      obra_documentos: {
        Row: {
          id: string
          obra_id: string
          storage_path: string
          nome_arquivo: string
          mime_type: string | null
          enviado_por: string | null
          created_at: string
        }
        Insert: {
          id?: string
          obra_id: string
          storage_path: string
          nome_arquivo: string
          mime_type?: string | null
          enviado_por?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          obra_id?: string
          storage_path?: string
          nome_arquivo?: string
          mime_type?: string | null
          enviado_por?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "obra_documentos_obra_id_fkey"
            columns: ["obra_id"]
            isOneToOne: false
            referencedRelation: "obras"
            referencedColumns: ["id"]
          },
        ]
      }
      templates_equipamentos: {
        Row: {
          id: string
          nome: string
          obra_id: string | null
          criado_por: string | null
          itens: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          obra_id?: string | null
          criado_por?: string | null
          itens?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          obra_id?: string | null
          criado_por?: string | null
          itens?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "templates_equipamentos_obra_id_fkey"
            columns: ["obra_id"]
            isOneToOne: false
            referencedRelation: "obras"
            referencedColumns: ["id"]
          },
        ]
      }
      rdo_atividades: {
        Row: {
          created_at: string
          descricao: string
          id: string
          observacao: string | null
          progresso_pct: number
          rdo_id: string
          status: Database["public"]["Enums"]["atividade_status"]
        }
        Insert: {
          created_at?: string
          descricao: string
          id?: string
          observacao?: string | null
          progresso_pct?: number
          rdo_id: string
          status?: Database["public"]["Enums"]["atividade_status"]
        }
        Update: {
          created_at?: string
          descricao?: string
          id?: string
          observacao?: string | null
          progresso_pct?: number
          rdo_id?: string
          status?: Database["public"]["Enums"]["atividade_status"]
        }
        Relationships: [
          {
            foreignKeyName: "rdo_atividades_rdo_id_fkey"
            columns: ["rdo_id"]
            isOneToOne: false
            referencedRelation: "rdos"
            referencedColumns: ["id"]
          },
        ]
      }
      rdo_checklist_epi: {
        Row: {
          created_at: string
          id: string
          item: string
          observacao: string | null
          presente: boolean
          rdo_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          item: string
          observacao?: string | null
          presente?: boolean
          rdo_id: string
        }
        Update: {
          created_at?: string
          id?: string
          item?: string
          observacao?: string | null
          presente?: boolean
          rdo_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rdo_checklist_epi_rdo_id_fkey"
            columns: ["rdo_id"]
            isOneToOne: false
            referencedRelation: "rdos"
            referencedColumns: ["id"]
          },
        ]
      }
      rdo_clima: {
        Row: {
          condicao: Database["public"]["Enums"]["clima_condicao"]
          created_at: string
          id: string
          impactou_execucao: boolean
          observacao: string | null
          periodo: string
          rdo_id: string
        }
        Insert: {
          condicao: Database["public"]["Enums"]["clima_condicao"]
          created_at?: string
          id?: string
          impactou_execucao?: boolean
          observacao?: string | null
          periodo: string
          rdo_id: string
        }
        Update: {
          condicao?: Database["public"]["Enums"]["clima_condicao"]
          created_at?: string
          id?: string
          impactou_execucao?: boolean
          observacao?: string | null
          periodo?: string
          rdo_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rdo_clima_rdo_id_fkey"
            columns: ["rdo_id"]
            isOneToOne: false
            referencedRelation: "rdos"
            referencedColumns: ["id"]
          },
        ]
      }
      rdo_comentarios: {
        Row: {
          autor_id: string | null
          created_at: string
          id: string
          rdo_id: string
          texto: string
        }
        Insert: {
          autor_id?: string | null
          created_at?: string
          id?: string
          rdo_id: string
          texto: string
        }
        Update: {
          autor_id?: string | null
          created_at?: string
          id?: string
          rdo_id?: string
          texto?: string
        }
        Relationships: [
          {
            foreignKeyName: "rdo_comentarios_rdo_id_fkey"
            columns: ["rdo_id"]
            isOneToOne: false
            referencedRelation: "rdos"
            referencedColumns: ["id"]
          },
        ]
      }
      rdo_equipamentos: {
        Row: {
          created_at: string
          id: string
          nome: string
          observacao: string | null
          quantidade: number
          rdo_id: string
          status: Database["public"]["Enums"]["equipamento_status"]
        }
        Insert: {
          created_at?: string
          id?: string
          nome: string
          observacao?: string | null
          quantidade?: number
          rdo_id: string
          status?: Database["public"]["Enums"]["equipamento_status"]
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string
          observacao?: string | null
          quantidade?: number
          rdo_id?: string
          status?: Database["public"]["Enums"]["equipamento_status"]
        }
        Relationships: [
          {
            foreignKeyName: "rdo_equipamentos_rdo_id_fkey"
            columns: ["rdo_id"]
            isOneToOne: false
            referencedRelation: "rdos"
            referencedColumns: ["id"]
          },
        ]
      }
      rdo_mao_de_obra: {
        Row: {
          created_at: string
          funcao: string
          id: string
          observacao: string | null
          quantidade: number
          rdo_id: string
          tipo: Database["public"]["Enums"]["mao_obra_tipo"]
        }
        Insert: {
          created_at?: string
          funcao: string
          id?: string
          observacao?: string | null
          quantidade?: number
          rdo_id: string
          tipo?: Database["public"]["Enums"]["mao_obra_tipo"]
        }
        Update: {
          created_at?: string
          funcao?: string
          id?: string
          observacao?: string | null
          quantidade?: number
          rdo_id?: string
          tipo?: Database["public"]["Enums"]["mao_obra_tipo"]
        }
        Relationships: [
          {
            foreignKeyName: "rdo_mao_de_obra_rdo_id_fkey"
            columns: ["rdo_id"]
            isOneToOne: false
            referencedRelation: "rdos"
            referencedColumns: ["id"]
          },
        ]
      }
      rdo_materiais: {
        Row: {
          created_at: string
          fornecedor: string | null
          id: string
          nome: string
          quantidade: number
          rdo_id: string
          tipo: Database["public"]["Enums"]["material_tipo"]
          unidade: string
        }
        Insert: {
          created_at?: string
          fornecedor?: string | null
          id?: string
          nome: string
          quantidade?: number
          rdo_id: string
          tipo?: Database["public"]["Enums"]["material_tipo"]
          unidade?: string
        }
        Update: {
          created_at?: string
          fornecedor?: string | null
          id?: string
          nome?: string
          quantidade?: number
          rdo_id?: string
          tipo?: Database["public"]["Enums"]["material_tipo"]
          unidade?: string
        }
        Relationships: [
          {
            foreignKeyName: "rdo_materiais_rdo_id_fkey"
            columns: ["rdo_id"]
            isOneToOne: false
            referencedRelation: "rdos"
            referencedColumns: ["id"]
          },
        ]
      }
      rdo_midias: {
        Row: {
          created_at: string
          enviado_por: string | null
          id: string
          legenda: string | null
          rdo_id: string
          storage_path: string
          tipo: string
        }
        Insert: {
          created_at?: string
          enviado_por?: string | null
          id?: string
          legenda?: string | null
          rdo_id: string
          storage_path: string
          tipo?: string
        }
        Update: {
          created_at?: string
          enviado_por?: string | null
          id?: string
          legenda?: string | null
          rdo_id?: string
          storage_path?: string
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "rdo_midias_rdo_id_fkey"
            columns: ["rdo_id"]
            isOneToOne: false
            referencedRelation: "rdos"
            referencedColumns: ["id"]
          },
        ]
      }
      rdo_ocorrencias: {
        Row: {
          created_at: string
          descricao: string
          gravidade: Database["public"]["Enums"]["ocorrencia_gravidade"]
          id: string
          rdo_id: string
          resolvido: boolean
        }
        Insert: {
          created_at?: string
          descricao: string
          gravidade?: Database["public"]["Enums"]["ocorrencia_gravidade"]
          id?: string
          rdo_id: string
          resolvido?: boolean
        }
        Update: {
          created_at?: string
          descricao?: string
          gravidade?: Database["public"]["Enums"]["ocorrencia_gravidade"]
          id?: string
          rdo_id?: string
          resolvido?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "rdo_ocorrencias_rdo_id_fkey"
            columns: ["rdo_id"]
            isOneToOne: false
            referencedRelation: "rdos"
            referencedColumns: ["id"]
          },
        ]
      }
      rdos: {
        Row: {
          aprovado_em: string | null
          aprovado_por: string | null
          autor_id: string | null
          created_at: string
          data: string
          hora_fim: string | null
          hora_inicio: string | null
          id: string
          numero_sequencial: number
          obra_id: string
          observacoes: string | null
          status: Database["public"]["Enums"]["rdo_status"]
          total_horas: number | null
          updated_at: string
        }
        Insert: {
          aprovado_em?: string | null
          aprovado_por?: string | null
          autor_id?: string | null
          created_at?: string
          data: string
          hora_fim?: string | null
          hora_inicio?: string | null
          id?: string
          numero_sequencial: number
          obra_id: string
          observacoes?: string | null
          status?: Database["public"]["Enums"]["rdo_status"]
          total_horas?: number | null
          updated_at?: string
        }
        Update: {
          aprovado_em?: string | null
          aprovado_por?: string | null
          autor_id?: string | null
          created_at?: string
          data?: string
          hora_fim?: string | null
          hora_inicio?: string | null
          id?: string
          numero_sequencial?: number
          obra_id?: string
          observacoes?: string | null
          status?: Database["public"]["Enums"]["rdo_status"]
          total_horas?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rdos_obra_id_fkey"
            columns: ["obra_id"]
            isOneToOne: false
            referencedRelation: "obras"
            referencedColumns: ["id"]
          },
        ]
      }
      templates_mao_de_obra: {
        Row: {
          created_at: string
          criado_por: string | null
          id: string
          itens: Json
          nome: string
          obra_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          criado_por?: string | null
          id?: string
          itens?: Json
          nome: string
          obra_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          criado_por?: string | null
          id?: string
          itens?: Json
          nome?: string
          obra_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "templates_mao_de_obra_obra_id_fkey"
            columns: ["obra_id"]
            isOneToOne: false
            referencedRelation: "obras"
            referencedColumns: ["id"]
          },
        ]
      }
      templates_tarefas: {
        Row: {
          created_at: string
          criado_por: string | null
          id: string
          itens: Json
          nome: string
          obra_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          criado_por?: string | null
          id?: string
          itens?: Json
          nome: string
          obra_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          criado_por?: string | null
          id?: string
          itens?: Json
          nome?: string
          obra_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "templates_tarefas_obra_id_fkey"
            columns: ["obra_id"]
            isOneToOne: false
            referencedRelation: "obras"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_edit_obra: {
        Args: { _obra_id: string; _user_id: string }
        Returns: boolean
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_obra_access: {
        Args: { _obra_id: string; _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "campo" | "cliente"
      atividade_status: "nao_iniciada" | "em_andamento" | "concluida"
      clima_condicao:
        | "ensolarado"
        | "nublado"
        | "chuva_leve"
        | "chuva_forte"
        | "tempestade"
        | "neblina"
      equipamento_status: "disponivel" | "em_uso" | "manutencao"
      mao_obra_tipo: "proprio" | "terceirizado"
      material_tipo: "entrada" | "saida"
      obra_status: "em_andamento" | "pausada" | "concluida"
      ocorrencia_gravidade: "baixa" | "media" | "alta"
      rdo_status: "rascunho" | "enviado" | "aprovado"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "campo", "cliente"],
      atividade_status: ["nao_iniciada", "em_andamento", "concluida"],
      clima_condicao: [
        "ensolarado",
        "nublado",
        "chuva_leve",
        "chuva_forte",
        "tempestade",
        "neblina",
      ],
      equipamento_status: ["disponivel", "em_uso", "manutencao"],
      mao_obra_tipo: ["proprio", "terceirizado"],
      material_tipo: ["entrada", "saida"],
      obra_status: ["em_andamento", "pausada", "concluida"],
      ocorrencia_gravidade: ["baixa", "media", "alta"],
      rdo_status: ["rascunho", "enviado", "aprovado"],
    },
  },
} as const
