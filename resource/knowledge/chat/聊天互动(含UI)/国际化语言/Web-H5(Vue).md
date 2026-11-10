---
sync_node_id: '134592820973686784'
nav_path:
  - "聊天互动（含 UI）"
  - "国际化语言"
  - "Web & H5（Vue）"
product: "chat"
---
## Description

> **Note:**
> Advanced international multilingual capabilities have significant improvements and changes in @tencentcloud/chat-uikit-vue v2.0.0 version and onwards.
> 
> This document demonstrates the usage of the new version. Please **make sure your project dependency of @tencentcloud/chat-uikit-vue is ≥  v2.0.0**.
> 

The `Vue TUIKit` on Web & H5 platforms comes standard with **Simplified Chinese and English**  language packs, serving as the display language for the interface.

According to the guide in this document, you can either utilize the default language pack or the advanced customization aspects of internationalization, which include adding new languages, new terms, or modifying existing translations.

## Utilizing the Built-in Language and Lexicon

If your App requires only **English/Simplified Chinese**, and there's no need for new entries or modifications to the existing translations, please .

> **Note:**
> More language support will be available in the future, stay tuned!
> 

### Specify Display Language

To set a specific language for the TUIKit interface, you must invoke the following code when initializing the App.
``` javascript
import { TUITranslateService } from "@tencentcloud/chat-uikit-engine";
// change language to chinese
TUITranslateService.changeLanguage("zh");
// change language to english
TUITranslateService.changeLanguage("en");
```

### Real-Time Dynamic Modification

When you opt for `TUITranslateService.changeLanguage` to switch languages, your current language won't be updated instantly, you need to refresh the page for the changes to take effect.

You are able to achieve real-time dynamic modification and display of language by switching the `page/component key`.

For example, real-time dynamic switching of `TUIConversation` language:
``` javascript
<template>
  <div class="home">
    <div class="button-container">
      <div class="button" @click="changeLanguage('en')">English</div>
      <div class="button" @click="changeLanguage('zh')">Simplified Chinese</div>
    </div>
    <div class="conversation-container">
      <TUIConversation :key="locale" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { TUITranslateService } from "@tencentcloud/chat-uikit-engine";
import { TUIConversation } from "./TUIKit";
const locale = ref("zh");
const changeLanguage = (language: string) => {
  TUITranslateService.changeLanguage(language).then(() => {
    locale.value = language;
  });
};
</script>
<style scoped lang="scss">
.home {
  width: 400px;
  .button-container {
    display: flex;
    flex-direction: column;
    .button {
      margin: 10px;
      background-color: #006eff;
      color: #ffffff;
      text-align: center;
      padding: 5px;
      border-radius: 30px;
      cursor: pointer;
    }
  }
}
</style>
```

## Custom language entries

### Add Language Entry

If you need to expand or modify the **Simplified Chinese, English**  language pack entries, you can add or modify entries in the `src/TUIKit/locales`  directory.

Locales entries are divided into two parts, with the 'en' directory containing the English entries, and the 'zh_cn' directory containing Simplified Chinese entries.

> **Note:**
> If you need to use Simplified Chinese, English**,** when adding or modifying entries, **please be sure to synchronize changes in the 'en' and 'zh_cn' folders under the same subdirectories**.
> 

### Language term usage

Here the `TUITranslateService.t()` is used for term translation. More information about this interface can be found in [TUITranslateService](https://web.sdk.qcloud.com/im/doc/chat-engine/en/ITUITranslateService.html).
``` javascript
<template>
    <div>{{TUITranslateService.t("TUIChat.${yourLocaleKey}")}}</div>
</template>
<script setup lang="ts">
import { TUITranslateService } from "@tencentcloud/chat-uikit-engine";
</script>
```
