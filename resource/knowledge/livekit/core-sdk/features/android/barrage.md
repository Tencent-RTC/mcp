This document provides a comprehensive guide for iOS developers to quickly integrate a feature-rich, high-performance live chat overlay (barrage/danmaku) system into your live streaming application using the `BarrageStore` module from the **AtomicXCore** framework.

## Core Features

`BarrageStore` delivers a complete barrage solution for your live streaming app. Core features include:
- Receiving and displaying barrage messages in the live room.

- Sending text barrage messages to interact with viewers.

- Sending custom business barrage messages to support complex scenarios such as gifts and likes.

- Inserting system tips into the local message list (for example, "Welcome XX to the live room").

## Core Concepts

|**Core Concept**|**Type**|**Core Responsibility & Description**|
|---------|---------|---------|
|[Barrage](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.barrage/-barrage/index.html)|data class|Represents a single barrage message. Contains sender info (sender), message content (textContent or data), and message type (messageType).|
|[BarrageState](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.barrage/-barrage-state/index.html)|data class|Represents the current state of the barrage module. The main property, messageList, is a StateFlow containing all barrage messages for the current live room, ordered chronologically. This serves as the UI data source.|
|[BarrageStore](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.barrage/-barrage-store/index.html)|abstract class|The main manager for barrage features. Use it to send messages (sendTextMessage, sendCustomMessage) and subscribe to barrage message updates via its state property.|

## Implementation

### Step 1: Component Integration
- **Video Live Streaming**: Please .

- **Voice Chat Room**: Please .

### Step 2: Initialize and Listen to Barrages

Create a `BarrageStore` instance bound to the current live room's `liveId`, and subscribe to receive the latest barrage message list in real time.
``` kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*
import io.trtc.tuikit.atomicxcore.api.barrage.Barrage
import io.trtc.tuikit.atomicxcore.api.barrage.BarrageStore

class BarrageManager(
    private val liveId: String
) {
    private val barrageStore: BarrageStore = BarrageStore.create(liveId)
    private val scope = CoroutineScope(Dispatchers.Main)

    // Expose the [full] message list as a Flow for the UI layer to subscribe to
    private val _messagesFlow = MutableStateFlow<List<Barrage>>(emptyList())
    val messagesFlow: StateFlow<List<Barrage>> = _messagesFlow.asStateFlow()

    init {
        // Start listening for barrage messages immediately after initialization
        subscribeToBarrageUpdates()
    }

    private fun subscribeToBarrageUpdates() {
        scope.launch {
            barrageStore.barrageState.messageList
                .collect { messageList ->
                    // When messageList updates, pass the new list to the UI layer via Flow
                    // Note: This is the [complete list], including all historical messages
                    _messagesFlow.value = messageList
                }
        }
    }
}
```

### Step 3: Send Text Barrages

Use `sendTextMessage` to broadcast a plain text message to all users in the live room.
``` kotlin
import io.trtc.tuikit.atomicxcore.api.CompletionHandler
import io.trtc.tuikit.atomicxcore.api.barrage.BarrageStore

class BarrageManager(
    private val liveId: String
) {
    private val barrageStore: BarrageStore = BarrageStore.create(liveId)

    // Send a text barrage
    fun sendTextMessage(text: String) {
        // We recommend adding a non-empty check to avoid sending invalid messages
        if (text.isEmpty()) {
            return
        }

        // Call the core API to send the message
        barrageStore.sendTextMessage(
            text,
            mapOf(
                "custom key" to "custom value",
            ),
            object : CompletionHandler {
                override fun onSuccess() {
                    println("Text barrage '$text' sent successfully")
                }

                override fun onFailure(code: Int, desc: String) {
                    println("Failed to send text barrage: $desc")
                }
            }
        )
    }
}
```

#### API Parameters

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|`text`|`String?`|The text content to send.|
|`extensionInfo`|`Map<String, String>?`|Additional data for business customization.|
|`completion`|`CompletionHandler?`|Callback invoked after sending, indicating success or failure.|

### Step 4: Send Custom Barrage

