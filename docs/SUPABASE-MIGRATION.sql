-- ============================================================================
-- EXPO CRM APP - SUPABASE DATABASE SCHEMA
-- ============================================================================
-- Description: Complete database schema for a multi-tenant CRM with field service
-- Features: Organizations, Contacts, Sales Pipeline, Jobs, Invoicing, Permissions
-- Performance: Indexed, Partitioned, RLS-enabled, Full-Text Search ready
-- ============================================================================

-- ============================================================================
-- RLS (ROW LEVEL SECURITY) BYPASS TABLES
-- ============================================================================
-- The following tables DO NOT require RLS policies and can be accessed globally:
-- 
-- 1. permissions          - Master permission list (read-only for all authenticated users)
-- 2. role_permissions     - Role-to-permission mapping (read-only for all authenticated users)
-- 
-- These tables are reference data and need to be readable by all users to check permissions.
-- They should be managed only by admins via application logic, not direct SQL.
-- ============================================================================

-- ============================================================================
-- STEP 1: UTILITY FUNCTIONS
-- ============================================================================

-- Auto-update 'updated_at' timestamp on UPDATE
COMMENT ON FUNCTION update_updated_at_column IS 'Trigger function to auto-update updated_at column';

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- STEP 2: CORE TABLES (No Dependencies)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- TABLE: organizations
-- Purpose: Multi-tenant support - top-level account entity
-- Usage: All CRM data is scoped to an organization
-- RLS: Users can only see organizations they are members of
-- ----------------------------------------------------------------------------
CREATE TABLE organizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,                        -- Organization name (e.g., 'Acme Corp')
  slug TEXT UNIQUE NOT NULL,                 -- URL-friendly identifier (e.g., 'acme-corp')
  logo_url TEXT,                             -- URL to organization logo
  subscription_tier TEXT DEFAULT 'free',     -- Subscription plan: 'free' | 'pro' | 'enterprise'
  created_at TIMESTAMPTZ DEFAULT NOW(),      -- Timestamp when org was created
  updated_at TIMESTAMPTZ DEFAULT NOW(),      -- Auto-updated on changes (via trigger)
  deleted_at TIMESTAMPTZ                     -- Soft delete - NULL means active, timestamp means deleted
);

-- Field Comments
COMMENT ON COLUMN organizations.id IS 'Primary key - unique identifier for the organization';
COMMENT ON COLUMN organizations.name IS 'Display name of the organization';
COMMENT ON COLUMN organizations.slug IS 'URL-friendly unique identifier (e.g., for subdomain routing)';
COMMENT ON COLUMN organizations.logo_url IS 'URL to organization logo image (stored in Supabase Storage)';
COMMENT ON COLUMN organizations.subscription_tier IS 'Billing plan level - determines feature access';
COMMENT ON COLUMN organizations.deleted_at IS 'Soft delete timestamp - NULL means active, populated timestamp means deleted';

