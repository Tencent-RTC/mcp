TUIKit is a Vue 3 UI component library built on the Tencent Cloud Chat SDK. It provides common UI components for conversations, chat, groups, and more. This guide explains how to quickly integrate TUIKit and implement core features.

> **Note:**
> - **AI assistant usage**
>
> The Skill provides **IM knowledge Q&A** and **Vue 3 Composition API integration without UI** capabilities. You can use the Skill in your IDE to query SDK, UIKit, server-side API, billing, and other topics, or integrate IM into a Vue 3 project. [Try the AI integration and Q&A assistant](https://cloud.tencent.com/document/product/269/125822).

## Key concepts

`chat-uikit-vue3` includes core UI components such as ConversationList, Chat, MessageList, ChatHeader, MessageInput, ChatSetting, Search, and Contact. Each component renders a specific part of the chat experience.

- ConversationList — conversation list component.

- Chat — container component for a conversation.

- MessageList — message list component for a conversation.

- ChatHeader — header component for a conversation.

- MessageInput — message input component.

- ChatSetting — management component for one-to-one and group chats.

- Search — cloud search component.

- Contact — contact component.

## Prerequisites

- Vue.js@^3.0.0

- TypeScript@^5.0.0

- Node.js (Node.js ≥ 20.0.0; LTS v22 is recommended)

## Create a project

Use Vite to create a new Vue 3 project named **chat-integration-vue3**.

> **Note:**
> Recent Vite versions require a recent Node.js version.

【shell】
``` bash
npm create vite@latest
```

Scaffold options can follow these choices:

``` java
◇  Project name:
│  chat-integration-vue3
│
◇  Select a framework:
│  Vue
│
◇  Select a variant:
│  TypeScript
│
◆  Install with npm and start now?
│  ● Yes / ○ No
└
```

## Download and import components

After creating the project, switch to the project directory.

【shell】
``` bash
cd chat-integration-vue3
```

### Step 1: Install dependencies

> **Note:**
> npm is recommended. npm automatically installs required peer dependencies.

【shell】
``` bash
npm i @tencentcloud/chat-uikit-vue3@6 tuikit-atomicx-vue3@6
```

### Step 2: Import components

> **Note:**
> The code below does not include `SDKAppID`, `userID`, or `userSig`. Replace them with values from Step 3.

#### 2.1 Set up the entry page

For example, add the following code to `src/App.vue`. Log in before rendering the chat page to avoid calling APIs before login.

``` typescript
<template>
  <UIKitProvider language="en-US" theme="light">
    <ChatLayout v-if="isLoggedIn" />
  </UIKitProvider>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { UIKitProvider, useLoginState } from '@tencentcloud/chat-uikit-vue3';
import ChatLayout from './components/ChatLayout.vue';

const { login } = useLoginState();
const isLoggedIn = ref(false);

login({
  sdkAppId: 0, // SDKAppID, number type
  userId: '',  // UserID, string type
  userSig: '', // userSig, string type
}).then(() => {
  isLoggedIn.value = true;
});
</script>

<style>
body { margin: 0; padding: 0; font-family: Inter, Avenir, Helvetica, Arial, sans-serif; }
#app { width: 100vw; height: 100vh; }
#app > div { display: flex; align-items: center; justify-content: center; }
</style>
```

#### 2.2 Set up the chat page

Create `src/components/ChatLayout.vue` and add the following:

``` typescript
<template>
  <div class="chat-layout">
    <SideTab :active-tab="activeTab" @tab-change="(tab) => activeTab = tab" />

    <div class="list-panel">
      <ConversationList v-show="activeTab === 'conversations'" />
      <ContactList v-show="activeTab === 'contacts'" />
    </div>

    <div v-show="activeTab === 'conversations'" class="chat-panel">
      <Chat :PlaceholderEmpty="EmptyChatTpl">
        <ChatHeader>
          <template #ChatHeaderRight>
            <button class="icon-btn" @click="settingOpen = !settingOpen">
              <IconMenu size="20" />
            </button>
          </template>
        </ChatHeader>
        <MessageList />
        <MessageInput>
          <template #headerToolbar>
            <div class="toolbar">
              <div class="toolbar-left">
                <EmojiPicker /><FilePicker /><VideoPicker /><ImagePicker />
              </div>
              <button class="icon-btn" @click="searchOpen = !searchOpen">
                <IconSearch size="20" />
              </button>
            </div>
          </template>
        </MessageInput>
        <div v-if="settingOpen" class="float-sidebar">
          <ChatSetting @close="settingOpen = false" />
        </div>
      </Chat>
    </div>

    <div v-if="searchOpen && activeTab === 'conversations'" class="search-sidebar">
      <div class="search-sidebar-header">
        <span class="search-sidebar-title">Search</span>
        <button class="icon-btn" @click="searchOpen = false">✕</button>
      </div>
      <Search :variant="VariantType.EMBEDDED" />
    </div>

    <div v-show="activeTab === 'contacts'" class="detail-panel">
      <ContactInfo @send-message="activeTab = 'conversations'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import {
  Chat, Search, ChatHeader, MessageList, MessageInput,
  ConversationList, ContactList, ContactInfo, ChatSetting,
  EmojiPicker, FilePicker, VideoPicker, ImagePicker,
  VariantType, useChatContext,
} from '@tencentcloud/chat-uikit-vue3';
import { IconMenu, IconSearch } from '@tencentcloud/uikit-base-component-vue3';
import SideTab from './SideTab.vue';

const { activeConversation } = useChatContext();

const activeTab = ref<'conversations' | 'contacts'>('conversations');
const settingOpen = ref(false);
const searchOpen = ref(false);

watch(() => activeConversation.value?.conversationID, () => {
  settingOpen.value = false;
  searchOpen.value = false;
});

watch(activeTab, () => {
  settingOpen.value = false;
  searchOpen.value = false;
});

const EmptyChatTpl = { template: `
  <div class="empty-chat">
    <div style="font-size:48px;opacity:.3">💬</div>
    <div style="font-size:15px;font-weight:600;color:#6c757d">No conversations</div>
    <div style="font-size:13px;color:#868e96">Select a conversation to start chatting</div>
  </div>
`};
</script>

<style scoped>
.chat-layout { height: 60vh; aspect-ratio: 16/9; display: flex; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,.3), 0 0 0 1px rgba(255,255,255,.1); overflow: hidden; }
@media (max-width: 1920px) { .chat-layout { height: 80vh; } }
.list-panel { width: 300px; display: flex; flex-direction: column; border-right: 1px solid var(--stroke-color-primary); overflow: hidden; }
.detail-panel { flex: 1; }
.icon-btn { padding: 4px 6px; display: flex; align-items: center; justify-content: center; border: none; background: transparent; border-radius: 4px; font-size: 20px; color: var(--text-color-primary); cursor: pointer; outline: none; }
.icon-btn:hover { background-color: var(--button-color-secondary-hover); }
.toolbar { display: flex; justify-content: space-between; align-items: center; }
.toolbar-left { display: flex; align-items: center; gap: 4px; }
.search-sidebar { border-left: 1px solid var(--stroke-color-primary); display: flex; flex-direction: column; flex: 0 0 300px; }
.search-sidebar-header { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid var(--stroke-color-primary); }
.search-sidebar-title { font-size: 16px; font-weight: 500; color: var(--text-color-primary); }
.chat-panel { flex: 1; position: relative; display: flex; }
.float-sidebar { position: absolute; right: 0; top: 0; bottom: 0; min-width: 300px; max-width: 400px; display: flex; flex-direction: column; background-color: var(--bg-color-operate); box-shadow: -2px 0 8px rgba(0,0,0,.04), -4px 0 16px rgba(0,0,0,.06); overflow: auto; z-index: 1000; }
.empty-chat { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; background-color: var(--bg-color-operate); border-left: 1px solid rgba(0,0,0,.08); }
</style>

<style>
#app { text-align: start; }
</style>
```

#### 2.3 Add side navigation

Create `src/components/SideTab.vue` and add the following:

``` typescript
<template>
  <div class="side-tab" :class="{ dark: isDark }">
    <!-- User avatar -->
    <div class="avatar-wrapper">
      <Avatar class="avatar" :src="loginUserInfo?.avatarUrl" />
      <div class="tooltip">
        <div class="tooltip-name">{{ loginUserInfo?.userName || 'Unnamed' }}</div>
        <div class="tooltip-id">ID: {{ loginUserInfo?.userId }}</div>
      </div>
    </div>
    <!-- Tab switch -->
    <div class="tabs">
      <div
        class="tab-item"
        :class="{ active: props.activeTab === 'conversations' }"
        @click="handleTabChange('conversations')"
        title="Conversations"
      >
        <IconChatNew size="24" />
      </div>
      <div
        class="tab-item"
        :class="{ active: props.activeTab === 'contacts' }"
        @click="handleTabChange('contacts')"
        title="Contacts"
      >
        <IconContacts size="24" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useLoginState, useUIKit, Avatar } from '@tencentcloud/chat-uikit-vue3';
import { IconChatNew, IconContacts } from '@tencentcloud/uikit-base-component-vue3';

const { theme } = useUIKit();
const { loginUserInfo } = useLoginState();

const isDark = computed(() => theme.value === 'dark' || theme.value === 'serious');

interface Props {
  activeTab?: 'conversations' | 'contacts';
}

const props = withDefaults(defineProps<Props>(), {
  activeTab: 'conversations'
});

const emit = defineEmits<{
  tabChange: [tab: 'conversations' | 'contacts'];
}>();

const handleTabChange = (tab: 'conversations' | 'contacts') => {
  emit('tabChange', tab);
};
</script>

<style scoped>
.side-tab{width:72px;height:100vh;background:var(--bg-color-function);display:flex;flex-direction:column;align-items:center;padding:20px 0;transition:background 0.3s;}.avatar-wrapper{position:relative;margin-bottom:24px;cursor:pointer;}.avatar-wrapper:hover:deep(.avatar){transform:scale(1.05);box-shadow:0 4px 12px rgba(0,0,0,0.15);}.tooltip{position:absolute;left:60px;top:50%;transform:translateY(-50%);padding:8px 12px;background:rgba(0,0,0,0.85);color:#fff;border-radius:6px;white-space:nowrap;opacity:0;visibility:hidden;pointer-events:none;transition:all 0.3s;z-index:1000;}.tooltip::before{content:'';position:absolute;left:-6px;top:50%;transform:translateY(-50%);border:6px solid transparent;border-right-color:rgba(0,0,0,0.85);}.avatar-wrapper:hover .tooltip{opacity:1;visibility:visible;}.tooltip-name{font-size:14px;font-weight:500;margin-bottom:4px;}.tooltip-id{font-size:12px;opacity:0.8;}.tabs{display:flex;flex-direction:column;gap:16px;}.tab-item{width:48px;height:48px;display:flex;align-items:center;justify-content:center;border-radius:12px;cursor:pointer;transition:all 0.3s;color:var(--text-color-primary);}.tab-item:hover{background:rgba(0,0,0,0.05);}.tab-item.active{background:var(--button-color-primary-default);color:var(--text-color-button);}.side-tab.dark{background:#1a1a1a;}.side-tab.dark .avatar-wrapper:hover:deep(.avatar){box-shadow:0 4px 12px rgba(255,255,255,0.2);}.side-tab.dark .tooltip{background:rgba(255,255,255,0.95);color:#1a1a1a;}.side-tab.dark .tooltip::before{border-right-color:rgba(255,255,255,0.95);}.side-tab.dark .tab-item:hover{background:rgba(255,255,255,0.1);}.side-tab.dark .tab-item.active{background:#1890ff;color:#fff;}
</style>
```

### Step 3: Get SDKAppID, userID, and userSig

In the `login` function in `src/App.vue` from the previous step, fill in SDKAppID, userID, and userSig.

``` java
// Login
login({
  sdkAppId: 0, // number type
  userId: '',  // string type
  userSig: '', // string type
});
```

| Parameter | Type | Description |
| --- | --- | --- |
| SDKAppID | Number | SDKAppID is the unique identifier for your Tencent Cloud IM application. Create an app in the [Chat console](https://console.cloud.tencent.com/im) to obtain SDKAppID.<br><strong>Note:</strong><br>SDKAppID uniquely identifies each IM application. We recommend applying for a separate SDKAppID for each independent app. Messages are isolated between different SDKAppIDs and cannot interoperate. |
| userID | String | A unique user identifier defined by you. It can contain only letters (a-z, A-Z), digits (0-9), underscores, and hyphens. |
| userSig | String | The credential used to log in to Chat IM. It is ciphertext generated by encrypting UserID and related information.<br><strong>Note:</strong><br>Development: For quick local testing, you can obtain UserSig from the [Chat console](https://console.cloud.tencent.com/im).<br>Production: Integrate UserSig generation on your server and expose project-specific APIs. See [Generate UserSig on the server](https://cloud.tencent.com/document/product/269/32688) for the correct approach. |

> **Note:**
> The sample code in this guide obtains UserSig from the [Chat console](https://console.cloud.tencent.com/im). **This method is for local debugging only.** For production, see [Generate UserSig on the server](https://cloud.tencent.com/document/product/269/32688).

- SDKAppID: In [Chat console > Application Management](https://console.cloud.tencent.com/im), click **Create application** to obtain SDKAppID.

- userID: In [Chat console > Chat > Account Management](https://console.cloud.tencent.com/im/account-management), switch to the target application account. Create 2–3 accounts to try one-to-one and group chat.

- userSig: In [Chat console > Development Tools > UserSig Generation and Verification](https://console.cloud.tencent.com/im/tool-usersig), switch to the target application account, enter the UserID you created, and generate UserSig.

## Run and test

Run the project with:

【shell】
``` bash
 npm run dev
```

> **Note:**
> - Ensure SDKAppID, userID, and userSig in Step 3 are replaced. Missing values will cause unexpected behavior.
> - userID and userSig must match one-to-one.
> - If the project fails to start, verify that the development environment requirements are met.

## Advanced features

### Audio and video calls

> **Note:**
> TUICallKit is a Tencent Cloud audio and video call UI component. With a few lines of code, you can add call features to your chat app.
>
> For more details, see Audio and video calls — Enable the service.

1. Install the `@trtc/calls-uikit-vue` dependency.

   ``` bash
     npm install @trtc/calls-uikit-vue
   ```
2. Export `TUICallKit` from `@trtc/calls-uikit-vue` and mount it in the DOM.

   Add the following to `src/App.vue`:

   ``` typescript
   // src/App.vue
   <template>
     <UIKitProvider language="en-US" theme="light">
       <!-- Mount the audio/video call component -->
       <TUICallKit class="call-kit" />
       ...
     </UIKitProvider>
   </template>

   <script setup lang="ts">
   // Import the audio/video call component
   import { TUICallKit } from '@trtc/calls-uikit-vue';
   </script>
   ```
3. Uncomment the call pickers in the `#headerToolbar` slot of `<MessageInput />`.

   ``` java
   <MessageInput class="message-input-container">
     <template #headerToolbar>
       <div class="message-toolbar">
         <div class="message-toolbar-actions">
           <EmojiPicker />
           <FilePicker />
           <VideoPicker />
           <ImagePicker />
           <AudioCallPicker />
           <VideoCallPicker />
         </div>
         <button class="icon-button" @click="isSearchInChatShow = !isSearchInChatShow">
           <IconSearch size="20" />
         </button>
       </div>
     </template>
   </MessageInput>
   ```
4. Place an audio call.

### Cloud search

> **Note:**
> Search is essential in customer service, social, online education, online healthcare, OA, and similar scenarios. It helps users quickly find groups, users, and messages and improves product experience and retention.
>
> Due to Web platform storage limitations, Vue **does not support local search**. To meet search requirements, we provide **cloud search**. **Cloud search supports global search and in-conversation search, and can search groups, users, and messages.**
>
> This is a value-added feature. Purchase the cloud search plugin: [Purchase](https://console.cloud.tencent.com/im/plugin/TUICloudSearch).

Cloud search is integrated by default in Step 2. To disable it, use the following:

1. Set the `enableSearch` prop on `ConversationList` to `false`:

   ``` typescript
   <template>
     <ConversationList v-show="activeTab === 'conversations'" :enable-search="false" />
   </template>
   ```
2. Comment out the in-conversation search sidebar code:

   ``` typescript
   <template>
     <Chat>
       <!-- <div v-show="isSearchInChatShow" class="chat-sidebar" :class="{ dark: theme === 'dark' }">
         <div class="chat-sidebar-header">
           <span class="chat-sidebar-title">Search</span>
           <button class="icon-button" @click="isSearchInChatShow = false">✕</button>
         </div>
         <Search :variant="VariantType.EMBEDDED" />
       </div> -->
     </Chat>
   </template>
   ```

## FAQ

### What is UserSig? How do I generate UserSig?

UserSig is the credential used to log in to Chat IM. It is ciphertext generated by encrypting UserID and related information. The recommended approach is to integrate UserSig generation on your server and expose project-specific APIs. When UserSig is needed, your client requests a dynamic UserSig from your business server. See [Generate UserSig on the server](https://cloud.tencent.com/document/product/269/32688) for details.

> **Note:**
> The sample code in this guide obtains UserSig from the [Chat console](https://console.cloud.tencent.com/im). **This method is for local debugging only.** For production, see [Generate UserSig on the server](https://cloud.tencent.com/document/product/269/32688).

### Can I use a third-party component library such as Element Plus?

You can use other component libraries for glue code between core components. For example, you can wrap `<ChatSetting />` in a full-screen drawer. Components inside core components cannot be customized yet.

``` java
const isChatSettingShow = ref(false);

<el-drawer
  v-model="isChatSettingShow"
  title="Settings"
>
    <ChatSetting />
</el-drawer>
```

### Emoji stickers

To respect copyright, the **default yellow-face emoji stickers shown below are owned by Tencent Cloud**. You can use them for free by upgrading to the [IM Enterprise Edition plan](https://buy.cloud.tencent.com/avc).

## Reference

### Official documentation

- Custom components — UIKitProvider

- Custom components — Chat

- Custom components — ChatHeader

- Custom components — ConversationList

- Custom components — MessageList

- Custom components — MessageInput

- Custom components — ChatSetting

- Custom components — ContactList

- Custom components — Search

### NPM packages

[chat-uikit-vue3 npm](https://www.npmjs.com/package/@tencentcloud/chat-uikit-vue3)

### GitHub

[GitHub Demo](https://github.com/Tencent-RTC/TUIKit_Vue3/tree/main/demos/rtcube-vite-vue3)
