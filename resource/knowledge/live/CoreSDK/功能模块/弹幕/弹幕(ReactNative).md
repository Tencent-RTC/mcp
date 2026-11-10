---
sync_node_id: '209156831787188224'
nav_path:
  - "直播与语聊 SDK"
  - "Core SDK"
  - "功能模块"
  - "弹幕"
  - "弹幕（React Native）"
product: "live"
---
This document guides React Native developers through integrating a robust, high-performance live comments system into your live streaming application using the `BarrageState` module from the `AtomicXCore` framework.

## Core Features

`BarrageState` delivers a complete solution for live comments in your live streaming app, including:
- Receiving and displaying live comment messages during the stream.

- Sending text live comments for real-time audience interaction.

- Sending custom live comments to support advanced scenarios such as gifts, likes, and gamified events.

- Inserting system prompts into the local message list (for example, "Welcome XX to the live room").

## Implementation Steps

### Step 1: Integrate the Components
- **Live streaming**: .

- **Voice chat room**: .

### Step 2: Initialize and Subscribe to Live Comments

Create a `BarrageState` instance tied to the current live room's `liveID`. Subscribe to `messageList` to receive the latest complete list of live comment messages.
``` typescript
import { useEffect } from 'react';
import { useBarrageState } from 'react-native-tuikit-atomic-x/lib/module/atomic-x/state/BarrageState';

// Get BarrageState instance for the given liveID
const { messageList } = useBarrageState(liveID);

// Subscribe to real-time updates and trigger UI changes
useEffect(() => {
  console.log(messageList);
}, [messageList]);
```

### Step 3: Send Text Comments

Use the `sendTextMessage` method to broadcast a plain text message to all users in the live room.
``` typescript
import { useBarrageState } from 'react-native-tuikit-atomic-x/lib/module/atomic-x/state/BarrageState';

// Get BarrageState instance for the given liveID
const { sendTextMessage } = useBarrageState(liveID);

const sendMessage = () => {
  sendTextMessage({
    liveID: liveID, // Current live room's liveID
    text: 'xxx', // The live comment you want to send
    onSuccess: () => {
      console.log('Live comment sent successfully');
    },
    onError: (error) => {
      console.log('Failed to send live comment', error);
    },
  });
};
```

#### API Parameters

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|`liveID`|`string`|The `liveID` of the current live room.|
|`text`|`string`|The text content to send.|
|`onSuccess`|`Function`|Callback for successful send.|
|`onError`|`Function`|Callback for failed send.|

### Step 4: Send Custom Live Comments

Send messages with custom business logic—such as gifts, likes, or interactive commands. Your business logic layer is responsible for parsing these messages.
``` typescript
import { useBarrageState } from 'react-native-tuikit-atomic-x/lib/module/atomic-x/state/BarrageState';

// Get BarrageState instance for the given liveID
const { sendCustomMessage } = useBarrageState(liveID);

// Send a custom live comment, e.g., for sending gifts
const sendGiftMessage = (giftID, giftCount) => {
  // 1. Define a business-recognizable ID
  const businessID = 'live_gift';
  // 2. Encode business data as a JSON string
  const giftData = { gift_id: giftID, gift_count: giftCount };
  // 3. Call the core API to send the custom message
  sendCustomMessage({
    liveID: liveID, // Current live room's liveID
    businessID,
    data: JSON.stringify(giftData),
    onSuccess: () => {
      console.log('Gift message sent successfully');
    },
    onError: (error) => {
      console.log('Failed to send gift message', error);
    },
  });
};
```

#### API Parameters

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|`liveID`|`string`|The `liveID` of the current live room.|
|`businessID`|`string`|Unique business identifier (e.g., "live_gift") for distinguishing custom messages.|
|`data`|`string`|Business data, typically as a JSON string.|
|`onSuccess`|`Function`|Callback for successful send.|
|`onError`|`Function`|Callback for failed send.|

### Step 5: Insert Local Tip Messages

Add messages to the local message list that are visible only to the current client—not sent to other users in the live room. Use this for system welcomes, warnings, or operation prompts.
``` typescript
import { useBarrageState } from 'react-native-tuikit-atomic-x/lib/module/atomic-x/state/BarrageState';

// Get BarrageState instance for the given liveID
const { appendLocalTip } = useBarrageState(liveID);

const showWelcomeMessage = (user) => {
  appendLocalTip({
    liveID: liveID, // Current live room's liveID
    message: {
      textContent: `Welcome ${user.userName} to the live room!`,
      sender: {
        userID: user.userID || '',
        userName: user.userName || '',
        avatarURL: user.avatarURL || '',
      },
      messageType: 0,
      sequence: Math.floor(Date.now() / 1000),
      timestampInSecond: Math.floor(Date.now() / 1000),
      liveID: liveID,
    },
    onSuccess: () => {
      console.log('Local message inserted successfully');
    },
    onError: (error) => {
      console.log('Failed to insert local message', error);
    },
  });
};
```

