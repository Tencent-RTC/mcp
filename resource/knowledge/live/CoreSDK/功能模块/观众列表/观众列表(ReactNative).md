---
sync_node_id: '209156815761858560'
nav_path:
  - "直播与语聊 SDK"
  - "Core SDK"
  - "功能模块"
  - "观众列表"
  - "观众列表（React Native）"
product: "live"
---
`LiveAudienceState` is a dedicated module in `AtomicXCore` designed for managing audience information in live streaming rooms. With `LiveAudienceState`, you can build a robust audience list and management system for your live streaming application.

## Core Features
- **Real-Time Audience List**: Retrieve and display up-to-date information for all audience members currently in the live room.

- **Audience Count Statistics**: Access the accurate, real-time count of audience members present in the live room.

- **Audience Activity Monitoring**: Subscribe to events to instantly detect when audience members join or leave.

- **Administrator Privileges**: The host can promote audience members to administrator status or revoke administrator privileges.

- **Room Management**: Hosts or administrators can remove any regular audience member from the live room.

## Implementation Steps

### Step 1: Integrate Components
- **Live streaming**: .

- **Voice chat room**: .

### Step 2: Initialize and Fetch Audience List

Create a `LiveAudienceState` instance tied to the current live room's `liveID`, and proactively fetch the audience list for initial UI rendering.
``` typescript
import { useEffect } from 'react';
import { useLiveAudienceState } from 'react-native-tuikit-atomic-x/lib/module/atomic-x/state/LiveAudienceState';

const liveID = 'xxx'; // The liveID of the current voice chat room or live streaming room
// Get the LiveAudienceState instance by liveID
const { fetchAudienceList, audienceList } = useLiveAudienceState(liveID);

useEffect(() => {
  fetchAudienceList({
    liveID: liveID, // The liveID of the current live room
    onSuccess: () => {
      // Upon success, the reactive data will automatically update
      console.log('Successfully fetched the audience list for the first time');
    },
    onError: (error) => {
      console.log('Failed to fetch the audience list for the first time', error);
    },
  });
}, []);

// Listen for real-time changes in audienceList to drive UI updates
useEffect(() => {
  console.log(audienceList);
}, [audienceList]);
```

### Step 3: Monitor Audience State

Subscribe to `LiveAudienceState` events and reactive data to track full audience snapshots and real-time join/leave events for UI updates.
``` typescript
import { useEffect } from 'react';
import { useLiveAudienceState } from 'react-native-tuikit-atomic-x/lib/module/atomic-x/state/LiveAudienceState';

const liveID = 'xxx'; // The liveID of the current voice chat room or live streaming room
// Get the LiveAudienceState instance by liveID
const { audienceList, audienceCount, addAudienceListener, removeAudienceListener } = useLiveAudienceState(liveID);

// Listen for real-time changes in audienceList to drive UI updates
useEffect(() => {
  console.log(audienceList);
}, [audienceList]);

// Listen for real-time changes in audienceCount to drive UI updates
useEffect(() => {
  console.log(audienceCount);
}, [audienceCount]);

// Subscribe to audience join/leave events
useEffect(() => {
  const onAudienceJoined = (event) => {
    const newAudience = JSON.parse(event);
    console.log(`Audience member ${newAudience.userName} joined the live room`);
  };

  const onAudienceLeft = (event) => {
    const departedAudience = JSON.parse(event);
    console.log(`Audience member ${departedAudience.userName} left the live room`);
  };

  addAudienceListener('onAudienceJoined', onAudienceJoined);
  addAudienceListener('onAudienceLeft', onAudienceLeft);

  // Clean up listeners when the component unmounts
  return () => {
    removeAudienceListener('onAudienceJoined', onAudienceJoined);
    removeAudienceListener('onAudienceLeft', onAudienceLeft);
  };
}, []);
```

### Step 4: Manage Audience Members

Hosts and administrators can perform management actions for audience members in the live room.

#### 4.1 Remove Audience Members

Use the `kickUserOutOfRoom` API to remove a specific user from the live room.
``` typescript
import { useLiveAudienceState } from 'react-native-tuikit-atomic-x/lib/module/atomic-x/state/LiveAudienceState';

const liveID = 'xxx'; // The liveID of the current voice chat room or live streaming room
// Get the LiveAudienceState instance by liveID
const { kickUserOutOfRoom } = useLiveAudienceState(liveID);

const kickOut = () => {
  kickUserOutOfRoom({
    liveID: 'xxx', // The liveID of the current live room
    userID: userIDToKick, // The userID of the member to be removed
    onSuccess: () => {
      console.log(`Successfully removed user ${userID} from the room`);
      // After successful removal, you will receive the onAudienceLeft event
    },
    onError: (error) => {
      console.log(`Failed to remove user ${userID} from the room`, error);
    },
  });
};
```

#### 4.2 Set or Revoke Administrator Status

