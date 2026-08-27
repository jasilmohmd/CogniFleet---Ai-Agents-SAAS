# Database Schema Patterns

## Table Definition (`src/db/schema.ts`)
```typescript
import { pgTable, text, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core"
import { nanoid } from "nanoid"

export const tableName = pgTable("table_name", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  // columns...
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})
```

## Common Patterns

### Primary Key
```typescript
id: text("id").primaryKey().$defaultFn(() => nanoid())
```

### Foreign Key with Cascade
```typescript
userId: text("user_id")
  .notNull()
  .references(() => user.id, { onDelete: "cascade" })
```

### Enum (PostgreSQL)
```typescript
export const statusEnum = pgEnum("status_enum", ["value1", "value2"])
status: statusEnum("status").notNull().default("value1")
```

### Timestamps
```typescript
createdAt: timestamp("created_at").notNull().defaultNow()
updatedAt: timestamp("updated_at").notNull().defaultNow()
```

### Nullable Timestamp
```typescript
startedAt: timestamp("started_at")  // No notNull(), no default
```

## Current Tables

### user (Better Auth)
- id, name, email, emailVerified, image, createdAt, updatedAt

### session (Better Auth)
- id, expiresAt, token, createdAt, updatedAt, ipAddress, userAgent, userId

### account (Better Auth)
- id, accountId, providerId, userId, accessToken, refreshToken, idToken, expiresAt, scope, password, createdAt, updatedAt

### verification (Better Auth)
- id, identifier, value, expiresAt, createdAt, updatedAt

### agents
- id, name, userId (FK→user), instructions, createdAt, updatedAt

### meetings
- id, name, userId (FK→user), agentId (FK→agents), status (enum), startedAt, endedAt, transcriptUrl, recordingUrl, summary, createdAt, updatedAt

## Relations
- `user` → `session` (1:M, cascade)
- `user` → `account` (1:M, cascade)
- `user` → `agents` (1:M, cascade)
- `user` → `meetings` (1:M, cascade)
- `agents` → `meetings` (1:M, cascade)

## Drizzle Config (`drizzle.config.ts`)
```typescript
export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! }
})
```

## Client (`src/db/index.ts`)
```typescript
import { drizzle } from "drizzle-orm/neon-http"
export const db = drizzle(process.env.DATABASE_URL!)
```

## Migrations
```bash
npm run db:push    # Push schema changes to DB
npm run db:studio  # Visual schema editor
```