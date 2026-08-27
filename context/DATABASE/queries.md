# Common Query Patterns

## Select with Join + Computed Column
```typescript
const data = await db
  .select({
    ...getTableColumns(meetings),
    agent: agents,
    duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as("duration"),
  })
  .from(meetings)
  .innerJoin(agents, eq(meetings.agentId, agents.id))
  .where(and(eq(meetings.userId, ctx.auth.user.id), ...))
  .orderBy(desc(meetings.createdAt), desc(meetings.id))
  .limit(pageSize)
  .offset((page - 1) * pageSize)
```

## Count for Pagination
```typescript
const [total] = await db
  .select({ count: count() })
  .from(meetings)
  .innerJoin(agents, eq(meetings.agentId, agents.id))
  .where(and(eq(meetings.userId, ctx.auth.user.id), ...))
```

## Filter Conditions
```typescript
const conditions = and(
  eq(table.userId, ctx.auth.user.id),
  search ? ilike(table.name, `%${search}%`) : undefined,
  status ? eq(table.status, status) : undefined,
  filterId ? eq(table.filterId, filterId) : undefined,
)
```

## Insert with Returning
```typescript
const [created] = await db
  .insert(table)
  .values({ ...input, userId: ctx.auth.user.id })
  .returning()
```

## Update with Returning
```typescript
const [updated] = await db
  .update(table)
  .set(input)
  .where(and(eq(table.id, input.id), eq(table.userId, ctx.auth.user.id)))
  .returning()
```

## Delete with Returning
```typescript
const [deleted] = await db
  .delete(table)
  .where(and(eq(table.id, input.id), eq(table.userId, ctx.auth.user.id)))
  .returning()
```

## Get Single by ID + User
```typescript
const [item] = await db
  .select()
  .from(table)
  .where(and(eq(table.id, id), eq(table.userId, ctx.auth.user.id)))
```

## Speaker Enrichment (Transcript)
```typescript
const speakerIds = [...new Set(transcript.map(t => t.speaker_id))]

const userSpeakers = await db
  .select()
  .from(user)
  .where(inArray(user.id, speakerIds))

const agentSpeakers = await db
  .select()
  .from(agents)
  .where(inArray(agents.id, speakerIds))
```

## Key Imports
```typescript
import { and, count, desc, eq, getTableColumns, ilike, inArray, sql } from "drizzle-orm"
```

## Patterns Summary
| Operation | Pattern |
|-----------|---------|
| List + pagination | select + join + where + orderBy + limit/offset |
| Count | select({ count: count() }) + where |
| Single by ID | select + where (id + userId) |
| Create | insert + values + returning |
| Update | update + set + where (id + userId) + returning |
| Delete | delete + where (id + userId) + returning |
| Multi-tenant safety | Always include `eq(table.userId, ctx.auth.user.id)` |