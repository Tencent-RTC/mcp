**AtomicXCore SDK** is the next-generation reactive API from **TRTC**, purpose-built for live streaming, instant messaging, audio/video calls, and voice chat rooms. This API suite enables rapid UI development and supports comprehensive features including room management, screen sharing, member management, seat control, basic beauty effects, and more. Built on the TRTC SDK, AtomicXCore delivers ultra-low latency and high-quality audio and video experiences. This page provides a complete reference for all **AtomicXCore SDK API** interfaces, organized by functional module.

## LoginState

**User Authentication and Login Management**
- **Core Features:** Deliver essential identity authentication, including user login, logout, and personal profile management. This forms the foundation of user identity across your application.

- **Technical Highlights:** Support multiple login methods, user info caching, persistent login state, and robust security for user identity.

- **Use Cases:** User login, identity verification, profile management, permission control, and other core authentication scenarios.

   **Reactive Data**

   |**Data List**|**Description**|
   |---------|---------|
   |[loginUserInfo](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#loginUserInfo)|Details of the currently logged-in user.|

   **API Functions**

   |**Function List**|**Description**|
   |---------|---------|
   |[login](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#login)|Authenticate and log in the user.|
   |[setSelfInfo](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#setSelfInfo)|Update user profile information.|
   |[logout](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#logout)|Log out the user.|

## DeviceState

**Device State Management**
- **Core Features:** Control audio/video devices such as cameras and microphones, monitors device status, checks permissions, and provides essential device services.

- **Technical Highlights:** Support multi-device management, real-time device monitoring, dynamic permission checks, and automatic device fault recovery.

- **Use Cases:** Device management, permission control, audio/video capture, device fault handling, and other foundational scenarios.

   **Reactive Data**

   |**Data List**|**Description**|
   |---------|---------|
   |[microphoneStatus](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#microphoneStatus)|Status of the microphone.|
   |[microphoneList](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#microphoneList)|List of available microphone devices.|
   |[currentMicrophone](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#currentMicrophone)|Currently selected microphone device.|
   |[microphoneLastError](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#microphoneLastError)|Last microphone error details.|
   |[captureVolume](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#captureVolume)|Microphone capture volume level.|
   |[currentMicVolume](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#currentMicVolume)|Current microphone volume.|
   |[isMicrophoneTesting](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#isMicrophoneTesting)|Microphone testing status.|
   |[testingMicVolume](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#testingMicVolume)|Microphone volume during testing.|
   |[cameraStatus](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#cameraStatus)|Status of the camera.|
   |[cameraList](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#cameraList)|List of available camera devices.|
   |[currentCamera](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#currentCamera)|Currently selected camera device.|
   |[cameraLastError](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#cameraLastError)|Last camera error details.|
   |[isCameraTesting](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#isCameraTesting)|Camera testing status.|
   |[isCameraTestLoading](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#isCameraTestLoading)|Camera test loading status.|
   |[isFrontCamera](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#isFrontCamera)|Indicates if the front camera is in use.|
   |[localMirrorType](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#localMirrorType)|Local video mirror type.|
   |[localVideoQuality](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#localVideoQuality)|Local video quality settings.|
   |[speakerList](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#speakerList)|List of available speaker devices.|
   |[currentSpeaker](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#currentSpeaker)|Currently selected speaker device.|
   |[outputVolume](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#outputVolume)|Speaker output volume level.|
   |[currentAudioRoute](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#currentAudioRoute)|Current audio output route.|
   |[isSpeakerTesting](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#isSpeakerTesting)|Speaker testing status.|
   |[screenStatus](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#screenStatus)|Screen sharing status.|
   |[networkInfo](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#networkInfo)|Network connection details.|

   **API Functions**

   |**Function List**|**Description**|
   |---------|---------|
   |[openLocalMicrophone](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#openLocalMicrophone)|Enable the local microphone.|
   |[closeLocalMicrophone](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#closeLocalMicrophone)|Disable the local microphone.|
   |[muteLocalAudio](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#muteLocalAudio)|Mute local audio.|
   |[unmuteLocalAudio](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#unmuteLocalAudio)|Unmute local audio.|
   |[getMicrophoneList](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#getMicrophoneList)|Retrieve the list of microphone devices.|
   |[setCurrentMicrophone](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#setCurrentMicrophone)|Select the active microphone device.|
   |[startMicrophoneTest](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#startMicrophoneTest)|Begin microphone testing.|
   |[setCaptureVolume](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#setCaptureVolume)|Adjust microphone capture volume.|
   |[setOutputVolume](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#setOutputVolume)|Adjust speaker output volume.|
   |[stopMicrophoneTest](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#stopMicrophoneTest)|End microphone testing.|
   |[getSpeakerList](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#getSpeakerList)|Retrieve the list of speaker devices.|
   |[setCurrentSpeaker](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#setCurrentSpeaker)|Select the active speaker device.|
   |[setAudioRoute](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#setAudioRoute)|Configure the audio output route.|
   |[startSpeakerTest](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#startSpeakerTest)|Begin speaker testing.|
   |[stopSpeakerTest](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#stopSpeakerTest)|End speaker testing.|
   |[openLocalCamera](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#openLocalCamera)|Enable the local camera.|
   |[closeLocalCamera](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#closeLocalCamera)|Disable the local camera.|
   |[getCameraList](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#getCameraList)|Retrieve the list of camera devices.|
   |[setCurrentCamera](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#setCurrentCamera)|Select the active camera device.|
   |[switchCamera](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#switchCamera)|Switch between front and rear cameras.|
   |[switchMirror](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#switchMirror)|Toggle video mirror mode.|
   |[updateVideoQuality](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#updateVideoQuality)|Update video quality settings.|
   |[startCameraDeviceTest](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#startCameraDeviceTest)|Begin camera device testing.|
   |[startScreenShare](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#startScreenShare)|Start screen sharing.|
   |[stopScreenShare](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#stopScreenShare)|Stop screen sharing.|
   |[stopCameraDeviceTest](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#stopCameraDeviceTest)|End camera device testing.|
   |[screenCaptureStopped](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#screenCaptureStopped)|Callback for when screen sharing stops.|

## LiveListState

**Live Room List Management**
- **Core Features**: Manage the complete lifecycle of live rooms, including creation, joining, leaving, ending, and supports paginated retrieval and real-time updates of the live room list.

- **Technical Highlights:** Enable paginated loading, real-time status sync, dynamic live info updates, and reactive data binding to keep UI and data state aligned. New reactive data: liveList and liveListCursor, plus fetchLiveList API.

- **Use Cases:** Displaying live room lists, creating live rooms, managing live status, live data analytics, and related business scenarios.

   **Reactive Data**

   |**Data List**|**Description**|
   |---------|---------|
   |[currentLive](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#currentLive)|Information about the current live room.|
   |[liveList](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#liveList)|Live room list data, including all live rooms.|
   |[liveListCursor](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#liveListCursor)|Pagination cursor for fetching the next page of live room data.|

   **API Functions**

   |**Function List**|**Description**|
   |---------|---------|
   |[createLive](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#createLive)|Create a new live room.|
   |[joinLive](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#joinLive)|Join an existing live room.|
   |[leaveLive](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#leaveLive)|Leave the current live room.|
   |[endLive](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#endLive)|End the live stream.|
   |[updateLiveInfo](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#updateLiveInfo)|Update live room information.|
   |[queryMetaData](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#queryMetaData)|Query custom metadata.|
   |[updateLiveMetaData](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#updateLiveMetaData)|Update custom metadata for the live room.|
   |[fetchLiveList](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#fetchLiveList)|Fetch the live room list.|

## LiveSeatState

**Live Room Seat Management**
- **Core Features:** Provide seat control for multi-user co-hosting, including seat state management and audio/video device control—take seat, leave seat, lock seat, and more.

- **Technical Highlights:** Built on WebRTC, support multi-stream audio/video management, seat locking, device control, permission management, and advanced features. New reactive data: seatList, canvas, speakingUsers, networkQualities, and full seat operation APIs.

- **Use Cases:** Multi-user co-hosting, host PK battles, interactive games, online education, conference live streaming, and other multi-user interaction scenarios.

   **Reactive Data**

   |**Data List**|**Description**|
   |---------|---------|
   |[seatList](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#seatList)|Seat list, including status and user details for all seats.|
   |[canvas](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#canvas)|Canvas configuration for video rendering and layout.|
   |[speakingUsers](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#speakingUsers)|List of users currently speaking.|
   |[networkQualities](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#networkQualities)|Network quality information for each user.|

   **API Functions**

   |**Function List**|**Description**|
   |---------|---------|
   |[takeSeat](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#takeSeat)|Take a seat (go live on mic).|
   |[leaveSeat](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#leaveSeat)|Leave a seat (go off mic).|
   |[lockSeat](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#lockSeat)|Lock a seat.|
   |[unLockSeat](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#unLockSeat)|Unlock a seat.|
   |[kickUserOutOfSeat](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#kickUserOutOfSeat)|Remove a user from a seat.|
   |[moveUserToSeat](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#moveUserToSeat)|Move a user to a specified seat.|
   |[openRemoteCamera](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#openRemoteCamera)|Enable a remote user's camera.|
   |[closeRemoteCamera](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#closeRemoteCamera)|Disable a remote user's camera.|
   |[openRemoteMicrophone](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#openRemoteMicrophone)|Enable a remote user's microphone.|
   |[closeRemoteMicrophone](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#closeRemoteMicrophone)|Disable a remote user's microphone.|
   |[muteMicrophone](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#muteMicrophone)|Mute a microphone.|
   |[unmuteMicrophone](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#unmuteMicrophone)|Unmute a microphone.|
   |[startPlayStream](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#startPlayStream)|Start stream playback.|
   |[stopPlayStream](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#stopPlayStream)|Stop stream playback.|

## LiveAudienceState

**Live Room Audience Management**
- **Core Features:** Manage the audience list, controls audience permissions, assigns administrators, and supports moderation and real-time audience statistics.

- **Technical Highlights:** Real-time audience list updates, hierarchical permission management, batch operations, ensuring live room order and optimal user experience. New reactive data: audienceList and audienceCount.

- **Use Cases:** Audience management, permission control, live room moderation, audience interaction, and related scenarios.

   **Reactive Data**

   |**Data List**|**Description**|
   |---------|---------|
   |[audienceList](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#audienceList)|Audience list, including details for all viewers.|
   |[audienceCount](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#audienceCount)|Total audience count.|

   **API Functions**

   |**Function List**|**Description**|
   |---------|---------|
   |[fetchAudienceList](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#fetchAudienceList)|Retrieve the audience list.|
   |[setAdministrator](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#setAdministrator)|Assign administrator privileges.|
   |[revokeAdministrator](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#revokeAdministrator)|Remove administrator privileges.|
   |[kickUserOutOfRoom](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#kickUserOutOfRoom)|Remove a user from the room.|
   |[disableSendMessage](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#disableSendMessage)|Mute a user.|

## LiveMonitorState

**Live Room Monitoring Management**
- **Core Features:** Provide real-time monitoring of live rooms, including live status tracking, data statistics, anomaly detection, and multi-room monitoring.

- **Technical Highlights:** Real-time data collection, multi-dimensional metrics, intelligent alerting, ensuring live streaming stability and reliability. New reactive data: monitorLiveInfoList and optimized monitoring APIs.

- **Use Cases:** Live quality monitoring, performance analysis, anomaly alerts, data statistics, and operational management.

   **Reactive Data**

   |**Data List**|**Description**|
   |---------|---------|
   |[monitorLiveInfoList](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#monitorLiveInfoList)|List of monitored live room details.|

   **API Functions**

   |**Function List**|**Description**|
   |---------|---------|
   |[init](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#init)|Initialize live room monitoring.|
   |[getLiveList](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#getLiveList)|Get the list of live rooms.|
   |[closeRoom](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#closeRoom)|Close a live room.|
   |[sendMessage](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#sendMessage)|Send a message.|
   |[startPlay](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#startPlay)|Start playback.|
   |[stopPlay](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#stopPlay)|Stop playback.|
   |[muteLiveAudio](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#muteLiveAudio)|Mute live audio.|

## CoGuestState

**Co-host Guest Management**
- **Core Features:** Manage co-hosting interactions between audience and host, including application, invitation, acceptance, rejection, and co-hosting status management.

- **Technical Highlights:** Real-time audio/video technology, status synchronization, adaptive quality, network monitoring. New reactive data: connected, invitees, applicants, candidates, and applyForSeat API.

- **Use Cases:** Audience co-hosting, interactive Q&A, online karaoke, game live streaming, and other audience participation scenarios.

   **Reactive Data**

   |**Data List**|**Description**|
   |---------|---------|
   |[candidates](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#candidates)|List of candidate users for co-host invitation.|
   |[connected](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#connected)|List of users currently co-hosting.|
   |[invitees](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#invitees)|List of users invited to co-host.|
   |[applicants](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#applicants)|List of users applying to co-host.|

   **API Functions**

   |**Function List**|**Description**|
   |---------|---------|
   |[cancelApplication](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#cancelApplication)|Cancel a co-host application.|
   |[acceptApplication](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#acceptApplication)|Accept a co-host application.|
   |[rejectApplication](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#rejectApplication)|Reject a co-host application.|
   |[cancelInvitation](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#cancelInvitation)|Cancel a co-host invitation.|
   |[acceptInvitation](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#acceptInvitation)|Accept a co-host invitation.|
   |[rejectInvitation](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#rejectInvitation)|Reject a co-host invitation.|
   |[disConnect](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#disConnect)|Disconnect from co-hosting.|
   |[applyForSeat](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#applyForSeat)|Apply to go live on mic.|

## CoHostState

**Co-host Host Management**
- **Core Features:** Enable co-hosting between hosts, including invitations, applications, status management, and a complete host co-hosting workflow.

- **Technical Highlights:** Multi-host audio/video sync, picture-in-picture display, quality optimization for seamless co-hosting. New reactive data: coHostStatus, connected, applicant, invitees, candidates, and full co-hosting control APIs.

- **Use Cases:** Host PK battles, collaborative live streaming, cross-platform co-hosting, host interaction, and advanced live streaming scenarios.

   **Reactive Data**

   |**Data List**|**Description**|
   |---------|---------|
   |[coHostStatus](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#coHostStatus)|Co-host host status.|
   |[connected](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#connected)|Co-host connection status.|
   |[applicant](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#applicant)|Host applying for co-hosting.|
   |[invitees](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#invitees)|List of invited hosts.|
   |[candidates](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#candidates)|Candidate host list.|

   **API Functions**

   |**Function List**|**Description**|
   |---------|---------|
   |[requestHostConnection](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#requestHostConnection)|Request host co-hosting.|
   |[cancelHostConnection](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#cancelHostConnection)|Cancel host co-hosting.|
   |[acceptHostConnection](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#acceptHostConnection)|Accept host co-hosting.|
   |[rejectHostConnection](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#rejectHostConnection)|Reject host co-hosting.|
   |[exitHostConnection](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#exitHostConnection)|Exit host co-hosting.|

## BattleState

**PK Battle Management**
- **Core Features:** Manage PK battles between hosts, including invitations, acceptance, rejection, ending, and real-time score tracking.

- **Technical Highlights:** Real-time battle status sync, score calculation, result statistics, and more. New reactive data: battleScore for a complete PK battle experience.

- **Use Cases:** Host PK battles, talent competitions, game battles, interactive contests, and entertainment scenarios.

   **Reactive Data**

   |**Data List**|**Description**|
   |---------|---------|
   |[currentBattleInfo](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#currentBattleInfo)|Current PK battle details.|
   |[battleUsers](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#battleUsers)|Users participating in the PK battle.|
   |[battleScore](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#battleScore)|Real-time PK battle score.|

   **API Functions**

   |**Function List**|**Description**|
   |---------|---------|
   |[requestBattle](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#requestBattle)|Request a PK battle.|
   |[cancelBattleRequest](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#cancelBattleRequest)|Cancel a PK battle request.|
   |[acceptBattle](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#acceptBattle)|Accept a PK battle.|
   |[rejectBattle](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#rejectBattle)|Reject a PK battle.|
   |[exitBattle](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#exitBattle)|Exit a PK battle.|

## BarrageState

**Barrage Message Management**
- **Core Features:** Manage barrage features in live rooms, including text and custom messages, barrage sending, message status sync, and local tip display.

- **Technical Highlights:** High-concurrency message processing, real-time sync, message filtering, emoji support, and more. New API functions: sendTextMessage, sendCustomMessage, appendLocalTip.

- **Use Cases:** Barrage interaction, message management, emoji usage, chat rooms, and social scenarios.

   **Reactive Data**

   |**Data List**|**Description**|
   |---------|---------|
   |[messageList](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#messageList)|List of barrage messages.|

   **API Functions**

   |**Function List**|**Description**|
   |---------|---------|
   |[sendTextMessage](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#sendTextMessage)|Send a text message.|
   |[sendCustomMessage](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#sendCustomMessage)|Send a custom message.|
   |[appendLocalTip](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#appendLocalTip)|Add a local tip.|

## MessageListState

**Message List Management**
- **Core Features:** Manage chat message lists, including message loading, scroll control, read receipts, message highlighting, and complete display functionality.

- **Technical Highlights:** Virtual scrolling, message optimization, real-time updates, and high-performance handling. New reactive data: activeConversationID, messageList, hasMoreOlderMessage, and more.

- **Use Cases:** Instant messaging, group chat, private chat, message management, and communication scenarios.

   **Reactive Data**

   |**Data List**|**Description**|
   |---------|---------|
   |[activeConversationID](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#activeConversationID)|ID of the active conversation.|
   |[messageList](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#messageList)|Message list data.|
   |[hasMoreOlderMessage](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#hasMoreOlderMessage)|Indicates if older messages are available.|
   |[hasMoreNewerMessage](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#hasMoreNewerMessage)|Indicates if newer messages are available.|
   |[enableReadReceipt](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#enableReadReceipt)|Read receipt status.|
   |[isDisableScroll](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#isDisableScroll)|Scroll disable status.|
   |[recalledMessageIDSet](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#recalledMessageIDSet)|Set of recalled message IDs.|
   |[highlightMessageIDSet](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#highlightMessageIDSet)|Set of highlighted message IDs.|

   **API Functions**

   |**Function List**|**Description**|
   |---------|---------|
   |[setEnableReadReceipt](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#setEnableReadReceipt)|Enable or disable read receipts.|
   |[setIsDisableScroll](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#setIsDisableScroll)|Enable or disable scroll.|
   |[highlightMessage](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#highlightMessage)|Highlight a message.|

## MessageInputState

**Message Input Management**
- **Core Features:** Manage the input box state and behavior, supporting text input, emoji, @mentions, input status indication, and a complete input experience.

- **Technical Highlights:** Rich text editing, input status sync, draft saving, and more. New reactive data: inputRawValue, isPeerTyping.

- **Use Cases:** Message editing, emoji input, file sending, voice input, and related scenarios.

   **Reactive Data**

   |**Data List**|**Description**|
   |---------|---------|
   |[inputRawValue](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#inputRawValue)|Raw text content of the input box.|
   |[isPeerTyping](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#isPeerTyping)|Indicates if the peer is typing.|

   **API Functions**

   |**Function List**|**Description**|
   |---------|---------|
   |[updateRawValue](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#updateRawValue)|Update the input box value.|
   |[setEditorInstance](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#setEditorInstance)|Set the editor instance.|
   |[setContent](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#setContent)|Set the input box content.|
   |[insertContent](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#insertContent)|Insert content into the input box.|
   |[focusEditor](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#focusEditor)|Focus the input editor.|
   |[blurEditor](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#blurEditor)|Remove focus from the editor.|
   |[sendMessage](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#sendMessage)|Send a message.|

## MessageActionState

**Message Action Management**
- **Core Features:** Manage message actions such as forwarding, quoting, copying, deleting, recalling, and provides a complete set of message operations.

- **Technical Highlights:** Support batch operations, action state management, permission control, and more. New reactive data: forwardMessageIDList, isForwardMessageSelectionDone.

- **Use Cases**: Message forwarding, quoting, management, batch operations, and related scenarios.

   **Reactive Data**

   |**Data List**|**Description**|
   |---------|---------|
   |[forwardMessageIDList](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#forwardMessageIDList)|List of message IDs selected for forwarding.|
   |[isForwardMessageSelectionDone](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#isForwardMessageSelectionDone)|Indicates if forwarding selection is complete.|
   |[forwardConversationIDList](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#forwardConversationIDList)|Target conversation IDs for forwarding.|
   |[quotedMessage](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#quotedMessage)|Details of the quoted message.|

   **API Functions**

   |**Function List**|**Description**|
   |---------|---------|
   |[forwardMessage](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#forwardMessage)|Forward a message.|
   |[setForwardMessageIDList](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#setForwardMessageIDList)|Set the list of messages to forward.|
   |[setIsForwardMessageSelectionDone](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#setIsForwardMessageSelectionDone)|Set forwarding selection completion status.|
   |[setForwardConversationIDList](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#setForwardConversationIDList)|Set target conversations for forwarding.|
   |[quoteMessage](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#quoteMessage)|Quote a message.|
   |[clearQuotedMessage](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#clearQuotedMessage)|Clear the quoted message.|
   |[copyTextMessage](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#copyTextMessage)|Copy a text message.|
   |[deleteMessage](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#deleteMessage)|Delete a message.|
   |[recallMessage](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#recallMessage)|Recall a message.|
   |[resetMessageActionState](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#resetMessageActionState)|Reset message action state.|

## ConversationListState

**Conversation List Management**
- **Core Features:** Manage the user's conversation list, including sorting, unread count statistics, conversation operations, and complete management features.

- **Technical Highlights:** Real-time conversation updates, intelligent sorting, network status monitoring, and more. New reactive data: conversationList, activeConversation, totalUnRead, netStatus.

- **Use Cases:** Conversation management, contact lists, group management, message center, and related scenarios.

   **Reactive Data**

   |**Data List**|**Description**|
   |---------|---------|
   |[conversationList](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#conversationList)|Conversation list data.|
   |[activeConversation](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#activeConversation)|Currently active conversation.|
   |[totalUnRead](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#totalUnRead)|Total unread messages count.|
   |[netStatus](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#netStatus)|Network connection status.|

   **API Functions**

   |**Function List**|**Description**|
   |---------|---------|
   |[markConversationUnread](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#markConversationUnread)|Mark a conversation as unread.|
   |[setActiveConversation](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#setActiveConversation)|Set the active conversation.|
   |[pinConversation](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#pinConversation)|Pin a conversation.|
   |[deleteConversation](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#deleteConversation)|Delete a conversation.|
   |[muteConversation](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#muteConversation)|Mute a conversation.|
   |[setConversationDraft](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#setConversationDraft)|Set a conversation draft.|
   |[createC2CConversation](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#createC2CConversation)|Create a one-on-one conversation.|
   |[createGroupConversation](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#createGroupConversation)|Create a group conversation.|

## ContactListState

**Contact List Management**
- **Core Features:** Manage the user's contact list, including friend management, group management, blacklist management, and complete contact features.

- **Technical Highlights:** Contact grouping, friend applications, group applications, and more. New reactive data: friendList, groupList, blackList, and full contact operation APIs.

- **Use Cases:** Friend management, group management, contact search, social networking, and related scenarios.

   **Reactive Data**

   |**Data List**|**Description**|
   |---------|---------|
   |[friendList](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#friendList)|List of friends.|
   |[groupList](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#groupList)|List of groups.|
   |[blackList](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#blackList)|Blacklist.|
   |[friendApplicationUnreadCount](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#friendApplicationUnreadCount)|Unread friend application count.|
   |[friendGroupList](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#friendGroupList)|List of friend groups.|
   |[friendApplicationList](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#friendApplicationList)|List of friend applications.|
   |[groupApplicationList](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#groupApplicationList)|List of group applications.|

   **API Functions**

   |**Function List**|**Description**|
   |---------|---------|
   |[setGroupApplicationList](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#setGroupApplicationList)|Set the group application list.|
   |[setFriendList](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#setFriendList)|Set the friend list.|
   |[setGroupList](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#setGroupList)|Set the group list.|
   |[setBlackList](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#setBlackList)|Set the blacklist.|
   |[setFriendApplicationUnreadCount](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#setFriendApplicationUnreadCount)|Set unread friend application count.|
   |[setFriendGroupList](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#setFriendGroupList)|Set the friend group list.|
   |[setFriendApplicationList](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#setFriendApplicationList)|Set the friend application list.|
   |[initContactListWatcher](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#initContactListWatcher)|Initialize contact list watcher.|
   |[addFriend](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#addFriend)|Add a friend.|
   |[markFriendApplicationAsRead](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#markFriendApplicationAsRead)|Mark friend applications as read.|
   |[acceptFriendApplication](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#acceptFriendApplication)|Accept a friend application.|
   |[refuseFriendApplication](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#refuseFriendApplication)|Refuse a friend application.|
   |[addToBlacklist](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#addToBlacklist)|Add a user to the blacklist.|
   |[removeFromBlacklist](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#removeFromBlacklist)|Remove a user from the blacklist.|
   |[deleteFriend](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#deleteFriend)|Delete a friend.|
   |[setFriendRemark](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#setFriendRemark)|Set a friend's remark.|
   |[createFriendGroup](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#createFriendGroup)|Create a friend group.|
   |[deleteFriendGroup](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#deleteFriendGroup)|Delete a friend group.|
   |[addToFriendGroup](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#addToFriendGroup)|Add a user to a friend group.|
   |[removeFromFriendGroup](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#removeFromFriendGroup)|Remove a user from a friend group.|
   |[renameFriendGroup](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#renameFriendGroup)|Rename a friend group.|
   |[joinGroup](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#joinGroup)|Join a group.|
   |[acceptGroupApplication](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#acceptGroupApplication)|Accept a group application.|
   |[refuseGroupApplication](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#refuseGroupApplication)|Refuse a group application.|

## C2CSettingState

**One-on-One Chat Settings Management**
- **Core Features:** Manage settings for one-on-one conversations, including user info, chat settings, and permission control.

- **Technical Highlights:** Real-time settings sync, permission management, personalized configuration. Reactive data fields standardized to userID, avatar, signature, and more.

- **Use Cases:** One-on-one chat settings, user info management, chat permission control, and related scenarios.

   **Reactive Data**

   |**Data List**|**Description**|
   |---------|---------|
   |[currentConversationRef](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#currentConversationRef)|Reference to the current conversation.|
   |[userIDRef](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#userIDRef)|User ID.|
   |[nickRef](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#nickRef)|User nickname.|
   |[avatarRef](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#avatarRef)|User avatar.|
   |[signatureRef](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#signatureRef)|User signature.|
   |[remarkRef](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#remarkRef)|Friend remark name.|
   |[isMutedRef](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#isMutedRef)|Conversation mute status.|
   |[isPinnedRef](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#isPinnedRef)|Conversation pin status.|
   |[isContactRef](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#isContactRef)|Friend relationship status.|
   |[userID](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#userID)|User ID.|
   |[avatar](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#avatar)|User avatar URL.|
   |[signature](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#signature)|User signature.|
   |[remark](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#remark)|User remark name.|
   |[isMuted](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#isMuted)|Muted status.|
   |[isPinned](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#isPinned)|Pinned status.|
   |[isContact](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#isContact)|Contact status.|

   **API Functions**

   |**Function List**|**Description**|
   |---------|---------|
   |[setChatPinned](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#setChatPinned)|Pin the chat.|
   |[setChatMuted](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#setChatMuted)|Enable do-not-disturb for the chat.|
   |[setUserRemark](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#setUserRemark)|Set user remark.|

## GroupSettingState

**Group Chat Settings Management**
- **Core Features:** Manage group chat settings and operations, including group info, member management, permission control, and complete group management features.

- **Technical Highlights:** Group permission management, member operations, group settings sync, and more. New reactive data: groupID, groupType, groupName, and full group management APIs.

- **Use Cases:** Group management, member management, permission control, group settings, and related scenarios.

   **Reactive Data**

   |**Data List**|**Description**|
   |---------|---------|
   |[groupID](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#groupID)|Group ID.|
   |[groupType](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#groupType)|Group type.|
   |[groupName](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#groupName)|Group name.|
   |[avatar](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#avatar)|Group avatar URL.|
   |[introduction](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#introduction)|Group introduction.|
   |[notification](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#notification)|Group announcement.|
   |[isMuted](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#isMuted)|Muted status.|
   |[isPinned](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#isPinned)|Pinned status.|
   |[groupOwner](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#groupOwner)|Group owner details.|
   |[adminMembers](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#adminMembers)|Administrator list.|
   |[allMembers](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#allMembers)|List of all group members.|
   |[memberCount](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#memberCount)|Total member count.|
   |[maxMemberCount](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#maxMemberCount)|Maximum allowed member count.|
   |[currentUserID](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#currentUserID)|Current user ID.|
   |[currentUserRole](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#currentUserRole)|Current user role.|
   |[nameCard](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#nameCard)|User name card.|
   |[isMuteAllMembers](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#isMuteAllMembers)|Indicates if all members are muted.|
   |[isInGroup](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#isInGroup)|Indicates if the user is in the group.|
   |[inviteOption](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#inviteOption)|Group invite options.|

   **API Functions**

   |**Function List**|**Description**|
   |---------|---------|
   |[getGroupMemberList](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#getGroupMemberList)|Retrieve the group member list.|
   |[updateGroupProfile](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#updateGroupProfile)|Update group profile information.|
   |[addGroupMember](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#addGroupMember)|Add a member to the group.|
   |[deleteGroupMember](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#deleteGroupMember)|Remove a member from the group.|
   |[changeGroupOwner](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#changeGroupOwner)|Transfer group ownership.|
   |[setGroupMemberRole](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#setGroupMemberRole)|Set a member's role in the group.|
   |[setGroupMemberNameCard](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#setGroupMemberNameCard)|Set a member's name card.|
   |[setChatPinned](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#setChatPinned)|Pin the group chat.|
   |[setChatMuted](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#setChatMuted)|Enable do-not-disturb for the group chat.|
   |[setGroupMemberMuteTime](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#setGroupMemberMuteTime)|Set mute duration for a group member.|
   |[setMuteAllMember](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#setMuteAllMember)|Mute all group members.|
   |[dismissGroup](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#dismissGroup)|Dismiss the group.|
   |[quitGroup](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#quitGroup)|Leave the group.|
   |[hasPermission](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#hasPermission)|Check user permissions.|
   |[canOperateOnMember](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#canOperateOnMember)|Check if a member can be operated on.|
   |[getAvailablePermissions](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#getAvailablePermissions)|Get available permissions.|
   |[initWatcher](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#initWatcher)|Initialize group watcher.|

## VideoMixerState

**Video Mixing Management**
- **Core Features:** Manage video mixing, supporting multi-stream composition, layout management, media source control, and advanced video processing.

- **Technical Highlights:** Real-time video mixing, dynamic layout adjustment, media source management, and more. New reactive data: isVideoMixerEnabled, mediaSourceList, activeMediaSource, and full mixing control APIs.

- **Use Cases:** Multi-host live streaming, picture-in-picture, video composition, professional production, and related scenarios.

   **Reactive Data**

   |**Data List**|**Description**|
   |---------|---------|
   |[publishVideoQuality](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#publishVideoQuality)|Video size by resolution.|
   |[isVideoMixerEnabled](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#isVideoMixerEnabled)|Indicates if video mixing is enabled.|
   |[mediaSourceList](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#mediaSourceList)|List of media sources.|
   |[activeMediaSource](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#activeMediaSource)|Currently active media source.|

   **API Functions**

   |**Function List**|**Description**|
   |---------|---------|
   |[getVideoDataByQuality](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#getVideoDataByQuality)|Get video data by quality.|
   |[getSizeByQuality](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#getSizeByQuality)|Get video size by quality.|
   |[getSizeByResolution](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#getSizeByResolution)|Get video size by resolution.|
   |[transformTUIVideoQualityToTRTCVideoResolution](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#transformTUIVideoQualityToTRTCVideoResolution)|Convert video quality to TRTC resolution.|
   |[transformTRTCVideoResolutionToTUIVideoQuality](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#transformTRTCVideoResolutionToTUIVideoQuality)|Convert TRTC resolution to video quality.|
   |[transformTRTCVideoResModeToTUIVideoResMode](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#transformTRTCVideoResModeToTUIVideoResMode)|Convert TRTC resolution mode.|
   |[changeActiveMediaSource](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#changeActiveMediaSource)|Switch the active media source.|
   |[updateVideoQuality](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#updateVideoQuality)|Update video quality settings.|
   |[getDefaultLayoutByMediaSource](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#getDefaultLayoutByMediaSource)|Get default layout for a media source.|
   |[addMediaSource](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#addMediaSource)|Add a media source.|
   |[updateMediaSource](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#updateMediaSource)|Update a media source.|
   |[removeMediaSource](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#removeMediaSource)|Remove a media source.|
   |[enableLocalVideoMixer](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#enableLocalVideoMixer)|Enable local video mixer.|
   |[clearMediaSource](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#clearMediaSource)|Clear all media sources.|
   |[initMediaSourceManager](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#initMediaSourceManager)|Initialize media source manager.|
   |[initVideoMixerState](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#initVideoMixerState)|Initialize video mixer state.|

## VirtualBackgroundState

**Virtual Background Management**
- **Core Features:** Manage virtual backgrounds, including background replacement, blur, custom backgrounds, and video beautification.

- **Technical Highlights:** AI-powered real-time background segmentation and replacement. New reactive data: virtualBackgroundConfig, plus isSupported and setVirtualBackground APIs.

- **Use Cases:** Video calls, online meetings, live stream beautification, privacy protection, and related scenarios.

   **Reactive Data**

   |**Data List**|**Description**|
   |---------|---------|
   |[virtualBackgroundConfig](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#virtualBackgroundConfig)|Virtual background configuration.|

   **API Functions**

   |**Function List**|**Description**|
   |---------|---------|
   |[initVirtualBackground](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#initVirtualBackground)|Initialize virtual background.|
   |[saveVirtualBackground](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#saveVirtualBackground)|Save virtual background settings.|
   |[isSupported](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#isSupported)|Check if virtual background is supported.|
   |[setVirtualBackground](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#setVirtualBackground)|Set the virtual background.|

## STTState

**Speech Recognition Management**
- **Core Features:** Manage speech recognition, including real-time speech-to-text, transcript history, transcript export, and more.

- **Technical Highlights:** Advanced STT technology, multi-language support, real-time transcription, history records. New reactive data: recentTranscripts, transcriptHistory, and exportTranscripts API.

- **Use Cases:** Meeting notes, speech transcription, accessibility, content recording, and related scenarios.

   **Reactive Data**

   |**Data List**|**Description**|
   |---------|---------|
   |[recentTranscripts](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#recentTranscripts)|Recent speech transcript records.|
   |[transcriptHistory](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#transcriptHistory)|Speech transcript history records.|

   **API Functions**

   |**Function List**|**Description**|
   |---------|---------|
   |[setRecentTranscriptsDuration](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#setRecentTranscriptsDuration)|Set duration for recent transcripts.|
   |[clearHistory](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#clearHistory)|Clear transcript history.|
   |[exportTranscripts](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#exportTranscripts)|Export transcripts.|

## SearchState

**Search Feature Management**
- **Core Features:** Manage global search, including message, user, and group search, with multi-dimensional search capabilities.

- **Technical Highlights:** Advanced search, search history, suggestions, and more. Reactive data standardized to keyword, results, isLoading, and full search APIs.

- **Use Cases:** Message search, contact search, content lookup, history records, and related scenarios.

   **Reactive Data**

   |**Data List**|**Description**|
   |---------|---------|
   |[keyword](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#keyword)|Search keyword.|
   |[results](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#results)|Search results.|
   |[isLoading](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#isLoading)|Loading status.|
   |[error](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#error)|Error details.|
   |[searchAdvancedParams](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#searchAdvancedParams)|Advanced search parameters.|
   |[selectedSearchType](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#selectedSearchType)|Selected search type.|

   **API Functions**

   |**Function List**|**Description**|
   |---------|---------|
   |[search](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#search)|Perform a search.|
   |[setKeyword](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#setKeyword)|Set the search keyword.|
   |[setSelectedType](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#setSelectedType)|Set the selected search type.|
   |[setSearchMessageAdvancedParams](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#setSearchMessageAdvancedParams)|Set advanced parameters for message search.|
   |[setSearchUserAdvancedParams](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#setSearchUserAdvancedParams)|Set advanced parameters for user search.|
   |[setSearchGroupAdvancedParams](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#setSearchGroupAdvancedParams)|Set advanced parameters for group search.|
   |[loadMore](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#loadMore)|Load more results.|

## SeatStore

**Seat Storage Management**
- **Core Features:** Provide underlying storage and management for seat states, including seat info caching, user info mapping, device request handling, and other core features.

- **Technical Highlights:** Reactive storage design, real-time state sync, event-driven updates, and more. New reactive data: liveOwnerUserId, localUserId, seatList, plus getUserInfo and convertUserInfoToAudienceInfo APIs.

- **Use Cases:** Seat state management, user info storage, device state tracking, and foundational scenarios.

   **Reactive Data**

   |**Data List**|**Description**|
   |---------|---------|
   |[liveOwnerUserId](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#liveOwnerUserId)|Live room host user ID.|
   |[localUserId](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#localUserId)|Local user ID.|
   |[seatList](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#seatList)|Seat list, including status and user info for all seats.|
   |[coHostUserList](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#coHostUserList)|List of co-host users.|
   |[sentDeviceRequestMap](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#sentDeviceRequestMap)|Mapping of sent device requests.|
   |[receivedDeviceRequestMap](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#receivedDeviceRequestMap)|Mapping of received device requests.|
   |[userInfoMap](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#userInfoMap)|User info mapping table.|

   **API Functions**

   |Function List|Description|
   |---------|---------|
   |[getUserInfo](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#getUserInfo)|Retrieve user information.|
   |[convertUserInfoToAudienceInfo](https://web.sdk.qcloud.com/trtc/live/web/doc/zh/index.html#convertUserInfoToAudienceInfo)|Convert user information to audience information.|