#### API Parameters

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|`liveID`|`string`|The `liveID` of the current voice chat room.|
|`message`|`object`|The message object to insert locally. The SDK appends this object to `messageList`.|
|`onSuccess`|`Function`|Callback for successful local message addition.|
|`onError`|`Function`|Callback for failed local message addition.|

### Step 6: Manage User Messaging (Mute & Unmute)

As a host or administrator, you can control users' messaging permissions to maintain a healthy community in the live room.

#### Mute/Unmute Individual Users

Use the `disableSendMessage` interface in `LiveAudienceState` to mute or unmute a specific user. This state persists—even if the user rejoins the live room, the mute remains in effect.
``` typescript
import { useLiveAudienceState } from 'react-native-tuikit-atomic-x/lib/module/atomic-x/state/LiveAudienceState';

// Get LiveAudienceState instance for the given liveID
const { disableSendMessage } = useLiveAudienceState(liveID);

// Define the user ID and mute status
const userIdToMute = 'user_id_to_be_muted'; // UserID to operate on
const shouldDisable = true; // true to mute, false to unmute

// Execute mute/unmute operation
const toggleMuteUser = () => {
  disableSendMessage({
    liveID: liveID, // Current live room liveID
    userID: userIdToMute,
    isDisable: shouldDisable,
    onSuccess: () => {
      console.log(`${shouldDisable ? 'Muted' : 'Unmuted'} user ${userIdToMute} successfully`);
    },
    onError: (error) => {
      console.log('Operation failed', error);
    },
  });
};
```

#### API Parameters

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|`liveID`|`string`|The `liveID` of the current voice chat room.|
|`userID`|`string`|The userID to operate.|
|`isDisable`|`boolean`|Whether to mute the user.|
|`onSuccess`|`Function`|Callback for successful mute.|
|`onError`|`Function`|Callback for failed mute.|

#### Mute/Unmute All Users

To mute all users in the live room (typically excluding the host), update the room status using `updateLiveInfo` in `LiveListState`.
``` typescript
import { useLiveListState } from 'react-native-tuikit-atomic-x/lib/module/atomic-x/state/LiveListState';
import { LiveInfoModifyFlag } from 'react-native-tuikit-atomic-x/lib/module/atomic-x/state/LiveListState/types';

// 1. Get LiveListState instance
const { updateLiveInfo, currentLive } = useLiveListState();

// 2. Get current live room info and change mute-all status
const isCurrentlyMuted = currentLive?.isMessageDisable || false;

// 3. Call update interface and specify modify flag
const toggleMuteAll = () => {
  updateLiveInfo({
    liveInfo: { liveID: currentLive?.liveID, isMessageDisable: !isCurrentlyMuted },
    modifyFlagList: [LiveInfoModifyFlag.IS_MESSAGE_DISABLE],
    onSuccess: () => {
      console.log(`${!isCurrentlyMuted ? 'All users muted' : 'Mute cancelled'} successfully`);
    },
    onError: (error) => {
      console.log('Operation failed', error);
    },
  });
};
```

#### API Parameters

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|`liveInfo`|`object`|`liveID` required; other fields specify live status updates.|
|`modifyFlagList`|`LiveInfoModifyFlag[]`|List of live info flags to update.|
|`onSuccess`|`Function`|Callback for successful live info update.|
|`onError`|`Function`|Callback for failed live info update.|

## Advanced Features: Optimize Performance Under High Concurrency

After integrating live comments with `BarrageState`, use the following strategies to ensure smooth and stable performance—even during high-traffic live streaming events. This section provides actionable solutions and sample code for key scenarios.

### Scenario 1: Managing "Live Comment Storms" in Popular Rooms

#### Scenario

Large audiences generate dozens of live comments per second during peak events.

#### Challenge

The SDK returns the full live comment list at high frequency. Updating the UI for every change can overload the main thread, causing lag.

#### Solution: Batch Updates and Debouncing

Skip updates that arrive too quickly. Set a time threshold (e.g., 300 ms) and only refresh the UI if enough time has passed since the last update. This improves performance and smoothness.

#### Code Example
``` typescript
import { useEffect, useRef, useState } from 'react';
import { useBarrageState } from 'react-native-tuikit-atomic-x/lib/module/atomic-x/state/BarrageState';

// Get BarrageState instance for liveID
const { messageList } = useBarrageState(liveID);

// UI display data
const [displayMessageList, setDisplayMessageList] = useState([]);

// ===== Throttle configuration =====
const THROTTLE_INTERVAL = 300; // 300ms throttle threshold
const latestMessageListRef = useRef([]);
const throttleTimerRef = useRef(null);
const lastFlushTimeRef = useRef(0);

useEffect(() => {
  if (!messageList) return;
  // Cache the latest full list without triggering render
  latestMessageListRef.current = messageList;

  const now = Date.now();
  const timeSinceLastFlush = now - lastFlushTimeRef.current;

  // If enough time has passed, update immediately
  if (timeSinceLastFlush >= THROTTLE_INTERVAL) {
    setDisplayMessageList([...latestMessageListRef.current]);
    lastFlushTimeRef.current = now;
  } else if (!throttleTimerRef.current) {
    // Set timer only if not already set
    const remainingTime = THROTTLE_INTERVAL - timeSinceLastFlush;
    throttleTimerRef.current = setTimeout(() => {
      setDisplayMessageList([...latestMessageListRef.current]);
      lastFlushTimeRef.current = Date.now();
      throttleTimerRef.current = null;
    }, remainingTime);
  }
  // Intermediate updates within 300ms are skipped; timer flushes with latest data
}, [messageList]);

// Clear timer on component unmount
useEffect(() => {
  return () => {
    if (throttleTimerRef.current) {
      clearTimeout(throttleTimerRef.current);
    }
  };
}, []);

// Use displayMessageList to update UI, e.g.:
// <FlatList data={displayMessageList} ... />
```

