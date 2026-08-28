## Function Description

This article will introduce how to add background music during a call. [Experience demo](https://web.sdk.qcloud.com/trtc/webrtc/demo/api-sample/improve-audio-mixer.html).

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
    <iframe allow="microphone; camera; display-capture;" class="trtc-demo-iframe" style="width:100%;border:none;min-height:700px" title="Music and Audio Effects" src="https://web.sdk.qcloud.com/trtc/webrtc/v5/demo/samples/advance-features/enable-audio-mixer/index.html?lang=en" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true"></iframe>
  </div>
</details>
</div>

## Prerequisites

TRTC version 5.1+

The following platforms support adding background music during a call:

| Operating System | Browser Type        | Minimum Browser Version |
|------------------|---------------------|-------------------------|
| Mac OS           | Desktop Chrome      | 56+                     |
| Mac OS           | Desktop Safari      | 11+                     |
| Mac OS           | Desktop Firefox     | 56+                     |
| Mac OS           | Desktop Edge        | 80+                     |
| Windows          | Desktop Chrome      | 56+                     |
| Windows          | Desktop QQ Browser  | 10.4+                   |
| Windows          | Desktop Firefox     | 56+                     |
| Windows          | Desktop Edge        | 80+                     |
| iOS              | Mobile Safari       | 14+                     |
| iOS              | WeChat Embedded Web | ✖                       |
| Android          | Mobile Chrome       | 81+                     |
| Android          | WeChat Embedded Web | ✔                       |
| Android          | Mobile QQ Browser   | ✖                       |

## Implementation Process

### Start Background Music

> !
>
> - When playing online sound effect files, the sound effect files must support `CORS` and the access protocol must be `https`.
> - Supported formats include MP3, AAC (and other audio formats supported by browsers).
> - Before any user interaction, browsers prohibit web pages from playing media with sound. It is recommended to guide users to perform a click action before calling this interface.
> - Reference: [Autoplay_guide](https://developer.mozilla.org/en-US/docs/Web/Media/Autoplay_guide).

```javascript
await trtc.startPlugin('AudioMixer', {
  id: 'count',
  url: '../assets/count.mp3',
  loop: true,
  volume: 0.2
})
```

### Update Background Music
Perform operations on the background music.

```javascript
// disable loop playback
await trtc.updatePlugin('AudioMixer', {
  id: 'count',
  loop: false
})
// volume setting
await trtc.updatePlugin('AudioMixer', {
  id: 'count',
  volume: 1
})
// pause music `count`
await trtc.updatePlugin('AudioMixer', {
  id: 'count',
  loop: true,
  volume: 0.2,
  operation: 'pause'
})
// resume music `count`
await trtc.updatePlugin('AudioMixer', {
  id: 'count',
  operation: 'resume'
})
// play `count` from 5s
await trtc.updatePlugin('AudioMixer', {
  id: 'count',
  seekFrom: 5
})
```

### Stop Background Music

Stop a background music that is not needed.

```javascript
await trtc.stopPlugin('AudioMixer', {
  id: 'count'
})
```

## API

### trtc.startPlugin('AudioMixer', options)

Start background music.

#### options

| Name   | Type      | Attributes   | Description                                 |
|--------|-----------|--------------|---------------------------------------------|
| id     | `string`  |              | Set a unique ID for each incoming music URL |
| url    | `string`  |   | Music file URL. One of url and track must be passed in. If both are passed in, the url will be selected first.                            |
| track | `MediaStreamAudioTrack`  |  | Since v5.4.3+, one of url and track must be passed in. can pass in a track extracted from the `<audio/>` tag. If both are passed in, the url will be selected first. |
| loop   | `boolean` | `<optional>` | Whether to loop play, default is false      |
| volume | `number`  | `<optional>` | Set the initial volume, default is 1 (0-1). Not support iOS.  |
| playbackRate | `number`  | `<optional>` | Set the playback rate, the default is 1.0                |
| onDurationChange | `function`  | `<optional>` | Callback function, which will be executed after the music is loaded. The parameter is (duration: number) which indicates the total duration of the music |
| onTimeUpdate | `function`  | `<optional>` | Callback function, which will be executed after the music is loaded. The parameter is (duration: number) which indicates the total duration of the music |
| onEnded | `function`  | `<optional>` | Callback function, executed when the music ends (note that it will not be executed every time the music ends during loop), no parameters |

```javascript
await trtc.startPlugin('AudioMixer', {
  id: 'count',
  url: '../assets/count.mp3',
  loop: true,
  volume: 0.2
})
```

### trtc.updatePlugin('AudioMixer', options)

Update background music.

#### options

| Name      | Type      | Attributes   | Description                                                             |
|-----------|-----------|--------------|-------------------------------------------------------------------------|
| id        | `string`  |              | The unique ID for each incoming music URL you set when call startPlugin |
| loop      | `boolean` | `<optional>` | Whether to loop play, default is false                                  |
| volume    | `number`  | `<optional>` | Set the initial volume, default is 1 (0-1)                              |
| seekFrom  | `number`  | `<optional>` | Start seeking playback from which second, this parameter requires the music resource file to support [HTTP range requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Range_requests).                               |
| operation | `number`  | `<optional>` | Operation on the background music: 'pause' ｜ 'resume' ｜ 'stop'          |

**Example:**

```javascript
await trtc.updatePlugin('AudioMixer', {
  id: 'count',
  loop: true,
  volume: 0.2,
  operation: 'pause'
})
```

### trtc.stopPlugin('AudioMixer', options)

Stop a background music that is not needed.

#### options

| Name | Type     | Attributes | Description                                                             |
|------|----------|------------|-------------------------------------------------------------------------|
| id   | `string` |            | The unique ID for each incoming music URL you set when call startPlugin |

**Example:**

```javascript
await trtc.stopPlugin('AudioMixer', {
  id: 'count'
})
```

## Frequently Asked Questions

**1. Cross-Origin Error**

For example: Access to audio at XXX from origin XXX has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is
present on the requested resource.

Solution: You need to configure the CORS protocol for your online music files.

**2. Incorrect Audio Format, Unable to Play in Browser**

For example: NotSupportedError: The operation is not supported.

Solution: You need to use an audio format supported by the browser.
