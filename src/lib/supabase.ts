// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Type definitions for your database tables
export type Database = {
  public: {
    Tables: {
      // site_content table removed
      pages: {
        Row: {
          id: string;
          slug: string;
          title: string;
          subtitle: string | null;
          description: string | null;
          content_en: string;
          content_ar: string | null;
          meta: { [key: string]: any } | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          subtitle?: string | null;
          description?: string | null;
          content_en: string;
          content_ar?: string | null;
          meta?: { [key: string]: any } | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          subtitle?: string | null;
          description?: string | null;
          content_en?: string;
          content_ar?: string | null;
          meta?: { [key: string]: any } | null;
          created_at?: string;
          updated_at?: string | null;
        };
      };
    };
  };
};