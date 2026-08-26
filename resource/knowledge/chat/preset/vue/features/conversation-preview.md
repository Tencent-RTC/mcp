## Overview

The `ConversationPreview` component previews a single conversation in the conversation list. It displays conversation info, unread counts, and conversation action controls.

With this component, you can freely design and compose the `ConversationPreview` layout you need. You can also customize selection behavior via the `@select-conversation` event.

## Custom Usage

Use the `Preview` prop on `ConversationList` to customize each conversation preview item in the list. If `Preview` is not specified, the default `ConversationPreviewUI` component is used.
``` typescript
<template>
  <div class="custom-preview">
    <div class="content">
      <h4>Custom Preview</h4>
      <p>{{ conversation?.title }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ConversationInfo } from '@tencentcloud/chat-uikit-vue3';

interface Props {
  conversation?: ConversationInfo;
}

const props = withDefaults(defineProps<Props>(), {});
</script>
```

``` typescript
<template>
  <ConversationList :Preview="CustomConversationPreview" />
</template>

<script setup lang="ts">
import { ConversationList } from '@tencentcloud/chat-uikit-vue3';
import CustomConversationPreview from './CustomConversationPreview.vue';
</script>
```

## Props

### ConversationPreviewProps

|Property|Type|Default|Description|
|---------|---------|---------|---------|
|**conversation***(Required)*|ConversationInfo|-|Required. Identifies the conversation list item being rendered|
|isSelected|boolean|false|Controls whether the conversation list item UI is in the selected state|
|enableActions|boolean|true|Controls whether conversation actions are displayed|
|actionsConfig|ConversationActionsConfig|-|Custom conversation actions configuration|
|highlightMatchString|string|-|Keyword used to highlight the conversation list item title; commonly used for search result highlighting|
|Preview|Component|ConversationPreviewUI|Custom preview component|
|Avatar|Component|Avatar|Renders the conversation list item avatar area|
|ConversationActions|Component|ConversationActions|Renders the conversation list item actions area|
|className|string|-|Custom CSS class name for the root element|
|style|CSSProperties|-|Custom inline styles for the root element|

### ConversationPreviewUIProps

|Property|Type|Default|Description|
|---------|---------|---------|---------|
|**conversation***(Required)*|ConversationInfo|-|Required. Identifies the conversation list item being rendered|
|isSelected|boolean|false|Controls whether the conversation list item UI is in the selected state|
|enableActions|boolean|true|Controls whether conversation actions are displayed|
|actionsConfig|ConversationActionsConfig|-|Custom conversation actions configuration|
|highlightMatchString|string|-|Keyword used to highlight the conversation list item title|
|Title|Component|ConversationPreviewTitle|Renders the conversation list item title area|
|LastMessageAbstract|Component|ConversationPreviewAbstract|Renders the latest message summary area|
|LastMessageTimestamp|Component|ConversationPreviewTimestamp|Renders the latest message timestamp area|
|Unread|Component|ConversationPreviewUnread|Renders the unread message indicator area|
|ConversationActions|Component|ConversationActions|Renders the conversation list item actions area|
|Avatar|Component|Avatar|Renders the conversation list item avatar area|
|className|string|-|Custom CSS class name for the root element|
|style|CSSProperties|-|Custom inline styles for the root element|

## Events

|Event|Parameters|Description|
|---------|---------|---------|
|select-conversation|(conversation: ConversationModel)|Fired when a conversation is selected in the conversation list|

## Example: Discord-Style Custom Preview

Discord is a popular chat application similar to Skype or Telegram. Its conversation list looks like this:

By customizing the `ConversationPreview` layout, behavior, and styles, you can quickly achieve a Discord-like effect.
``` java
<template>
  <div
    :class="[
      'discord-preview-ui',
      {
        'conversationPreview--active': activeConversation?.conversationID === props.conversation.conversationID,
      }
    ]"
    @click="handleSelectConversation"
  >
    <label class="discord-preview-ui__tag">
      #
    </label>
    <span class="discord-preview-ui__title">{{ conversation?.title }}</span>
  </div>
</template>

<script lang="ts" setup>
import { useChatContext } from '@tencentcloud/chat-uikit-vue3';
import type { ConversationInfo } from '@tencentcloud/chat-uikit-vue3';

const { setActiveConversation, activeConversation } = useChatContext();

interface Props {
  conversation: ConversationInfo;
}

const emit = defineEmits<{
  selectConversation: [conversation: ConversationInfo];
}>();

const props = withDefaults(defineProps<Props>(), {});

const handleSelectConversation = () => {
  setActiveConversation(props.conversation.conversationID);
  emit('selectConversation', props.conversation);
};
</script>
<style scoped>
.discord-style-app {
  background-color: #2f3136;
  padding: 20px;
  border-radius: 8px;
}

.discord-conversation-list {
  background-color: #2f3136;
}

.discord-preview-ui {
  height: 34px;
  border-radius: 4px;
  padding: 6px 8px;
  margin: 1px 8px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.15s ease;
  position: relative;
}

.discord-preview-ui__tag {
  margin-right: 6px;
  font-size: 16px;
  color: #8e9297;
  font-weight: 600;
  line-height: 1;
}

.discord-preview-ui__title {
  font-size: 16px;
  color: #8e9297;
  font-weight: 500;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.discord-preview-ui:hover {
  background-color: #393c43;
}

.discord-preview-ui:hover .discord-preview-ui__tag,
.discord-preview-ui:hover .discord-preview-ui__title {
  color: #dcddde;
}

.conversationPreview--active {
  background-color: #404249 !important;
}

.conversationPreview--active .discord-preview-ui__tag,
.conversationPreview--active .discord-preview-ui__title {
  color: #ffffff !important;
}

.discord-preview-ui::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 8px;
  background-color: #ffffff;
  border-radius: 0 4px 4px 0;
  opacity: 0;
  transition: opacity 0.15s ease;
}
</style>

```

``` typescript
<template>
  <ConversationList :Preview="CustomConversationPreview" />
</template>

<script setup lang="ts">
import { ConversationList } from '@tencentcloud/chat-uikit-vue3';
import CustomConversationPreview from './CustomConversationPreview.vue';
</script>
```

After customizing `ConversationListPreview`, the result looks like this:
