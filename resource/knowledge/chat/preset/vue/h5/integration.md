TUIKit is a Vue 3 UI component library built on top of the Tencent Cloud Chat SDK. It provides common UI components covering conversations, chat, groups, and more. This guide walks you through quickly integrating TUIKit and implementing core features.

| Integration Need | Desktop | Mobile H5 |
|---------|---------|---------|
| New Web Vue3 project | Full Integration > Mobile > Vue3 |
| New Web React project | Full Integration > Desktop > React | Full Integration > Mobile > React |
| Web Vue2 project | Full Integration > Desktop > Vue2 & Legacy Vue3 | Full Integration > Desktop > Vue2 & Legacy Vue3 |

## Key Concepts

chat-uikit-vue3 consists of core UI components including ConversationListH5, Chat, MessageListH5, ChatHeaderH5, MessageInputH5, ChatSettingH5, SearchH5, and ContactH5. Each component is responsible for rendering different content.
- ConversationListH5 provides the conversation list component.

- Chat provides the conversation container component.

- MessageListH5 provides the message list component for conversations.

- ChatHeaderH5 provides the conversation header component.

- MessageInputH5 provides the message input component.

- ChatSettingH5 provides the management component for one-to-one and group chats.

- SearchH5 provides the cloud search component.

- ContactH5 provides the contacts component.

## Prerequisites
- Vue.js@^3.0.0

- TypeScript@^5.0.0

- Node.js (Node.js >= 20.0.0, LTS version recommended)

## Quick Start with the Complete Example Project

If you want to quickly see the full result, or need a code reference during integration, you can clone our ready-made example project. The example project has completed Chat UIKit dependency installation, component imports, initialization configuration, and basic page integration — ideal as an integration reference.
``` bash
git clone https://gitee.com/tencent-cloud-uikit/rtc-chat-web.git
cd chat-mobile-vue3
npm install
npm run dev
```

> **Note:**
> Example project: [View on Gitee](https://gitee.com/tencent-cloud-uikit/rtc-chat-web).
>
> The example project helps you quickly experience the integration flow. If you need to integrate into an existing project, continue reading the steps below.
>

## Create a Project

Use Vite to create a new Vue3 project named chat-integration-vue3-h5 and follow the scaffold prompts to initialize the project. After the initial project starts successfully, you can remove the scaffold's sample files and default styles (default styles in src/style.css, src/assets, icons in public, etc.), keeping only src/main.ts and index.html.

> **Note:**
> 1. It is recommended to use npm for installation, as npm will automatically download the required peerDependencies.
> 2. `npm create vite@latest` uses the latest Vite version, which may conflict with older Node.js versions. Please check your environment configuration.

[shell]
``` bash
npm create vite@latest

◇  Project name:
│  chat-integration-vue3-h5
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

## Download and Import Components

### Step 1: Install Dependencies

[shell]
``` bash
npm install @tencentcloud/chat-uikit-vue3 @tencentcloud/uikit-base-component-vue3
```

### Step 2: Import Components
1. Configure the mobile viewport.

   The first step for a great mobile experience: in the project root, set the default viewport in index.html to full-screen coverage with locked scaling, making the page feel more like a native app.

   ``` html
   <!DOCTYPE html>
   <html lang="zh-CN">
     <head>
       <meta charset="UTF-8" />
       <!-- H5 viewport: 覆盖刘海屏区域，锁定缩放，营造类原生应用的体验 -->
       <meta
         name="viewport"
         content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
       />
       <title>Chat UIKit H5 Quickstart</title>
     </head>
     <body>
       <div id="app"></div>
       <script type="module" src="/src/main.ts"></script>
     </body>
   </html>
   ```
2. Configure the global entry point and base styles.

   Write the following into **src/main.ts**.

   ``` typescript
   import { createApp } from 'vue';
   import App from './App.vue';
   import './styles.css';

   createApp(App).mount('#app');
   ```

   Create **src/styles.css** and set the global base styles.

   ``` css
   /* ------- 移动端基础布局 ------- */
   * {
     box-sizing: border-box;
   }

   html,
   body,
   #app {
     width: 100%;
     height: 100%;
     margin: 0;
   }

   body {
     /* 使用 dvh 来处理 iOS Safari 地址栏. */
     min-height: 100vh;
     min-height: 100dvh;
     font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
     color: #1f2329;
     background: #f5f6f8;
     /* 移除移动版 WebKit 上的点击亮块。 */
     -webkit-tap-highlight-color: transparent;
   }

   button {
     font: inherit;
     cursor: pointer;
   }

   /* 16px 可防止 iOS 在输入框获得焦点时自动放大屏幕。 */
   input {
     font-size: 16px;
   }
   ```
3. Configure the app home page.

   Write the following into **src/App.vue** to route between the login page and chat page.

   ``` typescript
   <script setup lang="ts">
   import { ref, watch } from 'vue';
   import { UIKitProvider, useLoginState } from '@tencentcloud/chat-uikit-vue3';
   import LoginView from './LoginView.vue';
   import ChatLayout from './ChatLayout.vue';
   import { languageResources } from './i18n';

   enum LoginStatus {
     UNKNOWN = 0,
     LOGINED = 1,
   }

   // 语言在此处进行维护，并通过 UIKitProvider 的 `language` 属性进行配置。
   // 这是控制语言的推荐方式
   // 更新这个单一数据源，它驱动整个 UIKit。
   const language = ref('zh-CN');

   const { loginStatus } = useLoginState();
   </script>

   <template>
     <UIKitProvider theme="light" :language="language" :language-resources="languageResources">
       <LoginView v-if="loginStatus !== LoginStatus.LOGINED" />
       <ChatLayout v-else />
     </UIKitProvider>
   </template>
   ```
4. Configure the login page and chat page.

   Create **src/LoginView.vue** and write the following code to build the login page.

[src/LoginView.vue]
``` typescript
<script setup lang="ts">
import { ref } from 'vue';
import { useLoginState, useUIKit } from '@tencentcloud/chat-uikit-vue3';

