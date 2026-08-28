## Overview

`MessageList` is the core component of the chat UI. It renders the message list and provides rich interaction features. It supports message aggregation, auto-scroll, historical message loading, read receipts, and other advanced capabilities, making it suitable for highly customizable chat interfaces. The component handles scroll behavior, message loading logic, and grouped message display internally for a smooth browsing experience.

## Features
- **Message display**: Renders multiple message types (text, image, video, file, custom messages, and more).

- **Message aggregation**: Automatically groups adjacent messages from the same sender based on a time interval.

- **Smart scrolling**: Auto-scrolls to the bottom and supports manual scroll control.

- **History loading**: Pull up to load more historical messages.

- **Read receipts**: Supports displaying message read status.

- **Message actions**: Supports actions such as recall and delete.

- **Custom rendering**: Supports custom message components and time divider components.

## Quick Start

The following example shows the simplest way to use `MessageList`.
``` typescript
<template>
  <UIKitProvider>
    <Chat>
      <MessageList />
      <MessageInput />
    </Chat>
  </UIKitProvider>
</template>

<script lang="ts" setup>
import { UIKitProvider, Chat, MessageList, MessageInput } from '@tencentcloud/chat-uikit-vue3';
</script>

```

Usage notes:
1. `MessageList` must be used inside `UIKitProvider` and the `Chat` container.

2. `MessageList` is typically paired with `MessageInput`.

## Props Quick Reference

| Field | Type | Default | Description |
|---------|---------|---------|---------|
| alignment | 'left' \| 'right' \| 'two-sided' | 'two-sided' | Message alignment mode: left, right, or two-sided. |
| enableReadReceipt | boolean | false | Whether to enable message read receipts. |
| messageActionList | MessageAction[] | undefined | Custom message action list (e.g., recall, delete). |
| messageAggregationTime | number | 300 (seconds) | Message aggregation interval in seconds. Messages from the same sender within this interval are grouped. Set to `0` to disable aggregation. |
| filter | (message: MessageInfo) => boolean | undefined | Custom filter function to control which messages are displayed. |
| enableReadReceipt | boolean | false | Whether to enable message read receipts. |
| Message | Component | undefined | Custom component for rendering a single message. |
| MessageTimeDivider | Component | undefined | Custom time divider component. |

## Detailed Props

### alignment
- **Type**: `'left' | 'right' | 'two-sided'`

- **Description**: Controls how messages are aligned in the list. `'left'` aligns all messages to the left; `'right'` aligns all messages to the right; `'two-sided'` right-aligns sent messages and left-aligns received messages. Default: `'two-sided'`.

### messageAggregationTime
- **Type**: `number`

- **Description**: Time interval for message aggregation, in seconds. When the same sender sends multiple messages within this interval, they are grouped together. Set to `0` or a smaller value to disable aggregation and show each message independently. Default: `300` (5 minutes).

### enableReadReceipt
- **Type**: `boolean`

- **Description**: Whether to enable message read receipts. When set to `true`, the component attempts to display read status for messages. Default: `false`.

### messageActionList
- **Type**: `MessageAction[]`

- **Description**: Defines the custom action list available on messages, such as copy, recall, forward, and delete. Pass an array of `MessageAction` objects to customize behavior. Default: `undefined`; the component uses the default list from the `useMessageActions` hook.

   The default order is: `['copy', 'recall', 'quote', 'forward', 'delete']`.

   **MessageAction** type definition:

   ``` typescript
   import type { Component } from 'vue';
   import type { MessageInfo } from '@tencentcloud/chat-uikit-vue3';

   interface MessageAction {
     /** Unique action identifier */
     key: string;
     /** Display label for the action */
     label: string;
     /** Icon component or icon name */
     icon?: Component | string;
     /** Callback when the action is clicked */
     onClick?: (message: MessageInfo) => void;
     /** Controls visibility; boolean or a function based on the message */
     visible?: boolean | ((message: MessageInfo) => boolean);
     /** Custom component that replaces the default label and icon */
     component?: Component;
     /** Custom CSS class name */
     className?: string;
     /** Custom inline styles */
     style?: Record<string, any>;
   }
   ```

   Use the `useMessageActions` hook to get the full message action list and customize it. The hook accepts an optional array of action keys (`string`) or full `MessageAction` objects. Passing a `string` array uses the default configuration for those actions; passing `MessageAction` objects merges and overrides the defaults.

#### Example 1: Reorder message actions

The following code moves the `forward` action to the first position.
``` typescript
<template>
  <MessageList :messageActionList="actions" />
</template>

<script lang="ts" setup>
import { MessageList, useMessageActions } from '@tencentcloud/chat-uikit-vue3';

const actions = useMessageActions(['forward', 'copy', 'recall', 'quote', 'delete']);
</script>
```

Result:

#### Example 2: Show only selected message actions

Show only `copy` and `recall`; hide all other actions.
``` typescript
<template>
  <MessageList :messageActionList="actions" />
</template>

<script lang="ts" setup>
import { MessageList, useMessageActions } from '@tencentcloud/chat-uikit-vue3';

const actions = useMessageActions(['copy', 'recall']);
</script>
```

Result:

#### Example 3: Customize message action style and logic

The following example customizes the forward action:
1. Change the label to `'Forward ⚠️'`

2. Change the color to orange

3. Allow forwarding only for messages sent by others

   ``` typescript
   <template>
     <MessageList :messageActionList="actions" />
   </template>

   <script lang="ts" setup>
   import { MessageList, useMessageActions } from '@tencentcloud/chat-uikit-vue3';

   const actions = useMessageActions(['copy', {
     key: 'forward',
     label: 'Forward ⚠️',
     style: {
       color: 'orange',
     },
     visible: (message) => message.isSentBySelf === false,
   }, 'quote', 'recall', 'delete']);
   </script>
   ```

   Result:

