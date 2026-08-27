# State Management Patterns

## Server State: TanStack Query (React Query)
- Integrated with tRPC via `@trpc/tanstack-react-query`
- Query keys auto-generated from tRPC procedures
- `useSuspenseQuery` for blocking data fetching
- `useQuery` for non-blocking
- `useMutation` for mutations
- Cache invalidation via `queryClient.invalidateQueries()`

```tsx
const trpc = useTRPC()
const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({ page: 1 }))
const mutation = trpc.meetings.create.useMutation({
  onSuccess: () => queryClient.invalidateQueries(trpc.meetings.getMany.queryKey())
})
```

## URL State: nuqs
- Type-safe search parameter parsing
- Server & client compatible
- `parseAsString`, `parseAsInteger`, `parseAsStringEnum`, `parseAsBoolean`
- `withOptions({ clearOnDefault: true })` removes param when default

```tsx
// Server Component
const params = await loadSearchParams()
// params: { search: string, page: number, status: MeetingStatus, agentId: string }

// Client Component
const [searchParams, setSearchParams] = useSearchParams(filtersSearchParams)
```

### Parser Types
| Parser | Use Case |
|--------|----------|
| `parseAsString` | Search, IDs |
| `parseAsInteger` | Page numbers |
| `parseAsStringEnum` | Status, filters with fixed values |
| `parseAsBoolean` | Toggles |

## Local UI State: React Hooks
- `useState` - Simple toggles, form inputs
- `useReducer` - Complex state machines (call states)
- `useRef` - DOM refs, mutable values
- `useContext` - Theme, auth (minimal)

## Form State: React Hook Form
- `useForm` - Form instance
- `zodResolver` - Zod schema validation
- `defaultValues` - Initial values
- `formState.isSubmitting` - Loading state
- `watch` - Field subscriptions
- `setValue` - Programmatic updates

## Provider Pattern
```tsx
// TRPC + Query Client
<TRPCReactProvider>
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
</TRPCReactProvider>

// nuqs Adapter
<NuqsAdapter>
  {children}
</NuqsAdapter>

// Theme
<ThemeProvider attribute="class" defaultTheme="system">
  {children}
</ThemeProvider>
```

## State Flow Summary
| Layer | Tool | Scope |
|-------|------|-------|
| Server data | TanStack Query + tRPC | Global, cached, sync with server |
| URL params | nuqs | Shareable, bookmarkable, SSR-compatible |
| Form data | React Hook Form | Local to form, validated |
| UI state | useState/useReducer | Component-scoped |
| Theme | next-themes + Context | Global, persisted |