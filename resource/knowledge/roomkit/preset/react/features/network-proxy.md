The Conference SDK is built on Tencent Cloud Chat (IM) and Tencent Real-Time Communication (TRTC). It supports configuring the IM and TRTC proxies together in intranet / firewall environments, which is suitable for scenarios such as private deployment and enterprise intranet isolation where a direct connection to Tencent Cloud services is not available.

## Proxy architecture

|Proxy server|Proxy link|
|---------|---------|
|IM proxy|Proxies the signaling channels for IM login, message sending/receiving, etc. (WebSocket), as well as the upload and download of resources such as chat images and files.|
|TRTC WebSocket proxy (e.g. Nginx)|Proxies the signaling channels for TRTC room entry, control, etc. (WebSocket), and is responsible for room management and user state synchronization.|
|TRTC TURN Server|Relays TRTC audio and video media streams.|

> **Note:**
> The proxy servers (IM proxy, Nginx, TURN) need to be deployed by yourself. For how to set them up, see [TRTC Web SDK handling firewall restrictions](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/zh-cn/tutorial-34-advanced-proxy.html).
>

## API and parameters

The Conference SDK allows you to configure the intranet proxy uniformly through the `callExperimentalAPI` interface before calling `login()`:
``` typescript
callExperimentalAPI({
  api: 'setNetworkProxy',
  params: {
    im?: { /* IM proxy parameters */ },
    rtc?: { /* TRTC proxy parameters */ },
  },
});
```

### IM proxy parameters

|Parameter|Type|Description|
|---------|---------|---------|
|`proxyServer`|String|IM signaling WebSocket proxy address.|
|`fileUploadProxy`|String|IM file upload proxy address.|
|`fileDownloadProxy`|String|IM file download proxy address.|

### TRTC proxy parameters

|Parameter|Type|Description|
|---------|---------|---------|
|`websocketProxy`|String|TRTC signaling WebSocket proxy address, e.g. `wss://proxy.example.com/ws/`.|
|`turnServer`|Array|List of TURN servers. Each item contains `url` / `username` / `credential`.|
|`iceTransportPolicy`|`'relay' \| 'all'`|Client-side ICE transport policy. In an intranet environment, it is recommended to set it to `'relay'` to force a connection to the TURN server.|

## Sample code

``` typescript
import { conference } from '@tencentcloud/roomkit-web-react';

conference.callExperimentalAPI({
  api: 'setNetworkProxy',
  params: {
    im: {
      proxyServer: 'wss://proxy.example.com:8080',
      fileUploadProxy: 'https://proxy.example.com:8080',
      fileDownloadProxy: 'https://proxy.example.com:8080',
    },
    rtc: {
      websocketProxy: 'wss://proxy.example.com/ws/',
      turnServer: [
        { url: '14.3.3.3:3478', username: 'turn', credential: 'turn' },
      ],
      iceTransportPolicy: 'relay',
    },
  },
});

await conference.login({ sdkAppId, userId, userSig });
await conference.createAndJoinRoom({ roomId });
```

## FAQs

### A user can join the conference normally on the public network, but cannot join it on the intranet?

Check whether `setNetworkProxy` was called before `login()`. If it is already configured but still fails, check the TURN port and the outbound allowlist of the proxy server.

### A user can join the conference but cannot see the remote video or hear the remote audio?

Confirm that `turnServer` is reachable, and set `iceTransportPolicy` to `'relay'` in an intranet environment.
