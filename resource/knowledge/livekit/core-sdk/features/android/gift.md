`GiftStore` is a dedicated module within **AtomicXCore** for managing live room gifting features. It enables you to build a complete gifting system for your live streaming application, supporting robust monetization and interactive experiences.

## Core Features
- **Gift List Retrieval**: Retrieve gift panel data from the server, including gift categories and details.

- **Send Gift**: Viewers can send selected gifts and specify the quantity to the host.

- **Gift Event Broadcast:** Receive real-time gift events in the room for displaying gift animations and barrage notifications.

## Core Concepts

|**Core Concept**|**Type**|**Core Responsibilities & Description**|
|---------|---------|---------|
|`Gift`|`data class`|Represents a gift data model, including ID, name, icon URL, animation resource URL (resourceURL), price (coins), and more.|
|`GiftCategory`|`data class`|Represents a gift category (e.g., "Popular", "Luxury"). Contains the category name and a list of Gift objects.|
|`GiftState`|`data class`|Represents the current state of the gift module. The core property, usableGifts, is a StateFlow containing the full gift list from the server.|
|`GiftEvent`|`abstract class`|Defines the event listener for gift events in the live room. Currently, only onReceiveGift is available; all users in the room receive this event when any user sends a gift.|
|`GiftStore`|`abstract class`|The core management class for gift features. Use it to fetch the gift list, send gifts, and receive gift events via listeners.|

## Implementation

### Step 1: Component Integration

> **Note：**
> To use the gifting system, activate either the **Free Trial,** or **Pro** edition. The number of configurable gifts depends on the selected package. For details, see the **Gift System** section in Feature and Billing Description and choose the package that fits your needs.
>

- **Video Live Streaming**: Please .

- **Voice Chat Room**: Please .

### Step 2: Initialize and Listen for Gift Events

Obtain a `GiftStore` instance and set up listeners to receive gift events and updates to the gift list.

#### Implementation
1. **Get Instance**: Use `GiftStore.create(liveID)` to obtain a `GiftStore` instance for the current live room.

2. **Add Listener**: Add a `GiftListener` to receive `onReceiveGift` events.

3. **Subscribe to State**: Subscribe to `giftStore.giftState.usableGifts`to receive gift list updates.

#### Code Example
``` kotlin
import io.trtc.tuikit.atomicxcore.api.gift.Gift
import io.trtc.tuikit.atomicxcore.api.gift.GiftCategory
import io.trtc.tuikit.atomicxcore.api.gift.GiftListener
import io.trtc.tuikit.atomicxcore.api.gift.GiftStore
import io.trtc.tuikit.atomicxcore.api.live.LiveUserInfo
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class GiftManager(
    private val liveId: String
) {
    private val giftStore: GiftStore = GiftStore.create(liveId)
    private val coroutineScope = CoroutineScope(Dispatchers.Main)
    // Expose gift list externally
    private val _giftList = MutableStateFlow<List<GiftCategory>>(emptyList())
    val giftList: StateFlow<List<GiftCategory>> = _giftList.asStateFlow()
    private val giftListener = object : GiftListener() {
        override fun onReceiveGift(liveID: String, gift: Gift, count: Int, sender: LiveUserInfo) {
            // Forward event to UI layer for processing
        }
    }

    init {
        setupGiftListener()
        subscribeToGiftState()
    }

    // Subscribe to gift events
    private fun setupGiftListener() {
        giftStore.addGiftListener(giftListener)
    }

    // Subscribe to gift list state
    private fun subscribeToGiftState() {
        coroutineScope.launch(Dispatchers.Main) {
            giftStore.giftState.usableGifts.collect { giftList ->
                _giftList.value = giftList
            }
        }
    }
}
```

#### Gift List Structure Parameters
- **GiftCategory Parameter Description**

   |**Parameter**|**Type**|**Description**|
   |---------|---------|---------|
   |`categoryID`|`String`|Unique ID of the gift category.|
   |`name`|`String`|Display name of the gift category.|
   |`desc`|`String`|Description of the gift category.|
   |`extensionInfo`|`Map<String, String>`|Extension information field.|
   |`giftList`|`List`|Array of Gift objects in this category.|

- **Gift Parameter Description**

   |**Parameter**|**Type**|**Description**|
   |---------|---------|---------|
   |`giftID`|`String`|Unique ID of the gift.|
   |`name`|`String`|Display name of the gift.|
   |`desc`|`String`|Description of the gift.|
   |`iconURL`|`String`|Gift icon URL.|
   |`resourceURL`|`String`|Gift animation resource URL.|
   |`level`|`Long`|Gift level.|
   |`coins`|`Long`|Gift price.|
   |`extensionInfo`|`Map<String, String>`|Extension information field.|

