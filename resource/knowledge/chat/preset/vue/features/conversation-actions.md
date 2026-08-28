## Overview

The `ConversationActions` component manages actions for a single conversation. By default, it supports delete, pin, mute (Do Not Disturb), and mark unread/read.

## Basic Usage

In `ConversationList`, customize conversation actions quickly via the `actionsConfig` prop.
``` typescript
<template>
  <UIKitProvider>
    <ConversationList :actions-config="actionsConfig" />
  </UIKitProvider>
</template>

<script setup lang="ts">
import { UIKitProvider, ConversationList } from '@tencentcloud/chat-uikit-vue3';
import type { ConversationInfo } from '@tencentcloud/chat-uikit-vue3';

const actionsConfig = {
  enablePin: false,
  onConversationDelete: (conversation: ConversationInfo) => {
    console.log('Delete conversation success');
  },
  customConversationActions: {
    'custom-actions-1': {
      label: 'custom-actions',
      onClick: (conversation: ConversationInfo) => {
        console.log(conversation);
      },
    },
  },
};
</script>
```

## Advanced Usage

For deeper customization, replace the `ConversationActions` prop on `ConversationList` directly.
``` typescript
<template>
  <UIKitProvider>
    <ConversationList
      :ConversationActions="CustomConversationActions"
    />
  </UIKitProvider>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue';
import { UIKitProvider, ConversationList, ConversationActions } from '@tencentcloud/chat-uikit-vue3';
type ConversationActionsProps = Parameters<typeof ConversationActions>[0];

const CustomConversationActions = defineComponent({
  name: 'CustomConversationActions',
  setup(props: ConversationActionsProps) {
    return () => h(ConversationActions, {
      ...props,
      enableDelete: false
    });
  }
});
</script>
```

## Props

The `ConversationActionsProps` interface for `ConversationActions` extends `ConversationActionsConfig`.

### ConversationActionsProps

| Parameter | Type | Default | Description |
|---------|---------|---------|---------|
| conversation (Required) | ConversationInfo | - | Required. The conversation for which actions are rendered. |
| className | string | - | Custom CSS class for the root element. |
| style | CSSProperties | - | Custom inline styles for the root element. |

### ConversationActionsConfig

| Parameter | Type | Default | Description |
|---------|---------|---------|---------|
| enablePin | boolean | true | Whether to show the pin conversation button. |
| enableMute | boolean | true | Whether to show the Do Not Disturb button. |
| enableDelete | boolean | true | Whether to show the delete conversation button. |
| enableMarkUnread | boolean | true | Whether to show the mark unread button. |
| onMarkConversationUnread | (conversation: ConversationInfo, e?: Event) => void | - | Custom handler for marking a conversation unread/read. |
| onConversationPin | (conversation: ConversationInfo, e?: Event) => void | - | Custom handler for pinning/unpinning a conversation. |
| onConversationMute | (conversation: ConversationInfo, e?: Event) => void | - | Custom handler for enabling/disabling Do Not Disturb. |
| onConversationDelete | (conversation: ConversationInfo, e?: Event) => void | - | Custom handler for deleting a conversation. |
| customConversationActions | Record<string, ConversationActionItem> | - | Custom conversation action items. |
| PopupIcon | any | - | Custom icon for the actions popup trigger. |
| PopupElements | any[] | - | Custom content for the actions popup. |
| onClick | (e: Event, key?: string, conversation?: ConversationInfo) => void | - | Callback when an action item is clicked. |
| onClose | () => void | - | Callback when the actions popup is closed (H5 only). |

### ConversationActionItem

| Parameter | Type | Default | Description |
|---------|---------|---------|---------|
| enable | boolean | true | Whether the custom action item is enabled. |
| label | string | - | Display label for the custom action item. |
| onClick | (conversation: ConversationInfo, e?: Event) => void | - | Callback when the custom action item is clicked. |

## Events

