---
title: "Web (PC/H5): Standard Approach for Sending Audio Messages with IM SDK（pc/h5发送语音消息）"
product: chat
frameworks: [web]
scope: platform_specific
tags: [audio, voice, createAudioMessage, sendMessage, Recorder, js-audio-recorder, h5, pc]
version_range: ">=3.0.0"
---

# Web (PC/H5): Standard Approach for Sending Audio Messages with IM SDK

## 1. Key Takeaways

- On the Web side, you can use a third-party recording library (e.g., `js-audio-recorder`) to record audio, then convert the recording result to a `File` and call `createAudioMessage`.
- The `audioFile` must have a `uri` field set (`audioFile.uri = window.URL.createObjectURL(audioFile)`); otherwise the audio message creation and sending pipeline is incomplete.
- After message creation, send it via `sendMessage`; the send result is determined by the Promise success/failure callback.
- It is recommended to pass an `onProgress` callback in `createAudioMessage` to monitor audio upload progress in real time.

## 2. Field / API Reference

| Field / Capability | Purpose | Description |
|---|---|---|
| `Recorder` | Recording capability | Captures audio data in the browser |
| `recorder.getWAVBlob()` | Export recording data | Gets WAV binary data for constructing a `File` |
| `audioFile.uri` | Local accessible address | Required field; generated using `window.URL.createObjectURL(audioFile)` |
| `chat.createAudioMessage({...})` | Create audio message instance | Generates an audio message object ready for rendering and sending |
| `chat.sendMessage(message)` | Send message | Returns a Promise; `then` for success, `catch` for failure |
| `onProgress` | Upload progress callback | Monitors the audio file upload process |

## 3. Mechanism & Sequence

Start recording -> Stop recording -> Calculate duration and get WAV Blob -> Convert to `File` and add `uri` and `duration` -> Call `createAudioMessage` to create the audio message -> Call `sendMessage` to send -> Update UI and logs based on send result.

## 4. Standard Usage

1. Start recording with the recorder and record the start timestamp.
2. After stopping recording, calculate the duration and get the `WAV Blob`.
3. Convert the `Blob` to a `File` and set `audioFile.uri` and `audioFile.duration`.
4. Call `createAudioMessage` to create the audio message, passing in the `onProgress` callback.
5. Call `sendMessage` to send the audio message and handle success and failure branches.

```javascript
// 在 Web 端创建语音消息并发送
// 示例：使用第三方库 js-audio-recorder 录制音频

// 1. 开始录制
let recorder = new Recorder({
  sampleBits: 16, // 采样位数，支持 8 或 16，默认 16
  sampleRate: 16000, // 采样率
  numChannels: 1 // 声道，支持 1 或 2，默认 1
});

let startTs;
recorder.start().then(() => {
  // 开始录音，记录起始时间戳
  startTs = Date.now();
}, (error) => {
  // 出错了
  console.log(`${error.name} : ${error.message}`);
});

// 2. 结束录制
recorder.stop();

// 3. 计算录音时长，获取 WAV 数据
let duration = Date.now() - startTs; // 单位：ms
let wavBlob = recorder.getWAVBlob();

// 4. blob 数据转成 File 对象
let audioFile = new File([wavBlob], 'hello.wav', { type: 'wav' });
audioFile.uri = window.URL.createObjectURL(audioFile);
audioFile.duration = duration;

// 5. 创建音频消息
let message = chat.createAudioMessage({
  to: 'user1',
  conversationType: 'C2C',
  payload: {
    file: audioFile
  },
  // 音频上传进度回调
  onProgress: function(event) {
    console.log('file uploading:', event);
  }
});

// 6. 发送消息
chat.sendMessage(message).then(function(imResponse) {
  // 发送成功
  console.log(imResponse);
}).catch(function(imError) {
  // 发送失败
  console.warn('sendMessage error:', imError);
});
```

## 5. Expected Results

- After recording ends, `wavBlob` is reliably obtained and `audioFile` is constructed successfully.
- `audioFile.uri` is set, and `createAudioMessage` creates the audio message normally.
- `sendMessage` enters `then` on success; the audio message renders on screen and is playable.
- During upload, `onProgress` callbacks are received; on failure, `catch` provides clear error logs.

## 6. Common Pitfalls

- Pitfall 1: Not setting `audioFile.uri` before sending, causing the message pipeline to fail.
- Pitfall 2: Only creating the message without sending it, mistakenly thinking the message has been delivered.
- Pitfall 3: Not correctly calculating the duration or packaging the file after recording ends, causing the audio to be unusable.

## 7. Problem Definition (retrieval hint)

When integrating IM SDK on Web (PC/H5), how to complete voice recording and reliably send audio messages.

## 8. Alternative Queries (retrieval recall)

- How to send an audio message with the Web IM SDK?
- How to call `createAudioMessage` after recording on PC/H5?
- Why must `audioFile.uri` be set?
