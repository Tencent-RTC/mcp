---
sync_node_id: '140196525869285376'
nav_path:
  - "视频通话 SDK"
  - "更多特性"
  - "监听通话状态"
  - "Web&H5"
product: "call"
---
This article describes how to use call status callbacks with the TUICallKit component.

## Call State Monitoring

If your business requires **monitoring the call status**, such as events during the call process ( TUICallEvent for details), you can
``` javascript
import { TUICallEvent } from '@trtc/call-engine-lite-js';

let handleUserEnter = function(event) {
    console.log('TUICallEvent.USER_ENTER: ', event);
};

TUICallKitAPI.getTUICallEngineInstance().on(TUICallEvent.USER_ENTER, handleUserEnter);
TUICallKitAPI.getTUICallEngineInstance().off(TUICallEvent.USER_ENTER, handleUserEnter);
```

## Component Callback Event

The TUICallKit component offers call status callbacks, which can be used to implement more interaction logic on the business side. Please .
- `beforeCalling`: Executed prior to the commencement of the call.

- `afterCalling`: Executed upon the completion of the call.

   

【React】
``` tsx
function App() {
  const handleBeforeCalling = () => {
    console.log("[TUICallKit Demo] beforeCalling");
  };
  const handleAfterCalling = () => {
    console.log("[TUICallKit Demo] afterCalling");
  };
  return (
    <TUICallKit 
      beforeCalling={handleBeforeCalling} 
      afterCalling={handleAfterCalling} />
  )
}
```

【Vue】
``` javascript
<template>
  <TUICallKit 
    :beforeCalling="handleBeforeCalling" 
    :afterCalling="handleAfterCalling" />
</template>
<script setup>
function handleBeforeCalling() {
  console.log("[TUICallKit Demo] beforeCalling");
}
function handleAfterCalling() {
  console.log("[TUICallKit Demo] afterCalling");
}
</script>
```