| Event | Parameters | Description |
|---------|---------|---------|
| click | (e: Event, key?: string, conversation?: ConversationInfo) | Fired when an action item is clicked. |
| close | () | Fired when the actions popup is closed. |
| markConversationUnread | (conversation: ConversationInfo, e?: Event) | Fired when a conversation is marked unread/read. |
| conversationPin | (conversation: ConversationInfo, e?: Event) | Fired when a conversation is pinned/unpinned. |
| conversationMute | (conversation: ConversationInfo, e?: Event) | Fired when Do Not Disturb is enabled/disabled. |
| conversationDelete | (conversation: ConversationInfo, e?: Event) | Fired when a conversation is deleted. |

## Custom Components

### Basic feature toggles

Use `enablePin`, `enableDelete`, `enableMute`, and `enableMarkUnread` to control whether pin, mute, delete, and mark-unread actions are shown in `ConversationActions`.
``` typescript
<template>
  <!-- Disable pin -->
  <ConversationActions :enablePin="false" :conversation="conversation" />

  <!-- Disable delete -->
  <ConversationActions :enableDelete="false" :conversation="conversation" />

  <!-- Disable mute -->
  <ConversationActions :enableMute="false" :conversation="conversation" />

  <!-- Disable mark unread -->
  <ConversationActions :enableMarkUnread="false" :conversation="conversation" />
</template>
```

### Event handlers

`ConversationActions` supports delete, pin/unpin, mute/unmute, and mark unread/read by default. Override the default handlers when you need custom behavior. You can also listen to `@click` for the base click event.
``` typescript
<template>
  <ConversationList :conversation-actions="CustomConversationActions" />
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue';
import { ConversationActions, Toast } from '@tencentcloud/chat-uikit-vue3';
import type { ConversationInfo } from '@tencentcloud/chat-uikit-vue3';
type ConversationActionsProps = Parameters<typeof ConversationActions>[0];

const CustomConversationActions = defineComponent({
  name: 'CustomConversationActions',
  setup(props: ConversationActionsProps) {
    const handleConversationDelete = (conversation: ConversationInfo) => {
      conversation.deleteConversation().then(() => {
        console.log('delete conversation successfully!');
      }).catch(() => {
        console.log('delete conversation failed!');
      });
    };

    return () => h(ConversationActions, {
      ...props,
      onConversationDelete: handleConversationDelete
    });
  }
});
</script>
```

### Custom actions

`customConversationActions` adds custom action items to `ConversationActions`.

**Example: Add a custom action item**
``` typescript
<template>
  <ConversationList :ConversationActions="CustomConversationActions" />
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue';
import { ConversationActions } from '@tencentcloud/chat-uikit-vue3';
import type { ConversationInfo } from '@tencentcloud/chat-uikit-vue3';
type ConversationActionsProps = Parameters<typeof ConversationActions>[0];

const CustomConversationActions = defineComponent({
  name: 'CustomConversationActions',
  setup(props: ConversationActionsProps) {
    return () => h(ConversationActions, {
      ...props,
      customConversationActions: {
        'custom-actions-1': {
          label: 'custom-actions',
          onClick: (conversation: ConversationInfo) => {
            console.log(conversation);
          },
        },
      }
    });
  }
});
</script>
```

### UI customization

Use `PopupIcon` to customize the popup trigger button and `PopupElements` to customize popup content.

**Example: Custom trigger button**
``` typescript
<template>
  <ConversationList :ConversationActions="CustomConversationActions" />
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue';
import { ConversationActions } from '@tencentcloud/chat-uikit-vue3';
type ConversationActionsProps = Parameters<typeof ConversationActions>[0];

const CustomConversationActions = defineComponent({
  name: 'CustomConversationActions',
  setup(props: ConversationActionsProps) {
    const customIcon = h('div', 'Custom Icon');

    return () => h(ConversationActions, {
      ...props,
      PopupIcon: customIcon
    });
  }
});
</script>
```
