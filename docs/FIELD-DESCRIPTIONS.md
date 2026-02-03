# Database Field Descriptions

## Row Level Security (RLS) Exceptions

### Tables That BYPASS RLS (Public/Shared Data)

**No RLS Applied** - These tables are read-only for all authenticated users:

1. **`permissions`** - Master permission list
   - Readable by all authenticated users
   - Only admins can modify via application logic
2. **`role_permissions`** - Role-to-permission mappings
   - Readable by all authenticated users to check permissions
   - Only admins can modify via application logic

**Why?** These are reference/configuration tables needed for authorization checks across the app.

---

## organizations

| Field               | Type        | Description                                                               |
| ------------------- | ----------- | ------------------------------------------------------------------------- |
| `id`                | UUID        | Primary key - unique identifier for the organization                      |
| `name`              | TEXT        | Display name (e.g., "Acme Corp")                                          |
| `slug`              | TEXT        | URL-friendly identifier (e.g., "acme-corp") - used for subdomain routing  |
| `logo_url`          | TEXT        | URL to organization logo (stored in Supabase Storage)                     |
| `subscription_tier` | TEXT        | Billing plan: `free` \| `pro` \| `enterprise` - determines feature access |
| `created_at`        | TIMESTAMPTZ | When the organization was created                                         |
| `updated_at`        | TIMESTAMPTZ | Auto-updated via trigger on every UPDATE                                  |
| `deleted_at`        | TIMESTAMPTZ | Soft delete - NULL = active, timestamp = deleted                          |

---

## profiles

| Field                      | Type          | Description                                                                                                                   |
| -------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **IDENTITY**               |               |                                                                                                                               |
| `id`                       | UUID          | References `auth.users` - created via Supabase Auth signup                                                                    |
| `first_name`               | TEXT          | User's first/given name                                                                                                       |
| `last_name`                | TEXT          | User's last/family name                                                                                                       |
| `email`                    | TEXT          | Primary email (unique across all profiles)                                                                                    |
| `avatar_url`               | TEXT          | Profile picture URL (Supabase Storage)                                                                                        |
| **ROLE & ACCESS**          |               |                                                                                                                               |
| `role`                     | TEXT          | System role: `admin` \| `manager` \| `sales` \| `support` \| `marketing` \| `technician` \| `dispatcher` \| `project_manager` |
| `status`                   | TEXT          | Current status: `active` \| `inactive` \| `pending` \| `on_field` (for field workers)                                         |
| `department`               | TEXT          | Department/team name (e.g., "Sales", "Support")                                                                               |
| `access_level`             | TEXT          | Permission level: `Full` \| `Restricted` \| `Limited`                                                                         |
| `teams`                    | TEXT[]        | Array of team names (legacy - use `organization_members` for modern multi-tenancy)                                            |
| `organization_id`          | UUID          | Current organization membership                                                                                               |
| **HIERARCHY**              |               |                                                                                                                               |
| `territory`                | TEXT          | Geographic territory (e.g., "West Coast", "APAC")                                                                             |
| `manager_id`               | UUID          | Direct manager (self-referencing FK)                                                                                          |
| `reports_to`               | TEXT          | Manager's name (denormalized for quick access)                                                                                |
| **SALES QUOTAS**           |               |                                                                                                                               |
| `monthly_quota`            | NUMERIC(12,2) | Monthly sales target (for sales roles)                                                                                        |
| `quarterly_quota`          | NUMERIC(12,2) | Quarterly sales target                                                                                                        |
| `annual_quota`             | NUMERIC(12,2) | Annual sales target                                                                                                           |
| `commission_rate`          | NUMERIC(5,2)  | Commission percentage (e.g., 5.00 = 5%)                                                                                       |
| **TECHNICIAN**             |               |                                                                                                                               |
| `certification`            | TEXT          | Professional certifications (e.g., "HVAC Master, EPA Certified")                                                              |
| `current_location_name`    | TEXT          | Human-readable location (e.g., "Moving on M1", "At Depot")                                                                    |
| `latitude`                 | NUMERIC(10,8) | Current GPS latitude (from mobile app)                                                                                        |
| `longitude`                | NUMERIC(11,8) | Current GPS longitude                                                                                                         |
| `last_location_update`     | TIMESTAMPTZ   | When GPS was last updated                                                                                                     |
| `service_areas`            | TEXT[]        | Service areas/regions (e.g., ["Brisbane North", "Gold Coast"])                                                                |
| **PREFERENCES**            |               |                                                                                                                               |
| `timezone`                 | TEXT          | User's timezone (e.g., "America/New_York")                                                                                    |
| `language`                 | TEXT          | Preferred language code (e.g., "en", "es")                                                                                    |
| `notification_preferences` | JSONB         | Notification settings (email, SMS, push)                                                                                      |
| `working_hours`            | JSONB         | Work schedule (e.g., `{"start": "09:00", "end": "17:00"}`)                                                                    |
| **AUDIT**                  |               |                                                                                                                               |
| `created_at`               | TIMESTAMPTZ   | Account creation timestamp                                                                                                    |
| `updated_at`               | TIMESTAMPTZ   | Auto-updated via trigger                                                                                                      |
| `last_active_at`           | TIMESTAMPTZ   | Last login/activity timestamp                                                                                                 |
| `last_login_ip`            | TEXT          | IP address of last login (for security auditing)                                                                              |
| `deleted_at`               | TIMESTAMPTZ   | Soft delete                                                                                                                   |

