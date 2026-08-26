## Introduction

`BarrageStore` provides a complete set of barrage management APIs, including sending text barrages, sending custom barrages, and adding local tip messages. Through this class, you can implement barrage interaction functionality in live rooms.

> **Important:**
> Use the **BarrageStore.create** factory method to create a `BarrageStore` instance, which requires a valid live room ID.
>

> **Note:**
> Barrage state updates are delivered through the **barrageState** publisher. Subscribe to it to receive real-time updates of barrage data in the room.
>

## Features
- **Text Barrage**: Supports sending plain text barrage messages.

- **Custom Barrage**: Supports sending custom format barrages (such as barrages with special effects).

- **Local Tips**: Supports adding tip messages visible only locally.

## Subscribable Data

**BarrageState** fields are described below:

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|messageList|StateFlow<List<Barrage>>|Barrage message list of the current room, supports real-time updates and can be subscribed to.|

## API List

|**Function**|**Description**|
|---------|---------|
|BarrageStore.create|Create barrage management instance.|
|customMessageEvent|Custom message Flow event.|
|sendTextMessage|Send text barrage.|
|sendCustomMessage|Send custom barrage.|
|appendLocalTip|Add local tip message.|

### Creating Instance

#### BarrageStore.create

Create barrage management instance.

### Events Handling

#### customMessageEvent

Custom message Flow event.

Custom message event, representing one-time events for custom messages in the barrage system.

**Data Structures：**CustomMessageEvent

### Sending Barrage

#### sendTextMessage

Send a text type barrage. After sending successfully, the receiver can obtain barrage messages by subscribing to messageList in BarrageState in advance.
``` kotlin
abstract fun sendTextMessage(
        text: String?,
        extensionInfo: Map<String, String>?,
        completion: CompletionHandler?
    )
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|text|String?|Text barrage content.|
|extensionInfo|Map<String, String>?|Extension information, can contain custom fields (such as specifying barrage color, font size, etc.).|
|completion|CompletionHandler?|Completion callback (success/failure status).|

#### sendCustomMessage

Send a custom type barrage message. After sending successfully, the receiver can receive custom messages by subscribing to the customMessageEvent event provided by BarrageStore.
``` kotlin
abstract fun sendCustomMessage(
        businessID: String?,
        data: String?,
        completion: CompletionHandler?
    )
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|businessID|String?|Business identifier ID, used to distinguish custom barrages from different business scenarios.|
|data|String?|Custom data content, usually JSON format string, used to pass business custom data.|
|completion|CompletionHandler?|Completion callback (success/failure status).|

### Local Messages

#### appendLocalTip

Add local tip message (add tip or operation feedback message locally, visible only to the current client).
``` kotlin
abstract fun appendLocalTip(message: Barrage)
```

**Version**

Supported since version 3.5.

**Notes**

> **Note:**
> This message is only displayed locally and will not be sent to other users through the network.
>

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|message|Barrage|Local barrage message (such as system tips, operation feedback, etc., visible only to the current user).|

## Data Structures

### BarrageType

Barrage type enumeration, used to distinguish different barrage message types.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|TEXT|0|Text type barrage, contains plain text content.|
|CUSTOM|1|Custom type barrage, supports business custom data format (such as barrages with special effects, interactive messages, etc.).|

### Barrage

Barrage data model, containing complete attribute information of a single barrage.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|liveID|String|Unique identifier ID of the live room/voice chat room the barrage belongs to.|
|sender|LiveUserInfo|User information of the barrage sender (such as user ID, nickname, avatar, etc.).|
|sequence|Long|Unique sequence ID of the barrage message, used for message sorting and deduplication.|
|timestampInSecond|Long|Barrage sending timestamp (unit: seconds), used to display sending time order.|
|messageType|BarrageType|Barrage message type (text or custom).|
|textContent|String|Message content of text type barrage, i.e., the text content of the barrage.|
|extensionInfo|Map<String, String>|Barrage extension information, customizable fields (such as display style, priority, etc.). Valid when messageType is TEXT.|
|businessID|String|Business identifier ID of custom type barrage, used to distinguish custom barrages from different business scenarios.|
|data|String|Specific data content of custom type barrage (usually JSON format string), valid when messageType is CUSTOM.|

### BarrageState

Barrage state, managing the barrage data state of the current room.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|messageList|StateFlow<List<Barrage>>|Barrage message list of the current room, supports real-time updates and can be subscribed to.|

### CustomMessageEvent

Custom message event, representing one-time events for custom messages in the barrage system.

|**Enum Value**|**Parameter**|**Parameter Type**|**Description**|
|---------|---------|---------|---------|
|CustomMessageReceived|barrage|Barrage|Event triggered when a custom message is received in the room.|