Send messages with custom business logic, such as gifts, likes, or gamification commands. The content format of this message is defined by the business layer. The receiver must parse and handle it based on the `businessId` and `data`.
``` kotlin
class BarrageManager(
    private val liveId: String
) {
    // Send a custom barrage, for example, to send a gift
    fun sendGiftMessage(giftId: String, giftCount: Int) {
        // 1. Define a business-recognizable ID
        val businessId = "live_gift"

        // 2. Encode business data as a JSON string
        val giftData = mapOf(
            "gift_id" to giftId,
            "gift_count" to giftCount
        )

        val jsonString = try {
            // Use Gson or another JSON library for serialization
            // Here we assume Gson is used
            Gson().toJson(giftData)
        } catch (e: Exception) {
            return
        }

        // 3. Call the core API to send the custom message
        barrageStore.sendCustomMessage(
            businessId,
            jsonString,
            object : CompletionHandler {
                override fun onSuccess() {
                    println("Gift message (custom barrage) sent successfully")
                }

                override fun onFailure(code: Int, desc: String) {
                    println("Failed to send gift message: $desc")
                }
            }
        )
    }
}
```

#### API Parameters

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|businessId|String|Unique business identifier (e.g., "live_gift"). Used by receivers to distinguish custom messages.|
|data|String|Business data, typically a JSON string.|
|completion|CompletionHandler?|Callback after sending.|

### Step 5: Insert Local Tip Messages

Insert a local message into the current user's message list. This message is not sent to other users and is ideal for displaying system prompts, warnings, or operation tips.
``` kotlin
class BarrageManager(
    private val liveId: String
) {
    // Insert a welcome tip into the local message list
    fun showWelcomeMessage(user: LiveUserInfo) {
        // 1. Create a Barrage message
        val welcomeTip = Barrage(
            liveID = liveId,
            messageType = BarrageType.TEXT, // You can reuse the text type for display
            textContent = "Welcome ${user.userName} to the live room!",
            sender = LiveUserInfo() // sender can be left empty or set to a system user identifier
        )

        // 2. Call the API to append it to the local list
        barrageStore.appendLocalTip(welcomeTip)
    }
}
```

#### API Parameters

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|message|Barrage|The message object to insert locally. The SDK appends this to messageList in BarrageState.|

### Step 6: Manage User Speaking Permissions (Mute and Unmute)

As a host or administrator, you can control user messaging permissions to maintain a healthy community environment.

#### Mute/Unmute a Single User

Use the `disableSendMessage` method in `LiveAudienceStore` to mute or unmute a user. This state persists even if the user rejoins the live room.
``` kotlin
import io.trtc.tuikit.atomicxcore.api.*
import io.trtc.tuikit.atomicxcore.api.live.LiveAudienceStore

// 1. Get the LiveAudienceStore instance bound to the current live room
val audienceStore = LiveAudienceStore.create(liveId)

// 2. Define the user ID to operate on and the mute status
val userIdToMute = "user_id_to_be_muted"
val shouldDisable = true // true to mute, false to unmute

// 3. Call the interface to perform the operation
audienceStore.disableSendMessage(
    userIdToMute,
    shouldDisable,
    object : CompletionHandler {
        override fun onSuccess() {
            println("${if (shouldDisable) "Muted" else "Unmuted"} user $userIdToMute successfully")
        }

        override fun onFailure(code: Int, desc: String) {
            println("Operation failed: $desc")
        }
    }
)
```

#### Enable/Disable Global Mute

To mute all users in the live room (usually excluding the host), update the live room information via `LiveListStore`.
``` kotlin
import io.trtc.tuikit.atomicxcore.api.CompletionHandler
import io.trtc.tuikit.atomicxcore.api.live.LiveInfo
import io.trtc.tuikit.atomicxcore.api.live.LiveListStore

// 1. Get the LiveListStore singleton
val liveListStore = LiveListStore.shared()

// 2. Get the current live room info and modify the global mute status
val currentLiveInfo = liveListStore.liveState.currentLive.value.copy(
    isMessageDisable = true // true to enable global mute, false to disable
)

// 3. Call the update interface and specify the modification flag
liveListStore.updateLiveInfo(
    currentLiveInfo,
    listOf(LiveInfo.ModifyFlag.IS_MESSAGE_DISABLE),
    object : CompletionHandler {
        override fun onSuccess() {
            println("Global mute status updated successfully")
        }

        override fun onFailure(code: Int, desc: String) {
            println("Operation failed: $desc")
        }
    }
)
```

## Advanced Features: Performance Optimization in High-Concurrency Scenarios

After implementing barrage features with `BarrageStore`, use the following strategies to ensure smooth and stable user experiences in high-concurrency live streaming scenarios. This section provides optimization strategies and code samples for three core business scenarios.

