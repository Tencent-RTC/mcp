---
title: "How to Display Call Messages When Integrating TUICallKit with a UI-less Chat SDK Project（TUICallKit 通话消息上屏 / 通话信令字段含义）"
product: call
frameworks: [react, vue, miniprogram, android, ios, flutter, uni-app, web]
scope: platform_common
tags: [TUICallKit, call-message, custom message, actionType, cmd, call_end, call message rendering]
version_range: ">=2.0.0"
---

# How to Display Audio/Video Call Messages When Integrating TUICallKit with a UI-less Chat SDK Project

## 1. Key Takeaways

- Call messages are custom messages sent by the backend via the Chat REST API during TUICallKit calls. Each platform can retrieve them through the Chat SDK's message-received event or by pulling message history.
- Real-time call states (ringing, answering, hanging up) are handled by TUICallKit event listeners and do not rely on Chat messages.
- Use `actionType` to determine the call result type (hang up / cancel / reject / timeout) and `cmd` to distinguish voice / video / busy.
- Call duration is obtained from the `call_end` field, in seconds.

## 2. Field / API Reference

| Field / API | Purpose | Notes |
|---|---|---|
| `actionType` | Call event type | 1=initiate/hang up, 2=cancel, 3=answer, 4=reject, 5=timeout |
| `cmd` | Call command subtype | `videoCall` video call, `audioCall` voice call, `hangup` hang up, `line_busy` busy |
| `call_end` | Call duration | Present when `actionType=1` and `cmd=hangup`, in seconds |
| `MESSAGE_RECEIVED` | Message received event | Unified Chat SDK event that includes call custom messages |
| `getMessageList` | Pull message history | Called when entering a conversation; call messages are included in the returned list |

### actionType and cmd Mapping

| Scenario | actionType | cmd | Notes |
|---|---|---|---|
| Initiate call | 1 | `videoCall` or `audioCall` | Sent by caller |
| Answered | 3 | — | Triggered after callee answers |
| Call ended | 1 | `hangup` | One party hung up; `call_end` contains duration |
| Call cancelled | 2 | — | Caller cancelled before answer |
| Call rejected | 4 | — | Callee actively rejected |
| Remote busy | 4 | `line_busy` | Callee is already in a call |
| Timeout (no answer) | 5 | — | Callee did not answer within the time limit |

## 3. Mechanism & Sequence

Caller initiates a call -> TUICallKit establishes the call connection via a signaling channel (not Chat messages) -> during the call, each state change (cancel / answer / reject / timeout / hang up) triggers the TUICallKit backend to send a custom message to the Chat SDK via REST API -> both parties receive the message through `MESSAGE_RECEIVED` -> parse `actionType` and `cmd` to identify the event type and update the UI.

The call process itself (initiate, answer, cancel, reject, timeout) does not rely on Chat custom messages for notification; Chat messages are solely used to display call records in the conversation after the call ends.

## 4. Standard Usage

1. Retrieve the call custom messages sent by the backend via the Chat SDK (listen to the message-received event or pull message history; the API name varies by platform but the semantics are the same).
2. Read `message.actionType` and `message.cmd` to determine the call event type.
3. For hang-up messages (`actionType=1, cmd=hangup`), read `message.call_end` to display the call duration.
4. Other `actionType` values indicate why the call was not connected (cancel / reject / busy / timeout); update the UI display accordingly.

## 5. Expected Results

- After each call state change, a call custom message can be received via the Chat SDK.
- `actionType` and `cmd` correctly reflect the call state change.
- The `call_end` value accurately reflects the actual call duration.

## 6. Common Pitfalls

- Pitfall 1: Treating call messages as generic custom messages without reading `actionType` to distinguish states.
- Pitfall 2: Only handling `MESSAGE_RECEIVED` without processing offline call messages pulled via `getMessageList`.
- Pitfall 3: Calculating call duration from the `timestamp` difference between messages (should read directly from the `call_end` field).
- Pitfall 4: Not handling the `line_busy` scenario, causing busy to be treated as a normal rejection.

## 7. Problem Definition (retrieval hint)

When integrating TUICallKit with a UI-less Chat SDK project, how to retrieve and render audio/video call messages (initiate / answer / hang up / cancel / reject / timeout / busy) via the Chat SDK.

## 8. Alternative Queries (retrieval recall)

- How to parse TUICallKit call messages?
- What do the various `actionType` values mean?
- How to get the call duration after a call ends?
- How to distinguish between initiate and hang up in `MESSAGE_RECEIVED` call messages?
- How to determine if the callee is busy?
- Is call message parsing the same on mini programs and Web?
