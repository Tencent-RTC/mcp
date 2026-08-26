## Overview

`MessageInput` is a full-featured message input component designed for Vue 3 applications. It provides core chat input capabilities including text editing, emoji selection, file attachments, and a send button. The component supports extensive customization: input behavior, toolbar configuration, component replacement, and slot-based extension for different chat scenarios.

## Props

| Field | Type | Default | Description |
|---------|---------|---------|---------|
| autoFocus | boolean | true | Whether to auto-focus the input box on mount |
| disabled | boolean | false | Whether to disable the input component |
| placeholder | string | '' | Placeholder text for the input box |
| actions | MessageInputActions | ['EmojiPicker', 'ImagePicker', 'FilePicker', 'VideoPicker'] | Toolbar action button configuration |

## Slots

| Slot | Type | Default | Description |
|---------|---------|---------|---------|
| headerToolbar | () => VNode[] | undefined | Header toolbar slot |
| footerToolbar | () => VNode[] | undefined | Footer toolbar slot |
| leftInline | () => VNode[] | undefined | Left inline slot |
| rightInline | () => VNode[] | undefined | Right inline slot |
| inputPrefix | () => VNode[] | undefined | Input prefix slot |
| inputSuffix | () => VNode[] | undefined | Input suffix slot |
| TextEditor | Component \| null | null | Custom text editor component |

## Detailed Props

### autoFocus
- **Type**: `boolean`

- **Description**: Whether to automatically focus the input box when the component mounts. Default: `true`.

### disabled
- **Type**: `boolean`

- **Description**: Whether to disable the entire input component, including the text input and all action buttons. Default: `false`.

### hideSendButton
- **Type**: `boolean`

- **Description**: Whether to hide the send button. Useful when you want a custom send trigger. Default: `false`.

### placeholder
- **Type**: `string`

- **Description**: Placeholder text for the input box. Default: empty string.

### attachmentPickerMode
- **Type**: `'collapsed' | 'expanded'`

- **Description**: Display mode for the attachment picker. Default: `'collapsed'`.

  - **collapsed**: Collapsed mode; options expand on click.

  - **expanded**: Expanded mode; all options are shown directly.

### actions
- **Type**: `MessageInputActions`

- **Description**: Configures the action buttons shown in the toolbar. Default: `['EmojiPicker', 'ImagePicker', 'FilePicker', 'VideoPicker']`.

- **Notes**:

  - Each `BuiltInAction` supports a default slot to customize the trigger UI. For more flexible toolbar customization, use the `headerToolbar` slot.

  - Showing audio/video call buttons does not mean calls can be initiated. CallKit must be integrated first. See the ChatHeader documentation for TUICallKit integration.

      ``` typescript
      type MessageInputActions = Array<BuiltInAction | CustomAction>;

      type BuiltInAction =
        | 'EmojiPicker'
        | 'ImagePicker'
        | 'FilePicker'
        | 'VideoPicker'
        | 'AudioCallPicker'
        | 'VideoCallPicker';

      type CustomAction = {
        key: string;
        label?: string | undefined;
        component?: Component | undefined;
        className?: string | undefined;
        style?: CSSProperties | undefined;
        iconSize?: number | undefined;
      };
      ```

#### Example 1: Customize toolbar button order
``` typescript
<template>
  <MessageInput :actions="customActions" />
</template>

<script lang="ts" setup>
import { MessageInput } from '@tencentcloud/chat-uikit-vue3';

// Custom button order: file, image, video, audio call, video call
const customActions = ['FilePicker', 'ImagePicker', 'VideoPicker', 'AudioCallPicker', 'VideoCallPicker'];
</script>
```

#### Example 2: Add a custom action button
``` typescript
<template>
  <MessageInput :actions="customActions" />
</template>

<script lang="ts" setup>
import { defineComponent, h } from 'vue';
import { MessageInput } from '@tencentcloud/chat-uikit-vue3';

// Custom location share button component
const LocationPicker = defineComponent({
  name: 'LocationPicker',
  setup() {
    const handleLocationShare = () => {
      // Get user location and send
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          console.log(`Share location: ${latitude}, ${longitude}`);
          alert(`Share location: ${latitude}, ${longitude}`); // For demonstration
        });
      } else {
        alert('Geolocation is not supported by this browser.');
      }
    };

    return () =>
      h('button',
        {
          onClick: handleLocationShare,
          style: { padding: '4px 8px', border: 'none', background: 'transparent' },
          title: 'Share location',
        },
        '📍',
      );
  },
});

const customActions = [
  'EmojiPicker',
  'ImagePicker',
  {
    key: 'location',
    label: 'Location',
    component: LocationPicker,
  },
];
</script>
```

