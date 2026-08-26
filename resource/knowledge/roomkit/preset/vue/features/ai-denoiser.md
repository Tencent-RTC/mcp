AI noise cancellation is powered by the AI algorithms from Tencent's Tianlai Lab. It can intelligently detect and remove noise interference mixed into the transmitted signal, thereby significantly improving voice quality, enhancing sound clarity, and improving the listening experience. Applying the AI noise cancellation feature in TUIRoomKit lets users get a clear and stable audio experience in various environments such as offices, internet cafes, shopping malls, and outdoors.

## Online experience

You can also enter our [Real-Time Communication Experience Center](https://rtcube.cloud.tencent.com/component/experience-center/index.html#/detail) to experience the excellent sound quality delivered by the AI noise cancellation capability online.

#

## Enabling AI noise cancellation

TUIRoomKit provides a very convenient activation process. You only need two steps to try it out:
1. Go to the Real-Time Communication console and select the application you want to enable it for.

2. Go to Value-added Features and turn on the AI noise cancellation switch.

   Then you can enjoy the better noise cancellation of TUIRoomKit in your application!

## Web asset configuration

TUIRoomKit automatically enables AI noise cancellation after the user joins the room, provided that you have completed the following asset configuration:
1. Publish the `denoiser-wasm.js` file located in the `node_modules/trtc-sdk-v5/plugins/ai-denoiser` directory to a CDN or static resource server, and make sure the files are under the same public path. For details, see the [AI noise cancellation plugin documentation](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/zh-cn/tutorial-35-advanced-ai-denoiser.html).

2. Before joining the room, call the following interface to pass the public path above to TUIRoomKit:

【With UI integration】

【Vue3】
``` typescript
import { conference } from '@tencentcloud/roomkit-web-vue3';

conference.callExperimentalAPI({
  api: 'setRtcAssetsPath',
  params: { assetsPath: 'XXXXX/assets/' }, // Directory path where the denoiser-wasm.js file is located
});
```

【React】
``` typescript
import { conference } from '@tencentcloud/roomkit-web-react';

conference.callExperimentalAPI({
  api: 'setRtcAssetsPath',
  params: { assetsPath: 'XXXXX/assets/' }, // Directory path where the denoiser-wasm.js file is located
});
```

【Without UI integration】

【Vue3】
``` typescript
import { callExperimentalAPI } from 'tuikit-atomicx-vue3';

callExperimentalAPI({
  api: 'setRtcAssetsPath',
  params: { assetsPath: 'XXXXX/assets/' }, // Directory path where the denoiser-wasm.js file is located
});
```

【React】
``` typescript
import { callExperimentalAPI } from 'tuikit-atomicx-react';

callExperimentalAPI({
  api: 'setRtcAssetsPath',
  params: { assetsPath: 'XXXXX/assets/' }, // Directory path where the denoiser-wasm.js file is located
});
```
