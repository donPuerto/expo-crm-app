# Mobile CRM Structure & Reuse

## Navigation model

- Tabs: Home, Leads, Contacts, Tasks, More/Settings
- Stack per tab for detail/edit flows; keep headers per-screen via Expo Router stack
- Deep links use typed routes; keep route strings centralized

## Layout guidance (mobile-first)

- Hide sidebar on mobile; rely on tab bar and per-screen headers
- Topbar is tablet/desktop only; off by default (`showTopbar=false` in DashboardWrapper)
- Use `DashboardWrapper` for shared background/gaps; pass `showTopbar` only where needed
- Keep safe-area padding in screens; avoid nesting multiple scroll views

## Page building blocks

- Home: KPI cards, quick actions, recent activity feed, upcoming tasks list
- Leads: search/filter bar, lead list item (name, stage, value, updated), detail with stage pill and timeline, FAB for add
- Contacts: search bar, contact list item (name, company, title), detail with primary actions (call/message/email) and related records
- Tasks: segmented control (Today/Upcoming/Overdue), task list item with status toggle, detail sheet for notes/due/reschedule
- Settings: profile summary, notification toggles, theme picker

## Reusable components

- Header actions: screen-level action bar (search/filter/add) instead of a global topbar on mobile
- Lists: item primitives for Lead, Contact, Task with consistent spacing/typography
- Badges/Pills: status and stage indicators
- Cards: KPI card and activity card
- Controls: filter chips, segmented control, search input

## State and scalability

- Keep state per-screen; lift shared filters to context only when multiple screens need them
- Use typed routes and path aliases (`@/*`) for consistency
- Keep theming via `ThemedView`/`ThemedText`; avoid inline colors
- Prefer composition: screens assemble small primitives rather than duplicating layout
