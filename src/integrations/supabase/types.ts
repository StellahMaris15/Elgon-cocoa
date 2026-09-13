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
      farmers: {
        Row: {
          backdrop_cocoa: string | null
          backdrop_coffee: string | null
          backdrop_vanilla: string | null
          created_at: string
          crops: string[]
          district: string
          email: string | null
          id: string
          name: string
          phone: string | null
          photo_url: string | null
          published: boolean
          role: string
          slug: string | null
          sort_order: number
          story: string
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          backdrop_cocoa?: string | null
          backdrop_coffee?: string | null
          backdrop_vanilla?: string | null
          created_at?: string
          crops?: string[]
          district?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          photo_url?: string | null
          published?: boolean
          role?: string
          slug?: string | null
          sort_order?: number
          story?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          backdrop_cocoa?: string | null
          backdrop_coffee?: string | null
          backdrop_vanilla?: string | null
          created_at?: string
          crops?: string[]
          district?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          photo_url?: string | null
          published?: boolean
          role?: string
          slug?: string | null
          sort_order?: number
          story?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          admin_notes: string | null
          company: string | null
          country: string | null
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          notified: boolean
          phone: string | null
          product_slugs: string[]
          source: string
          status: string
          updated_at: string
          volume: string | null
        }
        Insert: {
          admin_notes?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          notified?: boolean
          phone?: string | null
          product_slugs?: string[]
          source?: string
          status?: string
          updated_at?: string
          volume?: string | null
        }
        Update: {
          admin_notes?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          notified?: boolean
          phone?: string | null
          product_slugs?: string[]
          source?: string
          status?: string
          updated_at?: string
          volume?: string | null
        }
        Relationships: []
      }
      inquiry_settings: {
        Row: {
          auto_reply_body: string
          auto_reply_enabled: boolean
          auto_reply_subject: string
          id: boolean
          notification_emails: string[]
          updated_at: string
        }
        Insert: {
          auto_reply_body?: string
          auto_reply_enabled?: boolean
          auto_reply_subject?: string
          id?: boolean
          notification_emails?: string[]
          updated_at?: string
        }
        Update: {
          auto_reply_body?: string
          auto_reply_enabled?: boolean
          auto_reply_subject?: string
          id?: boolean
          notification_emails?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      leadership_members: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          initials: string
          name: string
          profile_url: string | null
          published: boolean
          quote: string
          sort_order: number
          title: string
          updated_at: string
          whatsapp_number: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          initials?: string
          name: string
          profile_url?: string | null
          published?: boolean
          quote?: string
          sort_order?: number
          title?: string
          updated_at?: string
          whatsapp_number?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          initials?: string
          name?: string
          profile_url?: string | null
          published?: boolean
          quote?: string
          sort_order?: number
          title?: string
          updated_at?: string
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      leadership_settings: {
        Row: {
          eyebrow: string
          headline: string
          id: boolean
          primary_phone: string
          secondary_phone: string
          structure_body: string
          structure_label: string
          updated_at: string
        }
        Insert: {
          eyebrow?: string
          headline?: string
          id?: boolean
          primary_phone?: string
          secondary_phone?: string
          structure_body?: string
          structure_label?: string
          updated_at?: string
        }
        Update: {
          eyebrow?: string
          headline?: string
          id?: boolean
          primary_phone?: string
          secondary_phone?: string
          structure_body?: string
          structure_label?: string
          updated_at?: string
        }
        Relationships: []
      }
      partner_logos: {
        Row: {
          created_at: string
          id: string
          logo_url: string | null
          name: string
          published: boolean
          sort_order: number
          updated_at: string
          website_url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          published?: boolean
          sort_order?: number
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          published?: boolean
          sort_order?: number
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      partner_settings: {
        Row: {
          body: string
          eyebrow: string
          headline: string
          id: boolean
          updated_at: string
        }
        Insert: {
          body?: string
          eyebrow?: string
          headline?: string
          id?: boolean
          updated_at?: string
        }
        Update: {
          body?: string
          eyebrow?: string
          headline?: string
          id?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          capacity: string
          category: string
          created_at: string
          description: string
          featured: boolean
          grades: string[]
          id: string
          images: string[]
          name: string
          origin: string
          published: boolean
          short_description: string
          slug: string
          sort_order: number
          tagline: string
          updated_at: string
          variants: Json
        }
        Insert: {
          capacity?: string
          category: string
          created_at?: string
          description?: string
          featured?: boolean
          grades?: string[]
          id?: string
          images?: string[]
          name: string
          origin?: string
          published?: boolean
          short_description?: string
          slug: string
          sort_order?: number
          tagline?: string
          updated_at?: string
          variants?: Json
        }
        Update: {
          capacity?: string
          category?: string
          created_at?: string
          description?: string
          featured?: boolean
          grades?: string[]
          id?: string
          images?: string[]
          name?: string
          origin?: string
          published?: boolean
          short_description?: string
          slug?: string
          sort_order?: number
          tagline?: string
          updated_at?: string
          variants?: Json
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
        }
        Relationships: []
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
      admin_exists: { Args: never; Returns: boolean }
      claim_first_admin: { Args: never; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "editor" | "user"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "editor", "user"],
    },
  },
} as const
