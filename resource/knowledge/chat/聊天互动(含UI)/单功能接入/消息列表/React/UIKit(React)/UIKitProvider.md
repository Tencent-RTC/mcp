---
sync_node_id: '155521270710771712'
nav_path:
  - "聊天互动（含 UI）"
  - "单功能接入"
  - "消息列表"
  - "React"
  - "UIKit（React）"
  - "UIKitProvider"
product: "chat"
---
## Introduction

`UIKitProvider` is a React Context Provider for global state management such as theme and internationalization for the entire application. It is the core of the UIKit component system, providing uniform Context to child components for consistent style themes, multilingual support, and component configuration.

The Provider has the following features:
- **Topic management** - Supports light and shade theme switching and theme customization

- **Internationalization support** - Built-in multilingual support with extensible custom language packs

## UIKitProvider Component

### Props Parameters

|Parameter|Type|Default Value|Description|
|---------|---------|---------|---------|
|language|string|'auto'|Language Setting|
|languageResources|LanguageResource[]|[]|Custom Language Resource|
|theme|'light' \| 'dark'|'light'|Theme Settings|

### Type Definition
``` typescript
interface UIKitProviderProps {
  language?: string;
  languageResources?: ILanguageResource[];
  theme?: 'light' | 'dark';
}
```

### Language Resource Type Definition
``` typescript
interface LanguageResource {
  lng: string;
  translation: Record<string, any>;
}
```

## useUIKit Hook

### Return Value

|Field|Type|Description|
|---------|---------|---------|
|language|string|current language|
|setLanguage|(lng: string) => void|Set Language Method|
|t|i18n['t']|Internationalization translation function|
|i18n|i18n|i18next instance|
|theme|'light' \| 'dark'|current theme|
|setTheme|React.Dispatch<React.SetStateAction<ThemeType>>|Set Theme Method|

## Usage Examples

### Basic Usage

Simplest way to use, provide a basis for topics and languages support:
``` tsx
import React from 'react';
import { UIKitProvider, useUIKit } from '@tencentcloud/chat-uikit-react';

function App() {
  return (
    <UIKitProvider theme="light" language="zh-CN">
      <ChatApp />
    </UIKitProvider>
  );
}

function ChatApp() {
  const { theme, language } = useUIKit();
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <p>Current language: {language}</p>
    </div>
  );
}

export default App;
```

### Theme Switching

Show how to achieve theme switching functionality
``` tsx
import React from 'react';
import { UIKitProvider, useUIKit } from '@tencentcloud/uikit-base-component-react';

function App() {
  return (
    <UIKitProvider theme="light">
      <ThemeDemo />
    </UIKitProvider>
  );
}

function ThemeDemo() {
  const { theme, setTheme } = useUIKit();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div>
      <h2>Theme Switching Example</h2>
      <p>Current theme: {typeof theme === 'string' ? theme : `${theme.mode} (${theme.primaryColor})`}</p>
      <button onClick={toggleTheme}>
        Switch to {theme === 'light' ? 'dark' : 'light'} theme
      </button>
    </div>
  );
}

export default App;
```

### Multilingual Support

Show how to use the multilingual feature:
``` tsx
import React from 'react';
import { UIKitProvider, useUIKit } from '@tencentcloud/uikit-base-component-react';

// Custom Language Resource
const customLanguageResources = [
  {
    lng: 'de',
    translation: {
      'Hello': 'Hallo',
      'Welcome': 'Willkommen',
      'Settings': 'Einstellungen',
    }
  },
  {
    lng: 'fr',
    translation: {
      'Hello': 'Bonjour',
      'Welcome': 'Bienvenue',
      'Settings': 'Paramètres',
    }
  }
];

function App() {
  return (
    <UIKitProvider 
      language="zh-CN" 
      languageResources={customLanguageResources}
    >
      <LanguageDemo />
    </UIKitProvider>
  );
}

function LanguageDemo() {
  const { language, setLanguage, t } = useUIKit();

  const languages = [
    { code: 'zh-CN', name: 'Chinese' },
    { code: 'en-US', name: 'English' },
    { code: 'de', name: 'Deutsch' },
    { code: 'fr', name: 'Français' },
  ];

  return (
    <div>
      <h2>{t('Settings')}</h2>
      <p>{t('Welcome')}</p>
      <p>Current language: {language}</p>
      <div>
        {languages.map(lang => (
          <button 
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            style={{ 
              margin: '0 8px',
              fontWeight: language === lang.code ? 'bold' : 'normal'
            }}
          >
            {lang.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
```

## Best Practices

### Provider Level
``` tsx
// Recommend: Use UIKitProvider at the root part
function App() {
  return (
    <UIKitProvider theme="light" language="zh-CN">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </Router>
    </UIKitProvider>
  );
}
```

### 2. Topic Persistence
``` tsx
function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <UIKitProvider theme={theme}>
      <AppContent />
    </UIKitProvider>
  );
}
```

### Language Detection
``` tsx
function App() {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    if (saved) return saved;
    
    // Automatically detect browser language
    const browserLang = navigator.language;
    if (browserLang.startsWith('zh')) return 'zh-CN';
    if (browserLang.startsWith('en')) return 'en-US';
    return 'auto';
  });

  return (
    <UIKitProvider language={language} languageResources={customResources}>
      <App />
    </UIKitProvider>
  );
}
```

## Precautions
1. **Provider location**: UIKitProvider must be in the upper layer of components using useUIKit.

2. **Theme Switching**: Theme switching triggers CSS variable updates and may affect performance.

3. **Language Resource**: Custom language resources will merge with built-in resources. Identical keys will override built-in resources.

4. **Configuration update**: Configuration updates are responsive and have an immediate impact on ALL related components.

5. **Type-safe**: When using TypeScript, ensure the input configuration complies with the type definition.
