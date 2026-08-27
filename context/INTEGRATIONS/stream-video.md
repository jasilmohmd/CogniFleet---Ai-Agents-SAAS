# Stream Video Integration

## Setup
```typescript
// src/lib/stream-video.ts
import { StreamClient } from "@stream-io/node-sdk"

export const streamVideo = new StreamClient(
  process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY!,
  process.env.STREAM_VIDEO_SECRET_KEY!
)
```

## User Token Generation
```typescript
// Server: tRPC procedure
generateToken: protectedProcedure.mutation(async ({ ctx }) => {
  await streamVideo.upsertUsers([{
    id: ctx.auth.user.id,
    name: ctx.auth.user.name,
    role: "admin",
    image: avatarUrl
  }])

  const expirationTime = Math.floor(Date.now() / 1000) + 3600 // 1 hour
  const issuedAt = Math.floor(Date.now() / 1000) - 60

  return streamVideo.generateUserToken({
    user_id: ctx.auth.user.id,
    exp: expirationTime,
    validity_in_seconds: issuedAt,
  })
})
```

## Call Creation (on Meeting Create)
```typescript
const call = streamVideo.video.call("default", meetingId)
await call.create({
  data: {
    created_by_id: ctx.auth.user.id,
    custom: { meetingId, meetingName },
    settings_override: {
      transcription: { language: "en", mode: "auto-on", closed_caption_mode: "auto-on" },
      recording: { mode: "auto-on", quality: "1080p" },
    },
  },
})
```

## Agent as Participant
```typescript
await streamVideo.upsertUsers([{
  id: agent.id,
  name: agent.name,
  role: "user",
  image: generateAvatarUri({ seed: agent.name, variant: "botttsNeutral" }),
}])
```

## Client-Side Usage
```tsx
// CallProvider
const client = useMemo(() => StreamVideoClient.getInstance(apiKey, token), [token])
const call = client.call("default", meetingId)

await call.join({ create: true })
// call.state: participants, tracks, transcription, recording
```

## Key Features Enabled
- Auto transcription (English, auto-on)
- Closed captions (auto-on)
- Auto recording (1080p)
- Custom metadata on call

## Environment Variables
```
NEXT_PUBLIC_STREAM_VIDEO_API_KEY
STREAM_VIDEO_SECRET_KEY
```

## SDK Packages
- `@stream-io/node-sdk` - Server-side
- `@stream-io/video-react-sdk` - Client React components