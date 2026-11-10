---
sync_node_id: '207623887678570496'
nav_path:
  - "视频会议 SDK"
  - "含 UI 集成"
  - "UI 自定义"
  - "主题及语言（Web）"
product: "room"
---
This guide shows you how to customize the TUIRoomKit conference room interface with your own brand colors and configure multilingual support for global users. **In most cases, you only need to update one or two lines of code to change the theme or set the language**. The guide starts with basic usage and walks through increasingly advanced customization options.
- Built-in dark theme with English interface

   

- Built-in light theme with Chinese interface

   

- Custom green theme with newly added Japanese interface

   

## Prerequisites
- Make sure your project has integrated TUIRoomKit and can successfully open a meeting room. If integration is not complete, see Multi-Party Conference > Quick Integration.

- Understand the purpose of `UIKitProvider`: this is the unified container for theme and language settings. It should wrap the root level of your application. Any theme or language changes made from any child node are applied globally.

   ``` typescript
   <template>
     <UIKitProvider :theme="initialTheme" :language="initialLanguage">
       <router-view />
     </UIKitProvider>
   </template>
   
   <script setup lang="ts">
   import { ref } from 'vue';
   import { UIKitProvider } from '@tencentcloud/uikit-base-component-vue3';
   
   // Load last user preference, or fallback to light theme and browser language
   const initialTheme = ref(localStorage.getItem('tuiRoom-theme') || 'light');
   const initialLanguage = ref(localStorage.getItem('tuiRoom-language') || '');
   </script>
   ```

   > **Note:**
   > 
   > If `initialLanguage` is empty, `UIKitProvider` automatically detects the browser language. Chinese browsers will show Chinese, English browsers will show English—no extra setup needed.
   > 

## Theme Configuration

### Scenario 1: Switch Between Light and Dark Modes

RoomKit offers two built-in color schemes: light and dark. To switch themes, pass the appropriate value to the `theme` property of `UIKitProvider`:
``` typescript
<UIKitProvider theme="dark">
  <ConferenceMainView />
</UIKitProvider>

<script setup>
import { UIKitProvider } from '@tencentcloud/uikit-base-component-vue3';
import { ConferenceMainView } from '@tencentcloud/roomkit-web-vue3';
</script>
```

To allow users to change themes at runtime, use the `useUIKit()` API from any child component:
``` typescript
import { useUIKit } from '@tencentcloud/uikit-base-component-vue3';

const { theme, setTheme } = useUIKit();

function toggleTheme() {
  const next = theme.value === 'dark' ? 'light' : 'dark';
  setTheme(next);
  // Save preference for next visit
  localStorage.setItem('tuiRoom-theme', next);
}
```

### Scenario 2: Customize Brand Color

If you need a specific brand color, pass a hexadecimal color as the primary color. RoomKit will automatically generate a 10-level color palette and apply it to buttons, links, selection states, and highlighted elements.cted states, and highlighted interactive elements.
``` typescript
<UIKitProvider :theme="{ themeStyle: 'light', primaryColor: '#FF6B35' }">
  <ConferenceMainView />
</UIKitProvider>
```

> **Note:**
> The color must use the 6-digit hexadecimal format `#RRGGBB`. Formats like `#RGB`, `rgb()`, or `hsl()` are not supported.
> 

To update the brand color dynamically, call `setTheme()`:
``` typescript
const { setTheme } = useUIKit();

setTheme({ themeStyle: 'light', primaryColor: '#07C160' });
```

### Scenario 3: Customizing Background Color

If your brand uses a background color other than black or white (such as light gray or deep blue), you can simply set the `backgroundColor` property. `UIKitProvider` will automatically derive up to 10 background shades for areas like the top bar, bottom bar, popups, and input fields, according to the brightness hierarchy of the current mode.
``` typescript
<UIKitProvider :theme="{ themeStyle: 'dark', backgroundColor: '#1a1a2e' }">
  <ConferenceMainView />
</UIKitProvider>
```

### Scenario 4: Customize Text Color

To set a specific text color (such as deep blue), use the `textColor` property. RoomKit will automatically generate three levels of text color (primary, secondary, and tertiary) and apply them to titles, descriptions, hints, and other text elements:
``` typescript
<UIKitProvider :theme="{ themeStyle: 'light', textColor: '#1a2742' }">
  <ConferenceMainView />
</UIKitProvider>
```

|Level|Element|Light Mode Opacity|Dark Mode Opacity|
|---------|---------|---------|---------|
|Primary|Name, Title|90%|93%|
|Secondary|Status, Description|55%|55%|
|Tertiary|Hint, Placeholder|40%|30%|

