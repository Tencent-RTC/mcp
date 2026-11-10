---
sync_node_id: 'https://web.sdk.qcloud.com/trtc/webrtc/doc/en/tutorial-18-basic-debug.md'
nav_path:
  - "Tutorials"
  - "Others"
product: "trtc"
---

## Function Description
This article mainly introduces how to enable debug mode and realize the cloud upload and local export functions of full logs

Debug mode is mainly used in:

- Record full logs to better help debug problems
- Support privatization customers who cannot report logs to export local log files
- Support dumping audio and video of local and remote users (Supported since v5.8.4)

## Breaking Change
> Note: Starting from v5.8.4, the Debug plugin has been built into the SDK and no longer supports external Debug plugin

## Prerequisites

- TRTC Web SDK version >= 5.8.0

## Open pop-up dialog

### TRTC Web SDK version >= 5.8.4
-  When the SDK detects that the URL parameter contains `trtcDebug`, it automatically opens a pop-up window. Example: `www.example.com/?trtcDebug=1`

### RTC Web SDK version <= 5.8.3
#### Import and register plugins

```javascript
import { Debug } from 'trtc-sdk-v5/plugins/debug';

let trtc = TRTC.create({ plugins: [Debug] });
```

> Note: The SDK will automatically start the Debug plugin, you do not need to call the `trtc.startPlugin()` method

#### Open pop-up dialog
- Development environment (`file:`, `localhost`, `127.0.0.1`): Automatically open the pop-up window

- Deployment environment: Open the pop-up window when the URL parameter contains `trtcDebug`, for example: `www.example.com/?trtcDebug=1`

#### Close

```javascript
trtc.stopPlugin('Debug');
```

### Plugin Effect
### Full logs and network statistics

### Upload and Export Functions
| Uploading | Export |
| --- | --- |

### Dump audio and video
> Note: The dump feature is not currently supported in Safari and Firefox browsers
- Dump audio: Dump the local upstream audio stream or remote downstream audio stream into an audio file
  - `Dump (PCM)`: Dump decoded audio data, saved as `.pcm` format
  - `Dump (Opus)`: Dump raw audio data before decoding, saved as `.ogg` format (Opus codec)
- Dump video: Dump the local upstream video stream or remote downstream video stream into a `.h264` format video file
- Dump video with audio: For remote downstream video, click the `Dump w/ Audio` button to dump both video and audio simultaneously, packaged as a `.zip` file for download
- Usage: (1) Enter the duration you want to dump in the input box, and click the `Dump` button to start dumping. After the countdown ends, the file will be automatically downloaded to the local computer. (2) If you want to dump any duration, enter `0` in the input box, click the `Dump` button to start dumping, and when you want to end the dump, click the `End` button to download the file to the local computer.
| Dump |
| --- |
|  |

### Multiple TRTC instances
If you create multiple TRTC instances, each instance will initialize a popup window.

## Frequently Asked Questions

### Where are exported logs and dumped audio and video files saved?

How browsers treat downloads varies by browser, user settings, and other factors. The user may be prompted before a download starts, or the file may be saved automatically, or it may open automatically, either in an external application or in the browser itself.

You can usually find the file in the browser's download history.
