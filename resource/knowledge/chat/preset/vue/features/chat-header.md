## Overview

`ChatHeader` is the top navigation component of the chat UI. It displays basic information about the active conversation, including the conversation title, avatar, online status, and typing indicators. The component uses a container pattern and provides flexible slots for customizing the left and right action areas.

## Props Quick Reference

| Field | Type | Default | Description |
|---------|---------|---------|---------|
| title | string | undefined | Custom title; falls back to conversation info when not provided. |
| avatarUrl | string | undefined | Custom avatar image URL. |
| enableUserStatus | boolean | false | Whether to show user online status. |
| enableCall | bool | false | Whether to show audio/video call buttons. |

## Slots Quick Reference

| Name | Description |
|---------|---------|
| ChatHeaderLeft | Custom content area on the left side of `ChatHeader`. |
| ChatHeaderRight | Custom content area on the right side of `ChatHeader`. |

## Detailed Props

### title
- **Type**: `string`

- **Description**: Custom conversation title. When not provided, the component automatically displays the appropriate title based on conversation type (user nickname or remark for C2C; group name for group chats). Default: `undefined`.

### avatarUrl
- **Type**: `string`

- **Description**: Custom avatar image URL. When not provided, the component automatically displays the appropriate avatar based on conversation type (user avatar for C2C; group avatar for group chats). Default: `undefined`.

### enableUserStatus
- **Type**: `boolean`

- **Description**: Whether to enable and display user online status. Applies only in one-to-one (C2C) conversations. When enabled, shows the user's online/offline status. Default: `false`.

### enableCall
- **Type**: `boolean`

- **Description**: Whether to enable and display audio/video call buttons. Default: `false`.

