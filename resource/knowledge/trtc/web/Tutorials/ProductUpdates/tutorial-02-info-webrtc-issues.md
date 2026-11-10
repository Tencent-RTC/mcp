---
sync_node_id: 'https://web.sdk.qcloud.com/trtc/webrtc/doc/en/tutorial-02-info-webrtc-issues.md'
nav_path:
  - "Tutorials"
  - "Product Updates"
product: "trtc"
---
## Chrome

1. (2021-11-23) When Chrome 88 is enabled with hardware acceleration, using HTMLMediaElement.captureStream to push MP4 files may cause black screen issues when viewing remote streams. [Chrome 88 bug](https://bugs.chromium.org/p/chromium/issues/detail).<br>Workaround:
	- Upgrade to Chrome 96+.
	- Alternatively, the issue can be avoided by disabling hardware acceleration.
2. (2021-2-3) When hardware acceleration is disabled in Mac Chrome 88 (88.0.4324.96), pushing video streams captured by the camera may cause black screen issues when viewing remote streams. [Chrome 88 bug](https://bugs.chromium.org/p/chromium/issues/detail)<br>Workaround:
	- Upgrade to Chrome 88.0.4324.146+.
	- Keep hardware acceleration enabled to avoid this issue (Chrome has hardware acceleration enabled by default).
3. (2021-2-2) When Chrome uses deviceId as default or communications (this deviceId will be available on Windows devices), if a new microphone is plugged in and then unplugged, it may cause microphone collection interruption.<br>Workaround:
	- Avoid using microphone devices with deviceId as default or communications.
4. (2023-07-20) On Mac devices, if the Mersive Solstic software is installed, its virtual camera driver causes Chrome to fail to fetch the list of cameras, resulting in the inability to capture cameras. [Chrome issue](https://bugs.chromium.org/p/chromium/issues/detail) & [Mersive Solstic 5.5.2 known issue](https://documentation.mersive.com/content/pages/release-notes.htm).
	- Workaround: Direct users to remove the virtual camera driver, or wait for a subsequent Chrome or Mersive Solstic workaround.

		```sh
		sudo rm -rf /Library/CoreMediaIO/Plug-Ins/DAL/RelayCam.plugin
		```
5. (2023-12-11) Publish timeout on some Android 11 devices(such as OPPO Reno4, Pixel4 XL). [Chrome issue](https://bugs.chromium.org/p/chromium/issues/detail)
	- Workaround: SDK will retry publishing stream. Or guide user to update Android version upper than 11.
6. (2024-12-16) Android Chrome 122 may not be able to get the volume value.
	- Workaround: Upgrade SDK to the latest version, or upgrade Chrome to Chrome 123+.
7. (2026-06-24) Chrome does not support H264 codec on Samsung Exynos 850 devices. [Chrome bug](https://issues.webrtc.org/issues/521921838)
	- Workaround: Upgrade Chrome to version 150 or above.

## Firefox

1. (2021-2-2) Firefox does not support setting the capture frame rate and can only capture video at 30fps.
2. (2022-7-7) The first installation of Firefox browser will dynamically install the H.264 codec under the network connection. Before the installation is complete, the SDK cannot be used for push-pull streaming. Handling suggestions:
	- Use the [TRTC.isSupported](TRTC.md#.isSupported) interface of the SDK. If it detects that H264 encoding and decoding is not supported under Firefox, guide the user to open the address `about:addons` in Firefox and check the installation of OpenH264 in `Plugins`. Wait for the installation to complete before making a call.<br/>
	  

## Android

1. (2026-07-14) Android 14+ may experience audio capture becoming silent after approximately 5 seconds when the browser runs in the background or the device screen is locked.
	- Workaround: It is recommended that users keep the browser running in the foreground during calls, or use picture-in-picture mode to enable the browser's foreground service.

## iOS

1. (2021-2-2) iOS Safari does not support getUserMedia in multiple tabs. Otherwise, the previous tab will stop collecting and the remote stream may also have black screen and no sound. [webkit bug](https://bugs.webkit.org/show_bug.cgi) <br>Workaround:
	- iOS Safari has no plans to support the multi-tab getUserMedia feature. If the business side needs to use multiple tab getUserMedia in iOS Safari, it is recommended to stop device collection before switching to a new tab and resume device collection after switching back.<br>Note: The business scenario of multiple tab getUserMedia generally includes: switching to face recognition in a new tab during video call.

2. (2021-10-28) Audio and video communication between iOS Safari and Mac Big Sur Safari may cause video stuttering and frame dropping when iOS Safari watches Mac Safari's video.<br>Workaround:
	- Upgrade to the latest version of Mac BigSur.

3. (2021-2-2) Some iOS 14.2 devices and Mac Big Sur Safari may have noise when playing audio. [webkit bug](https://bugs.webkit.org/show_bug.cgi) .<br>Workaround:
	- Upgrade iOS devices to version 14.3 or above, and upgrade Mac Big Sur to the latest version.

4. (2021-9-28) When making audio and video calls in iOS 15 Safari, the sound played through the speaker may be lower than that in iOS 14. [webkit bug](https://bugs.webkit.org/show_bug.cgi) .<br>Workaround:
	- Upgrade iOS version to 15.4+.

5. (2021-12-24) When making audio and video calls in iOS 15 Safari and WKWebview, there may be abnormal sound playback when connecting to a Bluetooth headset. [webkit bug](https://bugs.webkit.org/show_bug.cgi) .<br>Workaround:
	- Upgrade iOS version to 15.4+.

6. (2022-1-20) When user A plays the sound of user B through the speaker and also collects the sound of user A on the phone, the sound heard by user B may have electric current noise. This is a side effect of the iOS 14 echo cancellation function.<br>Workaround:
	- Use earphones for calls.
	- Upgrade iOS version to 15.4+.

7. (2022-01-19) Video streams captured by canvas.captureStream cannot be played using the video tag in iOS 15 and below. [webkit bug](https://bugs.webkit.org/show_bug.cgi).

8. (2022-04-20) In iOS 15 on some devices, when your page plays an Audio tag that is not a MediaStream, the sound played by the Audio tag may become smaller after you get the microphone on the page and then turn it off. [webkit bug](https://bugs.webkit.org/show_bug.cgi).

9. (2024-04-26) iOS 17 video rendering flaky. [webkit bug](https://bugs.webkit.org/show_bug.cgi).
	- Workaround: Upgrade SDK to the latest version.

10. (2024-12-16) Poor compatibility with OffscreenCanvas in iOS 18, which may cause memory leaks when using SDK's watermark plugin or encoding mirror functionality.
	- Workaround: Upgrade to the latest SDK version.

11. (2025-10-29) iPhone 14 series devices experience microphone audio failure on iOS 16.0, [webkit bug](https://bugs.webkit.org/show_bug.cgi); Workaround: Guide users to upgrade iOS version.

12. (2026-03-13) Intermittent video encoding failure on iOS 26.2.
	- Workaround: Upgrade SDK to v5.16.0+.

## Webview

1. (2021-11-23) Android System Webview versions below M79 do not support H264 decoding. [webview bug](https://bugs.chromium.org/p/chromium/issues/detail) .<br>Workaround:
	- Guide users to upgrade Android System Webview to version M79+ and install the corresponding version of the webview apk package.

2. (2024-12-31) Android System Webview 104 version, when using SDK's watermark plugin or encoding mirror functionality, the encoding time is long. <br>Workaround:
	- Guide users to upgrade Android System Webview version to 105+.

## Huawei devices

1. (2025-09-28) On OpenHarmony OS, when applications are opened through ZhuoyiTong/Chujingyi, enabling audio processing capabilities (AIDenoiser, AudioMixer, VoiceChanger, volume gain above 100) will cause audio stuttering.

2. (2025-11-21) Huawei Browser on OpenHarmony 5.0+: If an audio file is played using the audio tag before a call, entering the call room afterwards may result in no audio playback (silent issue). This is an OpenHarmony system bug, and a ticket has been submitted for feedback.<br>Workaround:
	- Update OpenHarmony version to 5.1.1 or upper.
	- Use AudioContext to play the audio.

## Honor devices

1. (2024-12-25) In some Honor phones, there may be no audio issue.
	- Workaround: Upgrade to the latest SDK version or update the latest system version (HONOR will release a fix later).

## Xiaomi devices

1. (2021-11-23) In some Xiaomi phones' WeChat, there may be no sound when pulling streams. Known models include: Xiaomi 9, Xiaomi 10s, Xiaomi 11, K30 5G, etc. This is a known issue with MIUI, and Xiaomi engineers are working on a fix. WeChat has also found a workaround, which is currently in the gray release phase.

2. (2025-03-27) Xiaomi 14 may experience camera stuttering when using the rear camera, caused by a system bug.

3. (2025-07-31) Xiaomi's built-in browser does not support WebRTC.

## Screen Sharing

1. (2021-2-2) When sharing an app in Windows &amp; Mac Chrome browser, minimizing the app will cause the collection to stop, and fps = 0.
2. (2021-9-29) When using Chrome screen sharing on Windows, selecting to share the application window of WeChat, QQ, DingTalk, or WPS may result in black screen collection, or black screen collection may occur when dragging the application window. <br>Workaround:
	- Currently unable to solve, it is recommended to guide users to share the entire screen to avoid this issue.
3. (2021-11-16) Mac Firefox screen sharing may cause video partial area displacement, [Firefox bug](https://bugzilla.mozilla.org/show_bug.cgi). Currently unable to avoid, it is recommended to use Chrome or Safari browser for screen sharing.
4. (2022-03-18) In Mac Chrome, when screen recording is authorized, screen sharing may fail, and "NotAllowedError: Permission denied by system" or "NotReadableError: Could not start video source" error messages may appear, [Chrome bug](https://bugs.chromium.org/p/chromium/issues/detail). Solution: Open [Settings] > Click [Security &amp; Privacy] > Click [Privacy] > Click [Screen Recording] > Turn off Chrome screen recording authorization > Reopen Chrome screen recording authorization > Close Chrome browser > Reopen Chrome browser.
5. (2022-03-31) When using Chrome screen sharing in Mac, window collection may not be able to collect WPS PPT full-screen windows. <br>Workaround:
	- Currently unable to solve at the Web SDK level, it is recommended to guide users to share the entire screen to avoid this issue.

## Other

1. (2021-2-2) The Netease WebRTC SDK will rewrite the RTCPeerConnection.prototype.getStats method, and the data format returned is inconsistent with the standard WebRTC protocol. If TRTC and Netease's WebRTC SDK are introduced at the same time, TRTC will not be able to obtain audio and video data, resulting in the inability to report audio and video call data to the dashboard normally.
2. (2025-03-27) Some Sony phones (Xperia 1 VI) with Android 15 may experience no audio during calls, [Sony system bug](https://github.com/google/oboe/issues/2121#issuecomment-2515354168).
	- Workaround: Upgrade to the latest system version and the latest SDK version.
3. (2021-11-5) Developers should be aware when using Vue 3 that Vue 3 implements reactivity based on Proxy. If Proxy is added to the SDK instance, it may cause SDK exceptions. Workaround:
	- Update SDK version to v5.13.0+.
	- Or setting the TRTC instance as a non-reactive property by using [Vue markRaw](https://cn.vuejs.org/api/reactivity-advanced.html#markraw).
4. (2025-09-28) OPPO Browser (based on Chromium 115) cannot encode videos with resolution lower than 480p.
	- Workaround: Upgrade to the latest SDK version and avoid using video resolutions lower than 480p in this browser.
