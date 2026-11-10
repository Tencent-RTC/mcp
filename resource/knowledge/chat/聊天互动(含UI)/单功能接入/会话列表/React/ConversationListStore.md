---
sync_node_id: '155521363400916992'
nav_path:
  - "聊天互动（含 UI）"
  - "单功能接入"
  - "会话列表"
  - "React"
  - "ConversationList Store"
product: "chat"
---
## Overview

ConversationListStore serves as the data access and structure layer for the conversation list, providing unified conversation list functionality for the UI layer. It manages conversation list data, total unread message count, conversation pinning, deletion, Do Not Disturb, marking as unread, drafts, clearing message history, and other conversation-level features.

Lifecycle management for ConversationListStore—including creation, subscription, destruction, and switching the current conversation—is handled by `useChatContext`.

For most use cases, access ConversationListStore properties and methods directly through `useChatContext` instead of manually creating or managing ConversationListStore instances. Only use ConversationListStore directly when you need independent conversation list instances, specialized group lists, floating window isolation, or multi-panel isolation.

## Basic Usage

【index.tsx】
``` tsx
import { useEffect } from 'react';
import {
  ConversationMarkType,
  useChatContext,
} from '@tencentcloud/chat-uikit-react';
import './styles.css';

function ConversationListBasicDemo() {
  const {
    activeConversation,
    clearConversationUnreadCount,
    conversationList,
    loadConversations,
    markConversation,
    setActiveConversation,
    totalUnreadCount,
  } = useChatContext();

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const handleSelectConversation = async (conversationID: string) => {
    setActiveConversation(conversationID);
    await clearConversationUnreadCount(conversationID);
    await markConversation([conversationID], ConversationMarkType.Unread, false);
  };

  return (
    <div className="conversation-list-basic-demo">
      <div className="conversation-list-basic-demo__stat">
        <span>Unread Message Count</span>
        <strong>{totalUnreadCount}</strong>
      </div>
      <div className="conversation-list-basic-demo__list">
        {conversationList.map(conversation => (
          <button
            className={
              activeConversation?.conversationID === conversation.conversationID
                ? 'conversation-list-basic-demo__item conversation-list-basic-demo__item--active'
                : 'conversation-list-basic-demo__item'
            }
            key={conversation.conversationID}
            onClick={() => handleSelectConversation(conversation.conversationID)}
            type="button"
          >
            <span>{conversation.title || conversation.conversationID}</span>
            <small>{conversation.conversationID}</small>
            {conversation.unreadCount > 0 && (
              <em>{conversation.unreadCount}</em>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
```

【style.css】
``` css
.conversation-list-basic-demo {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
  overflow: auto;
  width: 400px;
}

.conversation-list-basic-demo__stat {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  border: 1px solid #edf0f5;
  border-radius: 12px;
  background: #f9fafb;
}

.conversation-list-basic-demo__stat span {
  color: #6b7280;
}

.conversation-list-basic-demo__stat strong {
  color: #111827;
  font-size: 28px;
}

.conversation-list-basic-demo__list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.conversation-list-basic-demo__item {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px 48px 14px 16px;
  border: 1px solid #edf0f5;
  border-radius: 12px;
  background: #fff;
  color: #111827;
  text-align: left;
  cursor: pointer;
}

.conversation-list-basic-demo__item:hover,
.conversation-list-basic-demo__item--active {
  border-color: #667eea;
  background: #eef2ff;
}

.conversation-list-basic-demo__item small {
  color: #6b7280;
}

.conversation-list-basic-demo__item em {
  position: absolute;
  right: 16px;
  top: 50%;
  min-width: 24px;
  padding: 3px 7px;
  border-radius: 999px;
  background: #ff4d4f;
  color: #fff;
  font-style: normal;
  text-align: center;
  transform: translateY(-50%);
}
```

## ConversationListStore

### Data