Result:

#### Example 3: Customer service quick replies
``` typescript
<template>
  <MessageInput :actions="actions" />
</template>

<script lang="ts" setup>
import { defineComponent, h, ref } from 'vue';
import { MessageInput, useChatUIState } from '@tencentcloud/chat-uikit-vue3';

// Quick reply component
const QuickReplyPicker = defineComponent({
  name: 'QuickReplyPicker',
  setup() {
    const { insertInputContent } = useChatUIState();
    const showPicker = ref(false);

    const quickReplies = [
      'Hello! How can I help you today?',
      'Please hold on while I look that up for you...',
      'Thank you for reaching out. Do you have any other questions?',
      'Your issue has been resolved. Have a great day!',
    ];

    const handleQuickReply = (text: string) => {
      insertInputContent(text);
      showPicker.value = false;
    };

    return () =>
      h('div', { style: { position: 'relative' } }, [
        h('button',
          {
            title: 'Quick reply',
            onClick: () => (showPicker.value = !showPicker.value),
          },
          '⚡',
        ),
        showPicker.value &&
          h('div',
            {
              style: {
                position: 'absolute',
                bottom: '100%',
                left: 0,
                background: 'white',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '8px',
                minWidth: '200px',
                zIndex: 100, // Ensure it's above other elements
              },
            },
            quickReplies.map((reply, index) =>
              h('div',
                {
                  key: index,
                  onClick: () => handleQuickReply(reply),
                  style: {
                    padding: '4px 8px',
                    cursor: 'pointer',
                    borderRadius: '2px',
                    '&:hover': { backgroundColor: '#f0f0f0' },
                  },
                },
                reply,
              ),
            ),
          ),
      ]);
  },
});

const actions = [
  {
    key: 'quickReply',
    label: 'Quick reply',
    component: QuickReplyPicker,
  },
  'EmojiPicker',
  'FilePicker',
];
</script>
```

Result:

#### Example 4: Custom emoji panel
``` typescript
<template>
  <MessageInput :actions="actions" />
</template>

<script lang="ts" setup>
import { defineComponent, h, ref } from 'vue';
import { MessageInput, useChatUIState } from '@tencentcloud/chat-uikit-vue3';

const actions = [{
    key: 'EmojiPicker',
    component: CustomEmojiPicker,
}];

const CustomEmojiPicker = defineComponent({
  name: 'CustomEmojiPicker',
  setup() {
    const { insertInputContent } = useChatUIState();
    const showPicker = ref(false);
    const activeCategory = ref('common');

    const emojiCategories = {
      'common': ['😀', '😂', '🥰', '😍', '🤔', '😭', '😡', '👍'],
      'hand': ['👋', '🤝', '👏', '🙏', '✌️', '🤞', '🤟', '👌'],
      'animal': ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'],
    };

    const insertEmoji = (emoji: string) => {
      insertInputContent(emoji);
      showPicker.value = false;
    };

    return () =>
      h('div', { style: { position: 'relative' } }, [
        h('button',
          {
            onClick: () => (showPicker.value = !showPicker.value),
            style: { border: 'none', background: 'transparent', cursor: 'pointer' },
          },
          '😊',
        ),
        showPicker.value &&
          h('div',
            {
              style: {
                position: 'absolute',
                bottom: '100%',
                left: 0,
                background: 'white',
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '12px',
                width: '280px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                zIndex: 100, // Ensure it's above other elements
              },
            },
            [
              // Category tabs
              h('div', { style: { display: 'flex', marginBottom: '8px' } },
                Object.keys(emojiCategories).map((category) =>
                  h('button',
                    {
                      key: category,
                      onClick: () => (activeCategory.value = category),
                      style: {
                        padding: '4px 8px',
                        border: 'none',
                        background: activeCategory.value === category ? '#1890ff' : 'transparent',
                        color: activeCategory.value === category ? 'white' : '#666',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                      },
                    },
                    category,
                  ),
                ),
              ),
              // Emoji grid
              h('div',
                {
                  style: {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(8, 1fr)',
                    gap: '4px',
                  },
                },
                emojiCategories[activeCategory.value].map((emoji) =>
                  h('button',
                    {
                      key: emoji,
                      onClick: () => insertEmoji(emoji),
                      style: {
                        border: 'none',
                        background: 'transparent',
                        fontSize: '20px',
                        cursor: 'pointer',
                        padding: '4px',
                        borderRadius: '4px',
                      },
                    },
                    emoji,
                  ),
                ),
              ),
            ],
          ),
      ]);
  },
});
</script>
```

