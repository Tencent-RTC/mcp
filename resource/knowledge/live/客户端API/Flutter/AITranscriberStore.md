---
sync_node_id: '216225354621444096'
nav_path:
  - "直播与语聊 SDK"
  - "客户端 API"
  - "Flutter"
  - "AITranscriberStore"
product: "live"
---
## Introduction

`AITranscriberStore` provides a complete set of AI real-time transcription management APIs, including starting, updating, and stopping real-time transcription. Through this class, you can implement real-time speech-to-text transcription with multi-language translation support during audio/video calls or live streaming.

> **Important:** 
> Use the **create** factory method to create an `AITranscriberStore` instance for a specific room. Configure the source language and translation languages before starting transcription.
> 

> **Note:** 
> Transcription state updates are delivered through the **transcriberState** publisher. Subscribe to it to receive real-time transcription messages.
> 

## Features
- **Real-time Transcription**: Supports real-time speech-to-text transcription during audio/video sessions.

- **Multi-language Source**: Supports 20 source languages including Chinese, English, Japanese, Korean, etc.

- **Real-time Translation**: Supports translating transcribed text into 15 target languages in real-time.

- **State Management**: Provides real-time message list state for UI display.

## Subscribable Data

**TranscriberState** fields are described below:

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|selfLanguage|ValueListenable<SourceLanguage>|Current user's self language.|
|realtimeMessageList|ValueListenable<List<TranscriberMessage>>|List of real-time transcription messages, updated automatically as transcription progresses.|
|isTranscriptionRunning|ValueListenable<bool>|Whether transcription is currently running.|
|transcriptionConfig|ValueListenable<TranscriptionConfig>|Current transcription configuration.|
|isInterpretationRunning|ValueListenable<bool>|Whether interpretation is currently running.|
|interpretationConfig|ValueListenable<InterpretationConfig>|Current interpretation configuration.|
|interpretationVolume|ValueListenable<int>|Current interpretation volume level.|

## API List

|**Function**|**Description**|
|---------|---------|
|create|Create an instance for a specific room.|
|startTranscription|Start transcription.|
|updateTranscription|Update transcription configuration.|
|stopTranscription|Stop transcription.|
|startInterpretation|Start interpretation.|
|updateInterpretation|Update interpretation configuration.|
|stopInterpretation|Stop interpretation.|
|setInterpretationVolume|Set interpretation volume.|

### Getting Instance

#### create