#### Example 4: Add a custom message action

Add a custom "Like" action that is visible only for messages sent by others, inserted after the "recall" action.
``` typescript
<template>
  <MessageList :messageActionList="actions" />
</template>

<script lang="ts" setup>
import { MessageList, useMessageActions } from '@tencentcloud/chat-uikit-vue3';

const customLikeAction = {
  key: 'like',
  label: 'Like',
  icon: '🩷',
  visible: (message) => message.isSentBySelf === false,
  onClick: (message) => {
    console.log('like message:', message.msgID);
    // Implement like logic here, e.g., call a backend API
  },
};

const actions = useMessageActions(['forward', 'copy', 'recall', customLikeAction, 'quote', 'delete']);
</script>
```

Result:

### filter
- **Type**: `((message: MessageInfo) => boolean) | undefined`

- **Description**: A custom filter function applied before messages are rendered. It receives a `MessageInfo` object and returns a boolean. Return `true` to display the message; return `false` to hide it. Default: `undefined` (no extra filtering; the component still filters out messages where `isDeleted` is `true`).

#### Example: Filter out text messages from bots

This example shows how to use the `filter` prop to hide specific messages from certain users.
``` typescript
<template>
  <MessageList :filter="customMessageFilter" />
</template>

<script lang="ts" setup>
import { MessageList, MessageType } from '@tencentcloud/chat-uikit-vue3';
import type { MessageInfo } from '@tencentcloud/chat-uikit-vue3';

// Custom message filter function
const customMessageFilter = (message: MessageInfo): boolean => {
  if (
    message.nick?.includes('_robot')
    && message.messageType === MessageType.Text as any
  ) {
    return false;
  }
  return true;
};
</script>
```

### Message
- **Type**: `Component | undefined`

- **Description**: Custom component for rendering a single message in the list.

   To fully control message appearance and internal logic, pass a Vue component to replace the default renderer. The custom component receives props such as `message`, `alignment`, and `messageActionList`. By default, the built-in `Message` component is used.

   This example shows how to override the `Message` component to display avatar and nickname on your own messages (by default, sent messages do not show avatar or nickname).

   ``` typescript
   <template>
     <MessageList :Message="MessageWithSelfAvatarAndNick" />
   </template>

   <script lang="ts" setup>
   import { defineComponent, h } from 'vue';
   import { MessageList, Message } from '@tencentcloud/chat-uikit-vue3';

   const MessageWithSelfAvatarAndNick = defineComponent({
     name: 'MessageWithSelfAvatar',
     inheritAttrs: false,
     setup(_, { attrs }) {
       return () => h(Message as Component, {
         ...attrs,
         removeAvatar: false,
         isHiddenMessageNick: false,
       });
     },
   });
   </script>
   ```

### MessageTimeDivider
- **Type**: `Component | undefined`

- **Description**: Custom component for rendering time dividers.

   Pass a Vue component to replace the default time divider. The custom component receives props such as `currentMessage` (the message associated with the divider) and `previousMessage` (the previous message). Use these to control divider display logic and styling. By default, the built-in `MessageTimeDivider` component is used.

   This example creates a custom time divider that labels business hours vs. off hours based on message timestamps.

   ``` typescript
   <template>
     <MessageList :MessageTimeDivider="BusinessTimeDivider" />
   </template>

   <script lang="ts" setup>
   import { defineComponent, h } from 'vue';
   import { MessageList } from '@tencentcloud/chat-uikit-vue3';
   import type { MessageInfo } from '@tencentcloud/chat-uikit-vue3';

   const BusinessTimeDivider = defineComponent({
     name: 'BusinessTimeDivider',
     props: {
       previousMessage: {
         type: Object as PropType<MessageInfo | undefined>,
         default: undefined,
       },
       currentMessage: {
         type: Object as PropType<MessageInfo>,
         required: true,
       },
     },
     setup(props) {
       return () => {
         if (!props.previousMessage || !props.currentMessage) {
           return null;
         }

         const currentTime = props.currentMessage.timestamp ?? new Date();
         const previousTime = props.previousMessage.timestamp ?? new Date();
         const shouldShow = currentTime.toDateString() !== previousTime.toDateString()
           || currentTime.getTime() - previousTime.getTime() > 4 * 60 * 60 * 1000;

         if (!shouldShow) {
           return null;
         }

         const hour = currentTime.getHours();
         const day = currentTime.getDay();
         const isWorkingTime = day >= 1 && day <= 5 && hour >= 9 && hour <= 18;

         return h('div', { class: 'message-props-demo__time-divider' }, [
           h(
             'span',
             {
               class: isWorkingTime
                 ? 'message-props-demo__time-label message-props-demo__time-label--work'
                 : 'message-props-demo__time-label message-props-demo__time-label--off',
             },
             isWorkingTime ? 'Business hours' : 'Off hours',
           ),
           currentTime.toLocaleString(),
         ]);
       };
     },
   });
   </script>
   ```

## Related Documentation
- Custom Components - UIKitProvider

- Custom Components - ConversationList

- Custom Components - Chat

- Custom Components - MessageInput

- Custom Components - ChatSetting

- Custom Components - ContactList

- Custom Components - Search

- [chat-uikit-vue3 npm](https://www.npmjs.com/package/@tencentcloud/chat-uikit-vue3)

- [GitHub Demo](https://github.com/Tencent-RTC/TUIKit_Vue3/tree/main/demos/rtcube-vite-vue3)

## Community and Feedback