---

## profile_stats

All fields track performance metrics. 1:1 relationship with `profiles`.

| Field                     | Description                                                         |
| ------------------------- | ------------------------------------------------------------------- |
| `leads_assigned`          | Total leads assigned to user                                        |
| `leads_contacted`         | Leads that received initial contact (call/email/SMS)                |
| `leads_qualified`         | Leads that passed qualification (budget, authority, need, timeline) |
| `leads_converted`         | Leads converted to opportunities                                    |
| `leads_lost`              | Lost/unqualified/unresponsive leads                                 |
| `avg_lead_response_time`  | Average time to first response (INTERVAL type)                      |
| `calls_dials`             | Total outbound call attempts                                        |
| `calls_connected`         | Successfully connected calls                                        |
| `calls_voicemails`        | Calls that went to voicemail                                        |
| `calls_lost`              | Failed calls (wrong number, blocked)                                |
| `avg_call_duration`       | Average duration of connected calls                                 |
| `emails_sent`             | Emails successfully delivered                                       |
| `emails_opened`           | Emails opened by recipient (tracking enabled)                       |
| `emails_clicked`          | Emails with link clicks                                             |
| `emails_replies_received` | Emails that received a reply                                        |
| `emails_conversations`    | Email threads with 2+ back-and-forth exchanges                      |
| `sms_sent`                | SMS successfully delivered                                          |
| `sms_received`            | SMS replies from contacts                                           |
| `meetings_scheduled`      | Total meetings scheduled                                            |
| `meetings_completed`      | Meetings that actually happened                                     |
| `meetings_no_show`        | Contact didn't attend                                               |
| `proposals_sent`          | Proposals/quotes sent                                               |
| `proposals_accepted`      | Accepted by customer                                                |
| `tasks_completed`         | Tasks marked complete                                               |
| `tasks_overdue`           | Tasks past due date                                                 |
| `opportunities_won`       | Closed-won deals                                                    |
| `opportunities_lost`      | Closed-lost deals                                                   |
| `pipeline_value`          | Total value of active opportunities                                 |
| `revenue_generated`       | Actual revenue from won deals                                       |
| `avg_deal_size`           | Average value of won opportunities                                  |
| `win_rate`                | Calculated: `(won / (won + lost)) * 100`                            |
| `jobs_completed`          | Field service jobs completed                                        |
| `avg_job_rating`          | Average customer rating (1-5 stars)                                 |
| `tickets_resolved`        | Support tickets successfully resolved                               |
| `nps_score`               | Net Promoter Score (-100 to 100)                                    |

---

## companies

