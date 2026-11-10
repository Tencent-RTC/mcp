---
title: "TUICallEngine Call Invitation Receiving and Initiating Flow（TUICallEngine 发起通话的流程）"
product: call
frameworks: [web, miniprogram]
scope: platform_common
tags: [TUICallEngine, ON_CALL_RECEIVED, calls, accept, reject, call invitation, call-engine-lite, userData, callMediaType]
version_range: ">=4.0.0"
---

# TUICallEngine Call Invitation Receiving and Initiating Flow

## 1. Key Takeaways

- To receive call invitations, listen only to `TUICallEvent.ON_CALL_RECEIVED`. **Do not listen to the Chat SDK's `MESSAGE_RECEIVED` and parse call invitations manually.**
- To initiate a call, use `TUICallEngine.calls()` with `userIDList` (array) and `type` (media type) in the parameters.
- After receiving an invitation, call `accept()` to answer or `reject()` to decline. Extension data is passed via the `userData` string.
- The Web and mini program APIs are identical; only the package name differs (Web: `@trtc/call-engine-lite-js`, Mini Program: `@trtc/call-engine-lite-wx`).

## 2. Field / API Reference

| Field / API | Purpose | Notes |
|---|---|---|
| `TUICallEvent.ON_CALL_RECEIVED` | Receive call invitation event | Triggered when the callee receives an incoming call; do not parse from Chat custom messages |
| `calls({userIDList, type, ...})` | Initiate a call | Called by the caller; unified entry for one-on-one and group calls |
| `accept()` | Answer the call | Called by the callee after receiving an invitation |
| `reject()` | Reject the call | Called by the callee after receiving an invitation |
| `userData` | Custom extension data | A string passed by the caller; the callee reads it from the `ON_CALL_RECEIVED` event |
| `callMediaType` | Call media type | Carried in the `ON_CALL_RECEIVED` event: 1=voice, 2=video |
| `inviteID` | Invitation ID | Identifies a single call invitation, used to correlate subsequent events |
| `callId` | Call ID | Unique identifier for this call |
| `callRole` | Role | Caller (`call`) / Callee (`called`) |

### ON_CALL_RECEIVED Event Fields

| Parameter | Type | Description |
|---|---|---|
| callerId | String | The inviter |
| calleeIdList | Array\<String\> | Other users also invited |
| isFromGroup | Boolean | Whether it is a group call |
| inviteData | Object | Call data |
| inviteID | String | Invitation ID |
| userData | String | Extension field — custom data passed by the caller |
| callId | String | Unique ID for this call |
| roomID | Number | Audio/video room ID |
| callMediaType | Number | Call media type (1=voice, 2=video) |
| callRole | String | Role: caller / callee |

### calls Parameter Reference

| Parameter | Type | Required | Description |
|---|---|---|---|
| userIDList | Array\<String\> | Yes | List of users to call |
| type | Number | Yes | 1=voice, 2=video (`CallMediaType`) |
| userData | String | No | Custom extension data; the callee reads it from `ON_CALL_RECEIVED` |
| timeout | Number | No | Timeout in seconds, default 30 |
| roomID | Number | No | Numeric room ID, range [1, 2147483647] |
| strRoomID | String | No | String room ID; mutually exclusive with roomID |
| chatGroupID | String | No | Chat group ID; used for multi-party calls in a group chat |
| offlinePushInfo | Object | No | Custom offline push parameters |

## 3. Mechanism & Sequence

Caller invokes `calls()` to send an invitation -> the SDK sends the invitation via the signaling channel -> callee triggers `ON_CALL_RECEIVED` -> callee calls `accept()` to answer or `reject()` to decline -> call is established / ended.

Real-time state changes during the call are handled through TUICallEngine event listeners and do not rely on Chat messages.

## 4. Standard Usage

1. Create a `TUICallEngine` instance and log in.
2. The caller calls `calls()` to initiate a call invitation.
3. The callee listens for the `ON_CALL_RECEIVED` event and calls `accept()` or `reject()` upon receiving it.
4. Extension data is passed as a `userData` string; the callee reads it from the event.

```javascript
// Web: @trtc/call-engine-lite-js
// 小程序: @trtc/call-engine-lite-wx  （API 一致，仅包名不同）
import { TUICallEngine, TUICallEvent } from '@trtc/call-engine-lite-js';

// 创建实例并登录
const tuiCallEngine = TUICallEngine.createInstance({ SDKAppID: xxx, tim: timInstance });
await tuiCallEngine.login({ userID, userSig });

// 主叫：发起通话邀请
await tuiCallEngine.calls({
  userIDList: ['user_bob'],
  type: 2,                    // 1=语音 2=视频
  userData: '{"ext":"info"}',
  timeout: 30,
});

// 被叫：监听通话邀请
tuiCallEngine.on(TUICallEvent.ON_CALL_RECEIVED, (event) => {
  console.log('来电', event);
  // 展示接听 UI，随后调用 accept() 或 reject()
  tuiCallEngine.accept({ inviteID: event.inviteID, roomID: event.roomID });
});
```

## 5. Expected Results

- After the caller invokes `calls()`, the callee receives the `ON_CALL_RECEIVED` event.
- After the callee calls `accept()`, the call is established; after `reject()`, the call is declined.
- `userData` passed by the caller can be correctly read by the callee from the event.
- Other events during the call (answer, hang up, timeout, etc.) are triggered normally through TUICallEngine's event mechanism.

## 6. Common Pitfalls

- Pitfall 1: Listening to `MESSAGE_RECEIVED` to manually parse call invitations (use `ON_CALL_RECEIVED` instead).
- Pitfall 2: Using `businessID` / low-level payload formats or other SDK internal fields (no official public documentation exists; do not fabricate them).
- Pitfall 3: Assuming a `customData` field exists (v4.x uses the `userData` string to pass custom data).

## 7. Problem Definition (retrieval hint)

TUICallEngine Web / mini program users need to understand how to receive call invitations, initiate calls, and pass custom extension data.

## 8. Alternative Queries (retrieval recall)

- How does TUICallEngine receive call invitations?
- How does TUICallEngine initiate a call?
- What do the `ON_CALL_RECEIVED` fields mean?
- How to fill in the `calls` API parameters?
- How does TUICallEngine pass custom extension data?
- Is the call invitation flow in mini program TUICallEngine the same as Web?