### Step 3: Retrieve Gift List

Call the `refreshUsableGifts` method to fetch gift data from the server.

#### Implementation
1. **Call API**: Call `giftStore.refreshUsableGifts()` at the appropriate time (e.g., after entering the live room).

2. **Handle Callback**: Optionally handle the completion callback to determine the result.

3. **Receive Data**: After a successful fetch, the updated usableGifts list is delivered automatically via your subscription to `giftStore.giftState.usableGifts`.

#### Code Example
``` kotlin
class GiftManager(
    private val liveId: String
) {
    private val giftStore: GiftStore = GiftStore.create(liveId)

    // Refresh the gift list from the server
    fun fetchGiftList() {
        giftStore.refreshUsableGifts(object : CompletionHandler {
            override fun onSuccess() {
                println("Gift list fetched successfully")
                // Data will be updated via the giftState subscription
            }

            override fun onFailure(code: Int, desc: String) {
                println("Failed to fetch gift list: $desc")
            }
        })
    }
}
```

### Step 4: Send Gift

When a user selects a gift and clicks send, call the `sendGift` API.

#### Implementation
1. **Get Parameters**: Obtain the selected `giftID` and `quantity (count)` from the UI.

2. **Call API**: Call `giftStore.sendGift(giftID, count, completion)`.

3. **Handle Callback**: Use the completion `callback` to handle failures (e.g., insufficient balance). UI updates (animations, barrage) after a successful send should be triggered by the `onReceiveGift` event.

#### Code Example
``` kotlin
class GiftManager(
    private val liveId: String
) {
    private val giftStore: GiftStore = GiftStore.create(liveId)

    // Send a gift
    fun sendGift(giftID: String, count: Int) {
        giftStore.sendGift(giftID, count, object : CompletionHandler {
            override fun onSuccess() {
                println("Gift $giftID sent successfully")
                // All users, including the sender, will receive the onReceiveGift event
            }

            override fun onFailure(code: Int, desc: String) {
                println("Gift send failed: $desc")
                // Prompt user if needed, e.g., "Insufficient balance" or "Network error"
            }
        })
    }
}
```

#### **sendGift API Parameters**

|**Parameter Name**|**Type**|**Description**|
|---------|---------|---------|
|`giftID`|`String`|Unique ID of the gift to send.|
|`count`|`Int`|Number of gifts to send.|
|`completion`|`CompletionHandler?`|Callback invoked after sending completes.|

## Advanced Features

The capabilities of `GiftStore` are closely tied to your backend services. This section explains how to build a feature-rich gifting system through server-side configuration and client integration.

### Gift Asset Configuration

Customize available gift types, categories, names, icons, prices, and animation effects to meet your operational and branding requirements.

#### Implementation
1. **Server-Side Configuration**: Use the `LiveKit` server REST API to manage gift information, categories, and multi-language support. See the Gift Configuration Guide.

2. **Client Fetch**: On the client, call `refreshUsableGifts` to retrieve configuration data.

3. **UI Display**: Use the retrieved `List<GiftCategory>` to populate the gift panel.

#### Configuration Sequence Diagram

#### Related REST API Interfaces Overview
| <strong>Interface Category</strong> | <strong>Interface</strong> | <strong>Request Example</strong> |
| --- | --- | --- |
| <strong>​Gift Management</strong> | Add Gift Information | Example |
| Delete Gift Information | Example |  |
| Query Gift Information | Example |  |
| <strong>Gift Category Management</strong> | Add Gift Category Information | Example |
| Delete Specific Gift Category Information | Example |  |
| Get Specific Gift Category Information | Example |  |
| <strong>Gift Relationship Management</strong> | Add Relationship between a Specific Gift Category and Gift | Example |
| Delete Relationship between a Specific Gift Category and Gift | Example |  |
| Get Gift Relationships under a Specific Gift Category | Example |  |
| <strong>Gift Multi-language Management</strong> | Add Gift Multi-language Information | Example |
| Delete Specific Gift Multi-language Information | Example |  |
| Get Gift Multi-language Information | Example |  |
| Add Gift Category Multi-language Information | Example |  |
| Delete Specific Gift Category Multi-language Information | Example |  |
| Get Gift Category Multi-language Information | Example |  |

### Billing and Gift Deduction Process

When a viewer sends a gift, ensure their account balance is sufficient and complete the deduction before triggering the gift effect playback and broadcast.

#### Implementation
1. **Backend Callback Configuration**: Configure your billing system's callback URL in the LiveKit backend. See Callback Configuration Documentation.

