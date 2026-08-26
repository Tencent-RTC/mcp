## Introduction

`GiftStore` provides a complete set of gift management APIs, including sending gifts, refreshing gift lists, setting language, and listening to gift events. Through this class, gift interaction features can be implemented in live rooms.

> **Important:**
> Use the **create(liveID:)** factory method to create a `GiftStore` instance, passing a valid live room ID.
>

> **Note:**
> Gift state updates are delivered through the **state** publisher. Subscribe to it to receive real-time updates of gift data in the room.
>

## Features
- **Gift Sending**: Support sending specified gifts to the current room.

- **Gift List**: Get and refresh the available gift list in the current room.

- **Language Setting**: Set the display language for gift information.

- **Event Listening**: Listen to gift receiving events.

## Subscribable Data

**GiftState** fields are described below:

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|usableGifts|[GiftCategory]|All gift categories and gift lists available in the current room.|

## API List

|**Function**|**Description**|
|---------|---------|
|create|Create gift management instance.|
|giftEventPublisher|Gift event publisher.|
|sendGift|Send gift.|
|refreshUsableGifts|Refresh available gift list.|
|setLanguage|Set display language.|

### Creating Instance

#### create

Create gift management instance.
``` swift
public static func create(liveID: String) -> GiftStore {
    let store: GiftStoreImpl = StoreFactory.shared.getStore(roomID: liveID)
    return store
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|liveID|String|Live room ID.|

### Observing State and Events

#### giftEventPublisher

Gift event publisher.

### Gift Operations

#### sendGift

Send a specified gift to the current room.
``` swift
public func sendGift(giftID: String,
                     count: UInt,
                     completion: CompletionClosure?) {
    fatalError("\(#function) must be overridden by subclass")
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|giftID|String|Unique identifier ID of the gift to send.|
|count|UInt|Number of gifts to send at once.|
|completion|CompletionClosure?|Completion callback (success/failure status).|

#### refreshUsableGifts

Manually refresh the available gift list in the current room.
``` swift
public func refreshUsableGifts(completion: CompletionClosure?) {
    fatalError("\(#function) must be overridden by subclass")
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|completion|CompletionClosure?|Completion callback (on success, the latest gift list can be obtained through state; on failure, error information is returned).|

#### setLanguage

Set the display language for gift information.
``` swift
public func setLanguage(_ language: String) {
    fatalError("\(#function) must be overridden by subclass")
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|language|String|Language code ("zh-CN" for Chinese, "en" for English). After setting, gift names, descriptions, etc. will be updated to the corresponding language when the display interface is refreshed.|

## Data Structures

### Gift

Gift data model, containing complete attribute information of a single gift.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|giftID|String|Gift ID.|
|name|String|Gift name.|
|desc|String|Gift description.|
|iconURL|String|Network URL of the gift icon image, used to load gift thumbnails.|
|resourceURL|String|Network URL of the gift animation resource file, used to load gift display animations.|
|level|UInt|Gift level, used to distinguish gift rarity or value tier.|
|coins|UInt|Gift price (coins).|
|extensionInfo|[String: String]|Gift extension information, customizable fields (such as effect type, sending restrictions, etc.).|

### GiftCategory

Gift category.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|categoryID|String|Category unique identifier ID, used to distinguish different gift categories.|
|name|String|Category display name, used for UI category display (such as "Popular Gifts", "Premium Gifts").|
|desc|String|Category description information, used to explain the characteristics of this category.|
|extensionInfo|[String: String]|Category extension information, containing custom fields (such as sorting weight, display style, etc.).|
|giftList|[Gift]|All gifts under the current category.|

### GiftState

Gift state, managing the gift data state of the current room, supporting real-time updates and subscription listening.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|usableGifts|[GiftCategory]|All gift categories and gift lists available in the current room.|

### GiftListener

Gift event, used to receive gift dynamics in live rooms/voice chat rooms.

**Methods**

**onReceiveGift**: Event callback when receiving a new gift message. This event is triggered when other viewers send gifts in the live room/voice chat room, returning relevant information.
``` swift
case onReceiveGift(liveID: String, gift: Gift, count: UInt, sender: LiveUserInfo)
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|liveID|String|Live room ID.|
|gift|Gift|Gift information.|
|count|UInt8|Gift count.|
|sender|LiveUserInfo|Gift sender information.|
