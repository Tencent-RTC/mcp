---
sync_node_id: '201708611948466176'
nav_path:
  - "直播与语聊 SDK"
  - "客户端 API"
  - "React Native"
product: "live"
---
AtomicXCore SDK is the next-generation reactive API suite from TRTC, purpose-built for video live streaming, audio chat rooms, and similar real-time scenarios. With AtomicXCore, you can quickly build custom UI pages and leverage a comprehensive set of features, including room management, screen sharing, member management, seat control, basic beauty effects, and more. Built on the TRTC SDK, AtomicXCore delivers ultra-low latency and high-quality audio/video performance. This page provides a complete reference of all AtomicXCore SDK APIs, organized by functional module.

## LoginState

User Authentication and Login Management

Core Features: Handles user authentication, manages login state, maintains user information, and provides essential authentication services.

**Reactive Data**

|**Data List**|**Description**|
|---------|---------|
|[loginUserInfo](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#loginUserInfo)|Details of the currently logged-in user.|
|[loginStatus](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#loginStatus)|Current authentication status.|

**API Functions**

|**Function List**|**Description**|
|---------|---------|
|[login](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#login)|Authenticate and log in the user.|
|[logout](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#logout)|Log out the current user.|
|[setSelfInfo](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#setSelfInfo)|Update user profile information.|

## LiveListState

Live Stream List Management
- Core Features: Manages the complete lifecycle of live rooms, including creation, joining, leaving, ending, and other core operations.

- Technical Highlights: Supports paginated loading, real-time status sync, dynamic updates to live stream info, and reactive data binding for seamless UI/data synchronization.

- Business Value: Delivers robust live room management for streaming platforms, scales to large concurrent live scenarios, and forms the backbone of live streaming infrastructure.

- Scenarios: Live Stream List display, live room creation, live status management, Data Statistics, and other key business workflows.

   **Reactive Data**

   |**Data List**|**Description**|
   |---------|---------|
   |[liveList](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#liveList)|Live Stream List data.|
   |[liveListCursor](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#liveListCursor)|Cursor for paginated loading of the Live Stream List.|
   |[currentLive](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#currentLive)|Current live stream details.|

   **API Functions**

   |**Function List**|**Description**|
   |---------|---------|
   |[fetchLiveList](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#fetchLiveList)|Retrieve the Live Stream List.|
   |[createLive](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#createLive)|Create a new live room.|
   |[joinLive](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#joinLive)|Join an existing live room.|
   |[leaveLive](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#leaveLive)|Leave the current live room.|
   |[endLive](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#endLive)|End the live stream.|
   |[updateLiveInfo](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#updateLiveInfo)|Update live stream details.|
   |[addLiveListListener](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#addLiveListListener)|Register a Live Stream List event listener.|
   |[removeLiveListListener](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#removeLiveListListener)|Unregister a Live Stream List event listener.|

## LiveSeatState

Live Room Seat Management
- Core Features: Manages seat control for multi-user co-hosting, including advanced seat state management and audio/video device operations.

- Technical Highlights: Built on WebRTC, supports multi-stream audio/video, seat locking, device control, permission management, and more.

- Business Value: Powers interactive streaming scenarios like PK, co-hosting, multiplayer games, and other multi-user experiences.

- Scenarios: Multi-user co-hosting, host PK, interactive games, online education, conference live streaming, and other real-time audio/video scenarios.

   **Reactive Data**

   |**Data List**|**Description**|
   |---------|---------|
   |[seatList](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#seatList)|List of seats (co-host positions).|
   |[canvas](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#canvas)|Canvas layout information.|
   |[speakingUsers](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#speakingUsers)|Users currently speaking.|

   **API Functions**

   |**Function List**|**Description**|
   |---------|---------|
   |[takeSeat](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#takeSeat)|Join as a co-host by taking a seat.|
   |[leaveSeat](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#leaveSeat)|Step down from the co-host seat.|
   |[muteMicrophone](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#muteMicrophone)|Mute the microphone.|
   |[unmuteMicrophone](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#unmuteMicrophone)|Unmute the microphone.|
   |[kickUserOutOfSeat](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#kickUserOutOfSeat)|Remove a user from their seat.|
   |[moveUserToSeat](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#moveUserToSeat)|Move a user to a seat.|
   |[lockSeat](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#lockSeat)|Lock a seat.|
   |[unlockSeat](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#unlockSeat)|Unlock a seat.|
   |[openRemoteCamera](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#openRemoteCamera)|Turn on a remote user's camera.|
   |[closeRemoteCamera](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#closeRemoteCamera)|Turn off a remote user's camera.|
   |[openRemoteMicrophone](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#openRemoteMicrophone)|Turn on a remote user's microphone.|
   |[closeRemoteMicrophone](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#closeRemoteMicrophone)|Turn off a remote user's microphone.|
   |[addLiveSeatEventListener](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#addLiveSeatEventListener)|Register a seat event listener.|
   |[removeLiveSeatEventListener](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#removeLiveSeatEventListener)|Unregister a seat event listener.|

## LiveAudienceState

Live Room Audience Management
- Core Features: Manages the audience list, controls audience permissions, assigns administrators, and provides moderation tools for live rooms.

- Technical Highlights: Supports real-time audience updates, hierarchical permission management, batch operations, and advanced moderation to maintain order and optimize user experience.

- Business Value: Offers a complete audience management solution for streaming platforms, enabling effective moderation in large-scale live rooms.

- Scenarios: Audience management, permission control, live room moderation, audience interaction, and other core workflows.

   **Reactive Data**

   |**Data List**|**Description**|
   |---------|---------|
   |[audienceList](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#audienceList)|List of audience members in the live room.|
   |[audienceCount](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#audienceCount)|Total audience count.|

   **API Functions**

   |**Function List**|**Description**|
   |---------|---------|
   |[fetchAudienceList](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#fetchAudienceList)|Retrieve the audience list.|
   |[setAdministrator](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#setAdministrator)|Assign an administrator role.|
   |[revokeAdministrator](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#revokeAdministrator)|Remove administrator privileges.|
   |[kickUserOutOfRoom](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#kickUserOutOfRoom)|Remove a user from the live room.|
   |[disableSendMessage](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#disableSendMessage)|Disable message sending for a user.|
   |[addAudienceListener](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#addAudienceListener)|Register an audience event listener.|
   |[removeAudienceListener](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#removeAudienceListener)|Unregister an audience event listener.|

## DeviceState

Device Status Management
- Core Features: Controls audio/video devices (camera, microphone), monitors device status, checks permissions, and provides essential device services.

- Technical Highlights: Enables multi-device management, real-time device monitoring, dynamic permission checks, automatic device recovery, and more.

- Business Value: Ensures reliable audio/video capture and a stable device foundation for live streaming systems.

- Scenarios: Device management, permission control, audio/video capture, device error handling, and other foundational use cases.

   **Reactive Data**

   |**Data List**|**Description**|
   |---------|---------|
   |[microphoneStatus](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#microphoneStatus)|Microphone enabled/disabled status.|
   |[microphoneLastError](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#microphoneLastError)|Last microphone error.|
   |[hasPublishAudioPermission](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#hasPublishAudioPermission)|Audio publishing permission status.|
   |[captureVolume](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#captureVolume)|Capturing volume (0-100).|
   |[currentMicVolume](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#currentMicVolume)|Current microphone volume (0-100).|
   |[outputVolume](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#outputVolume)|Output volume (0-100).|
   |[cameraStatus](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#cameraStatus)|Camera enabled/disabled status.|
   |[cameraLastError](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#cameraLastError)|Last camera error.|
   |[isFrontCamera](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#isFrontCamera)|Indicates if the front camera is active.|
   |[localMirrorType](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#localMirrorType)|Local video mirroring type.|
   |[localVideoQuality](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#localVideoQuality)|Local video quality settings.|
   |[currentAudioRoute](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#currentAudioRoute)|Current audio output route (speaker/headphones).|
   |[screenStatus](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#screenStatus)|Screen sharing status.|
   |[networkInfo](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#networkInfo)|Network status information.|

   **API Functions**

   |**Function List**|**Description**|
   |---------|---------|
   |[openLocalMicrophone](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#openLocalMicrophone)|Enable the local microphone.|
   |[closeLocalMicrophone](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#closeLocalMicrophone)|Disable the local microphone.|
   |[setCaptureVolume](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#setCaptureVolume)|Adjust the capturing volume.|
   |[setOutputVolume](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#setOutputVolume)|Adjust the output volume.|
   |[openLocalCamera](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#openLocalCamera)|Enable the local camera.|

## CoGuestState

Guest Co-host Management
- Core Features: Manages audience-to-host co-hosting interactions, including application, invitation, acceptance, and rejection workflows.

- Technical Highlights: Built on real-time audio/video technology, supports instant co-hosting status sync, adaptive audio/video quality, network monitoring, and more.

- Business Value: Enables interactive audience participation for live streaming platforms, boosting engagement and entertainment.

- Scenarios: Audience co-hosting, interactive Q&A, online karaoke, game streaming, and other audience-driven scenarios.

   **Reactive Data**

   |**Data List**|**Description**|
   |---------|---------|
   |[connected](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#connected)|Connected guest co-hosts.|
   |[invitees](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#invitees)|Users invited to co-host.|
   |[applicants](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#applicants)|Users applying to co-host.|
   |[candidates](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#candidates)|Candidate users eligible for co-host invitations.|

   **API Functions**

   |**Function List**|**Description**|
   |---------|---------|
   |[applyForSeat](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#applyForSeat)|Apply for a co-host seat.|
   |[cancelApplication](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#cancelApplication)|Cancel a co-host application.|
   |[acceptApplication](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#acceptApplication)|Approve a co-host application.|
   |[rejectApplication](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#rejectApplication)|Reject a co-host application.|
   |[inviteToSeat](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#inviteToSeat)|Invite a user to a co-host seat.|
   |[cancelInvitation](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#cancelInvitation)|Cancel a co-host invitation.|
   |[acceptInvitation](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#acceptInvitation)|Accept a co-host invitation.|
   |[rejectInvitation](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#rejectInvitation)|Decline a co-host invitation.|
   |[disconnect](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#disconnect)|Disconnect from co-hosting.|
   |[addCoGuestGuestListener](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#addCoGuestGuestListener)|Register a guest-side co-host event listener.|
   |[removeCoGuestGuestListener](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#removeCoGuestGuestListener)|Unregister a guest-side co-host event listener.|
   |[addCoGuestHostListener](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#addCoGuestHostListener)|Register a host-side co-host event listener.|
   |[removeCoGuestHostListener](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#removeCoGuestHostListener)|Unregister a host-side co-host event listener.|

## CoHostState

Co-host Management
- Core Features: Enables host-to-host co-hosting, including invitations, applications, status management, and interactive features between hosts.

- Technical Highlights: Supports multi-host audio/video sync, picture-in-picture layouts, audio/video optimization, and advanced streaming technologies for seamless co-hosting.

- Business Value: Facilitates host collaboration, PK battles, and advanced live streaming scenarios for platforms.

- Scenarios: Host PK, collaborative streaming, cross-platform co-hosting, host interaction, and advanced live streaming use cases.

   **Reactive Data**

   |**Data List**|**Description**|
   |---------|---------|
   |[connected](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#connected)|Connected co-hosts.|
   |[invitees](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#invitees)|Hosts invited for co-hosting.|
   |[applicant](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#applicant)|Host currently applying for co-hosting.|
   |[candidates](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#candidates)|Candidate hosts eligible for co-hosting invitations.|
   |[coHostStatus](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#coHostStatus)|Current co-hosting status.|

   **API Functions**

   |**Function List**|**Description**|
   |---------|---------|
   |[requestHostConnection](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#requestHostConnection)|Request a co-hosting connection.|
   |[cancelHostConnection](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#cancelHostConnection)|Cancel a co-hosting request.|
   |[acceptHostConnection](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#acceptHostConnection)|Accept a co-hosting request.|
   |[rejectHostConnection](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#rejectHostConnection)|Reject a co-hosting request.|
   |[exitHostConnection](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#exitHostConnection)|Exit the co-hosting session.|
   |[addCoHostListener](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#addCoHostListener)|Register a co-host event listener.|
   |[removeCoHostListener](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#removeCoHostListener)|Unregister a co-host event listener.|

## AudioEffectState

Audio Effects Processing
- Core Features: Delivers advanced audio effects including voice changing, reverb, ear monitoring, and real-time effect adjustments.

- Technical Highlights: Powered by TRTC's Tianlai Lab audio algorithms, supports real-time processing, low-latency audio transmission, and audio quality enhancement.

- Business Value: Enables unique audio experiences for live streaming platforms, increasing user engagement and entertainment.

- Scenarios: Voice-changing live streaming, karaoke, audio entertainment, professional audio effects, and other audio processing scenarios.

   **Reactive Data**

   |**Data List**|**Description**|
   |---------|---------|
   |[isEarMonitorOpened](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#isEarMonitorOpened)|Ear monitoring enabled status.|
   |[earMonitorVolume](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#earMonitorVolume)|Ear monitor volume level.|
   |[audioChangerType](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#audioChangerType)|Voice changing effect type.|
   |[audioReverbType](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#audioReverbType)|Reverb effect type.|

   **API Functions**

   |**Function List**|**Description**|
   |---------|---------|
   |[setAudioChangerType](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#setAudioChangerType)|Apply a voice changing effect.|
   |[setAudioReverbType](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#setAudioReverbType)|Apply a reverb effect.|
   |[setVoiceEarMonitorEnable](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#setVoiceEarMonitorEnable)|Enable or disable ear monitoring.|
   |[setVoiceEarMonitorVolume](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#setVoiceEarMonitorVolume)|Set ear monitor volume.|

## BarrageState

Live Comments Management
- Core Features: Manages live comments (text and custom messages) in live rooms, supports sending comments, message sync, and a full-featured live comments system.

- Technical Highlights: Handles high-concurrency messaging, real-time sync, message filtering, emoji support, and more.

- Business Value: Powers interactive features for live streaming platforms, driving user engagement and fostering a lively streaming environment.

- Scenarios: Live comments interaction, message management, emoji packs, chatroom, and other social features.

   **Reactive Data**

   |**Data List**|**Description**|
   |---------|---------|
   |[messageList](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#messageList)|Live comments message list for the current room.|
   |[allowSendMessage](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#allowSendMessage)|Indicates if sending messages is allowed.|

   **API Functions**

   |**Function List**|**Description**|
   |---------|---------|
   |[sendTextMessage](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#sendTextMessage)|Send a text live comment.|
   |[sendCustomMessage](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#sendCustomMessage)|Send a custom live comment.|

## BaseBeautyState

Basic Beauty Effects
- Core Features: Provides skin smoothing, whitening, and rosiness adjustments with real-time beauty parameter tuning.

- Technical Highlights: Utilizes AI-powered beauty algorithms for smooth real-time processing and optimized performance.

- Business Value: Delivers essential beauty features for live streaming platforms, improving user appearance and stream quality.

- Scenarios: Beauty live streaming, appearance enhancement, beauty adjustment, stream beautification, and other beauty-related use cases.

   **Reactive Data**

   |**Data List**|**Description**|
   |---------|---------|
   |[smoothLevel](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#smoothLevel)|Skin smoothing level (0-9): 0 is off, 9 is maximum.|
   |[whitenessLevel](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#whitenessLevel)|Whitening level (0-9): 0 is off, 9 is maximum.|
   |[ruddyLevel](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#ruddyLevel)|Rosiness level (0-9): 0 is off, 9 is maximum.|

   **API Functions**

   |**Function List**|**Description**|
   |---------|---------|
   |[setSmoothLevel](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#setSmoothLevel)|Adjust skin smoothing level.|
   |[setWhitenessLevel](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#setWhitenessLevel)|Adjust whitening level.|
   |[setRuddyLevel](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#setRuddyLevel)|Adjust rosiness level.|

## GiftState

Gift System Management
- Core Features: Manages gift sending and receiving, gift list management, gift categorization, gift animation, Data Statistics, and a complete gift economy system.

- Technical Highlights: Supports gift animation rendering, Gift AR (Augmented Reality), Data Statistics, gift leaderboard, and more.

- Business Value: Enables monetization for live streaming platforms, supporting gift economies, virtual currency, and related business models.

- Scenarios: Tipping, virtual currency, Gift AR, Data Statistics, and other monetization scenarios.

   **Reactive Data**

   |**Data List**|**Description**|
   |---------|---------|
   |[usableGifts](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#usableGifts)|Available gifts list.|

   **API Functions**

   |**Function List**|**Description**|
   |---------|---------|
   |[refreshUsableGifts](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#refreshUsableGifts)|Refresh available gifts.|
   |[sendGift](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#sendGift)|Send a gift.|
   |[addGiftListener](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#addGiftListener)|Register a gift event listener.|
   |[removeGiftListener](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#removeGiftListener)|Unregister a gift event listener.|

## LikeState

Like Interaction
- Core Features: Manages the like feature in live rooms, including sending likes, tracking like statistics, and handling like events.

- Technical Highlights: Supports high-concurrency like processing, real-time statistics, animated like effects, like leaderboard, and more.

- Business Value: Provides essential interactive features for live streaming platforms, boosting user engagement and stream popularity.

- Scenarios: Like interaction, popularity metrics, interactive effects, user participation, and other engagement scenarios.

   **Reactive Data**

   |**Data List**|**Description**|
   |---------|---------|
   |[totalLikeCount](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#totalLikeCount)|Total like count.|

   **API Functions**

   |**Function List**|**Description**|
   |---------|---------|
   |[sendLike](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#sendLike)|Send a like.|
   |[addLikeListener](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#addLikeListener)|Register a like event listener.|
   |[removeLikeListener](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/en/v1.0/api/index.html#removeLikeListener)|Unregister a like event listener.|
