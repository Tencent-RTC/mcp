---
sync_node_id: '183261727431032832'
nav_path:
  - "聊天互动（含 UI）"
  - "单功能接入"
  - "消息列表"
  - "React"
  - "MessageList Store"
product: "chat"
---
## Overview

MessageListStore acts as the core data access and structure layer for message lists, providing a consistent interface for the upper-level UI. It is responsible for managing the message list for the current conversation, loading historical messages, updating the list when messages are sent or received, handling message state changes, message revocation, message read receipts, message positioning, syncing after clearing history, and other message-level features.

The full lifecycle management of MessageListStore—including creation, subscription, destruction, and message list updates when switching conversations—is encapsulated within `useChatContext`.

For most use cases, we recommend accessing MessageListStore’s properties and methods through useChatContext instead of manually creating or managing MessageListStore instances. Direct usage of MessageListStore is only necessary for scenarios such as independent message list instances, specialized conversation panels, floating window isolation, multi-panel isolation, or custom message loading flows.

## MessageListStore

## Properties

|Property Name|Type|Description|
|---------|---------|---------|
|messageList|MessageInfo[]|Message list data for the current conversation.|
|hasOlderMessages|boolean|Indicates whether older historical messages are available for loading.|
|hasNewerMessages|boolean|Indicates whether newer messages are available for loading. Commonly used after positioning to a specific message.|
|pinnedMessageList|MessageInfo[]|Pinned message list for the current conversation.|

## Methods

|Method Name|Type|Description|
|---------|---------|---------|
|loadMessages|(option?: MessageLoadOption) => Promise|Retrieves the message list for the current conversation. Supports parameters such as direction, cursor, count, and message type. Ideal for initializing the list or jumping to a message fragment.|
|loadOlderMessages|() => Promise|Loads historical messages.|
|loadNewerMessages|() => Promise|Loads newer messages in chronological order. Commonly used after message positioning.|
|sendMessageReadReceipts|(messages: MessageInfo[]) => Promise|Sends message read receipts for the specified messages.|
|deleteMessages|(messages: MessageInfo[]) => Promise|Deletes the specified messages and updates the local message list state.|
|forwardMessages|(messages: MessageInfo[], option: ForwardMessageOption, conversationID: string) => Promise|Forwards a batch of messages to the specified conversation. Supports both individual and merged forwarding.|

## Usage Example

The following example demonstrates how to use MessageListStore to build a text message list with pagination:
- Supports loading message lists by conversation ID: Enter a C2Cxxx or GROUPxxx ID, then use MessageListStore.create(conversationID) to retrieve messages for the current conversation (use useChatContext for best practice).

- Supports paginated loading of historical messages: Calls loadOlderMessages() when scrolling to the top.

- Maintains scroll position when loading more messages: Preserves user position after loading historical messages.

- Automatically scrolls for new messages: When the user is at the bottom, new messages auto-scroll to the latest.

- Identifies historical reading state: When the user leaves the bottom, the status changes to Viewing history.

- Provides unobtrusive new message notifications: When viewing history, new messages trigger a native, non-blocking  prompt.

- Allows one-click scroll to the bottom: Clicking Go to latest closes the prompt and scrolls to the most recent message.

- Renders only text messages: Filters out non-text messages for a forum-style message flow.

- Displays basic message metadata: Shows sender, timestamp, and content.

   

