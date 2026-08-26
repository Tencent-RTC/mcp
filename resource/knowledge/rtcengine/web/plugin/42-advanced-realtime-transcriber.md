## Overview

This document describes how to use the Realtime Transcriber plugin to enable real-time speech-to-text (ASR) and translation capabilities. This plugin can convert users' speech in a room to text in real-time and supports translation into multiple languages.

## Prerequisites

- TRTC Web SDK version >= 5.15.0

## Implementation

### Import and Register Plugin

```javascript
import TRTC from 'trtc-sdk-v5';
import RealtimeTranscriber from 'trtc-sdk-v5/plugins/realtime-transcriber';

const trtc = TRTC.create({ plugins: [RealtimeTranscriber] });
```

### Start Plugin

Starting the plugin returns a `transcriberRobotId`, which is used to stop the transcription task later.

```javascript
const transcriberRobotId = await trtc.startPlugin('RealtimeTranscriber', {
  sourceLanguage: 'zh',
  translationLanguages: ['en', 'ja'],
  userIdsToTranscribe: 'all',
});
```

### Listen for Transcription Messages

Listen to the `REALTIME_TRANSCRIBER_MESSAGE` event to receive transcription results.

```javascript
trtc.on(TRTC.EVENT.REALTIME_TRANSCRIBER_MESSAGE, (event) => {
  console.log(`${event.speakerUserId}: ${event.sourceText}`);
  if (event.translationTexts) {
    Object.entries(event.translationTexts).forEach(([lang, text]) => {
      console.log(`  ${lang}: ${text}`);
    });
  }
});
```

### Listen for State Changes

Listen to the `REALTIME_TRANSCRIBER_STATE_CHANGED` event to receive transcription task state changes.

```javascript
trtc.on(TRTC.EVENT.REALTIME_TRANSCRIBER_STATE_CHANGED, (event) => {
  console.log(`Transcription state: ${event.state}, robotId: ${event.transcriberRobotId}`);
});
```

### Stop Plugin

```javascript
await trtc.stopPlugin('RealtimeTranscriber', { transcriberRobotId });
```

## Usage Examples

### ASR Scenario: Transcribe Audio to Text

```javascript
// Start transcription task
const robotId = await trtc.startPlugin('RealtimeTranscriber', {
  sourceLanguage: 'zh'
});

// Listen for transcription messages
trtc.on(TRTC.EVENT.REALTIME_TRANSCRIBER_MESSAGE, (data) => {
  console.log(data.speakerUserId + ' says: ' + data.sourceText);
});
```

### Translation Scenario: Translate Specific User's Speech into Multiple Languages

```javascript
// Start transcription task, transcribe userA's speech and translate to French and English
const robotId = await trtc.startPlugin('RealtimeTranscriber', {
  sourceLanguage: 'zh',
  translationLanguages: ['fr', 'en'],
  userIdsToTranscribe: 'userA'
});

// Listen for transcription messages
trtc.on(TRTC.EVENT.REALTIME_TRANSCRIBER_MESSAGE, (data) => {
  console.log(`👤 ${data.speakerUserId}:`);
  console.log(`  Original: ${data.sourceText}`);

  if (data.translationTexts) {
    Object.entries(data.translationTexts).forEach(([lang, text]) => {
      console.log(`  ${lang.toUpperCase()}: ${text}`);
    });
  }
});
```

### Transcribe Multiple Specific Users

```javascript
const robotId = await trtc.startPlugin('RealtimeTranscriber', {
  sourceLanguage: 'en',
  translationLanguages: ['zh', 'ja'],
  userIdsToTranscribe: ['userA', 'userB', 'userC']
});
```

## API Reference

### trtc.startPlugin('RealtimeTranscriber', options)

Starts a real-time transcription task.

**options: RealtimeTranscriberStartOptions**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| sourceLanguage | `string` | Required | Source language code, currently supports only `'zh'` and `'en'` |
| translationLanguages | `string` \| `string[]` | Optional | Target translation language(s), supports single language or array, e.g., `'en'` or `['en', 'ja']` |
| userIdsToTranscribe | `string` \| `string[]` | Optional | User ID(s) to transcribe, defaults to `'all'` for all users, can also specify single or multiple user IDs |
| transcriberRobotId | `string` | Optional | Custom transcriber robot ID, auto-generated if not provided |

**Returns: Promise\<string\>**

Returns the `transcriberRobotId` for the transcription task, used to stop the task later.

**Example:**

```javascript
const robotId = await trtc.startPlugin('RealtimeTranscriber', {
  sourceLanguage: 'zh',
  translationLanguages: ['en', 'ja'],
  userIdsToTranscribe: 'all',
});
```

### trtc.stopPlugin('RealtimeTranscriber', options)

Stops a real-time transcription task.

**options**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| transcriberRobotId | `string` | Required | The transcriber robot ID returned when starting |

**Example:**

```javascript
await trtc.stopPlugin('RealtimeTranscriber', { transcriberRobotId: robotId });
```

## Event Reference