-- Indexes
CREATE INDEX idx_organizations_slug ON organizations(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_organizations_tier ON organizations(subscription_tier) WHERE deleted_at IS NULL;

-- Trigger
CREATE TRIGGER set_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ----------------------------------------------------------------------------
-- TABLE: profiles
-- Purpose: Internal users (Admins, Sales, Technicians, Support, etc.)
-- Usage: Extends Supabase auth.users with CRM-specific fields
-- RLS: Users can view own profile + profiles in their organization
-- ----------------------------------------------------------------------------
CREATE TABLE profiles (
  -- IDENTITY & AUTHENTICATION
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,  -- Links to Supabase Auth - created on signup
  first_name TEXT NOT NULL,                                     -- User's first/given name
  last_name TEXT NOT NULL,                                      -- User's last/family name
  email TEXT UNIQUE NOT NULL,                                   -- Primary email (unique across all users)
  avatar_url TEXT,                                              -- Profile picture URL (Supabase Storage)
  
  -- ROLE & PERMISSIONS
  role TEXT CHECK (role IN ('admin', 'manager', 'sales', 'support', 'marketing', 'technician', 'dispatcher', 'project_manager')),  -- System role for RBAC
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending', 'on_field')),  -- Current work status
  department TEXT,                                              -- Department/team (e.g., 'Sales', 'Support')
  access_level TEXT CHECK (access_level IN ('Full', 'Restricted', 'Limited')),  -- System access level
  teams TEXT[],                                                 -- Array of team names (legacy field)
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,  -- Organization membership (multi-tenant FK)
  
  -- TERRITORY & HIERARCHY
  territory TEXT,                                               -- Geographic territory (e.g., 'West Coast', 'APAC')
  manager_id UUID REFERENCES profiles(id) ON DELETE SET NULL,   -- Direct manager (self-referencing FK)                                              -- Manager's name (denormalized for quick display)
  
  -- SALES & QUOTA (for sales roles only)
  monthly_quota NUMERIC(12, 2),                                 -- Monthly sales target in currency
  quarterly_quota NUMERIC(12, 2),                               -- Quarterly sales target
  annual_quota NUMERIC(12, 2),                                  -- Annual sales target
  commission_rate NUMERIC(5, 2),                                -- Commission percentage (e.g., 5.00 = 5%)
  
  -- TECHNICIAN DETAILS (for field service roles only)
  certification TEXT,                                           -- Professional certifications (e.g., 'HVAC Master, EPA Certified')
  current_location_name TEXT,                                   -- Human-readable location (e.g., 'Moving on M1', 'At Depot')
  service_areas TEXT[],                                         -- Service areas/regions (e.g., ['Brisbane North', 'Gold Coast'])
  
  -- PREFERENCES & SETTINGS
  timezone TEXT DEFAULT 'UTC',                                  -- User's timezone (e.g., 'America/New_York', 'Australia/Brisbane')
  language TEXT DEFAULT 'en',                                   -- Preferred language code (e.g., 'en', 'es', 'fr')
  notification_preferences JSONB DEFAULT '{}',                  -- JSONB: {"email": true, "sms": false, "push": true}
  working_hours JSONB DEFAULT '{}',                             -- JSONB: {"start": "09:00", "end": "17:00", "days": ["Mon", "Tue"]}
  
  -- METADATA & AUDIT
  created_at TIMESTAMPTZ DEFAULT NOW(),                         -- Account creation timestamp
  updated_at TIMESTAMPTZ DEFAULT NOW(),                         -- Auto-updated via trigger on every UPDATE
  last_active_at TIMESTAMPTZ,                                   -- Last login/activity timestamp
  last_login_ip TEXT,                                           -- IP address of last login (for security audit)
  deleted_at TIMESTAMPTZ                                        -- Soft delete: NULL = active, timestamp = deleted
);

-- Field Comments
COMMENT ON COLUMN profiles.id IS 'Primary key - references auth.users (created via Supabase Auth)';
COMMENT ON COLUMN profiles.first_name IS 'User''s first/given name';
COMMENT ON COLUMN profiles.last_name IS 'User''s last/family name';
COMMENT ON COLUMN profiles.email IS 'Primary email address - must be unique across all users';
COMMENT ON COLUMN profiles.avatar_url IS 'Profile picture URL - typically stored in Supabase Storage';
COMMENT ON COLUMN profiles.role IS 'System role for RBAC: admin | manager | sales | support | marketing | technician | dispatcher | project_manager';
COMMENT ON COLUMN profiles.status IS 'Current work status: active | inactive | pending | on_field';
COMMENT ON COLUMN profiles.department IS 'Department or team name (e.g., Sales, Support, Engineering)';
COMMENT ON COLUMN profiles.access_level IS 'System access level: Full | Restricted | Limited';
COMMENT ON COLUMN profiles.teams IS 'Legacy field - array of team names (use organization_members for multi-tenancy)';
COMMENT ON COLUMN profiles.organization_id IS 'Organization membership - multi-tenant foreign key';
COMMENT ON COLUMN profiles.territory IS 'Geographic sales/service territory (e.g., West Coast, APAC)';
COMMENT ON COLUMN profiles.manager_id IS 'Direct manager - self-referencing FK for org hierarchy';
COMMENT ON COLUMN profiles.monthly_quota IS 'Monthly sales target (for sales roles) - in organization currency';
COMMENT ON COLUMN profiles.quarterly_quota IS 'Quarterly sales target (for sales roles)';
COMMENT ON COLUMN profiles.annual_quota IS 'Annual sales target (for sales roles)';
COMMENT ON COLUMN profiles.commission_rate IS 'Commission percentage (e.g., 5.00 = 5%) for sales roles';
COMMENT ON COLUMN profiles.certification IS 'Professional certifications for technicians (e.g., HVAC Master, EPA Certified)';
COMMENT ON COLUMN profiles.current_location_name IS 'Human-readable location from mobile app (e.g., Moving on M1, At Depot)';
COMMENT ON COLUMN profiles.service_areas IS 'Array of service areas/regions technician covers (e.g., [Brisbane North, Gold Coast])';
COMMENT ON COLUMN profiles.timezone IS 'User''s timezone for scheduling (e.g., America/New_York, Australia/Brisbane)';
COMMENT ON COLUMN profiles.language IS 'Preferred language code for UI (e.g., en, es, fr)';
COMMENT ON COLUMN profiles.notification_preferences IS 'JSONB notification settings: {"email": true, "sms": false, "push": true}';
COMMENT ON COLUMN profiles.working_hours IS 'JSONB work schedule: {"start": "09:00", "end": "17:00", "days": ["Mon", "Tue", "Wed"]}';
COMMENT ON COLUMN profiles.created_at IS 'Account creation timestamp';
COMMENT ON COLUMN profiles.updated_at IS 'Auto-updated via trigger on every UPDATE operation';
COMMENT ON COLUMN profiles.last_active_at IS 'Last login or activity timestamp - for tracking inactive users';
COMMENT ON COLUMN profiles.last_login_ip IS 'IP address of last login - for security auditing';
COMMENT ON COLUMN profiles.deleted_at IS 'Soft delete timestamp - NULL means active, timestamp means deleted';

-- Indexes
CREATE INDEX idx_profiles_organization ON profiles(organization_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_profiles_status ON profiles(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_profiles_role ON profiles(role) WHERE deleted_at IS NULL;
CREATE INDEX idx_profiles_manager ON profiles(manager_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_profiles_email ON profiles(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_profiles_last_active ON profiles(last_active_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_profiles_org_role_status ON profiles(organization_id, role, status) WHERE deleted_at IS NULL;

-- GIN indexes for JSONB
CREATE INDEX idx_profiles_notification_prefs ON profiles USING GIN(notification_preferences);

-- Trigger
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ----------------------------------------------------------------------------
-- TABLE: profile_stats
-- Purpose: Performance metrics for users (1:1 with profiles)
-- Usage: Track leads, calls, emails, tasks, sales, jobs performance
-- Warning: 50+ columns - consider splitting into domain-specific tables
-- ----------------------------------------------------------------------------
CREATE TABLE profile_stats (
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,  -- 1:1 with profiles - one stats record per user
  
  -- LEAD MANAGEMENT
  leads_assigned INTEGER DEFAULT 0,                   -- Total leads assigned to user
  leads_contacted INTEGER DEFAULT 0,                  -- Leads contacted (first touch made)
  leads_qualified INTEGER DEFAULT 0,                  -- Leads qualified (meets criteria)
  leads_converted INTEGER DEFAULT 0,                  -- Leads converted to opportunities/customers
  leads_lost INTEGER DEFAULT 0,                       -- Leads lost or disqualified
  avg_lead_response_time INTERVAL,                    -- Avg time to first contact after assignment
  
  -- COMMUNICATION - CALLS
  calls_assigned INTEGER DEFAULT 0,                   -- Call tasks assigned
  calls_dials INTEGER DEFAULT 0,                      -- Outbound calls attempted
  calls_connected INTEGER DEFAULT 0,                  -- Calls successfully connected
  calls_voicemails INTEGER DEFAULT 0,                 -- Voicemails left
  calls_lost INTEGER DEFAULT 0,                       -- Missed or abandoned calls
  avg_call_duration INTERVAL,                         -- Avg duration for connected calls
  
  -- COMMUNICATION - EMAILS
  emails_assigned INTEGER DEFAULT 0,                  -- Email tasks assigned
  emails_sent INTEGER DEFAULT 0,                      -- Total emails sent
  emails_opened INTEGER DEFAULT 0,                    -- Emails opened (tracking pixel)
  emails_clicked INTEGER DEFAULT 0,                   -- Emails with link clicks
  emails_replies_received INTEGER DEFAULT 0,          -- Email replies received
  emails_conversations INTEGER DEFAULT 0,             -- Email threads with back-and-forth
  emails_bounced INTEGER DEFAULT 0,                   -- Bounced emails (hard/soft)
  emails_lost INTEGER DEFAULT 0,                      -- Failed/undeliverable emails
  avg_email_response_time INTERVAL,                   -- Avg time to respond to incoming
  
  -- COMMUNICATION - SMS
  sms_assigned INTEGER DEFAULT 0,                     -- SMS tasks assigned
  sms_sent INTEGER DEFAULT 0,                         -- SMS messages sent
  sms_received INTEGER DEFAULT 0,                     -- SMS messages received
  sms_conversations INTEGER DEFAULT 0,                -- SMS threads with back-and-forth
  sms_lost INTEGER DEFAULT 0,                         -- Failed SMS deliveries
  
  -- MEETINGS & APPOINTMENTS
  meetings_scheduled INTEGER DEFAULT 0,               -- Total meetings scheduled
  meetings_completed INTEGER DEFAULT 0,               -- Meetings successfully completed
  meetings_no_show INTEGER DEFAULT 0,                 -- Meetings where contact didn't attend
  meetings_cancelled INTEGER DEFAULT 0,               -- Meetings cancelled by either party
  avg_meeting_duration INTERVAL,                      -- Avg meeting duration
  
  -- PROPOSALS & QUOTES
  proposals_sent INTEGER DEFAULT 0,                   -- Quotes/proposals sent
  proposals_viewed INTEGER DEFAULT 0,                 -- Quotes opened/viewed
  proposals_accepted INTEGER DEFAULT 0,               -- Quotes accepted (converted to jobs)
  proposals_rejected INTEGER DEFAULT 0,               -- Quotes declined
  proposals_expired INTEGER DEFAULT 0,                -- Quotes expired (past valid_until)
  avg_proposal_value NUMERIC(12, 2) DEFAULT 0,        -- Avg value of quotes sent
  
  -- TASKS & FOLLOW-UPS
  tasks_assigned INTEGER DEFAULT 0,                   -- Total tasks assigned
  tasks_in_progress INTEGER DEFAULT 0,                -- Tasks currently in progress
  tasks_completed INTEGER DEFAULT 0,                  -- Tasks marked completed
  tasks_overdue INTEGER DEFAULT 0,                    -- Tasks past due and not completed
  tasks_lost INTEGER DEFAULT 0,                       -- Tasks cancelled/abandoned
  follow_ups_scheduled INTEGER DEFAULT 0,             -- Follow-up tasks scheduled
  follow_ups_completed INTEGER DEFAULT 0,             -- Follow-ups completed on time
  
  -- SALES & OPPORTUNITIES
  opportunities_assigned INTEGER DEFAULT 0,           -- Opportunities assigned
  opportunities_in_progress INTEGER DEFAULT 0,        -- Active opportunities in pipeline
  opportunities_won INTEGER DEFAULT 0,                -- Opportunities closed as won
  opportunities_lost INTEGER DEFAULT 0,               -- Opportunities closed as lost
  pipeline_value NUMERIC(12, 2) DEFAULT 0,            -- Total value of active opportunities
  revenue_generated NUMERIC(12, 2) DEFAULT 0,         -- Total revenue from won opportunities
  avg_deal_size NUMERIC(12, 2) DEFAULT 0,             -- Avg value of won opportunities
  avg_sales_cycle_days INTEGER DEFAULT 0,             -- Avg days from create to close
  win_rate NUMERIC(5, 2) DEFAULT 0,                   -- (won / (won + lost)) * 100
  
  -- CUSTOMER RELATIONSHIPS
  contacts_created INTEGER DEFAULT 0,                 -- Contacts created by user
  contacts_active INTEGER DEFAULT 0,                  -- Active contacts managed
  companies_managed INTEGER DEFAULT 0,                -- Companies managed by user
  customer_meetings INTEGER DEFAULT 0,                -- Meetings with customers
  customer_satisfaction_score NUMERIC(3, 2) DEFAULT 0,-- CSAT score (0-5 scale)
  nps_score INTEGER DEFAULT 0,                        -- Net Promoter Score (-100 to 100)
  
  -- FIELD SERVICE & JOBS
  jobs_assigned INTEGER DEFAULT 0,                    -- Jobs assigned to technician
  jobs_dispatched INTEGER DEFAULT 0,                  -- Jobs dispatched to field
  jobs_on_field INTEGER DEFAULT 0,                    -- Jobs currently in progress on-site
  jobs_completed INTEGER DEFAULT 0,                   -- Jobs successfully completed
  jobs_lost INTEGER DEFAULT 0,                        -- Jobs cancelled or failed
  avg_job_rating NUMERIC(2, 1) DEFAULT 0,             -- Avg customer rating (1-5 scale)
  avg_job_duration INTERVAL,                          -- Avg job duration (start to completion)
  
  -- SUPPORT & TICKETS
  tickets_assigned INTEGER DEFAULT 0,                 -- Support tickets assigned
  tickets_in_progress INTEGER DEFAULT 0,              -- Tickets currently being worked on
  tickets_resolved INTEGER DEFAULT 0,                 -- Tickets resolved/closed
  tickets_escalated INTEGER DEFAULT 0,                -- Tickets escalated to higher tier
  tickets_lost INTEGER DEFAULT 0,                     -- Tickets closed as unresolved
  avg_resolution_time INTERVAL,                       -- Avg time to resolve tickets
  avg_first_response_time INTERVAL,                   -- Avg time to first response
  ticket_satisfaction_score NUMERIC(3, 2) DEFAULT 0,  -- Avg ticket satisfaction (0-5 scale)
  
  -- ACTIVITY & ENGAGEMENT
  activities_logged INTEGER DEFAULT 0,                -- Total activities logged
  notes_created INTEGER DEFAULT 0,                    -- Notes created by user
  documents_uploaded INTEGER DEFAULT 0,               -- Documents uploaded
  last_activity_date TIMESTAMPTZ,                     -- Last date user performed any activity
  active_days_count INTEGER DEFAULT 0,                -- Number of days user was active
  
  -- TEAM MANAGEMENT (for managers only)
  team_size INTEGER DEFAULT 0,                        -- Number of direct reports managed
  team_revenue NUMERIC(12, 2) DEFAULT 0,              -- Total revenue generated by team
  team_pipeline_value NUMERIC(12, 2) DEFAULT 0,       -- Total pipeline value from team
  team_opportunities_won INTEGER DEFAULT 0,           -- Total opportunities won by team
  team_avg_win_rate NUMERIC(5, 2) DEFAULT 0,          -- Average win rate across team members
  team_active_members INTEGER DEFAULT 0,              -- Active team members (last 30 days)
  team_tasks_completed INTEGER DEFAULT 0,             -- Total tasks completed by team
  team_customer_satisfaction NUMERIC(3, 2) DEFAULT 0, -- Average CSAT across team
  team_quota_attainment NUMERIC(5, 2) DEFAULT 0,      -- Team quota attainment percentage
  
  -- SUBSCRIPTION & RETENTION (for account managers/CSMs)
  customers_subscribed INTEGER DEFAULT 0,             -- Active paying customers/subscribers
  customers_churned INTEGER DEFAULT 0,                -- Customers who cancelled/discontinued
  customer_retention_rate NUMERIC(5, 2) DEFAULT 0,    -- (active / (active + churned)) * 100
  recurring_revenue NUMERIC(12, 2) DEFAULT 0,         -- MRR or ARR from subscriptions
  subscription_upgrades INTEGER DEFAULT 0,            -- Customers upgraded to higher tier
  subscription_downgrades INTEGER DEFAULT 0,          -- Customers downgraded to lower tier
  avg_customer_lifetime_days INTEGER DEFAULT 0,       -- Average customer lifetime in days
  subscription_renewal_rate NUMERIC(5, 2) DEFAULT 0,  -- Percentage of subscriptions renewed
  avg_revenue_per_customer NUMERIC(12, 2) DEFAULT 0,  -- ARPU - Average revenue per user
  customers_at_risk INTEGER DEFAULT 0,                -- Customers flagged for churn risk
  
  -- REPEAT BUSINESS & LOYALTY
  customers_total INTEGER DEFAULT 0,                  -- Total unique customers served
  customers_one_time INTEGER DEFAULT 0,               -- Customers with only one purchase
  customers_returning INTEGER DEFAULT 0,              -- Customers who made repeat purchases/bookings
  repeat_business_rate NUMERIC(5, 2) DEFAULT 0,       -- (returning / total) * 100
  repeat_revenue NUMERIC(12, 2) DEFAULT 0,            -- Revenue from repeat customers
  avg_purchases_per_customer NUMERIC(5, 2) DEFAULT 0, -- Average number of purchases per customer
  avg_days_between_purchases INTEGER DEFAULT 0,       -- Average days between repeat purchases
  
  -- REFERRALS & WORD-OF-MOUTH
  -- Outbound Referrals (sent by this user)
  referrals_sent INTEGER DEFAULT 0,                   -- Total referrals sent by this user to prospects
  
  -- Inbound Referrals (received from others)
  referrals_received INTEGER DEFAULT 0,               -- Total new customers acquired via referrals
  referrals_by_customers INTEGER DEFAULT 0,           -- Referrals from existing customers (neighbors, friends, satisfied clients)
  referrals_by_employees INTEGER DEFAULT 0,           -- Referrals from internal team (technicians, sales, dispatchers)
  referrals_by_partners INTEGER DEFAULT 0,            -- Referrals from business partners, affiliates, contractors
  
  -- Referral Performance Metrics
  referral_conversion_rate NUMERIC(5, 2) DEFAULT 0,   -- Referral success rate: (converted / sent) * 100
  referral_revenue NUMERIC(12, 2) DEFAULT 0,          -- Total revenue from referral-sourced customers
  
  -- Top Referrer Tracking (for campaigns & rewards)
  top_referrer_name TEXT,                             -- Name of top performing referrer (person or entity)
  top_referrer_count INTEGER DEFAULT 0,               -- Number of successful referrals from top referrer
  
  -- UPSELL & CROSS-SELL
  upsell_revenue NUMERIC(12, 2) DEFAULT 0,            -- Revenue from upselling existing customers to premium/higher-tier products
  upsell_count INTEGER DEFAULT 0,                     -- Number of successful upsell transactions
  cross_sell_revenue NUMERIC(12, 2) DEFAULT 0,        -- Revenue from cross-selling additional/complementary products
  cross_sell_count INTEGER DEFAULT 0,                 -- Number of successful cross-sell transactions
  
  updated_at TIMESTAMPTZ DEFAULT NOW()                -- Auto-updated via trigger
);

-- Field Comments
COMMENT ON COLUMN profile_stats.profile_id IS 'Primary key - references profiles table (one stats record per user)';

-- LEAD MANAGEMENT METRICS
COMMENT ON COLUMN profile_stats.leads_assigned IS 'Total leads assigned to this user';
COMMENT ON COLUMN profile_stats.leads_contacted IS 'Leads contacted (first touch made)';
COMMENT ON COLUMN profile_stats.leads_qualified IS 'Leads qualified (meets criteria, passed to sales)';
COMMENT ON COLUMN profile_stats.leads_converted IS 'Leads converted to opportunities or customers';
COMMENT ON COLUMN profile_stats.leads_lost IS 'Leads lost or disqualified';
COMMENT ON COLUMN profile_stats.avg_lead_response_time IS 'Average time to first contact after lead assignment';

-- COMMUNICATION - CALLS
COMMENT ON COLUMN profile_stats.calls_assigned IS 'Call tasks assigned to user';
COMMENT ON COLUMN profile_stats.calls_dials IS 'Outbound calls attempted (dialed)';
COMMENT ON COLUMN profile_stats.calls_connected IS 'Calls successfully connected (answered by person)';
COMMENT ON COLUMN profile_stats.calls_voicemails IS 'Voicemails left';
COMMENT ON COLUMN profile_stats.calls_lost IS 'Missed or abandoned calls';
COMMENT ON COLUMN profile_stats.avg_call_duration IS 'Average call duration for connected calls';

-- COMMUNICATION - EMAILS
COMMENT ON COLUMN profile_stats.emails_assigned IS 'Email tasks assigned to user';
COMMENT ON COLUMN profile_stats.emails_sent IS 'Total emails sent';
COMMENT ON COLUMN profile_stats.emails_opened IS 'Emails opened by recipients (tracking pixel)';
COMMENT ON COLUMN profile_stats.emails_clicked IS 'Emails with link clicks';
COMMENT ON COLUMN profile_stats.emails_replies_received IS 'Email replies received';
COMMENT ON COLUMN profile_stats.emails_conversations IS 'Email threads with back-and-forth exchange';
COMMENT ON COLUMN profile_stats.emails_bounced IS 'Emails bounced (hard/soft bounce)';
COMMENT ON COLUMN profile_stats.emails_lost IS 'Failed or undeliverable emails';
COMMENT ON COLUMN profile_stats.avg_email_response_time IS 'Average time to respond to incoming emails';

-- COMMUNICATION - SMS
COMMENT ON COLUMN profile_stats.sms_assigned IS 'SMS tasks assigned to user';
COMMENT ON COLUMN profile_stats.sms_sent IS 'SMS messages sent';
COMMENT ON COLUMN profile_stats.sms_received IS 'SMS messages received';
COMMENT ON COLUMN profile_stats.sms_conversations IS 'SMS threads with back-and-forth exchange';
COMMENT ON COLUMN profile_stats.sms_lost IS 'Failed SMS deliveries';

-- MEETINGS & APPOINTMENTS
COMMENT ON COLUMN profile_stats.meetings_scheduled IS 'Total meetings scheduled';
COMMENT ON COLUMN profile_stats.meetings_completed IS 'Meetings successfully completed';
COMMENT ON COLUMN profile_stats.meetings_no_show IS 'Meetings where contact did not attend';
COMMENT ON COLUMN profile_stats.meetings_cancelled IS 'Meetings cancelled by either party';
COMMENT ON COLUMN profile_stats.avg_meeting_duration IS 'Average meeting duration';

-- PROPOSALS & QUOTES
COMMENT ON COLUMN profile_stats.proposals_sent IS 'Quotes/proposals sent to customers';
COMMENT ON COLUMN profile_stats.proposals_viewed IS 'Quotes opened/viewed by recipients';
COMMENT ON COLUMN profile_stats.proposals_accepted IS 'Quotes accepted (converted to jobs)';
COMMENT ON COLUMN profile_stats.proposals_rejected IS 'Quotes declined by customer';
COMMENT ON COLUMN profile_stats.proposals_expired IS 'Quotes expired (past valid_until date)';
COMMENT ON COLUMN profile_stats.avg_proposal_value IS 'Average value of quotes sent';

-- TASKS & FOLLOW-UPS
COMMENT ON COLUMN profile_stats.tasks_assigned IS 'Total tasks assigned to user';
COMMENT ON COLUMN profile_stats.tasks_in_progress IS 'Tasks currently in progress';
COMMENT ON COLUMN profile_stats.tasks_completed IS 'Tasks marked as completed';
COMMENT ON COLUMN profile_stats.tasks_overdue IS 'Tasks past due date and not completed';
COMMENT ON COLUMN profile_stats.tasks_lost IS 'Tasks cancelled or abandoned';
COMMENT ON COLUMN profile_stats.follow_ups_scheduled IS 'Follow-up tasks scheduled';
COMMENT ON COLUMN profile_stats.follow_ups_completed IS 'Follow-up tasks completed on time';

-- SALES & OPPORTUNITIES
COMMENT ON COLUMN profile_stats.opportunities_assigned IS 'Opportunities assigned to user';
COMMENT ON COLUMN profile_stats.opportunities_in_progress IS 'Active opportunities in pipeline';
COMMENT ON COLUMN profile_stats.opportunities_won IS 'Opportunities closed as won';
COMMENT ON COLUMN profile_stats.opportunities_lost IS 'Opportunities closed as lost';
COMMENT ON COLUMN profile_stats.pipeline_value IS 'Total value of active opportunities';
COMMENT ON COLUMN profile_stats.revenue_generated IS 'Total revenue from won opportunities';
COMMENT ON COLUMN profile_stats.avg_deal_size IS 'Average value of won opportunities';
COMMENT ON COLUMN profile_stats.avg_sales_cycle_days IS 'Average days from opportunity creation to close';
COMMENT ON COLUMN profile_stats.win_rate IS 'Calculated as (won / (won + lost)) * 100';

-- CUSTOMER RELATIONSHIPS
COMMENT ON COLUMN profile_stats.contacts_created IS 'Contacts created by this user';
COMMENT ON COLUMN profile_stats.contacts_active IS 'Active contacts managed by user';
COMMENT ON COLUMN profile_stats.companies_managed IS 'Companies managed by user';
COMMENT ON COLUMN profile_stats.customer_meetings IS 'Meetings held with customers';
COMMENT ON COLUMN profile_stats.customer_satisfaction_score IS 'CSAT score (0-5 scale)';
COMMENT ON COLUMN profile_stats.nps_score IS 'Net Promoter Score (-100 to 100)';

-- FIELD SERVICE & JOBS
COMMENT ON COLUMN profile_stats.jobs_assigned IS 'Jobs assigned to technician';
COMMENT ON COLUMN profile_stats.jobs_dispatched IS 'Jobs dispatched to field';
COMMENT ON COLUMN profile_stats.jobs_on_field IS 'Jobs currently in progress on-site';
COMMENT ON COLUMN profile_stats.jobs_completed IS 'Jobs successfully completed';
COMMENT ON COLUMN profile_stats.jobs_lost IS 'Jobs cancelled or failed';
COMMENT ON COLUMN profile_stats.avg_job_rating IS 'Average customer rating for completed jobs (1-5 scale)';
COMMENT ON COLUMN profile_stats.avg_job_duration IS 'Average job duration from start to completion';

-- SUPPORT & TICKETS
COMMENT ON COLUMN profile_stats.tickets_assigned IS 'Support tickets assigned to user';
COMMENT ON COLUMN profile_stats.tickets_in_progress IS 'Tickets currently being worked on';
COMMENT ON COLUMN profile_stats.tickets_resolved IS 'Tickets resolved/closed';
COMMENT ON COLUMN profile_stats.tickets_escalated IS 'Tickets escalated to higher tier';
COMMENT ON COLUMN profile_stats.tickets_lost IS 'Tickets closed as unresolved';
COMMENT ON COLUMN profile_stats.avg_resolution_time IS 'Average time to resolve tickets';
COMMENT ON COLUMN profile_stats.avg_first_response_time IS 'Average time to first response on tickets';
COMMENT ON COLUMN profile_stats.ticket_satisfaction_score IS 'Average ticket satisfaction rating (0-5 scale)';

-- ACTIVITY & ENGAGEMENT
COMMENT ON COLUMN profile_stats.activities_logged IS 'Total activities logged (calls, emails, meetings, etc.)';
COMMENT ON COLUMN profile_stats.notes_created IS 'Notes created by user';
COMMENT ON COLUMN profile_stats.documents_uploaded IS 'Documents uploaded by user';
COMMENT ON COLUMN profile_stats.last_activity_date IS 'Last date user performed any activity';
COMMENT ON COLUMN profile_stats.active_days_count IS 'Number of days user was active';

-- TEAM MANAGEMENT (for managers only)
COMMENT ON COLUMN profile_stats.team_size IS 'Number of direct reports managed by this user';
COMMENT ON COLUMN profile_stats.team_revenue IS 'Total revenue generated by all team members';
COMMENT ON COLUMN profile_stats.team_pipeline_value IS 'Total pipeline value from all team members';
COMMENT ON COLUMN profile_stats.team_opportunities_won IS 'Total opportunities won by team members';
COMMENT ON COLUMN profile_stats.team_avg_win_rate IS 'Average win rate across all team members';
COMMENT ON COLUMN profile_stats.team_active_members IS 'Team members active in last 30 days';
COMMENT ON COLUMN profile_stats.team_tasks_completed IS 'Total tasks completed by all team members';
COMMENT ON COLUMN profile_stats.team_customer_satisfaction IS 'Average customer satisfaction score across team';
COMMENT ON COLUMN profile_stats.team_quota_attainment IS 'Team quota attainment percentage (actual vs target)';

-- SUBSCRIPTION & RETENTION (for account managers/CSMs)
COMMENT ON COLUMN profile_stats.customers_subscribed IS 'Active paying customers/subscribers managed by user';
COMMENT ON COLUMN profile_stats.customers_churned IS 'Customers who cancelled or discontinued service';
COMMENT ON COLUMN profile_stats.customer_retention_rate IS 'Retention rate: (active / (active + churned)) * 100';
COMMENT ON COLUMN profile_stats.recurring_revenue IS 'Monthly or annual recurring revenue from subscriptions';
COMMENT ON COLUMN profile_stats.subscription_upgrades IS 'Customers upgraded to higher subscription tier';
COMMENT ON COLUMN profile_stats.subscription_downgrades IS 'Customers downgraded to lower subscription tier';
COMMENT ON COLUMN profile_stats.avg_customer_lifetime_days IS 'Average customer lifetime in days';
COMMENT ON COLUMN profile_stats.subscription_renewal_rate IS 'Percentage of subscriptions successfully renewed';
COMMENT ON COLUMN profile_stats.avg_revenue_per_customer IS 'ARPU - Average revenue per user/customer';
COMMENT ON COLUMN profile_stats.customers_at_risk IS 'Customers flagged at risk of churning (proactive monitoring)';

-- REPEAT BUSINESS & LOYALTY
COMMENT ON COLUMN profile_stats.customers_total IS 'Total unique customers served by this user';
COMMENT ON COLUMN profile_stats.customers_one_time IS 'Customers with only one purchase (no repeat business)';
COMMENT ON COLUMN profile_stats.customers_returning IS 'Customers who made repeat purchases or bookings';
COMMENT ON COLUMN profile_stats.repeat_business_rate IS 'Percentage of customers who return: (returning / total) * 100';
COMMENT ON COLUMN profile_stats.repeat_revenue IS 'Total revenue generated from repeat customers';
COMMENT ON COLUMN profile_stats.avg_purchases_per_customer IS 'Average number of purchases/bookings per customer';
COMMENT ON COLUMN profile_stats.avg_days_between_purchases IS 'Average days between repeat purchases (customer frequency)';

-- REFERRALS & WORD-OF-MOUTH METRICS
COMMENT ON COLUMN profile_stats.referrals_sent IS '[OUTBOUND] Total referrals sent by this user to prospects - tracks user as referrer';
COMMENT ON COLUMN profile_stats.referrals_received IS '[INBOUND - TOTAL] Total new customers acquired via all referral sources combined';
COMMENT ON COLUMN profile_stats.referrals_by_customers IS '[INBOUND - SOURCE] Referrals from existing customers: neighbors, friends, satisfied clients (word-of-mouth)';
COMMENT ON COLUMN profile_stats.referrals_by_employees IS '[INBOUND - SOURCE] Referrals from internal team members: technicians, sales reps, dispatchers, support staff';
COMMENT ON COLUMN profile_stats.referrals_by_partners IS '[INBOUND - SOURCE] Referrals from external partners: affiliates, contractors, business partnerships';
COMMENT ON COLUMN profile_stats.referral_conversion_rate IS '[PERFORMANCE] Referral success rate: (referrals converted to customers / referrals sent) * 100';
COMMENT ON COLUMN profile_stats.referral_revenue IS '[PERFORMANCE] Total revenue generated from all referral-sourced customers';
COMMENT ON COLUMN profile_stats.top_referrer_name IS '[TOP PERFORMER] Name of highest-performing referrer (for campaign rewards and recognition programs)';
COMMENT ON COLUMN profile_stats.top_referrer_count IS '[TOP PERFORMER] Number of successful referrals from top referrer (leaderboard tracking)';

-- UPSELL & CROSS-SELL METRICS
COMMENT ON COLUMN profile_stats.upsell_revenue IS '[UPSELL] Revenue from upgrading existing customers to premium/higher-tier products or services';
COMMENT ON COLUMN profile_stats.upsell_count IS '[UPSELL] Number of successful upsell transactions (tier upgrades, premium conversions)';
COMMENT ON COLUMN profile_stats.cross_sell_revenue IS '[CROSS-SELL] Revenue from selling additional/complementary products to existing customers';
COMMENT ON COLUMN profile_stats.cross_sell_count IS '[CROSS-SELL] Number of successful cross-sell transactions (add-on products, bundled services)';

COMMENT ON COLUMN profile_stats.updated_at IS 'Auto-updated via trigger on every UPDATE';

-- Indexes
CREATE INDEX idx_profile_stats_last_activity ON profile_stats(last_activity_date DESC);
COMMENT ON INDEX idx_profile_stats_last_activity IS 'Find recently active users for dashboard and inactivity alerts';

CREATE INDEX idx_profile_stats_revenue ON profile_stats(revenue_generated DESC);
COMMENT ON INDEX idx_profile_stats_revenue IS 'Leaderboard queries - top revenue generators';

CREATE INDEX idx_profile_stats_pipeline ON profile_stats(pipeline_value DESC);
COMMENT ON INDEX idx_profile_stats_pipeline IS 'Leaderboard queries - largest pipeline values';

-- Trigger
CREATE TRIGGER set_profile_stats_updated_at
  BEFORE UPDATE ON profile_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
COMMENT ON TRIGGER set_profile_stats_updated_at ON profile_stats IS 'Auto-update updated_at timestamp on every UPDATE';


-- ----------------------------------------------------------------------------
-- TABLE: companies
-- Purpose: Business accounts (prospects, customers, partners)
-- Usage: B2B relationships - contacts belong to companies
-- 
-- RELATIONSHIPS:
-- - Addresses: Use polymorphic 'addresses' table (parent_type='company')
-- - Phones: Use polymorphic 'phones' table (parent_type='company')
-- - Tags: Both TEXT[] array (denormalized cache) + 'tags'/'taggable' tables (normalized)
-- - Contacts: One-to-many via contacts.company_id + one primary via primary_contact_id
-- ----------------------------------------------------------------------------
CREATE TABLE companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  
  name TEXT NOT NULL,                                                         -- Company name
  description TEXT,                                                           -- Company description/notes
  industry TEXT,                                                              -- Industry sector
  website TEXT,                                                               -- Company website
  email TEXT,                                                                 -- General company email
  linkedin_url TEXT,                                                          -- LinkedIn company page
  location TEXT,                                                              -- Primary location
  
  status TEXT DEFAULT 'prospect' CHECK (status IN ('prospect', 'customer', 'partner', 'inactive')),  -- Relationship status
  employee_count TEXT,                                                        -- Number of employees
  annual_revenue NUMERIC(15, 2) DEFAULT 0,                                    -- Estimated annual revenue
  
  source TEXT,                                                                -- Lead source (validates against lead_sources table)
  source_description TEXT,                                                    -- Custom source details
  tags TEXT[] DEFAULT '{}',                                                   -- Categorization tags
  last_contact_date TIMESTAMPTZ,                                              -- Last interaction date
  
  primary_contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,         -- Main contact/representative at company
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,                -- Account owner
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Field Comments
COMMENT ON COLUMN companies.id IS 'Primary key - unique identifier for the company';
COMMENT ON COLUMN companies.organization_id IS 'Multi-tenant FK - which organization owns this company record';
COMMENT ON COLUMN companies.name IS 'Company legal or trade name';
COMMENT ON COLUMN companies.description IS 'Company description, notes, key information about the business';
COMMENT ON COLUMN companies.industry IS 'Industry sector (e.g., Technology, Healthcare, Construction, HVAC)';
COMMENT ON COLUMN companies.website IS 'Company website URL';
COMMENT ON COLUMN companies.email IS 'General company email (e.g., info@company.com)';
COMMENT ON COLUMN companies.linkedin_url IS 'LinkedIn company page URL for social selling and research';
COMMENT ON COLUMN companies.location IS 'Primary location or headquarters (free text)';
COMMENT ON COLUMN companies.status IS 'Relationship status: prospect -> customer -> partner -> inactive';
COMMENT ON COLUMN companies.employee_count IS 'Number of employees (e.g., "10-50", "500+")';
COMMENT ON COLUMN companies.annual_revenue IS 'Estimated annual revenue in organization currency';
COMMENT ON COLUMN companies.source IS 'Lead source slug - validates against lead_sources table (e.g., "google_ads", "referral", "event") - allows org-specific custom sources';
COMMENT ON COLUMN companies.source_description IS 'Custom source details - allows admins to specify exact campaign/channel (e.g., "LinkedIn Ad Campaign - Enterprise Q1", "Trade Show - HVAC Expo 2026")';
COMMENT ON COLUMN companies.tags IS 'Denormalized tag cache (TEXT[] array) for fast queries: ["VIP", "Enterprise"] - synced with normalized tags/taggable tables for tag management';
COMMENT ON COLUMN companies.last_contact_date IS 'Last interaction date (call, email, meeting) for engagement tracking';
COMMENT ON COLUMN companies.primary_contact_id IS 'Primary contact/representative at this company - FK to contacts (multiple contacts can exist via contacts.company_id)';
COMMENT ON COLUMN companies.assigned_to IS 'Account owner/manager - FK to profiles';
COMMENT ON COLUMN companies.created_by IS 'User who created this company record';
COMMENT ON COLUMN companies.created_at IS 'Timestamp when company was created';
COMMENT ON COLUMN companies.updated_at IS 'Auto-updated via trigger on every UPDATE';
COMMENT ON COLUMN companies.deleted_at IS 'Soft delete timestamp - NULL means active';

-- Indexes
CREATE INDEX idx_companies_organization ON companies(organization_id) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_companies_organization IS 'Find all companies for an organization';

CREATE INDEX idx_companies_status ON companies(status) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_companies_status IS 'Filter companies by relationship status';

CREATE INDEX idx_companies_assigned ON companies(assigned_to) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_companies_assigned IS 'Find companies assigned to account owner';

CREATE INDEX idx_companies_name ON companies(name) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_companies_name IS 'Alphabetical sorting and lookup by name';
CREATE INDEX idx_companies_primary_contact ON companies(primary_contact_id) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_companies_primary_contact IS 'Find company by primary contact';

CREATE INDEX idx_companies_parent ON companies(parent_company_id) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_companies_parent IS 'Find subsidiaries of a parent company';

CREATE INDEX idx_companies_last_contact ON companies(last_contact_date DESC) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_companies_last_contact IS 'Find companies by last contact date (find stale accounts)';

-- GIN index for tags
CREATE INDEX idx_companies_tags ON companies USING GIN(tags) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_companies_tags IS 'Filter companies by tags (array containment queries)';

-- Full-text search
CREATE INDEX idx_companies_search ON companies USING GIN(to_tsvector('english', name || ' ' || COALESCE(industry, '') || ' ' || COALESCE(description, ''))) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_companies_search IS 'Full-text search across company name, industry, and description';

-- Trigger
CREATE TRIGGER set_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
COMMENT ON TRIGGER set_companies_updated_at ON companies IS 'Auto-update updated_at timestamp on every UPDATE';


-- ----------------------------------------------------------------------------
-- TABLE: contacts
-- Purpose: Individual people (leads, customers, partners)
-- Usage: Primary CRM entity - linked to companies, opportunities, tasks
-- 
-- RELATIONSHIPS:
-- - Addresses: Use polymorphic 'addresses' table (parent_type='contact')
-- - Phones: Use polymorphic 'phones' table (parent_type='contact')
-- - Tags: Both TEXT[] array (denormalized cache) + 'tags'/'taggable' tables (normalized)
-- - Company: Many-to-one via company_id (multiple contacts per company)
-- - Custom Fields: JSONB column for user-defined fields without schema changes
-- ----------------------------------------------------------------------------
CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  
  -- IDENTITY
  first_name TEXT NOT NULL,                                                   -- Contact first/given name
  last_name TEXT NOT NULL,                                                    -- Contact last/family name
  email TEXT UNIQUE NOT NULL,                                                 -- Primary email address
  job_title TEXT,                                                             -- Job title or role
  
  -- COMPANY & CLASSIFICATION
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,                -- FK to companies table
  type TEXT DEFAULT 'lead' CHECK (type IN ('lead', 'customer', 'partner')),   -- Contact type
  status TEXT DEFAULT 'active',                                               -- Current status
  
  -- LEAD MANAGEMENT
  source TEXT,                                                                -- Lead source (validates against lead_sources table)
  source_description TEXT,                                                    -- Custom source details (e.g., "LinkedIn Ad Campaign - HVAC Pros Q1")
  lead_score INTEGER DEFAULT 0 CHECK (lead_score >= 0 AND lead_score <= 100), -- Lead score (0-100)
  tags TEXT[] DEFAULT '{}',                                                   -- Categorization tags
  
  -- ADDITIONAL INFO
  notes TEXT,                                                                 -- Internal notes about contact
  linkedin_url TEXT,                                                          -- LinkedIn profile URL
  last_contact_date TIMESTAMPTZ,                                              -- Last interaction date
  
  -- CUSTOM FIELDS (JSONB for flexible user-defined fields)
  custom_fields JSONB DEFAULT '{}',                                           -- User-defined custom fields: {"Industry": "HVAC", "Budget": "$50k", "Decision_Maker": true}
  
  -- ASSIGNMENT & OWNERSHIP
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,                -- Assigned sales rep/CSR
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- AUDIT TIMESTAMPS
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Field Comments
COMMENT ON COLUMN contacts.id IS 'Primary key - unique identifier for the contact';
COMMENT ON COLUMN contacts.organization_id IS 'Multi-tenant FK - which organization owns this contact';

-- IDENTITY
COMMENT ON COLUMN contacts.first_name IS 'Contact first/given name';
COMMENT ON COLUMN contacts.last_name IS 'Contact last/family name';
COMMENT ON COLUMN contacts.email IS 'Primary email address - must be unique across all contacts';
COMMENT ON COLUMN contacts.job_title IS 'Job title or role (e.g., CEO, Sales Manager, Engineer)';

-- COMPANY & CLASSIFICATION
COMMENT ON COLUMN contacts.company_id IS 'FK to companies table - which company this contact works for (NULL for individuals)';
COMMENT ON COLUMN contacts.type IS 'Contact type: lead (prospect) -> customer -> partner';
COMMENT ON COLUMN contacts.status IS 'Current status (e.g., active, inactive, unqualified, nurturing)';

-- LEAD MANAGEMENT
COMMENT ON COLUMN contacts.source IS 'Lead source slug - validates against lead_sources table (e.g., "google_ads", "social_media", "referral") - allows org-specific custom sources';
COMMENT ON COLUMN contacts.source_description IS 'Custom source details - allows admins to specify exact campaign/channel (e.g., "LinkedIn Ad Campaign - HVAC Pros Q1", "Yelp Premium Listing", "HomeAdvisor Pro")';
COMMENT ON COLUMN contacts.lead_score IS 'Lead score (0-100) - calculated based on engagement, fit, behavior';
COMMENT ON COLUMN contacts.tags IS 'Denormalized tag cache (TEXT[] array) for fast queries: ["VIP", "Hot Lead"] - synced with normalized tags/taggable tables for tag management';

-- ADDITIONAL INFO
COMMENT ON COLUMN contacts.notes IS 'Internal notes and observations about this contact (not visible to customer)';
COMMENT ON COLUMN contacts.linkedin_url IS 'LinkedIn profile URL for social selling and research';
COMMENT ON COLUMN contacts.last_contact_date IS 'Last interaction date (call, email, meeting) for engagement tracking';

-- CUSTOM FIELDS
COMMENT ON COLUMN contacts.custom_fields IS 'User-defined custom fields stored as JSONB: {"Industry": "HVAC", "Budget": "$50k", "Decision_Maker": true, "Preferred_Contact_Time": "Morning"} - allows organizations to add custom fields without schema changes';

-- ASSIGNMENT & OWNERSHIP
COMMENT ON COLUMN contacts.assigned_to IS 'Assigned sales rep or CSR - FK to profiles';
COMMENT ON COLUMN contacts.created_by IS 'User who created this contact';

-- AUDIT TIMESTAMPS
COMMENT ON COLUMN contacts.created_at IS 'Timestamp when contact was created';
COMMENT ON COLUMN contacts.updated_at IS 'Auto-updated via trigger on every UPDATE';
COMMENT ON COLUMN contacts.deleted_at IS 'Soft delete timestamp - NULL means active';

-- Indexes
CREATE INDEX idx_contacts_organization ON contacts(organization_id) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_contacts_organization IS 'Find all contacts for an organization';

CREATE INDEX idx_contacts_company ON contacts(company_id) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_contacts_company IS 'Find all contacts at a company';

CREATE INDEX idx_contacts_assigned ON contacts(assigned_to) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_contacts_assigned IS 'Find contacts assigned to a specific user';

CREATE INDEX idx_contacts_type ON contacts(type) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_contacts_type IS 'Filter contacts by type (lead, customer, partner)';

CREATE INDEX idx_contacts_email ON contacts(email) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_contacts_email IS 'Lookup contact by email address';

CREATE INDEX idx_contacts_source ON contacts(source) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_contacts_source IS 'Filter contacts by acquisition source (attribution reporting)';

CREATE INDEX idx_contacts_lead_score ON contacts(lead_score DESC) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_contacts_lead_score IS 'Sort contacts by lead score (prioritize high-value leads)';

CREATE INDEX idx_contacts_last_contact ON contacts(last_contact_date DESC) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_contacts_last_contact IS 'Find contacts by last contact date (identify stale leads)';

CREATE INDEX idx_contacts_assigned_type ON contacts(assigned_to, type, status) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_contacts_assigned_type IS 'Composite index for user dashboard queries (my leads, my customers)';

-- GIN indexes for arrays and JSONB
CREATE INDEX idx_contacts_tags ON contacts USING GIN(tags) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_contacts_tags IS 'Filter contacts by tags (array containment queries)';

CREATE INDEX idx_contacts_custom_fields ON contacts USING GIN(custom_fields) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_contacts_custom_fields IS 'Query custom fields with JSONB operators: WHERE custom_fields @> {"Decision_Maker": true}';

-- Full-text search
CREATE INDEX idx_contacts_search ON contacts USING GIN(to_tsvector('english', first_name || ' ' || last_name || ' ' || COALESCE(email, '') || ' ' || COALESCE(job_title, ''))) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_contacts_search IS 'Full-text search across contact name, email, and job title';

-- Trigger
CREATE TRIGGER set_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
COMMENT ON TRIGGER set_contacts_updated_at ON contacts IS 'Auto-update updated_at timestamp on every UPDATE';


-- ============================================================================
-- STEP 3: NORMALIZED ENTITY TABLES (Polymorphic)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- TABLE: addresses
-- Purpose: Normalized address storage with Google Places support
-- Usage: Polymorphic - linked to profiles, companies, contacts, opportunities
-- ----------------------------------------------------------------------------
CREATE TABLE addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  
  -- Polymorphic Relationship
  parent_id UUID NOT NULL,                                        -- FK to parent entity (profile, company, contact, opportunity)
  parent_type TEXT NOT NULL CHECK (parent_type IN ('profile', 'company', 'contact', 'opportunity')),
  label TEXT DEFAULT 'main',                                      -- Address label (main, billing, shipping, work, home)
  
  -- Google Places / Geocoding
  place_id TEXT,                                                  -- Google Places ID
  formatted_address TEXT,                                         -- Full formatted address from Google Places API
  latitude NUMERIC(10, 8),                                        -- Geocoded latitude (-90 to 90)
  longitude NUMERIC(11, 8),                                       -- Geocoded longitude (-180 to 180)
  plus_code TEXT,                                                 -- Google Plus Code for precise location
  
  -- Address Components
  street_address TEXT,                                            -- Street number + street name
  suburb TEXT,                                                    -- Suburb or neighborhood
  postal_code TEXT,                                               -- Postal/ZIP code
  city TEXT,                                                      -- City or town
  state TEXT,                                                     -- State, province, or region
  country TEXT DEFAULT 'Australia',                               -- Country name
  
  -- Metadata
  is_primary BOOLEAN DEFAULT false,                               -- Primary address flag (only one per parent)
  is_verified BOOLEAN DEFAULT false,                              -- Address verified via geocoding
  
  -- Audit
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Field Comments
COMMENT ON COLUMN addresses.id IS 'Primary key - unique identifier for the address';
COMMENT ON COLUMN addresses.organization_id IS 'Multi-tenant FK - which organization owns this address';
COMMENT ON COLUMN addresses.parent_id IS 'Polymorphic FK - ID of parent entity (profile, company, contact, opportunity)';
COMMENT ON COLUMN addresses.parent_type IS 'Polymorphic type: profile | company | contact | opportunity';
COMMENT ON COLUMN addresses.label IS 'Address label (main, billing, shipping, work, home, warehouse, branch)';
COMMENT ON COLUMN addresses.place_id IS 'Google Places ID for autocomplete and geocoding integration';
COMMENT ON COLUMN addresses.formatted_address IS 'Full formatted address from Google Places API (e.g., "123 Main St, Brisbane QLD 4000, Australia")';
COMMENT ON COLUMN addresses.latitude IS 'Geocoded latitude coordinate (-90 to 90, 8 decimal precision for ~1mm accuracy)';
COMMENT ON COLUMN addresses.longitude IS 'Geocoded longitude coordinate (-180 to 180, 8 decimal precision)';
COMMENT ON COLUMN addresses.plus_code IS 'Google Plus Code for precise location (e.g., "8CM8+R9 Brisbane")';
COMMENT ON COLUMN addresses.street_address IS 'Street address line (street number + street name, e.g., "123 Main Street")';
COMMENT ON COLUMN addresses.suburb IS 'Suburb or neighborhood name';
COMMENT ON COLUMN addresses.postal_code IS 'Postal/ZIP code for mail delivery';
COMMENT ON COLUMN addresses.city IS 'City or town name';
COMMENT ON COLUMN addresses.state IS 'State, province, or region (e.g., "Queensland", "NSW", "California")';
COMMENT ON COLUMN addresses.country IS 'Country name (defaults to Australia)';
COMMENT ON COLUMN addresses.is_primary IS 'Primary address flag - only one primary address per parent entity (enforced by UNIQUE index)';
COMMENT ON COLUMN addresses.is_verified IS 'Address verified via Google Places geocoding API';
COMMENT ON COLUMN addresses.created_by IS 'User who created this address record';
COMMENT ON COLUMN addresses.created_at IS 'Timestamp when address was created';
COMMENT ON COLUMN addresses.updated_at IS 'Auto-updated timestamp when address is modified';

-- Indexes
CREATE INDEX idx_addresses_organization ON addresses(organization_id) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_addresses_organization IS 'Find all addresses for an organization';

CREATE INDEX idx_addresses_parent ON addresses(parent_id, parent_type) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_addresses_parent IS 'Find all addresses for a parent entity (polymorphic lookup)';

CREATE INDEX idx_addresses_postal ON addresses(postal_code) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_addresses_postal IS 'Find addresses by postal code (territory assignment, routing optimization)';

CREATE INDEX idx_addresses_city_state ON addresses(city, state) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_addresses_city_state IS 'Find addresses by city and state (regional queries)';

CREATE INDEX idx_addresses_location ON addresses(latitude, longitude) WHERE deleted_at IS NULL AND latitude IS NOT NULL;
COMMENT ON INDEX idx_addresses_location IS 'Spatial queries for proximity search (find nearby addresses)';

-- Only ONE primary address per entity
CREATE UNIQUE INDEX idx_addresses_primary ON addresses(parent_id, parent_type) WHERE is_primary = true AND deleted_at IS NULL;
COMMENT ON INDEX idx_addresses_primary IS 'Enforce only one primary address per parent entity';

-- Trigger
CREATE TRIGGER set_addresses_updated_at
  BEFORE UPDATE ON addresses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
COMMENT ON TRIGGER set_addresses_updated_at ON addresses IS 'Auto-update updated_at timestamp on every UPDATE';


-- ----------------------------------------------------------------------------
-- TABLE: phones
-- Purpose: Normalized phone number storage
-- Usage: Polymorphic - linked to profiles, companies, contacts
-- ----------------------------------------------------------------------------
CREATE TABLE phones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  
  -- Polymorphic Relationship
  parent_id UUID NOT NULL,                                                    -- FK to parent entity (profile, company, contact)
  parent_type TEXT NOT NULL CHECK (parent_type IN ('profile', 'company', 'contact')),  -- Entity type
  label TEXT DEFAULT 'mobile',                                                -- Phone label (mobile, work, home, fax, etc.)
  
  -- Phone Number
  number TEXT NOT NULL,                                                       -- Phone number in E.164 format (+61400123456)
  extension TEXT,                                                             -- Phone extension for office numbers
  
  -- Metadata
  is_primary BOOLEAN DEFAULT false,                                           -- Primary phone flag (only one per parent)
  is_verified BOOLEAN DEFAULT false,                                          -- Phone verified via SMS/call
  
  -- Audit
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Field Comments
COMMENT ON COLUMN phones.id IS 'Primary key - unique identifier for the phone number';
COMMENT ON COLUMN phones.organization_id IS 'Multi-tenant FK - which organization owns this phone number';
COMMENT ON COLUMN phones.parent_id IS 'Polymorphic FK - ID of parent entity (profile, company, contact)';
COMMENT ON COLUMN phones.parent_type IS 'Polymorphic type: profile | company | contact';
COMMENT ON COLUMN phones.label IS 'Phone label (mobile, work, home, fax, office, direct, support, billing)';
COMMENT ON COLUMN phones.number IS 'Phone number in E.164 format for international compatibility (e.g., "+61400123456", "+14155552671")';
COMMENT ON COLUMN phones.extension IS 'Phone extension for office/work numbers (e.g., "1234", "ext 5678")';
COMMENT ON COLUMN phones.is_primary IS 'Primary phone flag - only one primary phone per parent entity (enforced by UNIQUE index)';
COMMENT ON COLUMN phones.is_verified IS 'Phone verified via SMS verification code or successful call';
COMMENT ON COLUMN phones.created_by IS 'User who added this phone number';
COMMENT ON COLUMN phones.created_at IS 'Timestamp when phone number was created';
COMMENT ON COLUMN phones.updated_at IS 'Auto-updated via trigger on every UPDATE';
COMMENT ON COLUMN phones.deleted_at IS 'Soft delete timestamp - NULL means active';

-- Indexes
CREATE INDEX idx_phones_organization ON phones(organization_id) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_phones_organization IS 'Find all phone numbers for an organization';

CREATE INDEX idx_phones_parent ON phones(parent_id, parent_type) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_phones_parent IS 'Find all phone numbers for a parent entity (polymorphic lookup)';

CREATE INDEX idx_phones_number ON phones(number) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_phones_number IS 'Find entity by phone number (reverse lookup for SMS/calls, caller ID matching)';

-- Only ONE primary phone per entity
CREATE UNIQUE INDEX idx_phones_primary ON phones(parent_id, parent_type) WHERE is_primary = true AND deleted_at IS NULL;
COMMENT ON INDEX idx_phones_primary IS 'Enforce only one primary phone number per parent entity';

-- Trigger
CREATE TRIGGER set_phones_updated_at
  BEFORE UPDATE ON phones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
COMMENT ON TRIGGER set_phones_updated_at ON phones IS 'Auto-update updated_at timestamp on every UPDATE';


-- ============================================================================
-- STEP 4: CRM CORE TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- TABLE: pipelines
-- Purpose: Sales pipeline definitions (multiple pipelines per organization)
-- Usage: Organizations can have different pipelines for different processes
-- Examples: "Sales Pipeline", "Service Pipeline", "Installation Pipeline"
-- ----------------------------------------------------------------------------
CREATE TABLE pipelines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  
  name TEXT NOT NULL,                                                         -- Pipeline name (e.g., "Sales Pipeline", "Service Pipeline")
  slug TEXT NOT NULL,                                                         -- URL-friendly identifier (e.g., "sales", "service")
  description TEXT,                                                           -- Pipeline description/purpose
  
  -- Visual & UI
  color TEXT DEFAULT '#3B82F6',                                               -- Hex color for UI display
  icon TEXT,                                                                  -- Icon identifier for UI
  
  -- Settings
  is_default BOOLEAN DEFAULT false,                                           -- Default pipeline for new opportunities
  is_active BOOLEAN DEFAULT true,                                             -- Active/archived pipeline
  display_order INTEGER DEFAULT 0,                                            -- Display order in UI
  
  -- Stats
  opportunities_count INTEGER DEFAULT 0,                                      -- Number of opportunities in this pipeline
  
  -- Audit
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  
  UNIQUE(organization_id, slug)                                               -- Unique slug per organization
);

-- Field Comments
COMMENT ON COLUMN pipelines.id IS 'Primary key - unique identifier for the pipeline';
COMMENT ON COLUMN pipelines.organization_id IS 'Multi-tenant FK - which organization owns this pipeline';
COMMENT ON COLUMN pipelines.name IS 'Pipeline name (e.g., "Sales Pipeline", "Service Pipeline", "Installation Pipeline", "Renewal Pipeline")';
COMMENT ON COLUMN pipelines.slug IS 'URL-friendly identifier (e.g., "sales", "service", "installation", "renewal")';
COMMENT ON COLUMN pipelines.description IS 'Pipeline description and intended use case';
COMMENT ON COLUMN pipelines.color IS 'Hex color code for UI display (e.g., #3B82F6 for blue, #10B981 for green)';
COMMENT ON COLUMN pipelines.icon IS 'Icon identifier for UI (e.g., "trending-up", "wrench", "package")';
COMMENT ON COLUMN pipelines.is_default IS 'Default pipeline for new opportunities (only one default per organization)';
COMMENT ON COLUMN pipelines.is_active IS 'Whether this pipeline is active (false = archived, no new opportunities)';
COMMENT ON COLUMN pipelines.display_order IS 'Display order in UI (lower numbers shown first)';
COMMENT ON COLUMN pipelines.opportunities_count IS 'Cached count of opportunities in this pipeline (updated via app logic)';
COMMENT ON COLUMN pipelines.created_by IS 'User who created this pipeline';
COMMENT ON COLUMN pipelines.created_at IS 'Timestamp when pipeline was created';
COMMENT ON COLUMN pipelines.updated_at IS 'Auto-updated via trigger on every UPDATE';
COMMENT ON COLUMN pipelines.deleted_at IS 'Soft delete timestamp - NULL means active';

-- Indexes
CREATE INDEX idx_pipelines_organization ON pipelines(organization_id) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_pipelines_organization IS 'Find all pipelines for an organization';

CREATE INDEX idx_pipelines_slug ON pipelines(organization_id, slug) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_pipelines_slug IS 'Lookup pipeline by slug within organization';

CREATE INDEX idx_pipelines_default ON pipelines(organization_id) WHERE is_default = true AND deleted_at IS NULL;
COMMENT ON INDEX idx_pipelines_default IS 'Find default pipeline for organization';

-- Only ONE default pipeline per organization
CREATE UNIQUE INDEX idx_pipelines_default_unique ON pipelines(organization_id) WHERE is_default = true AND deleted_at IS NULL;
COMMENT ON INDEX idx_pipelines_default_unique IS 'Enforce only one default pipeline per organization';

-- Trigger
CREATE TRIGGER set_pipelines_updated_at
  BEFORE UPDATE ON pipelines
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
COMMENT ON TRIGGER set_pipelines_updated_at ON pipelines IS 'Auto-update updated_at timestamp on every UPDATE';


-- ----------------------------------------------------------------------------
-- TABLE: pipeline_stages
-- Purpose: Pipeline stage definitions (stages belong to specific pipelines)
-- Usage: Each pipeline has its own set of stages
-- Note: Stages are pipeline-specific (Sales stages ≠ Service stages)
-- ----------------------------------------------------------------------------
CREATE TABLE pipeline_stages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pipeline_id UUID REFERENCES pipelines(id) ON DELETE CASCADE NOT NULL,       -- FK to pipelines - which pipeline this stage belongs to
  
  slug TEXT NOT NULL,                                                         -- Stage key (e.g., 'leads', 'contacted', 'quoting')
  name TEXT NOT NULL,                                                         -- Display name (e.g., "New Leads", "In Contact")
  description TEXT,                                                           -- Stage description/purpose
  
  -- Visual & UI
  color TEXT DEFAULT '#3B82F6',                                               -- Hex color for UI display
  icon TEXT,                                                                  -- Icon identifier for UI
  
  -- Workflow & Logic
  stage_order INTEGER NOT NULL,                                               -- Display order in pipeline (1, 2, 3...)
  is_closed BOOLEAN DEFAULT false,                                            -- Stage represents closed opportunity
  is_won BOOLEAN DEFAULT false,                                               -- Stage represents won deal
  probability INTEGER DEFAULT 0 CHECK (probability >= 0 AND probability <= 100),  -- Win probability % for forecasting
  
  -- Settings
  is_active BOOLEAN DEFAULT true,                                             -- Active/archived stage
  opportunities_count INTEGER DEFAULT 0,                                      -- Number of opportunities in this stage
  
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  
  UNIQUE(pipeline_id, slug)                                                   -- Unique slug per pipeline
);

-- Field Comments
COMMENT ON COLUMN pipeline_stages.id IS 'Primary key - unique identifier for the pipeline stage';
COMMENT ON COLUMN pipeline_stages.pipeline_id IS 'FK to pipelines - which pipeline this stage belongs to';
COMMENT ON COLUMN pipeline_stages.slug IS 'Stage key within pipeline (e.g., "lead_capture", "qualification", "contacted", "proposal", "negotiation", "closed_won", "closed_lost")';
COMMENT ON COLUMN pipeline_stages.name IS 'Human-readable display name (e.g., "Lead Capture", "Qualification", "Contacted", "Proposal/Quote", "Negotiation", "Closed Won", "Closed Lost")';
COMMENT ON COLUMN pipeline_stages.description IS 'Description and usage guidelines for this stage';
COMMENT ON COLUMN pipeline_stages.color IS 'Hex color code for UI display (e.g., #3B82F6 blue, #10B981 green/won, #EF4444 red/lost)';
COMMENT ON COLUMN pipeline_stages.icon IS 'Icon identifier for UI (e.g., "inbox", "phone", "document", "check-circle")';
COMMENT ON COLUMN pipeline_stages.stage_order IS 'Display order in pipeline visualization (1 = first stage, higher = later stages)';
COMMENT ON COLUMN pipeline_stages.is_closed IS 'Stage represents closed opportunity (won or lost) - excludes from active pipeline';
COMMENT ON COLUMN pipeline_stages.is_won IS 'Stage represents won deal (revenue counted, is_closed must also be true)';
COMMENT ON COLUMN pipeline_stages.probability IS 'Win probability % (0-100) for weighted forecasting (leads=10%, quoting=50%, booked=90%)';
COMMENT ON COLUMN pipeline_stages.is_active IS 'Whether this stage is active (false = archived, can''t move opportunities here)';
COMMENT ON COLUMN pipeline_stages.opportunities_count IS 'Cached count of opportunities in this stage (updated via app logic)';
COMMENT ON COLUMN pipeline_stages.created_by IS 'User who created this stage';
COMMENT ON COLUMN pipeline_stages.created_at IS 'Timestamp when stage was created';
COMMENT ON COLUMN pipeline_stages.updated_at IS 'Auto-updated via trigger on every UPDATE';
COMMENT ON COLUMN pipeline_stages.deleted_at IS 'Soft delete timestamp - NULL means active';

-- Indexes
CREATE INDEX idx_pipeline_stages_pipeline ON pipeline_stages(pipeline_id) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_pipeline_stages_pipeline IS 'Find all stages for a pipeline';

CREATE INDEX idx_pipeline_stages_slug ON pipeline_stages(pipeline_id, slug) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_pipeline_stages_slug IS 'Lookup stage by slug within pipeline';

CREATE INDEX idx_pipeline_stages_order ON pipeline_stages(pipeline_id, stage_order) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_pipeline_stages_order IS 'Display stages in correct order for pipeline visualization';

-- Trigger
CREATE TRIGGER set_pipeline_stages_updated_at
  BEFORE UPDATE ON pipeline_stages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
COMMENT ON TRIGGER set_pipeline_stages_updated_at ON pipeline_stages IS 'Auto-update updated_at timestamp on every UPDATE';


-- ----------------------------------------------------------------------------
-- TABLE: opportunities
-- Purpose: Sales pipeline tracking with customizable stages
-- Usage: Revenue forecasting, job scheduling, technician assignment
-- Note: Each opportunity belongs to one pipeline and moves through its stages
-- ----------------------------------------------------------------------------
CREATE TABLE opportunities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  
  -- BASIC INFO
  title TEXT NOT NULL,                                                        -- Opportunity title or description
  
  -- RELATIONSHIPS
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,                  -- Primary contact for this opportunity
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,                 -- Company this opportunity is with
  
  -- FINANCIAL
  value NUMERIC(12, 2) DEFAULT 0,                                             -- Estimated deal value
  actual_revenue NUMERIC(12, 2) DEFAULT 0,                                    -- Actual revenue when completed
  
  -- PIPELINE & STATUS
  pipeline_id UUID REFERENCES pipelines(id) ON DELETE SET NULL,               -- Which pipeline this opportunity is in
  pipeline_stage_id UUID REFERENCES pipeline_stages(id) ON DELETE SET NULL,   -- Current stage in the pipeline
  source TEXT DEFAULT 'webform' CHECK (source IN ('webform', 'lead', 'referral')),  -- Lead source for attribution
  
  -- FEEDBACK & ANALYSIS
  customer_satisfaction TEXT CHECK (customer_satisfaction IN ('happy', 'unhappy')),  -- Customer feedback
  loss_reason TEXT,                                                           -- Reason for lost deals
  
  -- SCHEDULING
  scheduled_date TIMESTAMPTZ,                                                 -- Scheduled job date
  completed_date TIMESTAMPTZ,                                                 -- Completion date
  
  -- ASSIGNMENT
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,                -- Sales rep assigned
  technician_id UUID REFERENCES profiles(id) ON DELETE SET NULL,              -- Technician assigned for job
  
  -- CUSTOM FIELDS
  custom_fields JSONB DEFAULT '{}',                                           -- User-defined custom fields
  
  -- AUDIT
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Field Comments
COMMENT ON COLUMN opportunities.id IS 'Primary key - unique identifier for the opportunity';
COMMENT ON COLUMN opportunities.organization_id IS 'Multi-tenant FK - which organization owns this opportunity';

-- BASIC INFO
COMMENT ON COLUMN opportunities.title IS 'Opportunity title or description (e.g., "HVAC Installation - Main St Office", "Annual Maintenance Contract - Acme Corp")';

-- RELATIONSHIPS
COMMENT ON COLUMN opportunities.contact_id IS 'FK to contacts - primary contact for this opportunity (decision maker or requester)';
COMMENT ON COLUMN opportunities.company_id IS 'FK to companies - company this opportunity is with (B2B opportunities)';

-- FINANCIAL
COMMENT ON COLUMN opportunities.value IS 'Estimated deal value in organization currency (used for pipeline forecasting and revenue projections)';
COMMENT ON COLUMN opportunities.actual_revenue IS 'Actual revenue generated when completed (may differ from estimated value due to scope changes, discounts, upsells)';

-- PIPELINE & STATUS
COMMENT ON COLUMN opportunities.pipeline_id IS 'FK to pipelines - which pipeline this opportunity is in (e.g., Sales Pipeline, Service Pipeline, Installation Pipeline)';
COMMENT ON COLUMN opportunities.pipeline_stage_id IS 'FK to pipeline_stages - current stage in the pipeline (e.g., Lead Capture, Qualification, Contacted, Proposal/Quote, Negotiation, Closed Won, Closed Lost)';
COMMENT ON COLUMN opportunities.source IS 'Lead source for attribution tracking: webform (website form) | lead (inbound call/email) | referral (customer/partner referral)';

-- FEEDBACK & ANALYSIS
COMMENT ON COLUMN opportunities.customer_satisfaction IS 'Customer feedback after job completion: happy (satisfied) | unhappy (dissatisfied, needs follow-up)';
COMMENT ON COLUMN opportunities.loss_reason IS 'Reason for lost deals: competitor (lost to competitor), price (too expensive), timing (not ready to buy), budget (no budget), no_response (ghosted), etc.';

-- SCHEDULING
COMMENT ON COLUMN opportunities.scheduled_date IS 'Scheduled date for job execution (when pipeline = booked, used for technician calendar and dispatch)';
COMMENT ON COLUMN opportunities.completed_date IS 'Date when opportunity was closed (won or lost) - tracks sales cycle duration';

-- ASSIGNMENT
COMMENT ON COLUMN opportunities.assigned_to IS 'FK to profiles - sales rep assigned to this opportunity (account owner, responsible for moving through pipeline)';
COMMENT ON COLUMN opportunities.technician_id IS 'FK to profiles - technician assigned for job execution (set when pipeline = booked)';

-- CUSTOM FIELDS
COMMENT ON COLUMN opportunities.custom_fields IS 'User-defined custom fields stored as JSONB: {"Equipment_Type": "Split System AC", "Property_Type": "Commercial", "Urgency": "High", "Square_Footage": 5000} - allows organizations to add custom fields without schema changes';

-- AUDIT
COMMENT ON COLUMN opportunities.created_by IS 'User who created this opportunity';
COMMENT ON COLUMN opportunities.created_at IS 'Timestamp when opportunity was created';
COMMENT ON COLUMN opportunities.updated_at IS 'Auto-updated via trigger on every UPDATE';
COMMENT ON COLUMN opportunities.deleted_at IS 'Soft delete timestamp - NULL means active';

-- Indexes
CREATE INDEX idx_opportunities_organization ON opportunities(organization_id) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_opportunities_organization IS 'Find all opportunities for an organization';

CREATE INDEX idx_opportunities_pipeline ON opportunities(pipeline_id) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_opportunities_pipeline IS 'Find all opportunities in a specific pipeline';

CREATE INDEX idx_opportunities_pipeline_stage ON opportunities(pipeline_stage_id) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_opportunities_pipeline_stage IS 'Find all opportunities in a specific stage';

CREATE INDEX idx_opportunities_pipeline_stage_combo ON opportunities(pipeline_id, pipeline_stage_id) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_opportunities_pipeline_stage_combo IS 'Filter opportunities by pipeline AND stage (pipeline visualization)';

CREATE INDEX idx_opportunities_assigned ON opportunities(assigned_to) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_opportunities_assigned IS 'Find opportunities assigned to a user';

CREATE INDEX idx_opportunities_scheduled ON opportunities(scheduled_date) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_opportunities_scheduled IS 'Find opportunities by scheduled date (calendar view)';

CREATE INDEX idx_opportunities_contact ON opportunities(contact_id) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_opportunities_contact IS 'Find all opportunities for a contact';

CREATE INDEX idx_opportunities_company ON opportunities(company_id) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_opportunities_company IS 'Find all opportunities for a company';

CREATE INDEX idx_opportunities_assigned_pipeline ON opportunities(assigned_to, pipeline_id, pipeline_stage_id, scheduled_date) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_opportunities_assigned_pipeline IS 'Composite index for user dashboard (my pipeline, my stage, upcoming jobs)';

-- GIN index for JSONB
CREATE INDEX idx_opportunities_custom_fields ON opportunities USING GIN(custom_fields) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_opportunities_custom_fields IS 'Query custom fields with JSONB operators: WHERE custom_fields @> {"Urgency": "High"}';

-- Trigger
CREATE TRIGGER set_opportunities_updated_at
  BEFORE UPDATE ON opportunities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
COMMENT ON TRIGGER set_opportunities_updated_at ON opportunities IS 'Auto-update updated_at timestamp on every UPDATE';


-- ----------------------------------------------------------------------------
-- TABLE: lead_sources
-- Purpose: Lead source definitions with metadata for attribution tracking
-- Usage: Reference table for contacts.source, companies.source (with usage analytics)
-- Note: Predefined system sources + org-specific customization
-- ----------------------------------------------------------------------------
CREATE TABLE lead_sources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,        -- NULL for system sources, org-specific otherwise
  
  slug TEXT NOT NULL,                                                         -- Source key (matches enum: 'google_ads', 'social_media', etc.)
  name TEXT NOT NULL,                                                         -- Display name (e.g., "Google Ads", "Social Media")
  icon TEXT,                                                                  -- Icon name/class for UI (e.g., "google", "facebook", "email")
  color TEXT DEFAULT '#3B82F6',                                               -- Hex color for UI display
  description TEXT,                                                           -- Description/usage guidelines
  
  is_enabled BOOLEAN DEFAULT true,                                            -- Enable/disable source for organization
  is_system BOOLEAN DEFAULT false,                                            -- System source (cannot be deleted)
  usage_count INTEGER DEFAULT 0,                                              -- Number of contacts/companies using this source
  
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  
  UNIQUE(organization_id, slug)                                               -- Unique slug per organization (NULL org_id for system sources)
);

-- Field Comments
COMMENT ON COLUMN lead_sources.id IS 'Primary key - unique identifier for the lead source';
COMMENT ON COLUMN lead_sources.organization_id IS 'Organization FK - NULL for system/global sources, set for org-specific custom sources';
COMMENT ON COLUMN lead_sources.slug IS 'Source key matching enum values: inbound, outbound, google_ads, social_media, etc.';
COMMENT ON COLUMN lead_sources.name IS 'Human-readable display name (e.g., "Google Ads", "Social Media Marketing")';
COMMENT ON COLUMN lead_sources.icon IS 'Icon identifier for UI (e.g., "google", "facebook", "linkedin", "mail", "phone")';
COMMENT ON COLUMN lead_sources.color IS 'Hex color code for charts/badges (e.g., #4285F4 for Google blue, #1877F2 for Facebook blue)';
COMMENT ON COLUMN lead_sources.description IS 'Description and usage guidelines for this source (when to use, what it includes)';
COMMENT ON COLUMN lead_sources.is_enabled IS 'Whether this source is available for selection in this organization';
COMMENT ON COLUMN lead_sources.is_system IS 'System source flag - cannot be edited/deleted by users';
COMMENT ON COLUMN lead_sources.usage_count IS 'Cached count of contacts/companies using this source (updated via app logic)';
COMMENT ON COLUMN lead_sources.created_by IS 'User who created this custom source';
COMMENT ON COLUMN lead_sources.created_at IS 'Timestamp when source was created';
COMMENT ON COLUMN lead_sources.updated_at IS 'Auto-updated via trigger on every UPDATE';
COMMENT ON COLUMN lead_sources.deleted_at IS 'Soft delete timestamp - NULL means active';

-- Indexes
CREATE INDEX idx_lead_sources_organization ON lead_sources(organization_id) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_lead_sources_organization IS 'Find all lead sources for an organization';

CREATE INDEX idx_lead_sources_slug ON lead_sources(slug) WHERE deleted_at IS NULL AND is_enabled = true;
COMMENT ON INDEX idx_lead_sources_slug IS 'Lookup source by slug (for validation and display)';

CREATE INDEX idx_lead_sources_usage ON lead_sources(usage_count DESC) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_lead_sources_usage IS 'Find most popular sources (for analytics dashboards)';

-- Trigger
CREATE TRIGGER set_lead_sources_updated_at
  BEFORE UPDATE ON lead_sources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
COMMENT ON TRIGGER set_lead_sources_updated_at ON lead_sources IS 'Auto-update updated_at timestamp on every UPDATE';


-- ----------------------------------------------------------------------------
-- TABLE: tags
-- Purpose: Normalized tag management with metadata
-- Usage: Tag definitions for contacts, companies, opportunities (many-to-many via taggable table)
-- Note: entities also have tags TEXT[] for denormalized quick access
-- ----------------------------------------------------------------------------
CREATE TABLE tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  
  name TEXT NOT NULL,                                                         -- Tag name (e.g., "VIP", "Hot Lead")
  slug TEXT NOT NULL,                                                         -- URL-friendly version (e.g., "vip", "hot-lead")
  color TEXT DEFAULT '#3B82F6',                                               -- Hex color for UI display
  description TEXT,                                                           -- Tag description/purpose
  
  usage_count INTEGER DEFAULT 0,                                              -- Number of entities using this tag
  is_system BOOLEAN DEFAULT false,                                            -- System tag (cannot be deleted by users)
  
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  
  UNIQUE(organization_id, slug)                                               -- Unique tag per organization
);

-- Field Comments
COMMENT ON COLUMN tags.id IS 'Primary key - unique identifier for the tag';
COMMENT ON COLUMN tags.organization_id IS 'Multi-tenant FK - which organization owns this tag';
COMMENT ON COLUMN tags.name IS 'Display name of the tag (e.g., "VIP Customer", "Hot Lead")';
COMMENT ON COLUMN tags.slug IS 'URL-friendly slug for the tag (e.g., "vip-customer", "hot-lead")';
COMMENT ON COLUMN tags.color IS 'Hex color code for UI display (e.g., #3B82F6 for blue, #EF4444 for red)';
COMMENT ON COLUMN tags.description IS 'Description of what this tag represents and when to use it';
COMMENT ON COLUMN tags.usage_count IS 'Cached count of how many entities use this tag (updated via triggers)';
COMMENT ON COLUMN tags.is_system IS 'System tag flag - cannot be edited/deleted by regular users';
COMMENT ON COLUMN tags.created_by IS 'User who created this tag';
COMMENT ON COLUMN tags.created_at IS 'Timestamp when tag was created';
COMMENT ON COLUMN tags.updated_at IS 'Auto-updated via trigger on every UPDATE';
COMMENT ON COLUMN tags.deleted_at IS 'Soft delete timestamp - NULL means active';

-- Indexes
CREATE INDEX idx_tags_organization ON tags(organization_id) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_tags_organization IS 'Find all tags for an organization';

CREATE INDEX idx_tags_slug ON tags(slug) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_tags_slug IS 'Lookup tag by slug';

CREATE INDEX idx_tags_usage ON tags(usage_count DESC) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_tags_usage IS 'Find most popular tags';

-- Trigger
CREATE TRIGGER set_tags_updated_at
  BEFORE UPDATE ON tags
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
COMMENT ON TRIGGER set_tags_updated_at ON tags IS 'Auto-update updated_at timestamp on every UPDATE';


-- ----------------------------------------------------------------------------
-- TABLE: taggable (polymorphic junction table)
-- Purpose: Many-to-many relationship between tags and entities
-- Usage: Links tags to contacts, companies, opportunities, etc.
-- Note: entities also maintain tags TEXT[] array for denormalized quick queries
-- ----------------------------------------------------------------------------
CREATE TABLE taggable (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE NOT NULL,
  
  taggable_id UUID NOT NULL,                                                  -- Polymorphic FK to tagged entity
  taggable_type TEXT NOT NULL CHECK (taggable_type IN ('contact', 'company', 'opportunity', 'profile')),  -- Entity type
  
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,                                                     -- Soft delete for tag removal history
  
  UNIQUE(tag_id, taggable_id, taggable_type)                                  -- Prevent duplicate tags on same entity
);

-- Field Comments
COMMENT ON COLUMN taggable.id IS 'Primary key - unique identifier for the tag relationship';
COMMENT ON COLUMN taggable.organization_id IS 'Multi-tenant FK - which organization owns this tag relationship';
COMMENT ON COLUMN taggable.tag_id IS 'FK to tags table - which tag is being applied';
COMMENT ON COLUMN taggable.taggable_id IS 'Polymorphic FK - ID of the entity being tagged (contact, company, opportunity, profile)';
COMMENT ON COLUMN taggable.taggable_type IS 'Entity type: contact | company | opportunity | profile';
COMMENT ON COLUMN taggable.created_by IS 'User who applied this tag';
COMMENT ON COLUMN taggable.created_at IS 'Timestamp when tag was applied';
COMMENT ON COLUMN taggable.deleted_at IS 'Soft delete timestamp - NULL means active tag assignment';

-- Indexes
CREATE INDEX idx_taggable_organization ON taggable(organization_id) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_taggable_organization IS 'Find all tag relationships for an organization';

CREATE INDEX idx_taggable_tag ON taggable(tag_id) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_taggable_tag IS 'Find all entities with a specific tag';

CREATE INDEX idx_taggable_entity ON taggable(taggable_id, taggable_type) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_taggable_entity IS 'Find all tags for a specific entity (polymorphic lookup)';

CREATE INDEX idx_taggable_type ON taggable(taggable_type) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_taggable_type IS 'Find all tagged entities of a specific type';


-- ----------------------------------------------------------------------------
-- TABLE: teams
-- Purpose: Organizing users into groups for permissions and reporting
-- Usage: Sales teams, support teams, service areas, territory-based teams
-- ----------------------------------------------------------------------------
CREATE TABLE teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  
  name TEXT NOT NULL,                                                         -- Team name (e.g., "Sales Team", "Support Team")
  description TEXT,                                                           -- Team description and purpose
  
  -- Management
  manager_id UUID REFERENCES profiles(id) ON DELETE SET NULL,                 -- Team manager/lead
  
  -- Audit
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,                 -- User who created this team
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Field Comments
COMMENT ON COLUMN teams.id IS 'Primary key - unique identifier for the team';
COMMENT ON COLUMN teams.organization_id IS 'Multi-tenant FK - which organization owns this team';
COMMENT ON COLUMN teams.name IS 'Team name (e.g., "Sales Team", "Support Team", "Brisbane Technicians", "North Region Sales")';
COMMENT ON COLUMN teams.description IS 'Team description and purpose (e.g., "Handles all enterprise sales in Queensland region")';
COMMENT ON COLUMN teams.manager_id IS 'FK to profiles - team manager/lead who oversees team members and activities';
COMMENT ON COLUMN teams.created_by IS 'User who created this team';
COMMENT ON COLUMN teams.created_at IS 'Timestamp when team was created';
COMMENT ON COLUMN teams.updated_at IS 'Auto-updated via trigger on every UPDATE';
COMMENT ON COLUMN teams.deleted_at IS 'Soft delete timestamp - NULL means active';

-- Indexes
CREATE INDEX idx_teams_organization ON teams(organization_id) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_teams_organization IS 'Find all teams for an organization';

CREATE INDEX idx_teams_manager ON teams(manager_id) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_teams_manager IS 'Find teams managed by a specific user';

-- Trigger
CREATE TRIGGER set_teams_updated_at
  BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
COMMENT ON TRIGGER set_teams_updated_at ON teams IS 'Auto-update updated_at timestamp on every UPDATE';


-- ----------------------------------------------------------------------------
-- TABLE: tasks (ClickUp-style)
-- Purpose: Task management with subtasks and polymorphic linking
-- Usage: Follow-ups, to-dos, project tasks, reminders
-- ----------------------------------------------------------------------------
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  
  -- Polymorphic Relationships
  parent_id UUID,                                                             -- FK to parent entity (contact, company, opportunity, profile)
  parent_type TEXT CHECK (parent_type IN ('contact', 'company', 'opportunity', 'profile')),  -- Entity type
  parent_task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,                 -- Self-referencing FK for subtasks
  
  -- Task Details
  title TEXT NOT NULL,                                                        -- Task title or summary
  description TEXT,                                                           -- Detailed description (markdown supported)
  status TEXT DEFAULT 'To Do' CHECK (status IN ('Backlog', 'To Do', 'In Progress', 'In Review', 'Blocked', 'Completed', 'Cancelled')),
  priority TEXT DEFAULT 'Normal' CHECK (priority IN ('Low', 'Normal', 'High', 'Urgent')),
  
  -- Scheduling
  due_date TIMESTAMPTZ,                                                       -- Due date and time
  start_date TIMESTAMPTZ,                                                     -- Planned start date
  reminder_date TIMESTAMPTZ,                                                  -- Reminder notification date/time
  
  -- Assignment
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,                -- User assigned to complete
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,                       -- Team assigned (for team tasks)
  watchers UUID[],                                                            -- Array of profile UUIDs watching this task
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,                 -- User who created the task
  
  -- Time Tracking
  estimated_hours NUMERIC(8, 2),                                              -- Estimated hours to complete
  actual_hours NUMERIC(8, 2),                                                 -- Actual hours spent
  
  -- Metadata
  tags TEXT[],                                                                -- Tags for categorization
  checklists JSONB DEFAULT '[]',                                              -- Checklist items array
  attachments JSONB DEFAULT '[]',                                             -- File attachments array
  
  -- Completion Tracking
  is_completed BOOLEAN DEFAULT false,                                         -- Quick completion flag
  completed_at TIMESTAMPTZ,                                                   -- Completion timestamp
  completed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,               -- User who completed the task
  
  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Field Comments
COMMENT ON COLUMN tasks.id IS 'Primary key - unique identifier for the task';
COMMENT ON COLUMN tasks.organization_id IS 'Multi-tenant FK - which organization owns this task';
COMMENT ON COLUMN tasks.parent_id IS 'Polymorphic FK - ID of parent entity (contact, company, opportunity, profile)';
COMMENT ON COLUMN tasks.parent_type IS 'Polymorphic type: contact | company | opportunity | profile';
COMMENT ON COLUMN tasks.parent_task_id IS 'Self-referencing FK for subtasks (creates parent-child task hierarchy)';
COMMENT ON COLUMN tasks.title IS 'Task title or summary';
COMMENT ON COLUMN tasks.description IS 'Detailed task description (supports markdown)';
COMMENT ON COLUMN tasks.status IS 'Task status: Backlog | To Do | In Progress | In Review | Blocked | Completed | Cancelled';
COMMENT ON COLUMN tasks.priority IS 'Task priority: Low | Normal | High | Urgent';
COMMENT ON COLUMN tasks.due_date IS 'Due date and time for task completion';
COMMENT ON COLUMN tasks.start_date IS 'Planned start date for task';
COMMENT ON COLUMN tasks.reminder_date IS 'Reminder notification date/time';
COMMENT ON COLUMN tasks.assigned_to IS 'FK to profiles - user assigned to complete this task';
COMMENT ON COLUMN tasks.team_id IS 'FK to teams - team assigned to this task (for collaborative team tasks)';
COMMENT ON COLUMN tasks.watchers IS 'Array of profile UUIDs watching this task (receive notifications on updates)';
COMMENT ON COLUMN tasks.created_by IS 'User who created this task';
COMMENT ON COLUMN tasks.estimated_hours IS 'Estimated hours to complete this task (for workload planning and forecasting)';
COMMENT ON COLUMN tasks.actual_hours IS 'Actual hours spent on this task (tracked via time entries or manual input)';
COMMENT ON COLUMN tasks.tags IS 'Array of tags for categorization (e.g., ["follow-up", "urgent"])';
COMMENT ON COLUMN tasks.checklists IS 'JSONB array of checklist items: [{"text": "Item", "completed": false}]';
COMMENT ON COLUMN tasks.attachments IS 'JSONB array of file attachments: [{"name": "document.pdf", "url": "...", "size": 12345}]';
COMMENT ON COLUMN tasks.is_completed IS 'Quick boolean flag for completed status';
COMMENT ON COLUMN tasks.completed_at IS 'Timestamp when task was marked as completed';
COMMENT ON COLUMN tasks.completed_by IS 'FK to profiles - user who marked this task as completed (may differ from assigned_to)';
COMMENT ON COLUMN tasks.created_at IS 'Timestamp when task was created';
COMMENT ON COLUMN tasks.updated_at IS 'Auto-updated via trigger on every UPDATE';
COMMENT ON COLUMN tasks.deleted_at IS 'Soft delete timestamp - NULL means active';

-- Indexes
CREATE INDEX idx_tasks_organization ON tasks(organization_id) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_tasks_organization IS 'Find all tasks for an organization';

CREATE INDEX idx_tasks_assigned ON tasks(assigned_to) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_tasks_assigned IS 'Find tasks assigned to a user';

CREATE INDEX idx_tasks_status ON tasks(status) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_tasks_status IS 'Filter tasks by status';

CREATE INDEX idx_tasks_due_date ON tasks(due_date) WHERE deleted_at IS NULL AND is_completed = false;
COMMENT ON INDEX idx_tasks_due_date IS 'Find upcoming/overdue tasks (only active tasks)';

CREATE INDEX idx_tasks_parent ON tasks(parent_id, parent_type) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_tasks_parent IS 'Find all tasks for a parent entity (polymorphic lookup)';

CREATE INDEX idx_tasks_parent_task ON tasks(parent_task_id) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_tasks_parent_task IS 'Find subtasks of a parent task';

CREATE INDEX idx_tasks_assigned_priority ON tasks(assigned_to, priority, status, due_date) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_tasks_assigned_priority IS 'Composite index for user task dashboard (my tasks by priority and due date)';

CREATE INDEX idx_tasks_team ON tasks(team_id) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_tasks_team IS 'Find tasks assigned to a team';

-- GIN indexes
CREATE INDEX idx_tasks_tags ON tasks USING GIN(tags);

CREATE INDEX idx_tasks_watchers ON tasks USING GIN(watchers);
COMMENT ON INDEX idx_tasks_watchers IS 'Find tasks watched by a user (for notification routing)';
COMMENT ON INDEX idx_tasks_tags IS 'Full-text search on tags array';

CREATE INDEX idx_tasks_search ON tasks USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, ''))) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_tasks_search IS 'Full-text search across task title and description';

