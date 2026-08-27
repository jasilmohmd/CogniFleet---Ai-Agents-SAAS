# Quick Reference

## Common Commands
```bash
npm run dev           # Start dev server
npm run build         # Production build
npm run lint          # ESLint
npm run db:push       # Push Drizzle schema to DB
npm run db:studio     # Drizzle Studio UI
npm run dev:webhook   # ngrok tunnel for webhooks
```

## Key File Paths
| Purpose | Path |
|---------|------|
| tRPC root router | `src/trpc/routers/_app.ts` |
| DB schema | `src/db/schema.ts` |
| Auth config | `src/lib/auth.ts` |
| Stream Video | `src/lib/stream-video.ts` |
| Stream Chat | `src/lib/stream-chat.ts` |
| Avatar utils | `src/lib/avatar.tsx` |
| Constants | `src/constants.ts` |

## tRPC Procedure Patterns
```typescript
// Protected mutation with input
create: protectedProcedure
  .input(insertSchema)
  .mutation(async ({ ctx, input }) => { ... })

// Protected query with input
getOne: protectedProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ ctx, input }) => { ... })

// Paginated list
getMany: protectedProcedure
  .input(z.object({
    page: z.number().default(DEFAULT_PAGE),
    pageSize: z.number().min(MIN).max(MAX).default(DEFAULT_PAGE_SIZE),
    search: z.string().nullish(),
    filter: z.enum([...]).nullish(),
  }))
  .query(async ({ ctx, input }) => { ... })
```

## Drizzle Query Patterns
```typescript
// Select with join
const data = await db
  .select({
    ...getTableColumns(table),
    relation: relatedTable,
    computed: sql`...`.as("alias"),
  })
  .from(table)
  .innerJoin(relatedTable, eq(table.fk, relatedTable.id))
  .where(and(eq(table.userId, ctx.auth.user.id), ...))
  .orderBy(desc(table.createdAt))
  .limit(pageSize)
  .offset((page - 1) * pageSize)

// Count for pagination
const [total] = await db
  .select({ count: count() })
  .from(table)
  .where(...)
```

## Zod Schema Pattern
```typescript
// Insert schema
export const insertSchema = z.object({
  field: z.string().min(1, { message: "Required" }),
})

// Update schema extends insert + id
export const updateSchema = insertSchema.extend({
  id: z.string().min(1, { message: "Id required" }),
})
```

## Type Inference
```typescript
import { inferRouterOutputs } from "@trpc/server"
import type { AppRouter } from "@/trpc/routers/_app"

export type EntityGetOne = inferRouterOutputs<AppRouter>["module"]["getOne"]
export type EntityGetMany = inferRouterOutputs<AppRouter>["module"]["getMany"]["items"]
```

## nuqs URL State
```typescript
import { createLoader, parseAsString, parseAsInteger, parseAsStringEnum } from "nuqs/server"

export const filtersSearchParams = {
  search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({ clearOnDefault: true }),
  status: parseAsStringEnum(Object.values(StatusEnum)),
  filterId: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
}

export const loadSearchParams = createLoader(filtersSearchParams)
// In Server Component: const params = await loadSearchParams()
// In Client Component: const [searchParams, setSearchParams] = useSearchParams(filtersSearchParams)
```

## Stream Video Token Generation
```typescript
// Server: generate user token
const token = streamVideo.generateUserToken({
  user_id: userId,
  exp: expirationTime,
  validity_in_seconds: issuedAt,
})

// Server: create call
const call = streamVideo.video.call("default", meetingId)
await call.create({
  data: {
    created_by_id: userId,
    custom: { meetingId, meetingName },
    settings_override: {
      transcription: { language: "en", mode: "auto-on" },
      recording: { mode: "auto-on", quality: "1080p" },
    },
  },
})
```

## Stream Chat Token
```typescript
const token = streamChat.createToken(userId)
await streamChat.upsertUser({ id: userId, role: "admin" })
```

## Avatar Generation
```typescript
generateAvatarUri({ seed: name, variant: "initials" })      // User initials
generateAvatarUri({ seed: name, variant: "botttsNeutral" }) // Bot avatar
```

## Common Gotchas
- **tRPC context**: `ctx.auth.user` available in protectedProcedure
- **Drizzle**: Always filter by `userId` for multi-tenant safety
- **Stream**: Upsert users before generating tokens
- **nuqs**: Use `withOptions({ clearOnDefault: true })` to clean URLs
- **Auth**: `headers()` from `next/headers` needed in tRPC context
- **Transcripts**: Stored as JSONL at `transcriptUrl`, parsed with `jsonl-parse-stringify`