const { login } = useLoginState();
const { t, language, setLanguage } = useUIKit();

// 语言切换器中显示的语言。标签使用本来的语言，确保用户
// 不受当前 UI 语言影响，始终能识别自己的选项。
const LANGUAGES = [
  { value: 'zh-CN', label: '中文' },
  { value: 'en-US', label: 'English' },
];

const sdkAppId = ref<number>();
const userId = ref('');
const userSig = ref('');
const loading = ref(false);
const error = ref('');

async function handleSubmit() {
  error.value = '';
  if (!sdkAppId.value || !userId.value || !userSig.value) {
    error.value = t('demo.error.required');
    return;
  }

  loading.value = true;
  try {
    await login({
      sdkAppId: Number(sdkAppId.value),
      userId: userId.value,
      userSig: userSig.value,
    });
  } catch (e) {
    error.value = e instanceof Error ? e.message : t('demo.error.loginFailed');
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="login">
    <div class="login__lang" role="group" aria-label="Language">
      <button
        v-for="item in LANGUAGES"
        :key="item.value"
        type="button"
        :class="['login__lang-btn', { 'login__lang-btn--active': item.value === language }]"
        @click="setLanguage(item.value)"
      >
        {{ item.label }}
      </button>
    </div>

    <form class="login__card" @submit.prevent="handleSubmit">
      <h1 class="login__title">{{ t('demo.appTitle') }}</h1>

      <label class="login__field">
        <span>{{ t('demo.field.sdkAppId') }}</span>
        <input v-model.number="sdkAppId" type="number" :placeholder="t('demo.placeholder.sdkAppId')" />
      </label>

      <label class="login__field">
        <span>{{ t('demo.field.userId') }}</span>
        <input v-model="userId" type="text" :placeholder="t('demo.placeholder.userId')" />
      </label>

      <label class="login__field">
        <span>{{ t('demo.field.userSig') }}</span>
        <input v-model="userSig" type="text" :placeholder="t('demo.placeholder.userSig')" />
      </label>

      <p v-if="error" class="login__error">{{ error }}</p>

      <button class="login__submit" type="submit" :disabled="loading">
        {{ loading ? t('demo.loggingIn') : t('demo.login') }}
      </button>
    </form>
  </div>
</template>

```

   Create **src/ChatLayout.vue** and write the following code to build the main chat layout.

[src/ChatLayout.vue]
``` typescript
<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import {
  Chat,
  ChatHeaderH5,
  ChatSettingH5,
  ContactInfoH5,
  ContactListH5,
  ConversationListH5,
  MessageInputH5,
  MessageListH5,
  SearchH5,
  VariantType,
  useChatContext,
  useLoginState,
  useUIKit,
} from '@tencentcloud/chat-uikit-vue3';
import { IconMenu, IconSearch } from '@tencentcloud/uikit-base-component-vue3';
import type { ContactGroupItem } from '@tencentcloud/chat-uikit-vue3';

type MobileView = 'conversations' | 'chat' | 'contacts' | 'contactInfo' | 'search' | 'setting';

const { activeConversation, activeConversationID, sendMessage, setActiveConversation } = useChatContext();
const { loginUserInfo, logout } = useLoginState();
const { t, language, setLanguage } = useUIKit();

const defaultOpenConversationID = ref('C2Cadministrator');

function toggleLanguage() {
  setLanguage(language.value === 'zh-CN' ? 'en-US' : 'zh-CN');
}

const activeView = ref<MobileView>('conversations');

// 记住搜索是从哪里打开的，使其返回按钮能回到原处。
const previousView = ref<MobileView>('chat');
const selectedContact = ref<ContactGroupItem>();

function openFromChat(view: 'search' | 'setting') {
  previousView.value = activeView.value;
  activeView.value = view;
}

function handleConversationSelect() {
  activeView.value = 'chat';
}

function handleContactSelect(contact: ContactGroupItem) {
  selectedContact.value = contact;
  activeView.value = 'contactInfo';
}

function handleSendMessage(contact) {
  setActiveConversation(`C2C${contact.userID}`);
  activeView.value = 'chat';
}

function handleEnterGroup(group) {
  setActiveConversation(`GROUP${group.groupID}`);
  activeView.value = 'chat';
}

function handleChatBack() {
  setActiveConversation(undefined);
  activeView.value = 'conversations';
}

function handleSearchResultClick(_item: unknown, type: string) {
  if (type === 'chat_message') {
    activeView.value = 'chat';
  }
}

watch(activeConversationID, (id, prevId) => {
  if (id && id !== prevId && activeView.value === 'conversations') {
    activeView.value = 'chat';
  }
});

onMounted(() => {
  setTimeout(() => {
    if (activeConversation.value?.conversationID === defaultOpenConversationID.value) {
      sendMessage({
        type: 'textMessage',
        text: `欢迎体验 Chat Vue3 移动端WEB应用 Demo～

您可以按照以下顺序体验 IM 的核心功能：
1. 在输入框内发送一条文本消息。
2. 输入框上的工具栏支持，语音通话、视频通话、快速会议、图片、视频、文件发送等扩展功能。
3. 如果您想添加好友，可以前往联系人页面点击"添加好友/群聊"。
`
      });
    }
  }, 1000);
});
</script>

<template>
  <div class="app-shell">
    <!-- View: conversation list -->
    <section v-show="activeView === 'conversations'" class="screen">
      <header class="topbar">
        <span class="topbar__title">
          {{ t('demo.chats') }}{{ loginUserInfo?.userId ? ` · ${loginUserInfo.userId}` : '' }}
        </span>
        <div class="chat-pane__actions">
          <button class="topbar__text-btn" type="button" @click="toggleLanguage">
            {{ language === 'zh-CN' ? 'EN' : '中' }}
          </button>
          <button class="topbar__text-btn" type="button" @click="logout">{{ t('demo.logout') }}</button>
        </div>
      </header>
      <div class="screen__body">
        <ConversationListH5
          style="height: 100%"
          @select-conversation="handleConversationSelect"
          @before-create-conversation="handleConversationSelect"
        />
      </div>
      <nav class="tabbar">
        <button class="tabbar__item tabbar__item--active" type="button">{{ t('demo.chats') }}</button>
        <button class="tabbar__item" type="button" @click="activeView = 'contacts'">{{ t('demo.contacts') }}</button>
      </nav>
    </section>

    <!-- View: contacts -->
    <section v-show="activeView === 'contacts'" class="screen">
      <header class="topbar">
        <span class="topbar__title">{{ t('demo.contacts') }}</span>
      </header>
      <div class="screen__body">
        <ContactListH5 @contact-item-click="handleContactSelect" />
      </div>
      <nav class="tabbar">
        <button class="tabbar__item" type="button" @click="activeView = 'conversations'">{{ t('demo.chats') }}</button>
        <button class="tabbar__item tabbar__item--active" type="button">{{ t('demo.contacts') }}</button>
      </nav>
    </section>

    <!-- View: contact detail -->
    <section v-show="activeView === 'contactInfo'" class="screen">
      <div class="screen__body screen__body--surface">
        <ContactInfoH5
          :contact-item="selectedContact"
          @close="activeView = 'contacts'"
          @send-message="handleSendMessage"
          @enter-group="handleEnterGroup"
        />
      </div>
    </section>

    <!-- View: chat (kept alive to avoid re-rendering the message list) -->
    <section v-show="activeView === 'chat'" class="screen">
      <Chat>
        <header class="chat-pane__header">
          <ChatHeaderH5 :enable-user-status="true" :on-back="handleChatBack">
            <template #ChatHeaderRight>
              <div class="chat-pane__actions">
                <button class="icon-btn" type="button" :aria-label="t('demo.search')" @click="openFromChat('search')">
                  <IconSearch :size="20" />
                </button>
                <button class="icon-btn" type="button" :aria-label="t('demo.setting')" @click="openFromChat('setting')">
                  <IconMenu :size="20" />
                </button>
              </div>
            </template>
          </ChatHeaderH5>
        </header>
        <MessageListH5 class="chat-pane__list" />
        <MessageInputH5
          class="chat-pane__input"
          :actions="['EmojiPicker', 'ImagePicker', 'VideoPicker', 'FilePicker', 'AudioCallPicker', 'VideoCallPicker', 'QuickConferencePicker']"
        />
      </Chat>
    </section>

    <!-- View: search -->
    <section v-show="activeView === 'search'" class="screen">
      <div class="screen__body">
        <SearchH5
          :variant="VariantType.EMBEDDED"
          :on-back="() => (activeView = previousView)"
          :on-result-item-click="handleSearchResultClick"
        />
      </div>
    </section>

    <!-- View: chat setting -->
    <section v-show="activeView === 'setting'" class="screen">
      <div class="screen__body screen__body--surface">
        <ChatSettingH5 :on-back="() => (activeView = 'chat')" />
      </div>
    </section>
  </div>
</template>

```

5. Configure internationalization.

   Create src/i18n.ts and write the following to configure the multilingual content mentioned in this guide.

   ``` typescript
   // 本 demo 自身字符串的翻译（聊天组件的翻译由 UIKit 自身
   // 通过 `language` prop 处理）。键名以 `demo.` 作为命名空间，
   // 确保不会与库的 i18next 资源发生冲突。
   //
   // `languageResources` 传递给 <UIKitProvider>；可在任意位置
   // 通过 `const { t } = useUIKit()` 和 `t('demo.chats')` 读取字符串。
   type TranslationTree = { [key: string]: string | TranslationTree };
   interface LanguageResource {
     lng: string;
     translation: TranslationTree;
   }

   const en = {
     demo: {
       appTitle: 'Chat UIKit H5',
       field: { sdkAppId: 'SDKAppID', userId: 'UserID', userSig: 'UserSig' },
       placeholder: {
         sdkAppId: 'Your SDKAppID',
         userId: 'e.g. user_001',
         userSig: 'Test UserSig from IM console',
       },
       error: {
         required: 'Please fill in SDKAppID, UserID and UserSig.',
         loginFailed: 'Login failed, please check your credentials.',
       },
       login: 'Login',
       loggingIn: 'Logging in…',
       chats: 'Chats',
       contacts: 'Contacts',
       logout: 'Logout',
       search: 'Search',
       setting: 'Setting',
     },
   };

   const zh = {
     demo: {
       appTitle: 'Chat UIKit H5',
       field: { sdkAppId: 'SDKAppID', userId: '用户 ID', userSig: '用户签名' },
       placeholder: {
         sdkAppId: '请输入 SDKAppID',
         userId: '例如 user_001',
         userSig: '控制台获取的测试 UserSig',
       },
       error: {
         required: '请填写 SDKAppID、用户 ID 和用户签名。',
         loginFailed: '登录失败，请检查登录凭据。',
       },
       login: '登录',
       loggingIn: '登录中…',
       chats: '会话',
       contacts: '通讯录',
       logout: '退出登录',
       search: '搜索',
       setting: '设置',
     },
   };

   export const languageResources: LanguageResource[] = [
     { lng: 'en-US', translation: en },
     { lng: 'zh-CN', translation: zh },
   ];
   ```

### Step 3: Obtain SDKAppID, userID, and userSig
| Parameter | Type | Description |
| --- | --- | --- |
| SDKAppID | Number | The unique identifier for your Tencent Cloud IM application. You can create a new application in the <a href="https://console.cloud.tencent.com/im">IM Console</a> to obtain the SDKAppID.<br><strong>Note:</strong><br>Each independent app should have its own SDKAppID. Messages between different SDKAppIDs are naturally isolated. |
| userID | String | The unique user identifier you define. Only allows letters (a-z, A-Z), digits (0-9), underscores, and hyphens. |
| userSig | String | The authentication ticket for logging into IM. It is essentially ciphertext generated by encrypting information such as the UserID.<br><strong>Note:</strong><br>- Development: For quick testing, you can obtain UserSig from the <a href="https://console.cloud.tencent.com/im">IM Console</a>.<br>- Production: Integrate the UserSig calculation on your server. See <a href="https://cloud.tencent.com/document/product/269/32688">Server-side UserSig Generation</a>. |

> **Warning:**
> The sample code in this guide uses UserSig obtained from the [IM Console](https://console.cloud.tencent.com/im), which is **only suitable for local testing and debugging**. For production, see [Server-side UserSig Generation](https://cloud.tencent.com/document/product/269/32688).
>

- SDKAppID: In [IM Console > Application Management](https://console.cloud.tencent.com/im), click **Create New Application** to get the SDKAppID.

- userID: Go to [IM Console > Chat > Account Management](https://console.cloud.tencent.com/im/account-management), switch to your target application, and create 2-3 accounts for testing one-to-one and group chat features.

- userSig: Go to [IM Console > Developer Tools > UserSig Generation](https://console.cloud.tencent.com/im/tool-usersig), switch to your target application, enter the userID you created, and generate the userSig.

## Run and Test

Run the project with the following command:

[shell]
``` bash
npm run dev
```

## Integrate Advanced Features

### Audio/Video Calls

> **Note:**
> TUICallKit is a Tencent Cloud audio/video calling UI component. By integrating it, you can experience audio/video calling in your chat app with just a few lines of code.
>
> For more details, see: Audio/Video Calling - Activate Service.
>

1. Install the @trtc/calls-uikit-vue dependency.

   ``` bash
   npm install @trtc/calls-uikit-vue
   ```
2. Import TUICallKit from @trtc/calls-uikit-vue and mount it to the DOM.

   Add the following code to the src/App.vue file:

   ``` typescript
   <script setup lang="ts">
   import { ref, watch } from 'vue';
   import { UIKitProvider, useLoginState } from '@tencentcloud/chat-uikit-vue3';
   import { TUICallKit } from '@trtc/calls-uikit-vue';
   import LoginView from './LoginView.vue';
   import ChatLayout from './ChatLayout.vue';
   import { languageResources } from './i18n';

   enum LoginStatus {
     UNKNOWN = 0,
     LOGINED = 1,
   }

   // Language is owned here and configured via UIKitProvider's `language` prop.
   // This is the recommended way to control the language: children request a change
   // and we update this single source of truth, which drives the whole UIKit.
   const language = ref('zh-CN');

   const { loginStatus } = useLoginState();
   </script>

   <template>
     <UIKitProvider :language="language" :language-resources="languageResources">
       <LoginView v-if="loginStatus !== LoginStatus.LOGINED" />
       <ChatLayout v-else />

       <!-- Audio/video calls. Mount once at the app root; it shares the chat login
            session, so no extra login is needed. The call buttons are already
            built into the chat header. -->
       <div v-if="loginStatus === LoginStatus.LOGINED" class="call-kit">
         <TUICallKit />
       </div>
     </UIKitProvider>
   </template>

   ```
3. 如果不需要集成音视频通话，可以修改 MessageInputH5 组件 actions 属性，来隐藏语音通话和视频通话的入口。

   ``` typescript
   <MessageInputH5 class="chat-pane__input" :actions="['EmojiPicker', 'ImagePicker', 'VideoPicker', 'FilePicker']" />
   ```

### Video Conferencing

TUIRoomKit is a low-code UI component for multi-party audio/video scenarios such as enterprise meetings, webinars, and online education. It provides room management, member management, screen sharing, and other meeting controls, supporting SD, HD, and Ultra HD video quality.

The integration above includes video conferencing by default. To disable it, use the `actions` prop on the `<MessageInput />` component to control the input toolbar and remove the video conferencing tool (QuickConferencePicker).
``` java

<MessageInputH5
  class="chat-pane__input"
  :actions="['EmojiPicker', 'ImagePicker', 'VideoPicker', 'FilePicker', 'AudioCallPicker', 'VideoCallPicker']"
/>
```

### Cloud Search

> **Note:**
> Search is an essential feature for customer service, social, online education, telemedicine, OA, and other scenarios. It helps users quickly find groups, users, and messages, improving product experience and user engagement.
>
> Due to the limitations of Web platform local storage, **local search is not available**. To better meet search needs, **cloud search** is provided. **Cloud search supports global search and in-conversation search, including searching for groups, users, and messages.**
>
> This is a value-added service. You need to purchase the cloud search plugin. Click [Purchase](https://console.cloud.tencent.com/im/plugin/TUICloudSearch).
>

Cloud search is integrated by default in Step 2. To disable cloud search:
1. Set the `enableSearch` prop of `ConversationList` to `false`:

   ``` typescript
   <ConversationListH5 :enable-search="false" />
   ```
2. Comment out the in-conversation search related code:

   ``` typescript
   <ChatHeaderH5 :enable-user-status="true" :on-back="handleChatBack">
       <template #ChatHeaderRight>
           <div class="chat-pane__actions">
           <!-- <button class="icon-btn" type="button" :aria-label="t('demo.search')" @click="openFromChat('search')">
               <IconSearch :size="20" />
           </button> -->
           <button class="icon-btn" type="button" :aria-label="t('demo.setting')" @click="openFromChat('setting')">
               <IconMenu :size="20" />
           </button>
           </div>
       </template>
   </ChatHeaderH5>
   ```

## FAQ

### What is UserSig? How to generate UserSig?

UserSig is the authentication ticket for logging into IM. It is essentially ciphertext generated by encrypting information such as the UserID. The recommended approach is to integrate UserSig calculation on your server and provide a project-facing API. When UserSig is needed, your project requests a dynamic UserSig from the business server. For more details, see [Server-side UserSig Generation](https://cloud.tencent.com/document/product/269/32688).

> **Warning:**
> The sample code in this guide uses UserSig obtained from the [IM Console](https://console.cloud.tencent.com/im), which is **only suitable for local testing and debugging**. For production, see [Server-side UserSig Generation](https://cloud.tencent.com/document/product/269/32688).
>

### Can I use third-party component libraries like Element-Plus?

You can use other component libraries for the glue code between core components, as shown in the example code — for instance, you can wrap `<ChatSettingH5 />` in a full-screen drawer component. However, components already built into the core components cannot be modified at this time.
``` typescript
const isChatSettingShow = ref(false);

<el-drawer
  v-model="isChatSettingShow"
  title="设置"
>
    <ChatSettingH5 />
</el-drawer>
```

### Emoji Packs

To respect copyrights, the **default yellow-face emoji pack shown below is copyrighted by Tencent Cloud**. You can use it for free by upgrading to the [IM Enterprise plan](https://buy.cloud.tencent.com/avc).

### NPM Package

[chat-uikit-vue3 npm](https://www.npmjs.com/package/@tencentcloud/chat-uikit-vue3)

