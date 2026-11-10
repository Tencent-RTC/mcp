---
sync_node_id: '207623915926401024'
nav_path:
  - "视频会议 SDK"
  - "无 UI 集成"
  - "搭建多人会议"
  - "成员管理"
  - "成员管理（Flutter）"
product: "room"
---
`RoomParticipantStore` is a specialized module in `AtomicXCore` for managing participants within a conference room. It provides robust features designed for multi-party scenarios, enabling you to build a complete participant management system for your application.

## Core Features
- **Get the participant list**: Retrieve details for everyone currently in the room.

- **Transfer room ownership**: The current owner can transfer ownership to another participant.

- **Grant/revoke admin role**: The owner can promote participants to admins and revoke admin privileges.

- **Remove a participant**: The owner or an admin can remove a participant from the room.

- **Update participant profile**: Participants can update their own in-room profile information.

- **Manage audio/video devices**: Invite participants to enable camera/mic, remotely turn off another participant’s camera/mic, and (for owners/admins) mute all or disable all video.

## Core Concepts

The core concepts of `RoomParticipantStore` is summarized as follows:
| Core Concept | Key Responsibilities & Description |
| --- | --- |
| <a href="https://tencent-rtc.github.io/TUIKit_Flutter/api_room_room_participant_store/RoomParticipant-class.html">RoomParticipant</a> | Represents the participant data model, encapsulating participant information and state management.<br>Main functions include managing participant basic information (user ID, user name, user avatar, in-room role) and managing device status (microphone, camera, screen sharing, message status). |
| <a href="https://tencent-rtc.github.io/TUIKit_Flutter/api_room_room_participant_store/RoomParticipantState-class.html">RoomParticipantState</a> | Represents the participant state management structure, responsible for maintaining participant-related state information in the room. Main properties:<br>-  <code>participantList</code>collection of all participant information in the current room.<br>-  <code>participantListCursor</code>snapshot for paginated participant list.<br>-  <code>localParticipant</code>current user's participant information in the room. |
| <a href="https://tencent-rtc.github.io/TUIKit_Flutter/api_room_room_participant_store/RoomParticipantListener-class.html">RoomParticipantListener</a> | Represents real-time participant events in the room. Main categories: participant join/leave, role changes, device control events. |
| <a href="https://tencent-rtc.github.io/TUIKit_Flutter/api_room_room_participant_store/RoomParticipantStore-class.html">RoomParticipantStore</a> | Core class for participant control. Features: manage participant audio/video status, perform participant operations, receive real-time events via <code>participantEventPublisher</code>. |

## Implementation Steps

### Step 1: Integrate Components

Follow the Integration Overview to add the **AtomicXCore SDK**. Complete the Login Logic Implementation before proceeding.

### Step 2: Retrieve the Participant List

After entering the room, use `RoomParticipantStore.getParticipantList` to get the list of all participants.
``` java
import 'package:atomic_x_core/atomicxcore.dart';

Future<void> getParticipantList() async {
  // Prerequisite: Enter the room and create a RoomParticipantStore instance with roomID
  final participantStore = RoomParticipantStore.create("your_room_id");

  // Fetch the participant list, starting from the first page (pagination supported)
  final String? initialCursor = null;  // null starts from the first page

  final result = await participantStore.getParticipantList(initialCursor);

  if (result.isSuccess) {
    print("Successfully retrieved participant list, count: ${result.data?.length ?? 0}");
  } else {
    print("Failed to retrieve participant list [Error code: ${result.errorCode}]: ${result.errorMessage}");
  }
}
```

### Step 3: Search Room Members

After entering the room, use `RoomParticipantStore.searchUsers` to search for members by username.
``` java
import 'package:atomic_x_core/atomicxcore.dart';

Future<void> searchUsers() async {
  // Prerequisite: Enter the room and create RoomParticipantStore with roomID
  final participantStore = RoomParticipantStore.create("your_room_id");

  // Search for room members using username as a keyword
  final keyword = "userName";

  final result = await participantStore.searchUsers(keyword);

  if (result.isSuccess) {
    print("Successfully searched room members, count: ${result.data?.length ?? 0}");
  } else {
    print("Failed to search room members [Error code: ${result.errorCode}]: ${result.errorMessage}");
  }
}
```

### Step 4: Transfer the Room Ownership