### TRTC.EVENT.REALTIME_TRANSCRIBER_STATE_CHANGED

Transcription task state change event.

**RealtimeTranscriberStateEvent**

| Name | Type | Description |
|------|------|-------------|
| state | `'started'` \| `'stopped'` | Transcription task state |
| roomId | `string` \| `number` | Room ID |
| transcriberRobotId | `string` | Transcriber robot ID |
| sourceLanguage | `string` | Source language (optional) |
| error | `number` | Error code (optional) |
| errorMessage | `string` | Error message (optional) |

**Example:**

```javascript
trtc.on(TRTC.EVENT.REALTIME_TRANSCRIBER_STATE_CHANGED, (event) => {
  if (event.state === 'started') {
    console.log('Transcription task started');
  } else if (event.state === 'stopped') {
    console.log('Transcription task stopped');
  }
});
```

### TRTC.EVENT.REALTIME_TRANSCRIBER_MESSAGE

Transcription message event, triggered when new transcription results are available.

**RealtimeTranscriberMessageEvent**

| Name | Type | Description |
|------|------|-------------|
| segmentId | `string` | Speech segment ID, used to identify a continuous speech segment |
| speakerUserId | `string` | Speaker's user ID |
| sourceText | `string` | Transcribed source text |
| translationTexts | `Array<{ language: string, text: string }>` | Translation texts array, e.g., `[{ language: 'en', text: 'hello' }, { language: 'ja', text: 'こんにちは' }]` |
| timestamp | `number` | Timestamp |
| isCompleted | `boolean` | Whether the speech segment is completed. `false` indicates intermediate result (real-time update), `true` indicates final result |
| robotId | `string` | Transcriber robot ID |

**Example:**

```javascript
trtc.on(TRTC.EVENT.REALTIME_TRANSCRIBER_MESSAGE, (event) => {
  const { speakerUserId, sourceText, translationTexts, isCompleted } = event;

  // Display real-time transcription result
  console.log(`[${isCompleted ? 'Completed' : 'In Progress'}] ${speakerUserId}: ${sourceText}`);

  // Display translation results
  if (translationTexts) {
    translationTexts.forEach(({ language, text }) => {
      console.log(`  ${language}: ${text}`);
    });
  }
});

// Remove listener
trtc.off(TRTC.EVENT.REALTIME_TRANSCRIBER_MESSAGE, handler);
```

## Supported Languages

### ASR Source Languages

| Language | Code |
|----------|------|
| Chinese | `zh` |
| English | `en` |

<!--
| Traditional Chinese | `zh-tw` |
| Chinese Dialects | `zh-dialect` |
| Cantonese | `zh-yue` |
| Vietnamese | `vi` |
| Japanese | `ja` |
| Korean | `ko` |
| Indonesian | `id` |
| Thai | `th` |
| Portuguese | `pt` |
| Turkish | `tr` |
| Arabic | `ar` |
| Spanish | `es` |
| Hindi | `hi` |
| French | `fr` |
| Malay | `ms` |
| Filipino | `fil` |
| German | `de` |
| Italian | `it` |
| Russian | `ru` |
| Swedish | `sv` |
| Danish | `da` |
| Norwegian | `no` |
-->

### Translation Target Languages

| Language | Code |
|----------|------|
| Chinese | `zh` |
| English | `en` |
| Vietnamese | `vi` |
| Japanese | `ja` |
| Korean | `ko` |
| Indonesian | `id` |
| Thai | `th` |
| Portuguese | `pt` |
| Arabic | `ar` |
| Spanish | `es` |
| French | `fr` |
| Malay | `ms` |
| German | `de` |
| Italian | `it` |
| Russian | `ru` |

## FAQ

**1. How to distinguish between intermediate and final results?**

Use the `isCompleted` field in the `REALTIME_TRANSCRIBER_MESSAGE` event. When `isCompleted` is `false`, it indicates an intermediate result (real-time update); when `isCompleted` is `true`, it indicates the speech segment is completed with the final result.

```javascript
trtc.on(TRTC.EVENT.REALTIME_TRANSCRIBER_MESSAGE, (event) => {
  if (event.isCompleted) {
    // Final result, can be stored or displayed
    saveSubtitle(event);
  } else {
    // Intermediate result, can update UI in real-time
    updateLiveCaption(event);
  }
});
```

**2. How to merge subtitles by segmentId?**

Each continuous speech segment has the same `segmentId`, which can be used to update and merge subtitles:

```javascript
const subtitleMap = new Map();

trtc.on(TRTC.EVENT.REALTIME_TRANSCRIBER_MESSAGE, (event) => {
  subtitleMap.set(event.segmentId, event);

  if (event.isCompleted) {
    // Speech segment completed, can be archived
    archiveSubtitle(subtitleMap.get(event.segmentId));
  }
});
```

**3. How to save bandwidth?**

When you don't need to receive transcription messages, remove all listeners for the `REALTIME_TRANSCRIBER_MESSAGE` event, and the plugin will automatically pause receiving messages to save bandwidth. When listeners are added again, message receiving will automatically resume.
