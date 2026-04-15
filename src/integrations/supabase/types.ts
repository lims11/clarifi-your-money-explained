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
      accounts: {
        Row: {
          balance: number | null
          colour: string | null
          created_at: string | null
          currency: string | null
          icon: string | null
          id: string
          institution: string | null
          is_active: boolean | null
          name: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance?: number | null
          colour?: string | null
          created_at?: string | null
          currency?: string | null
          icon?: string | null
          id?: string
          institution?: string | null
          is_active?: boolean | null
          name: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance?: number | null
          colour?: string | null
          created_at?: string | null
          currency?: string | null
          icon?: string | null
          id?: string
          institution?: string | null
          is_active?: boolean | null
          name?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      budget_overrides: {
        Row: {
          budget_id: string
          created_at: string | null
          id: string
          original_amount: number | null
          overridden_amount: number | null
          override_date: string | null
          override_type: string | null
          reason: string | null
          user_id: string
        }
        Insert: {
          budget_id: string
          created_at?: string | null
          id?: string
          original_amount?: number | null
          overridden_amount?: number | null
          override_date?: string | null
          override_type?: string | null
          reason?: string | null
          user_id: string
        }
        Update: {
          budget_id?: string
          created_at?: string | null
          id?: string
          original_amount?: number | null
          overridden_amount?: number | null
          override_date?: string | null
          override_type?: string | null
          reason?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "budget_overrides_budget_id_fkey"
            columns: ["budget_id"]
            isOneToOne: false
            referencedRelation: "budgets"
            referencedColumns: ["id"]
          },
        ]
      }
      budgets: {
        Row: {
          amount: number
          category: string
          colour: string | null
          created_at: string | null
          id: string
          name: string
          period: string
          user_id: string
        }
        Insert: {
          amount: number
          category: string
          colour?: string | null
          created_at?: string | null
          id?: string
          name: string
          period: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          colour?: string | null
          created_at?: string | null
          id?: string
          name?: string
          period?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          role: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      credit_scores: {
        Row: {
          created_at: string | null
          factors: Json | null
          id: string
          last_updated: string | null
          previous_score: number | null
          provider: string | null
          rating: string | null
          score: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          factors?: Json | null
          id?: string
          last_updated?: string | null
          previous_score?: number | null
          provider?: string | null
          rating?: string | null
          score?: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          factors?: Json | null
          id?: string
          last_updated?: string | null
          previous_score?: number | null
          provider?: string | null
          rating?: string | null
          score?: number
          user_id?: string
        }
        Relationships: []
      }
      goal_contributions: {
        Row: {
          amount: number
          contribution_date: string | null
          created_at: string | null
          goal_id: string
          id: string
          is_recurring: boolean | null
          note: string | null
          source_account_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          contribution_date?: string | null
          created_at?: string | null
          goal_id: string
          id?: string
          is_recurring?: boolean | null
          note?: string | null
          source_account_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          contribution_date?: string | null
          created_at?: string | null
          goal_id?: string
          id?: string
          is_recurring?: boolean | null
          note?: string | null
          source_account_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "goal_contributions_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goal_contributions_source_account_id_fkey"
            columns: ["source_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          colour: string | null
          created_at: string | null
          current_amount: number | null
          icon: string | null
          id: string
          name: string
          target_amount: number
          target_date: string | null
          user_id: string
        }
        Insert: {
          colour?: string | null
          created_at?: string | null
          current_amount?: number | null
          icon?: string | null
          id?: string
          name: string
          target_amount: number
          target_date?: string | null
          user_id: string
        }
        Update: {
          colour?: string | null
          created_at?: string | null
          current_amount?: number | null
          icon?: string | null
          id?: string
          name?: string
          target_amount?: number
          target_date?: string | null
          user_id?: string
        }
        Relationships: []
      }
      net_worth_history: {
        Row: {
          assets: number | null
          created_at: string | null
          date: string
          id: string
          liabilities: number | null
          net_worth: number
          user_id: string
        }
        Insert: {
          assets?: number | null
          created_at?: string | null
          date: string
          id?: string
          liabilities?: number | null
          net_worth: number
          user_id: string
        }
        Update: {
          assets?: number | null
          created_at?: string | null
          date?: string
          id?: string
          liabilities?: number | null
          net_worth?: number
          user_id?: string
        }
        Relationships: []
      }
      onboarding_answers: {
        Row: {
          answer: Json
          created_at: string | null
          id: string
          question_key: string
          user_id: string
        }
        Insert: {
          answer: Json
          created_at?: string | null
          id?: string
          question_key: string
          user_id: string
        }
        Update: {
          answer?: Json
          created_at?: string | null
          id?: string
          question_key?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          currency: string | null
          full_name: string | null
          id: string
          onboarding_complete: boolean | null
          onboarding_step: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          full_name?: string | null
          id: string
          onboarding_complete?: boolean | null
          onboarding_step?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          full_name?: string | null
          id?: string
          onboarding_complete?: boolean | null
          onboarding_step?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      pulse_alerts: {
        Row: {
          action_label: string | null
          body: string
          created_at: string | null
          id: string
          is_read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_label?: string | null
          body: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_label?: string | null
          body?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      reminder_preferences: {
        Row: {
          channels: Json | null
          created_at: string | null
          entity_id: string
          entity_type: string
          frequency: string
          id: string
          is_active: boolean | null
          last_sent_at: string | null
          payday_date: number | null
          user_id: string
        }
        Insert: {
          channels?: Json | null
          created_at?: string | null
          entity_id: string
          entity_type: string
          frequency: string
          id?: string
          is_active?: boolean | null
          last_sent_at?: string | null
          payday_date?: number | null
          user_id: string
        }
        Update: {
          channels?: Json | null
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          frequency?: string
          id?: string
          is_active?: boolean | null
          last_sent_at?: string | null
          payday_date?: number | null
          user_id?: string
        }
        Relationships: []
      }
      report_exports: {
        Row: {
          created_at: string | null
          id: string
          period_end: string | null
          period_start: string | null
          report_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          period_end?: string | null
          period_start?: string | null
          report_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          period_end?: string | null
          period_start?: string | null
          report_type?: string
          user_id?: string
        }
        Relationships: []
      }
      scheduled_transactions: {
        Row: {
          account_id: string
          amount: number
          category: string
          created_at: string | null
          frequency: string
          id: string
          is_active: boolean | null
          name: string
          next_date: string
          payee: string | null
          type: string
          user_id: string
        }
        Insert: {
          account_id: string
          amount: number
          category: string
          created_at?: string | null
          frequency: string
          id?: string
          is_active?: boolean | null
          name: string
          next_date: string
          payee?: string | null
          type: string
          user_id: string
        }
        Update: {
          account_id?: string
          amount?: number
          category?: string
          created_at?: string | null
          frequency?: string
          id?: string
          is_active?: boolean | null
          name?: string
          next_date?: string
          payee?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      statement_uploads: {
        Row: {
          account_id: string
          bank_id: string
          created_at: string | null
          error_message: string | null
          file_format: string
          filename: string
          id: string
          period_end: string | null
          period_start: string | null
          status: string | null
          transactions_found: number | null
          transactions_imported: number | null
          user_id: string
        }
        Insert: {
          account_id: string
          bank_id: string
          created_at?: string | null
          error_message?: string | null
          file_format: string
          filename: string
          id?: string
          period_end?: string | null
          period_start?: string | null
          status?: string | null
          transactions_found?: number | null
          transactions_imported?: number | null
          user_id: string
        }
        Update: {
          account_id?: string
          bank_id?: string
          created_at?: string | null
          error_message?: string | null
          file_format?: string
          filename?: string
          id?: string
          period_end?: string | null
          period_start?: string | null
          status?: string | null
          transactions_found?: number | null
          transactions_imported?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "statement_uploads_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_surveys: {
        Row: {
          created_at: string | null
          id: string
          subscription_id: string
          survey_date: string | null
          usage_level: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          subscription_id: string
          survey_date?: string | null
          usage_level: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          subscription_id?: string
          survey_date?: string | null
          usage_level?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_surveys_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          account_id: string | null
          amount: number
          billing_day: number | null
          billing_frequency: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          last_survey_date: string | null
          service_name: string
          usage_status: string | null
          user_id: string
        }
        Insert: {
          account_id?: string | null
          amount: number
          billing_day?: number | null
          billing_frequency?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_survey_date?: string | null
          service_name: string
          usage_status?: string | null
          user_id: string
        }
        Update: {
          account_id?: string | null
          amount?: number
          billing_day?: number | null
          billing_frequency?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_survey_date?: string | null
          service_name?: string
          usage_status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          account_id: string
          ai_category_confidence: number | null
          ai_category_reason: string | null
          amount: number
          category: string
          created_at: string | null
          date: string
          description: string | null
          id: string
          is_cleared: boolean | null
          is_recurring: boolean | null
          payee: string | null
          subcategory: string | null
          type: string
          user_id: string
        }
        Insert: {
          account_id: string
          ai_category_confidence?: number | null
          ai_category_reason?: string | null
          amount: number
          category: string
          created_at?: string | null
          date: string
          description?: string | null
          id?: string
          is_cleared?: boolean | null
          is_recurring?: boolean | null
          payee?: string | null
          subcategory?: string | null
          type: string
          user_id: string
        }
        Update: {
          account_id?: string
          ai_category_confidence?: number | null
          ai_category_reason?: string | null
          amount?: number
          category?: string
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          is_cleared?: boolean | null
          is_recurring?: boolean | null
          payee?: string | null
          subcategory?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
