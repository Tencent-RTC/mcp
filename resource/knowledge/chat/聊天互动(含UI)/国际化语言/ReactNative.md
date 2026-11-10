---
sync_node_id: '163771593148305408'
nav_path:
  - "聊天互动（含 UI）"
  - "国际化语言"
  - "React Native"
product: "chat"
---
## Feature Description

React Native UIKit comes with default language packs for **English** and **Simplified Chinese** as interface display languages.

Following this documentation, you can use the default language packs or customize the internationalization capabilities according to your needs, including adding new languages and updating translation content.

## Using the Default Language

### Initializing the Language

When initializing the app, you need to register and initialize the language resources for the translation engine in the `App.tsx` file.
``` javascript
import { TUITranslateService } from '@tencentcloud/chat-uikit-engine';
import uikitResources from '@tencentcloud/chat-uikit-react-native/i18n';

 // Init localization
 TUITranslateService.provideLanguages(uikitResources);
 TUITranslateService.useI18n('en-US');
```

### Switch Language

If your app has a language switch entry, you can call `TUITranslateService.changeLanguage` to implement the language switch feature.
``` javascript
import { TUITranslateService } from '@tencentcloud/chat-uikit-engine';

// language is the target language you switch to
TUITranslateService.changeLanguage(language)
```

## Adding App Language Resources

If your app needs to translate other pages (e.g., Login page, Setting page) besides UIKit, you can create an i18n resource directory in the root directory of the app to add corresponding entries. Use `TUITranslateService` for translation. You can initialize it with the following sample code, assuming there is an `i18n` directory in the root directory of your project.
``` javascript
import { TUITranslateService } from '@tencentcloud/chat-uikit-engine';
import uikitResources from '@tencentcloud/chat-uikit-react-native/i18n';
import appResources from './i18n';
 
// Init localization
TUITranslateService.provideLanguages({
    'en-US': {
      ...appResources['en-US'],
      ...uikitResources['en-US'],
    },
    'zh-CN': {
      ...appResources['zh-CN'],
      ...uikitResources['zh-CN'],
    },
});
 
TUITranslateService.useI18n('en-US');
```

## Updating Translation Terms

If the default translation terms do not meet your needs, you can update the translation terms by following these steps.

Copy `node_modules/@tencentcloud/chat-uikit-react-native/` `i18n` to the root directory of your project and rename it to `i18n-uikit`. Modify the translation content as needed. After modification, change `uikitResources` to import from your local `import`.
``` javascript
import uikitResources from './i18n-uikit';
```

## Adding a Language Type

If you need to add a new language, copy `node_modules/@tencentcloud/chat-uikit-react-native/i18n` `en-US` to the `i18n` directory in the root directory of your project, rename it to the new language name (e.g., 'zh-TW'), and modify the translation content as needed.

## Using the Translation API

If your app needs to use the translation capabilities provided by the translation engine, you can use it as follows.

For example, if you add a translation term for a Login module and need to internationalize [username], the terms for Login module are defined as follows:

`en-US` ：
``` javascript
export const Login = {
  USER_NAME: 'UserName',
};
```

`zh-CN` ：

Use the translation function on the Login page:
``` javascript
import { TUITranslateService } from '@tencentcloud/chat-uikit-engine';
TUITransalteService.t('Login.USER_NAME')
```

For how to implement language switching, you can refer to [UIKit Demo Source Code](https://github.com/TencentCloud/chat-demo-react-native).
