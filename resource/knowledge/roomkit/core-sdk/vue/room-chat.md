The in-room chat feature allows participants in a meeting to interact in real time through text, emojis, and more. This feature is built on the IM component capabilities of `tuikit-atomicx-vue3`, providing users with a convenient instant messaging experience.

## Use Cases
- **Online webinars:** While the presenter delivers a video talk, participants can ask questions or discuss via text.

- **Remote collaboration:** Team members can send text, images, files, and more while communicating.

- **Live teaching:** Students can send bullet comments or questions in the chat area, and the teacher can view and answer them in real time, enhancing classroom interactivity.

## Prerequisites

Before integrating this feature, make sure the following conditions are met:
- **User status:** The user has completed login authentication via useLoginState (see the Integration Overview) and is already in a room as the room owner or a participant (see Room Management).

- **Environment dependency:** The project has correctly installed and imported `tuikit-atomicx-vue3`.

## Implementing In-Room Chat

This feature offers two integration approaches, and you can choose the one that best fits your business needs:
- **Approach 1 (Recommended):** Quick integration using UI components. Directly import the message list component ([MessageList](https://github.com/Tencent-RTC/TUIKit_Vue3/tree/main/packages/tuikit-atomicx-vue3/src/components/MessageList)) and the message input component ([MessageInput](https://github.com/Tencent-RTC/TUIKit_Vue3/tree/main/packages/tuikit-atomicx-vue3/src/components/MessageInput)) provided by `tuikit-atomicx-vue3`, with the lowest development cost.

- **Approach 2 (Advanced):** Custom integration using the low-level APIs. Implement your own UI and interaction logic based on the atomicx-core SDK API state hooks [useMessageListState](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#module-MessageListState) and [useMessageInputState](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#module-MessageInputState), offering the highest flexibility.

   In-room chat

## Approach 1: Quick Integration Using UI Components

`tuikit-atomicx-vue3` provides two core components:
- [**MessageList**](https://github.com/Tencent-RTC/TUIKit_Vue3/tree/main/packages/tuikit-atomicx-vue3/src/components/MessageList)**:** The message list component, which displays the chat history and supports operations such as copying, recalling, and deleting messages.

- [**MessageInput**](https://github.com/Tencent-RTC/TUIKit_Vue3/tree/main/packages/tuikit-atomicx-vue3/src/components/MessageInput)**:** The message input component, which supports sending text, emojis, images, and files, and can be automatically disabled based on the mute status.

### Step 1: Data Initialization

After the user successfully joins the room, you need to call the [setActiveConversation](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#setActiveConversation) API to initialize the chat data. We recommend listening for changes to [currentRoom](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#currentRoom) to handle this automatically.

> **Note:**
> - `GROUP` is a fixed prefix. The `setActiveConversation` argument must be ``GROUP${roomId}``; otherwise, messages cannot be sent or received properly.
> - `GROUP` is the fixed prefix for IM SDK group conversations (see [IM conversation types](https://web.sdk.qcloud.com/im/doc/zh-cn/Conversation.html)). Room chat is built on IM groups, so the conversation ID must be in the ``GROUP${roomId}`` format.

``` typescript
import { watch } from 'vue';
import { useConversationListState } from 'tuikit-atomicx-vue3/chat';
import { useRoomState } from 'tuikit-atomicx-vue3/room';

const { currentRoom } = useRoomState();
const { setActiveConversation } = useConversationListState();

// Listen for room ID changes and automatically switch to the corresponding IM group conversation
watch(() => currentRoom.value?.roomId, (roomId) => {
  if (roomId) {
    // Key step: set the current active conversation ID, using the rule "GROUP" + room ID
    setActiveConversation(`GROUP${roomId}`);
  }
}, { immediate: true });
```

### Step 2: Using the Components

In your page, you can directly combine these two components. At the same time, use [useRoomParticipantState](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#module-RoomParticipantState) to obtain the current user's mute status and control the availability of the input box.

> All TUIKit components must be wrapped inside UIKitProvider; otherwise, they cannot obtain their context dependencies, resulting in abnormal styles.
>

``` typescript
<template>
  <UIKitProvider theme="light" language="en-US">
    <div class="room-chat-container">
      <!-- Message list component -->
      <!-- messageActionList: configures the actions supported by long-pressing a message, such as copy, recall, and delete -->
      <MessageList
        class="message-list"
        :messageActionList="['copy', 'recall', 'delete']"
      />

      <!-- Message input component -->
      <!-- disabled: disables the input box when the user is muted -->
      <!-- hideSendButton: optional, hides the send button and uses Enter to send -->
      <MessageInput
        class="message-input"
        :placeholder="inputPlaceholder"
        :disabled="isMessageDisabled"
        hideSendButton
      />
    </div>
  </UIKitProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { UIKitProvider } from '@tencentcloud/uikit-base-component-vue3';
import { MessageInput, MessageList } from 'tuikit-atomicx-vue3/chat';
import { useRoomParticipantState } from 'tuikit-atomicx-vue3/room';

const { localParticipant } = useRoomParticipantState();

// Get the current user's mute status. isMessageDisabled is synced in real time by the room backend, with no need for the frontend to actively poll; the frontend only needs to bind this state to automatically respond to mute changes.
const isMessageDisabled = computed(() => localParticipant.value?.isMessageDisabled);

// Dynamically display the placeholder hint based on the status
const inputPlaceholder = computed(() =>
  isMessageDisabled.value ? 'You have been muted' : 'Enter a message...'
);
</script>

<style scoped>
.room-chat-container{display:flex;flex-direction:column;height:100%;padding:8px;gap:8px}.message-list{flex:1;overflow:hidden}.message-input{flex-shrink:0;border:1px solid #e0e0e0;border-radius:8px}
</style>
```

### Step 3: Handling the Unread Message Count (Optional)

If the chat window is normally collapsed or closed, you need to count unread messages by listening for changes to [messageList](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#messageList), and show a hint in the UI (such as a badge on the chat icon).
``` typescript
import { ref, watch } from 'vue';
import { useMessageListState } from 'tuikit-atomicx-vue3/chat';

const { messageList } = useMessageListState();
const unreadCount = ref(0);
const isChatWindowOpen = ref(false); // Maintain this state according to your business logic

watch(() => messageList.value?.length, (newLength, oldLength) => {
  // If this is the initial load or the data is empty, do not count
  if (!newLength || newLength === 0) return;

  // Only increase the unread count when the chat window is closed and a new message is received
  if (!isChatWindowOpen.value && newLength > (oldLength || 0)) {
    unreadCount.value += (newLength - (oldLength || 0));
  }
});

// Clear the unread count when the user opens the chat window
const openChatWindow = () => {
  isChatWindowOpen.value = true;
  unreadCount.value = 0;
};
```

## Approach 2: Custom Integration Using the Low-Level APIs

This section mainly explains how to implement a custom chat interface using the atomicx-core SDK APIs [useMessageListState](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#module-MessageListState) and [useMessageInputState](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#module-MessageInputState).

> `MessageInputState` supports integration with the `@tiptap/vue-3` editor by default. If you only need a simple text input (such as `<input>` or `<textarea>`), please **ignore** the editor-instance-bound APIs such as `setEditorInstance` and `setContent`, and simply use `updateRawValue` and `sendMessage`.
>

#### Step 1: Data Initialization

After the user successfully joins the room, you need to call the [setActiveConversation](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#setActiveConversation) API to initialize the chat data. We recommend listening for changes to [currentRoom](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#currentRoom) to handle this automatically.

> **Note:**
> - `GROUP` is a fixed prefix. The `setActiveConversation` argument must be ``GROUP${roomId}``; otherwise, messages cannot be sent or received properly.
> - When switching rooms or leaving a room, we recommend resetting or clearing the active conversation to avoid sending messages to the wrong conversation.

``` typescript
import { watch } from 'vue';
import { useConversationListState } from 'tuikit-atomicx-vue3/chat';
import { useRoomState } from 'tuikit-atomicx-vue3/room';

const { currentRoom } = useRoomState();
const { setActiveConversation } = useConversationListState();

// Listen for room ID changes and automatically switch to the corresponding IM group conversation
watch(() => currentRoom.value?.roomId, (roomId) => {
  if (roomId) {
    // Key step: set the current active conversation ID, using the rule "GROUP" + room ID
    setActiveConversation(`GROUP${roomId}`);
  }
}, { immediate: true });
```

#### Step 2: Getting the Message List

Use [useMessageListState](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#module-MessageListState) to get the message list of the current conversation. `messageList` is reactive data and automatically updates with newly received messages.
``` typescript
import { useMessageListState } from 'tuikit-atomicx-vue3/chat';

const {
  messageList,      // Reactive message list
  loadMoreOlderMessage, // Method to load more historical messages
  hasMoreOlderMessage,   // Whether there are more historical messages
} = useMessageListState();

// Example: render the message list
// <div v-for="msg in messageList" :key="msg.ID">
//   {{ msg.payload.text }}
// </div>
```

#### Step 3: Sending Messages

Use [useMessageInputState](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#module-MessageInputState) to manage the input box content and send messages.
``` typescript
import { useMessageInputState } from 'tuikit-atomicx-vue3/chat';

const {
  inputRawValue,  // Reactive data: the current input content
  updateRawValue, // Method: update the input content (automatically triggers the "peer is typing" state)
  sendMessage     // Method: send a message
} = useMessageInputState();

const handleSend = async () => {
  // Validate that the input is not empty
  if (!inputRawValue.value) return;

  try {
    // 1. Send the message
    // Option A: send the current content of inputRawValue
    await sendMessage();

    // Option B: directly send specified text (independent of inputRawValue)
    // await sendMessage('Hello World');

    console.log('Sent successfully');

    // 2. Clear the input box after sending successfully
    // Key point: in non-rich-text mode, be sure to use updateRawValue('') to clear it
    // Do not use setContent(''), which only takes effect after an editor instance is bound
    updateRawValue('');
  } catch (error) {
    console.error('Failed to send', error);
  }
};

// Example: bind a native input box
// <input
//   :value="inputRawValue"
//   @input="(e) => updateRawValue(e.target.value)"
//   @keyup.enter="handleSend"
// />
```

#### Step 4: Loading Historical Messages

Use the [loadMoreOlderMessage](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#module-MessageListState) method to fetch historical messages page by page. This is usually triggered when scrolling to the top of the list.

> After loading historical messages, you usually need to manually adjust the scrollbar position to keep the current viewport from jumping.
>

``` typescript
import { useMessageListState } from 'tuikit-atomicx-vue3/chat';

const {
  hasMoreOlderMessage,
  loadMoreOlderMessage
} = useMessageListState();

const loadHistory = async () => {
  if (hasMoreOlderMessage.value) {
    // Record the scroll height before loading
    // const previousHeight = scrollContainer.value.scrollHeight;

    await loadMoreOlderMessage();

    // Restore the scroll position after the DOM updates
    // nextTick(() => {
    //   const currentHeight = scrollContainer.value.scrollHeight;
    //   scrollContainer.value.scrollTop += (currentHeight - previousHeight);
    // });
  }
};
```

#### Step 5: Advanced Feature (Read Receipts)

If you need the read receipt feature, you can use [setEnableReadReceipt](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#setEnableReadReceipt).
``` typescript
const {
  setEnableReadReceipt, // Enable/disable read receipts
} = useMessageListState();

// Enable read receipts
setEnableReadReceipt(true);
```

## Development Notes
- **Mute status synchronization**

   `localParticipant.isMessageDisabled` is controlled by the room administrator. When the administrator enables "mute all" or mutes an individual user, this property is automatically updated. Be sure to bind this property to the input box's `disabled` state to restrict user speech on the frontend.

- **Conversation switching timing**

   Make sure `setActiveConversation` is called after successfully joining the room and when `roomId` has a value. If it is called before joining the room, it may fail because the SDK has not finished initializing or the user is not logged in.

- **Container layout requirements (important)**

   The message list component handles scrolling logic internally, so the **parent container must have a fixed height** (for example, `height: 100%` or a specific pixel value) and set `overflow: hidden`; otherwise, the list will grow indefinitely and cannot be scrolled.

- **Message type handling**

   `messageList` contains messages of various types (text, image, file, etc.). When rendering them custom, you need to handle them differently based on `msg.type`.

- **Input state management**

   Updating the input content with `updateRawValue` automatically triggers the "peer is typing" status notification (if supported). If you only use `inputRawValue.value = 'xxx'`, this status may not be triggered.

- **Maintaining scroll position for historical messages**

   In custom development, after calling `loadMoreOlderMessage` to load historical messages, the DOM height increases. To prevent the view from jumping, you need to record `scrollHeight` before loading, then compute the height difference after loading (`nextTick`) and adjust `scrollTop`.

- **Scrolling strategy for new messages**

   We recommend implementing "smart scrolling" logic: when the user is at the bottom of the list, automatically scroll to the bottom when a new message is received; when the user is browsing historical messages, keep the current position unchanged and show a "new message" hint bubble.

- **Conversation ID format requirements**

   When calling `setActiveConversation`, you must use the ``GROUP${roomId}`` format (`GROUP` is a fixed prefix). This is the standard format for IM SDK group conversations and cannot be customized or have its prefix omitted; otherwise, messages cannot be sent or received properly.

## FAQ

**Switching to the group conversation fails or the message list has no content?**

Make sure you call `setActiveConversation('GROUP' + roomId)` only after logging in and successfully joining the room; not being logged in or an empty roomId will cause it to fail.

**Messages are not received or the list is blank?**

Check whether the current active conversation is correct (the `GROUP` prefix + roomId) and whether the network/authentication is working; if necessary, call `setActiveConversation` again to refresh the active conversation.

**The unread count is not cleared?**

You need to maintain the unread count logic manually. Update the count when the chat window is opened, or when a new message is received while the window is closed.

**A muted user can still click send?**

Make sure the frontend UI disables the send button and input box based on the `isMessageDisabled` status. Although the server also intercepts such messages, disabling them on the frontend provides a better experience.

**Custom avatar/nickname display?**

You can use the `MessageList` slot or a custom Message component to prioritize displaying the room's `nameCard` and customize the avatar style, and so on.

**How do I send images or files in the custom approach?**

The `sendMessage` method supports passing an `InputContent[]` array. You can construct an array containing `type: 'image'` or `type: 'file'` along with the corresponding `file` object to send rich-media messages.
``` typescript
import { useMessageInputState } from 'tuikit-atomicx-vue3/chat';

const { sendMessage } = useMessageInputState();

// Example: send an image
// const file = ...; // A File object obtained from an input type="file"
await sendMessage([{ type: 'image', file }]);
```

**How do I change the default styles of the UI components?**

The class names of `tuikit-atomicx-vue3` components generally remain stable. You can use CSS deep selectors (such as Vue's `:deep()`) to override the default styles. For example, `.message-list :deep(.tui-message-bubble) { background-color: #f0f0f0; }`.

## **Example Project**

Tencent Cloud provides the example project [atomicx-vite-vue3-ts](https://github.com/Tencent-RTC/TUIRoomKit/tree/main/Web/example/atomicx-vite-vue3-ts) on GitHub, which you can refer to for implementing full RoomKit functionality.

## API Reference

|**State/Component**|**Description**|**API Reference**|
|---------|---------|---------|
|**useRoomState**|Room state management (create, join, schedule, etc.)|[API Reference](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#module-RoomState)|
|**useRoomParticipantState**|Room participant management (participant list, permission control)|[API Reference](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#module-RoomParticipantState)|
|**useConversationListState**|Conversation list management|[API Reference](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#module-ConversationListState)|
|**useMessageListState**|Message list management|[API Reference](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#module-MessageListState)|
|**useMessageInputState**|Message input management|[API Reference](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#module-MessageInputState)|