|Property Name|Type|Description|
|---------|---------|---------|
|conversationList|ConversationInfo[] \| undefined|Conversation list data|
|totalUnreadCount|number|Total unread count|

### Methods

|Method Name|Type|Description|
|---------|---------|---------|
|loadConversations|(option?: ConversationLoadOption) => Promise|Load the conversation list. Supports optional loading parameters.|
|getConversationInfo|(conversationID: string) => Promise|Retrieve conversation details by conversation ID.|
|deleteConversation|(conversationID: string) => Promise|Delete the specified conversation.|
|pinConversation|(conversationID: string, pin: boolean) => Promise|Pin or unpin the specified conversation.|
|markConversation|(conversationIDList: string[], markType: ConversationMarkType, enable: boolean) => Promise|Set or unset a specific mark for multiple conversations.|
|setReceiveMessageOpt|(conversationID: string, opt: ReceiveMessageOption) => Promise|Set the message receiving option for the specified conversation.|
|setConversationDraft|(conversationID: string, draft: string) => Promise|Set the draft content for the specified conversation.|
|clearConversationMessages|(conversationID: string) => Promise|Clear the message history for the specified conversation.|
|clearConversationUnreadCount|(conversationID: string) => Promise|Clear the unread count for the specified conversation.|

### Usage Example

This example shows how to use ConversationListStore for basic conversation list operations: loading conversations, displaying total unread count, selecting a conversation and clearing unread, pinning/unpinning, and starting a C2C conversation.