2. **Client Send**: The client calls `sendGift`.

3. **Backend Interaction**: The LiveKit backend calls your callback URL; your billing system processes the deduction and returns the result.

4. **Result Synchronization**: If successful, **AtomicXCore** broadcasts the `onReceiveGift` event; if failed, the completion callback of sendGift receives an error.

#### Call Flow

#### Related REST API Interfaces Overview

|**Interface**|**Description**|**Request Example**|
|---------|---------|---------|
|**Callback Configuration - Callback before sending a gift**|The customer's backend can use this callback to decide whether to pass pre-gifting checks, etc.|Example|

### Implement Full-Screen Gift Animation Playback

When a user sends a luxury gift (e.g., "Rocket", "Carnival"), play a full-screen animation (such as SVGA) to enhance engagement.

#### Implementation

**AtomicXCore** does not include a built-in gift animation player. Integrate a third-party library based on your requirements. Below is a comparison of two options:

|**Comparison Item**|**Basic Solution (SVGAPlayer)**|**Gift AR (TCEffectPlayerKit)**|
|---------|---------|---------|
|Billing|Free (open source)|Paid (requires license). See [Billing Guide](https://trtc.io/document/69949)|
|Integration Method|Manual integration via Gradle|Requires additional integration and authentication|
|Supported Animation Formats|SVGA only|SVGA, PAG, WebP, Lottie, MP4, and more|
|Performance|Recommended SVGA file size ≤ 10MB|Supports larger files, better performance for complex/multiple/low-end scenarios|
|Recommended Scenario|Uniform SVGA format, controllable file size|Multiple formats or higher performance/device compatibility needs|

This section demonstrates the basic solution. For the **Gift AR** see the [TCEffectPlayer Integration Guide](https://trtc.io/document/70531).

#### Basic Solution: Using SVGAPlayer
1. **Integrate SVGAPlayer**: Add the SVGAPlayer dependency to your build.gradle and sync the project.

   ``` gradle
   dependencies {
       // ... other dependencies
       implementation 'com.github.yyued:SVGAPlayer-Android:2.6.1'
   }
   ```
2. **Listen for Gift Events**: Subscribe to the `GiftListener` in `GiftStore`.

3. **Parse and Play**: On `onReceiveGift`, check if `gift.resourceURL` is a valid SVGA file. Use `SVGAParser` to parse and play the animation.

#### Code Example
``` kotlin
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.opensource.svgaplayer.SVGACallback
import com.opensource.svgaplayer.SVGAParser
import com.opensource.svgaplayer.SVGAVideoEntity
import com.opensource.svgaplayer.SVGAImageView
import io.trtc.tuikit.atomicxcore.api.gift.Gift
import io.trtc.tuikit.atomicxcore.api.gift.GiftListener
import io.trtc.tuikit.atomicxcore.api.gift.GiftStore
import io.trtc.tuikit.atomicxcore.api.live.LiveUserInfo
import java.net.URL

class LiveRoomActivity : AppCompatActivity() {
    private lateinit var giftStore: GiftStore
    private lateinit var svgaImageView: SVGAImageView
    private lateinit var svgaParser: SVGAParser

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_live_room)
        setupSVGAPlayer()

        svgaImageView.loops = 1

        svgaImageView.callback = object : SVGACallback {
            override fun onFinished() {
                svgaImageView.visibility = android.view.View.GONE
                svgaImageView.clear()
            }
            override fun onPause() {}
            override fun onRepeat() {}
            override fun onStep(frame: Int, percentage: Double) {}
        }

    }

    private fun setupSVGAPlayer() {
        svgaImageView = findViewById(R.id.svga_player)
        svgaParser = SVGAParser(this)
        svgaImageView.visibility = android.view.View.GONE
    }

   private val giftListener = object : GiftListener() {
        override fun onReceiveGift(liveID: String, gift: Gift, count: Int, sender: LiveUserInfo) {
          if (gift.resourceURL.isNotEmpty()) {
                try {
                    val url = URL(gift.resourceURL)
                    playAnimation(url)
                } catch (e: Exception) {
                    println("Invalid animation URL: ${gift.resourceURL}")
                }
            }
        }
    }

    fun setupGiftSubscription(liveId: String) {
        giftStore = GiftStore.create(liveId)

        giftStore.addGiftListener(giftListener)
    }

    private fun playAnimation(url: URL) {
        svgaParser.decodeFromURL(url, object : SVGAParser.ParseCompletion {
            override fun onComplete(videoItem: SVGAVideoEntity) {
                runOnUiThread {
                    svgaImageView.setVideoItem(videoItem)
                    svgaImageView.visibility = android.view.View.VISIBLE
                    svgaImageView.startAnimation()
                }
            }

            override fun onError() {
                println("SVGA animation parsing failed")
                // Optionally add retry or error reporting
            }
        })
    }
}
```

### Display Gift Messages in the Barrage Area

When a user sends a gift, display a system message in the public barrage area (e.g., "[Viewer Nickname] sent [Gift Name] x [Quantity]") for all viewers.

#### Implementation
1. **Listen for Events**: Subscribe to the `GiftListener` in `giftStore`.

2. **Obtain Information**: On `onReceiveGift`, extract the sender, gift, and count.

3. **Get Barrage Store**: Use `BarrageStore.create(liveID)` for the current room.

4. **Compose Message**: Create a Barrage object, set `messageType = BarrageType.TEXT`, and set textContent to your message.

5. **Insert Locally**: Call `barrageStore.appendLocalTip(message: giftTip)` to add the message to the local barrage list.

#### Code Example
``` kotlin
import io.trtc.tuikit.atomicxcore.api.barrage.Barrage
import io.trtc.tuikit.atomicxcore.api.barrage.BarrageStore
import io.trtc.tuikit.atomicxcore.api.barrage.BarrageType
import io.trtc.tuikit.atomicxcore.api.gift.Gift
import io.trtc.tuikit.atomicxcore.api.gift.GiftListener
import io.trtc.tuikit.atomicxcore.api.gift.GiftStore
import io.trtc.tuikit.atomicxcore.api.live.LiveUserInfo

class LiveRoomManager(
    private val liveId: String
) {
    private val giftStore: GiftStore = GiftStore.create(liveId)
    private val barrageStore: BarrageStore = BarrageStore.create(liveId)

    private val giftListener = object : GiftListener() {
        override fun onReceiveGift(liveID: String, gift: Gift, count: Int, sender: LiveUserInfo) {

            val tipText = "${sender.userName} sent ${gift.name} x $count"
            val giftTip = Barrage(
                liveID = liveID,
                messageType = BarrageType.TEXT,
                textContent = tipText
                sender = sender
            )
            barrageStore.appendLocalTip(giftTip)

        }
    }

    private fun setupGiftToBarrageFlow() {
        giftStore.addGiftListener(giftListener)
    }
}
```

## API Documentation

For complete details on all public interfaces, properties, and methods of [GiftStore](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.gift/-gift-store/index.html) and related classes, see the official API documentation for [AtomicXCore](https://tencent-rtc.github.io/TUIKit_Android/index.html). Key stores referenced in this guide include:

|**Store/Component**|**Feature Description**|**API Documentation**|
|---------|---------|---------|
|GiftStore|Gift interactions: fetch gift list, send/receive gifts, listen for gift events (including sender and gift details).|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.gift/-gift-store/index.html)|
|BarrageStore|Barrage features: send text/custom barrage, maintain barrage list, listen to barrage status in real time.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.barrage/-barrage-store/index.html)|

## FAQs

### The gift list in GiftStore is empty. What should I do?

You must call `refreshUsableGifts(completion)` to fetch gift data from your backend. Ensure your backend is configured with gift data via the server REST API.

### How do I implement multi-language display for gifts (e.g., Chinese, English)?

Use the `GiftStore.setLanguage(language: String)` API before calling `refreshUsableGifts`, passing the target language code (e.g., "en" or "zh-CN"). The server will return gift names and descriptions in the specified language.

### I called sendGift, but the gift animation plays twice. Why?

The `onReceiveGift` event is broadcast to all room members, including the sender. If you update the UI both in the sendGift completion callback and in the `onReceiveGift` event, the animation will play twice.
- **Best Practice**: Only update the UI (e.g., play animations, show barrage) in the `onReceiveGift` event handler. Use the `sendGift` completion callback only for handling failures (such as "Send failed" or "Insufficient balance").

### Where is the gift deduction logic implemented?

Gift deduction is handled entirely by your billing system. AtomicXCore integrates with your billing system via a backend callback. When the client calls sendGift, your backend performs the deduction. After returning the result to the AtomicXCore backend, it determines whether to broadcast the gift event.

### Will gift notifications be blocked by mute or message frequency controls?

No. Gift notifications (`onReceiveGift` events) are not affected by mute or frequency controls and are always delivered reliably.

### What should I do if gift animation playback stutters?

Check your SVGA file size; the basic player recommends files no larger than 10MB. For large or complex animations, consider integrating the **Gift AR** provided by TUILiveKit for improved performance.