| Field             | Description                                                       |
| ----------------- | ----------------------------------------------------------------- |
| `id`              | Primary key                                                       |
| `organization_id` | Organization this company belongs to (multi-tenant FK)            |
| `name`            | Company/business name                                             |
| `industry`        | Industry sector (e.g., "Real Estate", "Construction")             |
| `website`         | Company website URL                                               |
| `email`           | Primary company email                                             |
| `location`        | City/region (e.g., "Brisbane, QLD")                               |
| `status`          | Relationship: `prospect` \| `customer` \| `partner` \| `inactive` |
| `employee_count`  | Employee range (e.g., "50-100", "500+")                           |
| `annual_revenue`  | Estimated annual revenue                                          |
| `created_by`      | User who created this company record                              |
| `created_at`      | Record creation timestamp                                         |
| `updated_at`      | Auto-updated via trigger                                          |
| `deleted_at`      | Soft delete                                                       |

---

## contacts

| Field             | Description                                     |
| ----------------- | ----------------------------------------------- |
| `id`              | Primary key                                     |
| `organization_id` | Organization (multi-tenant FK)                  |
| `first_name`      | Contact's first name                            |
| `last_name`       | Contact's last name                             |
| `email`           | Primary email (unique globally)                 |
| `company_id`      | Associated company (optional)                   |
| `job_title`       | Job title/role (e.g., "Project Manager", "CEO") |
| `type`            | Contact type: `lead` \| `customer` \| `partner` |
| `status`          | Contact status (e.g., "active", "inactive")     |
| `assigned_to`     | Assigned sales rep/CSR                          |
| `created_by`      | User who created this contact                   |
| `created_at`      | Record creation                                 |
| `updated_at`      | Auto-updated via trigger                        |
| `deleted_at`      | Soft delete                                     |

---

## addresses (Polymorphic)

| Field               | Description                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------ |
| `id`                | Primary key                                                                                |
| `parent_id`         | References profile/company/contact/opportunity ID                                          |
| `parent_type`       | Entity type: `profile` \| `company` \| `contact` \| `opportunity`                          |
| `label`             | Address label: `main` \| `service_location` \| `billing` \| `shipping` \| `home` \| `work` |
| `place_id`          | Google Places ID (for autocomplete/geocoding)                                              |
| `formatted_address` | Full address from Google Places                                                            |
| `latitude`          | GPS latitude for map markers                                                               |
| `longitude`         | GPS longitude for map markers                                                              |
| `plus_code`         | Google Plus Code (for areas without traditional addresses)                                 |
| `street_address`    | Street address line (e.g., "123 Main St")                                                  |
| `suburb`            | Suburb/neighborhood                                                                        |
| `postal_code`       | ZIP/postal code                                                                            |
| `city`              | City                                                                                       |
| `state`             | State/province                                                                             |
| `country`           | Country (default: "Australia")                                                             |
| `is_primary`        | Only ONE per parent can be `true` (enforced by unique index)                               |
| `created_at`        | Record creation                                                                            |
| `deleted_at`        | Soft delete                                                                                |

---

## phones (Polymorphic)

| Field         | Description                                        |
| ------------- | -------------------------------------------------- |
| `id`          | Primary key                                        |
| `parent_id`   | References profile/company/contact ID              |
| `parent_type` | Entity type: `profile` \| `company` \| `contact`   |
| `label`       | Phone label: `mobile` \| `work` \| `home` \| `fax` |
| `number`      | Phone number                                       |
| `is_primary`  | Only ONE per parent can be `true`                  |
| `created_at`  | Record creation                                    |
| `deleted_at`  | Soft delete                                        |

---

## opportunities

