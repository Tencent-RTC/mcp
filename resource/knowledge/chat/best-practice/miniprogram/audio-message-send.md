---
title: "Mini Program: Standard Approach for Sending Audio Messages with IM SDK（recorderManager / createAudioMessage / sendMessage / 小程序发送语音消息）"
product: chat
frameworks: [miniprogram]
scope: platform_specific
tags: [audio, voice, recorderManager, createAudioMessage, sendMessage, aac, miniprogram]
version_range: ">=3.0.0"
---

# Mini Program: Standard Approach for Sending Audio Messages with IM SDK

## 1. Key Takeaways

- On the mini program side, use the official WeChat `RecorderManager` for recording, then call `createAudioMessage` in the `onStop` callback to create the audio message.
- After message creation, send it via `sendMessage`; the send result is determined by the Promise success/failure callback.
- Using `aac` audio format enables cross-platform interoperability across IM on Android, iOS, Mini Program, and Web.
- Recording parameters must be explicitly configured: `duration`, `sampleRate`, `numberOfChannels`, `encodeBitRate`, `format`; also listen to `onError` to handle recording exceptions.

## 2. Field / API Reference

| Field / Capability | Purpose | Description |
|---|---|---|
| `wx.getRecorderManager()` | Recording entry | Gets the globally unique recorder manager instance |
| `recordOptions.format` | Audio format control | Set to `aac` for cross-platform interoperability |
| `recorderManager.onStop(res)` | Recording result callback | Use `res` in the callback to create the audio message |
| `chat.createAudioMessage({...})` | Create message instance | Generates an audio message object ready for rendering and sending |
| `chat.sendMessage(message)` | Send message | Returns a Promise; `then` for success, `catch` for failure |

## 3. Mechanism & Sequence

Initialize `RecorderManager` -> Configure recording parameters -> Start recording -> Listen to `onStop` to get the recording result -> Call `createAudioMessage` to create the audio message -> Call `sendMessage` to send -> Update UI and logs based on send result.

## 4. Standard Usage

1. Get the recorder manager and configure recording parameters with `format` set to `aac`.
2. Register `onError` and `onStop` callbacks; create the audio message based on the recording result in `onStop`.
3. Call `sendMessage` to send the audio message and handle success/failure callbacks.
4. Render the message instance on screen, and prompt retry on failure.

```javascript
// 示例：使用微信官方的 RecorderManager 进行录音
// 参考 https://developers.weixin.qq.com/minigame/dev/api/media/recorder/RecorderManager.start.html
// 1. 获取全局唯一的录音管理器 RecorderManager
const recorderManager = wx.getRecorderManager();

// 录音部分参数
const recordOptions = {
  duration: 60000, // 录音的时长，单位 ms，最大值 600000（10 分钟）
  sampleRate: 44100, // 采样率
  numberOfChannels: 1, // 录音通道数
  encodeBitRate: 192000, // 编码码率
  format: 'aac' // 音频格式，选择此格式创建的音频消息可以在 IM 全平台互通
};

// 2.1 监听录音错误事件
recorderManager.onError(function(errMsg) {
  console.warn('recorder error:', errMsg);
});

// 2.2 监听录音结束事件，录音结束后创建并发送音频消息
recorderManager.onStop(function(res) {
  console.log('recorder stop', res);

  // 4. 创建消息实例，接口返回的实例可以上屏
  const message = chat.createAudioMessage({
    to: 'user1',
    conversationType: TencentCloudChat.TYPES.CONV_C2C,
    // 消息优先级，用于群聊
    // priority: TencentCloudChat.TYPES.MSG_PRIORITY_NORMAL,
    payload: {
      file: res
    },
    // 消息自定义数据（云端保存，会发送到对端，程序卸载重装后还能拉取到）
    // cloudCustomData: 'your cloud custom data'
  });

  // 5. 发送消息
  chat.sendMessage(message).then(function(imResponse) {
    // 发送成功
    console.log(imResponse);
  }).catch(function(imError) {
    // 发送失败
    console.warn('sendMessage error:', imError);
  });
});

// 3. 开始录音
recorderManager.start(recordOptions);
```

## 5. Expected Results

- After recording ends, `onStop` is triggered reliably and a voice message instance is created successfully.
- On successful send, the `sendMessage` Promise enters `then` and the message renders on screen.
- The audio message can be played on Android, iOS, Mini Program, and Web (using `aac` format).
- On recording exceptions, `onError` provides clear logs with no silent failures.

## 6. Common Pitfalls

- Pitfall 1: Not creating the message in the `onStop` callback, resulting in no valid audio file at send time.
- Pitfall 2: Not using `aac` for the audio format, causing cross-platform interoperability issues.
- Pitfall 3: Only calling `createAudioMessage` without calling `sendMessage`, mistakenly thinking the message has been sent.

## 7. Problem Definition (retrieval hint)

When integrating IM SDK in a mini program, how to complete voice recording, create an audio message, and send it while ensuring cross-platform interoperability.

## 8. Alternative Queries (retrieval recall)

- How to send an audio message with the mini program IM SDK?
- How to use `createAudioMessage` to send a message after recording in a mini program?
- How to integrate `RecorderManager` recording result with IM sending?
- What audio format allows interoperability with Android/iOS/Web?