### Scenario 5: Replace the Built-In Theme Switch Button

RoomKit's PC top bar includes a built-in theme switch button on the left. To replace it with your own UI component, first hide the default button, then register your custom component.

#### Step 1: Hide the Built-in Theme Switch Button
``` typescript
import { conference, BuiltinWidget } from '@tencentcloud/roomkit-web-vue3';

conference.setWidgetVisible({ [BuiltinWidget.ThemeWidget]: false });
```

#### Step 2: Register Your Custom Theme Switch Component
``` typescript
import { conference } from '@tencentcloud/roomkit-web-vue3';
import MyThemeToggle from './MyThemeToggle.vue';

conference.registerWidget({
  id: 'my-theme-toggle',
  zone: { pc: 'top-left' }, // Specify the render location for MyThemeToggle
  component: MyThemeToggle,
});
```

In your custom component, use `useUIKit()` to control theme switching:
``` typescript
<!-- MyThemeToggle.vue -->
<script setup lang="ts">
import { useUIKit } from '@tencentcloud/uikit-base-component-vue3';

const { theme, setTheme } = useUIKit();

const toggle = () => {
  const next = theme.value === 'dark' ? 'light' : 'dark';
  setTheme(next);
  localStorage.setItem('tuiRoom-theme', next);
};
</script>

<template>
  <button @click="toggle">{{ theme === 'dark' ? 'Dark Theme' : 'Light Theme' }}</button>
</template>
```

> **Note:**
> `ConferenceMainViewH5` (mobile view) **does not include** a built-in theme switch button. We recommend managing theme and language state at the App.vue level, so users can select their interface language before entering the room, and their selection persists after entry.
> 

### Example: Full Brand Customization

If your design includes a full brand color system, you can combine multiple configuration items into a single object:
``` typescript
<template>
  <UIKitProvider :theme="customTheme" :language="lang">
    <ConferenceMainView />
  </UIKitProvider>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { UIKitProvider } from '@tencentcloud/uikit-base-component-vue3';
import { ConferenceMainView } from '@tencentcloud/roomkit-web-vue3';

const customTheme = ref({
  themeStyle: 'light',
  primaryColor: '#07C160',    // Vibrant green for buttons, links, selected states
  backgroundColor: '#F2FAF5', // Light green background; auto-derives colors for top bar, popups, inputs
  textColor: '#122B1C',       // Deep forest green text; generates primary/secondary/tertiary levels
});

const lang = ref('zh-CN');
</script>
```

## Language Configuration

### Scenario 1: Set the Initial Language

To set the interface language, pass the `language` property to `UIKitProvider`. RoomKit currently supports 'zh-CN' (Simplified Chinese) and 'en-US' (English):
``` typescript
<UIKitProvider language="en-US">
  <ConferenceMainView />
</UIKitProvider>
```

> **Note:**
> If this parameter is omitted, RoomKit will automatically detect and use the browser's language.
> 

### Scenario 2: Switch Language at Runtime

To allow users to change the interface language, call `setLanguage()` from any child component. The UI updates immediately:
``` typescript
import { useUIKit } from '@tencentcloud/uikit-base-component-vue3';

const { language, setLanguage } = useUIKit();

function toggleLanguage() {
  const nextLang = language.value === 'zh-CN' ? 'en-US' : 'zh-CN';
  setLanguage(nextLang);
  // Save preference for next visit
  localStorage.setItem('tuiRoom-language', nextLang);
}
```

### Scenario 3: Customize Interface Text

Sometimes you only need to override specific UI text, such as changing "Room" to "Channel" or "Member" to "Participant". You don't need a full language pack—just override the relevant keys:
``` typescript
import { i18next } from '@tencentcloud/uikit-base-component-vue3';

i18next.addResourceBundle('en-US', 'translation', {
  'Room.TemporaryMeeting': 'Temporary Channel',  // Previously "Temporary Room"
  'Room.End': 'End Room',                 // Previously "End"
  'Participant.Title': 'Participant',          // Previously "Member"
}, true, true);
```

> **Note:**
> - Place this code in `main.ts` so the overrides take effect before any page renders.
> - For a full list of language keys, see `@tencentcloud/roomkit-web-vue3/es/i18n/zh-CN/index.mjs` in the dependency package.

Quick reference for common text key prefixes:

|Prefix|Scope|
|---------|---------|
|`Room.*`|Enter/exit room text, error messages, dialogs.|
|`Microphone.*`|Microphone-related.|
|`Camera.*`|Camera-related.|
|`ScreenShare.*`|Screen sharing.|
|`Setting.*`|Settings panel.|
|`Participant.*`|Participant list.|
|`RoomNotifications.*`|In-room notifications.|
|`RoomChat.*`|Chat functionality.|
|`RoomInvitation.*`|Room invitation-related.|