-- Trigger
CREATE TRIGGER set_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
COMMENT ON TRIGGER set_tasks_updated_at ON tasks IS 'Auto-update updated_at timestamp on every UPDATE';


-- ----------------------------------------------------------------------------
-- TABLE: notes
-- Purpose: Rich-text notes attached to any entity
-- Usage: Call notes, meeting notes, internal documentation, activity logging
-- ----------------------------------------------------------------------------
CREATE TABLE notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  
  -- Polymorphic Relationships
  parent_id UUID,                                                             -- FK to parent entity (contact, company, opportunity, profile, task)
  parent_type TEXT CHECK (parent_type IN ('contact', 'company', 'opportunity', 'profile', 'task')),  -- Entity type
  
  -- Note Details
  title TEXT,                                                                 -- Note title or subject (optional)
  content TEXT NOT NULL,                                                      -- Note content (rich text/markdown)
  note_type TEXT DEFAULT 'general' CHECK (note_type IN ('general', 'call', 'meeting', 'email', 'activity')),  -- Note type
  
  -- Privacy & Visibility
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,                 -- User who created the note
  last_edited_by UUID REFERENCES profiles(id) ON DELETE SET NULL,             -- User who last edited
  is_pinned BOOLEAN DEFAULT false,                                            -- Pinned to top of list
  is_private BOOLEAN DEFAULT false,                                           -- Private note (creator-only)
  shared_with UUID[],                                                         -- Array of profile UUIDs with access (for selective sharing)
  
  -- Metadata
  tags TEXT[],                                                                -- Tags for categorization
  mentioned_users UUID[],                                                     -- Array of @mentioned profile UUIDs
  attachments JSONB DEFAULT '[]',                                             -- File attachments array
  
  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Field Comments
