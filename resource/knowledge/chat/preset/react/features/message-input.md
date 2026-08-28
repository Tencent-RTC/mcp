## Overview

MessageInput is a robust, fully-featured component designed for chat applications. It delivers essential messaging capabilities, including text input, emoji selection, file attachments, and a send button. The component offers extensive customization—input behavior, toolbar configuration, component replacement, and slot-based extensibility—allowing you to tailor the message input experience for a wide range of chat use cases.

## Props

|Field|Type|Default|Description|
|---------|---------|---------|---------|
|autoFocus|boolean|true|Automatically focuses the input box on mount|
|disabled|boolean|false|Disables the input component|
|hideSendButton|boolean|false|Hides the send button|
|placeholder|string|''|Placeholder text for the input box|
|className|string|undefined|Custom CSS class name for the root container|
|style|React.CSSProperties|undefined|Custom inline style for the root container|
|attachmentPickerMode|'collapsed' \|'expanded'|'collapsed'|Attachment picker display mode|
|actions|MessageInputActions|['EmojiPicker', 'AttachmentPicker']|Toolbar action button configuration|
|slots|MessageInputSlots|undefined|Slot configuration object|
|TextEditor|JSX.Element|undefined|Custom text editor component|
|EmojiPicker|JSX.Element|undefined|Custom emoji picker component|
|AttachmentPicker|JSX.Element|undefined|Custom attachment picker component|
|FilePicker|JSX.Element|undefined|Custom file picker component|
|ImagePicker|JSX.Element|undefined|Custom image picker component|
|VideoPicker|JSX.Element|undefined|Custom video picker component|

## Detailed Props

### autoFocus

Parameter type: `boolean`

Determines whether the input box is automatically focused when the component mounts. Default: `true`.

### disabled

Parameter type: `boolean`

Disables the entire input component, including the text box and all toolbar actions. Default: `false`.

### hideSendButton

Parameter type: `boolean`

Hides the send button. Useful when you want to customize the send trigger behavior. Default: `false`.

### placeholder

Parameter type: `string`

Sets the placeholder text for the input box. Default: empty string.

### className

Parameter type: `string`

Applies a custom CSS class name to the root container. Default: `undefined`.

### style

Parameter type: `React.CSSProperties`

Applies custom inline styles to the root container. Default: `undefined`.

### attachmentPickerMode

Parameter type: `'collapsed' | 'expanded'`

Sets the display mode for the attachment picker. Default: `'collapsed'`.
- `collapsed`: Picker options are hidden by default and expand on click.

- `expanded`: Picker options are displayed side-by-side and always visible.

   > **Note:**
   >
   > The default AttachmentPicker includes file, image, and video selection.
   >
   > 1. When `attachmentPickerMode` is `"collapsed"`, clicking the attachment picker opens a popup menu with file, image, and video options.
   > 2. When `attachmentPickerMode` is `"expanded"`, the picker displays file, image, and video options inline by default.

### actions

Parameter type: `MessageInputActions`

Configures the toolbar action buttons. Default: `['EmojiPicker', 'AttachmentPicker']`.
``` ts
type BuiltInAction =
| 'EmojiPicker'

  | 'ImagePicker'

  | 'FilePicker'

  | 'VideoPicker'

  | 'AttachmentPicker';

type CustomAction = {
  key: string;
  label?: string | undefined;
  component?: React.ComponentType<any> | undefined;
  className?: string | undefined;
  style?: React.CSSProperties | undefined;
  iconSize?: number | undefined;
};

type MessageInputActions = Array<BuiltInAction | CustomAction>;
```

#### Example 1: Customizing Toolbar Button Order
``` tsx
import { Chat, MessageInput } from '@tencentcloud/chat-uikit-react';

function ChatWithCustomActions() {
  // Custom button order: File, Image, Video, Emoji
  const customActions = ['FilePicker', 'ImagePicker', 'VideoPicker', 'EmojiPicker'];

  return (
    <Chat>
      <MessageInput actions={customActions} />
    </Chat>
  );
}
```

The result is shown below:

#### Example 2: Adding a Custom Action Button - Quick Reply for Customer Service
``` tsx
import { Chat, MessageInput, useChatUIState } from '@tencentcloud/chat-uikit-react';

// Quick Reply component
function QuickReplyPicker() {
  const { insertInputContent } = useChatUIState();

  const quickReplies = [
    'Hello, glad to assist you!',
    'Please wait a moment while I check...',
    'Thank you for your inquiry, do you have any other questions?',
    'Your issue has been resolved, have a great day!'
  ];

  const handleQuickReply = (text: string) => {
    insertInputContent(text);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button title="Quick Reply">⚡</button>
      <div style={{
        position: 'absolute',
        bottom: '100%',
        left: 0,
        background: 'white',
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '8px',
        minWidth: '200px'
      }}>
        {quickReplies.map((reply, index) => (
          <div
            key={index}
            onClick={() => handleQuickReply(reply)}
            style={{
              padding: '4px 8px',
              cursor: 'pointer',
              borderRadius: '2px'
            }}
          >
            {reply}
          </div>
        ))}
      </div>
    </div>
  );
}

function CustomerServiceChat() {
  const actions = [
    {
      key: 'quickReply',
      label: 'Quick Reply',
      component: QuickReplyPicker
    },
    'EmojiPicker',
    'FilePicker'
  ];

  return (
    <Chat>
      <MessageInput actions={actions} />
    </Chat>
  );
}
```

The result is shown below:

### slots

Parameter type: `MessageInputSlots`

Allows you to inject custom content at specific locations within the input component. Default: `undefined`.
``` ts
interface MessageInputSlots {
  headerToolbar?: () => React.ReactNode;
  footerToolbar?: () => React.ReactNode;
  leftInline?: () => React.ReactNode;
  rightInline?: () => React.ReactNode;
  inputPrefix?: () => React.ReactNode;
  inputSuffix?: () => React.ReactNode;
}
```

MessageInput Structure Diagram

#### Example 1: Input Prefix and Suffix Functionality
``` tsx
import { Chat, MessageInput } from '@tencentcloud/chat-uikit-react';

function ChatWithInputPrefixSuffix() {
  // Input prefix: @ mention feature
  const InputPrefix = () => (
    <button
      style={{
        border: 'none',
        background: 'transparent',
        color: '#1890ff',
        cursor: 'pointer'
      }}
      onClick={() => {
        // Trigger @ user selection
        console.log('Open @ user selection');
      }}
    >
      @
    </button>
  );

  // Input suffix: Voice input
  const InputSuffix = () => (
    <button
      style={{
        border: 'none',
        background: 'transparent',
        cursor: 'pointer'
      }}
      onClick={() => {
        // Start voice input
        console.log('Start voice input');
      }}
    >
      🎤
    </button>
  );

  return (
    <Chat>
      <MessageInput
        slots={{
          inputPrefix: InputPrefix,
          inputSuffix: InputSuffix
        }}
      />
    </Chat>
  );
}
```

The result is shown below:

#### Example 2: Fully Custom Left and Right Toolbars
``` tsx
import { Chat, MessageInput } from '@tencentcloud/chat-uikit-react';

function ChatWithCustomToolbars() {
  // Left toolbar: Only show emoji and image buttons
  const LeftInline = () => (
    <div style={{ display: 'flex', gap: '8px' }}>
      <button>😊</button>
      <button>📷</button>
    </div>
  );

  // Right toolbar: Custom send area
  const RightInline = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '12px', color: '#666' }}>
        Enter
      </span>
      <button
        style={{
          padding: '6px 12px',
          background: '#1890ff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Send
      </button>
    </div>
  );

  return (
    <Chat>
      <MessageInput
        slots={{
          leftInline: LeftInline,
          rightInline: RightInline
        }}
      />
    </Chat>
  );
}
```

The result is shown below:

### TextEditor

Parameter type: `JSX.Element`

Replaces the default text editor component. Default: `undefined`.

#### Example: Integrating a Custom Editor
``` tsx
import { Chat, MessageInput, useChatContext } from '@tencentcloud/chat-uikit-react';

// Custom rich text editor
function RichTextEditor() {
  const { sendMessage } = useChatContext();
  const [inputValue, setInputValue] = useState('');

  const handleContentChange = (content: string) => {
    setInputValue(content);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Press Enter to send message
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage({ type: 'textMessage', text: inputValue });
      // Clear the editable div content
      const editableDiv = document.querySelector('.editable-div');
      if (editableDiv) {
        editableDiv.textContent = '';
      }
    }
  };

  return (
    <div style={{
      flex: 1,
      border: '1px solid #d9d9d9',
      borderRadius: '6px',
      padding: '8px 12px',
      minHeight: '32px',
      maxHeight: '120px',
      overflow: 'auto',
    }}>
      <div
        contentEditable
        className="editable-div"
        style={{
          outline: 'none',
          minHeight: '20px',
          lineHeight: '20px',
        }}
        onInput={(e) => {
          handleContentChange(e.currentTarget.textContent || '');
        }}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

function ChatWithRichTextEditor() {
  return (
    <Chat>
      <MessageInput TextEditor={<RichTextEditor />} />
    </Chat>
  );
}
```