### Scenario 2: Sustaining Memory Stability During Extended Live Streams

#### Scenario

Your application must support continuous live streams lasting several hours (e.g., gaming or slow-paced streams) without crashing.

#### Challenge

The SDK's `messageList` grows indefinitely over time. Even with UI throttling, holding a large array increases memory usage and can eventually cause crashes.

#### Solution: Fixed-Size Circular Buffer

Limit your own data source to a maximum number of messages. Regardless of the SDK's full list, only keep the most recent messages for display.

#### Code Example

After receiving the full list, retain only the latest 500 messages (or another defined limit).
``` typescript
import { useEffect, useState } from 'react';
import { useBarrageState } from 'react-native-tuikit-atomic-x/lib/module/atomic-x/state/BarrageState';

// Get BarrageState instance for liveID
const { messageList } = useBarrageState(liveID);

// UI display data
const [displayMessageList, setDisplayMessageList] = useState([]);

// ===== Message window configuration (retain latest N messages) =====
const MAX_MESSAGES_COUNT = 500;

const trimMessageList = (messages) => {
  if (messages.length > MAX_MESSAGES_COUNT) {
    console.warn(
      `[BarrageList] Message count exceeds limit ${MAX_MESSAGES_COUNT}, deleted ${messages.length - MAX_MESSAGES_COUNT} oldest messages`
    );
    return messages.slice(messages.length - MAX_MESSAGES_COUNT);
  }
  return messages;
};

// Listen for messageList changes, trim, and update UI
useEffect(() => {
  if (!messageList) return;
  setDisplayMessageList(trimMessageList([...messageList]));
}, [messageList]);

// Use displayMessageList to update UI, e.g.:
// <FlatList data={displayMessageList} ... />
```

## API Documentation

For detailed descriptions of all public interfaces, properties, and methods for [BarrageState](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/zh/v1.0/api/index.html#module-BarrageState) and related classes, refer to the official API documentation for the AtomicXCore framework.

## FAQs

### How to implement advanced styles such as "colored live comments" or "gift live comments" in addition to plain text?

You can use custom messages sent via `sendCustomMessage`. `BarrageState` does not restrict your business logic or creativity.

**Implementation Steps**
1. **Define the data structure:** Collaborate with client and server teams to establish the JSON structure for custom messages. For example, a colored live comment might look like:

   ``` json
   { "type": "colored_text", "text": "This is a colored live comment!", "color": "#FF5733" }
   ```
2. **Sender:** Convert this JSON structure to a string and send it via the `data` parameter of `sendCustomMessage`. Set `businessID` to a unique identifier for your business, such as `barrage_style_v1`.

3. **Receiver:** When receiving a live comment, check for `messageType` `'CUSTOM'` and matching `businessID`. Parse the `data` string (typically JSON), and render your UI based on the parsed information (e.g., `color`, `text`).

### Why is my sent message via sendTextMessage not appearing in the message list?

Check the following:
1. **onSuccess and onError callbacks:** Confirm whether `sendTextMessage` succeeded or failed. If it failed, the error message will clarify the reason (e.g., "You have been muted," "Network error").

2. **Subscription timing:** Make sure you subscribe to `barrageState` after joining the live room with the appropriate `liveID`. Subscribing before joining may cause you to miss messages.

3. **liveID consistency:** Confirm that the `liveID` used for creating `BarrageState`, joining the live room, and sending messages is exactly the same—including case sensitivity.

4. **Network connectivity:** Ensure the device is connected to the network. Message sending requires network access.

### How can new audience members see historical live comments sent before they joined?

`AtomicXCore` supports retrieving historical live comment messages, but you need to enable this in the server console. Once configured, the SDK handles everything automatically—no extra client code is required.

#### **Step 1: Configure in the Live Console**
1. Log in to [**Console > Live > Configuration**](https://console.trtc.io/live/configuration), and select your target application at the top of the page.

2. On the Live Configuration page, select **View Past Messages**, and set Previous Messages Viewable to specify the number of messages (up to a maximum of 50) that new viewers can see.

   

#### **Step 2: Automatic Retrieval on the Client Side**

After completing the above configuration, **no changes are needed** in your client code.

When a new user joins the live room, `AtomicXCore` automatically retrieves the configured number of historical chat messages in the background. These messages are delivered to the UI layer through the `BarrageState` subscription channel, just like real-time messages. Your application will receive and display these historical chat messages in the same way as live messages.
