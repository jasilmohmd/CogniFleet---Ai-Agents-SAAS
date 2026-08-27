# CogniFleet Architecture Overview

## System Purpose
AI Agent-powered video meeting platform with real-time transcription, chat, and agent-assisted meetings.

## Tech Stack
| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5, React 19 |
| API | tRPC 11 (type-safe RPC) |
| Database | PostgreSQL + Drizzle ORM |
| Auth | Better Auth (email/password + OAuth) |
| Video | Stream Video SDK |
| Chat | Stream Chat SDK |
| UI | Radix UI + Tailwind CSS 4 |
| State | TanStack Query (React Query) + nuqs (URL state) |
| Forms | React Hook Form + Zod |
| Avatars | DiceBear |

## Module Map
```
src/
├── app/                    # Next.js App Router pages & layouts
├── components/ui/          # Shared Radix-based UI components (shadcn/ui style)
├── db/                     # Drizzle schema & client
├── lib/                    # Shared utilities (auth, stream, avatar)
├── modules/                # Feature modules
│   ├── meetings/           # Core meeting management
│   ├── agents/             # AI agent CRUD
│   ├── call/               # Live video call UI
│   ├── auth/               # Sign in/up views
│   ├── dashboard/          # Dashboard layout & navigation
│   └── home/               # Landing page
├── trpc/                   # tRPC setup, routers, client
└── hooks/                  # Shared hooks
```

## Data Flow
1. **Auth**: Better Auth → session cookie → tRPC protectedProcedure
2. **API**: Client → tRPC → protectedProcedure → Drizzle → PostgreSQL
3. **Video/Chat**: tRPC procedures → Stream SDK tokens → Client connects to Stream
4. **Real-time**: Stream handles WebRTC, transcription, recording
5. **Post-meeting**: Transcripts stored in Stream → fetched via tRPC → parsed JSONL

## Key Conventions
- Module-based organization: `server/`, `ui/`, `hooks/`, `types.ts`, `schema.ts`, `params.ts`
- tRPC routers per module, combined in `src/trpc/routers/_app.ts`
- Zod schemas for input validation (insert/update)
- Types inferred from tRPC router outputs via `inferRouterOutputs`
- URL state managed with nuqs parsers
- Protected procedures require valid session