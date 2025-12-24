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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      business_settings: {
        Row: {
          business_name: string
          cancellation_policy: string | null
          created_at: string
          id: string
          updated_at: string
          webpay_link_deposit: string | null
          webpay_link_full: string | null
          webpay_plus_api_key: string | null
          webpay_plus_commerce_code: string | null
          webpay_plus_environment: string | null
          whatsapp: string | null
        }
        Insert: {
          business_name?: string
          cancellation_policy?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          webpay_link_deposit?: string | null
          webpay_link_full?: string | null
          webpay_plus_api_key?: string | null
          webpay_plus_commerce_code?: string | null
          webpay_plus_environment?: string | null
          whatsapp?: string | null
        }
        Update: {
          business_name?: string
          cancellation_policy?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          webpay_link_deposit?: string | null
          webpay_link_full?: string | null
          webpay_plus_api_key?: string | null
          webpay_plus_commerce_code?: string | null
          webpay_plus_environment?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      court_blocks: {
        Row: {
          court_id: string
          created_at: string
          date: string
          end_time: string
          id: string
          reason: string | null
          start_time: string
        }
        Insert: {
          court_id: string
          created_at?: string
          date: string
          end_time: string
          id?: string
          reason?: string | null
          start_time: string
        }
        Update: {
          court_id?: string
          created_at?: string
          date?: string
          end_time?: string
          id?: string
          reason?: string | null
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "court_blocks_court_id_fkey"
            columns: ["court_id"]
            isOneToOne: false
            referencedRelation: "courts"
            referencedColumns: ["id"]
          },
        ]
      }
      courts: {
        Row: {
          active: boolean | null
          court_type: Database["public"]["Enums"]["court_type"]
          created_at: string
          id: string
          name: string
          updated_at: string
          venue_id: string
        }
        Insert: {
          active?: boolean | null
          court_type: Database["public"]["Enums"]["court_type"]
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          venue_id: string
        }
        Update: {
          active?: boolean | null
          court_type?: Database["public"]["Enums"]["court_type"]
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "courts_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      operating_hours: {
        Row: {
          close_time: string
          created_at: string
          day_of_week: number
          id: string
          is_closed: boolean | null
          open_time: string
          venue_id: string
        }
        Insert: {
          close_time: string
          created_at?: string
          day_of_week: number
          id?: string
          is_closed?: boolean | null
          open_time: string
          venue_id: string
        }
        Update: {
          close_time?: string
          created_at?: string
          day_of_week?: number
          id?: string
          is_closed?: boolean | null
          open_time?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "operating_hours_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_proofs: {
        Row: {
          created_at: string
          id: string
          proof_type: Database["public"]["Enums"]["proof_type"]
          reservation_id: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          proof_type: Database["public"]["Enums"]["proof_type"]
          reservation_id: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          proof_type?: Database["public"]["Enums"]["proof_type"]
          reservation_id?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_proofs_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      price_rules: {
        Row: {
          amount_deposit: number
          amount_total: number
          court_type: Database["public"]["Enums"]["court_type"]
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          is_peak: boolean | null
          start_time: string
          venue_id: string
        }
        Insert: {
          amount_deposit: number
          amount_total: number
          court_type: Database["public"]["Enums"]["court_type"]
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          is_peak?: boolean | null
          start_time: string
          venue_id: string
        }
        Update: {
          amount_deposit?: number
          amount_total?: number
          court_type?: Database["public"]["Enums"]["court_type"]
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_peak?: boolean | null
          start_time?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "price_rules_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      reservations: {
        Row: {
          amount: number | null
          court_id: string
          created_at: string
          customer_name: string
          date: string
          email: string
          end_time: string
          hold_expires_at: string | null
          id: string
          payment_mode: Database["public"]["Enums"]["payment_mode"] | null
          payment_provider:
            | Database["public"]["Enums"]["payment_provider"]
            | null
          payment_ref: string | null
          phone: string
          start_time: string
          status: Database["public"]["Enums"]["reservation_status"]
          updated_at: string
          venue_id: string
        }
        Insert: {
          amount?: number | null
          court_id: string
          created_at?: string
          customer_name: string
          date: string
          email: string
          end_time: string
          hold_expires_at?: string | null
          id?: string
          payment_mode?: Database["public"]["Enums"]["payment_mode"] | null
          payment_provider?:
            | Database["public"]["Enums"]["payment_provider"]
            | null
          payment_ref?: string | null
          phone: string
          start_time: string
          status?: Database["public"]["Enums"]["reservation_status"]
          updated_at?: string
          venue_id: string
        }
        Update: {
          amount?: number | null
          court_id?: string
          created_at?: string
          customer_name?: string
          date?: string
          email?: string
          end_time?: string
          hold_expires_at?: string | null
          id?: string
          payment_mode?: Database["public"]["Enums"]["payment_mode"] | null
          payment_provider?:
            | Database["public"]["Enums"]["payment_provider"]
            | null
          payment_ref?: string | null
          phone?: string
          start_time?: string
          status?: Database["public"]["Enums"]["reservation_status"]
          updated_at?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_court_id_fkey"
            columns: ["court_id"]
            isOneToOne: false
            referencedRelation: "courts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      venues: {
        Row: {
          active: boolean | null
          address: string
          comuna: string
          created_at: string
          description: string | null
          id: string
          lat: number | null
          lng: number | null
          name: string
          photos: string[] | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          active?: boolean | null
          address: string
          comuna: string
          created_at?: string
          description?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          name: string
          photos?: string[] | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          active?: boolean | null
          address?: string
          comuna?: string
          created_at?: string
          description?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          name?: string
          photos?: string[] | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      court_type: "FUTBOL" | "PADEL"
      payment_mode: "DEPOSIT" | "FULL"
      payment_provider: "WEBPAY_LINK" | "WEBPAY_PLUS"
      proof_type: "TXID" | "IMAGE"
      reservation_status: "HOLD" | "PENDING" | "PAID" | "CANCELLED"
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
      app_role: ["admin", "moderator", "user"],
      court_type: ["FUTBOL", "PADEL"],
      payment_mode: ["DEPOSIT", "FULL"],
      payment_provider: ["WEBPAY_LINK", "WEBPAY_PLUS"],
      proof_type: ["TXID", "IMAGE"],
      reservation_status: ["HOLD", "PENDING", "PAID", "CANCELLED"],
    },
  },
} as const