- **Note**: Showing call buttons does not mean calls can be initiated. CallKit must be integrated first. See [Integrating TUICallKit](#integrating-tuicallkit).

## Slots Reference

### ChatHeaderLeft

**Description**: Left-side slot for custom header content, typically used for navigation controls such as a back button or menu button.

#### Example: Custom left navigation area
``` typescript
<template>
  <ChatHeader>
    <template #ChatHeaderLeft>
      <!-- Back button: clear the active conversation -->
      <button
        class="nav-button"
        @click="handleBack"
      >
        ⬅️
      </button>
    </template>
  </ChatHeader>
</template>

<script setup lang="ts">
import { ChatHeader, useChatContext } from '@tencentcloud/chat-uikit-vue3';

const { setActiveConversation } = useChatContext();

const handleBack = () => {
  // Clear the active conversation ID
  setActiveConversation('');
};
</script>

<style scoped>
.header-left-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-button {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.nav-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
```

### ChatHeaderRight

**Description**: Right-side slot for custom header content, typically used for action buttons or menus.

#### Example: Integrate `ChatSetting` via `ChatHeaderRight` slot and a drawer component

**App.vue**
``` typescript
<template>
  <div class="chat-container">
    <Chat>
      <ChatHeader>
        <template #ChatHeaderRight>
          <!-- Settings button: open chat settings panel -->
          <button
            class="nav-button"
            @click="setIsSettingOpen(true)"
          >
            ⚙️
          </button>
        </template>
      </ChatHeader>
      <MessageList />
      <MessageInput />
    </Chat>
    <Drawer
      :open="isChatSettingOpen"
      @close="setIsSettingOpen(false)"
    >
      <ChatSetting style="flex: 1;" />
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import {
  Chat,
  ChatHeader,
  MessageList,
  MessageInput,
  ChatSetting
} from '@tencentcloud/chat-uikit-vue3';
import { Drawer } from './components/Drawer.vue';

// State management
const isChatSettingOpen = ref(false);

const setIsSettingOpen = (isOpen: boolean) => {
  isChatSettingOpen.value = isOpen;
};
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
</style>

```

**Drawer.vue**
``` typescript
<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import type { PropType } from 'vue';

const props = defineProps({
  open: { type: Boolean, required: true },
  placement: {
    type: String as PropType<'right' | 'left' | 'bottom'>,
    default: 'right',
  },
  duration: { type: Number, default: 300 },
  container: {
    type: [String, Object] as PropType<string | HTMLElement>,
    default: 'body',
  },
  zIndex: { type: Number, default: 1000 },
  maskClosable: { type: Boolean, default: true },
});

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const isRendered = ref(false);
const isVisible = ref(false);
const isAnimating = ref(false);

const containerTarget = computed(() => props.container ?? 'body');
const cssVars = computed(() => ({
  '--duration': `${props.duration}ms`,
  '--z-index': String(props.zIndex),
}));

watch(
  () => props.open,
  async (nextOpen) => {
    if (nextOpen) {
      // open drawer
      if (!isRendered.value) {
        isRendered.value = true;
      }
      // wait for DOM render
      await nextTick();
      // force repaint, ensure initial state is applied
      requestAnimationFrame(() => {
        isVisible.value = true;
        isAnimating.value = true;
      });
    } else {
      // close drawer
      isVisible.value = false;
      isAnimating.value = true;
    }
  },
  { immediate: true },
);

function onMaskClick() {
  if (props.maskClosable) {
    emit('close');
  }
}

function handlePanelTransitionEnd(e: TransitionEvent) {
  if (e.propertyName !== 'transform') {
    return;
  }
  isAnimating.value = false;
  if (!isVisible.value) {
    isRendered.value = false;
  }
}

function handleMaskTransitionEnd(e: TransitionEvent) {
  if (e.propertyName !== 'opacity') {
    // mask animation end
  }
}
</script>

<template>
  <Teleport :to="containerTarget">
    <div
      v-if="isRendered"
      :class="[$style.wrapper, isVisible ? $style['wrapper-open'] : '']"
      :style="cssVars"
    >
      <div
        :class="[$style.mask, isVisible ? $style['mask-open'] : '']"
        @click="onMaskClick"
        @transitionend="handleMaskTransitionEnd"
      />
      <div
        :class="[
          $style.panel,
          $style[`from-${props.placement}`],
          isVisible ? $style['panel-open'] : ''
        ]"
        @click.stop
        @transitionend="handlePanelTransitionEnd"
      >
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<style module lang="scss">
.wrapper{position:fixed;inset:0;z-index:var(--z-index);pointer-events:none;}.wrapper-open{pointer-events:auto;}.mask{position:absolute;inset:0;background:rgba(0,0,0,0.45);opacity:0;transition:opacity var(--duration) ease;pointer-events:auto;}.mask-open{opacity:1;}.panel{position:absolute;background:var(--bg-color-operate);max-width:100%;max-height:100%;transition:transform var(--duration) ease;pointer-events:auto;box-shadow:0 8px 16px rgba(0,0,0,0.15);display:flex;flex-direction:row;}.from-right{top:0;right:0;height:100%;width:320px;transform:translateX(100%);}.from-left{top:0;left:0;height:100%;width:320px;transform:translateX(-100%);}.from-bottom{left:0;bottom:0;width:100%;height:40%;transform:translateY(100%);}.panel-open.from-right,.panel-open.from-left,.panel-open.from-bottom{transform:translate(0,0);}
</style>

```

## Integrating TUICallKit

Install `@tencentcloud/call-uikit-vue` and import it in your project. For more information, see [Audio/Video Calling (with UI)](https://cloud.tencent.com/document/product/647/78742).
``` typescript
<script lang="ts" setup>
import { Teleport } from 'vue';
import { TUICallKit } from '@tencentcloud/call-uikit-vue';
<script>

<template>
  <UIKitProvider>
    <Teleport to="body">
      <TUICallKit
        style="
          position: fixed;
          width: 600px;
          height: 400px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1000;
        "
      />
    </Teleport>
    // other code ...
  </UIKitProvider>
<template>
```

## Related Documentation
- Custom Components - Chat Container

- Custom Components - UIKitProvider

- Custom Components - ConversationList

- Custom Components - MessageList

- Custom Components - MessageInput

- Custom Components - ChatSetting

- Custom Components - ContactList

- Custom Components - Search

- [chat-uikit-vue3 npm](https://www.npmjs.com/package/@tencentcloud/chat-uikit-vue3)

- [GitHub Demo](https://github.com/Tencent-RTC/TUIKit_Vue3/tree/main/demos/rtcube-vite-vue3)

## Community and Feedback
