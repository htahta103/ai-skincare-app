export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_progress: {
        Row: {
          challenge_id: string
          completed: boolean | null
          created_at: string | null
          data: Json | null
          id: string
          progress_date: string
        }
        Insert: {
          challenge_id: string
          completed?: boolean | null
          created_at?: string | null
          data?: Json | null
          id?: string
          progress_date: string
        }
        Update: {
          challenge_id?: string
          completed?: boolean | null
          created_at?: string | null
          data?: Json | null
          id?: string
          progress_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_progress_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          challenge_type: string
          created_at: string | null
          current_streak: number | null
          ends_at: string | null
          id: string
          started_at: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          challenge_type: string
          created_at?: string | null
          current_streak?: number | null
          ends_at?: string | null
          id?: string
          started_at?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          challenge_type?: string
          created_at?: string | null
          current_streak?: number | null
          ends_at?: string | null
          id?: string
          started_at?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          metadata: Json | null
          role: string
          session_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          role: string
          session_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          role?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          created_at: string | null
          id: string
          last_message_at: string | null
          session_title: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          session_title?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          session_title?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      deletion_requests: {
        Row: {
          id: string
          processed_at: string | null
          requested_at: string | null
          status: string | null
          user_email: string | null
          user_id: string
        }
        Insert: {
          id?: string
          processed_at?: string | null
          requested_at?: string | null
          status?: string | null
          user_email?: string | null
          user_id: string
        }
        Update: {
          id?: string
          processed_at?: string | null
          requested_at?: string | null
          status?: string | null
          user_email?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ingredient_results: {
        Row: {
          alternatives: string[] | null
          category: string | null
          concerns: string[] | null
          created_at: string | null
          id: string
          ingredient_name: string
          ingredient_scan_id: string
          safety_rating: string | null
        }
        Insert: {
          alternatives?: string[] | null
          category?: string | null
          concerns?: string[] | null
          created_at?: string | null
          id?: string
          ingredient_name: string
          ingredient_scan_id: string
          safety_rating?: string | null
        }
        Update: {
          alternatives?: string[] | null
          category?: string | null
          concerns?: string[] | null
          created_at?: string | null
          id?: string
          ingredient_name?: string
          ingredient_scan_id?: string
          safety_rating?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ingredient_results_ingredient_scan_id_fkey"
            columns: ["ingredient_scan_id"]
            isOneToOne: false
            referencedRelation: "ingredient_scans"
            referencedColumns: ["id"]
          },
        ]
      }
      ingredient_scans: {
        Row: {
          created_at: string | null
          id: string
          image_path: string
          product_name: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_path: string
          product_name?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          image_path?: string
          product_name?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ingredient_scans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          affiliate_url: string | null
          brand: string | null
          category: string | null
          created_at: string | null
          id: string
          image_url: string | null
          ingredients: string[] | null
          metadata: Json | null
          name: string
        }
        Insert: {
          affiliate_url?: string | null
          brand?: string | null
          category?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          ingredients?: string[] | null
          metadata?: Json | null
          name: string
        }
        Update: {
          affiliate_url?: string | null
          brand?: string | null
          category?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          ingredients?: string[] | null
          metadata?: Json | null
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          analytics_consent: boolean | null
          avatar_url: string | null
          consent_updated_at: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          marketing_consent: boolean | null
          preferences: Json | null
          updated_at: string | null
        }
        Insert: {
          analytics_consent?: boolean | null
          avatar_url?: string | null
          consent_updated_at?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          marketing_consent?: boolean | null
          preferences?: Json | null
          updated_at?: string | null
        }
        Update: {
          analytics_consent?: boolean | null
          avatar_url?: string | null
          consent_updated_at?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          marketing_consent?: boolean | null
          preferences?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      progress_photos: {
        Row: {
          created_at: string | null
          id: string
          image_path: string
          metadata: Json | null
          photo_type: string | null
          taken_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_path: string
          metadata?: Json | null
          photo_type?: string | null
          taken_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          image_path?: string
          metadata?: Json | null
          photo_type?: string | null
          taken_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "progress_photos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      routine_steps: {
        Row: {
          created_at: string | null
          duration_seconds: number | null
          id: string
          instructions: string | null
          product_id: string | null
          routine_id: string
          step_order: number
          step_type: string
        }
        Insert: {
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          instructions?: string | null
          product_id?: string | null
          routine_id: string
          step_order: number
          step_type: string
        }
        Update: {
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          instructions?: string | null
          product_id?: string | null
          routine_id?: string
          step_order?: number
          step_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "routine_steps_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "routine_steps_routine_id_fkey"
            columns: ["routine_id"]
            isOneToOne: false
            referencedRelation: "routines"
            referencedColumns: ["id"]
          },
        ]
      }
      routines: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string | null
          routine_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string | null
          routine_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string | null
          routine_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "routines_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      scan_metrics: {
        Row: {
          created_at: string | null
          id: string
          metadata: Json | null
          metric_type: string
          scan_id: string
          unit: string | null
          value: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          metric_type: string
          scan_id: string
          unit?: string | null
          value: number
        }
        Update: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          metric_type?: string
          scan_id?: string
          unit?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "scan_metrics_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "skin_scans"
            referencedColumns: ["id"]
          },
        ]
      }
      scan_results: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          recommendations: Json | null
          scan_id: string
          score: number | null
          severity: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          recommendations?: Json | null
          scan_id: string
          score?: number | null
          severity?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          recommendations?: Json | null
          scan_id?: string
          score?: number | null
          severity?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scan_results_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "skin_scans"
            referencedColumns: ["id"]
          },
        ]
      }
      scan_usage: {
        Row: {
          created_at: string | null
          id: string
          ingredient_scans_limit: number | null
          ingredient_scans_used: number | null
          scans_limit: number | null
          scans_used: number | null
          usage_date: string
          user_id: string
          version: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          ingredient_scans_limit?: number | null
          ingredient_scans_used?: number | null
          scans_limit?: number | null
          scans_used?: number | null
          usage_date?: string
          user_id: string
          version?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          ingredient_scans_limit?: number | null
          ingredient_scans_used?: number | null
          scans_limit?: number | null
          scans_used?: number | null
          usage_date?: string
          user_id?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "scan_usage_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      skin_profiles: {
        Row: {
          allergies: string[] | null
          created_at: string | null
          current_products: string[] | null
          id: string
          skin_concerns: string[] | null
          skin_goals: string[] | null
          skin_type: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          allergies?: string[] | null
          created_at?: string | null
          current_products?: string[] | null
          id?: string
          skin_concerns?: string[] | null
          skin_goals?: string[] | null
          skin_type?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          allergies?: string[] | null
          created_at?: string | null
          current_products?: string[] | null
          id?: string
          skin_concerns?: string[] | null
          skin_goals?: string[] | null
          skin_type?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "skin_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      skin_scans: {
        Row: {
          analysis_summary: Json | null
          created_at: string | null
          glow_score: number | null
          id: string
          image_path: string
          scan_status: string | null
          user_id: string
          version: number | null
        }
        Insert: {
          analysis_summary?: Json | null
          created_at?: string | null
          glow_score?: number | null
          id?: string
          image_path: string
          scan_status?: string | null
          user_id: string
          version?: number | null
        }
        Update: {
          analysis_summary?: Json | null
          created_at?: string | null
          glow_score?: number | null
          id?: string
          image_path?: string
          scan_status?: string | null
          user_id?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "skin_scans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancelled_at: string | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          payment_provider: string | null
          plan_type: string
          provider_subscription_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string
          version: number | null
        }
        Insert: {
          cancelled_at?: string | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          payment_provider?: string | null
          plan_type?: string
          provider_subscription_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
          version?: number | null
        }
        Update: {
          cancelled_at?: string | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          payment_provider?: string | null
          plan_type?: string
          provider_subscription_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_perform_scan: {
        Args: {
          p_user_id: string
          p_scan_type?: string
        }
        Returns: Json
      }
      cancel_subscription: {
        Args: {
          p_user_id: string
          p_cancelled_at?: string
        }
        Returns: boolean
      }
      check_feature_access: {
        Args: {
          p_user_id: string
          p_feature: string
        }
        Returns: boolean
      }
      cleanup_old_scans: {
        Args: {
          p_days_old?: number
        }
        Returns: number
      }
      consume_scan_quota: {
        Args: {
          p_user_id: string
          p_scan_type?: string
        }
        Returns: boolean
      }
      create_ingredient_scan: {
        Args: {
          p_user_id: string
          p_image_path: string
          p_product_name?: string
        }
        Returns: string
      }
      create_scan_record: {
        Args: {
          p_user_id: string
          p_image_path: string
        }
        Returns: string
      }
      export_user_data: {
        Args: {
          p_user_id: string
        }
        Returns: Json
      }
      get_dashboard_data: {
        Args: {
          p_user_id: string
        }
        Returns: Json
      }
      get_or_create_daily_usage: {
        Args: {
          p_user_id: string
        }
        Returns: {
          created_at: string | null
          id: string
          ingredient_scans_limit: number | null
          ingredient_scans_used: number | null
          scans_limit: number | null
          scans_used: number | null
          usage_date: string
          user_id: string
          version: number | null
        }
      }
      get_scan_details: {
        Args: {
          p_scan_id: string
        }
        Returns: Json
      }
      get_scan_history: {
        Args: {
          p_user_id: string
          p_limit?: number
          p_offset?: number
        }
        Returns: Json
      }
      get_subscription_details: {
        Args: {
          p_user_id: string
        }
        Returns: Json
      }
      get_user_routines: {
        Args: {
          p_user_id: string
        }
        Returns: Json
      }
      log_audit_event: {
        Args: {
          p_user_id: string
          p_action: string
          p_table_name?: string
          p_record_id?: string
          p_old_data?: Json
          p_new_data?: Json
        }
        Returns: string
      }
      log_challenge_progress: {
        Args: {
          p_challenge_id: string
          p_completed?: boolean
          p_data?: Json
        }
        Returns: boolean
      }
      mark_scan_failed: {
        Args: {
          p_scan_id: string
          p_error_message?: string
        }
        Returns: boolean
      }
      mark_scan_processing: {
        Args: {
          p_scan_id: string
        }
        Returns: boolean
      }
      request_account_deletion: {
        Args: {
          p_user_id: string
        }
        Returns: Json
      }
      start_challenge: {
        Args: {
          p_user_id: string
          p_challenge_type: string
          p_duration_days?: number
        }
        Returns: string
      }
      update_consent: {
        Args: {
          p_user_id: string
          p_marketing_consent?: boolean
          p_analytics_consent?: boolean
        }
        Returns: boolean
      }
      update_ingredient_scan_results: {
        Args: {
          p_scan_id: string
          p_product_name: string
          p_ingredients: Json
        }
        Returns: boolean
      }
      update_scan_with_results: {
        Args: {
          p_scan_id: string
          p_glow_score: number
          p_analysis_summary: Json
          p_metrics?: Json
          p_results?: Json
        }
        Returns: boolean
      }
      update_subscription_from_webhook: {
        Args: {
          p_user_id: string
          p_plan_type: string
          p_status: string
          p_provider: string
          p_provider_subscription_id: string
          p_current_period_start: string
          p_current_period_end: string
          p_cancelled_at?: string
        }
        Returns: boolean
      }
      upsert_routine: {
        Args: {
          p_user_id: string
          p_routine_type: string
          p_name?: string
          p_steps?: Json
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
