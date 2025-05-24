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
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          created_at: string | null
          id: string
          key: string
          last_used_at: string | null
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          key: string
          last_used_at?: string | null
          name: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          key?: string
          last_used_at?: string | null
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      appointments: {
        Row: {
          created_at: string
          date_time: string
          doctor_id: string
          id: string
          location: string
          notes: string | null
          patient_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_time: string
          doctor_id: string
          id?: string
          location: string
          notes?: string | null
          patient_id: string
          status: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_time?: string
          doctor_id?: string
          id?: string
          location?: string
          notes?: string | null
          patient_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_statistics: {
        Row: {
          age: number | null
          assessment_duration: number | null
          assessment_id: string
          created_at: string | null
          diagnoses: Json | null
          doctor_id: string | null
          follow_up_recommended: boolean | null
          gender: string | null
          id: string
          imaging_ordered: boolean | null
          is_first_assessment: boolean | null
          medication_prescribed: boolean | null
          occupation: string | null
          pain_level: number | null
          patient_id: string | null
          sentiment_score: number | null
          symptom_duration_days: number | null
          topics: string[] | null
          treatment_type: number | null
          word_count: number | null
        }
        Insert: {
          age?: number | null
          assessment_duration?: number | null
          assessment_id: string
          created_at?: string | null
          diagnoses?: Json | null
          doctor_id?: string | null
          follow_up_recommended?: boolean | null
          gender?: string | null
          id?: string
          imaging_ordered?: boolean | null
          is_first_assessment?: boolean | null
          medication_prescribed?: boolean | null
          occupation?: string | null
          pain_level?: number | null
          patient_id?: string | null
          sentiment_score?: number | null
          symptom_duration_days?: number | null
          topics?: string[] | null
          treatment_type?: number | null
          word_count?: number | null
        }
        Update: {
          age?: number | null
          assessment_duration?: number | null
          assessment_id?: string
          created_at?: string | null
          diagnoses?: Json | null
          doctor_id?: string | null
          follow_up_recommended?: boolean | null
          gender?: string | null
          id?: string
          imaging_ordered?: boolean | null
          is_first_assessment?: boolean | null
          medication_prescribed?: boolean | null
          occupation?: string | null
          pain_level?: number | null
          patient_id?: string | null
          sentiment_score?: number | null
          symptom_duration_days?: number | null
          topics?: string[] | null
          treatment_type?: number | null
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "assessment_statistics_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: true
            referencedRelation: "patient_assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      cal_bookings: {
        Row: {
          cancel_url: string | null
          created_at: string | null
          doctor_id: string | null
          end_time: string
          id: string
          patient_id: string | null
          raw: Json | null
          reschedule_url: string | null
          start_time: string
          status: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          cancel_url?: string | null
          created_at?: string | null
          doctor_id?: string | null
          end_time: string
          id: string
          patient_id?: string | null
          raw?: Json | null
          reschedule_url?: string | null
          start_time: string
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          cancel_url?: string | null
          created_at?: string | null
          doctor_id?: string | null
          end_time?: string
          id?: string
          patient_id?: string | null
          raw?: Json | null
          reschedule_url?: string | null
          start_time?: string
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cal_bookings_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cal_bookings_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      doctor_document_templates: {
        Row: {
          created_at: string
          description: string | null
          doctor_id: string
          file_path: string
          file_url: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          doctor_id: string
          file_path: string
          file_url?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          doctor_id?: string
          file_path?: string
          file_url?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      doctor_follow_up_schedule: {
        Row: {
          completed_at: string | null
          created_at: string
          doctor_id: string
          follow_up_type: string
          id: string
          notes: string | null
          patient_id: string
          report_id: string
          scheduled_date: string
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          doctor_id: string
          follow_up_type: string
          id?: string
          notes?: string | null
          patient_id: string
          report_id: string
          scheduled_date: string
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          doctor_id?: string
          follow_up_type?: string
          id?: string
          notes?: string | null
          patient_id?: string
          report_id?: string
          scheduled_date?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "doctor_follow_up_schedule_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "post_operative_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      doctor_notifications: {
        Row: {
          created_at: string
          doctor_id: string
          icon_type: string
          id: string
          message: string
          read: boolean
          title: string
        }
        Insert: {
          created_at?: string
          doctor_id: string
          icon_type: string
          id?: string
          message: string
          read?: boolean
          title: string
        }
        Update: {
          created_at?: string
          doctor_id?: string
          icon_type?: string
          id?: string
          message?: string
          read?: boolean
          title?: string
        }
        Relationships: []
      }
      doctor_presentation_templates: {
        Row: {
          based_on: string | null
          created_at: string | null
          customization: Json | null
          description: string | null
          doctor_id: string
          id: string
          is_custom: boolean | null
          name: string
          preview_image: string | null
          updated_at: string | null
        }
        Insert: {
          based_on?: string | null
          created_at?: string | null
          customization?: Json | null
          description?: string | null
          doctor_id: string
          id: string
          is_custom?: boolean | null
          name: string
          preview_image?: string | null
          updated_at?: string | null
        }
        Update: {
          based_on?: string | null
          created_at?: string | null
          customization?: Json | null
          description?: string | null
          doctor_id?: string
          id?: string
          is_custom?: boolean | null
          name?: string
          preview_image?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      doctor_signup_requests: {
        Row: {
          biography: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          license_number: string
          notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          specialty: string
          status: string
        }
        Insert: {
          biography?: string | null
          created_at: string
          email: string
          full_name: string
          id?: string
          license_number: string
          notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          specialty: string
          status?: string
        }
        Update: {
          biography?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          license_number?: string
          notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          specialty?: string
          status?: string
        }
        Relationships: []
      }
      doctors: {
        Row: {
          ai_instructions: string | null
          biography: string | null
          created_at: string
          id: string
          is_active: boolean | null
          license_number: string
          specialty: string
          updated_at: string
        }
        Insert: {
          ai_instructions?: string | null
          biography?: string | null
          created_at?: string
          id: string
          is_active?: boolean | null
          license_number: string
          specialty: string
          updated_at?: string
        }
        Update: {
          ai_instructions?: string | null
          biography?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          license_number?: string
          specialty?: string
          updated_at?: string
        }
        Relationships: []
      }
      patient_assessments: {
        Row: {
          age: number | null
          audio_duration: number | null
          audio_file_path: string | null
          audio_file_url: string | null
          clinical_note: string | null
          created_at: string
          doctor_id: string | null
          document_progress: Json | null
          gender: string | null
          id: string
          patient_email: string
          patient_friendly_summary: string | null
          patient_name: string
          prescription: string | null
          prontuario_id: string
          status: string | null
          structured_data: Json | null
          summary: string | null
          transcription: string | null
          transcription_status: string | null
          updated_at: string
        }
        Insert: {
          age?: number | null
          audio_duration?: number | null
          audio_file_path?: string | null
          audio_file_url?: string | null
          clinical_note?: string | null
          created_at?: string
          doctor_id?: string | null
          document_progress?: Json | null
          gender?: string | null
          id?: string
          patient_email: string
          patient_friendly_summary?: string | null
          patient_name: string
          prescription?: string | null
          prontuario_id: string
          status?: string | null
          structured_data?: Json | null
          summary?: string | null
          transcription?: string | null
          transcription_status?: string | null
          updated_at?: string
        }
        Update: {
          age?: number | null
          audio_duration?: number | null
          audio_file_path?: string | null
          audio_file_url?: string | null
          clinical_note?: string | null
          created_at?: string
          doctor_id?: string | null
          document_progress?: Json | null
          gender?: string | null
          id?: string
          patient_email?: string
          patient_friendly_summary?: string | null
          patient_name?: string
          prescription?: string | null
          prontuario_id?: string
          status?: string | null
          structured_data?: Json | null
          summary?: string | null
          transcription?: string | null
          transcription_status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      patient_notifications: {
        Row: {
          created_at: string
          icon_type: string
          id: string
          message: string
          patient_id: string
          read: boolean
          title: string
        }
        Insert: {
          created_at?: string
          icon_type: string
          id?: string
          message: string
          patient_id: string
          read?: boolean
          title: string
        }
        Update: {
          created_at?: string
          icon_type?: string
          id?: string
          message?: string
          patient_id?: string
          read?: boolean
          title?: string
        }
        Relationships: []
      }
      patient_presentations: {
        Row: {
          assessment_id: string
          created_at: string | null
          custom_data: Json | null
          description: string | null
          error: string | null
          id: string
          slides: Json
          status: string
          template_customization: Json | null
          template_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          assessment_id: string
          created_at?: string | null
          custom_data?: Json | null
          description?: string | null
          error?: string | null
          id?: string
          slides?: Json
          status?: string
          template_customization?: Json | null
          template_id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          assessment_id?: string
          created_at?: string | null
          custom_data?: Json | null
          description?: string | null
          error?: string | null
          id?: string
          slides?: Json
          status?: string
          template_customization?: Json | null
          template_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_presentations_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "patient_assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          allergies: string | null
          birth_date: string | null
          blood_type: string | null
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          allergies?: string | null
          birth_date?: string | null
          blood_type?: string | null
          created_at?: string
          id: string
          updated_at?: string
        }
        Update: {
          allergies?: string | null
          birth_date?: string | null
          blood_type?: string | null
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      post_operative_follow_ups: {
        Row: {
          complications: string | null
          created_at: string
          created_by: string
          follow_up_date: string
          id: string
          next_follow_up_date: string | null
          notes: string | null
          patient_condition: string | null
          status: string
          surgical_request_id: string
        }
        Insert: {
          complications?: string | null
          created_at?: string
          created_by: string
          follow_up_date: string
          id?: string
          next_follow_up_date?: string | null
          notes?: string | null
          patient_condition?: string | null
          status: string
          surgical_request_id: string
        }
        Update: {
          complications?: string | null
          created_at?: string
          created_by?: string
          follow_up_date?: string
          id?: string
          next_follow_up_date?: string | null
          notes?: string | null
          patient_condition?: string | null
          status?: string
          surgical_request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_operative_follow_ups_surgical_request_id_fkey"
            columns: ["surgical_request_id"]
            isOneToOne: false
            referencedRelation: "surgical_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      post_operative_reminders: {
        Row: {
          category: string
          completed_at: string | null
          created_at: string
          description: string
          id: string
          is_completed: boolean | null
          report_id: string
          title: string
        }
        Insert: {
          category: string
          completed_at?: string | null
          created_at?: string
          description: string
          id?: string
          is_completed?: boolean | null
          report_id: string
          title: string
        }
        Update: {
          category?: string
          completed_at?: string | null
          created_at?: string
          description?: string
          id?: string
          is_completed?: boolean | null
          report_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_operative_reminders_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "post_operative_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      post_operative_reports: {
        Row: {
          created_at: string
          doctor_id: string
          id: string
          original_report_url: string
          patient_id: string
          recommendations: string | null
          surgery_summary: string | null
          surgical_request_id: string
          technical_details: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          doctor_id: string
          id?: string
          original_report_url: string
          patient_id: string
          recommendations?: string | null
          surgery_summary?: string | null
          surgical_request_id: string
          technical_details?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          doctor_id?: string
          id?: string
          original_report_url?: string
          patient_id?: string
          recommendations?: string | null
          surgery_summary?: string | null
          surgical_request_id?: string
          technical_details?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      presentation_downloads: {
        Row: {
          created_at: string
          downloaded_at: string | null
          error: string | null
          file_format: string | null
          file_path: string | null
          id: number
          presentation_id: string | null
          storage_url: string | null
        }
        Insert: {
          created_at?: string
          downloaded_at?: string | null
          error?: string | null
          file_format?: string | null
          file_path?: string | null
          id?: number
          presentation_id?: string | null
          storage_url?: string | null
        }
        Update: {
          created_at?: string
          downloaded_at?: string | null
          error?: string | null
          file_format?: string | null
          file_path?: string | null
          id?: number
          presentation_id?: string | null
          storage_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "presentation_downloads_presentation_id_fkey"
            columns: ["presentation_id"]
            isOneToOne: false
            referencedRelation: "patient_presentations"
            referencedColumns: ["id"]
          },
        ]
      }
      presentation_jobs: {
        Row: {
          assessment_id: string
          attempts: number
          completed_at: string | null
          created_at: string | null
          error: string | null
          id: string
          locked_by: string | null
          locked_until: string | null
          max_attempts: number
          metadata: Json | null
          presentation_id: string
          priority: number
          progress: Json | null
          status: string
          template_customization: Json | null
          template_id: string
          updated_at: string | null
        }
        Insert: {
          assessment_id: string
          attempts?: number
          completed_at?: string | null
          created_at?: string | null
          error?: string | null
          id?: string
          locked_by?: string | null
          locked_until?: string | null
          max_attempts?: number
          metadata?: Json | null
          presentation_id: string
          priority?: number
          progress?: Json | null
          status?: string
          template_customization?: Json | null
          template_id: string
          updated_at?: string | null
        }
        Update: {
          assessment_id?: string
          attempts?: number
          completed_at?: string | null
          created_at?: string | null
          error?: string | null
          id?: string
          locked_by?: string | null
          locked_until?: string | null
          max_attempts?: number
          metadata?: Json | null
          presentation_id?: string
          priority?: number
          progress?: Json | null
          status?: string
          template_customization?: Json | null
          template_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "presentation_jobs_presentation_id_fkey"
            columns: ["presentation_id"]
            isOneToOne: false
            referencedRelation: "patient_presentations"
            referencedColumns: ["id"]
          },
        ]
      }
      presentation_templates: {
        Row: {
          created_at: string | null
          default_customization: Json | null
          description: string | null
          id: string
          is_custom: boolean | null
          name: string
          preview_image: string | null
          slide_types: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          default_customization?: Json | null
          description?: string | null
          id: string
          is_custom?: boolean | null
          name: string
          preview_image?: string | null
          slide_types?: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          default_customization?: Json | null
          description?: string | null
          id?: string
          is_custom?: boolean | null
          name?: string
          preview_image?: string | null
          slide_types?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          approval_status: string | null
          cal_com_user_id: number | null
          created_at: string
          email: string
          full_name: string
          id: string
          role: string | null
          updated_at: string
          user_type: string
        }
        Insert: {
          approval_status?: string | null
          cal_com_user_id?: number | null
          created_at?: string
          email: string
          full_name: string
          id: string
          role?: string | null
          updated_at?: string
          user_type: string
        }
        Update: {
          approval_status?: string | null
          cal_com_user_id?: number | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          role?: string | null
          updated_at?: string
          user_type?: string
        }
        Relationships: []
      }
      slide_jobs: {
        Row: {
          attempts: number
          completed_at: string | null
          created_at: string | null
          error: string | null
          id: string
          image_path: string | null
          locked_by: string | null
          locked_until: string | null
          max_attempts: number
          presentation_job_id: string
          slide_data: Json
          slide_index: number
          status: string
          updated_at: string | null
        }
        Insert: {
          attempts?: number
          completed_at?: string | null
          created_at?: string | null
          error?: string | null
          id?: string
          image_path?: string | null
          locked_by?: string | null
          locked_until?: string | null
          max_attempts?: number
          presentation_job_id: string
          slide_data: Json
          slide_index: number
          status?: string
          updated_at?: string | null
        }
        Update: {
          attempts?: number
          completed_at?: string | null
          created_at?: string | null
          error?: string | null
          id?: string
          image_path?: string | null
          locked_by?: string | null
          locked_until?: string | null
          max_attempts?: number
          presentation_job_id?: string
          slide_data?: Json
          slide_index?: number
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "slide_jobs_presentation_job_id_fkey"
            columns: ["presentation_job_id"]
            isOneToOne: false
            referencedRelation: "presentation_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      super_admins: {
        Row: {
          created_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      surgical_requests: {
        Row: {
          approved_at: string | null
          assessment_id: string
          clinical_indication: string
          created_at: string
          doctor_id: string
          estimated_duration: number | null
          hospital_location: string | null
          icd10_code: string
          id: string
          medical_report: string | null
          notes: string | null
          opme_companies: string[] | null
          opme_materials: Json | null
          patient_cpf: string | null
          patient_email: string | null
          patient_health_plan: string | null
          patient_id: string
          patient_name: string
          patient_phone: string | null
          procedure_codes: string[] | null
          procedure_name: string
          rejection_reason: string | null
          scheduled_date: string | null
          status: string
          submitted_at: string | null
          surgery_completed_at: string | null
          updated_at: string
          urgency_level: string
        }
        Insert: {
          approved_at?: string | null
          assessment_id: string
          clinical_indication: string
          created_at?: string
          doctor_id: string
          estimated_duration?: number | null
          hospital_location?: string | null
          icd10_code: string
          id?: string
          medical_report?: string | null
          notes?: string | null
          opme_companies?: string[] | null
          opme_materials?: Json | null
          patient_cpf?: string | null
          patient_email?: string | null
          patient_health_plan?: string | null
          patient_id: string
          patient_name: string
          patient_phone?: string | null
          procedure_codes?: string[] | null
          procedure_name: string
          rejection_reason?: string | null
          scheduled_date?: string | null
          status?: string
          submitted_at?: string | null
          surgery_completed_at?: string | null
          updated_at?: string
          urgency_level: string
        }
        Update: {
          approved_at?: string | null
          assessment_id?: string
          clinical_indication?: string
          created_at?: string
          doctor_id?: string
          estimated_duration?: number | null
          hospital_location?: string | null
          icd10_code?: string
          id?: string
          medical_report?: string | null
          notes?: string | null
          opme_companies?: string[] | null
          opme_materials?: Json | null
          patient_cpf?: string | null
          patient_email?: string | null
          patient_health_plan?: string | null
          patient_id?: string
          patient_name?: string
          patient_phone?: string | null
          procedure_codes?: string[] | null
          procedure_name?: string
          rejection_reason?: string | null
          scheduled_date?: string | null
          status?: string
          submitted_at?: string | null
          surgery_completed_at?: string | null
          updated_at?: string
          urgency_level?: string
        }
        Relationships: [
          {
            foreignKeyName: "surgical_requests_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "patient_assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      system_documentation: {
        Row: {
          content: string
          created_at: string
          id: number
          topic: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: number
          topic: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: number
          topic?: string
        }
        Relationships: []
      }
      transcription_queue: {
        Row: {
          assessment_id: string | null
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          file_path: string
          id: string
          options: Json | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          assessment_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          file_path: string
          id?: string
          options?: Json | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          assessment_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          file_path?: string
          id?: string
          options?: Json | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transcription_queue_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "patient_assessments"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      activate_all_doctors: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      activate_doctor: {
        Args: { doctor_id: string }
        Returns: boolean
      }
      approve_doctor: {
        Args: { doctor_email: string } | { doctor_id: string }
        Returns: undefined
      }
      bytea_to_text: {
        Args: { data: string }
        Returns: string
      }
      check_table_exists: {
        Args: { table_name: string }
        Returns: boolean
      }
      create_surgical_request_from_assessment: {
        Args: {
          p_assessment_id: string
          p_procedure_name: string
          p_procedure_codes: string[]
          p_icd10_code: string
          p_urgency_level: string
          p_opme_materials?: Json
          p_opme_companies?: string[]
        }
        Returns: string
      }
      doctor_approval_claims: {
        Args: { uid: string }
        Returns: Json
      }
      execute_migration: {
        Args: { migration_name: string }
        Returns: Json
      }
      get_columns_for_table: {
        Args: { table_name: string }
        Returns: {
          column_name: string
          data_type: string
          is_nullable: boolean
        }[]
      }
      get_doctor_signup_details: {
        Args: { request_id: string }
        Returns: Json
      }
      get_documentation: {
        Args: { topic_name: string }
        Returns: string
      }
      get_inactive_doctors: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          license_number: string
          specialty: string
          full_name: string
          email: string
        }[]
      }
      get_surgical_requests_dashboard: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          procedure_name: string
          patient_name: string
          status: string
          urgency_level: string
          created_at: string
          scheduled_date: string
          is_doctor_view: boolean
        }[]
      }
      http: {
        Args: { request: Database["public"]["CompositeTypes"]["http_request"] }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_delete: {
        Args:
          | { uri: string }
          | { uri: string; content: string; content_type: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_get: {
        Args: { uri: string } | { uri: string; data: Json }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_head: {
        Args: { uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_header: {
        Args: { field: string; value: string }
        Returns: Database["public"]["CompositeTypes"]["http_header"]
      }
      http_list_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: {
          curlopt: string
          value: string
        }[]
      }
      http_patch: {
        Args: { uri: string; content: string; content_type: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_post: {
        Args:
          | { uri: string; content: string; content_type: string }
          | { uri: string; data: Json }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_put: {
        Args: { uri: string; content: string; content_type: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_reset_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      http_set_curlopt: {
        Args: { curlopt: string; value: string }
        Returns: boolean
      }
      is_doctor: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_patient: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_super_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      reject_doctor: {
        Args: { doctor_id: string; rejection_reason?: string }
        Returns: undefined
      }
      text_to_bytea: {
        Args: { data: string }
        Returns: string
      }
      urlencode: {
        Args: { data: Json } | { string: string } | { string: string }
        Returns: string
      }
      validate_slides_json: {
        Args: { slides: Json }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      http_header: {
        field: string | null
        value: string | null
      }
      http_request: {
        method: unknown | null
        uri: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content_type: string | null
        content: string | null
      }
      http_response: {
        status: number | null
        content_type: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content: string | null
      }
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