### Scenario 4: Add Support for New Languages

To support additional languages (such as Japanese or Korean), first register the new translation resources using `i18next.addResourceBundle()`, then use `setLanguage()` to switch languages.

#### Step 1: Register Translation Resources

Register resources at app startup (e.g., in main.ts) to ensure the logic runs before any page component renders:
``` typescript
// main.ts
import { i18next } from '@tencentcloud/uikit-base-component-vue3';

i18next.addResourceBundle('ko-KR', 'translation', {
  'Room.End': '종료',
  'Room.LeaveRoom': '나가기',
  'Microphone.Mute': '음소거',
  'Camera.Start': '카메라 켜기',
  // Refer to the full zh-CN key list for additional keys...
}, true, false);
```

> **Note:**
> For a complete list of language keys, see `@tencentcloud/roomkit-web-vue3/es/i18n/zh-CN/index.mjs` in the dependency package.
> 

#### Step 2: Switch to the New Language

Once resources are registered, call `setLanguage()` from any child component within `<UIKitProvider>` to switch languages dynamically:
``` typescript
import { useUIKit } from '@tencentcloud/uikit-base-component-vue3';

const { setLanguage } = useUIKit();

// Switch to Japanese
setLanguage('ko-KR');
// Save preference for next visit
localStorage.setItem('tuiRoom-language', 'ko-KR');
```

### Scenario 5: Replace the Built-In Language Switch Button

RoomKit's PC interface top bar includes a default "Chinese / English" language switch button on the right. To replace it with your own UI component, first hide the built-in button, then register your custom component.

#### Step 1: Hide the Built-In Language Switch Button
``` typescript
import { conference, BuiltinWidget } from '@tencentcloud/roomkit-web-vue3';

// Hide the built-in button
conference.setWidgetVisible({ [BuiltinWidget.LanguageWidget]: false });
```

#### Step 2: Register Your Custom Language Switch Component
``` typescript
import { conference } from '@tencentcloud/roomkit-web-vue3';
import MyLanguageToggle from './MyLanguageToggle.vue';

// Register your custom component
conference.registerWidget({
  id: 'my-language-toggle',
  zone: { pc: 'top-right' },  // Specify the render location for MyLanguageToggle
  component: MyLanguageToggle,
});
```

Inside your custom component, use `useUIKit()` to control language switching:
``` typescript
<!-- MyLanguageToggle.vue -->
<script setup lang="ts">
import { useUIKit } from '@tencentcloud/uikit-base-component-vue3';

const { language, setLanguage } = useUIKit();

const toggleLanguage = () => {
  // Switch between en-US and ko-KR
  const nextLang = language.value === 'en-US' ? 'ko-KR' : 'en-US';
  setLanguage(nextLang);
  // Save preference to persist after refresh
  localStorage.setItem('tuiRoom-language', nextLang);
};
</script>

<template>
  <button @click="toggleLanguage">
    <span v-if="language === 'en-US'" lang="ko">한국어</span>
    <span v-else lang="en">English</span>
  </button>
</template>
```

> **Note:**
> `ConferenceMainViewH5` (mobile view) **does not include** a built-in language switch button. We recommend managing theme and language state at the App.vue level, so users can select their interface language before entering the room, and their selection persists after entry.
> 

## FAQs

### Configured `primaryColor`, but button colors did not change?

If button colors remain unchanged, the most common cause is an incorrect color format. `primaryColor` only accepts a 6-digit hexadecimal string in the format `#RRGGBB` (e.g., `#FF6B35`). Formats like `#RGB`, `rgb()`, or `hsl()` are not supported.

### Why does some interface text remain unchanged after calling `setLanguage()`?

Text that doesn't update is usually dynamic business data, such as "roomName" or "userName" that you provide. These values are user-generated or retrieved via API and are not managed by RoomKit's static multilingual dictionary. You'll need to handle multilingual state for such data within your own business logic.

### Registered a new language pack, but calling `setLanguage('ja-JP')` has no effect?

Make sure `i18next.addResourceBundle()` or component binding is run before you call `setLanguage()`. We strongly recommend registering language packs during the initialization phase in `main.ts`.

### After refreshing the page, theme and language revert to default?

We recommend saving theme and language state to `localStorage` each time you call `setTheme` or `setLanguage`, and reading from local cache during App.vue initialization:
``` typescript
const initialTheme = ref(localStorage.getItem('tuiRoom-theme') || 'light');
const initialLanguage = ref(localStorage.getItem('tuiRoom-language') || '');
```
