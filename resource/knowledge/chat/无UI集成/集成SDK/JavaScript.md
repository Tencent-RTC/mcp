---
sync_node_id: '108053236271325184'
nav_path:
  - "无 UI 集成"
  - "集成SDK"
  - "JavaScript"
product: "chat"
---
## Overview

This guide provides step-by-step instructions for integrating the TRTC Chat SDK V4 (`@tencentcloud/lite-chat`) into your web application.

> **V3 User Upgrade Notice:**
> 
> If you prefer to continue using the V3 SDK, refer to SDK Integration.
> 

## Version Overview
| Edition | Size | Feature Overview |
| --- | --- | --- |
| Basic Edition | 200 KB | - Initialization and event listening.<br>- Login and logout.<br>- Supports sending and receiving text messages.<br>- Supports sending and receiving custom messages (customizable content).<br>- Supports User Profile and user status. |
| Standard Edition (default) | 516 KB | <strong>Includes all Basic Edition features, plus:</strong><br>- Supports retrieving historical messages, message operations, merged forwarding, read receipts, Message Extension, and more.<br>- Supports sending and receiving images, video, audio, and file messages.<br>- Supports searching Cloud messages (Message), users (User), groups (Group), and group members.<br>- Supports conversation list, conversation profile, and conversation operations.<br>- Supports Group Management and group member management.<br>- Supports Community.<br>- Supports AVChatRoom. |
| Professional Edition | 609 KB | <strong>Includes all Standard Edition features, plus:</strong><br>- Supports blacklist, friend management, and friend grouping.<br>- Supports follow and fan features.<br>- Supports conversation grouping.<br>- Supports topics. |

## npm Integration

Install the required dependency in your project using npm.
``` javascript
npm install @tencentcloud/lite-chat
```

``` javascript
// If you experience issues syncing dependencies, try switching the npm registry and run again
npm config set registry http://r.cnpmjs.org/
```

## Importing the SDK

The V4 SDK lets you import the Basic Edition, Standard Edition, or Professional Edition according to your application's needs for optimal bundle size.
``` javascript
// Standard Edition (default import, recommended)
import TencentCloudChat from '@tencentcloud/lite-chat';

// Basic Edition (core chat and user management, smallest bundle size)
// import TencentCloudChat from '@tencentcloud/lite-chat/basic';

// Professional Edition (includes social features such as friend relationship chain)
// import TencentCloudChat from '@tencentcloud/lite-chat/professional';
```

Next, initialize the SDK.

## Related Resources
- SDK Release Notes

- [SDK APIs](https://trtc.io/document/33999)
