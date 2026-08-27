# Zod Schema Patterns

## Base Insert Schema
```typescript
// src/modules/meetings/schema.ts
export const meetingsInsertSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  agentId: z.string().min(1, { message: "Agent is required" }),
})
```

## Update Schema (Extends Insert + ID)
```typescript
export const meetingsUpdateSchema = meetingsInsertSchema.extend({
  id: z.string().min(1, { message: "Id is required" }),
})
```

## Agents Schema
```typescript
// src/modules/agents/schema.ts
export const agentsInsertSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  instructions: z.string().min(1, { message: "Instructions is required" }),
})

export const agentsUpdateSchema = agentsInsertSchema.extend({
  id: z.string().min(1, { message: "Id is required" }),
})
```

## Usage in tRPC
```typescript
create: protectedProcedure
  .input(meetingsInsertSchema)
  .mutation(async ({ ctx, input }) => { ... })

update: protectedProcedure
  .input(meetingsUpdateSchema)
  .mutation(async ({ ctx, input }) => { ... })
```

## Usage in Forms (React Hook Form)
```typescript
const form = useForm({
  resolver: zodResolver(meetingsInsertSchema),
  defaultValues: { name: "", agentId: "" }
})
```

## Validation Messages
- Custom error messages via `{ message: "..." }`
- Min length for required fields
- String type for all text inputs
- Nullish for optional filters

## Patterns
- Insert schema: required fields only
- Update schema: insert + required ID
- Co-located with module in `schema.ts`
- Exported for form reuse