TUIKit is a React component library built on top of the Tencent Cloud Chat SDK. It provides common UI components covering conversations, chat, groups, and more. This guide walks you through quickly integrating TUIKit and implementing core features.

>

>

## Key Concepts

chat-uikit-react consists of core UI components including ConversationListH5, MessageListH5, ChatHeaderH5, MessageInputH5, ChatSettingH5, SearchH5, and ContactH5. Each component is responsible for rendering different content.
1. ConversationListH5 provides the conversation list component.

2. Chat provides the conversation container component.

3. MessageListH5 provides the message list component for conversations.

4. ChatHeaderH5 provides the conversation header component.

5. MessageInputH5 provides the message input component.

6. ChatSettingH5 provides the management component for one-to-one and group chats.

7. SearchH5 provides the cloud search component.

8. ContactH5 provides the contacts component.

## Prerequisites
- Node.js v18 or later, LTS version recommended

- React^18.2 || React^19.0.0

- TypeScript@^5.0.0

## Quick Start with the Complete Example Project

If you want to quickly see the full result, or need a code reference during integration, you can clone our ready-made example project. The example project has completed Chat UIKit dependency installation, component imports, initialization configuration, and basic page integration — ideal as an integration reference.
``` bash
git clone https://gitee.com/tencent-cloud-uikit/rtc-chat-web.git
cd chat-mobile-react
npm install
npm run dev
```