| Field                                    | Description                                                                     |
| ---------------------------------------- | ------------------------------------------------------------------------------- |
| `id`                                     | Primary key                                                                     |
| `organization_id`                        | Organization (multi-tenant)                                                     |
| `title`                                  | Opportunity title/description                                                   |
| `contact_id`                             | Primary contact                                                                 |
| `company_id`                             | Associated company                                                              |
| `value`                                  | Booked/quoted value                                                             |
| `actual_revenue`                         | Actual revenue (set when completed)                                             |
| `pipeline`                               | Stage: `leads` \| `contacted` \| `quoting` \| `booked` \| `completed` \| `lost` |
| `source`                                 | Lead source: `webform` \| `lead` \| `referral`                                  |
| `customer_satisfaction`                  | Post-completion: `happy` \| `unhappy`                                           |
| `loss_reason`                            | Reason for lost opportunity                                                     |
| `scheduled_date`                         | Scheduled service/meeting date                                                  |
| `completed_date`                         | Completion date                                                                 |
| `assigned_to`                            | Assigned CSR/sales rep                                                          |
| `technician_id`                          | Assigned technician/worker                                                      |
| `created_by`                             | User who created                                                                |
| `created_at`, `updated_at`, `deleted_at` | Standard audit fields                                                           |

---

## tasks

| Field                                    | Description                                                                                             |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `id`                                     | Primary key                                                                                             |
| `organization_id`                        | Organization                                                                                            |
| `parent_id`                              | Polymorphic FK (contact/company/opportunity/profile)                                                    |
| `parent_type`                            | Entity type: `contact` \| `company` \| `opportunity` \| `profile`                                       |
| `parent_task_id`                         | Parent task ID (for subtasks)                                                                           |
| `title`                                  | Task title                                                                                              |
| `description`                            | Task description                                                                                        |
| `status`                                 | Status: `Backlog` \| `To Do` \| `In Progress` \| `In Review` \| `Blocked` \| `Completed` \| `Cancelled` |
| `priority`                               | Priority: `Low` \| `Normal` \| `High` \| `Urgent`                                                       |
| `due_date`                               | Due date                                                                                                |
| `start_date`                             | Start date                                                                                              |
| `reminder_date`                          | Reminder date                                                                                           |
| `assigned_to`                            | Assigned user                                                                                           |
| `created_by`                             | Creator                                                                                                 |
| `tags`                                   | Array of tags for categorization                                                                        |
| `checklists`                             | JSONB: `[{"text": "...", "is_done": boolean}]`                                                          |
| `is_completed`                           | Boolean completion flag                                                                                 |
| `completed_at`                           | Completion timestamp                                                                                    |
| `created_at`, `updated_at`, `deleted_at` | Audit fields                                                                                            |

---

## notes

| Field                                    | Description                                                    |
| ---------------------------------------- | -------------------------------------------------------------- |
| `id`                                     | Primary key                                                    |
| `organization_id`                        | Organization                                                   |
| `parent_id`                              | Polymorphic FK                                                 |
| `parent_type`                            | `contact` \| `company` \| `opportunity` \| `profile` \| `task` |
| `title`                                  | Note title (optional)                                          |
| `content`                                | Note content (Markdown or rich text)                           |
| `created_by`                             | Author                                                         |
| `is_pinned`                              | Pin to top of list                                             |
| `is_private`                             | Private note (only visible to creator)                         |
| `tags`                                   | Array of tags                                                  |
| `attachments`                            | JSONB array of file metadata                                   |
| `created_at`, `updated_at`, `deleted_at` | Audit fields                                                   |

---

## comments

| Field                                    | Description                                            |
| ---------------------------------------- | ------------------------------------------------------ |
| `id`                                     | Primary key                                            |
| `organization_id`                        | Organization                                           |
| `parent_id`                              | References task/note ID                                |
| `parent_type`                            | `task` \| `note`                                       |
| `content`                                | Comment text                                           |
| `author_id`                              | Comment author                                         |
| `mentions`                               | Array of profile IDs mentioned (@username)             |
| `reactions`                              | JSONB: `{"👍": ["user1_id", "user2_id"], "❤️": [...]}` |
| `created_at`, `updated_at`, `deleted_at` | Audit fields                                           |

---

## quotes

