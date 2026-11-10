---
sync_node_id: '196562606725623808'
nav_path:
  - "视频通话 SDK"
  - "客户端 API"
  - "Flutter"
  - "CallStore"
product: "call"
---
## Introduction

Audio/video call functionality is implemented through `CallStore` for real-time audio/video interaction between users. `CallStore` provides a comprehensive set of APIs to manage the entire call lifecycle. When integrating `CallStore`, please be aware of the following runtime characteristics:
- **Error Handling**: When actively calling an API (e.g., `calls`), if the call itself fails due to parameter validation or state conflicts, you will typically be notified via an asynchronously thrown error event or a returned error code. Network or remote-side anomalies are also delivered through `onCallEnded` with the error reason attached.

- **Threading Model & Cleanup**: All state updates (`CallState`) and event callbacks (`CallEvent` / `CallEventListener`) are typically **guaranteed to fire on the main thread**, so they can be used directly to refresh the UI. Under the global singleton pattern, be sure to unregister listeners when components are destroyed (e.g., `deinit` / `onDestroy`) to avoid memory leaks.

   > **Important:** 
   > 
   > Ensure the SDK is initialized before accessing the `CallStore.shared` singleton. Do not instantiate it directly, as doing so will prevent you from receiving call state updates.
   > 

   > **Note:** 
   > 
   > Call state updates are delivered through the `state` publisher. Subscribe to it to receive real-time updates of call data.
   > 

   > **Warning:** 
   > 
   > Please ensure proper handling of UI state after the call ends to avoid UI anomalies.
   > 

## Features
- **Create Audio/Video Calls**: Support initiating audio or video calls to one or multiple users, with configurable timeout, custom data, and other parameters.

- **Answer/Reject Audio/Video Calls**: When receiving an incoming call invitation, you can choose to answer or reject.

- **Hang Up Audio/Video Calls**: End the current ongoing audio/video call.

- **Group Call Management**: Support joining existing group calls or inviting other users to join during a call.

- **Call History Management**: Query recent call records (with pagination support), delete specified call records.

- **Event-Driven Architecture**: Provides event listeners for call started, call received, call ended, etc.

- **State Subscription**: Real-time subscription to current call state, including participant list, volume information, network quality, etc.

## Subscribable Data

**CallState** fields are described below:
| <strong>Property</strong> | <strong>Type</strong> | <strong>Description</strong> |
| --- | --- | --- |
| activeCall | ValueListenable<CallInfo> | Current active call information.<br><strong>Lifecycle Contract</strong>: When <code>onCallEnded</code> is triggered, this object is not immediately cleared; instead, it retains the call's final state for the UI to display end animations (at this point <code>CallInfo.result</code> or other parameters reflect the end reason). If a new call is initiated or received, it will be automatically overwritten. Developers can manually clean up by resetting the related <code>CallStore</code> state. |
| recentCalls | ValueListenable<List<CallInfo>> | Recent call records list.<br><strong>Note:</strong><br>Each call to <code>queryRecentCalls</code> currently behaves as an <strong>overwrite update</strong> rather than an automatic append. To implement infinite scrolling, the business layer needs to concatenate newly arrived data with the existing list on its own. |
| cursor | ValueListenable<String> | Pagination cursor, used to query more call records. |
| selfInfo | ValueListenable<CallParticipantInfo> | Current user's own information. |
| allParticipants | ValueListenable<List<CallParticipantInfo>> | All participants in current call. |
| speakerVolumes | ValueListenable<Map<String, int>> | Participant volume information, key is user ID, value is volume level. |
| networkQualities | ValueListenable<Map<String, NetworkQuality>> | Participant network quality information, key is user ID, value is network quality. |

## API List

|**Function**|**Description**|
|---------|---------|
|shared|Get the CallStore singleton instance.|
|addListener|Call event publisher.|
|removeListener|Call event publisher.|
|calls|Create a call.|
|accept|Answer a call.|
|reject|Reject a call.|
|hangup|Hang up a call.|
|join|Join a group call.|
|invite|Invite users to join a call.|
|queryRecentCalls|Query recent call records.|
|deleteRecentCalls|Delete call records.|

### Get Instance

#### shared

Get the CallStore singleton instance.

### Observe State and Events

#### addListener

Add call event callback listener.
``` dart
void addListener(CallEventListener listener);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|listener|CallEventListener|Listener.|

#### removeListener

Remove call event callback listener.
``` dart
void removeListener(CallEventListener listener);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|listener|CallEventListener|Listener.|

### Call Operations

#### calls

