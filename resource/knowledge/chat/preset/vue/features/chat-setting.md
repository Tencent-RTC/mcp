## Component Overview

`ChatSetting` is a smart chat settings component that automatically renders the appropriate settings UI based on the currently active conversation type. It integrates both C2C (one-to-one) chat settings and group chat settings, providing a unified entry point for chat configuration.

Core characteristics:
- **Auto-adaptation**: Automatically switches the settings UI based on conversation type (one-to-one or group chat).

- **State-driven**: Content updates automatically based on the currently active conversation state.

   > **Note:**
   >

   > The component is not displayed when no conversation is active.
   >

## Quick Start

`ChatSetting` is a standalone component you can use freely. For flexibility, UIKit does not provide a default integration pattern.

The recommended approach is to combine it with the `ChatHeaderRight` slot on `ChatHeader` to control `ChatSetting` visibility. Example:
``` typescript
<template>
  <UIKitProvider>
    <Chat>
      <ChatHeader>
        <template #ChatHeaderRight>
          <button @click="toggleChatSetting">
            ⚙️ Settings
          </button>
        </template>
      </ChatHeader>
      <MessageList />
      <MessageInput />
    </Chat>
    <Drawer
      :open="isSettingVisible"
      title="Chat Settings"
    >
      <ChatSetting />
    </Drawer>
  </UIKitProvider>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ChatHeader } from '@tencentcloud/chat-uikit-vue3';
// Assume you have a Drawer component
import { Drawer } from 'your-ui-library';

const isSettingVisible = ref(false);

const toggleChatSetting = () => {
  isSettingVisible.value = !isSettingVisible.value;
};
</script>
```

## Related Documentation
- Custom Components - UIKitProvider

- Custom Components - ConversationList

- Custom Components - Chat

- Custom Components - MessageInput

- Custom Components - MessageList

- Custom Components - ChatSetting

- Custom Components - ContactList

- Custom Components - Search

- [chat-uikit-vue3 npm](https://www.npmjs.com/package/@tencentcloud/chat-uikit-vue3)

- [GitHub Demo](https://github.com/Tencent-RTC/TUIKit_Vue3/tree/main/demos/rtcube-vite-vue3)

## Community and Feedback