### Scenario 1: Handling "Barrage Storms" in Popular Live Rooms

#### Scenario Description

During popular events, a large number of viewers may flood into the live room, with barrages updating at dozens of messages per second.

#### Technical Challenge

The SDK returns the complete barrage list at a high frequency. If you call `adapter.notifyDataSetChanged()` on every update, the main thread may be blocked by intensive UI layout and rendering, causing UI lag.

#### Optimization: Batch Processing & Debouncing

Do not respond to every data update. Instead, set a time threshold (e.g., 300 ms). Only refresh the UI if the time since the last update exceeds this threshold. This reduces dozens of `notifyDataSetChanged()`calls per second to just 3–4, greatly improving smoothness.

#### Code Example

Create a `BarrageUIManager` class with a buffer and timer for batch updating data to the `RecyclerView`.
``` kotlin
import android.os.Handler
import androidx.recyclerview.widget.RecyclerView
import io.trtc.tuikit.atomicxcore.api.barrage.Barrage

private const val UPDATE_DURATION_MS = 300L

class BarrageUIManager() {
    private var timestampOnLastUpdate = 0L

    private var dataSource: ArrayList<Barrage> = ArrayList()
    private val updateViewTask = Runnable { notifyDataSetChanged() }
    private val handler = Handler()
    private val adapter = BarrageAdapter(dataSource)

    // This method is called frequently from outside, passing in the latest full list
    fun update(newList: List<Barrage>) {
        handler.removeCallbacks(updateViewTask)
        dataSource.clear()
        dataSource.addAll(newList)
        // If the refresh interval is less than 0.3 seconds, do not refresh
        if (System.currentTimeMillis() - timestampOnLastUpdate < UPDATE_DURATION_MS) {
            handler.postDelayed(updateViewTask, UPDATE_DURATION_MS)
            return
        }
    }

    private fun notifyDataSetChanged() {
        adapter.notifyDataSetChanged()
        timestampOnLastUpdate = System.currentTimeMillis()
    }
}

class BarrageAdapter(dataSource: ArrayList<Barrage>): RecyclerView.Adapter<RecyclerView.ViewHolder>() {
    // Implement adapter capabilities here
}
```

### Scenario 2: Ensuring Memory Stability for Long-Duration Live Streams

#### Scenario Description

Your app may need to support hours-long or even all-day continuous live streaming, such as game streaming or slow live streams. The app must remain stable and avoid crashes due to long-term operation.

#### Technical Challenge

The SDK returns a full `messageList` that grows indefinitely during long live streams. Even if the UI layer throttles updates, a large array in the data layer will continue consuming memory and may eventually cause the app to crash.

#### Optimization: Circular Buffer with Fixed Capacity

Ensure your data source holds only a limited number of messages. Regardless of the size of the full list returned by the SDK, only retain the latest portion for display.

#### Code Example

After receiving the full list from the SDK, take only the latest 500 messages (or another number you define) to update the UI.
``` kotlin
class BarrageUIManager(
    private val recyclerView: RecyclerView
) {
    private val capacity: Int = 500 // Only retain the latest 500 messages
    // ... (other code as above) ...

    private fun refreshUIIfNeeded() {
        val fullList = this.latestMessageList ?: return
        val adapter = recyclerView.adapter ?: return
        this.latestMessageList = null

        // Only take the latest N messages
        val cappedList = fullList.takeLast(capacity)

        dataSource.clear()
        dataSource.addAll(cappedList)
        adapter.notifyDataSetChanged()
    }
}
```

### Scenario 3: Rendering Complex Barrage Styles with User Levels and Badges

#### Scenario Description

To enhance the live streaming atmosphere and highlight paying users, barrage messages may include rich visual elements such as usernames, user level icons, fan badges, and message content.

#### Technical Challenge

Rendering views with multiple images and texts, custom fonts, or complex layouts is more time-consuming than rendering plain text. High-frequency rendering of these complex views in a list increases the main thread's workload, causing lag during list scrolling.

#### Optimization: Asynchronous Drawing

Move the view rendering process off the main thread and onto a background thread. The main thread should only handle the final display of the already rendered bitmap, significantly reducing its computational load.

#### Code Example