【index.tsx】
``` typescript
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ConversationListStore,
  ConversationMarkType,
  type ConversationInfo,
} from '@tencentcloud/chat-uikit-react';
import './styles.css';

function formatTime(conversation: ConversationInfo) {
  const timestamp = conversation.lastMessage?.timestamp;
  if (!timestamp) {
    return '';
  }
  return timestamp.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getLastMessageText(conversation: ConversationInfo) {
  const payload = conversation.lastMessage?.messagePayload;
  if (payload && 'text' in payload && typeof payload.text === 'string') {
    return payload.text;
  }
  return conversation.draft ? `[Draft] ${conversation.draft}` : 'No messages yet';
}

function ConversationListStoreBasicDemo() {
  const {
    clearConversationUnreadCount,
    conversationList,
    getConversationInfo,
    hasMoreConversations,
    loadConversations,
    loadMoreConversations,
    markConversation,
    pinConversation,
    totalUnreadCount,
  } = ConversationListStore.create();

  const [activeConversationID, setActiveConversationID] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  const activeConversation = useMemo(() => {
    return conversationList.find(conversation => conversation.conversationID === activeConversationID);
  }, [activeConversationID, conversationList]);

  const handleLoadConversations = useCallback(async () => {
    setLoading(true);
    setActionError('');
    try {
      await loadConversations();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, [loadConversations]);

  useEffect(() => {
    void handleLoadConversations();
  }, [handleLoadConversations]);

  const handleSelectConversation = async (conversationID: string) => {
    setActiveConversationID(conversationID);
    setActionError('');
    try {
      await clearConversationUnreadCount(conversationID);
      await markConversation([conversationID], ConversationMarkType.Unread, false);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Failed to select conversation');
    }
  };

  const handleTogglePin = async (conversation: ConversationInfo) => {
    setActionError('');
    try {
      await pinConversation(conversation.conversationID, !conversation.isPinned);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Failed to update pin status');
    }
  };

  const handleLoadMore = async () => {
    setActionError('');
    try {
      await loadMoreConversations();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Failed to load more conversations');
    }
  };

  const handleStartC2CConversation = async () => {
    const normalizedUserID = window.prompt('Enter user ID')?.trim();
    if (!normalizedUserID) {
      return;
    }

    setActionError('');
    try {
      const conversation = await getConversationInfo(`C2C${normalizedUserID}`);
      setActiveConversationID(conversation.conversationID);
      await loadConversations();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Failed to start C2C conversation');
    }
  };

  return (
    <div className="conversation-list-store-basic-demo">
      <div className="conversation-list-store-basic-demo__header">
        <div>
          <h2>ConversationListStore Basic</h2>
          <p>Use ConversationListStore.create() to build a custom conversation list.</p>
        </div>
        <div className="conversation-list-store-basic-demo__actions">
          <button
            className="conversation-list-store-basic-demo__refresh"
            onClick={handleStartC2CConversation}
            type="button"
          >
            Start C2C
          </button>
          <button
            className="conversation-list-store-basic-demo__refresh"
            disabled={loading}
            onClick={handleLoadConversations}
            type="button"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      <div className="conversation-list-store-basic-demo__stats">
        <span>Total unread</span>
        <strong>{totalUnreadCount}</strong>
      </div>

      {actionError && (
        <div className="conversation-list-store-basic-demo__error">{actionError}</div>
      )}

      <div className="conversation-list-store-basic-demo__layout">
        <div className="conversation-list-store-basic-demo__list">
          {conversationList.map(conversation => (
            <article
              className={
                activeConversationID === conversation.conversationID
                  ? 'conversation-list-store-basic-demo__item conversation-list-store-basic-demo__item--active'
                  : 'conversation-list-store-basic-demo__item'
              }
              key={conversation.conversationID}
            >
              <button
                className="conversation-list-store-basic-demo__main"
                onClick={() => handleSelectConversation(conversation.conversationID)}
                type="button"
              >
                <span className="conversation-list-store-basic-demo__avatar">
                  {(conversation.title || conversation.conversationID).slice(0, 1).toUpperCase()}
                </span>
                <span className="conversation-list-store-basic-demo__content">
                  <span className="conversation-list-store-basic-demo__row">
                    <strong>{conversation.title || conversation.conversationID}</strong>
                    <time>{formatTime(conversation)}</time>
                  </span>
                  <span className="conversation-list-store-basic-demo__message">
                    {getLastMessageText(conversation)}
                  </span>
                  <small>{conversation.conversationID}</small>
                </span>
              </button>

              <div className="conversation-list-store-basic-demo__meta">
                {conversation.unreadCount > 0 && (
                  <em>{conversation.unreadCount}</em>
                )}
                <button
                  className={
                    conversation.isPinned
                      ? 'conversation-list-store-basic-demo__pin conversation-list-store-basic-demo__pin--active'
                      : 'conversation-list-store-basic-demo__pin'
                  }
                  onClick={() => handleTogglePin(conversation)}
                  type="button"
                >
                  {conversation.isPinned ? 'Unpin' : 'Pin'}
                </button>
              </div>
            </article>
          ))}

          {conversationList.length === 0 && !loading && (
            <div className="conversation-list-store-basic-demo__empty">No conversations</div>
          )}

          {hasMoreConversations && (
            <button
              className="conversation-list-store-basic-demo__load-more"
              onClick={handleLoadMore}
              type="button"
            >
              Load more
            </button>
          )}
        </div>

        <aside className="conversation-list-store-basic-demo__detail">
          <span>Selected conversation</span>
          <strong>{activeConversation?.title || activeConversationID || 'None'}</strong>
          <small>{activeConversation?.conversationID || 'Click a conversation to clear unread count.'}</small>
        </aside>
      </div>
    </div>
  );
}
```

