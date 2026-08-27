# Agents Module

## Purpose
AI Agent management: CRUD for agents with instructions, associated with meetings.

## Key Files
| File | Purpose |
|------|---------|
| `server/procedure.ts` | tRPC procedures (create, getOne, getMany, update, remove) |
| `schema.ts` | Zod schemas: `agentsInsertSchema`, `agentsUpdateSchema` |
| `types.ts` | Inferred types: `AgentGetOne`, `AgentsGetMany` |
| `params.ts` | nuqs parsers for URL filters (search, page) |
| `hooks/use-agents-filters.ts` | Client hook for filter state |
| `hooks/use-confirm.tsx` | Confirmation dialog hook |
| `ui/views/agents-view.tsx` | Main agents list page |
| `ui/views/agent-id-view.tsx` | Agent detail page |
| `ui/views/agent-id-view-header.tsx` | Agent header with actions |
| `ui/components/*.tsx` | Components (form, dialogs, columns, pagination, filters) |

## tRPC Procedures
| Procedure | Type | Input | Output |
|-----------|------|-------|--------|
| `create` | mutation | `agentsInsertSchema` | Created agent |
| `getOne` | query | `{ id: string }` | Agent + meetingCount (TODO: real count) |
| `getMany` | query | `{ page, pageSize, search }` | Paginated agents |
| `update` | mutation | `agentsUpdateSchema` | Updated agent |
| `remove` | mutation | `{ id: string }` | Removed agent |

## Database Schema (`agents` table)
| Column | Type | Notes |
|--------|------|-------|
| id | text (nanoid) | PK |
| name | text | Required |
| userId | text | FK → user, cascade |
| instructions | text | Required - AI prompt/instructions |
| createdAt/updatedAt | timestamp | Auto |

## UI Components
| Component | Purpose |
|-----------|---------|
| `AgentsView` | List page with search, pagination |
| `AgentForm` | Create/edit form |
| `NewAgentDialog` | Create agent dialog |
| `UpdateAgentDialog` | Edit agent dialog |
| `AgentsListHeader` | Title, create button |
| `AgentsSearchFilter` | Search input |
| `Columns` | Table column definitions |
| `DataPagination` | Pagination controls |

## Patterns
- All procedures protected (require auth)
- User isolation: `where(eq(agents.userId, ctx.auth.user.id))`
- Meeting count currently hardcoded (TODO: real count via join)
- Instructions stored as plain text for AI prompt
- Simple pagination with search filter

## Integration Points
- Referenced by `meetings.agentId` (FK)
- Agent joins in meetings `getOne`/`getMany` for display
- Stream Video upserts agent as call participant on meeting create