The result is shown below:

### EmojiPicker

Parameter type: `JSX.Element`

Replaces the default emoji picker component. Default: `undefined`.

#### Example: Custom Emoji Panel
``` tsx
import { Chat, MessageInput, useChatUIState } from '@tencentcloud/chat-uikit-react';

function CustomEmojiPicker() {
  const { insertInputContent } = useChatUIState();

  const emojiCategories = {
    Common: ['😀', '😂', '🥰', '😍', '🤔', '😭', '😡', '👍'],
    Gestures: ['👋', '🤝', '👏', '🙏', '✌️', '🤞', '🤟', '👌'],
    Animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'],
  };

  const [activeCategory, setActiveCategory] = useState('Common');
  const [showPicker, setShowPicker] = useState(false);

  const insertEmoji = (emoji: string) => {
    insertInputContent(emoji);
    setShowPicker(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setShowPicker(!showPicker)}
        style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
      >
        😊
      </button>

      {showPicker && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: 0,
          background: 'white',
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '12px',
          width: '280px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}>
          {/* Category tabs */}
          <div style={{ display: 'flex', marginBottom: '8px' }}>
            {Object.keys(emojiCategories).map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                style={{
                  padding: '4px 8px',
                  border: 'none',
                  background: activeCategory === category ? '#1890ff' : 'transparent',
                  color: activeCategory === category ? 'white' : '#666',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Emoji grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(8, 1fr)',
            gap: '4px',
          }}>
            {emojiCategories[activeCategory].map(emoji => (
              <button
                key={emoji}
                onClick={() => insertEmoji(emoji)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '4px',
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ChatWithCustomEmoji() {
  return (
    <Chat>
      <MessageInput EmojiPicker={<CustomEmojiPicker />} />
    </Chat>
  );
}
```

The result is shown below:

### AttachmentPicker

Parameter type: `JSX.Element`

Replaces the default attachment picker component. Default: `undefined`.

#### Example: Attachment Picker Integrated with Cloud Storage
``` tsx
import { Chat, MessageInput } from '@tencentcloud/chat-uikit-react';

// Attachment picker integrated with cloud storage
function CloudAttachmentPicker() {
  const [showPicker, setShowPicker] = useState(false);

  const attachmentTypes = [
    { key: 'local', label: 'Local File', icon: '📁' },
    { key: 'cloud', label: 'Cloud File', icon: '☁️' },
    { key: 'recent', label: 'Recent File', icon: '🕒' },
    { key: 'screenshot', label: 'Screenshot', icon: '📷' }
  ];

  const handleAttachmentSelect = async (type: string) => {
    switch (type) {
      case 'local':
        // Open local file picker
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.onchange = (e) => {
          const files = (e.target as HTMLInputElement).files;
          console.log('Selected local files:', files);
        };
        input.click();
        break;

      case 'cloud':
        // Open cloud file picker
        console.log('Open cloud file picker');
        break;

      case 'recent':
        // Show recent files
        console.log('Show recent files');
        break;

      case 'screenshot':
        // Start screenshot
        console.log('Start screenshot');
        break;
    }
    setShowPicker(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setShowPicker(!showPicker)}
        style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
      >
        📎
      </button>

      {showPicker && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: 0,
          background: 'white',
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '8px',
          minWidth: '160px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          {attachmentTypes.map(type => (
            <div
              key={type.key}
              onClick={() => handleAttachmentSelect(type.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                cursor: 'pointer',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              <span>{type.icon}</span>
              <span>{type.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ChatWithCloudAttachment() {
  return (
    <Chat>
      <MessageInput AttachmentPicker={<CloudAttachmentPicker />} />
    </Chat>
  );
}
```

The result is shown below:

## Summary

MessageInput offers a comprehensive set of features for message input and extensive customization options. By configuring props and leveraging the slot system, you can build input interfaces suited to your specific business needs. Choose the customization approach that best fits your use case, and focus on maintaining optimal user experience and performance.