**Room owners** can use `RoomParticipantStore.transferOwner` to transfer ownership to any participant. After transfer, the previous owner becomes a regular participant. Only one owner is allowed per room.
``` java
import 'package:atomic_x_core/atomicxcore.dart';

Future<void> transferOwner(String userID) async {
  // Prerequisite: Enter the room and create RoomParticipantStore with roomID
  final participantStore = RoomParticipantStore.create("your_room_id");

  // Only the current owner can perform this operation
  final result = await participantStore.transferOwner(userID);

  if (result.isSuccess) {
    print("Ownership transferred successfully, new owner: $userID");
  } else {
    print("Failed to transfer ownership [Error code: ${result.errorCode}]: ${result.errorMessage}");
  }
}
```

**Participants** can listen for ownership changes via the `onOwnerChanged` event in `RoomParticipantListener`.
``` java
import 'package:atomic_x_core/atomicxcore.dart';

late RoomParticipantListener _participantListener;

void subscribeParticipantEvent() {
  // Prerequisite: Enter the room and create RoomParticipantStore with roomID
  final participantStore = RoomParticipantStore.create("your_room_id");

  _participantListener = RoomParticipantListener(
    onOwnerChanged: (RoomUser newOwner, RoomUser oldOwner) {
      print("Ownership change notification, newOwner: ${newOwner.userName}, oldOwner: ${oldOwner.userName}");
    },
  );

  participantStore.addRoomParticipantListener(_participantListener);
}

void unsubscribeParticipantEvent() {
  final participantStore = RoomParticipantStore.create("your_room_id");
  participantStore.removeRoomParticipantListener(_participantListener);
}
```

### Step 5: Assign or Revoke the Administrator

**Room owners** can assign any member as an administrator using `RoomParticipantStore.setAdmin`, or revoke privileges with `RoomParticipantStore.revokeAdmin`.
``` java
import 'package:atomic_x_core/atomicxcore.dart';

// Prerequisite: Enter the room and create RoomParticipantStore with roomID
final participantStore = RoomParticipantStore.create("your_room_id");

/// Assign user as administrator
Future<void> setUserAsAdmin(String userID) async {
  final result = await participantStore.setAdmin(userID);

  if (result.isSuccess) {
    print("Successfully assigned user $userID as administrator");
  } else {
    print("Failed to assign administrator [Error code: ${result.errorCode}]: ${result.errorMessage}");
  }
}

/// Revoke user's administrator privileges
Future<void> revokeUserAdmin(String userID) async {
  final result = await participantStore.revokeAdmin(userID);

  if (result.isSuccess) {
    print("Successfully revoked administrator privileges for user $userID");
  } else {
    print("Failed to revoke administrator [Error code: ${result.errorCode}]: ${result.errorMessage}");
  }
}
```

**Participants** can listen for role change notifications using the `onAdminSet` and `onAdminRevoked` events in `RoomParticipantListener`.
``` java
import 'package:atomic_x_core/atomicxcore.dart';

final participantStore = RoomParticipantStore.create("your_room_id");
late RoomParticipantListener _participantListener;

/// Subscribe to participant-related events
void subscribeParticipantEvents() {
  _participantListener = RoomParticipantListener(
    onAdminSet: (RoomUser userInfo) {
      print("Administrator assignment event notification, userInfo: ${userInfo.userName}");
    },
    onAdminRevoked: (RoomUser userInfo) {
      print("Administrator revocation event notification, userInfo: ${userInfo.userName}");
    },
  );

  participantStore.addRoomParticipantListener(_participantListener);
}

/// Unsubscribe from participant-related events
void unsubscribeParticipantEvents() {
  participantStore.removeRoomParticipantListener(_participantListener);
}
```

### Step 6: Remove Participant from Room

**Room owners or administrators** can call `RoomParticipantStore.kickUser` to remove a participant from the room.
``` java
import 'package:atomic_x_core/atomicxcore.dart';

final participantStore = RoomParticipantStore.create("your_room_id");

Future<void> kickUser(String userID) async {
  // Only the room owner or administrator can perform this operation. The removed user will exit the room and receive a notification.
  final result = await participantStore.kickUser(userID);

  if (result.isSuccess) {
    print("User removed successfully, removed user: $userID");
  } else {
    print("Failed to remove user [Error code: ${result.errorCode}]: ${result.errorMessage}");
  }
}
```