| Field                                    | Description                                                                       |
| ---------------------------------------- | --------------------------------------------------------------------------------- |
| `id`                                     | Primary key                                                                       |
| `organization_id`                        | Organization                                                                      |
| `opportunity_id`                         | Associated opportunity                                                            |
| `contact_id`                             | Contact                                                                           |
| `company_id`                             | Company                                                                           |
| `quote_number`                           | Human-readable ID (e.g., "QT-1001")                                               |
| `title`                                  | Quote description                                                                 |
| `status`                                 | Status: `draft` \| `sent` \| `accepted` \| `rejected` \| `expired` \| `converted` |
| `total_amount`                           | Final calculated total                                                            |
| `tax_amount`                             | Tax amount                                                                        |
| `valid_until`                            | Expiry date                                                                       |
| `line_items`                             | JSONB: `[{"description", "quantity", "unit_price", "total"}]`                     |
| `notes`                                  | Internal or customer notes                                                        |
| `terms`                                  | Custom terms & conditions                                                         |
| `created_by`                             | Creator                                                                           |
| `created_at`, `updated_at`, `deleted_at` | Audit fields                                                                      |

---

## jobs

| Field                                    | Description                                                                     |
| ---------------------------------------- | ------------------------------------------------------------------------------- |
| `id`                                     | Primary key                                                                     |
| `organization_id`                        | Organization                                                                    |
| `opportunity_id`                         | Associated opportunity                                                          |
| `quote_id`                               | Link to accepted quote                                                          |
| `contact_id`                             | Contact                                                                         |
| `company_id`                             | Company                                                                         |
| `job_number`                             | Human-readable ID (e.g., "JB-2001")                                             |
| `status`                                 | Status: `scheduled` \| `dispatched` \| `on_field` \| `completed` \| `cancelled` |
| `scheduled_start`                        | Planned start time                                                              |
| `scheduled_end`                          | Planned end time                                                                |
| `actual_start`                           | Clock-in time                                                                   |
| `actual_end`                             | Clock-out time                                                                  |
| `technician_id`                          | Assigned technician                                                             |
| `address_id`                             | Where work is performed                                                         |
| `description`                            | Work to be performed                                                            |
| `service_notes`                          | Field technician notes                                                          |
| `completed_notes`                        | Final wrap-up notes                                                             |
| `labor_hours`                            | Calculated time spent                                                           |
| `material_cost`                          | Material costs                                                                  |
| `total_revenue`                          | Total revenue from this job                                                     |
| `is_invoiced`                            | Has invoice been generated?                                                     |
| `created_by`                             | Creator                                                                         |
| `created_at`, `updated_at`, `deleted_at` | Audit fields                                                                    |

---

## location_history (Partitioned)

| Field             | Description                                                  |
| ----------------- | ------------------------------------------------------------ |
| `id`              | Primary key (composite with `recorded_at`)                   |
| `profile_id`      | Technician/user being tracked                                |
| `organization_id` | Organization                                                 |
| `latitude`        | GPS latitude                                                 |
| `longitude`       | GPS longitude                                                |
| `accuracy`        | Horizontal accuracy in meters (filter if > 50m for bad data) |
| `altitude`        | Altitude in meters                                           |
| `speed`           | Travel speed in km/h                                         |
| `heading`         | Direction in degrees (0-360)                                 |
| `battery_level`   | Device battery percentage (to monitor phone death)           |
| `source`          | Source: `mobile_app` \| `vehicle_tracker` \| `manual`        |
| `recorded_at`     | GPS ping timestamp (partition key)                           |

**Partitioning:** Partitioned by month (`recorded_at`) for performance. New partitions must be created monthly.

---

## invoices

