## Introduction

`BarrageStore` provides a complete set of barrage management APIs, including sending text barrages, sending custom barrages, and adding local tip messages. Through this class, you can implement barrage interaction functionality in live rooms.

> **Important:**
> Use the **create** factory method to create a `BarrageStore` instance, which requires a valid live room ID.
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
|messageList|ValueListenable<List<Barrage>>|Barrage message list of the current room, supports real-time updates and can be subscribed to.|

## API List

|**Function**|**Description**|
|---------|---------|
|create|Create barrage management instance.|
|addBarrageListener|Add barrage event listener to receive custom messages.|
|removeBarrageListener|Remove barrage event listener.|
|sendTextMessage|Send text barrage.|
|sendCustomMessage|Send custom barrage.|
|appendLocalTip|Add local tip message.|

### Creating Instance

#### create

Barrage management core class for handling barrage related business logic in live rooms/voice chat rooms.
``` dart
static BarrageStore create(String liveID) {
  return StoreFactory.shared.getStore<BarrageStore>(roomID: liveID);
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|liveID|String|Live room ID.|

### Events Handling

#### addBarrageListener

Add barrage event listener.
``` dart
void addBarrageListener(BarrageListener listener);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|listener|BarrageListener|Barrage event listener instance.|

#### removeBarrageListener

Remove barrage event listener.
``` dart
void removeBarrageListener(BarrageListener listener);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|listener|BarrageListener|Barrage event listener instance to be removed.|

### Sending Barrage

#### sendTextMessage

Send a text type barrage. After sending successfully, the receiver can obtain barrage messages by subscribing to messageList in BarrageState in advance.
``` dart
Future<CompletionHandler> sendTextMessage({
  required String text,
  Map<String, String>? extensionInfo,
});
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|text|String|Text barrage content.|
|extensionInfo|Map<String, String>?|Extension information, can contain custom fields (such as specifying barrage color, font size, etc.).|

#### sendCustomMessage

Send a custom type barrage message. After sending successfully, the receiver can receive custom messages by subscribing to the addBarrageListener provided by BarrageStore.
``` dart
Future<CompletionHandler> sendCustomMessage({
  required String businessID,
  required String data,
});
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|businessID|String|Business identifier ID, used to distinguish custom barrages from different business scenarios.|
|data|String|Custom data content, usually JSON format string, used to pass business custom data.|

### Local Messages

#### appendLocalTip

Add local tip message (add tip or operation feedback message locally, visible only to the current client).
``` dart
void appendLocalTip(Barrage message);
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
|text|0|Text type barrage, contains plain text content.|
|custom|1|Custom type barrage, supports business custom data format (such as barrages with special effects, interactive messages, etc.).|

### Barrage

Barrage data model, containing complete attribute information of a single barrage.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|liveID|String|Unique identifier ID of the live room/voice chat room the barrage belongs to.|
|sender|LiveUserInfo|User information of the barrage sender (such as user ID, nickname, avatar, etc.).|
|sequence|int|Unique sequence ID of the barrage message, used for message sorting and deduplication.|
|timestampInSecond|int|Barrage sending timestamp (unit: seconds), used to display sending time order.|
|messageType|BarrageType|Barrage message type (text or custom).|
|textContent|String|Message content of text type barrage, i.e., the text content of the barrage.|
|extensionInfo|Map<String, String>|Barrage extension information, customizable fields (such as display style, priority, etc.). Valid when messageType is TEXT.|
|businessID|String|Business identifier ID of custom type barrage, used to distinguish custom barrages from different business scenarios.|
|data|String|Specific data content of custom type barrage (usually JSON format string), valid when messageType is CUSTOM.|

### BarrageState

Barrage state, managing the barrage data state of the current room.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|messageList|ValueListenable<List<Barrage>>|Barrage message list of the current room, supports real-time updates and can be subscribed to.|

### BarrageListener

Barrage event listener.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|onCustomMessageReceived|void Function(Barrage)?|Callback triggered when a custom barrage message is received.|
