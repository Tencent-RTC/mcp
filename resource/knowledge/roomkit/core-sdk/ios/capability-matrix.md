# AtomicX Core iOS capability matrix

This document defines the capability boundary for `knowledge/roomkit/core-sdk/ios/` in the MCP knowledge base.

**Decision rule**: if an iOS core document exists in this directory, the capability is treated as **supported**; if the document does not exist, it is treated as **unsupported** for iOS Core.

## Current coverage

Supported capability documents:
- `room-state.md`
- `room-participant-state.md`
- `call-user-to-room.md`
- `schedule-room.md`

Currently missing capability documents:
- `device-detection.md`
- `device-state.md`
- `free-beauty-panel.md`
- `room-chat.md`
- `room-view.md`
- `screen-share.md`
- `virtual-background.md`

## Capability matrix

| Capability | Vue Core | iOS Core | Alternative path |
| --- | --- | --- | --- |
| Room state management `room-state` | ✅ | ✅ | Use `room-state.md` directly |
| Participant state management `room-participant-state` | ✅ | ✅ | Use `room-participant-state.md` directly |
| In-room calling `call-user-to-room` | ✅ | ✅ | Use `call-user-to-room.md` directly |
| Scheduled meeting `schedule-room` | ✅ | ✅ | Use `schedule-room.md` directly |
| In-room chat `room-chat` | ✅ | ❌ Unsupported | Build with Chat / IM iOS SDK |
| Screen share `screen-share` | ✅ | ❌ Unsupported | Prefer iOS preset UI path |
| Virtual background `virtual-background` | ✅ | ❌ Unsupported | Prefer iOS preset UI path |
| Room main view `room-view` | ✅ | ❌ Unsupported | If you need full room page, use `RoomMainView` preset UI |
| Device detection `device-detection` | ✅ | ❌ Unsupported | No official iOS Core atomic path currently |
| Device state management `device-state` | ✅ | ❌ Unsupported | No official iOS Core atomic path currently |
| Basic beauty panel `free-beauty-panel` | ✅ | ❌ Unsupported | No official iOS Core atomic path currently |

## Answering policy

When users ask whether iOS AtomicX Core supports one of the ❌ capabilities above:
1. Answer **unsupported** first.
2. Explain this is an explicit **iOS Core capability boundary** in current docs, not “example not found”.
3. Do not output fabricated iOS Core API integration steps.
4. Only provide alternatives that are currently documented on iOS (for example `RoomMainView` preset UI). If no documented alternative exists, say so clearly.
