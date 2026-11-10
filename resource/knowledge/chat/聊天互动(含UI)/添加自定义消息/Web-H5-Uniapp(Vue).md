---
sync_node_id: '134592767930224640'
nav_path:
  - "聊天互动（含 UI）"
  - "添加自定义消息"
  - "Web & H5 & Uniapp（Vue）"
product: "chat"
---
TUIKit implements the sending and display for basic message types such as text, image, audio, video, and file messages by default. If these message types do not meet your needs, you can add custom message types.

## Basic Message Types
| Message Type | Renderings |
| --- | --- |
| Text message |  |
| Image message |  |
| Audio message |  |
| Video message |  |
| File message |  |

## Custom message

If the basic message types do not meet your needs, you can customize the messages based on actual business needs.

|Custom message preset styles|Renderings|
|---------|---------|
|Hypertext message||
|Evaluation Message||
|Order Message||

The following uses sending a custom hypertext message that can redirect to the browser as an example, assisting you to promptly understand the implementation process.

## Displaying a Custom Message

The hypertext custom message cell Element (XML) built into TUIKit is depicted in the figure below:

Custom messages and other common types of messages are received in the same way; all types of messages are monitored for access via `TUIStore.watch(StoreName.CHAT, { messageList: onMessageListUpdated })`.
The received custom messages are presented in the message list in different forms according to their respective specific type fields.
The following will explain how to display custom messages.

### Creating the display structure for the custom message

The display of custom messages is primarily accomplished by rendering `messageCustom` in the content area of the custom message type `messageBubble`.
You can add the display structure style you need for custom messages in the file at `src/TUIKit/components/TUIChat/message-list/message-elements/message-custom.vue`.
For instance, the following code demonstrates the display structure for a hypertext message:

【html】
``` javascript
<template v-else-if="isCustom.businessID === 'text_link'">
  <div class="textLink">
    <p>{{ isCustom.text }}</p>
    <a :href="isCustom.link" target="view_window">
      {{
        TUITranslateService.t("message.custom.peekDetails>>")
      }}
    </a>
  </div>
</template>
```

## Sending custom messages

You can send a custom message by calling the `TUIChatService.sendCustomMessage` method in the logical layer engine of TUIKit. For details, please refer to: [SendCustomMessage](https://web.sdk.qcloud.com/im/doc/chat-engine/en/ITUIChatService.html#sendCustomMessage).

Here are a few examples of sending built-in custom style messages in TUIKit:

#### **sendCustomMessage(options, sendMessageOptions) → {Promise.<any>}**

**example1: Sending custom evaluation message**
``` typescript
import { TUIChatService } from "@tencentcloud/chat-uikit-engine";
let promise = TUIChatService.sendCustomMessage({
  payload: {
    data: JSON.stringify({
      businessID: "evaluation",
      version: 1,
      score: 5,
      comment: "so pretty!!!"
    }),
    description: "Evaluation of this service",
    extension: "Evaluation of this service"
  }
});
promise.catch((error) => {
   ...
});
```

**example2: Sending custom hypertext message**
``` javascript
import { TUIChatService } from "@tencentcloud/chat-uikit-engine";
let promise = TUIChatService.sendCustomMessage({
  payload: {
    data: JSON.stringify({
      businessID: "text_link",
      text: "Welcome to Chat. Let's chat!",
      link: "https://web.sdk.qcloud.com/im/demo/intl/index.html?scene=social"
    }),
    description: "",
    extension: ""
  }
});
promise.catch((error) => {
   ...
});
```

**Example 3: Sending custom order messages**
``` typescript
import { TUIChatService } from "@tencentcloud/chat-uikit-engine";
let promise = TUIChatService.sendCustomMessage({
  payload: {
    data: JSON.stringify({
      businessID: "order",
      title: "Chat",
      description: "Standard Edition",
      price: "399 USD/month",
      link: "https://buy.tencentcloud.com/avc",
      imageUrl: "https://1302445663.vod2.myqcloud.com/cea47bfavodsgp1302445663/fd67ff345576678022395175485/2lCqNHbz5aYA.png",
    }),
    description: "",
    extension: ""
  }
});
promise.catch((error) => {
   ...
});
```

**Parameter description:**

|Name|Type|Optional type|Description|
|---------|---------|---------|---------|
|options|[SendMessageParams](https://web.sdk.qcloud.com/im/doc/chat-engine/en/SendMessageParams.html)|Required|Parameters related to custom messages|
|sendMessageOptions|[SendMessageOptions](https://web.sdk.qcloud.com/im/doc/chat-engine/en/SendMessageOptions.html)|Optional|Message sending options|

**Return values**
- `Promise.<any>`
