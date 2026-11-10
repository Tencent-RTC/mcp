---
sync_node_id: '161234009408835584'
nav_path:
  - "直播与语聊 SDK"
  - "客户端 API"
  - "Android"
  - "API 概述"
product: "live"
---
# AtomicXCore API Overview (Kotlin)

AtomicXCore SDK is the latest generation of reactive APIs designed for video live streaming, voice chat rooms, and similar scenarios. You can quickly build your own UI pages based on this set of APIs. It supports rich features including room management, screen sharing, member management, seat control, and basic beauty effects.
This page contains all functional modules of the AtomicXCore SDK, categorized as follows.

## User Login

|**Class**|**Description**|
|---------|---------|
|LoginStore|Login related interfaces, managing user login, logout, user information settings and other operations.|

## Device Management

|**Class**|**Description**|
|---------|---------|
|AudioEffectStore|Audio effect setting related interfaces, managing voice changer, reverb, and ear monitor features for anchors.|
|BaseBeautyStore|Basic beauty related interfaces, managing the adjustment and state synchronization of smooth, whiteness, ruddy and other basic beauty effects.|
|DeviceStore|Device related interfaces, operating microphone, camera, etc.|
|MusicStore|BGM playback related interfaces, managing music playback control, state synchronization, and playback event listening in live rooms/voice chat rooms.|

## Call Features

|**Class**|**Description**|
|---------|---------|
|CallStore|Audio/video call management APIs for initiating, answering, rejecting, hanging up calls, group call management, and call history management.|

## Live Interaction

|**Class**|**Description**|
|---------|---------|
|BattleStore|Live PK management APIs for creating, joining, and leaving PK sessions.|
|CoGuestStore|Live co-guest management related interfaces, managing co-guest application, invitation, acceptance, rejection and other operations between hosts and audience.|
|CoHostStore|Live host connection management related interfaces, managing creation, joining, leaving and other operations for host-to-host connections.|
|LikeStore|Like related interfaces, managing like sending, like state synchronization, and like event listening operations in live rooms/voice chat rooms.|
|LiveAudienceStore|Live audience related interfaces, managing audience list, permission settings and other operations.|
|LiveListStore|Live list related interfaces, managing live room creation, joining, leaving and other operations.|
|LiveSeatStore|Live seat management related interfaces, managing seat operations such as taking seat, leaving seat, locking seat, and releasing seat.|

## Room Management

|**Class**|**Description**|
|---------|---------|
|RoomParticipantStore|Room participant management related interfaces, managing participant permissions, device control, message muting and other operations.|
|RoomStore|Room management related interfaces, managing room creation, joining, leaving, scheduling and other operations.|

## Barrage Messages

|**Class**|**Description**|
|---------|---------|
|BarrageStore|Barrage related interfaces, managing barrage sending, barrage state synchronization, and barrage event listening in live rooms/voice chat rooms.|

## Gift Messages

|**Class**|**Description**|
|---------|---------|
|GiftStore|Gift-related interface, managing gift sending, gift state synchronization, and gift event listening in live rooms/voice chat rooms.|

## View Components

|**Class**|**Description**|
|---------|---------|
|CallCoreView|Core call view component responsible for video rendering and interactive display of the call interface. Supports multi-layout switching (single-person float/multi-person grid/picture-in-picture), call waiting animations, and personalized configuration of volume, network status, and user avatars.|
|CameraView|When starting camera test, the camera rendering view will be displayed on this CameraView.|
|LiveCoreView|Live core view component, providing view container for live streaming push and playback, supporting multi-person co-guest, PK and other features.|
|RoomParticipantView|Room participant video view for displaying participant video streams.|