Result:

## Slots Reference
- **Type**: `MessageInputSlots`

- **Description**: Insert custom content at specific positions in the input component.

   ``` typescript
   interface MessageInputSlots {
     headerToolbar?: () => VNode[];
     footerToolbar?: () => VNode[];
     leftInline?: () => VNode[];
     rightInline?: () => VNode[];
     inputPrefix?: () => VNode[];
     inputSuffix?: () => VNode[];
     textEditor?: () => VNode[];
   }
   ```

   MessageInput layout diagram

#### Example 1: Custom `headerToolbar` slot

Restyle the `FilePicker` UI with another UI framework while reusing `FilePicker` functionality.
``` typescript
<script lang="ts" setup>
import { FilePicker } from '@tencentcloud/chat-uikit-vue3';
import { Button } from 'other-ui-lib';
</script>

<template>
  <MessageInput>
    <template #headerToolbar>
      <FilePicker>
        <Button type="primary" :icon="File" />
      </FilePicker>
    </template>
  </MessageInput>
</template>
```

#### Example 2: Custom `footerToolbar` slot
``` typescript
<template>
  <MessageInput>
    <template #footerToolbar>
      <div style="padding: 4px 12px; font-size: 12px; color: #999; text-align: right;">
        press Ctrl+Enter to wrap
      </div>
    </template>
  </MessageInput>
</template>
```

Result:

#### Example 3: Input prefix and suffix
``` typescript
<template>
  <MessageInput>
    <template #inputPrefix>

    </template>
    <template #inputSuffix>
      <button
        style="border: none; background: transparent; cursor: pointer;"
        @click="handleVoiceInput"
      >
        🎤
      </button>
    </template>
  </MessageInput>
</template>

<script lang="ts" setup>
import { MessageInput } from '@tencentcloud/chat-uikit-vue3';

const handleAtUser = () => {
  // Open @mention user picker
  console.log('Open @mention picker');
};

const handleVoiceInput = () => {
  // Start voice input
  console.log('Start voice input');
};
</script>
```

Result:

### TextEditor

**Type**: `Component | null`

**Description**: Replaces the default text editor component. Default: `null`.

#### Example: Custom text editor
``` typescript
<template>
  <MessageInput>
    <template #textEditor>
      <RichTextEditor />
    </template>
  </MessageInput>
</template>

<script lang="ts" setup>
import { defineComponent, h, ref, onMounted } from 'vue';
import { MessageInput, useChatContext } from '@tencentcloud/chat-uikit-vue3';

const RichTextEditor = defineComponent({
  name: 'RichTextEditor',
  setup() {
    const { sendMessage } = useChatContext();
    const editorRef = ref<HTMLDivElement | null>(null);
    const inputRawValue = ref('');

    const handleInput = (e: Event) => {
      const target = e.target as HTMLDivElement;
      inputRawValue.value = (e.target as HTMLDivElement).textContent || '';
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        sendMessage({ type: 'textMessage', text: inputRawValue.value });
        if (editorRef.value) {
          editorRef.value.textContent = '';
        }
      }
    };

    onMounted(() => {
      if (editorRef.value) {
        editorRef.value.textContent = inputRawValue.value || '';
      }
    });

    return () =>
      h('div',
        {
          style: {
            flex: 1,
            border: '1px solid #d9d9d9',
            borderRadius: '6px',
            padding: '8px 12px',
            minHeight: '32px',
            maxHeight: '120px',
            overflow: 'auto',
          },
        },
        h('div',
          {
            ref: editorRef,
            contentEditable: true,
            style: {
              outline: 'none',
              minHeight: '20px',
              lineHeight: '20px',
            },
            onInput: handleInput,
            onKeydown: handleKeyDown,
          },
        ),
      );
  },
});
</script>
```

Example code:

## Related Documentation
- Custom Components - UIKitProvider

- Custom Components - ConversationList

- Custom Components - Chat

- Custom Components - MessageInput

- Custom Components - MessageList

- Custom Components - ChatSetting

- Custom Components - ContactList

- Custom Components - Search

- [chat-uikit-vue3 npm](https://www.npmjs.com/package/@tencentcloud/chat-uikit-vue3)

- [GitHub Demo](https://github.com/Tencent-RTC/TUIKit_Vue3/tree/main/demos/rtcube-vite-vue3)

## Community and Feedback
