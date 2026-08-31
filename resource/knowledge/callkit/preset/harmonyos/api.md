## Overview

The audio/video calling feature is implemented through `CallStore`, enabling real-time audio and video interaction between users. `CallStore` provides a comprehensive set of APIs to manage the entire call lifecycle. When integrating `CallStore`, be sure to understand the following runtime characteristics:
- **Error Handling**: When actively calling APIs (such as `calls`), failures due to parameter validation or state conflicts are typically reported via asynchronous error events or error codes. Network or remote exceptions are also delivered through `onCallEnded` with the error reason.

- **Threading Model & Cleanup**: All state updates (`CallState`) and event callbacks (`CallEvent` / `CallEventListener`) are typically **guaranteed to fire on the main thread**, making them safe for direct UI updates. Under the global singleton pattern, be sure to unregister listeners when components are destroyed (e.g., `deinit` / `onDestroy`) to avoid memory leaks.

   > **Important:**
   >
   > After successful SDK initialization, obtain the `CallStore` instance through the **shared** singleton. Do not attempt to initialize it directly, or you will not receive call state updates.
   >

   > **Note:**
   >
   > Call state updates are delivered through the **state** publisher. Subscribe to it to receive real-time updates on call data.
   >

   > **Warning:**
   >
   > Ensure proper UI state handling after a call ends to avoid interface anomalies.
   >

## Features
- **Initiate Audio/Video Calls**: Supports initiating audio or video calls to one or multiple users, with configurable timeout, custom data, and other parameters.

- **Accept/Reject Calls**: When receiving an incoming call invitation, you can choose to accept or reject it.

- **Hang Up Calls**: End the current ongoing audio/video call.

- **Group Call Management**: Supports joining an existing group call or inviting other users to join during a call.

- **Call Record Management**: Query recent call records (with pagination support) and delete specified call records.

- **Event-Driven Architecture**: Provides event listeners for call started, invitation received, call ended, and more.

- **State Subscription**: Subscribe to real-time call state including participant list, volume information, network quality, etc.

## Subscribable Data

**CallState** field descriptions:
| **Property** | **Type** | **Description** |
| --- | --- | --- |
| activeCall | CallInfo | Current active call information.<br>**Lifecycle contract**: When `onCallEnded` fires, this object is not immediately cleared. It retains the call's final state for UI end-of-call animations (where `CallInfo.result` or other parameters reflect the end reason). It is automatically overwritten when a new call is initiated or received. Developers can manually clean up by resetting `CallStore`-related state. |
| recentCalls | [CallInfo] | List of recent call records.<br>**Note:**<br>After each `queryRecentCalls` call, this state currently performs an **overwrite update** rather than automatic append. To implement infinite scrolling, the business layer must concatenate newly arrived data with the existing list. |
| cursor | String | Pagination cursor for querying more call records. |
| selfInfo | CallParticipantInfo | Current user's own information. |
| allParticipants | [CallParticipantInfo] | List of all participants in the current call. |
| speakerVolumes | [String: Int] | Participant volume information. Key is user ID, value is volume level. |
| networkQualities | [String: NetworkQuality] | Participant network quality information. Key is user ID, value is network quality. |

## API Reference

| **Method** | **Description** |
|---------|---------|
| shared | Get the CallStore singleton instance. |
| callEventPublisher | Call event publisher. |
| calls | Initiate a call. |
| accept | Accept a call. |
| reject | Reject a call. |
| hangup | Hang up a call. |
| join | Join a group call. |
| invite | Invite users to join a call. |
| queryRecentCalls | Query recent call records. |
| deleteRecentCalls | Delete call records. |

### Get Instance

#### shared

Get the CallStore singleton instance.

### Observe State and Events

#### callEventPublisher

Call event publisher.

### Call Operations

#### calls

Initiate an audio or video call to specified users. Supports both one-to-one and group calls.
``` ets
calls(
  participantIds: string[],
  mediaType: CallMediaType,
  params: CallParams | undefined,
): Promise<void> {
  return this.impl.calls(participantIds, mediaType, params)
}
```

**Version Info**

Supported since version 3.5.

**Parameters**

| **Parameter** | **Type** | **Description** |
|---------|---------|---------|
| participantIds | [String] | List of callee IDs. Supports one or multiple users. |
| mediaType | CallMediaType | Call media type (audio/video). |
| params | CallParams? | Call parameter configuration. |

#### accept

Accept a call. Call this method to accept when receiving an incoming call invitation.
``` ets
accept(): Promise<void> {
  return this.impl.accept()
}
```

**Version Info**

Supported since version 3.5.

#### reject

Reject a call. Call this method to reject when receiving an incoming call invitation.
``` ets
reject(): Promise<void> {
  return this.impl.reject()
}
```

**Version Info**

Supported since version 3.5.

#### hangup

Hang up and end the current ongoing call.
``` ets
hangup(): Promise<void> {
  return this.impl.hangup()
}
```

**Version Info**

Supported since version 3.5.

#### join

