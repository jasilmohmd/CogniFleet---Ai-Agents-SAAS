# tRPC Patterns

## Router Structure
```
src/trpc/
├── init.ts              # Context, procedure helpers
├── routers/
│   └── _app.ts          # Root router combining modules
├── client.tsx           # Client-side tRPC hooks
├── server.tsx           # Server-side caller factory
└── query-client.ts      # TanStack Query client
```

## Context Creation (`init.ts`)
```typescript
export const createTRPCContext = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() })
  return { userId: session?.user?.id ?? 'user_123' } // fallback for dev
})
```

## Procedure Helpers
| Helper | Purpose |
|--------|---------|
| `createTRPCRouter` | Router factory |
| `createCallerFactory` | Server-side caller |
| `baseProcedure` | Public procedure |
| `protectedProcedure` | Requires valid session |

## Protected Procedure Pattern
```typescript
export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new TRPCError({ code: "UNAUTHORIZED" })
  return next({ ctx: { ...ctx, auth: session } })
})
```

## Module Router Pattern
Each module exports its router:
```typescript
// src/modules/meetings/server/procedure.ts
export const meetingsRouter = createTRPCRouter({ ... })
```

Root router combines them:
```typescript
// src/trpc/routers/_app.ts
export const appRouter = createTRPCRouter({
  agents: agentsRouter,
  meetings: meetingsRouter,
})
export type AppRouter = typeof appRouter
```

## Client Usage
```typescript
// Server Component
const caller = createCallerFactory(appRouter)(await createTRPCContext())
const data = await caller.meetings.getMany({ ... })

// Client Component
const trpc = useTRPC()
const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({ ... }))
```

## Error Handling
```typescript
throw new TRPCError({
  code: "NOT_FOUND" | "UNAUTHORIZED" | "BAD_REQUEST" | "INTERNAL_SERVER_ERROR",
  message: "Human readable message"
})
```

## Input Validation
- All inputs validated via Zod schemas
- Schemas defined in module `schema.ts`
- `.input(zodSchema)` on procedure

## Type Inference
```typescript
import { inferRouterOutputs } from "@trpc/server"
import type { AppRouter } from "@/trpc/routers/_app"

type MeetingGetOne = inferRouterOutputs<AppRouter>["meetings"]["getOne"]
```