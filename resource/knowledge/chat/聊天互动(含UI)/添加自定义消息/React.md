---
sync_node_id: '183337047849480192'
nav_path:
  - "聊天互动（含 UI）"
  - "添加自定义消息"
  - "React"
product: "chat"
---
TUIKit provides default implementation for sending and displaying basic message types such as text, image, voice, video, and file. If these message types do not meet your needs, you can add custom message types.

## Basic Message Type
| Message Type | Display Effect |
| --- | --- |
| Text messages |  |
| Image messages |  |
| Audio messages |  |
| Video messages |  |
| File messages |  |

## Custom Notification

If the basic message type cannot meet your needs, you can use custom messages based on actual business needs.
| Custom Message Preset Style | Display Effect |
| --- | --- |
| Hypertext messages |  |
| Rating messages |  |
| Order messages |  |

## Implementation Steps

The data that needs to be included in a custom message is determined by the user. Suppose we want to develop a custom message for purchasing a product, we should need:
- A unique ID to distinguish the custom message

- Product name

- Product price

- Product link

   

【index.tsx】
``` typescript
import { useMemo } from 'react';
import {
  Chat,
  ChatHeader,
  MessageInput,
  MessageList,
  MessageType,
  useChatContext,
  CustomMessage,
  type MessageInfo,
  type CustomMessagePayload,
} from '@tencentcloud/chat-uikit-react';
import './styles.css';

interface ProductMessageData {
  businessID: 'product';
  name: string;
  price: string;
  link: string;
}

function parseProductMessage(message: MessageInfo): ProductMessageData | null {
  try {
    const payload = message.messagePayload as CustomMessagePayload;
    const rawData = payload.customData || '{}';
    const parsed = JSON.parse(rawData) as ProductMessageData;
    return parsed.businessID === 'product' ? parsed : null;
  } catch {
    return null;
  }
}

function ProductMessage({ message }: { message: MessageInfo }) {
  const product = parseProductMessage(message);

  if (!product) {
    // If it is not a known custom message
    // it is recommended to return the default custom message.
    return <CustomMessage message={message} />;
  }

  return (
    <div className="custom-message-basic-demo__card">
      <div className="custom-message-basic-demo__cover">Product</div>
      <div className="custom-message-basic-demo__info">
        <strong>{product.name}</strong>
        <span>{product.price}</span>
        <a href={product.link} rel="noreferrer" target="_blank">
          Buy now
        </a>
      </div>
    </div>
  );
}

function CustomMessageBasicDemo() {
  const { sendMessage } = useChatContext();
  const messageRenderers = useMemo(() => ({
    [MessageType.Custom]: ProductMessage,
  }), []);

  const handleSendProductMessage = () => {
    sendMessage({
      type: 'customMessage',
      customData: JSON.stringify({
        businessID: 'product',
        name: 'T-Shirt',
        price: '$19.99',
        link: 'https://trtc.io/document/chat-overview?product=chat&menulabel=uikit&platform=react',
      }),
      description: '[Product]',
    });
  };

  return (
    <div className="custom-message-basic-demo">
      <div className="custom-message-basic-demo__frame">
        <Chat className="custom-message-basic-demo__chat">
          <ChatHeader />
          <MessageList messageRenderers={messageRenderers} />
          <div className="custom-message-basic-demo__toolbar">
            <button onClick={handleSendProductMessage} type="button">
              Send Product Message
            </button>
          </div>
          <MessageInput autoFocus={false} hideSendButton={false} />
        </Chat>
      </div>
    </div>
  );
}
```

【index.css】
``` java
.custom-message-basic-demo {
  display: flex;
  height: 100%;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
  overflow: hidden;
}

.custom-message-basic-demo__header h2 {
  margin: 0 0 8px;
  color: #111827;
  font-size: 22px;
}

.custom-message-basic-demo__header p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.custom-message-basic-demo__frame {
  min-height: 0;
  flex: 1;
  overflow: hidden;
  border: 1px solid #edf0f5;
  border-radius: 12px;
}

.custom-message-basic-demo__chat {
  height: 100%;
}

.custom-message-basic-demo__toolbar {
  padding: 10px 12px;
  border-top: 1px solid #edf0f5;
  background: #fff;
}

.custom-message-basic-demo__toolbar button {
  padding: 8px 12px;
  border: 1px solid #667eea;
  border-radius: 8px;
  background: #667eea;
  color: #fff;
  cursor: pointer;
}

.custom-message-basic-demo__card {
  display: flex;
  width: 260px;
  gap: 12px;
  padding: 12px;
  border: 1px solid #edf0f5;
  border-radius: 12px;
  background: #fff;
  color: #111827;
}

.custom-message-basic-demo__cover {
  display: flex;
  width: 72px;
  min-width: 72px;
  height: 72px;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: #eef2ff;
  color: #4f46e5;
  font-size: 13px;
  font-weight: 700;
}

.custom-message-basic-demo__info {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 6px;
}

.custom-message-basic-demo__info strong {
  color: #111827;
  font-size: 14px;
}

.custom-message-basic-demo__info span {
  color: #ef4444;
  font-size: 15px;
  font-weight: 700;
}

.custom-message-basic-demo__info a {
  color: #4f46e5;
  font-size: 13px;
  text-decoration: none;
}

.custom-message-basic-demo__fallback {
  padding: 10px 12px;
}

.custom-message-basic-demo__empty {
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #f9fafb;
  color: #6b7280;
}

.custom-message-basic-demo__empty h3,
.custom-message-basic-demo__empty p {
  margin: 0;
}

```
