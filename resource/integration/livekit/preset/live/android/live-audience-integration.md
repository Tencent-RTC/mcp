**TUILiveKit**'s audience viewing page provides users with various and convenient live streaming and interaction features, enabling quick integration into your application to meet diverse audience needs.

## Feature Overview
- **Live streaming:** Clear and smooth viewing of the host's real-time live stream.

- **Interactive co-guest:** Apply for mic connection to interact with the host via audio and video.

- **Live information:** View the live streaming room title, description, and audience list, etc.

- **Live interactive:** Send a gift (with animation effects and host notification), like (with animation and real-time statistics), and interact via bullet screen.

| <strong>Live Streaming</strong> | <strong>Interactive co-guest</strong> | <strong>Live Information</strong> | <strong>Live Interactive</strong> |
| --- | --- | --- | --- |
|  | ### |  |  |

## Quick Start

### Step 1. Activate the Service

### Step 2. Code Integration

### Step 3. Add an Audience Viewing view

In your viewer watching **Activity**, initialize and add the `AudienceView` viewer watching view.

【Kotlin】
``` java

import android.os.Bundle
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import com.trtc.uikit.livekit.features.audienceview.AudienceView
import com.trtc.uikit.livekit.features.audienceview.AudienceViewDefine.AudienceViewListener
import io.trtc.tuikit.atomicxcore.api.live.LiveInfo

class AudienceActivity : AppCompatActivity() {
    lateinit var audienceView: AudienceView
    lateinit var listener: AudienceViewListener

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // 1. Create AudienceView
        audienceView = AudienceView(this)
        val roomId = "live_1236666"
        // 2. Initialize AudienceView
        audienceView.init(this, roomId)

        // 3. (Optional) Add AudienceContainerView event listeners
        listener = object : AudienceViewListener {

            override fun onLiveEnded(roomId: String, ownerName: String, ownerAvatarUrl: String) {
                finishAndRemoveTask()
            }

            override fun onClickFloatWindow() {
                // Picture-in-picture button click event. You can handle this event according to your business needs. Here's a code example: Clicking the picture-in-picture button will switch the current page to picture-in-picture mode.
                enterPictureInPictureMode()
            }

            override fun onClickCloseButton(liveInfo: LiveInfo) {
                Log.i("TAG", "onClickCloseButton liveInfo: $liveInfo")
                finishAndRemoveTask()
            }
        }
        audienceView.addListener(listener)
        // 4. Add AudienceContainerView to the interface
        setContentView(audienceView)
    }

    override fun onDestroy() {
        // 5. (Optional) If you added event listeners, you need to remove the listeners when the page is destroyed.
        audienceView.removeListener(listener)
        super.onDestroy()
    }
}
```

### Step 4. Navigate to the **Audience Viewing** view

Usually in the live stream list, use the following code example when you need to jump to the viewer watching page:

【Kotlin】
``` java
fun startActivity(context: Context) {
    val intent = Intent(context, YourAudienceActivity::class.java)
    context.startActivity(intent)
}
```

## Customize Your UI Layout

### Customize the `AudienceView` Feature Area
- Customize the audience interface by referring to the Core Audience Page Modify the UI styles and add your business components in AudienceView.

- Customize video-slot widgets by referring to Adjust Live Streaming Widgets. Modify the UI of nameplates, avatar decorations, and other elements on the video slot in AudienceView.

### Text Customization (String Resources)

TUILiveKit uses standard **Android XML resource files** to manage the text displayed in the UI. You can directly modify the strings that need adjustment via the XML file:

### Icon Customization (Drawable Resources)

TUILiveKit uses the standard **Android drawable resource** folder to manage the image resources for the UI. You can quickly change the custom icons by replacing the resource files. When replacing, ensure that the new file names are consistent with the original file names.

## Next Steps

Congratulations! You have successfully integrated **Audience Viewing**. Next, you can implement features such as **host streaming**, **live stream list** and **gift system**. Please
| <strong>Feature</strong> | <strong>Description</strong> | <strong>Integration Guide</strong> |
| --- | --- | --- |
| <strong>Host Streaming</strong> | The complete workflow for a host to start a stream, including pre-stream setup and various in-stream interactions. | Host Streaming |
| <strong>Live Stream List</strong> | Display the live stream list interface and features, including the live stream list and room information display. | Live Stream List |
| <strong>Gift System</strong> | Support custom gift asset configuration, billing system integration, and gift-sending in PK scenarios. | Gift System |

## FAQs

### Why is the video screen black when a viewer selects video co-hosting?

Please go to **App Info > Permissions > Camera** and check if the **camera permission** is enabled.

### Why can't other viewers in the live room see the barrage content sent by a viewer?
- **Reason 1**: First check the network connection to ensure the viewer's device network is normal.

- **Reason 2**: The viewer has been **muted (banned)** by the host and cannot send barrage.

- **Reason 3**: The viewer's barrage content involves **keyword blocking**. Please confirm whether the content sent by the viewer complies with the live room rules.