> **Note:**
> Example project: [View on Gitee](https://gitee.com/tencent-cloud-uikit/rtc-chat-web)。
>
> The example project helps you quickly experience the integration flow. If you need to integrate into an existing project, continue reading the steps below.
>

## Create a Project

Use Vite to create a new React project named chat-integration-react-h5 and follow the scaffold prompts to initialize it. After the initial project starts, remove the scaffold's sample files (default styles in src/App.css, src/index.css, src/assets, icons in public, etc.), keeping only src/main.tsx and index.html.

> **Warning:**
> 1. It is recommended to use npm for installation, as npm will automatically download required peerDependencies.
> 2. `npm create vite@latest` uses the latest Vite version, which may conflict with older Node.js versions. Please check your environment configuration.

[shell]
``` bash
npm create vite@latest

◇  Project name:
│  chat-integration-react-h5
│
◇  Select a framework:
│  React
│
◇  Select a variant:
│  TypeScript + React Compiler
│
◇  Use ESLint instead of Oxlint?
│  Yes (ESLint)
│
◇  Install with npm and start now?
│  Yes
```

## Download and Import Components

### Step 1: Install Dependencies

Download [chat-uikit-react](https://www.npmjs.com/package/@tencentcloud/chat-uikit-react) via npm and use it in your project.

[shell]
``` bash
npm install @tencentcloud/chat-uikit-react @tencentcloud/uikit-base-component-react
```

### Step 2: Import Components
1. Configure the mobile viewport.

   The first step for a great mobile experience: in the project root, set the default viewport in index.html to full-screen coverage with locked scaling, making the page feel more like a native app.

   ``` java
   <!DOCTYPE html>
   <html lang="zh-CN">
     <head>
       <meta charset="UTF-8" />
       <!-- H5 viewport: 覆盖刘海屏区域，锁定缩放，营造类原生应用的体验 -->
       <meta
         name="viewport"
         content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
       />
       <title>Chat UIKit H5 Quickstart (React)</title>
     </head>
     <body>
       <div id="root"></div>
       <script type="module" src="/src/main.tsx"></script>
     </body>
   </html>
   ```
2. Configure global base styles.

   Create **src/styles.css** and set the global base styles.

   ``` css
   /* ------- 移动端基础布局 ------- */
   * {
     box-sizing: border-box;
   }

   html,
   body,
   #root {
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
3. Configure the app entry point.

   Write the following into **src/main.tsx** to import styles at the app entry.

   ``` typescript
   import { createRoot } from 'react-dom/client';
   import App from './App';
   import './styles.css';

   createRoot(document.getElementById('root')!).render(
     <App />,
   );
   ```
4. Configure the home page.

   Write the following into **src/App.tsx** to route between the login page and chat page.

   ``` typescript
   import { useState } from 'react';
   import { LoginStatus, UIKitProvider, useLoginState } from '@tencentcloud/chat-uikit-react';
   import { LoginView } from './LoginView';
   import { ChatLayout } from './ChatLayout';
   import { languageResources } from './i18n';

   function App() {
     const { status } = useLoginState();
     const isLogined = status === LoginStatus.SUCCESS;

     // 语言在此处进行维护，并通过 UIKitProvider 的 `language` 属性进行配置。
     // 这是控制语言的推荐方式
     // 更新这个单一数据源，它驱动整个 UIKit。
     const [language, setLanguage] = useState('zh-CN');

     return (
       <UIKitProvider language={language} languageResources={languageResources}>
         {isLogined
           ? <ChatLayout onChangeLanguage={setLanguage} />
           : <LoginView language={language} onChangeLanguage={setLanguage} />}
       </UIKitProvider>
     );
   }

   export default App;
   ```
5. Configure the login page and chat main page.

   Create **src/LoginView.tsx** and **src/LoginView.css** and write the following code to build the login page.

[src/LoginView.tsx]
``` typescript
import { useState, type SubmitEvent } from 'react';
import { useLoginState, useUIKit } from '@tencentcloud/chat-uikit-react';
import './LoginView.css';

// 语言切换器中显示的语言。标签使用本来的语言，确保用户
// 不受当前 UI 语言影响，始终能识别自己的选项。
const LANGUAGES = [
  { value: 'zh-CN', label: '中文' },
  { value: 'en-US', label: 'English' },
];

interface LoginViewProps {
  language: string;
  onChangeLanguage: (language: string) => void;
}

export function LoginView({ language, onChangeLanguage }: LoginViewProps) {
  const { login } = useLoginState();
  const { t } = useUIKit();
  const [sdkAppId, setSdkAppId] = useState<number>();
  const [userId, setUserId] = useState('');
  const [userSig, setUserSig] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setError('');
    if (!sdkAppId || !userId || !userSig) {
      setError(t('demo.error.required'));
      return;
    }

    setLoading(true);
    try {
      await login({ SDKAppID: Number(sdkAppId), userID: userId, userSig });
      // On success the login gate in App.tsx switches to ChatLayout automatically.
    } catch (err) {
      setError(err instanceof Error ? err.message : t('demo.error.loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login__lang" role="group" aria-label="Language">
        {LANGUAGES.map(item => (
          <button
            key={item.value}
            type="button"
            className={item.value === language ? 'login__lang-btn login__lang-btn--active' : 'login__lang-btn'}
            onClick={() => onChangeLanguage(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <form className="login__card" onSubmit={handleSubmit}>
        <h1 className="login__title">{t('demo.appTitle')}</h1>

        <label className="login__field">
          <span>{t('demo.field.sdkAppId')}</span>
          <input
            type="number"
            placeholder={t('demo.placeholder.sdkAppId')}
            value={sdkAppId || ''}
            onChange={e => setSdkAppId(Number(e.target.value))}
          />
        </label>

        <label className="login__field">
          <span>{t('demo.field.userId')}</span>
          <input
            type="text"
            placeholder={t('demo.placeholder.userId')}
            value={userId}
            onChange={e => setUserId(e.target.value)}
          />
        </label>

        <label className="login__field">
          <span>{t('demo.field.userSig')}</span>
          <input
            type="text"
            placeholder={t('demo.placeholder.userSig')}
            value={userSig}
            onChange={e => setUserSig(e.target.value)}
          />
        </label>

        {error && <p className="login__error">{error}</p>}

        <button className="login__submit" type="submit" disabled={loading}>
          {loading ? t('demo.loggingIn') : t('demo.login')}
        </button>
      </form>
    </div>
  );
}
```

[src/LoginView.css]
``` css
.login {
  position: relative;
  display: flex;
  width: 100%;
  height: 100dvh;
  align-items: center;
  justify-content: center;
  padding: max(20px, env(safe-area-inset-top)) 20px max(20px, env(safe-area-inset-bottom));
  /* Soft natural-white backdrop with a subtle top-down gradient for depth. */
  background: linear-gradient(180deg, #ffffff 0%, #f3f5f8 100%);
}

/* Segmented language switcher, pinned to the top-right. */
.login__lang {
  position: absolute;
  top: calc(16px + env(safe-area-inset-top));
  right: 16px;
  display: inline-flex;
  padding: 3px;
  border-radius: 999px;
  background: #eef0f3;
}

.login__lang-btn {
  min-width: 56px;
  padding: 6px 12px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: #6b7280;
  font-size: 13px;
  font-weight: 500;
  transition: background 0.2s, color 0.2s;
}

.login__lang-btn--active {
  background: #fff;
  color: #1f2329;
  box-shadow: 0 1px 2px rgb(16 24 40 / 10%);
}

.login__card {
  display: flex;
  width: 100%;
  max-width: 360px;
  flex-direction: column;
  gap: 16px;
  padding: 28px 24px;
  border-radius: 16px;
  background: #fff;
  /* Layered, low-opacity shadow for a soft, natural lift off the white bg. */
  border: 1px solid rgb(16 24 40 / 4%);
  box-shadow:
    0 1px 2px rgb(16 24 40 / 4%),
    0 12px 32px rgb(16 24 40 / 8%);
}

.login__title {
  margin: 0 0 4px;
  font-size: 20px;
  font-weight: 600;
  text-align: center;
}

.login__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: #6b7280;
}

.login__field input {
  padding: 12px 14px;
  border: 1px solid #e8eaed;
  border-radius: 10px;
  outline: none;
  appearance: none;
}

.login__field input:focus {
  border-color: #1464ff;
}

.login__error {
  margin: 0;
  color: #e34d59;
  font-size: 13px;
}

.login__submit {
  padding: 13px;
  border: 0;
  border-radius: 10px;
  background: #1464ff;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
}

.login__submit:disabled {
  opacity: 0.6;
}
```

   Create **src/ChatLayout.tsx** and **src/ChatLayout.css** and write the following code:

[src/ChatLayout.tsx]
``` typescript
import { useEffect, useRef, useState, type ReactNode } from 'react';
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
} from '@tencentcloud/chat-uikit-react';
import { IconBulletpoint, IconSearch } from '@tencentcloud/uikit-base-component-react';
import './ChatLayout.css';

type MobileView = 'conversations' | 'chat' | 'contacts' | 'contactInfo' | 'search' | 'setting';

interface ChatLayoutProps {
  onChangeLanguage: (language: string) => void;
}

/** // 全屏视图；仅当前激活的视图可见（保持挂载以保留状态）。 */
function Screen({ active, children }: { active: boolean; children: ReactNode }) {
  return (
    <section className="screen" style={{ zIndex: active ? 1 : 0, visibility: active ? 'visible' : 'hidden' }}>
      {children}
    </section>
  );
}

export function ChatLayout({ onChangeLanguage }: ChatLayoutProps) {

  const { activeConversationID, activeConversation, sendMessage, setActiveConversation } = useChatContext();
  const { loginUserInfo, logout } = useLoginState();
  const { t, language } = useUIKit();
  const [activeView, setActiveView] = useState<MobileView>('conversations');
  // 记住搜索是从哪里打开的，使其返回按钮能回到原处。
  const [previousView, setPreviousView] = useState<MobileView>('chat');
  const defaultOpenConversationID = 'C2Cadministrator';

  const activeViewRef = useRef(activeView);
  const prevConversationIDRef = useRef(activeConversationID);
  // 仅发送一次欢迎语
  const sendWelcomeMessageOnce = useRef(false);

  useEffect(() => {
    activeViewRef.current = activeView;
  }, [activeView]);

  useEffect(() => {
    const changed = prevConversationIDRef.current !== activeConversationID;
    prevConversationIDRef.current = activeConversationID;
    if (changed && activeConversationID && activeViewRef.current === 'conversations') {
      setActiveView('chat');
    }
  }, [activeConversationID]);

  // 应用创建（组件挂载）时仅发送一次欢迎语；切换会话不会重复发送。
  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeConversation?.conversationID === defaultOpenConversationID && !sendWelcomeMessageOnce.current) {
        sendMessage({
          type: 'textMessage',
          text: `欢迎体验 Chat React 移动端WEB应用 Demo～

您可以按照以下顺序体验 IM 的核心功能：
1. 在输入框内发送一条文本消息。
2. 输入框上的工具栏支持，语音通话、视频通话、图片、视频、文件发送等扩展功能。
3. 如果您想添加好友，可以前往联系人页面点击"添加好友/群聊"。
`,
        });
        sendWelcomeMessageOnce.current = true;
      }
    }, 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConversation?.conversationID]);

  const openFromChat = (view: 'search' | 'setting') => {
    setPreviousView(activeView);
    setActiveView(view);
  };

  const handleChatBack = () => {
    setActiveConversation(undefined);
    setActiveView('conversations');
  };

  return (
    <div className="app-shell">
      <Screen active={activeView === 'conversations'}>
        <header className="topbar">
          <span className="topbar__title">
            {t('demo.chats')}{loginUserInfo?.userId ? ` · ${loginUserInfo.userId}` : ''}
          </span>
          <div className="chat-pane__actions">
            <button
              className="topbar__text-btn"
              type="button"
              onClick={() => onChangeLanguage(language === 'zh-CN' ? 'en-US' : 'zh-CN')}
            >
              {language === 'zh-CN' ? 'EN' : '中'}
            </button>
            <button className="topbar__text-btn" type="button" onClick={logout}>{t('demo.logout')}</button>
          </div>
        </header>
        <div className="screen__body">
          <ConversationListH5
            style={{ height: '100%' }}
            onSelectConversation={() => setActiveView('chat')}
          />
        </div>
        <nav className="tabbar">
          <button className="tabbar__item tabbar__item--active" type="button">{t('demo.chats')}</button>
          <button className="tabbar__item" type="button" onClick={() => setActiveView('contacts')}>{t('demo.contacts')}</button>
        </nav>
      </Screen>

      <Screen active={activeView === 'contacts'}>
        <header className="topbar">
          <span className="topbar__title">{t('demo.contacts')}</span>
        </header>
        <div className="screen__body">
          <ContactListH5 onContactItemClick={() => setActiveView('contactInfo')} />
        </div>
        <nav className="tabbar">
          <button className="tabbar__item" type="button" onClick={() => setActiveView('conversations')}>{t('demo.chats')}</button>
          <button className="tabbar__item tabbar__item--active" type="button">{t('demo.contacts')}</button>
        </nav>
      </Screen>

      <Screen active={activeView === 'contactInfo'}>
        <div className="screen__body screen__body--surface">
          <ContactInfoH5
            onClose={() => setActiveView('contacts')}
            onSendMessage={() => setActiveView('chat')}
            onEnterGroup={() => setActiveView('chat')}
          />
        </div>
      </Screen>

      <Screen active={activeView === 'chat'}>
        <Chat className="chat-pane">
          <ChatHeaderH5
            className="chat-pane__header"
            enableUserStatus
            onBack={handleChatBack}
            ChatHeaderRight={(
              <div className="chat-pane__actions">
                <button className="icon-btn" type="button" aria-label={t('demo.search')} onClick={() => openFromChat('search')}>
                  <IconSearch size="20px" />
                </button>
                <button className="icon-btn" type="button" aria-label={t('demo.setting')} onClick={() => openFromChat('setting')}>
                  <IconBulletpoint size="20px" />
                </button>
              </div>
            )}
          />
          <MessageListH5 />
          <MessageInputH5 />
        </Chat>
      </Screen>

      <Screen active={activeView === 'search'}>
        <div className="screen__body">
          <SearchH5
            variant={VariantType.EMBEDDED}
            onBack={() => setActiveView(previousView)}
            onResultItemClick={(_item, type) => {
              if (type === 'chat_message') {
                setActiveView('chat');
              }
            }}
          />
        </div>
      </Screen>

      <Screen active={activeView === 'setting'}>
        <div className="screen__body screen__body--surface">
          <ChatSettingH5 onBack={() => setActiveView('chat')} />
        </div>
      </Screen>
    </div>
  );
}
```

[src/ChatLayout.css]
``` css
/* ------- Shell + stacked screens ------- */
.app-shell {
  position: relative;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  background: #fff;
}

/* Each full-screen view is stacked; only the active one is visible. */
.screen {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.screen__body {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.screen__body--surface {
  overflow: auto;
  background: #f5f6f8;
}

/* ------- Top bar ------- */
.topbar {
  display: flex;
  flex: 0 0 auto;
  min-height: 52px;
  align-items: center;
  justify-content: space-between;
  padding: calc(8px + env(safe-area-inset-top)) 16px 8px;
  border-bottom: 1px solid #e8eaed;
}

.topbar__title {
  overflow: hidden;
  font-size: 17px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.topbar__text-btn {
  border: 0;
  background: transparent;
  color: #1464ff;
  font-size: 14px;
  font-weight: 500;
}

/* ------- Tab bar ------- */
.tabbar {
  display: flex;
  flex: 0 0 auto;
  gap: 8px;
  padding: 6px 12px calc(6px + env(safe-area-inset-bottom));
  border-top: 1px solid #e8eaed;
}

.tabbar__item {
  flex: 1;
  min-height: 40px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: #6b7280;
  font-size: 14px;
  font-weight: 600;
}

.tabbar__item--active {
  background: #eef4ff;
  color: #1464ff;
}

/* ------- Chat pane ------- *
 * The library's <Chat> root is already `display:flex; flex-direction:column;
 * height:100%`, so it fills the screen on its own. The demo only arranges the
 * three slotted children: header (fixed) / message list (grow + scroll) /
 * input (fixed). `min-height:0` on the list breaks the flexbox min-height
 * chain so it scrolls instead of stretching the pane.
 */
.chat-pane__header {
  flex: 0 0 auto;
  padding-top: env(safe-area-inset-top);
  border-bottom: 1px solid #e8eaed;
}

.chat-pane > :nth-child(2) {
  flex: 1;
  min-height: 0;
}

.chat-pane > :last-child {
  flex: 0 0 auto;
  padding-bottom: env(safe-area-inset-bottom);
  border-top: 1px solid #e8eaed;
}

.chat-pane__actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.icon-btn {
  display: inline-flex;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: #1f2329;
}

.icon-btn:active {
  background: #eef0f3;
}
```

6. Configure internationalization.

   Create **src/i18n.ts** and write the following:

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

- userID: Go to [IM Console > Chat > Account Management](https://console.cloud.tencent.com/im/account-management), switch to your target application, and create 2-3 accounts for testing.

- userSig: Go to [IM Console > Developer Tools > UserSig Generation](https://console.cloud.tencent.com/im/tool-usersig), switch to your target application, enter the userID, and generate the userSig.

## Run and Test

Fill in the login credentials and run the project to start experiencing it.

[shell]
``` bash
npm run dev
```

> **Warning:**
> - userID and userSig have a one-to-one correspondence. See UserSig Generation for details.
> - If the project fails to start, check whether the development environment requirements are met.

## Integrate Advanced Features

### Audio/Video Calls

> **Note:**
> TUICallKit is a Tencent Cloud audio/video calling UI component. By integrating it, you can experience audio/video calling in your chat app with just a few lines of code.
>
> For more details, see: Audio/Video Calling - Activate Service.
>

1. Install the `@trtc/calls-uikit-react` dependency.

   ``` bash
   npm install @trtc/calls-uikit-react
   ```
2. Import TUICallKit from `@trtc/calls-uikit-react` and mount it to the DOM.

   Add the following code to the `src/App.tsx` file:

   ``` typescript
   import { useState } from 'react';
   import { LoginStatus, UIKitProvider, useLoginState } from '@tencentcloud/chat-uikit-react';
   import { TUICallKit } from '@trtc/calls-uikit-react';
   import { LoginView } from './LoginView';
   import { ChatLayout } from './ChatLayout';
   import { languageResources } from './i18n';

   function App() {
     const { status } = useLoginState();
     const isLogined = status === LoginStatus.SUCCESS;
     // `language` drives both the UIKit's own strings and our demo strings.
     const [language, setLanguage] = useState('en-US');

     return (
       <UIKitProvider theme="light" language={language} languageResources={languageResources}>
         {isLogined
           ? (
             <>
               <ChatLayout onChangeLanguage={setLanguage} />
               {/* Audio/video calls. Mount once at the app root; it shares the chat
                   login session, so no extra login is needed. The call buttons are
                   already built into the chat header. */}
               <div className="call-kit">
                 <TUICallKit />
               </div>
             </>
           )
           : <LoginView language={language} onChangeLanguage={setLanguage} />}
       </UIKitProvider>
     );
   }

   export default App;
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
1. Comment out the `ChatHeaderRight` prop in `ChatHeader` and the in-conversation search sidebar related code.

   ``` typescript
   <ChatHeaderH5
     className="chat-pane__header"
     enableUserStatus
     onBack={handleChatBack}
     ChatHeaderRight={(
       <div className="chat-pane__actions">
         {/* <button className="icon-btn" type="button" aria-label={t('demo.search')} onClick={() => openFromChat('search')}>
           <IconSearch size="20px" />
         </button> */}
         <button className="icon-btn" type="button" aria-label={t('demo.setting')} onClick={() => openFromChat('setting')}>
           <IconBulletpoint size="20px" />
         </button>
       </div>
     )}
   />
   ```
2. Disable cloud search on the `ConversationList` component.

   ``` java
   <ConversationListH5 enableSearch={false} enableCreate={false} />
   ```

## FAQ

### What is UserSig? How to generate UserSig?

UserSig is the authentication ticket for logging into IM. It is essentially ciphertext generated by encrypting information such as the UserID. The recommended approach is to integrate UserSig calculation on your server and provide a project-facing API. For more details, see [Server-side UserSig Generation](https://cloud.tencent.com/document/product/269/32688).

> **Warning:**
> The sample code in this guide uses UserSig obtained from the [IM Console](https://console.cloud.tencent.com/im), which is **only suitable for local testing and debugging**. For production, see [Server-side UserSig Generation](https://cloud.tencent.com/document/product/269/32688).
>

### Is React 17 supported?

React v17.x is not supported. Only React v18.2+ and above are supported.

### Can I use third-party component libraries like Ant-Design?

You can use other component libraries for the glue code between core components, as shown in the example code — for instance, you can wrap `<ChatSettingH5 />` in a full-screen drawer component. However, components already built into the core components cannot be modified at this time.
``` typescript
import { Drawer } from 'antd';

const [isChatSettingShow, setIsChatSettingShow] = useState(false);

function onChatSettingClose() {
  setIsChatSettingShow(false);
}

<Drawer
  title="设置"
  open={isChatSettingShow}
  onClose={onChatSettingClose}
>
  <ChatSettingH5 />
</Drawer>
```

### Emoji Packs

To respect copyrights, the IM Demo/TUIKit project does not include large emoji sticker assets by default. Before going live, please replace them with your own designed or licensed emoji packs. The **default yellow-face emoji pack shown below is copyrighted by Tencent Cloud**. You can use it for free by upgrading to the [IM Enterprise plan](https://buy.cloud.tencent.com/avc).