Create an audio or video call to specified users, supporting both one-on-one and group calls.
``` dart
Future<CompletionHandler> calls(List<String> participantIds, CallMediaType mediaType, CallParams? params);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|participantIds|List<String>|List of callee IDs, supports single or multiple users.|
|mediaType|CallMediaType|Call media type (audio/video).|
|params|CallParams?|Call parameter configuration.|

#### accept

Answer a call. Call this method to answer the call when receiving an incoming call invitation.
``` dart
Future<CompletionHandler> accept();
```

**Version**

Supported since version 3.5.

#### reject

Reject a call. Call this method to reject the call when receiving an incoming call invitation.
``` dart
Future<CompletionHandler> reject();
```

**Version**

Supported since version 3.5.

#### hangup

Hang up and end the current ongoing call.
``` dart
Future<CompletionHandler> hangup();
```

**Version**

Supported since version 3.5.

#### join

Join an ongoing group call using a specific call ID.
``` dart
Future<CompletionHandler> join(String callId);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|callId|String|Call ID to join.|

#### invite

Invite other users to join during an ongoing call.
``` dart
Future<CompletionHandler> invite(List<String> participantIds, CallParams? params);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|participantIds|List<String>|List of invitee IDs.|
|params|CallParams?|Call parameter configuration.|

### Call History

#### queryRecentCalls

Query recent call records.
**Current Limitation**: Currently, query results **overwrite (reset)** the `state.recentCalls` list each time, rather than automatically appending.
``` dart
Future<CompletionHandler> queryRecentCalls(String cursor, int count);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|cursor|String|Pagination cursor, pass empty string for first query.|
|count|int|Query count.|

#### deleteRecentCalls

