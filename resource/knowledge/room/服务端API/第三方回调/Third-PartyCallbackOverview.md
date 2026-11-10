---
sync_node_id: '140037756371312640'
nav_path:
  - "视频会议 SDK"
  - "服务端 API"
  - "第三方回调"
  - "Third-Party Callback Overview"
product: "room"
---
To facilitate your control of the feature form of your App, RoomKit provides callback capabilities.

## Feature Overview

Users can configure a callback to a specified URL through RESTful API. When the executed CallbackCommand is on the configuration list, the callback will be triggered.

## Notes
- Only one callback can be set per sdkAppId.

- Ensure that the callback URL is accessible.
