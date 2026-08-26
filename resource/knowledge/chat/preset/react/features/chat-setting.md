## Component Overview

`ChatSetting` is an intelligent chat settings component that can automatically render the appropriate settings interface based on the currently activated session type. This component internally integrates two modes: C2C (one-on-one) chat settings and group chat settings, providing users with a uniform chat settings portal.

Core features of components:
- **Automatic adaptation** - The settings interface is automatically switched based on session type

- **Status-driven** - Auto-update content based on the current active session status

## Props Parameters

|Parameter|Type|Default Value|Description|
|---------|---------|---------|---------|
|className|string \| undefined|undefined|Custom CSS class name|
|style|React.CSSProperties \| undefined|undefined|Custom inline style|

## Quick Usage

`ChatSetting` is an independent component that can be used freely. By default, the switch control is on the ChatHeader Component. Alternatively use the useUIOpenControlState Hook to customize the ChatSetting switch.
``` typescript
import { useState } from 'react';
import {
  ChatSetting,
  Search,
  useChatContext,
  VariantType,
} from '@tencentcloud/chat-uikit-react';
import './styles.css';

function ChatSidePanelsBasicDemo() {
  const [isChatSettingShow, setIsChatSettingShow] = useState(false);
  const [isSearchShow, setIsSearchShow] = useState(false);
  const [targetID, setTargetID] = useState('');
  const [conversationType, setConversationType] = useState<'C2C' | 'GROUP'>('C2C');
  const { activeConversationID, setActiveConversation } = useChatContext();

  const handleActivateConversation = () => {
    const normalizedID = targetID.trim();
    if (!normalizedID) {
      return;
    }
    setActiveConversation(`${conversationType}${normalizedID}`);
  };

  return (
    <div className="chat-side-panels-basic-demo">
      <div className="chat-side-panels-basic-demo__header">
        <h2>Chat Side Panels</h2>
        <p>Activate a conversation, then open or close ChatSetting and Search.</p>
      </div>

      <div className="chat-side-panels-basic-demo__frame">
        <div className="chat-side-panels-basic-demo__actions">
          <input
            onChange={event => setTargetID(event.target.value)}
            placeholder="User ID or group ID"
            value={targetID}
          />
          <select
            onChange={event => setConversationType(event.target.value as 'C2C' | 'GROUP')}
            value={conversationType}
          >
            <option value="C2C">C2C</option>
            <option value="GROUP">GROUP</option>
          </select>
          <button onClick={handleActivateConversation} type="button">
            Activate Conversation
          </button>
          <span className="chat-side-panels-basic-demo__active">
            Active: {activeConversationID || 'None'}
          </span>
          <button
            onClick={() => setIsChatSettingShow(show => !show)}
            type="button"
          >
            {isChatSettingShow ? 'Hide Setting' : 'Show Setting'}
          </button>
          <button
            onClick={() => setIsSearchShow(show => !show)}
            type="button"
          >
            {isSearchShow ? 'Hide Search' : 'Show Search'}
          </button>
        </div>

        {isChatSettingShow && (
          <div className="chat-side-panels-basic-demo__panel">
            <ChatSetting />
          </div>
        )}

        {isSearchShow && (
          <div className="chat-side-panels-basic-demo__panel">
            <Search variant={VariantType.EMBEDDED} />
          </div>
        )}
      </div>
    </div>
  );
}
```
