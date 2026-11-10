---
sync_node_id: '161577914936655872'
nav_path:
  - "无 UI 集成"
  - "消息相关"
  - "消息翻译"
  - "React Native"
product: "chat"
---
## Feature Overview

The message translation feature currently supports the translation of text messages only, which can be triggered by manual API calls. Non-text messages such as image, video, file, audio, and custom messages cannot be translated.

> **Note:**
> The message translation feature is only available to customers of **Pro,** **Pro Plus and Enterprise**. To access this feature, you must [purchase either the Pro edition, Pro edition Plus, or Enterprise edition](https://console.trtc.io/subscription/buy/chat), and enable Text Message Translation by navigating to [Chat Console > Advanced Features > Text Message Translation](https://console.trtc.io/chat/plugin/TUITranslation); the Free Trial version supports a certain limit of free trial, valid for one month.
> 

## UI Display

## 

## Translating Text Messages

##### API
``` plaintext
chat.translateText(options);
```

##### Parameters

The `options` parameter is of the `Object` type. It contains the following attribute values:
| Name | Type | Description |
| --- | --- | --- |
| sourceTextList | Array<String> | List of texts to be translated. |
| sourceLanguage | String | Source Language. 'auto' indicates the SDK automatically identifies the source language. |
| targetLanguage | String | Target Language. For example:<br>- English - 'en'<br>- Simplified Chinese - 'zh'<br>- French - 'fr'<br>- German - 'de' |

##### Return value

`Promise`

##### Examples
``` javascript
// Translate Arabic to Chinese
let promise = chat.translateText({
  sourceTextList: ['مرحبًا'],
  sourceLanguage: 'auto',
  targetLanguage: 'en'
});
promise.then(function(imResponse) {
  const { translatedTextList } = imResponse.data;
}).catch(function(imError) {
  // error code 2117 indicates translation failed
  console.warn('translateText error:', imError);
});
```

``` javascript
// Translate English to Chinese
let promise = chat.translateText({
  sourceTextList: ['Hello Tencent', 'Build in-app chat with Tencent Cloud Chat'],
  sourceLanguage: 'auto',
  targetLanguage: 'zh'
});
promise.then(function(imResponse) {
  const { translatedTextList } = imResponse.data;
}).catch(function(imError) {
  // error code 2117 indicates translation failed
  console.warn('translateText error:', imError);
});
```

## Supported Text Translation Languages

|Source Language|Supported Target Language|
|---------|---------|
|zh (Simplified Chinese)|en (English), ja (Japanese), ko (Korean), fr (French), es (Spanish), it (Italian), de (German), tr (Turkish), ru (Russian), pt (Portuguese), vi (Vietnamese), id (Bahasa Indonesian), th (Thai), and ms (Malay)|
|zh-TW (Traditional Chinese)|en (English), ja (Japanese), ko (Korean), fr (French), es (Spanish), it (Italian), de (German), tr (Turkish), ru (Russian), pt (Portuguese), vi (Vietnamese), id (Bahasa Indonesian), th (Thai), and ms (Malay)|
|en (English)|zh (Simplified Chinese), ja (Japanese), ko (Korean), fr (French), es (Spanish), it (Italian), de (German), tr (Turkish), ru (Russian), pt (Portuguese), vi (Vietnamese), id (Bahasa Indonesian), th (Thai), ms (Malay), ar (Arabic), and hi (Hindi)|
|ja (Japanese)|zh (Simplified Chinese), en (English), ko (Korean)|
|ko (Korean)|zh (Simplified Chinese), en (English), ja (Japanese)|
|fr (French)|zh (Simplified Chinese), en (English), es (Spanish), it (Italian), de (German), tr (Turkish), ru (Russian), and pt (Portuguese)|
|es (Spanish)|zh (Simplified Chinese), en (English), fr (French), it (Italian), de (German), tr (Turkish), ru (Russian), and pt (Portuguese)|
|it (Italian)|zh (Simplified Chinese), en (English), fr (French), es (Spanish), de (German), tr (Turkish), ru (Russian), and pt (Portuguese)|
|de (German)|zh (Simplified Chinese), en (English), fr (French), es (Spanish), it (Italian), tr (Turkish), ru (Russian), and pt (Portuguese)|
|tr (Turkish)|zh (Simplified Chinese), en (English), fr (French), es (Spanish), it (Italian), de (German), ru (Russian), and pt (Portuguese)|
|ru (Russian)|zh (Simplified Chinese), en (English), fr (French), es (Spanish), it (Italian), de (German), tr (Turkish), and pt (Portuguese)|
|pt (Portuguese)|zh (Simplified Chinese), en (English), fr (French), es (Spanish), it (Italian), de (German), tr (Turkish), and ru (Russian)|
|vi (Vietnamese)|zh (Simplified Chinese), en (English)|
|id (Bahasa Indonesian)|zh (Simplified Chinese), en (English)|
