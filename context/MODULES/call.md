# Call Module

## Purpose
Live video call UI with Stream Video SDK: lobby, active call, ended states.

## Key Files
| File | Purpose |
|------|---------|
| `ui/views/call-view.tsx` | Entry point - fetches meeting, routes to provider or ended state |
| `ui/components/call-provider.tsx` | Stream Video React SDK provider wrapper |
| `ui/components/call-ui.tsx` | Main call UI composition |
| `ui/components/call-lobby.tsx` | Pre-join lobby (camera/mic preview, join button) |
| `ui/components/call-active.tsx` | Active call UI (participants, controls, chat) |
| `ui/components/call-connect.tsx` | Connecting state |
| `ui/components/call-ended.tsx` | Post-call ended screen |

## Flow
```
CallView (server component)
  → Fetches meeting via tRPC (getOne)
  → If status === "completed": render ErrorState
  → Else: render CallProvider
    → CallProvider (client)
      → CallUI
        → CallLobby (not joined)
        → CallConnect (joining)
        → CallActive (joined)
        → CallEnded (call ended)
```

## tRPC Usage
- `meetings.getOne` - Fetches meeting data (server component)
- `meetings.generateToken` - Called by CallProvider for Stream token
- `meetings.generateChatToken` - Called by ChatProvider for chat token

## Components
| Component | State | Purpose |
|-----------|-------|---------|
| `CallView` | Server | Route guard, fetch meeting |
| `CallProvider` | Client | StreamVideoClient, Call context |
| `CallUI` | Client | Layout, state machine (lobby→active→ended) |
| `CallLobby` | Client | Device preview, join button |
| `CallActive` | Client | In-call UI (video grid, controls, chat sidebar) |
| `CallConnect` | Client | Loading during join |
| `CallEnded` | Client | Leave button, redirect |

## Stream Video Integration
- `streamVideo.video.call("default", meetingId)` - Call instance
- `call.join({ create: true })` - Join/create call
- `call.state` - Reactive state (participants, tracks, etc.)
- Transcription & recording auto-enabled via meeting create settings

## Patterns
- Server component for initial data fetch + auth check
- Client boundary at `CallProvider` for Stream SDK
- Error boundary for meeting not found/ended
- Meeting status check prevents joining completed calls