/**
 * TypeScript types for Supabase database schema
 * Generated from docs/SUPABASE-MIGRATION.sql (2919 lines)
 * Last updated: 2026-02-04
 */

// ============================================================================
// ENUM TYPES
// ============================================================================

export type UserRole =
  | 'admin'
  | 'manager'
  | 'sales'
  | 'support'
  | 'marketing'
  | 'technician'
  | 'dispatcher'
  | 'project_manager';
export type UserStatus = 'active' | 'inactive' | 'pending' | 'on_field';
export type AccessLevel = 'Full' | 'Restricted' | 'Limited';
export type SubscriptionTier = 'free' | 'pro' | 'enterprise';

export type CompanyStatus = 'prospect' | 'customer' | 'partner' | 'inactive';
export type ContactType = 'lead' | 'customer' | 'partner';

export type OpportunitySource = 'webform' | 'lead' | 'referral';
export type CustomerSatisfaction =
  | 'happy'
  | 'unhappy'
  | 'very_satisfied'
  | 'satisfied'
  | 'neutral'
  | 'dissatisfied'
  | 'very_dissatisfied';

export type TaskStatus =
  | 'Backlog'
  | 'To Do'
  | 'In Progress'
  | 'In Review'
  | 'Blocked'
  | 'Completed'
  | 'Cancelled';
export type TaskPriority = 'Low' | 'Normal' | 'High' | 'Urgent';

export type JobStatus = 'scheduled' | 'dispatched' | 'on_field' | 'completed' | 'cancelled';
export type JobPriority = 'Low' | 'Normal' | 'High' | 'Urgent';

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'partially_paid' | 'overdue' | 'void';
export type SyncStatus = 'pending' | 'synced' | 'failed';

export type AddressType = 'billing' | 'shipping' | 'service' | 'home' | 'work' | 'other';
export type PhoneType = 'mobile' | 'home' | 'work' | 'fax' | 'other';

