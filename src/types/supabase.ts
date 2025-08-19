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
          created_at: string
          name: string
          age: number | null
          city: string | null
          previous_yoga_experience: boolean
          experience_years: number | null
          goals: string | null
          health_conditions: string[] | null
        }
        Insert: {
          id: string
          created_at?: string
          name: string
          age?: number | null
          city?: string | null
          previous_yoga_experience?: boolean
          experience_years?: number | null
          goals?: string | null
          health_conditions?: string[] | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          age?: number | null
          city?: string | null
          previous_yoga_experience?: boolean
          experience_years?: number | null
          goals?: string | null
          health_conditions?: string[] | null
        }
      }
      feedback: {
        Row: {
          id: string
          created_at: string
          user_id: string
          rating: number
          is_user_friendly: boolean
          suggestions: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          rating: number
          is_user_friendly: boolean
          suggestions?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          rating?: number
          is_user_friendly?: boolean
          suggestions?: string | null
        }
      }
      health_assessments: {
        Row: {
          id: string
          created_at: string
          user_id: string
          back_pain: boolean
          neck_pain: boolean
          stress: boolean
          insomnia: boolean
          digestive_issues: boolean
          joint_pain: boolean
          high_blood_pressure: boolean
          obesity: boolean
          respiratory_issues: boolean
          diabetes: boolean
          arthritis: boolean
          anxiety: boolean
          depression: boolean
          migraine: boolean
          thyroid: boolean
          heart_disease: boolean
          asthma: boolean
          allergies: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          back_pain?: boolean
          neck_pain?: boolean
          stress?: boolean
          insomnia?: boolean
          digestive_issues?: boolean
          joint_pain?: boolean
          high_blood_pressure?: boolean
          obesity?: boolean
          respiratory_issues?: boolean
          diabetes?: boolean
          arthritis?: boolean
          anxiety?: boolean
          depression?: boolean
          migraine?: boolean
          thyroid?: boolean
          heart_disease?: boolean
          asthma?: boolean
          allergies?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          back_pain?: boolean
          neck_pain?: boolean
          stress?: boolean
          insomnia?: boolean
          digestive_issues?: boolean
          joint_pain?: boolean
          high_blood_pressure?: boolean
          obesity?: boolean
          respiratory_issues?: boolean
          diabetes?: boolean
          arthritis?: boolean
          anxiety?: boolean
          depression?: boolean
          migraine?: boolean
          thyroid?: boolean
          heart_disease?: boolean
          asthma?: boolean
          allergies?: boolean
        }
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
  }
}