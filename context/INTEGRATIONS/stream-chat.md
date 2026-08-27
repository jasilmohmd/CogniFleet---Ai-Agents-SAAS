# Stream Chat Integration

## Setup
```typescript
// src/lib/stream-chat.ts
import { StreamChat } from "stream-chat"

export const streamChat = StreamChat.getInstance(
  process.env.NEXT_PUBLIC_STREAM_CHAT_API_KEY!,
  process.env.STREAM_CHAT_SECRET_KEY!
)
```

## User Token Generation
```typescript
// Server: tRPC procedure
generateChatToken: protectedProcedure.mutation(async ({ ctx }) => {
  const token = streamChat.createToken(ctx.auth.user.id)
  await streamChat.upsertUser({
    id: ctx.auth.user.id,
    role: "admin",
  })
  return token
})
```

## Client-Side Usage
```tsx
// ChatProvider
const client = useMemo(() => StreamChat.getInstance(apiKey, token), [token])
await client.connectUser({ id: userId, name, image }, token)

// Channel
const channel = client.channel("messaging", meetingId, {
  name: meetingName,
  members: [userId, agentId]
})
await channel.watch()

// Send/Receive
channel.sendMessage({ text: "Hello" })
channel.on("message.new", (event) => { ... })
```

## Meeting Chat Channel
- Channel type: `"messaging"`
- Channel ID: `meetingId`
- Members: User + Agent
- Real-time messages during call

## Environment Variables
```
NEXT_PUBLIC_STREAM_CHAT_API_KEY
STREAM_CHAT_SECRET_KEY
```

## SDK Packages
- `stream-chat` - Core client
- `stream-chat-react` - React components (MessageList, MessageInput, ChannelList)