## Overview

The UIKit Vue3 component library provides a complete theme system with light and dark mode support. With simple configuration, you can deliver a consistent visual experience across your app.

### Features
- 🌓 Seamless light/dark theme switching

- ⚡ Real-time theme updates

- 🔧 Simple, easy-to-use configuration

## Quick Start

### Basic Configuration

Wrap your app with `UIKitProvider` and set the theme option to `theme="light"`. Dark mode is also supported via `theme="dark"`.
``` typescript
<template>
  <UIKitProvider theme="light">
    <YourApp />
  </UIKitProvider>
</template>

<script setup lang="ts">
import { UIKitProvider } from '@tencentcloud/chat-uikit-vue3';
import YourApp from './YourApp.vue';
</script>
```

### Switch Theme Outside Components
``` typescript
<template>
  <div>
    <button @click="setTheme('light')">light</button>
    <button @click="setTheme('dark')">dark</button>
    <div>Current theme: {{ theme }}</div>
    <UIKitProvider
      :theme="theme"
    >
      <YourApp />
    </UIKitProvider>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { UIKitProvider, ConversationList } from '@tencentcloud/chat-uikit-vue3';
import YourApp from './YourApp.vue';

type ThemeType = 'light' | 'dark';

const theme = ref<ThemeType>('light');

const setTheme = (_theme: ThemeType) => {
  theme.value = _theme;
};
</script>
```

### Switch Theme Inside Components

Inside a component, use the `useUIKit` hook to change the current theme.
``` typescript
<template>
  <div>
    <div>Current theme: {{ theme }}</div>
    <button @click="setTheme('light')">light</button>
    <button @click="setTheme('dark')">dark</button>
  </div>
</template>

<script setup lang="ts">
import { useUIKit } from '@tencentcloud/chat-uikit-vue3';

const { theme, setTheme } = useUIKit();
</script>
```

## Example — Persisting Theme Preference
``` typescript
<template>
  <UIKitProvider :theme="theme">
    <YourApp />
  </UIKitProvider>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { UIKitProvider } from 'uikit-component-vue3';
import YourApp from './YourApp.vue';

// Initialize theme from localStorage
const theme = ref<'light' | 'dark'>(() => {
  return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
});

// Watch theme changes and persist to localStorage
watch(theme, (newTheme) => {
  localStorage.setItem('theme', newTheme);
}, { immediate: true });
</script>
```

## Notes
- **Provider placement**: Place `UIKitProvider` at the top level above all instant messaging components.

- **Language resources**: Custom language resources are merged with built-in resources; matching keys override built-in entries.

- **Type safety**: When using TypeScript, ensure the configuration you pass matches the type definitions.

## Related Documentation
- Custom Components - UIKitProvider

- Custom Components - ConversationList

- Custom Components - Chat

- Custom Components - MessageInput

- Custom Components - MessageList

- Custom Components - ChatSetting

- Custom Components - C2CSetting State

- Custom Components - GroupSetting State

- Custom Components - ContactList

- Custom Components - Search

- [chat-uikit-vue3 npm](https://www.npmjs.com/package/@tencentcloud/chat-uikit-vue3)

- [GitHub Demo](https://github.com/Tencent-RTC/TUIKit_Vue3/tree/main/demos/rtcube-vite-vue3)

## Community and Feedback
