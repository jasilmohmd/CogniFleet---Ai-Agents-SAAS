# Dashboard Module

## Purpose
Authenticated layout: sidebar navigation, navbar, command palette, user menu.

## Key Files
| File | Purpose |
|------|---------|
| `ui/components/dashboard-sidebar.tsx` | Collapsible sidebar with navigation |
| `ui/components/dashboard-navbar.tsx` | Top bar with search, theme toggle |
| `ui/components/dashboard-command.tsx` | Command palette (Cmd+K) |
| `ui/components/dashboard-user-button.tsx` | User avatar dropdown menu |

## Sidebar Navigation
| Section | Items |
|---------|-------|
| Primary | Meetings (VideoIcon), Agents (BotIcon) |
| Secondary | Upgrade (StarIcon) |

## Components
| Component | Purpose |
|-----------|---------|
| `DashboardSidebar` | Responsive sidebar with logo, nav groups, user button |
| `DashboardNavbar` | Top bar: menu trigger, search, theme toggle, notifications |
| `DashboardCommand` | Cmd+K palette for quick navigation/actions |
| `DashboardUserButton` | Avatar dropdown: profile, settings, sign out |

## Patterns
- All components client-side (`"use client"`)
- Uses Radix UI Sidebar, NavigationMenu, DropdownMenu, Avatar
- `usePathname` for active route highlighting
- `cn()` utility for conditional styling
- Theme switching via `next-themes`
- User button integrates with Better Auth sign out

## Layout Integration
```
app/layout.tsx
  → NuqsAdapter
  → TRPCReactProvider
  → html/body
    → Toaster
    → children (dashboard pages wrap with sidebar/navbar)
```

## Styling
- CSS variables for sidebar theming (`sidebar-accent`, `sidebar-accent-foreground`)
- Gradient hover states on nav items
- Responsive: collapses on mobile