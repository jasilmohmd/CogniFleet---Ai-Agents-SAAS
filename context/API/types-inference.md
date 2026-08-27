# Type Inference Patterns

## Core Pattern
```typescript
import { inferRouterOutputs } from "@trpc/server"
import type { AppRouter } from "@/trpc/routers/_app"

// Single procedure output
export type MeetingGetOne = inferRouterOutputs<AppRouter>["meetings"]["getOne"]

// Nested output (pagination items)
export type MeetingGetMany = inferRouterOutputs<AppRouter>["meetings"]["getMany"]["items"]

// Agent types
export type AgentGetOne = inferRouterOutputs<AppRouter>["agents"]["getOne"]
export type AgentsGetMany = inferRouterOutputs<AppRouter>["agents"]["getMany"]["items"]
```

## Manual Enums/Types
```typescript
// Meeting status enum (matches DB enum)
export enum MeetingStatus {
  Upcoming = "upcoming",
  Active = "active",
  Completed = "completed",
  Processing = "processing",
  Cancelled = "cancelled",
}

// Stream transcript item shape
export type StreamTranscriptItem = {
  speaker_id: string
  type: string
  text: string
  start_ts: number
  stop_ts: number
}
```

## Usage in Components
```typescript
// Component props typed from inferred types
interface MeetingCardProps {
  meeting: MeetingGetMany[number]  // Array element type
}

// Hook return types
const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions(...))
// data type: { items: MeetingGetMany[], total: number, totalPages: number }
```

## Benefits
- Single source of truth: router defines shapes
- Automatic updates when router changes
- No manual type duplication
- Full IntelliSense support