COMMENT ON COLUMN notes.id IS 'Primary key - unique identifier for the note';
COMMENT ON COLUMN notes.organization_id IS 'Multi-tenant FK - which organization owns this note';
COMMENT ON COLUMN notes.parent_id IS 'Polymorphic FK - ID of parent entity (contact, company, opportunity, profile, task)';
COMMENT ON COLUMN notes.parent_type IS 'Polymorphic type: contact | company | opportunity | profile | task';
COMMENT ON COLUMN notes.title IS 'Note title or subject (optional for quick notes)';
COMMENT ON COLUMN notes.content IS 'Note content (supports rich text/markdown formatting)';
COMMENT ON COLUMN notes.note_type IS 'Note type: general (default) | call (call notes) | meeting (meeting minutes) | email (email log) | activity (activity log)';
COMMENT ON COLUMN notes.created_by IS 'FK to profiles - user who created this note';
COMMENT ON COLUMN notes.last_edited_by IS 'FK to profiles - user who last edited this note (for collaboration tracking)';
COMMENT ON COLUMN notes.is_pinned IS 'Pinned flag - shows at top of note list for quick access';
COMMENT ON COLUMN notes.is_private IS 'Private note visible only to creator (bypasses RLS, hidden from team)';
COMMENT ON COLUMN notes.shared_with IS 'Array of profile UUIDs with selective access (for controlled sharing beyond creator)';
COMMENT ON COLUMN notes.tags IS 'Array of tags for categorization (e.g., ["call-notes", "meeting", "important"])';
COMMENT ON COLUMN notes.mentioned_users IS 'Array of profile UUIDs mentioned with @username (for notifications)';
COMMENT ON COLUMN notes.attachments IS 'JSONB array of file attachments: [{"name": "file.pdf", "url": "...", "size": 12345, "type": "application/pdf"}]';
COMMENT ON COLUMN notes.created_at IS 'Timestamp when note was created';
COMMENT ON COLUMN notes.updated_at IS 'Auto-updated via trigger on every UPDATE';
COMMENT ON COLUMN notes.deleted_at IS 'Soft delete timestamp - NULL means active';

