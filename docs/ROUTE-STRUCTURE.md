# Expo CRM App — Route Structure

## Overview

This document outlines the complete route structure for the Expo CRM application using Expo Router file-based routing.

## Route Groups

### `(auth)` — Authentication
- `/sign-in` — Sign in screen
- `/sign-up` — Sign up screen

### `(tabs)` — Main Tab Navigation
- `/` (index) — Home tab (KPI cards, quick actions, activity feed)
- `/leads` — Leads list (redirects to CRM leads)
- `/contacts` — Contacts list (redirects to CRM contacts)
- `/tasks` — Tasks screen with filters
- `/settings` — Settings screen
- `/explore` — Explore tab (if needed)

### `(crm)` — CRM Data Management (Stack Navigation)
- `/leads` — Leads list screen
  - `/leads/[id]` — Lead detail screen
  - `/leads/add` — Add new lead form
- `/contacts` — Contacts list screen
  - `/contacts/[id]` — Contact detail screen
  - `/contacts/add` — Add new contact form

### `(dashboards)` — Dashboard Views (Stack Navigation)
- `/` (index) — Dashboard home (redirects to default dashboard)
- `/sales` — Sales dashboard (KPIs, pipeline, revenue metrics)
- `/users` — Users dashboard (user management, activity, roles)
- `/admin` — Admin dashboard (system settings, analytics, admin tools)

### `(modals)` — Modal Screens
- `/user-profile` — User profile modal

### Root Routes
- `/splash` — Splash screen
- `/welcome` — Welcome/onboarding screen
- `/modal` — Generic modal route
- `/+not-found` — 404 not found screen
- `/_error` — Error boundary screen

## File Structure

```
app/
├── _layout.tsx                    # Root layout with theme provider
├── _error.tsx                     # Error boundary
├── +not-found.tsx                 # 404 page
│
├── (auth)/
│   ├── sign-in.tsx
│   └── sign-up.tsx
│
├── (tabs)/
│   ├── _layout.tsx                # Tab navigator
│   ├── index.tsx                  # Home tab
│   ├── leads.tsx                  # Redirects to (crm)/leads
│   ├── contacts.tsx              # Redirects to (crm)/contacts
│   ├── tasks.tsx
│   ├── settings.tsx
│   └── explore.tsx
│
├── (crm)/
│   ├── _layout.tsx                # Stack navigator for CRM
│   ├── leads/
│   │   ├── index.tsx              # Leads list
│   │   ├── [id].tsx               # Lead detail
│   │   └── add.tsx                # Add lead
│   └── contacts/
│       ├── index.tsx              # Contacts list
│       ├── [id].tsx               # Contact detail
│       └── add.tsx                # Add contact
│
├── (dashboards)/
│   ├── _layout.tsx                # Stack navigator for dashboards
│   ├── index.tsx                  # Dashboard home (redirect)
│   ├── sales.tsx                  # Sales dashboard
│   ├── users.tsx                  # Users dashboard
│   └── admin.tsx                  # Admin dashboard
│
├── (modals)/
│   └── user-profile.tsx
│
├── splash.tsx
├── welcome.tsx
└── modal.tsx
```

## Navigation Patterns

### Deep Linking
- Use typed routes: `router.push('/(crm)/leads/[id]', { id: '123' })`
- Keep route strings centralized in route constants if needed

### Tab Navigation
- Tabs provide quick access to main sections
- Leads/Contacts tabs redirect to full CRM stack for detail views

### Dashboard Navigation
- Dashboards are overview/analytics screens
- Use shared `DashboardShell` component with config-driven widgets
- Each dashboard screen is thin and composes the template

### CRM Navigation
- Stack-based navigation for detail/edit flows
- Headers managed per-screen via Expo Router stack
- Add/edit forms are separate routes

## Source Code Structure

```
src/
├── components/
│   ├── themed/                    # ThemedView, ThemedText
│   ├── ui/                        # Generic UI components
│   ├── dashboard/                 # Dashboard building blocks
│   │   ├── DashboardShell.tsx    # Reusable template
│   │   ├── DashboardHeader.tsx
│   │   ├── DashboardGrid.tsx
│   │   ├── sidebar.tsx
│   │   ├── topbar.tsx
│   │   └── widgets/
│   │       ├── StatCard.tsx
│   │       ├── ChartCard.tsx
│   │       └── ActivityList.tsx
│   └── forms/                     # Form components
│
├── features/
│   ├── crm/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── store/                  # Feature-level Zustand
│   │   └── types.ts
│   └── dashboard/
│       ├── definitions/           # Dashboard configs
│       │   ├── sales.ts
│       │   ├── users.ts
│       │   ├── admin.ts
│       │   └── index.ts
│       ├── utils/
│       └── types.ts
│
├── store/                         # App-wide Zustand stores
├── hooks/                         # Shared hooks
├── lib/                           # Utilities (api client, formatters)
├── constants/                     # Theme, env
└── types/                         # Shared types
```

## Path Aliases

- `@/` → `./src/` (configured in tsconfig.json and babel.config.js)
- Use `@/components`, `@/features`, `@/store`, etc. for imports
