// lib/supabase/types.ts
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Database = {
  public: {
    Tables: {
      surveys: {
        Row: {
          id: string;
          title: string;
          json: Json;
          created_by: string;
          public: boolean;
          status: "active" | "inactive";
          starts_at: string | null;
          ends_at: string | null;
          created_at: string;
        };
        Insert: {
          title: string;
          json: Json;
          created_by: string;
          public?: boolean;
          status?: "active" | "inactive";
          starts_at?: string | null;
          ends_at?: string | null;
        };
        Update: {};
      };
      // add other tables...
    };
    Views: {};
    Functions: {};
  };
};
