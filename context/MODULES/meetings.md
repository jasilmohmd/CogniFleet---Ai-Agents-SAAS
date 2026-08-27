# Meetings Module

## Purpose
Core meeting management: CRUD, video calls, transcripts, chat, status tracking.

## Key Files
| File | Purpose |
|------|---------|
| `server/procedure.ts` | tRPC procedures (create, getOne, getMany, update, remove, generateToken, generateChatToken, getTranscript) |
| `schema.ts` | Zod schemas: `meetingsInsertSchema`, `meetingsUpdateSchema` |
| `types.ts` | Inferred types: `MeetingGetOne`, `MeetingGetMany`, `MeetingStatus` enum, `StreamTranscriptItem` |
| `params.ts` | nuqs parsers for URL filters (search, page, status, agentId) |
| `hooks/use-meetings-filters.ts` | Client hook for filter state |
| `ui/views/meetings-view.tsx` | Main meetings list page |
| `ui/views/meeting-id-view.tsx` | Meeting detail page |
| `ui/views/meeting-id-view-header.tsx` | Meeting header with actions |
| `ui/components/*.tsx` | 15+ components (states, forms, transcript, chat, filters) |

## tRPC Procedures
| Procedure | Type | Input | Output |
|-----------|------|-------|--------|
| `create` | mutation | `meetingsInsertSchema` | Created meeting |
| `getOne` | query | `{ id: string }` | Meeting + agent + duration |
| `getMany` | query | `{ page, pageSize, search, agentId, status }` | Paginated meetings |
| `update` | mutation | `meetingsUpdateSchema` | Updated meeting |
| `remove` | mutation | `{ id: string }` | Removed meeting |
| `generateToken` | mutation | - | Stream Video user token |
| `generateChatToken` | mutation | - | Stream Chat user token |
| `getTranscript` | query | `{ id: string }` | Transcript items with speaker info |

## Database Schema (`meetings` table)
| Column | Type | Notes |
|--------|------|-------|
| id | text (nanoid) | PK |
| name | text | Required |
| userId | text | FK → user, cascade |
| agentId | text | FK → agents, cascade |
| status | enum | upcoming/active/completed/processing/cancelled |
| startedAt | timestamp | Nullable |
| endedAt | timestamp | Nullable |
| transcriptUrl | text | Stream transcript URL |
| recordingUrl | text | Stream recording URL |
| summary | text | AI-generated summary |
| createdAt/updatedAt | timestamp | Auto |

## Status Flow
```
upcoming → active → completed → processing → (done)
                    ↘ cancelled
```

## UI Components
| Component | Purpose |
|-----------|---------|
| `MeetingsView` | List page with filters, pagination |
| `MeetingForm` | Create/edit dialog form |
| `NewMeetingDialog` | Create meeting dialog |
| `UpdateMeetingDialog` | Edit meeting dialog |
| `MeetingsListHeader` | Title, create button |
| `MeetingsSearchFilter` | Search input |
| `StatusFilter` | Status dropdown filter |
| `AgentIdFilter` | Agent dropdown filter |
| `Columns` | Table column definitions |
| `UpcomingState` | Empty/loading state for upcoming |
| `ActiveState` | Active meeting indicator |
| `CompletedState` | Completed meeting display |
| `ProcessingState` | Processing indicator |
| `CancelledState` | Cancelled display |
| `Transcript` | Transcript viewer with speakers |
| `ChatUI` / `ChatProvider` | In-meeting chat |

## Integrations
- **Stream Video**: Call creation, tokens, transcription, recording
- **Stream Chat**: In-meeting chat, tokens
- **DiceBear**: Speaker avatars in transcript

## Hooks
- `useMeetingsFilters` - Manages filter state via nuqs

## Patterns
- All procedures protected (require auth)
- User isolation: `where(eq(meetings.userId, ctx.auth.user.id))`
- Join with agents for display data
- Duration computed via SQL: `EXTRACT(EPOCH FROM (ended_at - started_at))`
- Transcript parsing: fetch JSONL → parse → enrich with speaker avatars