// ============================================================================
// DATABASE INTERFACE
// ============================================================================

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          logo_url: string | null;
          subscription_tier: SubscriptionTier;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          logo_url?: string | null;
          subscription_tier?: SubscriptionTier;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          logo_url?: string | null;
          subscription_tier?: SubscriptionTier;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      profiles: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          avatar_url: string | null;
          role: UserRole;
          status: UserStatus;
          department: string | null;
          access_level: AccessLevel | null;
          teams: string[] | null;
          organization_id: string;
          territory: string | null;
          manager_id: string | null;
          monthly_quota: number | null;
          quarterly_quota: number | null;
          annual_quota: number | null;
          commission_rate: number | null;
          certification: string | null;
          current_location_name: string | null;
          service_areas: string[] | null;
          timezone: string;
          language: string;
          notification_preferences: Record<string, any>;
          working_hours: Record<string, any>;
          created_at: string;
          updated_at: string;
          last_active_at: string | null;
          last_login_ip: string | null;
          deleted_at: string | null;
        };
        Insert: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          avatar_url?: string | null;
          role?: UserRole;
          status?: UserStatus;
          department?: string | null;
          access_level?: AccessLevel | null;
          teams?: string[] | null;
          organization_id: string;
          territory?: string | null;
          manager_id?: string | null;
          monthly_quota?: number | null;
          quarterly_quota?: number | null;
          annual_quota?: number | null;
          commission_rate?: number | null;
          certification?: string | null;
          current_location_name?: string | null;
          service_areas?: string[] | null;
          timezone?: string;
          language?: string;
          notification_preferences?: Record<string, any>;
          working_hours?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
          last_active_at?: string | null;
          last_login_ip?: string | null;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          avatar_url?: string | null;
          role?: UserRole;
          status?: UserStatus;
          department?: string | null;
          access_level?: AccessLevel | null;
          teams?: string[] | null;
          organization_id?: string;
          territory?: string | null;
          manager_id?: string | null;
          monthly_quota?: number | null;
          quarterly_quota?: number | null;
          annual_quota?: number | null;
          commission_rate?: number | null;
          certification?: string | null;
          current_location_name?: string | null;
          service_areas?: string[] | null;
          timezone?: string;
          language?: string;
          notification_preferences?: Record<string, any>;
          working_hours?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
          last_active_at?: string | null;
          last_login_ip?: string | null;
          deleted_at?: string | null;
        };
      };
      companies: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          description: string | null;
          industry: string | null;
          website: string | null;
          email: string | null;
          linkedin_url: string | null;
          location: string | null;
          status: CompanyStatus;
          employee_count: string | null;
          annual_revenue: number;
          source: string | null;
          source_description: string | null;
          tags: string[];
          last_contact_date: string | null;
          primary_contact_id: string | null;
          assigned_to: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          description?: string | null;
          industry?: string | null;
          website?: string | null;
          email?: string | null;
          linkedin_url?: string | null;
          location?: string | null;
          status?: CompanyStatus;
          employee_count?: string | null;
          annual_revenue?: number;
          source?: string | null;
          source_description?: string | null;
          tags?: string[];
          last_contact_date?: string | null;
          primary_contact_id?: string | null;
          assigned_to?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          organization_id?: string;
          name?: string;
          description?: string | null;
          industry?: string | null;
          website?: string | null;
          email?: string | null;
          linkedin_url?: string | null;
          location?: string | null;
          status?: CompanyStatus;
          employee_count?: string | null;
          annual_revenue?: number;
          source?: string | null;
          source_description?: string | null;
          tags?: string[];
          last_contact_date?: string | null;
          primary_contact_id?: string | null;
          assigned_to?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      contacts: {
        Row: {
          id: string;
          organization_id: string;
          first_name: string;
          last_name: string;
          email: string;
          job_title: string | null;
          company_id: string | null;
          type: ContactType;
          status: string;
          source: string | null;
          source_description: string | null;
          lead_score: number;
          tags: string[];
          notes: string | null;
          linkedin_url: string | null;
          last_contact_date: string | null;
          custom_fields: Record<string, any>;
          assigned_to: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          organization_id: string;
          first_name: string;
          last_name: string;
          email: string;
          job_title?: string | null;
          company_id?: string | null;
          type?: ContactType;
          status?: string;
          source?: string | null;
          source_description?: string | null;
          lead_score?: number;
          tags?: string[];
          notes?: string | null;
          linkedin_url?: string | null;
          last_contact_date?: string | null;
          custom_fields?: Record<string, any>;
          assigned_to?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          organization_id?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          job_title?: string | null;
          company_id?: string | null;
          type?: ContactType;
          status?: string;
          source?: string | null;
          source_description?: string | null;
          lead_score?: number;
          tags?: string[];
          notes?: string | null;
          linkedin_url?: string | null;
          last_contact_date?: string | null;
          custom_fields?: Record<string, any>;
          assigned_to?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      opportunities: {
        Row: {
          id: string;
          organization_id: string;
          title: string;
          contact_id: string | null;
          company_id: string | null;
          value: number;
          actual_revenue: number;
          pipeline_id: string | null;
          pipeline_stage_id: string | null;
          source: OpportunitySource;
          customer_satisfaction: CustomerSatisfaction | null;
          loss_reason: string | null;
          scheduled_date: string | null;
          completed_date: string | null;
          assigned_to: string | null;
          technician_id: string | null;
          custom_fields: Record<string, any>;
          created_by: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          organization_id: string;
          title: string;
          contact_id?: string | null;
          company_id?: string | null;
          value?: number;
          actual_revenue?: number;
          pipeline_id?: string | null;
          pipeline_stage_id?: string | null;
          source?: OpportunitySource;
          customer_satisfaction?: CustomerSatisfaction | null;
          loss_reason?: string | null;
          scheduled_date?: string | null;
          completed_date?: string | null;
          assigned_to?: string | null;
          technician_id?: string | null;
          custom_fields?: Record<string, any>;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          organization_id?: string;
          title?: string;
          contact_id?: string | null;
          company_id?: string | null;
          value?: number;
          actual_revenue?: number;
          pipeline_id?: string | null;
          pipeline_stage_id?: string | null;
          source?: OpportunitySource;
          customer_satisfaction?: CustomerSatisfaction | null;
          loss_reason?: string | null;
          scheduled_date?: string | null;
          completed_date?: string | null;
          assigned_to?: string | null;
          technician_id?: string | null;
          custom_fields?: Record<string, any>;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      tasks: {
        Row: {
          id: string;
          organization_id: string;
          parent_id: string | null;
          parent_type: 'contact' | 'company' | 'opportunity' | 'profile' | null;
          parent_task_id: string | null;
          title: string;
          description: string | null;
          status: TaskStatus;
          priority: TaskPriority;
          due_date: string | null;
          start_date: string | null;
          reminder_date: string | null;
          assigned_to: string | null;
          team_id: string | null;
          watchers: string[] | null;
          created_by: string | null;
          estimated_hours: number | null;
          actual_hours: number | null;
          tags: string[] | null;
          checklists: Record<string, any>[];
          attachments: Record<string, any>[];
          is_completed: boolean;
          completed_at: string | null;
          completed_by: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          organization_id: string;
          parent_id?: string | null;
          parent_type?: 'contact' | 'company' | 'opportunity' | 'profile' | null;
          parent_task_id?: string | null;
          title: string;
          description?: string | null;
          status?: TaskStatus;
          priority?: TaskPriority;
          due_date?: string | null;
          start_date?: string | null;
          reminder_date?: string | null;
          assigned_to?: string | null;
          team_id?: string | null;
          watchers?: string[] | null;
          created_by?: string | null;
          estimated_hours?: number | null;
          actual_hours?: number | null;
          tags?: string[] | null;
          checklists?: Record<string, any>[];
          attachments?: Record<string, any>[];
          is_completed?: boolean;
          completed_at?: string | null;
          completed_by?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          organization_id?: string;
          parent_id?: string | null;
          parent_type?: 'contact' | 'company' | 'opportunity' | 'profile' | null;
          parent_task_id?: string | null;
          title?: string;
          description?: string | null;
          status?: TaskStatus;
          priority?: TaskPriority;
          due_date?: string | null;
          start_date?: string | null;
          reminder_date?: string | null;
          assigned_to?: string | null;
          team_id?: string | null;
          watchers?: string[] | null;
          created_by?: string | null;
          estimated_hours?: number | null;
          actual_hours?: number | null;
          tags?: string[] | null;
          checklists?: Record<string, any>[];
          attachments?: Record<string, any>[];
          is_completed?: boolean;
          completed_at?: string | null;
          completed_by?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      jobs: {
        Row: {
          id: string;
          organization_id: string;
          opportunity_id: string | null;
          quote_id: string | null;
          contact_id: string | null;
          company_id: string | null;
          job_number: string;
          title: string | null;
          description: string | null;
          job_type: string | null;
          priority: JobPriority;
          status: JobStatus;
          scheduled_start: string | null;
          scheduled_end: string | null;
          actual_start: string | null;
          actual_end: string | null;
          technician_id: string | null;
          team_id: string | null;
          additional_technicians: string[] | null;
          address_id: string | null;
          service_notes: string | null;
          completed_notes: string | null;
          equipment_used: string[] | null;
          photos: Record<string, any>[];
          labor_hours: number | null;
          labor_cost: number;
          material_cost: number;
          materials_used: Record<string, any>[];
          total_cost: number;
          total_revenue: number;
          customer_signature: string | null;
          customer_satisfaction: CustomerSatisfaction | null;
          customer_feedback: string | null;
          is_invoiced: boolean;
          invoice_id: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          organization_id: string;
          opportunity_id?: string | null;
          quote_id?: string | null;
          contact_id?: string | null;
          company_id?: string | null;
          job_number: string;
          title?: string | null;
          description?: string | null;
          job_type?: string | null;
          priority?: JobPriority;
          status?: JobStatus;
          scheduled_start?: string | null;
          scheduled_end?: string | null;
          actual_start?: string | null;
          actual_end?: string | null;
          technician_id?: string | null;
          team_id?: string | null;
          additional_technicians?: string[] | null;
          address_id?: string | null;
          service_notes?: string | null;
          completed_notes?: string | null;
          equipment_used?: string[] | null;
          photos?: Record<string, any>[];
          labor_hours?: number | null;
          labor_cost?: number;
          material_cost?: number;
          materials_used?: Record<string, any>[];
          total_cost?: number;
          total_revenue?: number;
          customer_signature?: string | null;
          customer_satisfaction?: CustomerSatisfaction | null;
          customer_feedback?: string | null;
          is_invoiced?: boolean;
          invoice_id?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          organization_id?: string;
          opportunity_id?: string | null;
          quote_id?: string | null;
          contact_id?: string | null;
          company_id?: string | null;
          job_number?: string;
          title?: string | null;
          description?: string | null;
          job_type?: string | null;
          priority?: JobPriority;
          status?: JobStatus;
          scheduled_start?: string | null;
          scheduled_end?: string | null;
          actual_start?: string | null;
          actual_end?: string | null;
          technician_id?: string | null;
          team_id?: string | null;
          additional_technicians?: string[] | null;
          address_id?: string | null;
          service_notes?: string | null;
          completed_notes?: string | null;
          equipment_used?: string[] | null;
          photos?: Record<string, any>[];
          labor_hours?: number | null;
          labor_cost?: number;
          material_cost?: number;
          materials_used?: Record<string, any>[];
          total_cost?: number;
          total_revenue?: number;
          customer_signature?: string | null;
          customer_satisfaction?: CustomerSatisfaction | null;
          customer_feedback?: string | null;
          is_invoiced?: boolean;
          invoice_id?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      invoices: {
        Row: {
          id: string;
          organization_id: string;
          job_id: string | null;
          quote_id: string | null;
          contact_id: string | null;
          company_id: string | null;
          invoice_number: string;
          title: string | null;
          status: InvoiceStatus;
          subtotal_amount: number;
          tax_amount: number;
          total_amount: number;
          total_paid: number;
          balance_due: number;
          currency: string;
          issue_date: string;
          due_date: string | null;
          paid_at: string | null;
          line_items: Record<string, any>[];
          external_provider: string | null;
          external_id: string | null;
          external_url: string | null;
          sync_status: SyncStatus;
          last_sync_at: string | null;
          sync_error_message: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          organization_id: string;
          job_id?: string | null;
          quote_id?: string | null;
          contact_id?: string | null;
          company_id?: string | null;
          invoice_number: string;
          title?: string | null;
          status?: InvoiceStatus;
          subtotal_amount?: number;
          tax_amount?: number;
          total_amount?: number;
          total_paid?: number;
          balance_due?: number;
          currency?: string;
          issue_date?: string;
          due_date?: string | null;
          paid_at?: string | null;
          line_items?: Record<string, any>[];
          external_provider?: string | null;
          external_id?: string | null;
          external_url?: string | null;
          sync_status?: SyncStatus;
          last_sync_at?: string | null;
          sync_error_message?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          organization_id?: string;
          job_id?: string | null;
          quote_id?: string | null;
          contact_id?: string | null;
          company_id?: string | null;
          invoice_number?: string;
          title?: string | null;
          status?: InvoiceStatus;
          subtotal_amount?: number;
          tax_amount?: number;
          total_amount?: number;
          total_paid?: number;
          balance_due?: number;
          currency?: string;
          issue_date?: string;
          due_date?: string | null;
          paid_at?: string | null;
          line_items?: Record<string, any>[];
          external_provider?: string | null;
          external_id?: string | null;
          external_url?: string | null;
          sync_status?: SyncStatus;
          last_sync_at?: string | null;
          sync_error_message?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
    };
  };
}

// ============================================================================
// CONVENIENCE TYPE EXPORTS
// ============================================================================

export type Organization = Database['public']['Tables']['organizations']['Row'];
export type OrganizationInsert = Database['public']['Tables']['organizations']['Insert'];
export type OrganizationUpdate = Database['public']['Tables']['organizations']['Update'];

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type Company = Database['public']['Tables']['companies']['Row'];
export type CompanyInsert = Database['public']['Tables']['companies']['Insert'];
export type CompanyUpdate = Database['public']['Tables']['companies']['Update'];

export type Contact = Database['public']['Tables']['contacts']['Row'];
export type ContactInsert = Database['public']['Tables']['contacts']['Insert'];
export type ContactUpdate = Database['public']['Tables']['contacts']['Update'];

export type Opportunity = Database['public']['Tables']['opportunities']['Row'];
export type OpportunityInsert = Database['public']['Tables']['opportunities']['Insert'];
export type OpportunityUpdate = Database['public']['Tables']['opportunities']['Update'];

export type Task = Database['public']['Tables']['tasks']['Row'];
export type TaskInsert = Database['public']['Tables']['tasks']['Insert'];
export type TaskUpdate = Database['public']['Tables']['tasks']['Update'];

export type Job = Database['public']['Tables']['jobs']['Row'];
export type JobInsert = Database['public']['Tables']['jobs']['Insert'];
export type JobUpdate = Database['public']['Tables']['jobs']['Update'];

export type Invoice = Database['public']['Tables']['invoices']['Row'];
export type InvoiceInsert = Database['public']['Tables']['invoices']['Insert'];
export type InvoiceUpdate = Database['public']['Tables']['invoices']['Update'];