【index.css】
``` css
.conversation-list-store-basic-demo {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 24px;
  overflow: hidden;
}

.conversation-list-store-basic-demo__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.conversation-list-store-basic-demo__header h2 {
  margin: 0 0 8px;
  color: #111827;
  font-size: 22px;
}

.conversation-list-store-basic-demo__header p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.5;
}

.conversation-list-store-basic-demo__refresh,
.conversation-list-store-basic-demo__load-more,
.conversation-list-store-basic-demo__pin {
  border: 1px solid #d7dce5;
  border-radius: 999px;
  background: #fff;
  color: #374151;
  cursor: pointer;
}

.conversation-list-store-basic-demo__refresh {
  padding: 8px 14px;
}

.conversation-list-store-basic-demo__refresh:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.conversation-list-store-basic-demo__actions {
  display: flex;
  gap: 8px;
}

.conversation-list-store-basic-demo__stats {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 360px;
  padding: 16px 18px;
  border: 1px solid #edf0f5;
  border-radius: 12px;
  background: #f9fafb;
}

.conversation-list-store-basic-demo__stats span {
  color: #6b7280;
}

.conversation-list-store-basic-demo__stats strong {
  color: #111827;
  font-size: 26px;
}

.conversation-list-store-basic-demo__error {
  width: 360px;
  padding: 10px 12px;
  border: 1px solid #fecaca;
  border-radius: 10px;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 13px;
}

.conversation-list-store-basic-demo__layout {
  flex: 1;
  min-height: 0;
  display: flex;
  gap: 18px;
}

.conversation-list-store-basic-demo__list {
  width: 420px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow: auto;
}

.conversation-list-store-basic-demo__item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border: 1px solid #edf0f5;
  border-radius: 14px;
  background: #fff;
}

.conversation-list-store-basic-demo__item:hover,
.conversation-list-store-basic-demo__item--active {
  border-color: #667eea;
  background: #eef2ff;
}

.conversation-list-store-basic-demo__main {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  text-align: left;
  cursor: pointer;
}

.conversation-list-store-basic-demo__avatar {
  width: 40px;
  height: 40px;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: #667eea;
  color: #fff;
  font-weight: 700;
}

.conversation-list-store-basic-demo__content {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.conversation-list-store-basic-demo__row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.conversation-list-store-basic-demo__row strong,
.conversation-list-store-basic-demo__message,
.conversation-list-store-basic-demo__content small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.conversation-list-store-basic-demo__row strong {
  color: #111827;
  font-size: 14px;
}

.conversation-list-store-basic-demo__row time,
.conversation-list-store-basic-demo__content small {
  color: #9ca3af;
  font-size: 12px;
}

.conversation-list-store-basic-demo__message {
  color: #6b7280;
  font-size: 13px;
}

.conversation-list-store-basic-demo__meta {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.conversation-list-store-basic-demo__meta em {
  min-width: 22px;
  padding: 2px 7px;
  border-radius: 999px;
  background: #ff4d4f;
  color: #fff;
  font-size: 12px;
  font-style: normal;
  text-align: center;
}

.conversation-list-store-basic-demo__pin {
  padding: 4px 9px;
  font-size: 12px;
}

.conversation-list-store-basic-demo__pin--active {
  border-color: #667eea;
  background: #667eea;
  color: #fff;
}

.conversation-list-store-basic-demo__empty,
.conversation-list-store-basic-demo__detail {
  border: 1px dashed #d7dce5;
  border-radius: 14px;
  color: #6b7280;
}

.conversation-list-store-basic-demo__empty {
  padding: 28px;
  text-align: center;
}

.conversation-list-store-basic-demo__load-more {
  padding: 10px 14px;
}

.conversation-list-store-basic-demo__detail {
  width: 260px;
  height: fit-content;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 18px;
  background: #f9fafb;
}

.conversation-list-store-basic-demo__detail span {
  color: #6b7280;
  font-size: 13px;
}

.conversation-list-store-basic-demo__detail strong {
  color: #111827;
  font-size: 18px;
}

.conversation-list-store-basic-demo__detail small {
  color: #6b7280;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .conversation-list-store-basic-demo {
    overflow: auto;
  }

  .conversation-list-store-basic-demo__header,
  .conversation-list-store-basic-demo__layout {
    flex-direction: column;
  }

  .conversation-list-store-basic-demo__stats,
  .conversation-list-store-basic-demo__error,
  .conversation-list-store-basic-demo__list,
  .conversation-list-store-basic-demo__detail {
    width: 100%;
  }
}

```
