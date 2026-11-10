---
sync_node_id: '203542922692079616'
nav_path:
  - "直播与语聊 SDK"
  - "UI 组件库"
  - "礼物组件"
  - "礼物组件（Web React）"
product: "live"
---
This guide shows you how to integrate the **LiveGift** component from **TUILiveKit** into your React web application for desktop browsers.

## Core Features

|**Feature**|**Description**|
|---------|---------|
|Gift List|Displays your configured gift list. Click "More" to view the complete catalog.|
|Gift Sending|Selects a gift from the list and click to send. Sent gifts appear as messages in the chat.|
|Gift Playback|Supports SVG 2D, SVG 3D, and MP4 video formats. 3D gifts can play in full-screen mode.|

## Integration Steps

### Step 1: Prerequisites

Before quick integration, you need to .

> **Note：**
> To use the gifting system, activate either the **Free Trial,** or **Pro** edition. The number of configurable gifts depends on the selected package. For details, see the **Gift System** section in Feature and Billing Description and choose the package that fits your needs.
> 

### Step 2: Install Dependencies

【npm】
``` bash
npm install tuikit-atomicx-react @tencentcloud/uikit-base-component-react --save
```

【pnpm】
``` bash
pnpm install tuikit-atomicx-react @tencentcloud/uikit-base-component-react
```

【yarn】
``` bash
yarn add tuikit-atomicx-react @tencentcloud/uikit-base-component-react
```

### Step 3: Integrate Live Gift Component

Import and use the **live gift component** in your project. You can directly copy the following example code into your project to implement **gift list, send gifts, and 3D gift playback**.

【GiftPanel.tsx】
``` tsx
import React from "react";
import { LiveGift } from "tuikit-atomicx-react";
import styles from "./GiftPanel.module.scss";
const GiftPanel: React.FC = () => {
  return (
    <div className={styles.livePlayer__giftPanel}>
      <LiveGift />
    </div>
  )
};

export default GiftPanel;

```

【GiftPanel.module.scss】
``` scss
.livePlayer__giftPanel{
  width: 100%;
  height: 130px;
  flex-shrink: 0;
  border-top: 1px solid var(--uikit-stroke-color-primary);
  background: var(--uikit-bg-color-operate);
}

```

### Step 4: Import Default Gifts

Your newly applied application does not have any gifts configured in the gift backend by default. Therefore, your gift sending panel will be empty by default after integration. To allow you to quickly experience our gift sending and receiving effects, you can use the server-side API to import the gift materials we have pre-configured for you with one click.

## Next Steps

After completing the above UI integration, you have implemented the client-side gift display capability. To build a complete commercial gift feature, you also need to
- **Custom Gift Configuration**: Upload custom gift icons and animation files via server-side API and set prices.

- **Gift Deduction Callback**: Configure a callback URL to forward gift requests to your billing backend for balance verification and deduction.

- **PK Score Integration**: In host PK scenarios, convert gift values to PK scores in real-time.

- **Analytics**: Access gift-sending records, total values, and other operational data.

- **Upgrade Animation SDK**: If SVGA doesn't meet your needs, integrate an advanced player that supports MP4/PAG and other high-definition transparent animations.
