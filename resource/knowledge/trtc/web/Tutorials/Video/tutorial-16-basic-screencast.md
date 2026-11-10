---
sync_node_id: 'https://web.sdk.qcloud.com/trtc/webrtc/doc/en/tutorial-16-basic-screencast.md'
nav_path:
  - "Tutorials"
  - "Video"
product: "trtc"
---

## Function Description

This article mainly introduces how to implement screen sharing function in TRTC Web SDK.

## Run Demo

<div style="margin: 20px 0;">
<details class="trtc-demo-details" style="border-radius: 10px; border: 1px solid #e5e6eb; overflow: hidden; box-shadow: 0 4px 14px rgba(0,82,217,0.08); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <summary style="padding: 14px 22px; background: linear-gradient(135deg, #006eff 0%, #0052d9 100%); color: #fff; font-size: 15px; font-weight: 600; cursor: pointer; list-style: none; user-select: none; display: flex; align-items: center; gap: 10px; transition: filter 0.2s;">
    <span class="trtc-demo-arrow" style="font-size: 14px; opacity: 0.9;">▶</span>
    <span class="trtc-demo-summary-text">Click to Run Demo</span>
  </summary>
  <div style="padding: 16px; background: #fff;">
<script>
(function(){var t=null;window.addEventListener('message',function(e){if(e.data&&e.data.type==='trtc-demo-resize'){var f=document.querySelector('.trtc-demo-iframe');if(f){f.style.height=e.data.height+'px';clearTimeout(t);t=setTimeout(function(){f.style.height=e.data.height+'px'},200)}}})})();
document.querySelectorAll('.trtc-demo-details').forEach(function(d){d.addEventListener('toggle',function(){var s=d.querySelector('.trtc-demo-summary-text'),a=d.querySelector('.trtc-demo-arrow');if(d.open){s&&(s.textContent='Click to Close Demo');a&&(a.textContent='▼')}else{s&&(s.textContent='Click to Run Demo');a&&(a.textContent='▶')}})});
</script>
    <iframe allow="microphone; camera; display-capture;" class="trtc-demo-iframe" style="width:100%;border:none;min-height:700px" title="Screen Sharing" src="https://web.sdk.qcloud.com/trtc/webrtc/v5/demo/samples/basic-features/screen-sharing/index.html?lang=en" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true"></iframe>
  </div>
</details>
</div>

## Implementation Process

1. Start Local Screen Sharing

    ```js
    const trtcA = TRTC.create();
    await trtcA.enterRoom({
      scene: 'rtc',
      sdkAppId: 140000000, // Fill in your sdkAppId
      userId: 'userA', // Fill in your userId
      userSig: 'userA_sig', // Fill in userSig corresponding to userId
      roomId: 6969
    })
    await trtcA.startScreenShare();
    ```

2. Play Remote Screen Sharing

    ```js
    const trtcB = TRTC.create();
    trtcB.on(TRTC.EVENT.REMOTE_VIDEO_AVAILABLE, ({ userId, streamType }) => {
      // Main video stream, generally the stream pushed by the camera
      if (streamType === TRTC.TYPE.STREAM_TYPE_MAIN) {
        // 1. Place a div tag with an id of `${userId}_main` on the page to play the main stream in the div tag. The business side can customize the id of the div tag. This is just an example.
        // 2. Play the main video stream
        trtcB.startRemoteVideo({ userId, streamType,  view: `${userId}_main` });
      } else {
        // Sub video stream, generally the stream pushed by screen sharing.
        // 1. Place a div tag with an id of `${userId}_screen` on the page to play the screen sharing in the div tag. The business side can customize the id of the div tag. This is just an example.
        // 2. Play screen sharing
        trtcB.startRemoteVideo({ userId, streamType, view: `${userId}_screen` });
      }
    });

    await trtcB.enterRoom({
      scene: 'rtc',
      sdkAppId: 140000000, // Fill in your sdkAppId
      userId: 'userB', // Fill in your userId
      userSig: 'userB_sig', // Fill in userSig corresponding to userId
      roomId: 6969
    })
    ```

3. Start Camera + Screen Sharing at the Same Time

    ```js
     await trtcA.startLocalVideo();
     await trtcA.startScreenShare();
    ```

4. Screen Sharing + System Audio

    System audio capture:
    - Chrome M74+ supports capturing **tab audio**.
    - Capturing **system audio (entire OS sound)**:
      - **Windows / Chrome OS**: Supported.
      - **macOS**: Requires Chrome 141+ and macOS 14.2+.
      - **Linux**: Not supported.
    - Other browsers (Firefox, Safari, etc.) are not supported.

    ```js
     await trtcA.startScreenShare({ option: { systemAudio: true }});
    ```

    Check `Share audio` in the pop-up dialog box, and the system audio will be mixed with the local microphone and published. Other users in the room will receive the {@link module:EVENT.REMOTE_AUDIO_AVALIABLE TRTC.EVENT.REMOTE_AUDIO_AVALIABLE} event.

    

5. Stop Screen Sharing

    ```javascript
     // Stop screen sharing collection and publishing
     await trtcA.stopScreenShare();

     // Other users in the room will receive the TRTC.EVENT.REMOTE_VIDEO_UNAVAILABLE event, and streamType is TRTC.TYPE.STREAM_TYPE_SUB.
     trtcB.on(TRTC.EVENT.REMOTE_VIDEO_UNAVAILABLE, ({ userId, streamType }) => {
        if (streamType === TRTC.TYPE.STREAM_TYPE_SUB) {
          
        }
     })
    ```

    In addition, users may also stop screen sharing through the browser's own button, so the screen sharing stream needs to listen for the screen sharing stop event and respond accordingly.
    

    ```javascript
    // Listen for screen sharing stop event
    trtcA.on(TRTC.EVENT.SCREEN_SHARE_STOPPED, () => {
      console.log('screen sharing was stopped');
    });
    ```

### Common issue
1. How to determine whether the user has successfully shared system audio?

    After screen sharing starts, you can call `trtc.getAudioTrack({ streamType: TRTC.TYPE.STREAM_TYPE_SUB })` to get the screen sharing audio track. If it returns `null`, the user did not share audio in the picker.

## Screen sharing in Electron

### Option 1: Use `getDisplayMedia` directly (Electron 22+, recommended)

Starting from [Electron 22](https://releases.electronjs.org/release/v22.0.0), Electron supports the WebRTC standard `getDisplayMedia` interface. Unlike Chrome browser, Electron requires the following configuration in the main process. Once configured, the renderer can call `trtc.startScreenShare()` just like in a browser.

**1. Main process configuration**

```js
// main.js
const { app, BrowserWindow, session, desktopCapturer } = require('electron');

// macOS: Enable system audio loopback (must be set before app.whenReady())
if (process.platform === 'darwin') {
  app.commandLine.appendSwitch('enable-features', 'MacLoopbackAudioForScreenShare,MacSckSystemAudioLoopbackOverride');
}

app.whenReady().then(async () => {
  // ① Grant media (camera/microphone) and display-capture (screen share) permissions
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    callback(['media', 'display-capture'].includes(permission));
  });

  // ② Register getDisplayMedia request handler to provide screen share sources
  //    Returning audio: 'loopback' also captures system audio (see "System audio" below)
  session.defaultSession.setDisplayMediaRequestHandler((request, callback) => {
    desktopCapturer.getSources({
      types: ['screen', 'window'],
      thumbnailSize: { width: 320, height: 180 },
    }).then((sources) => {
      if (sources.length <= 1) {
        callback({ video: sources[0], audio: 'loopback' });
      } else {
        // Show a custom picker window when multiple sources exist
        showSourcePicker(sources, callback);
      }
    }).catch(() => callback({}));
  });
});

// Show a custom picker window when multiple screen/window sources exist
function showSourcePicker(sources, callback) {
  const { ipcMain } = require('electron');
  const pickerWin = new BrowserWindow({
    width: 800, height: 600, modal: true, title: 'Select what to share',
    webPreferences: { nodeIntegration: true, contextIsolation: false },
  });

  const selectHandler = (event, sourceId) => {
    const source = sources.find(s => s.id === sourceId);
    ipcMain.removeListener('source-selected', selectHandler);
    pickerWin.destroy();
    callback(source ? { video: source, audio: 'loopback' } : {});
  };
  ipcMain.on('source-selected', selectHandler);
  pickerWin.on('closed', () => callback({}));

  const html = sources.map(s => `
    <div onclick="require('electron').ipcRenderer.send('source-selected', '${s.id}')"
         style="cursor:pointer;padding:12px;border:1px solid #ccc;margin:8px;">
      
      <div>${s.name}</div>
    </div>`).join('');
  pickerWin.loadURL(`data:text/html,<h2>Select what to share</h2>${html}`);
}
```

**2. Call `startScreenShare()` directly in the renderer process**

```js
await trtc.startScreenShare();
```

**Notes:**

- **Screen recording permission** cannot be requested programmatically. You must manually grant it in **System Settings > Privacy & Security > Screen Recording** for "Electron" (the name shown in dev mode), then **fully quit and restart the app** for it to take effect.
- On macOS, capturing a Keynote fullscreen presentation may not automatically switch to the presentation window (known issue: [Electron issue #37126](https://github.com/electron/electron/issues/37126)).

**System audio capture**

Return `audio: 'loopback'` in the `setDisplayMediaRequestHandler` callback to capture system audio (feature flags are already configured in the main code above). Platform support:

| Platform | System Audio | Notes |
|----------|-------------|-------|
| Windows / Linux | ✅ | Natively supported |
| macOS 13+ | ✅ | Requires Chromium feature flags (configured in the main code above) |
| macOS 12.7.6 and below | ❌ | Use a virtual audio device like [BlackHole](https://existential.audio/blackhole/) |

> - **Handling Windows `NotReadableError`**: Some Windows devices throw `NotReadableError: Could not start audio source` when capturing system audio. The root cause is that the default playback device's audio enhancement (APO)/driver is incompatible with the WASAPI loopback format (only certain devices/drivers are affected — not universal). This is a device/driver-level issue that cannot be worked around in code; it is recommended to **catch the error and fall back to video-only sharing**. Two verified ways to recover:
>   - 1. **Switch the default playback device** to another one in System Sound settings;
>   - 2. **Disable audio enhancements** on the current default speaker (System Settings > Sound > All output devices > find the default speaker > turn off Audio Enhancements).
>
> - **macOS system audio loopback does not work in dev mode — you must run the packaged `.app`**: When capturing system audio under `npm run dev` (`electron .`), the loopback audio track is rejected by the system and immediately `ended`, so system audio is lost.
>
>   - **Root cause** (based on Chromium low-level logs): Electron 39+ uses CoreAudio Tap (CATAP) to capture system audio on macOS, which requires the **System Audio Recording** (`kTCCServiceAudioCapture`) permission. In dev mode, `electron .` runs the Electron binary inside `node_modules` directly — it is not launched as a proper `.app` bundle via LaunchServices, so **macOS does not show the 'System Audio Recording' permission prompt**. The app never gets the permission → CATAP's permission probe fails → the logs show `STREAM_OPEN_SYSTEM_PERMISSIONS_ERROR` / `PERMISSION_DENIED_BY_SYSTEM` / `Error when probing audio tap permissions` → the audio track `ended`. The packaged `.app`, launched via `open`, triggers the permission prompt normally and works once granted.
>   - **Conclusion**: use `npm run dev` for UI/logic debugging; **always run the packaged build when you need to verify/use system audio capture** (e.g. `npm run build` then `open "dist/TRTC Demo.app"`; on first launch grant **System Settings > Privacy & Security > System Audio Recording** and fully restart the app). `tccutil reset AudioCapture com.github.Electron` generally does not help in dev (non-bundle launch still won't show the prompt).

### Option 2: Custom capture with `desktopCapturer` (Electron below 22 or when a specific source is needed)

If your Electron version is below 22, or you need to programmatically enumerate and specify which window/screen to capture, you can use Electron's `desktopCapturer.getSources({ types: ['window', 'screen'] })` API for custom capture:

1. The main process `main.js` listens for the page to finish loading, gets the list of screen share sources via `desktopCapturer.getSources`, and sends the list of screen share sources to the rendering process.
2. The rendering process listens to the main process events to get a list of screen share sources.
3. Create screen share streams and push them through the [TRTC Web SDK](https://trtc.io/document/41664).
   1. Get the screen-sharing `MediaStream` from the system API via `navigator.mediaDevices.getUserMedia()`.
   2. Pass the custom captured videoTrack in the `option` parameter of `TRTC.startScreenShare()` to push the screen sharing stream.

```javascript
// 【1】main.js Master process gets list of screen share sources
const { app, BrowserWindow, desktopCapturer, systemPreferences } = require('electron');
function createWindow () {
  const win = new BrowserWindow({
    // ...
  });
  win.loadFile('./src/index.html');
  win.webContents.on('did-finish-load', async () => {
    if (win) {
      const sources = await desktopCapturer.getSources({
        types: ["window", "screen"],
      });
      win.webContents.send("SEND_SCREEN_SHARE_SOURCES", sources);
    }
  });
}
// 【2】Render process listens to main process events to get a list of screen share sources
const { ipcRenderer } = require('electron');
let shareSourceList = [];
ipcRenderer.on('SEND_SCREEN_SHARE_SOURCES', async (event, sources) => {
  const selectContainer = window.document.getElementById('screen-share-select');
  shareSourceList = sources;
  sources.forEach(obj => {
    const optionElement = document.createElement('option');
    optionElement.innerText = `${obj.name}`;
    selectContainer.appendChild(optionElement);
  });
})
// 【3】Rendering process push screen share
async function startScreenShare() {
  const selectContainer = document.getElementById('screen-share-select');
  const selectValue = selectContainer.options[selectContainer.selectedIndex].value;
  const [ source ] = shareSourceList.filter(obj => obj.name === `${selectValue}`);

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: source.id, // screen share source id
          minWidth: 1280,
          maxWidth: 1280,
          minHeight: 720,
          maxHeight: 720
        }
      }
    });
    const trtc = TRTC.create();
    await trtc.enterRoom({
      // ...
    });
    await trtc.startScreenShare({
      option: {
        videoTrack: stream.getVideoTracks()[0],
      }
    })
  } catch (error) {
    console.error('start screen share error = ', error)
  }
}
```

## Precautions

1. {@link module:TYPE.STREAM_TYPE_MAIN What is the main/sub video stream?}
2. The SDK uses the `1080p` parameter configuration by default to collect screen sharing.

## Common Issues

1. Safari screen sharing error `getDisplayMedia must be called from a user gesture handler`

    This is because Safari restricts the `getDisplayMedia` screen capture interface, which must be called within 1 second of the callback function of the user click event.

    Reference: [webkit issue](https://bugs.webkit.org/show_bug.cgi).

    ```javascript
    // good
    async function onClick() {
      // It is recommended to execute the collection logic first when onClick is executed
      await trtcA.startScreenShare();
      await trtcA.enterRoom({ 
        roomId: 123123,
        sdkAppId: 140000000, // Fill in your sdkAppId
        userId: 'userA', // Fill in your userId
        userSig: 'userA_sig', // Fill in userSig corresponding to userId
      });
    }

    // bad
    async function onClick() {
      await trtcA.enterRoom({ 
        roomId: 123123,
        sdkAppId: 140000000, // Fill in your sdkAppId
        userId: 'userA', // Fill in your userId
        userSig: 'userA_sig', // Fill in userSig corresponding to userId
      });
      // Entering the room may take more than 1s, and the collection may fail
      await trtcA.startScreenShare();
    }
    ```
2. macOS Monterey(12.2.1), device permissions need to be requested in the master process
    ```javascript
    async function checkAndApplyDeviceAccessPrivilege() {
      const cameraPrivilege = systemPreferences.getMediaAccessStatus('camera');
      console.log(
        `checkAndApplyDeviceAccessPrivilege before apply cameraPrivilege: ${cameraPrivilege}`
      );
      if (cameraPrivilege !== 'granted') {
        await systemPreferences.askForMediaAccess('camera');
      }

      const micPrivilege = systemPreferences.getMediaAccessStatus('microphone');
      console.log(
        `checkAndApplyDeviceAccessPrivilege before apply micPrivilege: ${micPrivilege}`
      );
      if (micPrivilege !== 'granted') {
        await systemPreferences.askForMediaAccess('microphone');
      }

      const screenPrivilege = systemPreferences.getMediaAccessStatus('screen');
      console.log(
        `checkAndApplyDeviceAccessPrivilege before apply screenPrivilege: ${screenPrivilege}`
      );
    }
    ```
3. Mac Chrome screen sharing fails with the error message "NotAllowedError: Permission denied by system" or "NotReadableError: Could not start video source" when screen recording is already authorized. [Chrome bug](https://bugs.chromium.org/p/chromium/issues/detail). Solution: Open 【Settings】> Click 【Security & Privacy】> Click 【Privacy】> Click 【Screen Recording】> Turn off Chrome screen recording authorization > Reopen Chrome screen recording authorization > Close Chrome browser > Reopen Chrome browser.
4. [WebRTC screen sharing known issues and workarounds](tutorial-02-info-webrtc-issues.md#h2-9)