【index.tsx】
``` typescript
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  useChatContext,
  MessageType,
  MessageListStore,
  type MessageInfo,
  type TextMessagePayload,
} from '@tencentcloud/chat-uikit-react';
import './styles.css';

const NEAR_BOTTOM = 40;

function getMessageText(message: MessageInfo) {
  const payload = (message.messagePayload || {}) as TextMessagePayload;
  if (
    message.messageType === MessageType.Text
    && 'text' in payload
    && typeof payload.text === 'string'
  ) {
    return payload.text;
  }
  return '';
}

function BasicMessageList({ conversationID }: { conversationID: string }) {
  const {
    hasOlderMessages,
    loadMessages,
    loadOlderMessages,
    messageList,
    setActiveConversation,
    messageListOnEvent,
  } = useChatContext();

  const listRef = useRef<HTMLDivElement>(null);
  const keepScrollRef = useRef<number | null>(null);
  const isNearBottomRef = useRef(true);
  const newMessageDialogRef = useRef<HTMLDialogElement>(null);
  const [isViewingHistory, setIsViewingHistory] = useState(false);
  const [showNewMessageToast, setShowNewMessageToast] = useState(false);
  const textMessages = messageList.filter(message => getMessageText(message));
  
  useEffect(() => {
    setActiveConversation(conversationID);
  }, [conversationID]);

  const scrollToBottom = () => {
    const list = listRef.current;
    if (!list) return;
    list.scrollTop = list.scrollHeight;
  };

  const updateScrollState = () => {
    const list = listRef.current;
    if (!list) return;
    const distanceToBottom = list.scrollHeight - list.scrollTop - list.clientHeight;
    const isNearBottom = distanceToBottom < NEAR_BOTTOM;
    isNearBottomRef.current = isNearBottom;
    setIsViewingHistory(!isNearBottom);
  };

  useEffect(() => {
    loadMessages().then(() => requestAnimationFrame(scrollToBottom));
  }, [conversationID, loadMessages]);

  useEffect(() => {
    return onEvent((event) => {
      if (event.type !== 'onReceiveNewMessage') return;
      if (isNearBottomRef.current) {
        requestAnimationFrame(scrollToBottom);
        return;
      }
      setShowNewMessageToast(true);
    });
  }, [onEvent]);

  useEffect(() => {
    const dialog = newMessageDialogRef.current;
    if (!dialog) return;
    if (showNewMessageToast && !dialog.open) {
      dialog.show();
    }
    if (!showNewMessageToast && dialog.open) {
      dialog.close();
    }
  }, [showNewMessageToast]);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;

    if (keepScrollRef.current !== null) {
      list.scrollTop = list.scrollHeight - keepScrollRef.current;
      keepScrollRef.current = null;
      return;
    }

    if (isNearBottomRef.current) {
      scrollToBottom();
    }
  }, [messageList]);

  const handleScroll = () => {
    const list = listRef.current;
    if (!list) return;
    updateScrollState();
    if (list.scrollTop > 0 || !hasOlderMessages) return;

    keepScrollRef.current = list.scrollHeight;
    loadOlderMessages();
  };

  const handleReadNewMessage = () => {
    setShowNewMessageToast(false);
    scrollToBottom();
  };

  return (
    <div className="message-list-basic-demo__body">
      <div className="message-list-basic-demo__status">
        {isViewingHistory ? 'Viewing history' : 'At latest messages'}
      </div>
      <div
        className="message-list-basic-demo__list"
        onScroll={handleScroll}
        ref={listRef}
      >
        {textMessages.map(message => (
          <div
            className="message-list-basic-demo__post"
            key={message.msgID}
          >
            <div className="message-list-basic-demo__post-meta">
              <strong>{message.from?.nickname || message.from?.userID || (message.isSentBySelf ? 'Me' : 'Unknown')}</strong>
              <time>{message.timestamp?.toLocaleString?.() || message.msgID}</time>
            </div>
            <p>{getMessageText(message)}</p>
          </div>
        ))}
      </div>
      <dialog className="message-list-basic-demo__dialog" ref={newMessageDialogRef}>
        <span>New message received.</span>
        <button onClick={handleReadNewMessage} type="button">
          Go to latest
        </button>
      </dialog>
    </div>
  );
}

function MessageListBasicDemo() {
  const [inputConversationID, setInputConversationID] = useState('');
  const [conversationID, setConversationID] = useState('');

  return (
    <div className="message-list-basic-demo">
      <div className="message-list-basic-demo__header">
        <h2>MessageList Basic</h2>
        <p>Basic message list with scroll loading and new-message toast.</p>
      </div>

      <div className="message-list-basic-demo__toolbar">
        <input
          onChange={event => setInputConversationID(event.target.value)}
          placeholder="C2CuserID or GROUPgroupID"
          value={inputConversationID}
        />
        <button
          onClick={() => setConversationID(inputConversationID.trim())}
          type="button"
        >
          Load Messages
        </button>
      </div>

      {conversationID
        ? <BasicMessageList conversationID={conversationID} />
        : <div className="message-list-basic-demo__empty">Enter a conversationID first.</div>}
    </div>
  );
}

```

【styles.css】
``` css
.message-list-basic-demo {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  overflow: hidden;
}

.message-list-basic-demo__header h2 {
  margin: 0 0 8px;
  color: #111827;
  font-size: 22px;
}

.message-list-basic-demo__header p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.message-list-basic-demo__toolbar {
  display: flex;
  gap: 8px;
}

.message-list-basic-demo__toolbar input {
  width: 260px;
  padding: 8px 10px;
  border: 1px solid #d7dce5;
  border-radius: 8px;
}

.message-list-basic-demo__toolbar button {
  padding: 8px 12px;
  border: 1px solid #667eea;
  border-radius: 8px;
  background: #667eea;
  color: #fff;
  cursor: pointer;
}

.message-list-basic-demo__body {
  position: relative;
  flex: 1;
  min-height: 0;
  width: min(760px, 100%);
  display: flex;
  flex-direction: column;
  border: 1px solid #edf0f5;
  border-radius: 12px;
  overflow: hidden;
}

.message-list-basic-demo__status {
  padding: 8px 12px;
  border-bottom: 1px solid #edf0f5;
  background: #f9fafb;
  color: #6b7280;
  font-size: 12px;
}

.message-list-basic-demo__list {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  overflow: auto;
}

.message-list-basic-demo__post {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px 16px;
  border: 1px solid #edf0f5;
  border-radius: 12px;
  background: #fff;
  color: #111827;
}

.message-list-basic-demo__post-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.message-list-basic-demo__post-meta strong {
  color: #374151;
  font-size: 13px;
}

.message-list-basic-demo__post-meta time {
  color: #9ca3af;
  font-size: 12px;
}

.message-list-basic-demo__post p {
  margin: 0;
  color: #111827;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

.message-list-basic-demo__empty {
  width: 420px;
  padding: 32px;
  border: 1px dashed #d7dce5;
  border-radius: 12px;
  color: #6b7280;
  text-align: center;
}

.message-list-basic-demo__dialog {
  z-index: 1000;
  padding: 14px 16px;
  border: 1px solid #d7dce5;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.24);
}

.message-list-basic-demo__dialog[open] {
  display: flex;
  align-items: center;
  gap: 12px;
}

.message-list-basic-demo__dialog button {
  padding: 6px 10px;
  border: 1px solid #667eea;
  border-radius: 8px;
  background: #667eea;
  color: #fff;
  cursor: pointer;
}
```

   Replace with usage of MessageListStore:

   ``` tsx
   function BasicMessageList({ conversationID }: { conversationID: string }) {
     const {
       hasOlderMessages,
       loadMessages,
       loadOlderMessages,
       messageList,
       onEvent,
     } = MessageListStore.create(conversationID);
     
     
     // useEffect(() => {
     //   setActiveConversation(conversationID);
     // }, [conversationID]);
     
     // omitted
   }
   ```