Delete specified call records.
``` dart
Future<CompletionHandler> deleteRecentCalls(List<String> callIdList);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|callIdList|List<String>|List of call IDs to delete.|

## Data Structures

### CallMediaType

Call media type, used to specify whether to initiate an audio call or video call.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|audio|1|Audio call.|
|video|2|Video call.|

### CallEndReason

Call end reason, used to identify how the audio/video call ended (normal hangup, rejection, timeout, etc.).

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|unknown|0|Unknown reason.|
|hangup|1|Normal hangup.|
|reject|2|Rejected.|
|noResponse|3|No response.|
|offline|4|Offline.|
|lineBusy|5|Line busy.|
|canceled|6|Call was canceled.|
|otherDeviceAccepted|7|Accepted on another device.|
|otherDeviceReject|8|Rejected on another device.|
|endByServer|9|Call ended by backend.|

### CallDirection

Call direction, used to identify whether the call is incoming, outgoing, or missed.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|unknown|0|Unknown.|
|missed|1|Missed call.|
|incoming|2|Incoming call.|
|outgoing|3|Outgoing call.|

### CallParticipantStatus

Call participant status, used to identify whether the participant is waiting or has answered.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|none|0|No status (not in call).|
|waiting|1|Waiting (calling/being called).|
|accept|2|Accepted.|

### CloudRecordPolicy

Cloud recording policy for audio/video calls, used to configure whether to enable cloud recording for a specific call.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|followConsoleConfig|0|Follow the global configuration in the console (default).|
|enable|1|Enable cloud recording, overriding the console configuration.|
|disable|2|Disable cloud recording, overriding the console configuration.|

### CallEventListener

Call events, used to receive various event notifications during a call.

**Methods**

|**Method**|**Description**|
|---------|---------|
|onCallStarted|Callback when a call event starts.<br>Timing Note: This indicates that "the current call flow has been successfully entered (e.g., `calls` was initiated and accepted internally)," but **it does not mean the audio/video room has been connected or established**. It is recommended to use this only for the initial UI navigation (on the caller side).|
|onCallReceived|Callback when a new call invitation is received.<br>Field Reading Recommendation: The event parameters only pass through `callId`, `mediaType`, and `userData`. If you need to read the full information such as the inviter, room ID, or associated group ID, please read it from `state.activeCall` after receiving this event.|
|onCallEnded|Unified callback for call ending events.<br>Multi-scenario Note: Whether it's a hangup after connection, a no-answer timeout, cancellation by the remote side, or the call being answered on another device, this event will ultimately be triggered. Developers must check the `reason` parameter to determine the specific cause and display the corresponding UI text or handle branching logic.<br>Getting Call Duration: This event's parameters do not include a call duration field. To get the call duration, read `state.activeCall.duration` when this callback is received (unit: seconds). After the call is connected, the SDK internally increments this value every second; when the call ends, `activeCall` is not immediately cleared, so it can be safely read within this callback.|
|onSuggestSwitchToCellular|Callback when the system detects poor WiFi quality and recommends switching to cellular network.|

### CallParams

Call parameter configuration, used to set room ID, timeout, custom data, and other parameters when initiating an audio/video call.
| <strong>Property</strong> | <strong>Type</strong> | <strong>Description</strong> |
| --- | --- | --- |
| roomId | String | TRTC room ID (CallStore's media stream management uses Tencent Cloud TRTC service). Optional parameter.<br>When not provided, it is automatically generated by the server; if your app needs to specify or reuse a TRTC room, you can pass in a specific string. |
| timeout | int | Ring timeout duration (seconds). Optional parameter.<br>Only controls the unanswered timeout phase from call initiation (<code>calls</code>) to answer. Does not apply to already connected calls or <code>invite</code> operations.<br>When set to 0, the server default (30s) will be used. |
| userData | String | Custom pass-through data attached when making a call. Optional parameter.<br>This data is primarily exposed to the callee's business logic via the <code>onCallReceived</code> event.<br><strong>Note:</strong><br>It does not enter the long-term <code>CallInfo</code> state, nor is it persisted to call records. It is recommended to pass a short JSON string. |
| chatGroupId | String | Tencent Cloud IM group ID. Optional parameter.<br>Only needs to be provided in the "call initiated from a group chat" scenario. When provided, the system will route signaling and associate this call with the group's call records, for sending call start/end status messages in the group chat and for inviting group members to join the call during the call.<br>For one-on-one calls, or ad-hoc multi-party calls not bound to a specific group, always leave this empty.<br><strong>Note:</strong><br>This field takes effect on the initial <code>calls</code> invocation; subsequent <code>invite</code> parameters cannot change the group bound to this call. |
| isEphemeralCall | bool | Ephemeral call. Optional parameter.<br>When set to <code>true</code>, no call message will be generated after this call ends. Common scenario: initiating a call in a 1v1 chat without displaying the call message. |
| cloudRecordPolicy | CloudRecordPolicy | Cloud recording policy for this call. Prerequisite: the relevant capability must already be enabled in the console.<br>- followConsoleConfig (default): Follow the global configuration in the console.<br>- enable: Force-enable cloud recording, overriding the global configuration in the console.<br>- disable: Force-disable cloud recording, overriding the global configuration in the console. |
| offlinePushTitle | String | Offline push notification title.<br>When not empty, overrides the default title (login user's nickname). |
| offlinePushDescription | String | Offline push notification description.<br>When not empty, overrides the default description. |

### CallParticipantInfo

Call participant information, including user ID, nickname, avatar, participation status, microphone/camera on/off status, etc.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|id|String|User ID.|
|name|String|User nickname.|
|avatarURL|String|User avatar URL.|
|remark|String|Friend remark.|
|status|CallParticipantStatus|Participant status.|
|isMicrophoneOpened|bool|Whether microphone is on.|
|isCameraOpened|bool|Whether camera is on.|

### CallInfo

Call information, including call ID, room ID, initiator, invitees, media type, call direction, start time, duration, and other complete information.
| <strong>Property</strong> | <strong>Type</strong> | <strong>Description</strong> |
| --- | --- | --- |
| callId | String | Call ID. |
| roomId | String | Room ID. |
| inviterId | String | Initiator ID. |
| inviteeIds | List<String> | Invitee ID list. |
| chatGroupId | String | Chat group ID. |
| mediaType | CallMediaType? | Call media type.<br><strong>Note:</strong><br>May be null (null / nil) during early event stages, when the type is unknown, or when historical call records (recent calls) have not fully back-filled this field. Handle optional unwrapping accordingly. |
| result | CallDirection | Call direction / record type (e.g., incoming, outgoing, missed).<br><strong>Note:</strong><br>This does not represent the specific reason for call termination. For end reasons. |
| startTime | int | Timestamp of when the call was actually connected (unit: milliseconds). |
| duration | int | Call duration (seconds). |

### CallState

Call state data, manages the real-time data state of the current call.
| <strong>Property</strong> | <strong>Type</strong> | <strong>Description</strong> |
| --- | --- | --- |
| activeCall | ValueListenable<CallInfo> | Current active call information.<br><strong>Lifecycle Contract</strong>: When <code>onCallEnded</code> is triggered, this object is not immediately cleared; instead, it retains the call's final state for the UI to display end animations (at this point <code>CallInfo.result</code> or other parameters reflect the end reason). If a new call is initiated or received, it will be automatically overwritten. Developers can manually clean up by resetting the related <code>CallStore</code> state. |
| recentCalls | ValueListenable<List<CallInfo>> | Recent call records list.<br><strong>Note:</strong><br>Each call to <code>queryRecentCalls</code> currently behaves as an <strong>overwrite update</strong> rather than an automatic append. To implement infinite scrolling, the business layer needs to concatenate newly arrived data with the existing list on its own. |
| cursor | ValueListenable<String> | Pagination cursor, used to query more call records. |
| selfInfo | ValueListenable<CallParticipantInfo> | Current user's own information. |
| allParticipants | ValueListenable<List<CallParticipantInfo>> | All participants in current call. |
| speakerVolumes | ValueListenable<Map<String, int>> | Participant volume information, key is user ID, value is volume level. |
| networkQualities | ValueListenable<Map<String, NetworkQuality>> | Participant network quality information, key is user ID, value is network quality. |

## Usage Example
``` dart
import 'package:atomic_x_core/atomicxcore.dart';
// Create a video call
final result = await CallStore.shared.calls(
  ["mike"],
  CallMediaType.video,
  null,
);
```