Manage users' administrator privileges using the `setAdministrator` and `revokeAdministrator` APIs.
``` typescript
import { useLiveAudienceState } from 'react-native-tuikit-atomic-x/lib/module/atomic-x/state/LiveAudienceState';

const liveID = 'xxx'; // The liveID of the current voice chat room or live streaming room
// Get the LiveAudienceState instance by liveID
const { setAdministrator, revokeAdministrator } = useLiveAudienceState(liveID);

// Promote a user to administrator
const promoteToAdmin = () => {
  setAdministrator({
    liveID: 'xxx', // The liveID of the current live room
    userID: userIDToAdmin, // The userID of the member to be promoted to administrator
    onSuccess: () => {
      console.log(`Successfully promoted user ${userID} to administrator`);
    },
    onError: (error) => {
      console.log(`Failed to promote user ${userID} to administrator`, error);
    },
  });
};

// Revoke a user's administrator status
const revokeAdmin = () => {
  revokeAdministrator({
    liveID: 'xxx', // The liveID of the current live room
    userID: userIDRevokeAdmin, // The userID of the administrator whose status will be revoked
    onSuccess: () => {
      console.log(`Successfully revoked administrator status for user ${userID}`);
    },
    onError: (error) => {
      console.log(`Failed to revoke administrator status for user ${userID}`, error);
    },
  });
};
```

## Advanced Features

### Display Welcome Messages When Audience Members Join

When a new audience member enters the live room, a welcome message is automatically shown locally in the live comments area, for example: "Welcome [User Nickname] to the live room".

#### Implementation

Subscribe to the `'onAudienceJoined'` event from `LiveAudienceState` to receive real-time notifications when new audience members join. Extract the new member's nickname and immediately call the `appendLocalTip` API from `BarrageState` to display the message in the live comments.
``` typescript
import { useEffect } from 'react';
import { useLiveAudienceState } from 'react-native-tuikit-atomic-x/lib/module/atomic-x/state/LiveAudienceState';
import { useBarrageState } from 'react-native-tuikit-atomic-x/lib/module/atomic-x/state/BarrageState';

const liveID = 'xxx'; // The liveID of the current voice chat room or live streaming room
// Get the LiveAudienceState instance by liveID
const { addAudienceListener } = useLiveAudienceState(liveID);
// Get the BarrageState instance by liveID
const { appendLocalTip } = useBarrageState(liveID);

useEffect(() => {
  addAudienceListener('onAudienceJoined', (event) => {
    const parsed = typeof event === 'string' ? JSON.parse(event) : event;
    const audienceData = typeof parsed.audience === 'string' ? JSON.parse(parsed.audience) : (parsed.audience || parsed);
    const name = audienceData.userName || audienceData.nickname || audienceData.userID || 'unknown';
    // Create a local tip message (according to SDK's actual message structure)
    const welcomeTip = {
      textContent: `Welcome ${name} to the live room!`,
      sender: {
        userID: audienceData.userID || '',
        userName: name,
        avatarURL: audienceData.avatarURL || '',
      },
      messageType: 0,
      sequence: Math.floor(Date.now() / 1000),
      timestampInSecond: Math.floor(Date.now() / 1000),
      liveID: liveID,
    };
    // Call BarrageStore API to insert it into the live comments list
    appendLocalTip({
      liveID,
      message: welcomeTip,
      onSuccess: () => {
        console.log(`Audience member ${name} joined the live room`);
      },
      onError: (error) => {
        console.log('Failed to insert live comment', error);
      },
    });
  });
}, []);
```

## API Documentation

For detailed information about all public APIs, properties, and methods of [LiveAudienceState](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/zh/v1.0/api/index.html#module-LiveAudienceState) and related classes, refer to the official API documentation for the AtomicXCore framework. The relevant State modules referenced in this document are listed below:

|**State**|**Description**|**API Documentation**|
|---------|---------|---------|
|`LiveAudienceState`|Audience management: Retrieve real-time audience list (ID / Name / Avatar), track audience count, monitor join/leave events.|[API Documentation](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/zh/v1.0/api/index.html#module-LiveAudienceState)|
|`BarrageState`|Live comments: Send text/custom comments, maintain comment list, monitor comment status in real time.|[API Documentation](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/zh/v1.0/api/index.html#module-BarrageState)|

## FAQs

### How is the online audience count (`audienceCount`) updated in `LiveAudienceState`? 

Audience count updates are not always strictly real-time. The mechanism works as follows:
- **Active Join/Leave**: When users join or leave the live room normally, audience count notifications are triggered instantly. You will see updates to `audienceCount` in `LiveAudienceState` immediately.

- **Unexpected Disconnects**: If users disconnect due to network issues or app crashes, a heartbeat mechanism determines their status. Only after 90 seconds of missed heartbeats will the system mark them as offline and send an audience count update.

- **Update Mechanism and Frequency Control**:

   - Whether triggered instantly or delayed, all audience count change notifications are broadcast as messages within the room.

   - Each room has a message rate limit of **40 messages per second**.

   - **Key Point:** In situations with extremely high message traffic (such as live comment storms or gift spamming), if the rate exceeds 40 messages per second, to prioritize essential messages (like live comments), **audience count change messages may be dropped due to rate limiting**.

      **What does this mean for developers?**

      `audienceCount` provides a highly accurate, near real-time **estimate**. However, in high-concurrency scenarios, you may see brief delays or occasional data loss. We recommend using `audienceCount` for **UI display purposes only**, not as the sole source for billing, statistics, or other scenarios requiring absolute accuracy.