In your custom `RecyclerView.ViewHolder`, use `AsyncLayoutInflater` or a preloading mechanism to perform rendering tasks on a background thread whenever possible.
``` kotlin
import android.view.LayoutInflater
import androidx.asynclayoutinflater.view.AsyncLayoutInflater
import androidx.recyclerview.widget.RecyclerView

// In your custom Barrage ViewHolder
class BarrageViewHolder(
    itemView: View
) : RecyclerView.ViewHolder(itemView) {

    // ... (Declarations for TextView, ImageView, etc.)

    companion object {
        fun create(parent: ViewGroup): BarrageViewHolder {
            // Use async layout inflater to reduce main thread blocking
            val inflater = AsyncLayoutInflater(parent.context)
            val view = LayoutInflater.from(parent.context)
                .inflate(R.layout.item_barrage, parent, false)
            return BarrageViewHolder(view)
        }
    }

    fun bind(viewModel: BarrageViewModel) {
        // Set your TextView text, ImageView images, etc. here
        // With async layout inflation, final rendering is done on a background thread whenever possible
    }

    // Advanced performance optimization: fully manual drawing
    // For finer control, use Canvas to manually draw text and images
    // Generate the Bitmap on a background thread, then draw it in the main thread's onDraw method for fully asynchronous rendering
}
```

## API Documentation

For detailed information on all public interfaces, properties, methods of [BarrageStore](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.barrage/-barrage-store/index.html) and its related classes, refer to the official API documentation included with the [AtomicXCore](https://tencent-rtc.github.io/TUIKit_Android/index.html) framework.

## FAQs

### In addition to basic text barrages, we also want to implement richer styles such as "colored barrages" and "gift barrages." How can we achieve this?

You can implement these features using custom messages with `sendCustomMessage`.

**Implementation Steps**
1. **Define the Data Structure**: Collaborate with your client and server teams to define the JSON structure for custom messages. For example, a colored barrage can be defined as:

   ``` json
   {  "type": "colored_text",  "text": "This is a colored bullet comment!",  "color": "#FF5733" }
   ```
2. **Sender**: When sending, serialize this JSON structure to a string and send it via the `data` parameter of `sendCustomMessage`. The businessID can be set to a unique identifier for your use case, such as `barrage_style_v1`.

3. **Receiver**: Upon receiving a barrage message, check whether its messageType is `BarrageType.CUSTOM` and whether the `businessID` matches. If so, parse the data string (usually as JSON), and render your custom UI style based on the parsed data (such as `color`, `text`).

### If I call BarrageStore.create(liveID = "some_id") in different classes or files, will this create multiple instances and cause confusion?

No. The internal mechanism of **AtomicXCore** ensures that as long as you pass in the same `liveID`, you always get the same `BarrageStore` instance for that live room. You do not need to manage singletons manually.

### Why can't I see the message I sent after calling sendTextMessage in the message list?

**Troubleshooting steps:**
1. **Check the completion callback**: The `sendTextMessage` method provides a completion callback. Check whether the callback indicates success or failure. If it fails, the error message will indicate the problem (such as "You have been muted," "Network error," etc.).

2. **Confirm subscription timing**: Make sure you subscribe to `barrageStore.barrageState.messageList` after the live session for the corresponding `liveID` has started. If you start listening before joining the live room, you may miss some messages.

3. **Check liveID**: Ensure that the liveID used when creating the BarrageStore instance, joining the live room, and sending messages is exactly the same, including case sensitivity.

4. **Network issues**: Ensure the device's network connection is normal. Message sending depends on network connectivity.

### How can new viewers see historical barrage messages sent before they joined the live room?

`AtomicXCore` supports retrieving historical chat messages, but you need to enable this feature in the **server console**. Once configured, the SDK handles everything automatically—no additional client code is required.

#### **Step 1: Configure in the Live Console**
1. Log in to [**Console > Live > Configuration**](https://console.trtc.io/live/configuration), and select your target application at the top of the page.

2. On the Live Configuration page, select **View Past Messages**, and set Previous Messages Viewable to specify the number of messages (up to a maximum of 50) that new viewers can see.

#### **Step 2: Automatic Retrieval on the Client Side**

After completing the above configuration, **no changes are needed** in your client code.

When a new user joins the live room, `AtomicXCore` automatically retrieves the configured number of historical chat messages in the background. These messages are delivered to the UI layer through the `BarrageState` subscription channel, just like real-time messages. Your application will receive and display these historical chat messages in the same way as live messages.