**Participants** can listen for removal notifications using the `onKickedFromRoom` event in `RoomParticipantListener`.
``` java
import 'package:atomic_x_core/atomicxcore.dart';

final participantStore = RoomParticipantStore.create("your_room_id");
late RoomParticipantListener _participantListener;

/// Subscribe to participant-related events
void subscribeParticipantEvent() {
  _participantListener = RoomParticipantListener(
    onKickedFromRoom: (KickedOutOfRoomReason reason, String message) {
      print("Removed from room, reason: $reason, additional info: $message");
    },
  );

  participantStore.addRoomParticipantListener(_participantListener);
}

/// Unsubscribe from participant-related events
void unsubscribeParticipantEvent() {
  participantStore.removeRoomParticipantListener(_participantListener);
}
```

### Step 7: Update Participant Information

After entering the room, use `updateParticipantNameCard` and `updateParticipantMetaData` in `RoomParticipantStore` to update your participant information, including name card and custom metadata.
``` java
import 'package:atomic_x_core/atomicxcore.dart';

final participantStore = RoomParticipantStore.create("your_room_id");

Future<void> updateParticipantNameCard(String userID, String nameCard) async {
  // Use this method to update the name card for a participant. Only administrators or the user themselves can typically modify the name card.
  final result = await participantStore.updateParticipantNameCard(
    userID: userID,
    nameCard: nameCard,
  );

  if (result.isSuccess) {
    print("Name card updated successfully, user: $userID, new name card: $nameCard");
  } else {
    print("Failed to update name card [Error code: ${result.errorCode}]: ${result.errorMessage}");
  }
}

Future<void> updateParticipantMetaData(String userID, Map<String, String> metaData) async {
  // Use this method to update custom metadata for a participant. There are limits on key/value sizes: key ≤ 50 bytes, value ≤ 200 bytes.
  final result = await participantStore.updateParticipantMetaData(
    userID: userID,
    metaData: metaData,
  );

  if (result.isSuccess) {
    print("Custom metadata updated successfully, user: $userID, key count: ${metaData.length}");
  } else {
    print("Failed to update custom metadata [Error code: ${result.errorCode}]: ${result.errorMessage}");
  }
}
```

### Step 8: Invite a Participant to Enable Device

**Room owners or administrators** can call `RoomParticipantStore.inviteToOpenDevice` to invite users to enable their camera or microphone.
``` java
import 'package:atomic_x_core/atomicxcore.dart';

final participantStore = RoomParticipantStore.create("your_room_id");

Future<void> inviteUserToOpenDevice(String userID, DeviceType device, {int timeout = 30}) async {
  // Invite a user to enable a device (microphone, camera, or screen sharing). The invited user will receive a notification and can accept or decline.
  final result = await participantStore.inviteToOpenDevice(
    userID: userID,
    device: device,
    timeout: timeout,
  );

  if (result.isSuccess) {
    print("Device invitation sent successfully, user: $userID, device: $device");
  } else {
    print("Failed to send device invitation [Error code: ${result.errorCode}]: ${result.errorMessage}");
  }
}
```

**Participants** should:
- Subscribe to `onDeviceInvitationReceived` in `RoomParticipantListener` to receive device invitations.

- Call `acceptOpenDeviceInvitation` or `declineOpenDeviceInvitation` to respond.

   ``` java
   import 'package:atomic_x_core/atomicxcore.dart';
   
   final participantStore = RoomParticipantStore.create("your_room_id");
   late RoomParticipantListener _participantListener;
   
   /// Subscribe to device invitation events
   void subscribeDeviceInvitationEvent() {
     _participantListener = RoomParticipantListener(
       onDeviceInvitationReceived: (invitation) {
         print("Received device invitation - device: ${invitation.device}, sender: ${invitation.senderUserName}");
         // Handle accepting or declining device invitation
       },
     );
     participantStore.addRoomParticipantListener(_participantListener);
   }
   
   /// Unsubscribe when not needed
   void unsubscribeDeviceInvitationEvent() {
     participantStore.removeRoomParticipantListener(_participantListener);
   }
   
   Future<void> acceptOpenDeviceInvitation(String userID, DeviceType device) async {
     final result = await participantStore.acceptOpenDeviceInvitation(
       userID: userID,
       device: device,
     );
   
     if (result.isSuccess) {
       print("Accepted device invitation successfully - device: $device");
     } else {
       print("Failed to accept device invitation [Error code: ${result.errorCode}]: ${result.errorMessage}");
     }
   }
   
   Future<void> declineOpenDeviceInvitation(String userID, DeviceType device) async {
     final result = await participantStore.declineOpenDeviceInvitation(
       userID: userID,
       device: device,
     );
   
     if (result.isSuccess) {
       print("Declined device invitation successfully - device: $device");
     } else {
       print("Failed to decline device invitation [Error code: ${result.errorCode}]: ${result.errorMessage}");
     }
   }
   ```

