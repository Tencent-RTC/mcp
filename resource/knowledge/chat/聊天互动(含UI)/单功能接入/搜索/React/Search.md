---
sync_node_id: '183333399361191936'
nav_path:
  - "聊天互动（含 UI）"
  - "单功能接入"
  - "搜索"
  - "React"
  - "Search"
product: "chat"
---
## Component Overview

Search is a complete search solution with a full set of components, including search bar, result display, advanced search, and other features. It is suitable for user, group, and message search in instant messaging, online meeting, and online education scenarios.

> **Note:**
> Note: This feature belongs to VAS. You need to purchase cloud search plugin. Please click [purchase](https://console.trtc.io/chat/plugin/TUICloudSearch).
> 

## Search Mode
| <strong>Mini Mode</strong> | <strong>Standard Mode</strong> | <strong>Embedded Mode</strong> |
| --- | --- | --- |
| - Suitable for sidebar or small container<br>- Display finite number of results<br>- Support expand to view more | - Suitable for full-screen search UI<br>- Feature demonstration<br>- Advanced Search Support | - Suitable for chat UI<br>- Focus on message search<br>- Optimized layout |
|  |  |  |

## Props

|Attribute Name|Type|Default Value|Description|
|---------|---------|---------|---------|
|variant|VariantType|VariantType.MINI|Search mode: mini, standard, embedded|
|className|string|-|Custom style class name|
|style|React.CSSProperties|-|custom style|
|onKeywordChange|(keyword: string) => void|-|search keyword change callback|
|onResultItemClick|(result: object) => void|-|search result click callback|

## Basic Usage
``` typescript
import { Search, VariantType } from '@tencentcloud/chat-uikit-react';

function App() {
  return (
    <Search variant={VariantType.MINI} />
  );
}
```

## FAQs

### How to Customize the Search Result Display Format

A: The search component does not support customization; however, you can use SearchStore to implement your own search component.