-- Indexes
CREATE INDEX idx_notes_organization ON notes(organization_id) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_notes_organization IS 'Find all notes for an organization';

CREATE INDEX idx_notes_parent ON notes(parent_id, parent_type) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_notes_parent IS 'Find all notes for a parent entity (polymorphic lookup)';

CREATE INDEX idx_notes_created_by ON notes(created_by) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_notes_created_by IS 'Find notes created by a user';

CREATE INDEX idx_notes_pinned ON notes(is_pinned) WHERE is_pinned = true AND deleted_at IS NULL;
COMMENT ON INDEX idx_notes_pinned IS 'Find pinned notes (fast query with partial index)';

-- GIN indexes
CREATE INDEX idx_notes_tags ON notes USING GIN(tags);
COMMENT ON INDEX idx_notes_tags IS 'Full-text search on tags array';

CREATE INDEX idx_notes_search ON notes USING GIN(to_tsvector('english', COALESCE(title, '') || ' ' || content)) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_notes_search IS 'Full-text search across note title and content';

-- Trigger
CREATE TRIGGER set_notes_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
COMMENT ON TRIGGER set_notes_updated_at ON notes IS 'Auto-update updated_at timestamp on every UPDATE';


-- ----------------------------------------------------------------------------
-- TABLE: comments
-- Purpose: Collaboration on tasks and notes with threading support
-- Usage: Team discussions, @mentions, emoji reactions, attachments
-- ----------------------------------------------------------------------------
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  
  -- Polymorphic Relationships
  parent_id UUID NOT NULL,                                                    -- FK to parent entity (task or note)
  parent_type TEXT NOT NULL CHECK (parent_type IN ('task', 'note')),          -- Entity type
  
  -- Comment Details
  content TEXT NOT NULL,                                                      -- Comment text (supports markdown)
  
  -- Authorship & Editing
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,                  -- User who wrote the comment
  last_edited_by UUID REFERENCES profiles(id) ON DELETE SET NULL,             -- User who last edited (for edit attribution)
  
  -- Collaboration Features
  mentions UUID[],                                                            -- Array of @mentioned profile UUIDs
  reactions JSONB DEFAULT '{}',                                               -- Emoji reactions: {"👍": ["user-uuid-1"], "❤️": ["user-uuid-2"]}
  is_pinned BOOLEAN DEFAULT false,                                            -- Pinned comment (shown at top of thread)
  is_resolved BOOLEAN DEFAULT false,                                          -- Resolved status (for threaded discussions)
  
  -- Metadata
  attachments JSONB DEFAULT '[]',                                             -- File attachments array
  
  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Field Comments
COMMENT ON COLUMN comments.id IS 'Primary key - unique identifier for the comment';
COMMENT ON COLUMN comments.organization_id IS 'Multi-tenant FK - which organization owns this comment';
COMMENT ON COLUMN comments.parent_id IS 'Polymorphic FK - ID of parent entity (task or note being commented on)';
COMMENT ON COLUMN comments.parent_type IS 'Polymorphic type: task | note';
COMMENT ON COLUMN comments.content IS 'Comment text content (supports markdown formatting for rich text)';
COMMENT ON COLUMN comments.author_id IS 'FK to profiles - user who wrote this comment';
COMMENT ON COLUMN comments.last_edited_by IS 'FK to profiles - user who last edited this comment (for edit history tracking)';
COMMENT ON COLUMN comments.mentions IS 'Array of profile UUIDs mentioned with @username (triggers notifications)';
COMMENT ON COLUMN comments.reactions IS 'JSONB emoji reactions object: {"👍": ["user-uuid-1", "user-uuid-2"], "❤️": ["user-uuid-3"], "🎉": ["user-uuid-4"]} - allows multiple users per emoji';
COMMENT ON COLUMN comments.is_pinned IS 'Pinned flag - important comments shown at top of thread (for announcements, solutions)';
COMMENT ON COLUMN comments.is_resolved IS 'Resolved status - marks comment thread as resolved/addressed (for issue tracking discussions)';
COMMENT ON COLUMN comments.attachments IS 'JSONB array of file attachments: [{"name": "screenshot.png", "url": "...", "size": 12345, "type": "image/png"}]';
COMMENT ON COLUMN comments.created_at IS 'Timestamp when comment was created';
COMMENT ON COLUMN comments.updated_at IS 'Auto-updated via trigger on every UPDATE';
COMMENT ON COLUMN comments.deleted_at IS 'Soft delete timestamp - NULL means active';

-- Indexes
CREATE INDEX idx_comments_organization ON comments(organization_id) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_comments_organization IS 'Find all comments for an organization';

CREATE INDEX idx_comments_parent ON comments(parent_id, parent_type) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_comments_parent IS 'Find all comments for a parent entity (task or note discussion thread)';

CREATE INDEX idx_comments_author ON comments(author_id) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_comments_author IS 'Find comments by author';

CREATE INDEX idx_comments_created ON comments(created_at DESC) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_comments_created IS 'Sort comments chronologically (newest first for reverse-chrono feeds)';

CREATE INDEX idx_comments_pinned ON comments(is_pinned) WHERE is_pinned = true AND deleted_at IS NULL;
COMMENT ON INDEX idx_comments_pinned IS 'Find pinned comments (fast query with partial index for important comments)';

-- GIN indexes
CREATE INDEX idx_comments_mentions ON comments USING GIN(mentions) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_comments_mentions IS 'Find comments mentioning a user (for @mention notification routing)';

CREATE INDEX idx_comments_reactions ON comments USING GIN(reactions) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_comments_reactions IS 'Query reactions JSONB for analytics (most reacted comments)';

CREATE INDEX idx_comments_attachments ON comments USING GIN(attachments) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_comments_attachments IS 'Find comments with attachments (for file browsing)';

CREATE INDEX idx_comments_search ON comments USING GIN(to_tsvector('english', content)) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_comments_search IS 'Full-text search across comment content';

-- Trigger
CREATE TRIGGER set_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
COMMENT ON TRIGGER set_comments_updated_at ON comments IS 'Auto-update updated_at timestamp on every UPDATE';


-- ----------------------------------------------------------------------------
-- TABLE: notifications
-- Purpose: In-app notifications for user actions and system events
-- Usage: Task assignments, mentions, pipeline changes, reminders, system alerts
-- ----------------------------------------------------------------------------
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  
  -- Recipient
  recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,      -- User who receives the notification
  
  -- Notification Details
  type TEXT NOT NULL CHECK (type IN (
    'task_assigned', 'task_due', 'task_overdue', 'task_completed',
    'mention', 'comment',
    'pipeline_change', 'opportunity_won', 'opportunity_lost',
    'quote_sent', 'quote_accepted', 'quote_rejected',
    'job_scheduled', 'job_completed',
    'contact_assigned', 'company_assigned',
    'system_alert', 'reminder'
  )),
  title TEXT NOT NULL,                                                        -- Notification title
  message TEXT,                                                               -- Notification message/body
  
  -- Polymorphic Link (optional - links to related entity)
  entity_id UUID,                                                             -- FK to related entity
  entity_type TEXT CHECK (entity_type IN ('task', 'note', 'comment', 'opportunity', 'quote', 'job', 'contact', 'company')),
  
  -- Action & Navigation
  action_url TEXT,                                                            -- Deep link URL for navigation
  action_text TEXT,                                                           -- Action button text (e.g., "View Task", "Reply")
  
  -- Metadata
  metadata JSONB DEFAULT '{}',                                                -- Additional context data
  
  -- Priority & Classification
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),  -- Notification priority
  category TEXT,                                                              -- Category grouping (e.g., 'tasks', 'sales', 'system')
  
  -- Status
  is_read BOOLEAN DEFAULT false,                                              -- Read/unread status
  read_at TIMESTAMPTZ,                                                        -- When notification was read
  is_dismissed BOOLEAN DEFAULT false,                                         -- Dismissed flag (hidden from inbox)
  dismissed_at TIMESTAMPTZ,                                                   -- When notification was dismissed
  
  -- Expiry
  expires_at TIMESTAMPTZ,                                                     -- Notification expiry (auto-archive after this time)
  
  -- Actor (who triggered this notification)
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,                   -- User who caused the notification
  
  -- Delivery Channels
  channels TEXT[] DEFAULT ARRAY['in_app'],                                    -- Delivery channels: in_app, email, push, sms
  
  -- Push Notification Status
  push_sent BOOLEAN DEFAULT false,                                            -- Whether push notification was sent
  push_sent_at TIMESTAMPTZ,                                                   -- When push was sent
  email_sent BOOLEAN DEFAULT false,                                           -- Whether email notification was sent
  email_sent_at TIMESTAMPTZ,                                                  -- When email was sent
  
  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Field Comments
COMMENT ON COLUMN notifications.id IS 'Primary key - unique identifier for the notification';
COMMENT ON COLUMN notifications.organization_id IS 'Multi-tenant FK - which organization this notification belongs to';
COMMENT ON COLUMN notifications.recipient_id IS 'FK to profiles - user who receives this notification';
COMMENT ON COLUMN notifications.type IS 'Notification type: task_assigned | task_due | task_overdue | mention | comment | pipeline_change | quote_accepted | job_scheduled | etc.';
COMMENT ON COLUMN notifications.title IS 'Notification title (e.g., "Task Assigned: Follow up with John Doe")';
COMMENT ON COLUMN notifications.message IS 'Detailed notification message or description';
COMMENT ON COLUMN notifications.entity_id IS 'Polymorphic FK - ID of related entity (task, opportunity, quote, etc.)';
COMMENT ON COLUMN notifications.entity_type IS 'Entity type: task | note | comment | opportunity | quote | job | contact | company';
COMMENT ON COLUMN notifications.action_url IS 'Deep link URL for navigation (e.g., "/tasks/123", "/opportunities/456")';
COMMENT ON COLUMN notifications.action_text IS 'Action button text (e.g., "View Task", "Reply to Comment", "Review Quote")';
COMMENT ON COLUMN notifications.metadata IS 'Additional context stored as JSONB: {"task_title": "...", "due_date": "...", "priority": "High"}';
COMMENT ON COLUMN notifications.priority IS 'Notification priority: low | normal | high | urgent (determines visual treatment and sorting)';
COMMENT ON COLUMN notifications.category IS 'Category grouping for filtering (e.g., "tasks", "sales", "opportunities", "system")';
COMMENT ON COLUMN notifications.is_read IS 'Read status - false for unread, true for read';
COMMENT ON COLUMN notifications.read_at IS 'Timestamp when notification was marked as read';
COMMENT ON COLUMN notifications.is_dismissed IS 'Dismissed flag - true if user dismissed notification (hidden from inbox but not deleted)';
COMMENT ON COLUMN notifications.dismissed_at IS 'Timestamp when notification was dismissed by user';
COMMENT ON COLUMN notifications.expires_at IS 'Notification expiry timestamp - auto-archive or delete after this time (e.g., for time-sensitive promotions)';
COMMENT ON COLUMN notifications.actor_id IS 'FK to profiles - user who triggered this notification (e.g., who assigned the task, who mentioned you)';
COMMENT ON COLUMN notifications.channels IS 'Delivery channels array: ["in_app", "email", "push", "sms"] - determines how notification is delivered';
COMMENT ON COLUMN notifications.push_sent IS 'Whether push notification was sent to mobile device';
COMMENT ON COLUMN notifications.push_sent_at IS 'Timestamp when push notification was sent';
COMMENT ON COLUMN notifications.email_sent IS 'Whether email notification was sent';
COMMENT ON COLUMN notifications.email_sent_at IS 'Timestamp when email notification was sent';
COMMENT ON COLUMN notifications.created_at IS 'Timestamp when notification was created';
COMMENT ON COLUMN notifications.deleted_at IS 'Soft delete timestamp - NULL means active';

-- Indexes
CREATE INDEX idx_notifications_organization ON notifications(organization_id) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_notifications_organization IS 'Find all notifications for an organization';

CREATE INDEX idx_notifications_recipient ON notifications(recipient_id) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_notifications_recipient IS 'Find all notifications for a user';

CREATE INDEX idx_notifications_recipient_unread ON notifications(recipient_id, is_read, created_at DESC) WHERE deleted_at IS NULL AND is_read = false;
COMMENT ON INDEX idx_notifications_recipient_unread IS 'Find unread notifications for a user (optimized for notification badge counts and inbox)';

CREATE INDEX idx_notifications_type ON notifications(type) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_notifications_type IS 'Filter notifications by type';

CREATE INDEX idx_notifications_entity ON notifications(entity_id, entity_type) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_notifications_entity IS 'Find notifications related to a specific entity (polymorphic lookup)';

CREATE INDEX idx_notifications_actor ON notifications(actor_id) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_notifications_actor IS 'Find notifications triggered by a specific user';

CREATE INDEX idx_notifications_created ON notifications(created_at DESC) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_notifications_created IS 'Sort notifications chronologically (newest first)';

CREATE INDEX idx_notifications_priority ON notifications(recipient_id, priority, created_at DESC) WHERE deleted_at IS NULL AND is_read = false AND is_dismissed = false;
COMMENT ON INDEX idx_notifications_priority IS 'Find active unread notifications by priority (for urgent alerts)';

CREATE INDEX idx_notifications_category ON notifications(category) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_notifications_category IS 'Filter notifications by category';

CREATE INDEX idx_notifications_expires ON notifications(expires_at) WHERE deleted_at IS NULL AND expires_at IS NOT NULL;
COMMENT ON INDEX idx_notifications_expires IS 'Find expiring notifications for cleanup jobs';

-- GIN index for JSONB
CREATE INDEX idx_notifications_metadata ON notifications USING GIN(metadata) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_notifications_metadata IS 'Query notification metadata with JSONB operators';

CREATE INDEX idx_notifications_channels ON notifications USING GIN(channels) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_notifications_channels IS 'Filter notifications by delivery channel';