### Step 9: Close Remote Participant Device

**Room owners or administrators** can use `RoomParticipantStore.closeParticipantDevice` to forcefully close a participant's camera or microphone.
``` java
import 'package:atomic_x_core/atomicxcore.dart';

final participantStore = RoomParticipantStore.create("your_room_id");

Future<void> closeParticipantDevice(String userID, DeviceType device) async {
  // The affected user will receive a device closed notification
  final result = await participantStore.closeParticipantDevice(
    userID: userID,
    device: device,
  );

  if (result.isSuccess) {
    print("Closed participant device successfully - user: $userID, device: $device");
  } else {
    print("Failed to close participant device: [Error code: ${result.errorCode}]: ${result.errorMessage}");
  }
}
```

**Participants** can listen for device closure notifications:
``` java
import 'package:atomic_x_core/atomicxcore.dart';

final participantStore = RoomParticipantStore.create("your_room_id");
late RoomParticipantListener _participantListener;

/// Subscribe to device closed events
void subscribeDeviceClosedEvent() {
  _participantListener = RoomParticipantListener(
    onParticipantDeviceClosed: (device, operatorUser) {
      print("Device closed - device: $device, operator: ${operatorUser.userName}");
    },
  );
  participantStore.addRoomParticipantListener(_participantListener);
}

/// Unsubscribe when not needed
void unsubscribeDeviceClosedEvent() {
  participantStore.removeRoomParticipantListener(_participantListener);
}
```

### Step 10: Request to Enable Device

**Participants** can call `requestToOpenDevice` in `RoomParticipantStore` to request permission to enable their camera or microphone if mute all or disable all video is active.
``` java
import 'package:atomic_x_core/atomicxcore.dart';

final participantStore = RoomParticipantStore.create("your_room_id");

Future<void> requestToOpenDevice(DeviceType device, {int timeout = 30}) async {
  // Participants can request to enable microphone, camera, or screen sharing. Owners and administrators will receive the request and can approve or reject it.
  final result = await participantStore.requestToOpenDevice(
    device: device,
    timeout: timeout,
  );

  if (result.isSuccess) {
    print("Device enable request sent successfully - device: $device");
  } else {
    print("Failed to send device enable request [Error code: ${result.errorCode}]: ${result.errorMessage}");
  }
}
```

**Owners or admins** should:
- Subscribe to `onDeviceRequestReceived` in `RoomParticipantListener` to receive device requests.

- Use `approveOpenDeviceRequest` or `rejectOpenDeviceRequest` to respond.

   ``` java
   import 'package:atomic_x_core/atomicxcore.dart';
   
   final participantStore = RoomParticipantStore.create("your_room_id");
   late RoomParticipantListener _participantListener;
   
   /// Subscribe to device request events
   void subscribeDeviceRequestEvent() {
     _participantListener = RoomParticipantListener(
       onDeviceRequestReceived: (request) {
         print("Received device request - user: ${request.senderUserName}, device: ${request.device}");
         // Approve or reject device enable request
       },
     );
     participantStore.addRoomParticipantListener(_participantListener);
   }
   
   /// Unsubscribe when not needed
   void unsubscribeDeviceRequestEvent() {
     participantStore.removeRoomParticipantListener(_participantListener);
   }
   
   Future<void> approveOpenDeviceRequest(DeviceType device, String userID) async {
     final result = await participantStore.approveOpenDeviceRequest(
       device: device,
       userID: userID,
     );
   
     if (result.isSuccess) {
       print("Approved device request successfully - user: $userID, device: $device");
     } else {
       print("Failed to approve device request: ${result.errorMessage}");
     }
   }
   
   Future<void> rejectOpenDeviceRequest(DeviceType device, String userID) async {
     final result = await participantStore.rejectOpenDeviceRequest(
       device: device,
       userID: userID,
     );
   
     if (result.isSuccess) {
       print("Rejected device request successfully - user: $userID, device: $device");
     } else {
       print("Failed to reject device request [Error code: ${result.errorCode}]: ${result.errorMessage}");
     }
   }
   ```