Join an ongoing group call using a specific Call ID.
``` ets
join(callId: string): Promise<void> {
  return this.impl.join(callId)
}
```

**Version Info**

Supported since version 3.5.

**Parameters**

| **Parameter** | **Type** | **Description** |
|---------|---------|---------|
| callId | String | The call ID to join. |

#### invite

Invite other users to join during an ongoing call.
``` ets
invite(
  participantIds: string[],
  params: CallParams | undefined,
): Promise<void> {
  return this.impl.invite(participantIds, params)
}
```

**Version Info**

Supported since version 3.5.

**Parameters**

| **Parameter** | **Type** | **Description** |
|---------|---------|---------|
| participantIds | [String] | List of invitee IDs. |
| params | CallParams? | Call parameter configuration. |

### Call Records

#### queryRecentCalls

Query recent call records.
**Current limitation**: Query results currently **overwrite (reset)** the `state.recentCalls` list rather than automatically appending.
``` ets
queryRecentCalls(cursor: string, count: number): Promise<void> {
  return this.impl.queryRecentCalls(cursor, count)
}
```

**Version Info**

Supported since version 3.5.

**Parameters**

| **Parameter** | **Type** | **Description** |
|---------|---------|---------|
| cursor | String | Pagination cursor. Pass an empty string for the first query. |
| count | UInt | Number of records to query. |

#### deleteRecentCalls

Delete specified call records.
``` ets
deleteRecentCalls(callIdList: string[]): Promise<void> {
  return this.impl.deleteRecentCalls(callIdList)
}
```

**Version Info**

Supported since version 3.5.

**Parameters**

| **Parameter** | **Type** | **Description** |
|---------|---------|---------|
| callIdList | [String] | List of call IDs to delete. |

## Data Structures

### CallMediaType

Call media type, used to specify whether to initiate an audio or video call.

| **Enum Value** | **Value** | **Description** |
|---------|---------|---------|
| audio | 1 | Audio call. |
| video | 2 | Video call. |

### CallEndReason

Call end reason, used to identify how the audio/video call ended (normal hangup, rejection, timeout, etc.).

| **Enum Value** | **Value** | **Description** |
|---------|---------|---------|
| unknown | 0 | Unknown reason. |
| hangup | 1 | Normal hangup. |
| reject | 2 | Call rejected. |
| noResponse | 3 | No response. |
| offline | 4 | Remote party offline. |
| lineBusy | 5 | Remote party busy. |
| canceled | 6 | Call cancelled. |
| otherDeviceAccepted | 7 | Accepted on another device. |
| otherDeviceReject | 8 | Rejected on another device. |
| endByServer | 9 | Call ended by server. |

### CallDirection

Call direction, used to identify whether the call is incoming, outgoing, or missed.

| **Enum Value** | **Value** | **Description** |
|---------|---------|---------|
| unknown | 0 | Unknown. |
| missed | 1 | Missed call. |
| incoming | 2 | Incoming call. |
| outgoing | 3 | Outgoing call. |

### CallParticipantStatus

Call participant status, used to identify whether a participant is waiting or has accepted.

| **Enum Value** | **Value** | **Description** |
|---------|---------|---------|
| none | 0 | No status (not in a call). |
| waiting | 1 | Waiting (calling/being called). |
| accept | 2 | Accepted. |

### CloudRecordPolicy

Cloud recording policy for audio/video calls, used to configure whether cloud recording is enabled for a specific call.

| **Enum Value** | **Value** | **Description** |
|---------|---------|---------|
| followConsoleConfig | 0 | Follow the console's global configuration (default). |
| enable | 1 | Enable cloud recording, overriding the console configuration. |
| disable | 2 | Disable cloud recording, overriding the console configuration. |

### CallEventListener

Call events, used to receive various event notifications during a call.

**Methods**

| **Method** | **Description** |
|---------|---------|
| onCallStarted | Callback when the call starts.<br>Timing note: This indicates "the call flow has been successfully entered (e.g., `calls` was initiated and internally accepted)", but **does not mean the audio/video room has been connected or established**. It is recommended to use this only for initial UI navigation (caller side). |
| onCallReceived | Callback when a new call invitation is received.<br>Field recommendation: Event parameters only pass through `callId`, `mediaType`, and `userData`. To read the full information such as inviter, room ID, or associated group ID, read from `state.activeCall` after receiving this event. |
| onCallEnded | Unified call end event callback.<br>Scenario note: Whether the call ends after connection, times out without answer, is cancelled by the remote party, or is accepted on another device, this event is ultimately triggered. Developers must use the `reason` parameter to determine the specific cause and display the corresponding UI text or handle branching logic.<br>Getting call duration: This event's parameters do not include a duration field. To get call duration, read `state.activeCall.duration` (in seconds) when receiving this callback. After the call is connected, the SDK internally increments this value every second; `activeCall` is not immediately cleared when the call ends, so it can be safely read in this callback. |
| onSuggestSwitchToCellular | Callback triggered when the system detects poor WiFi quality and suggests switching to cellular network. |