-- ============================================================================
-- STEP 5: SALES & FINANCIAL TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- TABLE: quotes
-- Purpose: Sales proposals with line items and approval workflow
-- Usage: Generate quotes for opportunities, track acceptance/rejection, revenue forecasting
-- ----------------------------------------------------------------------------
CREATE TABLE quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  
  -- Relationships
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE SET NULL,        -- Which opportunity this quote is for
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,                 -- Primary contact receiving the quote
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,                -- Company receiving the quote
  
  -- Quote Details
  quote_number TEXT NOT NULL,                                                 -- Human-readable quote number (e.g., Q-2026-001, QUOTE-001234)
  title TEXT NOT NULL,                                                        -- Quote title or subject
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'expired', 'converted')),
  
  -- Financial
  total_amount NUMERIC(12, 2) DEFAULT 0,                                      -- Total quote amount (sum of line items)
  tax_amount NUMERIC(12, 2) DEFAULT 0,                                        -- Tax amount (GST, VAT, sales tax)
  discount_amount NUMERIC(12, 2) DEFAULT 0,                                   -- Total discount applied
  
  -- Validity & Terms
  valid_until TIMESTAMPTZ,                                                    -- Quote expiration date (auto-expire after this)
  line_items JSONB DEFAULT '[]',                                              -- Line items array: [{"description": "HVAC Installation", "quantity": 1, "unit_price": 5000, "discount": 0, "tax": 500, "total": 5500}]
  
  -- Documentation
  notes TEXT,                                                                 -- Internal notes (not visible to customer)
  terms TEXT,                                                                 -- Terms and conditions displayed to customer
  
  -- Workflow & Tracking
  sent_at TIMESTAMPTZ,                                                        -- When quote was sent to customer
  sent_to_email TEXT,                                                         -- Email address where quote was sent
  viewed_at TIMESTAMPTZ,                                                      -- When customer first viewed the quote (for online quotes)
  accepted_at TIMESTAMPTZ,                                                    -- When quote was accepted by customer
  rejected_at TIMESTAMPTZ,                                                    -- When quote was rejected
  rejection_reason TEXT,                                                      -- Why customer rejected the quote
  
  -- Approval Workflow
  approved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,                -- Manager/supervisor who approved this quote
  approved_at TIMESTAMPTZ,                                                    -- When quote was internally approved
  
  -- Audit
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,                 -- User who created this quote
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Field Comments
COMMENT ON COLUMN quotes.id IS 'Primary key - unique identifier for the quote';
COMMENT ON COLUMN quotes.organization_id IS 'Multi-tenant FK - which organization owns this quote';
COMMENT ON COLUMN quotes.opportunity_id IS 'FK to opportunities - which opportunity this quote is for (links quote to sales pipeline)';
COMMENT ON COLUMN quotes.contact_id IS 'FK to contacts - primary contact receiving the quote (decision maker)';
COMMENT ON COLUMN quotes.company_id IS 'FK to companies - company receiving the quote (B2B quotes)';
COMMENT ON COLUMN quotes.quote_number IS 'Human-readable quote number - globally unique (e.g., Q-2026-001, QUOTE-001234) for customer reference';
COMMENT ON COLUMN quotes.title IS 'Quote title or subject (e.g., "HVAC Installation - Main Street Office", "Annual Maintenance Contract 2026")';
COMMENT ON COLUMN quotes.status IS 'Quote lifecycle: draft (being created) | sent (delivered to customer) | accepted (customer approved) | rejected (customer declined) | expired (past valid_until date) | converted (converted to job/invoice)';
COMMENT ON COLUMN quotes.total_amount IS 'Total quote amount including tax and discounts (final amount customer pays)';
COMMENT ON COLUMN quotes.tax_amount IS 'Tax amount (GST, VAT, sales tax) - calculated from line items';
COMMENT ON COLUMN quotes.discount_amount IS 'Total discount applied to quote (for win rate analysis and margin tracking)';
COMMENT ON COLUMN quotes.valid_until IS 'Quote expiration date - auto-expire quotes after this date (typical: 30 days from creation)';
COMMENT ON COLUMN quotes.line_items IS 'JSONB line items array: [{"description": "HVAC Installation", "quantity": 1, "unit_price": 5000, "discount": 0, "tax_rate": 0.10, "tax": 500, "total": 5500}]';
COMMENT ON COLUMN quotes.notes IS 'Internal notes about the quote (not visible to customer - for sales team coordination)';
COMMENT ON COLUMN quotes.terms IS 'Terms and conditions displayed to customer (payment terms, warranties, scope of work)';
COMMENT ON COLUMN quotes.sent_at IS 'Timestamp when quote was sent to customer (for sales velocity metrics)';
COMMENT ON COLUMN quotes.sent_to_email IS 'Email address where quote was sent (for delivery tracking and customer communication history)';
COMMENT ON COLUMN quotes.viewed_at IS 'When customer first viewed the quote online (for engagement tracking - triggers follow-up workflow)';
COMMENT ON COLUMN quotes.accepted_at IS 'When customer accepted the quote (triggers job creation or conversion workflow)';
COMMENT ON COLUMN quotes.rejected_at IS 'When customer rejected the quote (for loss analysis)';
COMMENT ON COLUMN quotes.rejection_reason IS 'Why customer rejected: too_expensive | competitor | timing | scope | other (for win/loss analysis)';
COMMENT ON COLUMN quotes.approved_by IS 'FK to profiles - manager/supervisor who internally approved this quote (for approval workflow and compliance)';
COMMENT ON COLUMN quotes.approved_at IS 'When quote was internally approved (required before sending to customer in some organizations)';
COMMENT ON COLUMN quotes.created_by IS 'FK to profiles - sales rep who created this quote (for performance tracking)';
COMMENT ON COLUMN quotes.created_at IS 'Timestamp when quote was created';
COMMENT ON COLUMN quotes.updated_at IS 'Auto-updated via trigger on every UPDATE';
COMMENT ON COLUMN quotes.deleted_at IS 'Soft delete timestamp - NULL means active';

-- Indexes
CREATE INDEX idx_quotes_organization ON quotes(organization_id) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_quotes_organization IS 'Find all quotes for an organization';

CREATE INDEX idx_quotes_opportunity ON quotes(opportunity_id) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_quotes_opportunity IS 'Find quotes for an opportunity (quote history for pipeline stage)';

CREATE INDEX idx_quotes_contact ON quotes(contact_id) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_quotes_contact IS 'Find quotes for a contact (customer quote history)';

CREATE INDEX idx_quotes_company ON quotes(company_id) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_quotes_company IS 'Find quotes for a company (B2B quote history)';

CREATE INDEX idx_quotes_status ON quotes(status) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_quotes_status IS 'Filter quotes by status (draft, sent, accepted, rejected, expired, converted)';

CREATE INDEX idx_quotes_number ON quotes(quote_number) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_quotes_number IS 'Lookup quote by quote number (for customer inquiries and search)';

CREATE INDEX idx_quotes_created_by ON quotes(created_by) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_quotes_created_by IS 'Find quotes created by a sales rep (for performance dashboards)';

CREATE INDEX idx_quotes_approved_by ON quotes(approved_by) WHERE deleted_at IS NULL AND approved_by IS NOT NULL;
COMMENT ON INDEX idx_quotes_approved_by IS 'Find quotes approved by a manager (approval workflow tracking)';

CREATE INDEX idx_quotes_valid_until ON quotes(valid_until) WHERE deleted_at IS NULL AND status = 'sent';
COMMENT ON INDEX idx_quotes_valid_until IS 'Find expiring quotes for follow-up reminders (only active sent quotes)';

CREATE INDEX idx_quotes_sent_at ON quotes(sent_at DESC) WHERE deleted_at IS NULL AND sent_at IS NOT NULL;
COMMENT ON INDEX idx_quotes_sent_at IS 'Find recently sent quotes (for sales velocity metrics)';

CREATE INDEX idx_quotes_acceptance_rate ON quotes(status, accepted_at, created_at) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_quotes_acceptance_rate IS 'Calculate quote acceptance rates and sales cycle duration (won vs total)';

-- GIN indexes
CREATE INDEX idx_quotes_line_items ON quotes USING GIN(line_items) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_quotes_line_items IS 'Query line items JSONB for product/service analytics';

CREATE INDEX idx_quotes_search ON quotes USING GIN(to_tsvector('english', title || ' ' || COALESCE(notes, ''))) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_quotes_search IS 'Full-text search across quote title and notes';

-- Trigger
CREATE TRIGGER set_quotes_updated_at
  BEFORE UPDATE ON quotes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
COMMENT ON TRIGGER set_quotes_updated_at ON quotes IS 'Auto-update updated_at timestamp on every UPDATE';


-- ----------------------------------------------------------------------------
-- TABLE: jobs
-- Purpose: Field service job execution, dispatching, and revenue tracking
-- Usage: Schedule technicians, track time on-site, materials used, customer satisfaction
-- ----------------------------------------------------------------------------
CREATE TABLE jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  
  -- Relationships
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE SET NULL,        -- Which opportunity generated this job
  quote_id UUID REFERENCES quotes(id) ON DELETE SET NULL,                     -- Which accepted quote led to this job
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,                 -- Customer contact for this job
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,                -- Customer company (B2B jobs)
  
  -- Job Details
  job_number TEXT NOT NULL,                                                   -- Human-readable job number (e.g., JOB-2026-001, WO-001234)
  title TEXT,                                                                 -- Job title or summary (e.g., "HVAC Installation", "Annual Maintenance")
  description TEXT,                                                           -- Detailed job description or work order details
  job_type TEXT,                                                              -- Job type: installation | maintenance | repair | inspection | emergency
  priority TEXT DEFAULT 'Normal' CHECK (priority IN ('Low', 'Normal', 'High', 'Urgent')),
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'dispatched', 'on_field', 'completed', 'cancelled')),
  
  -- Scheduling
  scheduled_start TIMESTAMPTZ,                                                -- Scheduled start date/time
  scheduled_end TIMESTAMPTZ,                                                  -- Scheduled end date/time
  actual_start TIMESTAMPTZ,                                                   -- Actual start (when technician arrives on-site)
  actual_end TIMESTAMPTZ,                                                     -- Actual completion (when work finishes)
  
  -- Assignment
  technician_id UUID REFERENCES profiles(id) ON DELETE SET NULL,              -- Primary assigned technician
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,                       -- Team assigned (for multi-tech jobs)
  additional_technicians UUID[],                                              -- Array of additional technician UUIDs (helpers)
  
  -- Location
  address_id UUID REFERENCES addresses(id) ON DELETE SET NULL,                -- Job site location
  
  -- Documentation
  service_notes TEXT,                                                         -- Pre-job notes or special instructions
  completed_notes TEXT,                                                       -- Post-job completion notes (work performed, issues found)
  equipment_used TEXT[],                                                      -- Equipment/tools used (e.g., ["Multimeter", "Vacuum Pump"])
  photos JSONB DEFAULT '[]',                                                  -- Job photos: [{"url": "...", "caption": "Before installation", "timestamp": "..."}]
  
  -- Financial
  labor_hours NUMERIC(6, 2),                                                  -- Total labor hours spent
  labor_cost NUMERIC(12, 2) DEFAULT 0,                                        -- Labor cost (labor_hours * hourly_rate)
  material_cost NUMERIC(12, 2) DEFAULT 0,                                     -- Total material cost
  materials_used JSONB DEFAULT '[]',                                          -- Itemized materials: [{"name": "Copper Pipe", "quantity": 10, "unit": "meters", "cost": 150}]
  total_cost NUMERIC(12, 2) DEFAULT 0,                                        -- Total job cost (labor + materials + overhead)
  total_revenue NUMERIC(12, 2) DEFAULT 0,                                     -- Total revenue billed to customer
  
  -- Completion & Quality
  customer_signature TEXT,                                                    -- Customer signature data (base64 or URL)
  customer_satisfaction TEXT CHECK (customer_satisfaction IN ('very_satisfied', 'satisfied', 'neutral', 'dissatisfied', 'very_dissatisfied')),
  customer_feedback TEXT,                                                     -- Customer feedback comments
  
  -- Invoicing
  is_invoiced BOOLEAN DEFAULT false,                                          -- Invoice generated flag (prevents duplicate invoicing)
  invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,                 -- Link to generated invoice
  
  -- Audit
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,                 -- User who created this job
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Field Comments
COMMENT ON COLUMN jobs.id IS 'Primary key - unique identifier for the job';
COMMENT ON COLUMN jobs.organization_id IS 'Multi-tenant FK - which organization owns this job';
COMMENT ON COLUMN jobs.opportunity_id IS 'FK to opportunities - which opportunity generated this job (sales pipeline link)';
COMMENT ON COLUMN jobs.quote_id IS 'FK to quotes - which accepted quote led to this job (quote conversion tracking)';
COMMENT ON COLUMN jobs.contact_id IS 'FK to contacts - customer contact for this job (who to call on arrival)';
COMMENT ON COLUMN jobs.company_id IS 'FK to companies - customer company for B2B field service jobs';
COMMENT ON COLUMN jobs.job_number IS 'Human-readable job number - globally unique (e.g., JOB-2026-001, WO-001234) for work order tracking';
COMMENT ON COLUMN jobs.title IS 'Job title or summary (e.g., "HVAC Installation - 123 Main St", "Emergency Repair - Water Leak")';
COMMENT ON COLUMN jobs.description IS 'Detailed job description, work order details, or scope of work';
COMMENT ON COLUMN jobs.job_type IS 'Job type classification: installation | maintenance | repair | inspection | emergency (for job categorization and pricing)';
COMMENT ON COLUMN jobs.priority IS 'Job priority: Low | Normal | High | Urgent (determines scheduling urgency and SLA)';
COMMENT ON COLUMN jobs.status IS 'Job lifecycle: scheduled (created, waiting) -> dispatched (technician notified) -> on_field (technician on-site) -> completed (finished) | cancelled';
COMMENT ON COLUMN jobs.scheduled_start IS 'Scheduled start date/time (appointment window start)';
COMMENT ON COLUMN jobs.scheduled_end IS 'Scheduled end date/time (appointment window end)';
COMMENT ON COLUMN jobs.actual_start IS 'Actual start timestamp - set when technician arrives on-site (GPS check-in or manual)';
COMMENT ON COLUMN jobs.actual_end IS 'Actual completion timestamp - set when technician completes job (for time tracking and billing)';
COMMENT ON COLUMN jobs.technician_id IS 'FK to profiles - primary technician assigned to this job';
COMMENT ON COLUMN jobs.team_id IS 'FK to teams - team assigned for collaborative jobs requiring multiple technicians';
COMMENT ON COLUMN jobs.additional_technicians IS 'Array of profile UUIDs for helper technicians (multi-tech jobs like installations)';
COMMENT ON COLUMN jobs.address_id IS 'FK to addresses - job site location (where technician goes)';
COMMENT ON COLUMN jobs.service_notes IS 'Pre-job notes, special instructions, access codes, customer preferences (e.g., "Dog in backyard - call before entering")';
COMMENT ON COLUMN jobs.completed_notes IS 'Post-job completion notes: work performed, parts replaced, issues found, recommendations (e.g., "Replaced filter, recommend duct cleaning")';
COMMENT ON COLUMN jobs.equipment_used IS 'Array of equipment/tools used for this job (e.g., ["Multimeter", "Vacuum Pump", "Leak Detector"])';
COMMENT ON COLUMN jobs.photos IS 'JSONB array of job photos: [{"url": "https://...", "caption": "Before installation", "timestamp": "2026-02-04T10:30:00Z", "type": "before|after|issue"}]';
COMMENT ON COLUMN jobs.labor_hours IS 'Total labor hours spent on job (for billing and productivity tracking)';
COMMENT ON COLUMN jobs.labor_cost IS 'Labor cost calculated from labor_hours * technician hourly_rate';
COMMENT ON COLUMN jobs.material_cost IS 'Total material/parts cost used on this job';
COMMENT ON COLUMN jobs.materials_used IS 'Itemized materials JSONB: [{"name": "Copper Pipe", "quantity": 10, "unit": "meters", "unit_cost": 15, "cost": 150, "sku": "CP-15MM"}]';
COMMENT ON COLUMN jobs.total_cost IS 'Total job cost including labor, materials, and overhead (for profitability analysis)';
COMMENT ON COLUMN jobs.total_revenue IS 'Total revenue billed to customer for this job (may differ from total_cost due to markup)';
COMMENT ON COLUMN jobs.customer_signature IS 'Customer signature data - base64 encoded image or storage URL (proof of work completion)';
COMMENT ON COLUMN jobs.customer_satisfaction IS 'Post-job satisfaction rating: very_satisfied | satisfied | neutral | dissatisfied | very_dissatisfied';
COMMENT ON COLUMN jobs.customer_feedback IS 'Customer feedback comments collected after job completion (for quality improvement)';
COMMENT ON COLUMN jobs.is_invoiced IS 'Invoice generated flag - prevents duplicate invoicing from completed jobs';
COMMENT ON COLUMN jobs.invoice_id IS 'FK to invoices - link to generated invoice (for billing reconciliation)';
COMMENT ON COLUMN jobs.created_by IS 'FK to profiles - user who created/scheduled this job (dispatcher or sales rep)';
COMMENT ON COLUMN jobs.created_at IS 'Timestamp when job was created';
COMMENT ON COLUMN jobs.updated_at IS 'Auto-updated via trigger on every UPDATE';
COMMENT ON COLUMN jobs.deleted_at IS 'Soft delete timestamp - NULL means active';

-- Indexes
CREATE INDEX idx_jobs_organization ON jobs(organization_id) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_jobs_organization IS 'Find all jobs for an organization';

CREATE INDEX idx_jobs_contact ON jobs(contact_id) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_jobs_contact IS 'Find jobs for a contact (customer job history)';

CREATE INDEX idx_jobs_company ON jobs(company_id) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_jobs_company IS 'Find jobs for a company (B2B job history)';

CREATE INDEX idx_jobs_technician ON jobs(technician_id) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_jobs_technician IS 'Find jobs assigned to a technician (technician workload)';

CREATE INDEX idx_jobs_team ON jobs(team_id) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_jobs_team IS 'Find jobs assigned to a team';

CREATE INDEX idx_jobs_status ON jobs(status) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_jobs_status IS 'Filter jobs by status (scheduled, dispatched, on_field, completed, cancelled)';

CREATE INDEX idx_jobs_priority ON jobs(priority) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_jobs_priority IS 'Filter jobs by priority (for urgent/emergency job filtering)';

CREATE INDEX idx_jobs_scheduled ON jobs(scheduled_start) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_jobs_scheduled IS 'Find jobs by scheduled date (calendar view, dispatch board)';

CREATE INDEX idx_jobs_number ON jobs(job_number) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_jobs_number IS 'Lookup job by job/work order number';

CREATE INDEX idx_jobs_opportunity ON jobs(opportunity_id) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_jobs_opportunity IS 'Find jobs generated from an opportunity (conversion tracking)';

CREATE INDEX idx_jobs_quote ON jobs(quote_id) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_jobs_quote IS 'Find jobs based on a quote (quote-to-job conversion)';

CREATE INDEX idx_jobs_invoice ON jobs(invoice_id) WHERE deleted_at IS NULL AND invoice_id IS NOT NULL;
COMMENT ON INDEX idx_jobs_invoice IS 'Find jobs with generated invoices';

CREATE INDEX idx_jobs_tech_schedule ON jobs(technician_id, scheduled_start, status) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_jobs_tech_schedule IS 'Composite index for technician schedule dashboard (my jobs by date and status)';

CREATE INDEX idx_jobs_uninvoiced ON jobs(is_invoiced, status) WHERE deleted_at IS NULL AND is_invoiced = false AND status = 'completed';
COMMENT ON INDEX idx_jobs_uninvoiced IS 'Find completed jobs not yet invoiced (for billing queue)';

CREATE INDEX idx_jobs_satisfaction ON jobs(customer_satisfaction) WHERE deleted_at IS NULL AND customer_satisfaction IS NOT NULL;
COMMENT ON INDEX idx_jobs_satisfaction IS 'Analyze customer satisfaction ratings';

-- GIN indexes
CREATE INDEX idx_jobs_additional_techs ON jobs USING GIN(additional_technicians) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_jobs_additional_techs IS 'Find jobs where a user is an additional technician';

CREATE INDEX idx_jobs_equipment ON jobs USING GIN(equipment_used) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_jobs_equipment IS 'Find jobs using specific equipment/tools';

CREATE INDEX idx_jobs_materials ON jobs USING GIN(materials_used) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_jobs_materials IS 'Query materials used for inventory tracking and product analytics';

CREATE INDEX idx_jobs_photos ON jobs USING GIN(photos) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_jobs_photos IS 'Find jobs with photos (for quality control)';

CREATE INDEX idx_jobs_search ON jobs USING GIN(to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(description, '') || ' ' || COALESCE(completed_notes, ''))) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_jobs_search IS 'Full-text search across job title, description, and completion notes';

-- Trigger
CREATE TRIGGER set_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
COMMENT ON TRIGGER set_jobs_updated_at ON jobs IS 'Auto-update updated_at timestamp on every UPDATE';


-- ----------------------------------------------------------------------------
-- TABLE: location_history (Partitioned by Month)
-- Purpose: GPS breadcrumbs for field technicians - real-time tracking and route history
-- Usage: Live technician tracking, route optimization, customer ETA, mileage tracking, audit trail
-- Note: Partitioned by month for performance (high-volume inserts from mobile apps)
-- ----------------------------------------------------------------------------
CREATE TABLE location_history (
  id UUID DEFAULT gen_random_uuid(),
  
  -- Multi-Tenancy & User
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,          -- Technician being tracked
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL, -- Organization owning this data
  
  -- GPS Coordinates
  latitude NUMERIC(10, 8) NOT NULL,                                           -- GPS latitude (-90 to 90, 8 decimal precision ~1.1mm)
  longitude NUMERIC(11, 8) NOT NULL,                                          -- GPS longitude (-180 to 180, 8 decimal precision ~1.1mm)
  accuracy NUMERIC(8, 2),                                                     -- Horizontal accuracy in meters (filter > 50m for quality)
  altitude NUMERIC(8, 2),                                                     -- Altitude above sea level in meters
  
  -- Motion Data
  speed NUMERIC(5, 2),                                                        -- Speed in meters/second (0-999.99 m/s covers all realistic speeds)
  heading NUMERIC(5, 2),                                                      -- Compass heading/bearing in degrees (0-360)
  
  -- Device Status
  battery_level NUMERIC(3, 0),                                                -- Device battery percentage (0-100)
  
  -- Metadata
  source TEXT DEFAULT 'mobile_app',                                           -- Data source: mobile_app | gps_device | manual
  recorded_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,                             -- When GPS point was recorded (partition key)
  
  PRIMARY KEY (id, recorded_at)                                               -- Composite PK required for partitioning
) PARTITION BY RANGE (recorded_at);                                           -- Monthly partitions for performance

