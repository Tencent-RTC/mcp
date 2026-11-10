---
sync_node_id: '183353762157371392'
nav_path:
  - "聊天互动（含 UI）"
  - "单功能接入"
  - "消息输入"
  - "React"
product: "chat"
---
## Overview

MessageInput is a fully featured input component for chat applications, providing all essential messaging functions such as text entry, emoji selection, file attachments, and a send button. The component is highly flexible, supporting configuration for input behavior, toolbar layout, component overrides, and slot-based extension. This allows you to customize the input experience to fit a wide range of chat scenarios.

## Props

|Field|Type|Default|Description|
|---------|---------|---------|---------|
|autoFocus|boolean|true|Automatically focus the input box on mount|
|disabled|boolean|false|Disable the input component, including all actions|
|hideSendButton|boolean|false|Hide the send button|
|placeholder|string|''|Placeholder text for the input box|
|className|string|undefined|Custom CSS class name for the root container|
|style|React.CSSProperties|undefined|Custom inline styles for the root container|
|attachmentPickerMode|'collapsed' \| 'expanded'|'collapsed'|Attachment picker display mode|
|actions|MessageInputActions|['EmojiPicker', 'AttachmentPicker']|Toolbar action button configuration|
|setOfflinePushInfo|(payload: SendMessagePayload) => OfflinePushInfo \| undefined|undefined|Customize offline push parameters for outgoing messages|
|slots|MessageInputSlots|undefined|Slot configuration object|
|TextEditor|JSX.Element|undefined|Custom text editor component|
|EmojiPicker|JSX.Element|undefined|Custom emoji picker component|
|AttachmentPicker|JSX.Element|undefined|Custom attachment picker component|
|FilePicker|JSX.Element|undefined|Custom file picker component|
|ImagePicker|JSX.Element|undefined|Custom image picker component|
|VideoPicker|JSX.Element|undefined|Custom video picker component|

## Property Details

### autoFocus

Type: `boolean`

Controls whether the input box is automatically focused when the component mounts. Default: `true`.

### disabled

Type: `boolean`

Disables the entire input component, including text entry and all action buttons. Default: `false`.

### hideSendButton

Type: `boolean`

Determines whether the send button is displayed. Useful when you want to implement a custom send mechanism. Default: `false`.

### placeholder

Type: `string`

Sets the placeholder text shown in the input box. Default: empty string.

### className

Type: `string`

Applies a custom CSS class name to the root container. Default: `undefined`.

### style

Type: `React.CSSProperties`

Applies custom inline styles to the root container. Default: `undefined`.

### attachmentPickerMode

Type: `'collapsed' | 'expanded'`

Sets the display mode for the attachment picker. Default: `'collapsed'`.
- `collapsed`: Options are hidden by default and expand when clicked.

- `expanded`: All attachment options are visible by default.

   > **Note:**
   > 
   > The default AttachmentPicker includes options for selecting files, images, and videos.
   > 
   > 1. When `attachmentPickerMode` is set to `"collapsed"`, clicking the attachment picker opens a popup menu with file, image, and video selection.
   > 2. When `attachmentPickerMode` is `"expanded"`, all file, image, and video selection options are displayed side by side in the toolbar.

### actions

Type: `MessageInputActions`

Configures the set and order of action buttons in the input toolbar. Default: `['EmojiPicker', 'AttachmentPicker']`.
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

#### Example 1: Custom Toolbar Button Order
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

#### Example 2: Add a Custom Action Button for Quick Replies
``` tsx
import { Chat, MessageInput, useChatUIState } from '@tencentcloud/chat-uikit-react';

// Quick Reply Component
function QuickReplyPicker() {
  const { insertInputContent } = useChatUIState();

  const quickReplies = [
    'Hello, glad to assist you!',
    'Please wait a moment while I check for you...',
    'Thank you for your inquiry. Any other questions?',
    'Your issue has been resolved. Have a great day!'
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

### setOfflinePushInfo

Type: `(payload: SendMessagePayload) => OfflinePushInfo | undefined`

Enables you to customize offline push parameters dynamically based on the content of the outgoing message.
``` typescript
type SendMessagePayload = {
    type: 'textMessage';
    text: string;
} | {
    type: 'customMessage';
    customData: string;
    description?: string;
    extensionInfo?: string;
} | {
    type: 'imageMessage';
    file: File | HTMLInputElement;
    width?: number;
    height?: number;
} | {
    type: 'audioMessage';
    file: File | HTMLInputElement;
    duration: number;
} | {
    type: 'videoMessage';
    file: File | HTMLInputElement;
    duration: number;
    snapshotFile?: File | HTMLInputElement;
    snapshotWidth?: number;
    snapshotHeight?: number;
} | {
    type: 'fileMessage';
    file: File | HTMLInputElement;
} | {
    type: 'locationMessage';
    description: string;
    longitude: number;
    latitude: number;
} | {
    type: 'faceMessage';
    index: number;
    data: string;
};

interface OfflinePushInfo {
    title: string;
    description: string;
    extensionInfo: {
      disablePush: boolean;
      disableVoipPush: boolean;
      extension: string;
      androidInfo: Record<string, any>;
      apnsInfo: Record<string, any>;
    };
}
```

### slots

Type: `MessageInputSlots`

slots allows you to inject custom content into predefined areas of the input component. Default: `undefined`.
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

MessageInput Structure Diagram

#### Example 1: Input Prefix and Suffix
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

#### Example 2: Custom Left and Right Toolbars
``` tsx
import { Chat, MessageInput } from '@tencentcloud/chat-uikit-react';

function ChatWithCustomToolbars() {
  // Left toolbar: Only emoji and image buttons
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

Type: `JSX.Element`

Overrides the default text editor component. Default: `undefined`.

#### Example: Integrate a Custom Rich Text Editor
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
    // Enter to send message
    if (e.key === 'Enter') {
      // Trigger send logic
      e.preventDefault();
      sendMessage({ type: 'textMessage', text: inputValue });
      // Clear the content of the editable div
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
    }}
    >
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

Type: `JSX.Element`

Overrides the default emoji picker component. Default: `undefined`.

#### Example: Custom Emoji Picker
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
        }}
        >
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
          }}
          >
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

Type: `JSX.Element`

Overrides the default attachment picker component. Default: `undefined`.

#### Example: Attachment Picker with Cloud Storage Integration
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

The MessageInput component delivers a comprehensive set of message input features and offers extensive customization options. By configuring props and leveraging the slot system, you can build input interfaces that meet your unique business needs. Choose the customization approach that best fits your scenario to provide an optimal user experience and high performance.
