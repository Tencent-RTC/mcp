---
sync_node_id: '194188956031811584'
nav_path:
  - "直播与语聊 SDK"
  - "语聊房"
  - "观众观看"
  - "观众观看（Android）"
product: "live"
---
`TUILiveKit` Voice Chat Room provides a comprehensive, ready-to-use interface for pure audio live streaming scenarios. It allows you to quickly implement essential features such as audience listening and mic interaction, eliminating the need to manage complex UI or seat management logic yourself.

## Feature Overview
- **Listen to Live Streams**: Hear the host’s real-time audio stream with clarity and low latency.

- **Co-guest**: Request to join the mic and interact with the host via audio.

- **Live Information**: View room announcements and see the list of online audience members.

- **Live Interaction**: Engage with features such as bullet comments, gifts, and likes.

## Quick Integration

### Integrate the Component

Follow the Preparation guide to integrate `TUILiveKit` into your project.

### Launch the Voice Chat Room Activity

The `VoiceRoomActivity` component provides a complete audience-side UI and business logic for the voice chat room. Simply launch this `Activity` to allow users to join a live room. Typically, when a user selects a room from the Live Stream List, you should navigate to the audience view. See the example below:
``` java
import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.trtc.uikit.livekit.voiceroom.VoiceRoomActivity
import com.trtc.uikit.livekit.voiceroom.VoiceRoomDefine

// YourLiveListActivity represents your live room list page
class YourLiveListActivity : AppCompatActivity() {

    // Handle "click live room" event
    fun onJoinVoiceRoomClicked(roomId: String) {

        // 1. Prepare the Intent and pass the required parameters
        //    - roomId: The ID of the live room you want to join
        //    - behavior: VoiceRoomDefine.RoomBehavior.JOIN means joining the room as an "audience"
        val intent = Intent(this, VoiceRoomActivity::class.java).apply {
            putExtra(VoiceRoomActivity.INTENT_KEY_ROOM_ID, roomId)
            putExtra(VoiceRoomActivity.INTENT_KEY_ROOM_BEHAVIOR, JOIN.ordinal)
        }

        // 2. Navigate to the voice chat room page
        startActivity(intent)
    }
}
```
- **Intent Extra Parameter Description:**

| <strong>Parameter</strong> | <strong>Type</strong> | <strong>Description</strong> |
| --- | --- | --- |
| <code>VoiceRoomActivity.INTENT_KEY_ROOM_ID</code> | <code>string</code> | Globally unique live room ID. |
| <code>VoiceRoomActivity.INTENT_KEY_ROOM_BEHAVIOR</code> | <code>Int</code> | Room entry behavior:<br>- <code>AUTO_CREATE</code>: Automatically create and enter a live room.<br>- <code>PREPARE_CREATE</code>: Enter the pre-live preview page first, then create and enter the live room after the user clicks "Start Live".<br>- <code>JOIN</code>: Join the room as an audience member. |

## Customize UI

`TUILiveKit` supports UI customization to meet a variety of business needs. You can easily modify interface text and icons.

### Text Customization (String Resources)

`TUILiveKit` uses standard **Android XML resource files** to manage the text displayed in the UI. You can directly modify the strings that need adjustment via the XML file:

### Icon Customization (Drawable Resources)

`TUILiveKit` uses the standard **Android drawable resource** folder to manage the image resources for the UI. You can quickly change the custom icons by replacing the resource files. When replacing, ensure that the new file names are consistent with the original file names.

## Next Steps

You have successfully integrated **Audience Viewing**. Next, implement additional features such as **host broadcasting**, **live stream list** and **gift system**. See the table below for details:

|**Feature**|**Description**|**Integration Guide**|
|---------|---------|---------|
|**Host Broadcasting**|Complete host live streaming workflow, including pre-live preparation and interactive features after going live.|Integration Guide|
|**Live Stream List**|Display the live room list UI and features, including room list and room information display.|Integration Guide|
|**Gift System**|Support custom gift asset configuration, billing system integration, and gift-sending in PK scenarios.|Integration Guide|

## FAQs

### No sound when an audience member after co-guest?

Ensure the app has microphone permission. Go to your device’s `App Info > Permissions > Microphone` and verify that microphone access is enabled.

### Bullet comments sent by an audience member are not visible to others in the room?

There are 3 reasons you can
- Check the network connection to ensure the audience member’s device is online.

- The audience member has been muted by the host and cannot send bullet comments.

- The bullet comment contains blocked keywords. Confirm that the comment complies with room rules.
