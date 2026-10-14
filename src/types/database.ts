// Generated from the live Supabase schema (Supabase MCP generate_typescript_types, October 2026).
// Regenerate after a schema change (or run: npx supabase gen types typescript --project-id <id>).
// client_errors is added by hand at the bottom until database/client-errors.sql has been run.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '14.5'
  }
  public: {
    Tables: {
      error_pattern_rule_links: {
        Row: { created_at: string; error_pattern_id: string; id: string; note: string | null; rule_id: string; weight: number }
        Insert: { created_at?: string; error_pattern_id: string; id?: string; note?: string | null; rule_id: string; weight?: number }
        Update: { created_at?: string; error_pattern_id?: string; id?: string; note?: string | null; rule_id?: string; weight?: number }
      }
      error_patterns: {
        Row: { created_at: string; description: string | null; id: string; is_active: boolean; label: string; slug: string; tier: string }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          label: string
          slug: string
          tier: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          label?: string
          slug?: string
          tier?: string
        }
      }
      learning_snapshots: {
        Row: { payload: Json; updated_at: string; user_id: string }
        Insert: { payload?: Json; updated_at?: string; user_id: string }
        Update: { payload?: Json; updated_at?: string; user_id?: string }
      }
      mistake_error_patterns: {
        Row: {
          confidence: number
          created_at: string
          detail: string | null
          error_pattern_id: string
          id: string
          mistake_event_id: string
          user_id: string
        }
        Insert: {
          confidence?: number
          created_at?: string
          detail?: string | null
          error_pattern_id: string
          id?: string
          mistake_event_id: string
          user_id: string
        }
        Update: {
          confidence?: number
          created_at?: string
          detail?: string | null
          error_pattern_id?: string
          id?: string
          mistake_event_id?: string
          user_id?: string
        }
      }
      mistake_events: {
        Row: {
          category: string
          correct_answer: string | null
          created_at: string
          error_category: string | null
          error_type: string | null
          id: string
          task_id: string | null
          user_answer: string | null
          user_id: string
          word_id: string | null
        }
        Insert: {
          category?: string
          correct_answer?: string | null
          created_at?: string
          error_category?: string | null
          error_type?: string | null
          id?: string
          task_id?: string | null
          user_answer?: string | null
          user_id: string
          word_id?: string | null
        }
        Update: {
          category?: string
          correct_answer?: string | null
          created_at?: string
          error_category?: string | null
          error_type?: string | null
          id?: string
          task_id?: string | null
          user_answer?: string | null
          user_id?: string
          word_id?: string | null
        }
      }
      mistake_rule_links: {
        Row: { created_at: string; id: string; mistake_event_id: string; rule_id: string; user_id: string }
        Insert: { created_at?: string; id?: string; mistake_event_id: string; rule_id: string; user_id: string }
        Update: { created_at?: string; id?: string; mistake_event_id?: string; rule_id?: string; user_id?: string }
      }
      rule_examples: {
        Row: {
          correction: string | null
          created_at: string
          example_type: string
          id: string
          note: string | null
          rule_id: string
          text: string
        }
        Insert: {
          correction?: string | null
          created_at?: string
          example_type: string
          id?: string
          note?: string | null
          rule_id: string
          text: string
        }
        Update: {
          correction?: string | null
          created_at?: string
          example_type?: string
          id?: string
          note?: string | null
          rule_id?: string
          text?: string
        }
      }
      rule_exercises: {
        Row: {
          answer: string
          choices: Json | null
          created_at: string
          exercise_type: string
          id: string
          metadata: Json
          prompt: string
          rule_id: string
        }
        Insert: {
          answer: string
          choices?: Json | null
          created_at?: string
          exercise_type: string
          id?: string
          metadata?: Json
          prompt: string
          rule_id: string
        }
        Update: {
          answer?: string
          choices?: Json | null
          created_at?: string
          exercise_type?: string
          id?: string
          metadata?: Json
          prompt?: string
          rule_id?: string
        }
      }
      rule_practice_attempts: {
        Row: { created_at: string; exercise_id: string | null; id: string; is_correct: boolean; rule_id: string; user_id: string }
        Insert: { created_at?: string; exercise_id?: string | null; id?: string; is_correct: boolean; rule_id: string; user_id: string }
        Update: { created_at?: string; exercise_id?: string | null; id?: string; is_correct?: boolean; rule_id?: string; user_id?: string }
      }
      rule_relationships: {
        Row: { created_at: string; id: string; related_rule_id: string; relation_type: string | null; rule_id: string }
        Insert: { created_at?: string; id?: string; related_rule_id: string; relation_type?: string | null; rule_id: string }
        Update: { created_at?: string; id?: string; related_rule_id?: string; relation_type?: string | null; rule_id?: string }
      }
      rule_word_links: {
        Row: { created_at: string; id: string; note: string | null; relation: string; rule_id: string; word_id: string }
        Insert: { created_at?: string; id?: string; note?: string | null; relation?: string; rule_id: string; word_id: string }
        Update: { created_at?: string; id?: string; note?: string | null; relation?: string; rule_id?: string; word_id?: string }
      }
      rules: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          metadata: Json
          mnemonic: string | null
          rule_type: string
          short_explanation: string
          slug: string
          source: string
          title: string
          tts_text: string | null
          updated_at: string
          visibility: string
        }
        Insert: {
          category: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          metadata?: Json
          mnemonic?: string | null
          rule_type: string
          short_explanation: string
          slug: string
          source?: string
          title: string
          tts_text?: string | null
          updated_at?: string
          visibility?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          metadata?: Json
          mnemonic?: string | null
          rule_type?: string
          short_explanation?: string
          slug?: string
          source?: string
          title?: string
          tts_text?: string | null
          updated_at?: string
          visibility?: string
        }
      }
      user_rule_notes: {
        Row: { id: string; note: string; rule_id: string; updated_at: string; user_id: string }
        Insert: { id?: string; note: string; rule_id: string; updated_at?: string; user_id: string }
        Update: { id?: string; note?: string; rule_id?: string; updated_at?: string; user_id?: string }
      }
      user_rule_progress: {
        Row: {
          correct_calendar_days: string[]
          correct_count: number
          created_at: string
          id: string
          last_result_at: string | null
          mistake_count: number
          priority: string
          rule_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          correct_calendar_days?: string[]
          correct_count?: number
          created_at?: string
          id?: string
          last_result_at?: string | null
          mistake_count?: number
          priority?: string
          rule_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          correct_calendar_days?: string[]
          correct_count?: number
          created_at?: string
          id?: string
          last_result_at?: string | null
          mistake_count?: number
          priority?: string
          rule_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
      }
      word_reports: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          library: string | null
          reason: string
          status: string
          translation: string | null
          updated_at: string
          user_id: string
          word: string
          word_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          library?: string | null
          reason: string
          status?: string
          translation?: string | null
          updated_at?: string
          user_id?: string
          word: string
          word_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          library?: string | null
          reason?: string
          status?: string
          translation?: string | null
          updated_at?: string
          user_id?: string
          word?: string
          word_id?: string
        }
      }
      // Added by hand: database/client-errors.sql
      client_errors: {
        Row: {
          id: number
          user_id: string
          message: string
          stack: string | null
          page: string
          app_version: string
          user_agent: string | null
          created_at: string
        }
        Insert: {
          user_id: string
          message: string
          stack?: string | null
          page: string
          app_version: string
          user_agent?: string | null
          created_at?: string
        }
        Update: never
      }
      // Added by hand: database/feedback.sql
      feedback: {
        Row: {
          id: string
          user_id: string
          kind: string
          message: string
          page: string
          app_version: string
          user_agent: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          kind: string
          message: string
          page: string
          app_version: string
          user_agent?: string | null
          created_at?: string
        }
        Update: never
      }
    }
  }
}

export type TableName = keyof Database['public']['Tables']
/** A row as the database returns it. */
export type Row<T extends TableName> = Database['public']['Tables'][T]['Row']
/** What may be sent when adding a row. */
export type Insert<T extends TableName> = Database['public']['Tables'][T]['Insert']
