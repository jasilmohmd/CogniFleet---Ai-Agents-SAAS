# Code Conventions & Patterns

## TypeScript
- Strict mode enabled (`strict: true` in tsconfig)
- Path aliases: `@/*` → `./src/*`
- No explicit `any` - use `unknown` or proper types
- Inferred types preferred over manual annotations

## File Naming
| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `MeetingForm.tsx` |
| Hooks | camelCase + `use` prefix | `useMeetingsFilters.ts` |
| Utilities | camelCase | `utils.ts` |
| Schemas | camelCase + `Schema` suffix | `meetingsInsertSchema.ts` |
| Types | PascalCase | `MeetingStatus` |
| Pages/Views | kebab-case + `-view` suffix | `meeting-id-view.tsx` |

## Module Structure
```
module-name/
├── server/
│   └── procedure.ts        # tRPC router procedures
├── ui/
│   ├── components/         # React components
│   └── views/              # Page-level components
├── hooks/                  # Custom React hooks
├── schema.ts               # Zod validation schemas
├── types.ts                # Inferred + manual types
├── params.ts               # nuqs URL search param parsers
└── constants.ts            # Module-specific constants (if any)
```

## tRPC Patterns
```typescript
// Procedure definition
export const moduleRouter = createTRPCRouter({
  procedureName: protectedProcedure
    .input(zodSchema)
    .mutation(async ({ ctx, input }) => { ... })
    .query(async ({ ctx, input }) => { ... })
})

// Input validation: Zod schemas in module/schema.ts
// Types: inferred via inferRouterOutputs<AppRouter>
```

## Database (Drizzle)
- Table names: plural, lowercase (`meetings`, `agents`)
- Columns: snake_case (`createdAt`, `userId`)
- Primary keys: `text` + `nanoid()` default
- Enums: `pgEnum` for status fields
- Relations: explicit `.references()` with cascade delete
- Timestamps: `defaultNow()` for created/updated

## React Components
- `"use client"` directive at top for client components
- Radix UI primitives + Tailwind for styling
- `cn()` utility for className merging (clsx + tailwind-merge)
- Compound components for complex UI (Sidebar, Dialog, etc.)
- Forward refs where needed

## State Management
| Scope | Tool |
|-------|------|
| Server state | TanStack Query (via tRPC) |
| URL state | nuqs (parseAsString, parseAsInteger, parseAsStringEnum) |
| Local UI state | React useState/useReducer |
| Form state | React Hook Form + Zod resolver |

## Forms
```typescript
const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: { ... }
})
```

## Styling
- Tailwind CSS 4 (CSS-first config)
- CSS variables for theming (see `globals.css`)
- `cn()` for conditional classes
- Radix className props for customization

## Error Handling
- tRPC: `TRPCError` with codes (NOT_FOUND, UNAUTHORIZED, BAD_REQUEST)
- React: `react-error-boundary` for UI errors
- Toasts: `sonner` for user notifications

## Imports
- Absolute imports via `@/*` alias
- Group: external → internal → relative
- Type-only imports: `import type { ... }`