### CallParams

Call parameter configuration, used to set room ID, timeout, custom data, and other parameters when initiating audio/video calls.
| **Property** | **Type** | **Description** |
| --- | --- | --- |
| roomId | String | TRTC room ID (CallStore's media stream management uses Tencent Cloud TRTC service). Optional.<br>When not provided, automatically generated by the server. If the business needs to specify or reuse a TRTC room, pass a specific string. |
| timeout | Int | Ring timeout in seconds. Optional.<br>Only controls the unanswered timeout phase from call initiation (`calls`) to acceptance. Does not apply to connected calls or `invite` operations.<br>When set to 0, the server default (30s) is used. |
| userData | String | Custom pass-through data attached to the call. Optional.<br>This data is primarily exposed to the business side through the callee's `onCallReceived` event.<br>**Note:**<br>It does not persist in the long-term `CallInfo` state nor is it saved to call records. It is recommended to pass a short JSON string. |
| chatGroupId | String | Tencent Cloud IM group ID. Optional.<br>Only required in "call initiated from a group chat" scenarios. When provided, the system routes signaling and associates this call with the group's call records, enabling call start/end status messages in the group chat and inviting group members to join during the call.<br>For one-to-one calls or ad-hoc multi-party calls not bound to a fixed group, leave this empty.<br>**Note:**<br>This field takes effect on the initial `calls`. Subsequent `invite` calls cannot change the group binding for this call. |
| isEphemeralCall | Bool | Ephemeral call (no call record). Optional.<br>When set to `true`, no call message is generated after this call ends. Common scenario: initiating a call in a 1v1 chat without wanting to display a call message. |
| cloudRecordPolicy | CloudRecordPolicy | Cloud recording policy for this call. Requires the relevant capability to be activated in the console.<br>- followConsoleConfig (default): Follow the console's global configuration.<br>- enable: Force enable cloud recording, overriding the console's global configuration.<br>- disable: Force disable cloud recording, overriding the console's global configuration. |
| offlinePushTitle | string | Offline push notification title.<br>When non-empty, overrides the default title (logged-in user's nickname). |
| offlinePushDescription | string | Offline push notification description.<br>When non-empty, overrides the default description. |

### CallParticipantInfo

Call participant information, including user ID, nickname, avatar, participation status, microphone/camera on/off status, etc.

| **Property** | **Type** | **Description** |
|---------|---------|---------|
| id | String | User ID. |
| name | String | User nickname. |
| avatarURL | String | User avatar URL. |
| remark | String | Friend remark. |
| status | CallParticipantStatus | Participant status. |
| isMicrophoneOpened | Bool | Whether the microphone is on. |
| isCameraOpened | Bool | Whether the camera is on. |

### CallInfo

Call information, including call ID, room ID, initiator, invitees, media type, call direction, start time, duration, and other complete details.
| **Property** | **Type** | **Description** |
| --- | --- | --- |
| callId | String | Call ID. |
| roomId | String | Room ID. |
| inviterId | String | Initiator ID. |
| inviteeIds | [String] | List of invitee IDs. |
| chatGroupId | String | Chat group ID. |
| mediaType | CallMediaType? | Call media type.<br>**Note:**<br>May be null during early event phases, for unknown types, or when historical call records (recent calls) have not fully populated this field. Business code should handle optional unwrapping. |
| result | CallDirection | Call direction/record type (e.g., incoming, outgoing, missed).<br>**Note:**<br>This does not represent the specific reason for call termination. |
| startTime | TimeInterval | Timestamp when the call was actually connected (unit: milliseconds). |
| duration | TimeInterval | Call duration (seconds). |

### CallState

Call state data, managing the real-time data state of the current call.
| **Property** | **Type** | **Description** |
| --- | --- | --- |
| activeCall | CallInfo | Current active call information.<br>**Lifecycle contract**: When `onCallEnded` fires, this object is not immediately cleared. It retains the call's final state for UI end-of-call animations (where `CallInfo.result` or other parameters reflect the end reason). It is automatically overwritten when a new call is initiated or received. Developers can manually clean up by resetting `CallStore`-related state. |
| recentCalls | [CallInfo] | List of recent call records.<br>**Note:**<br>After each `queryRecentCalls` call, this state currently performs an **overwrite update** rather than automatic append. To implement infinite scrolling, the business layer must concatenate newly arrived data with the existing list. |
| cursor | String | Pagination cursor for querying more call records. |
| selfInfo | CallParticipantInfo | Current user's own information. |
| allParticipants | [CallParticipantInfo] | List of all participants in the current call. |
| speakerVolumes | [String: Int] | Participant volume information. Key is user ID, value is volume level. |
| networkQualities | [String: NetworkQuality] | Participant network quality information. Key is user ID, value is network quality. |

## Usage Example
``` ets
import AtomicXCore
// Initiate a video call
CallStore.shared.calls(participantIds: ["mike"], mediaType: .video, params: nil) { code, message in
}
```