-- Field Comments
COMMENT ON COLUMN location_history.id IS 'Primary key component - unique identifier for GPS tracking point';
COMMENT ON COLUMN location_history.profile_id IS 'FK to profiles - field technician being tracked (for live location and route history)';
COMMENT ON COLUMN location_history.organization_id IS 'Multi-tenant FK - which organization owns this GPS tracking data';
COMMENT ON COLUMN location_history.latitude IS 'GPS latitude coordinate in decimal degrees (-90 to 90, 8 decimal places = ~1.1mm precision)';
COMMENT ON COLUMN location_history.longitude IS 'GPS longitude coordinate in decimal degrees (-180 to 180, 8 decimal places = ~1.1mm precision)';
COMMENT ON COLUMN location_history.accuracy IS 'Horizontal accuracy radius in meters - filter out readings > 50m for quality tracking (indicates GPS uncertainty)';
COMMENT ON COLUMN location_history.altitude IS 'Altitude/elevation above sea level in meters (useful for route analysis in hilly terrain)';
COMMENT ON COLUMN location_history.speed IS 'Current speed in meters per second (0-999.99 m/s) - detects if technician is moving/stopped';
COMMENT ON COLUMN location_history.heading IS 'Compass heading/bearing in degrees (0-360) - direction technician is traveling (0=North, 90=East, 180=South, 270=West)';
COMMENT ON COLUMN location_history.battery_level IS 'Mobile device battery percentage (0-100) - track device health, predict when technician needs charging';
COMMENT ON COLUMN location_history.source IS 'Data source identifier: mobile_app (Expo app) | gps_device (dedicated GPS tracker) | manual (admin correction)';
COMMENT ON COLUMN location_history.recorded_at IS 'Timestamp when GPS point was recorded - PARTITION KEY for monthly time-based partitioning';\n-- Create monthly partitions for 2026 (automatic data routing by recorded_at timestamp)
COMMENT ON TABLE location_history IS 'GPS tracking breadcrumbs for field technicians - partitioned by month for high-volume time-series data performance';

CREATE TABLE location_history_2026_01 PARTITION OF location_history FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
CREATE TABLE location_history_2026_02 PARTITION OF location_history FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
CREATE TABLE location_history_2026_03 PARTITION OF location_history FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');
CREATE TABLE location_history_2026_04 PARTITION OF location_history FOR VALUES FROM ('2026-04-01') TO ('2026-05-01');
CREATE TABLE location_history_2026_05 PARTITION OF location_history FOR VALUES FROM ('2026-05-01') TO ('2026-06-01');
CREATE TABLE location_history_2026_06 PARTITION OF location_history FOR VALUES FROM ('2026-06-01') TO ('2026-07-01');
CREATE TABLE location_history_2026_07 PARTITION OF location_history FOR VALUES FROM ('2026-07-01') TO ('2026-08-01');
CREATE TABLE location_history_2026_08 PARTITION OF location_history FOR VALUES FROM ('2026-08-01') TO ('2026-09-01');
CREATE TABLE location_history_2026_09 PARTITION OF location_history FOR VALUES FROM ('2026-09-01') TO ('2026-10-01');
CREATE TABLE location_history_2026_10 PARTITION OF location_history FOR VALUES FROM ('2026-10-01') TO ('2026-11-01');
CREATE TABLE location_history_2026_11 PARTITION OF location_history FOR VALUES FROM ('2026-11-01') TO ('2026-12-01');
CREATE TABLE location_history_2026_12 PARTITION OF location_history FOR VALUES FROM ('2026-12-01') TO ('2027-01-01');

COMMENT ON TABLE location_history_2026_01 IS 'January 2026 partition - stores GPS points from 2026-01-01 to 2026-01-31';
COMMENT ON TABLE location_history_2026_02 IS 'February 2026 partition - stores GPS points from 2026-02-01 to 2026-02-28';
COMMENT ON TABLE location_history_2026_03 IS 'March 2026 partition - stores GPS points from 2026-03-01 to 2026-03-31';
COMMENT ON TABLE location_history_2026_04 IS 'April 2026 partition - stores GPS points from 2026-04-01 to 2026-04-30';
COMMENT ON TABLE location_history_2026_05 IS 'May 2026 partition - stores GPS points from 2026-05-01 to 2026-05-31';
COMMENT ON TABLE location_history_2026_06 IS 'June 2026 partition - stores GPS points from 2026-06-01 to 2026-06-30';
COMMENT ON TABLE location_history_2026_07 IS 'July 2026 partition - stores GPS points from 2026-07-01 to 2026-07-31';
COMMENT ON TABLE location_history_2026_08 IS 'August 2026 partition - stores GPS points from 2026-08-01 to 2026-08-31';
COMMENT ON TABLE location_history_2026_09 IS 'September 2026 partition - stores GPS points from 2026-09-01 to 2026-09-30';
COMMENT ON TABLE location_history_2026_10 IS 'October 2026 partition - stores GPS points from 2026-10-01 to 2026-10-31';
COMMENT ON TABLE location_history_2026_11 IS 'November 2026 partition - stores GPS points from 2026-11-01 to 2026-11-30';
COMMENT ON TABLE location_history_2026_12 IS 'December 2026 partition - stores GPS points from 2026-12-01 to 2026-12-31';

-- Indexes (automatically created on all partitions)
CREATE INDEX idx_location_profile ON location_history(profile_id, recorded_at DESC);
COMMENT ON INDEX idx_location_profile IS 'Find GPS history for a technician (newest first) - used for route playback and current location lookup';

CREATE INDEX idx_location_organization ON location_history(organization_id, recorded_at DESC);
COMMENT ON INDEX idx_location_organization IS 'Find GPS history for an organization (newest first) - used for fleet management dashboards';

CREATE INDEX idx_location_recorded ON location_history(recorded_at DESC);
COMMENT ON INDEX idx_location_recorded IS 'Time-based queries (recent activity across all technicians) - used for real-time tracking map';

CREATE INDEX idx_location_accuracy ON location_history(accuracy) WHERE accuracy IS NOT NULL AND accuracy <= 50;
COMMENT ON INDEX idx_location_accuracy IS 'Filter high-quality GPS points (accuracy <= 50m) for accurate route analysis';

CREATE INDEX idx_location_speed ON location_history(speed) WHERE speed IS NOT NULL AND speed > 0;
COMMENT ON INDEX idx_location_speed IS 'Find moving technicians (speed > 0) vs stationary - used for "on route" detection';

CREATE INDEX idx_location_battery ON location_history(profile_id, battery_level) WHERE battery_level < 20;
COMMENT ON INDEX idx_location_battery IS 'Find technicians with low battery (<20%) for proactive dispatch adjustments';



-- ----------------------------------------------------------------------------
-- TABLE: invoices
-- Purpose: Billing with external accounting sync (Xero, QuickBooks)
-- Usage: Generate invoices from jobs, track payments, sync to n8n
-- ----------------------------------------------------------------------------
CREATE TABLE invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,  -- Multi-tenant isolation
  
  -- Relationships
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,                          -- Which job this invoice is for (job-to-invoice conversion)
  quote_id UUID REFERENCES quotes(id) ON DELETE SET NULL,                      -- Which quote this invoice is based on (quote-to-invoice flow)
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,                  -- Customer contact being invoiced
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,                 -- Customer company being invoiced (B2B billing)
  
  -- Invoice Details
  invoice_number TEXT UNIQUE NOT NULL,                                         -- Human-readable unique number (e.g., INV-2026-001)
  title TEXT,                                                                  -- Invoice title or description
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'partially_paid', 'overdue', 'void')),
  
  -- Financial
  subtotal_amount NUMERIC(12, 2) DEFAULT 0,                                    -- Subtotal before tax
  tax_amount NUMERIC(12, 2) DEFAULT 0,                                         -- Tax amount (GST, VAT, sales tax)
  total_amount NUMERIC(12, 2) DEFAULT 0,                                       -- Total amount due (subtotal + tax)
  total_paid NUMERIC(12, 2) DEFAULT 0,                                         -- Total amount paid so far (for partial payments)
  balance_due NUMERIC(12, 2) DEFAULT 0,                                        -- Remaining balance (total_amount - total_paid)
  currency TEXT DEFAULT 'AUD',                                                 -- Currency code (AUD, USD, EUR, GBP, etc.)
  
  -- Dates
  issue_date DATE DEFAULT CURRENT_DATE,                                        -- Date invoice was issued
  due_date DATE,                                                               -- Payment due date (triggers overdue status)
  paid_at TIMESTAMPTZ,                                                         -- Timestamp when invoice was fully paid
  
  -- Line Items
  line_items JSONB DEFAULT '[]',                                               -- Itemized billing: [{"description": "...", "quantity": 1, "unit_price": 100, "total": 100}]
  
  -- External Accounting System Sync (n8n)
  external_provider TEXT,                                                      -- Accounting system: Xero | QuickBooks | FreshBooks | Zoho Books
  external_id TEXT,                                                            -- ID in external accounting system
  external_url TEXT,                                                           -- URL to invoice in external accounting system
  sync_status TEXT DEFAULT 'pending' CHECK (sync_status IN ('pending', 'synced', 'failed')),
  last_sync_at TIMESTAMPTZ,                                                    -- Last successful sync timestamp
  sync_error_message TEXT,                                                     -- Error message from failed sync (for debugging)
  
  -- Audit
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,                  -- User who created this invoice
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ                                                       -- Soft delete - NULL means active
);

-- Table Comment
COMMENT ON TABLE invoices IS 'Customer invoices with external accounting system sync - generates from jobs/quotes, tracks payments, syncs to Xero/QuickBooks via n8n';

-- Field Comments
COMMENT ON COLUMN invoices.id IS 'Primary key - unique identifier for the invoice';
COMMENT ON COLUMN invoices.organization_id IS 'Multi-tenant FK - which organization owns this invoice (data isolation)';
COMMENT ON COLUMN invoices.job_id IS 'FK to jobs - which completed job this invoice bills for (job-to-invoice conversion workflow)';
COMMENT ON COLUMN invoices.quote_id IS 'FK to quotes - which accepted quote this invoice is based on (quote-to-invoice flow for upfront billing)';
COMMENT ON COLUMN invoices.contact_id IS 'FK to contacts - customer contact being invoiced (individual billing recipient)';
COMMENT ON COLUMN invoices.company_id IS 'FK to companies - customer company being invoiced (B2B billing and accounts receivable)';
COMMENT ON COLUMN invoices.invoice_number IS 'Human-readable unique invoice number (e.g., INV-2026-001, INV-20260204-001) - for customer reference and accounting';
COMMENT ON COLUMN invoices.title IS 'Invoice title or description (e.g., "HVAC Installation - 123 Main St", "Monthly Maintenance Service")';
COMMENT ON COLUMN invoices.status IS 'Invoice lifecycle: draft (being created) -> sent (delivered to customer) -> paid (fully paid) | partially_paid (payment in progress) | overdue (past due_date) | void (cancelled)';
COMMENT ON COLUMN invoices.subtotal_amount IS 'Subtotal amount before tax (sum of line item totals)';
COMMENT ON COLUMN invoices.tax_amount IS 'Tax amount added to subtotal (GST 10%, VAT 20%, sales tax varies by region) - calculated from line items';
COMMENT ON COLUMN invoices.total_amount IS 'Total amount due to pay (subtotal_amount + tax_amount - final customer owes this amount)';
COMMENT ON COLUMN invoices.total_paid IS 'Total amount paid so far (tracks partial payments - updated when payments received)';
COMMENT ON COLUMN invoices.balance_due IS 'Remaining balance owed (total_amount - total_paid - triggers overdue status when > 0 after due_date)';
COMMENT ON COLUMN invoices.currency IS 'Currency code (AUD, USD, EUR, GBP, CAD, etc.) - for multi-currency billing and accounting sync';
COMMENT ON COLUMN invoices.issue_date IS 'Date invoice was issued to customer (defaults to today - starts payment terms clock)';
COMMENT ON COLUMN invoices.due_date IS 'Payment due date (issue_date + payment_terms, e.g., NET-30) - triggers overdue status and late fees';
COMMENT ON COLUMN invoices.paid_at IS 'Timestamp when invoice was fully paid (balance_due = 0) - for accounts receivable aging and cash flow tracking';
COMMENT ON COLUMN invoices.line_items IS 'JSONB itemized billing array: [{"description": "Labor - HVAC Installation", "quantity": 8, "unit": "hours", "unit_price": 125, "total": 1000, "tax_rate": 0.10}]';
COMMENT ON COLUMN invoices.external_provider IS 'External accounting system provider: Xero | QuickBooks | FreshBooks | Zoho Books | Wave (for automated bookkeeping sync)';
COMMENT ON COLUMN invoices.external_id IS 'ID in external accounting system (e.g., Xero Invoice ID) - for bi-directional sync and reconciliation';
COMMENT ON COLUMN invoices.external_url IS 'Direct URL to invoice in external accounting system (for quick access from CRM)';
COMMENT ON COLUMN invoices.sync_status IS 'n8n webhook sync status: pending (awaiting sync) -> synced (successfully synced) | failed (sync error - see sync_error_message)';
COMMENT ON COLUMN invoices.last_sync_at IS 'Last successful sync timestamp - for monitoring sync health and troubleshooting';
COMMENT ON COLUMN invoices.sync_error_message IS 'Error message from failed sync attempt (API errors, validation failures) - for debugging accounting integration issues';
COMMENT ON COLUMN invoices.created_by IS 'FK to profiles - user who created this invoice (admin, accountant, or automated job completion workflow)';
COMMENT ON COLUMN invoices.created_at IS 'Timestamp when invoice was created in CRM';
COMMENT ON COLUMN invoices.updated_at IS 'Auto-updated via trigger on every UPDATE (tracks last modification)';
COMMENT ON COLUMN invoices.deleted_at IS 'Soft delete timestamp - NULL means active, populated means voided/deleted (preserves accounting history)';

-- Indexes
CREATE INDEX idx_invoices_organization ON invoices(organization_id) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_invoices_organization IS 'Find all invoices for an organization (invoice list view)';

CREATE INDEX idx_invoices_status ON invoices(status) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_invoices_status IS 'Filter invoices by status (draft, sent, paid, overdue dashboards)';

CREATE INDEX idx_invoices_number ON invoices(invoice_number) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_invoices_number IS 'Lookup invoice by invoice number (customer inquiries and search)';

CREATE INDEX idx_invoices_job ON invoices(job_id) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_invoices_job IS 'Find invoice for a job (job billing history)';

CREATE INDEX idx_invoices_quote ON invoices(quote_id) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_invoices_quote IS 'Find invoice for a quote (quote-to-invoice conversion tracking)';

CREATE INDEX idx_invoices_contact ON invoices(contact_id) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_invoices_contact IS 'Find invoices for a contact (customer billing history and accounts receivable)';

CREATE INDEX idx_invoices_company ON invoices(company_id) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_invoices_company IS 'Find invoices for a company (B2B accounts receivable aging)';

CREATE INDEX idx_invoices_due_date ON invoices(due_date) WHERE deleted_at IS NULL AND status != 'paid';
COMMENT ON INDEX idx_invoices_due_date IS 'Find upcoming/overdue unpaid invoices (accounts receivable aging report and payment reminders)';

CREATE INDEX idx_invoices_overdue ON invoices(status, due_date, balance_due) WHERE deleted_at IS NULL AND status IN ('sent', 'partially_paid') AND due_date < CURRENT_DATE;
COMMENT ON INDEX idx_invoices_overdue IS 'Find overdue invoices with outstanding balance (partial index for collections queue)';

CREATE INDEX idx_invoices_created_by ON invoices(created_by) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_invoices_created_by IS 'Find invoices created by a user (accountant/admin performance tracking)';

CREATE INDEX idx_invoices_sync ON invoices(sync_status) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_invoices_sync IS 'Find invoices needing sync to external accounting systems (n8n webhook queue)';

CREATE INDEX idx_invoices_external ON invoices(external_provider, external_id) WHERE deleted_at IS NULL AND external_id IS NOT NULL;
COMMENT ON INDEX idx_invoices_external IS 'Lookup invoice by external accounting system ID (bi-directional sync and reconciliation)';

CREATE INDEX idx_invoices_issued ON invoices(issue_date DESC) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_invoices_issued IS 'Find recently issued invoices (newest first for dashboard and reports)';

-- GIN indexes
CREATE INDEX idx_invoices_line_items ON invoices USING GIN(line_items) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_invoices_line_items IS 'Query line items JSONB for product/service revenue analytics';

CREATE INDEX idx_invoices_search ON invoices USING GIN(to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(invoice_number, ''))) WHERE deleted_at IS NULL;
COMMENT ON INDEX idx_invoices_search IS 'Full-text search across invoice title and invoice number';

-- Trigger
CREATE TRIGGER set_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
COMMENT ON TRIGGER set_invoices_updated_at ON invoices IS 'Auto-update updated_at timestamp on every UPDATE';


-- ============================================================================
-- STEP 6: PERMISSIONS & RBAC
-- ============================================================================

-- ----------------------------------------------------------------------------
-- TABLE: permissions
-- Purpose: Master list of granular permissions
-- Usage: Define actions like 'contacts:create', 'invoices:delete'
-- ----------------------------------------------------------------------------
CREATE TABLE permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,                                                   -- Permission name in resource:action format
  description TEXT,                                                            -- Human-readable description
  category TEXT NOT NULL,                                                      -- Category for grouping (Sales, Admin, Accounting, Field Service)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table Comment
COMMENT ON TABLE permissions IS 'Master permission catalog for RBAC - defines all granular actions (resource:action format like contacts:create, invoices:delete, jobs:view)';

-- Field Comments
COMMENT ON COLUMN permissions.id IS 'Primary key - unique identifier for the permission';
COMMENT ON COLUMN permissions.name IS 'Permission name in resource:action format (e.g., contacts:create, contacts:read, contacts:update, contacts:delete, invoices:delete, jobs:view, opportunities:assign) - used for RBAC checks';
COMMENT ON COLUMN permissions.description IS 'Human-readable description of what this permission allows (e.g., "Create new contact records", "Delete invoices", "View field service jobs")';
COMMENT ON COLUMN permissions.category IS 'Category for UI grouping and filtering: Sales | Admin | Accounting | Field Service | Collaboration | Reports (helps organize permission management UI)';
COMMENT ON COLUMN permissions.created_at IS 'Timestamp when permission was created in system';

-- Indexes
CREATE INDEX idx_permissions_category ON permissions(category);
COMMENT ON INDEX idx_permissions_category IS 'Find permissions by category (for permission management UI grouping)';

CREATE INDEX idx_permissions_name ON permissions(name);
COMMENT ON INDEX idx_permissions_name IS 'Lookup permission by name (for RBAC authorization checks - critical performance index)';


-- ----------------------------------------------------------------------------
-- TABLE: role_permissions
-- Purpose: Map roles to permissions
-- Usage: Assign permissions to roles (e.g., 'sales' can 'contacts:create')
-- ----------------------------------------------------------------------------
CREATE TABLE role_permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role TEXT NOT NULL,                                                          -- Role name (admin, manager, sales, technician, etc.)
  permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,             -- Permission granted to this role
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(role, permission_id)                                                  -- Prevent duplicate role-permission assignments
);

-- Table Comment
COMMENT ON TABLE role_permissions IS 'Role-to-permission mapping for RBAC - assigns granular permissions to roles (many-to-many relationship between roles and permissions)';

-- Field Comments
COMMENT ON COLUMN role_permissions.id IS 'Primary key - unique identifier for role-permission mapping';
COMMENT ON COLUMN role_permissions.role IS 'Role name (admin, manager, sales, support, technician, dispatcher, accountant, viewer) - matches organization_members.role for RBAC lookups';
COMMENT ON COLUMN role_permissions.permission_id IS 'FK to permissions - which permission this role has (e.g., admin role might have all permissions, technician role might only have jobs:view, jobs:update)';
COMMENT ON COLUMN role_permissions.created_at IS 'Timestamp when role-permission assignment was created';

-- Indexes
CREATE INDEX idx_role_permissions_role ON role_permissions(role);
COMMENT ON INDEX idx_role_permissions_role IS 'Find all permissions for a role (RBAC authorization checks - e.g., "What can a sales user do?")';

CREATE INDEX idx_role_permissions_permission ON role_permissions(permission_id);
COMMENT ON INDEX idx_role_permissions_permission IS 'Find which roles have a specific permission (reverse lookup - e.g., "Who can delete invoices?")';


-- ----------------------------------------------------------------------------
-- TABLE: organization_members
-- Purpose: Multi-tenant membership (users can belong to multiple orgs)
-- Usage: Link profiles to organizations with specific roles
-- ----------------------------------------------------------------------------
CREATE TABLE organization_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Relationships
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL, -- Which organization the user belongs to
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,          -- Which user is a member
  
  -- Role & Status
  role TEXT NOT NULL,                                                          -- User's role in this organization (admin, manager, sales, technician, etc.)
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'invited')),
  
  -- Invitation Tracking
  invited_by UUID REFERENCES profiles(id) ON DELETE SET NULL,                  -- Who invited this user (for audit trail)
  invited_at TIMESTAMPTZ,                                                      -- When invitation was sent (for pending invites)
  
  -- Activity Tracking
  joined_at TIMESTAMPTZ DEFAULT NOW(),                                         -- When user joined or was invited
  last_active_at TIMESTAMPTZ,                                                  -- Last time user accessed this organization (for activity monitoring)
  
  -- Audit
  updated_at TIMESTAMPTZ DEFAULT NOW(),                                        -- Auto-updated when role/status changes
  
  UNIQUE(organization_id, profile_id)                                          -- User can only be member of org once
);

-- Table Comment
COMMENT ON TABLE organization_members IS 'Multi-tenant organization membership - links users to organizations with roles for RBAC (users can belong to multiple organizations with different roles in each)';

-- Field Comments
COMMENT ON COLUMN organization_members.id IS 'Primary key - unique identifier for membership';
COMMENT ON COLUMN organization_members.organization_id IS 'FK to organizations - which organization the user belongs to (multi-tenant isolation)';
COMMENT ON COLUMN organization_members.profile_id IS 'FK to profiles - which user is a member of this organization';
COMMENT ON COLUMN organization_members.role IS 'User role within this organization: admin (full access) | manager (team oversight) | sales (pipeline management) | technician (field service) | dispatcher (job scheduling) | accountant (financial access) | viewer (read-only)';
COMMENT ON COLUMN organization_members.status IS 'Membership status: active (full access) | inactive (suspended, no access) | invited (pending acceptance - user created but not yet activated)';
COMMENT ON COLUMN organization_members.invited_by IS 'FK to profiles - who sent the invitation (for audit trail and invitation management)';
COMMENT ON COLUMN organization_members.invited_at IS 'Timestamp when invitation was sent (helps track pending invitations and expiration)';
COMMENT ON COLUMN organization_members.joined_at IS 'Timestamp when user joined this organization or invitation was created (status change from invited->active updates this)';
COMMENT ON COLUMN organization_members.last_active_at IS 'Last time user accessed this organization (updated on login/org switch - for activity monitoring and inactive user cleanup)';
COMMENT ON COLUMN organization_members.updated_at IS 'Auto-updated via trigger when role or status changes (tracks permission changes)';