### Step 11: Mute All / Disable All Cameras

**Room owners or administrators** can use `RoomParticipantStore.disableAllDevices` to mute all microphones or disable all cameras for participants. When enabled, participants cannot turn on their microphone or camera independently and must request approval.
``` java
import 'package:atomic_x_core/atomicxcore.dart';

final participantStore = RoomParticipantStore.create("your_room_id");

Future<void> disableAllDevices(DeviceType device, bool disable) async {
  // Mute/unmute all microphones or enable/disable all cameras. Participants will receive notifications.
  final result = await participantStore.disableAllDevices(
    device: device,
    disable: disable,
  );

  final action = disable ? "Disable" : "Enable";
  if (result.isSuccess) {
    print("$action all $device successfully");
  } else {
    print("$action all $device failed [Error code: ${result.errorCode}]: ${result.errorMessage}");
  }
}
```

**Participants** can monitor mute all or disable all camera commands via `onAllDevicesDisabled` in `RoomParticipantListener` and update their UI accordingly.
``` java
import 'package:atomic_x_core/atomicxcore.dart';

final participantStore = RoomParticipantStore.create("your_room_id");
late RoomParticipantListener _participantListener;

/// Set global device event listener
void subscribeAllDevicesDisabledEvent() {
  _participantListener = RoomParticipantListener(
    onAllDevicesDisabled: (device, disable, operatorUser) {
      final action = disable ? "Disable" : "Enable";
      print("All $device have been $action - operator: ${operatorUser.userName}");
    },
  );
  participantStore.addRoomParticipantListener(_participantListener);
}

/// Unsubscribe when not needed
void unsubscribeAllDevicesDisabledEvent() {
  participantStore.removeRoomParticipantListener(_participantListener);
}
```

### Step 12: Listen for Participant Events and Status

Subscribe to participant-related events using `RoomParticipantListener`. For example, to listen for participant join and leave events:
``` java
import 'package:atomic_x_core/atomicxcore.dart';

final participantStore = RoomParticipantStore.create("your_room_id");
late RoomParticipantListener _participantListener;

/// Set participant event listener
void subscribeParticipantEvent() {
  _participantListener = RoomParticipantListener(
    onParticipantJoined: (participant) {
      print("Participant joined room - user: ${participant.userName}, ID: ${participant.userID}");
    },
    onParticipantLeft: (participant) {
      print("Participant left room - user: ${participant.userName}, ID: ${participant.userID}");
    },
  );
  participantStore.addRoomParticipantListener(_participantListener);
}

/// Unsubscribe when not needed
void unsubscribeParticipantEvent() {
  participantStore.removeRoomParticipantListener(_participantListener);
}
```

Monitor participant property state changes via `RoomParticipantState`, for example, to track who is currently speaking:
``` java
import 'package:atomic_x_core/atomicxcore.dart';

final participantStore = RoomParticipantStore.create("your_room_id");

/// Use ValueListenableBuilder to monitor participant state
Widget buildSpeakingUsersWidget() {
  return ValueListenableBuilder(
    valueListenable: participantStore.state.speakingUsers,
    builder: (context, speakingUsers, child) {
      print("Speaking user state changed - current speaking user count: ${speakingUsers.length}");
      // Build UI based on speakingUsers
      return Container();
    },
  );
}
```

## API Documentation

|**Store**|**Feature Description**|**API Documentation**|
|---------|---------|---------|
|**RoomParticipantStore**|Manage participants in the room: assign admin roles, transfer ownership, retrieve participant list, remove participants, control participant devices (e.g., close, invite to enable camera/microphone), request device enable (e.g., request to enable camera/microphone).|[API Documentation](https://tencent-rtc.github.io/TUIKit_Flutter/api_room_room_participant_store/RoomParticipantStore-class.html)|