Create an AITranscriberStore instance for a specific room.
``` dart
static AITranscriberStore create(String roomID) {
  return StoreFactory.shared.getStore<AITranscriberStore>(roomID: roomID);
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|

### Transcription Control

#### startTranscription

Start transcription.
``` dart
Future<CompletionHandler> startTranscription(SourceLanguage myLanguage, {TranscriptionConfig? config});
```

Start the AI transcription service with the specified language and configuration.
Once started, the transcriber will recognize speech in the room and provide real-time transcription results through the state publisher.

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|myLanguage|SourceLanguage|The source language for the current user's speech recognition.|
|config|TranscriptionConfig|Transcription configuration, including whether to enable translation.|

#### updateTranscription

Update transcription configuration.
``` dart
Future<CompletionHandler> updateTranscription(SourceLanguage myLanguage, {TranscriptionConfig? config});
```

Update the configuration of the ongoing transcription service.
This can be used to change the source language or modify the translation settings without stopping and restarting the transcription.

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|myLanguage|SourceLanguage|The new source language for speech recognition.|
|config|TranscriptionConfig|New transcription configuration.|

#### stopTranscription

Stop transcription.
``` dart
Future<CompletionHandler> stopTranscription();
```

Stop the ongoing AI transcription service. After stopping, the transcriber will no longer recognize speech or provide transcription results.

**Version**

Supported since version 3.5.

### Interpretation Control

#### startInterpretation

Start interpretation.
``` dart
Future<CompletionHandler> startInterpretation(SourceLanguage myLanguage, {InterpretationConfig? config});
```

Start the AI interpretation service with the specified language and configuration.
Once started, the interpreter will provide real-time voice interpretation in the room.

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|myLanguage|SourceLanguage|The source language for interpretation.|
|config|InterpretationConfig|Interpretation configuration, including voice type.|

#### updateInterpretation

Update interpretation configuration.
``` dart
Future<CompletionHandler> updateInterpretation(SourceLanguage myLanguage, {InterpretationConfig? config});
```

Update the configuration of the ongoing interpretation service.

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|myLanguage|SourceLanguage|The new source language for interpretation.|
|config|InterpretationConfig|New interpretation configuration.|

#### stopInterpretation

Stop interpretation.
``` dart
Future<CompletionHandler> stopInterpretation();
```

Stop the ongoing AI interpretation service.

**Version**

Supported since version 3.5.

#### setInterpretationVolume

Set interpretation volume.
``` dart
Future<CompletionHandler> setInterpretationVolume(int volume);
```

Set the volume level for the interpretation audio output.

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|volume|int|Volume level.|

## Data Structures

### AITranscriberStoreListener

AI transcriber event callback.

> **Warning:** 
> Deprecated: Use transcriberState to observe state changes instead
> 

**Methods**

|**Method**|**Description**|
|---------|---------|
|onReceiveTranscriberMessage|Triggered when a new transcription message is received.|
|onRealtimeTranscriberStarted|Triggered when the real-time transcription service has been started successfully.|
|onRealtimeTranscriberStopped|Triggered when the real-time transcription service has been stopped.|
|onRealtimeTranscriberError|Triggered when an error occurs during real-time transcription.|

### SourceLanguage

Source language type for transcription recognition.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|chineseEnglish|zh_en|Chinese-English mixed recognition.|
|chinese|zh|Chinese.|
|english|en|English.|
|cantonese|zh-yue|Cantonese.|
|vietnamese|vi|Vietnamese.|
|japanese|ja|Japanese.|
|korean|ko|Korean.|
|indonesian|id|Indonesian.|
|thai|th|Thai.|
|portuguese|pt|Portuguese.|
|turkish|tr|Turkish.|
|arabic|ar|Arabic.|
|spanish|es|Spanish.|
|hindi|hi|Hindi.|
|french|fr|French.|
|malay|ms|Malay.|
|filipino|fil|Filipino.|
|german|de|German.|
|italian|it|Italian.|
|russian|ru|Russian.|

### TranslationLanguage

Target language type for translation.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|chinese|zh|Chinese.|
|english|en|English.|
|vietnamese|vi|Vietnamese.|
|japanese|ja|Japanese.|
|korean|ko|Korean.|
|indonesian|id|Indonesian.|
|thai|th|Thai.|
|portuguese|pt|Portuguese.|
|arabic|ar|Arabic.|
|spanish|es|Spanish.|
|french|fr|French.|
|malay|ms|Malay.|
|german|de|German.|
|italian|it|Italian.|
|russian|ru|Russian.|

### InterpretationVoice

Voice type for interpretation.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|female|female|Female voice.|
|male|male|Male voice.|

### TranscriberMessage

Transcription message, representing a single segment of transcribed speech.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|segmentId|String|Unique identifier of the transcription segment.|
|speakerUserId|String|User ID of the speaker.|
|speakerUserName|String|Display name of the speaker.|
|sourceText|String|Original transcribed text from the speech recognition.|
|translationTexts|Map<TranslationLanguage, String>|Translation results, keyed by target language. Contains translation texts for each configured translation language.|
|timestamp|int|Timestamp of the message.|
|isCompleted|bool|Whether the segment transcription is completed. When `true`, the source text and translation texts will no longer be updated.|

### TranscriptionConfig

Configuration for transcription features.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|enableTranslation|bool|Whether to enable translation during transcription.|

### InterpretationConfig

Configuration for interpretation features.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|voice|InterpretationVoice|Voice type for interpretation output.|

### TranscriberConfig

Transcription configuration, used to configure source language and translation languages.

> **Warning:** 
> Deprecated: Use TranscriptionConfig or InterpretationConfig instead
> 

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|sourceLanguage|SourceLanguage|Source language for speech recognition, defaults to Chinese-English mixed.|
|translationLanguages|List<TranslationLanguage>|List of target languages for translation. Multiple languages can be configured simultaneously.|

### TranscriberState

Transcription state data provided by AITranscriberStore.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|selfLanguage|ValueListenable<SourceLanguage>|Current user's self language.|
|realtimeMessageList|ValueListenable<List<TranscriberMessage>>|List of real-time transcription messages, updated automatically as transcription progresses.|
|isTranscriptionRunning|ValueListenable<bool>|Whether transcription is currently running.|
|transcriptionConfig|ValueListenable<TranscriptionConfig>|Current transcription configuration.|
|isInterpretationRunning|ValueListenable<bool>|Whether interpretation is currently running.|
|interpretationConfig|ValueListenable<InterpretationConfig>|Current interpretation configuration.|
|interpretationVolume|ValueListenable<int>|Current interpretation volume level.|

## Usage Example
``` dart
// Create instance for a specific room
final store = AITranscriberStore.create("your_room_id");
// Subscribe to state changes
store.transcriberState.realtimeMessageList.addListener(() {
    final messages = store.transcriberState.realtimeMessageList.value;
    for (final message in messages) {
        print("Speaker: ${message.speakerUserName}");
        print("Source text: ${message.sourceText}");
    }
});
// Configure transcription
final config = TranscriberConfig(
    sourceLanguage: SourceLanguage.chineseEnglish,
    translationLanguages: [TranslationLanguage.english, TranslationLanguage.japanese],
);
// Start transcription
final result = await store.startRealtimeTranscriber(config);
```