| Field                                    | Description                                                                    |
| ---------------------------------------- | ------------------------------------------------------------------------------ |
| `id`                                     | Primary key                                                                    |
| `organization_id`                        | Organization                                                                   |
| `job_id`                                 | Job being billed                                                               |
| `quote_id`                               | Reference to approved quote                                                    |
| `contact_id`                             | Contact                                                                        |
| `company_id`                             | Company                                                                        |
| `invoice_number`                         | Human-readable ID (e.g., "INV-3001")                                           |
| `title`                                  | Brief description                                                              |
| `status`                                 | Status: `draft` \| `sent` \| `paid` \| `partially_paid` \| `overdue` \| `void` |
| `subtotal_amount`                        | Subtotal                                                                       |
| `tax_amount`                             | Tax                                                                            |
| `total_amount`                           | Total                                                                          |
| `total_paid`                             | Amount paid so far                                                             |
| `balance_due`                            | Remaining balance                                                              |
| `currency`                               | Currency code (default: "AUD")                                                 |
| `issue_date`                             | Date invoice was issued                                                        |
| `due_date`                               | Payment due date                                                               |
| `paid_at`                                | Payment received timestamp                                                     |
| `line_items`                             | JSONB: `[{"description", "quantity", "rate", "total"}]`                        |
| **n8n SYNC**                             |                                                                                |
| `external_provider`                      | Accounting system: `Xero` \| `QuickBooks` \| `FreshBooks`                      |
| `external_id`                            | ID in external system                                                          |
| `external_url`                           | Link to invoice in external system                                             |
| `sync_status`                            | `pending` \| `synced` \| `failed`                                              |
| `last_sync_at`                           | Last sync timestamp                                                            |
| `sync_error_message`                     | API error details                                                              |
| `created_by`                             | Creator                                                                        |
| `created_at`, `updated_at`, `deleted_at` | Audit fields                                                                   |

---

## permissions (NO RLS)

| Field         | Description                                                     |
| ------------- | --------------------------------------------------------------- |
| `id`          | Primary key                                                     |
| `name`        | Permission name (e.g., `contacts:create`, `invoices:delete`)    |
| `description` | What this permission allows                                     |
| `category`    | Grouping: `Sales` \| `Admin` \| `Accounting` \| `Field Service` |
| `created_at`  | Creation timestamp                                              |

**RLS: NONE** - Readable by all authenticated users for permission checks.

---

## role_permissions (NO RLS)

| Field           | Description                                                        |
| --------------- | ------------------------------------------------------------------ |
| `id`            | Primary key                                                        |
| `role`          | Role name (matches `profiles.role` or `organization_members.role`) |
| `permission_id` | FK to `permissions`                                                |
| `created_at`    | Creation timestamp                                                 |

**RLS: NONE** - Readable by all authenticated users for permission checks.

---

## organization_members

| Field             | Description                                 |
| ----------------- | ------------------------------------------- |
| `id`              | Primary key                                 |
| `organization_id` | Organization                                |
| `profile_id`      | User/profile                                |
| `role`            | Role within this organization               |
| `status`          | Status: `active` \| `inactive` \| `invited` |
| `joined_at`       | When user joined this organization          |

**Unique constraint:** `(organization_id, profile_id)` - user can only have ONE membership per org.

---

## user_integrations

| Field                      | Description                                                        |
| -------------------------- | ------------------------------------------------------------------ |
| `id`                       | Primary key                                                        |
| `profile_id`               | User                                                               |
| `provider`                 | Service: `google` \| `outlook` \| `slack` \| `twilio`              |
| `provider_user_id`         | User's ID on external service                                      |
| `access_token`             | OAuth access token ⚠️ **SECURITY: Encrypt or use Supabase Vault**  |
| `refresh_token`            | OAuth refresh token ⚠️ **SECURITY: Encrypt or use Supabase Vault** |
| `expires_at`               | Token expiration                                                   |
| `scopes`                   | Array of authorized permissions                                    |
| `status`                   | Status: `active` \| `revoked` \| `expired`                         |
| `created_at`, `updated_at` | Audit fields                                                       |

---

## RLS Summary

**Tables WITH RLS (Organization-scoped):**

- All tables with `organization_id` field
- Users can only access data in organizations they're members of
- Policy checks `organization_members` table for membership

**Tables WITHOUT RLS (Public reference data):**

- `permissions` - Readable by all
- `role_permissions` - Readable by all

**Special RLS:**

- `profiles` - Users can see own profile + org members
- `user_integrations` - Users can only see own integrations