-- Indexes
CREATE INDEX idx_org_members_organization ON organization_members(organization_id);
COMMENT ON INDEX idx_org_members_organization IS 'Find all members of an organization (team directory, user management)';

CREATE INDEX idx_org_members_profile ON organization_members(profile_id);
COMMENT ON INDEX idx_org_members_profile IS 'Find all organizations a user belongs to (user org switcher, multi-tenant access)';

CREATE INDEX idx_org_members_status ON organization_members(status);
COMMENT ON INDEX idx_org_members_status IS 'Find members by status (active users, pending invitations)';

CREATE INDEX idx_org_members_role ON organization_members(organization_id, role) WHERE status = 'active';
COMMENT ON INDEX idx_org_members_role IS 'Find active members by role within organization (e.g., "All active technicians in Org A" - partial index for RBAC queries)';

CREATE INDEX idx_org_members_invited ON organization_members(status, invited_at) WHERE status = 'invited';
COMMENT ON INDEX idx_org_members_invited IS 'Find pending invitations by date (partial index for invitation expiration cleanup and reminder emails)';

CREATE INDEX idx_org_members_invited_by ON organization_members(invited_by) WHERE invited_by IS NOT NULL;
COMMENT ON INDEX idx_org_members_invited_by IS 'Find invitations sent by a user (for invitation management and audit)';

CREATE INDEX idx_org_members_inactive ON organization_members(organization_id, last_active_at) WHERE status = 'active' AND last_active_at < NOW() - INTERVAL '90 days';
COMMENT ON INDEX idx_org_members_inactive IS 'Find inactive users (no activity in 90+ days) for license cleanup and account deactivation (partial index)';

-- Trigger
CREATE TRIGGER set_org_members_updated_at
  BEFORE UPDATE ON organization_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
COMMENT ON TRIGGER set_org_members_updated_at ON organization_members IS 'Auto-update updated_at timestamp on every UPDATE (tracks role/status changes)';


-- ----------------------------------------------------------------------------
-- TABLE: user_integrations
-- Purpose: OAuth tokens for external services
-- Usage: Gmail, Outlook, Slack, Twilio integrations
-- WARNING: Use Supabase Vault for production token storage
-- ----------------------------------------------------------------------------
CREATE TABLE user_integrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- User Relationship
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,          -- Which user owns this integration
  
  -- Provider Details
  provider TEXT NOT NULL,                                                      -- Integration provider (gmail, outlook, slack, twilio, xero, quickbooks)
  provider_user_id TEXT,                                                       -- User ID in external provider system
  provider_email TEXT,                                                         -- Email associated with provider account (for multi-account support)
  
  -- OAuth Tokens (⚠️ SECURITY: Use Supabase Vault in production)
  access_token TEXT NOT NULL,                                                  -- OAuth access token - encrypt or use Supabase Vault
  refresh_token TEXT,                                                          -- OAuth refresh token - encrypt or use Supabase Vault
  expires_at TIMESTAMPTZ,                                                      -- Access token expiration timestamp
  scopes TEXT[],                                                               -- OAuth scopes granted (e.g., ["email", "calendar"])
  
  -- Status & Health
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'error', 'expired', 'revoked')),
  last_sync_at TIMESTAMPTZ,                                                    -- Last successful data sync timestamp
  last_used_at TIMESTAMPTZ,                                                    -- Last time this integration was used
  last_error TEXT,                                                             -- Last error message encountered
  error_count INTEGER DEFAULT 0,                                               -- Consecutive error count (for auto-disable)
  
  -- Metadata
  metadata JSONB DEFAULT '{}',                                                 -- Additional provider-specific settings
  
  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table Comment
COMMENT ON TABLE user_integrations IS 'OAuth integrations for external services - stores encrypted tokens for Gmail, Outlook, Slack, Twilio, Xero, QuickBooks (use Supabase Vault for production token storage)';

-- Field Comments
COMMENT ON COLUMN user_integrations.id IS 'Primary key - unique identifier for integration';
COMMENT ON COLUMN user_integrations.profile_id IS 'FK to profiles - which user owns this integration (one user can have multiple integrations per provider)';
COMMENT ON COLUMN user_integrations.provider IS 'Integration provider: gmail | outlook | slack | twilio | xero | quickbooks | stripe | calendar | sms (for email, messaging, accounting, payment integrations)';
COMMENT ON COLUMN user_integrations.provider_user_id IS 'User ID in external provider system (e.g., Gmail user ID, Slack user ID) - for provider-side lookups';
COMMENT ON COLUMN user_integrations.provider_email IS 'Email address associated with provider account (supports multiple accounts per provider - e.g., user has 2 Gmail accounts)';
COMMENT ON COLUMN user_integrations.access_token IS '⚠️ SECURITY: OAuth access token - MUST be encrypted or stored in Supabase Vault in production (short-lived, typically 1 hour)';
COMMENT ON COLUMN user_integrations.refresh_token IS '⚠️ SECURITY: OAuth refresh token - MUST be encrypted or stored in Supabase Vault in production (long-lived, used to obtain new access tokens)';
COMMENT ON COLUMN user_integrations.expires_at IS 'Access token expiration timestamp - triggers refresh token flow when expired';
COMMENT ON COLUMN user_integrations.scopes IS 'Array of OAuth scopes granted by user (e.g., ["email", "calendar", "contacts"] - determines what data can be accessed)';
COMMENT ON COLUMN user_integrations.status IS 'Integration health status: active (working) | inactive (disabled by user) | error (API errors) | expired (token expired, needs reauth) | revoked (user revoked access)';
COMMENT ON COLUMN user_integrations.last_sync_at IS 'Last successful data synchronization timestamp (for monitoring sync health)';
COMMENT ON COLUMN user_integrations.last_used_at IS 'Last time this integration was used to make API call (for inactive integration cleanup)';
COMMENT ON COLUMN user_integrations.last_error IS 'Most recent error message from provider API (for troubleshooting integration issues)';
COMMENT ON COLUMN user_integrations.error_count IS 'Consecutive error count - auto-disable integration after threshold (e.g., 5 consecutive errors = set status to "error")';
COMMENT ON COLUMN user_integrations.metadata IS 'Additional provider-specific settings JSONB: {"webhook_url": "...", "calendar_id": "...", "default_folder": "..."} - flexible storage for provider configs';
COMMENT ON COLUMN user_integrations.created_at IS 'Timestamp when integration was first connected by user';
COMMENT ON COLUMN user_integrations.updated_at IS 'Auto-updated via trigger on every UPDATE (tracks token refreshes, status changes)';

-- Indexes
CREATE INDEX idx_integrations_profile ON user_integrations(profile_id);
COMMENT ON INDEX idx_integrations_profile IS 'Find all integrations for a user (user integrations dashboard)';

CREATE INDEX idx_integrations_provider ON user_integrations(provider);
COMMENT ON INDEX idx_integrations_provider IS 'Find all integrations by provider type (for provider-specific operations)';

CREATE INDEX idx_integrations_status ON user_integrations(status);
COMMENT ON INDEX idx_integrations_status IS 'Find integrations by health status (active, error, expired - for monitoring and cleanup)';

CREATE INDEX idx_integrations_profile_provider ON user_integrations(profile_id, provider) WHERE status = 'active';
COMMENT ON INDEX idx_integrations_profile_provider IS 'Find active integration for user+provider combination (partial index - e.g., "Get John active Gmail integration")';

CREATE INDEX idx_integrations_expired ON user_integrations(expires_at) WHERE status = 'active' AND expires_at < NOW();
COMMENT ON INDEX idx_integrations_expired IS 'Find expired tokens needing refresh (partial index for token refresh background job)';

CREATE INDEX idx_integrations_errors ON user_integrations(error_count, last_error) WHERE status = 'error' AND error_count >= 5;
COMMENT ON INDEX idx_integrations_errors IS 'Find failing integrations needing attention (partial index for error threshold alerts)';

CREATE INDEX idx_integrations_inactive ON user_integrations(last_used_at) WHERE status = 'active' AND last_used_at < NOW() - INTERVAL '180 days';
COMMENT ON INDEX idx_integrations_inactive IS 'Find unused integrations (no activity in 180+ days) for cleanup (partial index)';

-- GIN index
CREATE INDEX idx_integrations_scopes ON user_integrations USING GIN(scopes);
COMMENT ON INDEX idx_integrations_scopes IS 'Find integrations by OAuth scopes (e.g., "Which users granted calendar access?")';

CREATE INDEX idx_integrations_metadata ON user_integrations USING GIN(metadata);
COMMENT ON INDEX idx_integrations_metadata IS 'Query provider-specific metadata with JSONB operators';

-- Trigger
CREATE TRIGGER set_user_integrations_updated_at
  BEFORE UPDATE ON user_integrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
COMMENT ON TRIGGER set_user_integrations_updated_at ON user_integrations IS 'Auto-update updated_at timestamp on every UPDATE (tracks token refreshes and status changes)';

-- ============================================================================
-- STEP 7: ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE phones ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_integrations ENABLE ROW LEVEL SECURITY;

-- Example RLS policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can view org profiles"
  ON profiles FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE profile_id = auth.uid() AND status = 'active'
    )
  );

-- Example RLS policies for organization-scoped data (contacts)
CREATE POLICY "Users can view org contacts"
  ON contacts FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE profile_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Users can insert org contacts"
  ON contacts FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE profile_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Users can update org contacts"
  ON contacts FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE profile_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Users can delete org contacts"
  ON contacts FOR DELETE
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE profile_id = auth.uid() AND status = 'active'
    )
  );

-- ⚠️ NOTE: Apply similar RLS policies to all organization-scoped tables
-- (companies, opportunities, tasks, notes, quotes, jobs, invoices, etc.)


-- ============================================================================
-- STEP 8: PERFORMANCE OPTIMIZATION
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Materialized View: Sales Pipeline Dashboard
-- Purpose: Pre-aggregate opportunity metrics by user and pipeline
-- Refresh: REFRESH MATERIALIZED VIEW CONCURRENTLY mv_sales_pipeline;
-- ----------------------------------------------------------------------------
CREATE MATERIALIZED VIEW mv_sales_pipeline AS
SELECT 
  assigned_to,
  pipeline,
  COUNT(*) as count,
  SUM(value) as total_value,
  AVG(value) as avg_value
FROM opportunities
WHERE deleted_at IS NULL
GROUP BY assigned_to, pipeline;

COMMENT ON MATERIALIZED VIEW mv_sales_pipeline IS 'Pre-aggregated sales pipeline data for dashboards - refresh hourly or on opportunity changes';

CREATE INDEX ON mv_sales_pipeline(assigned_to);
CREATE INDEX ON mv_sales_pipeline(pipeline);


-- ----------------------------------------------------------------------------
-- Materialized View: Company Statistics
-- Purpose: Pre-calculate counts and totals for companies
-- Refresh: REFRESH MATERIALIZED VIEW CONCURRENTLY mv_company_stats;
-- ----------------------------------------------------------------------------
CREATE MATERIALIZED VIEW mv_company_stats AS
SELECT 
  c.id as company_id,
  c.organization_id,
  c.name as company_name,
  COUNT(DISTINCT ct.id) as contact_count,
  COUNT(DISTINCT o.id) as opportunity_count,
  COALESCE(SUM(o.value), 0) as total_opportunity_value,
  COUNT(DISTINCT j.id) as job_count,
  COUNT(DISTINCT q.id) as quote_count,
  COUNT(DISTINCT i.id) as invoice_count,
  COALESCE(SUM(i.total_amount), 0) as total_invoiced,
  COALESCE(SUM(i.total_paid), 0) as total_paid,
  COALESCE(SUM(i.balance_due), 0) as total_outstanding,
  MAX(ct.created_at) as last_contact_added,
  MAX(o.created_at) as last_opportunity_created,
  MAX(j.actual_end) as last_job_completed
FROM companies c
LEFT JOIN contacts ct ON c.id = ct.company_id AND ct.deleted_at IS NULL
LEFT JOIN opportunities o ON c.id = o.company_id AND o.deleted_at IS NULL
LEFT JOIN jobs j ON c.id = j.company_id AND j.deleted_at IS NULL
LEFT JOIN quotes q ON c.id = q.company_id AND q.deleted_at IS NULL
LEFT JOIN invoices i ON c.id = i.company_id AND i.deleted_at IS NULL
WHERE c.deleted_at IS NULL
GROUP BY c.id, c.organization_id, c.name;

COMMENT ON MATERIALIZED VIEW mv_company_stats IS 'Aggregated company statistics - contact count, revenue, jobs, invoices (refresh on data changes or daily)';

CREATE INDEX ON mv_company_stats(company_id);
CREATE INDEX ON mv_company_stats(organization_id);
CREATE INDEX ON mv_company_stats(total_outstanding) WHERE total_outstanding > 0;


-- ----------------------------------------------------------------------------
-- Materialized View: Contact Statistics
-- Purpose: Pre-calculate activity and revenue metrics per contact
-- Refresh: REFRESH MATERIALIZED VIEW CONCURRENTLY mv_contact_stats;
-- ----------------------------------------------------------------------------
CREATE MATERIALIZED VIEW mv_contact_stats AS
SELECT 
  c.id as contact_id,
  c.organization_id,
  c.full_name,
  c.company_id,
  COUNT(DISTINCT o.id) as opportunity_count,
  COALESCE(SUM(o.value), 0) as total_opportunity_value,
  COUNT(DISTINCT t.id) as task_count,
  COUNT(DISTINCT t.id) FILTER (WHERE t.status = 'completed') as completed_task_count,
  COUNT(DISTINCT n.id) as note_count,
  COUNT(DISTINCT j.id) as job_count,
  COUNT(DISTINCT q.id) as quote_count,
  COUNT(DISTINCT i.id) as invoice_count,
  COALESCE(SUM(i.total_amount), 0) as total_invoiced,
  COALESCE(SUM(i.total_paid), 0) as total_paid,
  MAX(t.created_at) as last_task_created,
  MAX(n.created_at) as last_note_created,
  MAX(j.actual_end) as last_job_completed
FROM contacts c
LEFT JOIN opportunities o ON c.id = o.contact_id AND o.deleted_at IS NULL
LEFT JOIN tasks t ON c.id = t.contact_id AND t.deleted_at IS NULL
LEFT JOIN notes n ON n.entity_type = 'contact' AND n.entity_id = c.id AND n.deleted_at IS NULL
LEFT JOIN jobs j ON c.id = j.contact_id AND j.deleted_at IS NULL
LEFT JOIN quotes q ON c.id = q.contact_id AND q.deleted_at IS NULL
LEFT JOIN invoices i ON c.id = i.contact_id AND i.deleted_at IS NULL
WHERE c.deleted_at IS NULL
GROUP BY c.id, c.organization_id, c.full_name, c.company_id;

COMMENT ON MATERIALIZED VIEW mv_contact_stats IS 'Aggregated contact statistics - tasks, notes, opportunities, revenue (refresh on activity changes or hourly)';

CREATE INDEX ON mv_contact_stats(contact_id);
CREATE INDEX ON mv_contact_stats(organization_id);
CREATE INDEX ON mv_contact_stats(company_id);
CREATE INDEX ON mv_contact_stats(total_invoiced) WHERE total_invoiced > 0;


-- ----------------------------------------------------------------------------
-- Materialized View: User Performance Metrics
-- Purpose: Sales and technician performance dashboards
-- Refresh: REFRESH MATERIALIZED VIEW CONCURRENTLY mv_user_performance;
-- ----------------------------------------------------------------------------
CREATE MATERIALIZED VIEW mv_user_performance AS
SELECT 
  p.id as profile_id,
  p.organization_id,
  p.full_name,
  COUNT(DISTINCT o.id) as opportunity_count,
  COUNT(DISTINCT o.id) FILTER (WHERE o.stage IN (SELECT id FROM pipeline_stages WHERE is_closed_won = true)) as won_count,
  COUNT(DISTINCT o.id) FILTER (WHERE o.stage IN (SELECT id FROM pipeline_stages WHERE is_closed_lost = true)) as lost_count,
  COALESCE(SUM(o.value), 0) as total_pipeline_value,
  COALESCE(SUM(o.value) FILTER (WHERE o.stage IN (SELECT id FROM pipeline_stages WHERE is_closed_won = true)), 0) as total_won_value,
  COUNT(DISTINCT q.id) as quote_count,
  COUNT(DISTINCT q.id) FILTER (WHERE q.status = 'accepted') as quote_accepted_count,
  COUNT(DISTINCT j.id) as job_count,
  COUNT(DISTINCT j.id) FILTER (WHERE j.status = 'completed') as job_completed_count,
  COALESCE(AVG(j.customer_satisfaction::text::int), 0) as avg_satisfaction,
  COUNT(DISTINCT t.id) as task_count,
  COUNT(DISTINCT t.id) FILTER (WHERE t.status = 'completed') as task_completed_count
FROM profiles p
LEFT JOIN opportunities o ON p.id = o.assigned_to AND o.deleted_at IS NULL
LEFT JOIN quotes q ON p.id = q.created_by AND q.deleted_at IS NULL
LEFT JOIN jobs j ON p.id = j.technician_id AND j.deleted_at IS NULL
LEFT JOIN tasks t ON p.id = t.assigned_to AND t.deleted_at IS NULL
GROUP BY p.id, p.organization_id, p.full_name;

COMMENT ON MATERIALIZED VIEW mv_user_performance IS 'User performance metrics - win rates, jobs completed, satisfaction scores (refresh daily or on key events)';

CREATE INDEX ON mv_user_performance(profile_id);
CREATE INDEX ON mv_user_performance(organization_id);
CREATE INDEX ON mv_user_performance(total_won_value DESC);


-- ----------------------------------------------------------------------------
-- Materialized View: Financial Summary by Organization
-- Purpose: Organization-wide revenue and AR dashboards
-- Refresh: REFRESH MATERIALIZED VIEW CONCURRENTLY mv_financial_summary;
-- ----------------------------------------------------------------------------
CREATE MATERIALIZED VIEW mv_financial_summary AS
SELECT 
  org.id as organization_id,
  org.name as organization_name,
  COUNT(DISTINCT i.id) as invoice_count,
  COUNT(DISTINCT i.id) FILTER (WHERE i.status = 'paid') as paid_invoice_count,
  COUNT(DISTINCT i.id) FILTER (WHERE i.status = 'overdue') as overdue_invoice_count,
  COALESCE(SUM(i.total_amount), 0) as total_invoiced,
  COALESCE(SUM(i.total_paid), 0) as total_received,
  COALESCE(SUM(i.balance_due), 0) as total_outstanding,
  COALESCE(SUM(i.balance_due) FILTER (WHERE i.status = 'overdue'), 0) as overdue_amount,
  COUNT(DISTINCT j.id) as job_count,
  COUNT(DISTINCT j.id) FILTER (WHERE j.status = 'completed') as completed_job_count,
  COALESCE(SUM(j.total_revenue), 0) as total_job_revenue,
  COALESCE(SUM(j.total_cost), 0) as total_job_cost,
  COALESCE(SUM(j.total_revenue) - SUM(j.total_cost), 0) as total_profit,
  COUNT(DISTINCT q.id) as quote_count,
  COUNT(DISTINCT q.id) FILTER (WHERE q.status = 'accepted') as accepted_quote_count,
  COALESCE(SUM(q.total_amount) FILTER (WHERE q.status = 'accepted'), 0) as accepted_quote_value
FROM organizations org
LEFT JOIN invoices i ON org.id = i.organization_id AND i.deleted_at IS NULL
LEFT JOIN jobs j ON org.id = j.organization_id AND j.deleted_at IS NULL
LEFT JOIN quotes q ON org.id = q.organization_id AND q.deleted_at IS NULL
GROUP BY org.id, org.name;

COMMENT ON MATERIALIZED VIEW mv_financial_summary IS 'Organization financial summary - AR, revenue, profit margins (refresh daily or on invoice changes)';

CREATE INDEX ON mv_financial_summary(organization_id);
CREATE INDEX ON mv_financial_summary(total_outstanding DESC);
CREATE INDEX ON mv_financial_summary(overdue_amount DESC) WHERE overdue_amount > 0;


-- Refresh Schedule Recommendations:
-- Run these commands via cron job or scheduled function:
-- REFRESH MATERIALIZED VIEW CONCURRENTLY mv_sales_pipeline;        -- Hourly or on opportunity changes
-- REFRESH MATERIALIZED VIEW CONCURRENTLY mv_company_stats;         -- Daily or on company/invoice changes
-- REFRESH MATERIALIZED VIEW CONCURRENTLY mv_contact_stats;         -- Hourly or on contact activity
-- REFRESH MATERIALIZED VIEW CONCURRENTLY mv_user_performance;      -- Daily (morning reports)
-- REFRESH MATERIALIZED VIEW CONCURRENTLY mv_financial_summary;     -- Daily or on invoice changes


-- ============================================================================
-- STEP 9: HELPER FUNCTIONS
-- ============================================================================

-- Auto-create location_history partitions
CREATE OR REPLACE FUNCTION create_location_partition()
RETURNS void AS $$
DECLARE
  start_date DATE;
  end_date DATE;
  partition_name TEXT;
BEGIN
  start_date := DATE_TRUNC('month', NOW());
  end_date := start_date + INTERVAL '1 month';
  partition_name := 'location_history_' || TO_CHAR(start_date, 'YYYY_MM');
  
  EXECUTE FORMAT(
    'CREATE TABLE IF NOT EXISTS %I PARTITION OF location_history FOR VALUES FROM (%L) TO (%L)',
    partition_name, start_date, end_date
  );
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION create_location_partition IS 'Auto-create monthly partition for location_history';


-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- Next steps:
-- 1. Run this script in Supabase SQL Editor
-- 2. Create .env file with EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY
-- 3. Generate TypeScript types: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts
-- 4. Apply remaining RLS policies for all tables
-- 5. Seed initial data (organizations, permissions, etc.)
-- ============================================================================
