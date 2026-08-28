## Introduction

`LikeStore` provides a complete set of like management APIs, including sending likes, listening to like events, and getting like states. Through this class, you can implement like interaction features in live rooms.

> **Important:**
> Use the **create** factory method to create a `LikeStore` instance, which requires a valid live room ID.
>

> **Note:**
> Like state updates are delivered through the **likeState** publisher. Subscribe to it to receive real-time updates of like data in the room.
>

## Features
- **Like Sending**: Support sending likes to the current room.

- **Like State**: Get the accumulated like count of the current room.

- **Event Listening**: Listen to like receiving events.

## Data Structures

### LikeState

Like state, used to display and subscribe to like information in live rooms/voice chat rooms.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|totalLikeCount|ValueListenable<int>|Total accumulated like count of the current live room/voice chat room, supporting real-time updates and subscription listening.|

### LikeListener

Like event, used to receive like dynamics in live rooms/voice chat rooms.

This listener is used to receive like dynamics in live rooms/voice chat rooms.

**Methods**

**onReceiveLikesMessage**: Event callback for receiving new like messages. When other audiences send likes in the live room/voice chat room, this event will be triggered and return relevant information.
``` dart
void Function(String liveID, int totalLikesReceived, LiveUserInfo sender)? onReceiveLikesMessage;
LikeListener({this.onReceiveLikesMessage});
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|liveID|String|Live room ID.|
|totalLikesReceived|int|Number of new likes received this time.|
|sender|LiveUserInfo|Like sender information.|
