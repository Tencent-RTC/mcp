## Introduction

In order to prevent web pages from automatically playing audio and video and causing interference to users, browsers have restricted the automatic playback function of audio and video: **before the user interacts with the web page (such as clicking, touching the page, etc.), the web page will be prohibited from playing media with sound. In iOS 10+, if low power mode is enabled, media without sound will also be prohibited from playing.**

Affected by the above browser autoplay policy, when using the TRTC Web SDK, there may be problems with playing silently. The most common scenario is: in your product design, support users to automatically enter the room and pull the stream for playback without the need for users to click after refreshing the page.

This article mainly introduces **how to solve the problem of playback failure caused by the restriction of autoplay policy**.

## Solution 1: Use the SDK's autoplay popup window

By default, when autoplay fails, the SDK will pop up to guide the user to interact with the page. After the interaction occurs, the SDK will actively call the interface to resume playback.

- Advantages: The business side does not need to do anything, simple and efficient.

- Disadvantages: The popup window provided by the SDK may not meet the design requirements of the business product. At this time, you can consider using Solution 2.

The popup window provided by the SDK is adapted to desktop and mobile browser, and the style is as follows:

<div style="display:flex;align-items:center;">

</div>

- The SDK will switch the Chinese and English popup prompts according to the value of [navigator.language](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/language).

- When the user clicks "OK", the SDK automatically calls the relevant interface to resume playback.

- In order to ensure that the popup window is displayed on the top layer as much as possible, its z-index value is 1500.

## Solution 2: Custom handling of autoplay restrictions

If you want to have complete control over the user experience when autoplay fails, you can follow these steps:

### Step 1: Disable SDK default popup

Set the `enableAutoPlayDialog` parameter to `false` when calling the [TRTC.enterRoom](TRTC.md#enterRoom) interface:

```javascript
await trtc.enterRoom({
  // ... other parameters
  enableAutoPlayDialog: false
});
```

### Step 2: Listen for autoplay failure events (Required)

Listen to the [AUTOPLAY_FAILED](module-EVENT.md#.AUTOPLAY_FAILED) event to handle autoplay failures. The SDK will automatically monitor user click events and resume playback after the user clicks.

```javascript
trtc.on(TRTC.EVENT.AUTOPLAY_FAILED, event => {
  // Add your custom handling logic here
  // For example: display a custom prompt to guide users to click on the page
});
```

### Step 3: Actively resume playback (Optional)

> Supported from version 5.9.0

In some special scenarios (such as in iframes or when using specific frontend frameworks), you may need to actively call the resume playback method. In this case, you can use the `resume` method provided in the event:

```javascript
trtc.on(TRTC.EVENT.AUTOPLAY_FAILED, (event) => {
  showCustomDialog(event);
});
function showCustomDialog(event) {
  const { userId, resume } = event;
  // The restricted user id is userId, resume is the function to resume playback for this user
  // Need to display a custom button, prompt that userId playback is restricted, and call 'resume()' in the button click callback
}
```

### Important Notes

1. Some browsers may check user interaction status before each playback, so autoplay failure events may be triggered multiple times.

2. Special requirements in iOS WeChat browser and mini-program webview:
   - When playing remote streams for the first time, you must call the playback interface directly in the user click event callback
   - You cannot use asynchronous methods like setTimeout to call the playback interface, otherwise playback will fail

3. **Iframe embedding scenario**: When the TRTC SDK runs inside an iframe, the following limitations apply:
   - User clicks on the parent page (outside the iframe) cannot penetrate into the iframe, so the click event cannot be captured by the iframe's `document`. The SDK's default auto-resume listener will not be triggered.
   - The parent page should add the `allow="autoplay"` attribute to the iframe to allow the iframe page to use autoplay. However, `allow="autoplay"` **does not disable the browser's autoplay policy**; it only allows the iframe to attempt autoplay. For audible media, the browser may still require the user to first interact with the iframe content.
   - If using the SDK's default dialog, make sure users can click on the SDK dialog inside the iframe to resume playback.
   - For a custom experience, disable the SDK default dialog (`enableAutoPlayDialog: false`), listen to the `AUTOPLAY_FAILED` event, show a custom button inside the iframe, and call the `resume()` method from the event in the button's click callback.

## Disable Autoplay Policy in Webview

The default autoplay policy in Android and iOS Webview may be different to the browser. You can .

- Android Webview: Call [setMediaPlaybackRequiresUserGesture(false)](https://developer.android.com/reference/android/webkit/WebSettings#setMediaPlaybackRequiresUserGesture(boolean)).
- iOS Webview: Set [mediaTypesRequiringUserActionForPlayback](https://developer.apple.com/documentation/webkit/wkwebviewconfiguration/1851524-mediatypesrequiringuseractionfor) to WKAudiovisualMediaTypeNone.
