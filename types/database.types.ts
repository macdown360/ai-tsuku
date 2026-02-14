export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          website: string | null
          github_url: string | null
          x_url: string | null
          linkedin_url: string | null
          note_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          github_url?: string | null
          x_url?: string | null
          linkedin_url?: string | null
          note_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          github_url?: string | null
          x_url?: string | null
          linkedin_url?: string | null
          note_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          url: string
          image_url: string | null
          categories: string[]
          tags: string[]
          likes_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description: string
          url: string
          image_url?: string | null
          categories?: string[]
          tags?: string[]
          likes_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          url?: string
          image_url?: string | null
          categories?: string[]
          tags?: string[]
          likes_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      likes: {
        Row: {
          id: string
          user_id: string
          project_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string
          created_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          project_id: string
          user_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
