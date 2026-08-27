# DiceBear Avatar Integration

## Setup
```typescript
// src/lib/avatar.tsx
import { createAvatar } from "@dicebear/core"
import { initials, botttsNeutral } from "@dicebear/collection"

interface Props {
  seed: string
  variant: "botttsNeutral" | "initials"
}

export const generateAvatarUri = ({ seed, variant }: Props) => {
  let avatar
  if (variant === "botttsNeutral") {
    avatar = createAvatar(botttsNeutral, { seed })
  } else {
    avatar = createAvatar(initials, { seed, fontWeight: 500, fontSize: 42 })
  }
  return avatar.toDataUri()
}
```

## Variants

### `initials` (Users)
- Generates initials from name
- Circular with background color
- Config: `fontWeight: 500, fontSize: 42`
- Used for: User avatars in transcript, sidebar, chat

### `botttsNeutral` (Agents/Bots)
- Generates robot-style avatar
- Consistent per seed (name)
- Used for: Agent avatars in transcript, call participants, agents list

## Usage
```typescript
// User avatar
generateAvatarUri({ seed: user.name, variant: "initials" })

// Agent avatar
generateAvatarUri({ seed: agent.name, variant: "botttsNeutral" })

// Fallback for unknown
generateAvatarUri({ seed: "Unknown", variant: "initials" })
```

## Return Value
- Data URI (`data:image/svg+xml;base64,...`)
- Directly usable in `<img src={uri} />` or `style={{ backgroundImage: `url(${uri})` }}`

## Packages
- `@dicebear/core` - Core engine
- `@dicebear/collection` - Avatar styles (initials, botttsNeutral, etc.)

## Patterns
- Deterministic: Same seed = same avatar
- No external storage needed
- Fallback for missing user.image
- Used in transcript speaker enrichment