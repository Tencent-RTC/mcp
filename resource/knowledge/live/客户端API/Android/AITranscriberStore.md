---
sync_node_id: '216225392214626304'
nav_path:
  - "直播与语聊 SDK"
  - "客户端 API"
  - "Android"
  - "AITranscriberStore"
product: "live"
---
## Introduction

`AITranscriberStore` provides a complete set of AI real-time transcription management APIs, including starting, updating, and stopping real-time transcription. Through this class, you can implement real-time speech-to-text transcription with multi-language translation support during audio/video calls or live streaming.

> **Important:** 
> Use the **AITranscriberStore.create** factory method to create an `AITranscriberStore` instance for a specific room. Configure the source language and translation languages before starting transcription.
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
|selfLanguage|StateFlow<SourceLanguage>|Current user's self language.|
|realtimeMessageList|StateFlow<List<TranscriberMessage>>|List of real-time transcription messages, updated automatically as transcription progresses.|
|isTranscriptionRunning|StateFlow<Boolean>|Whether transcription is currently running.|
|transcriptionConfig|StateFlow<TranscriptionConfig>|Current transcription configuration.|
|isInterpretationRunning|StateFlow<Boolean>|Whether interpretation is currently running.|
|interpretationConfig|StateFlow<InterpretationConfig>|Current interpretation configuration.|
|interpretationVolume|StateFlow<Int>|Current interpretation volume level.|

## API List

|**Function**|**Description**|
|---------|---------|
|AITranscriberStore.create|Create an instance for a specific room.|
|startTranscription|Start transcription.|
|updateTranscription|Update transcription configuration.|
|stopTranscription|Stop transcription.|
|startInterpretation|Start interpretation.|
|updateInterpretation|Update interpretation configuration.|
|stopInterpretation|Stop interpretation.|
|setInterpretationVolume|Set interpretation volume.|

### Getting Instance

#### AITranscriberStore.create

Create an instance for a specific room.

### Transcription Control

#### startTranscription

Start transcription.
``` kotlin
abstract fun startTranscription(myLanguage: SourceLanguage, config: TranscriptionConfig = TranscriptionConfig(), completion: CompletionHandler? = null)
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
|completion|CompletionHandler?|Completion callback (success/failure status).|

#### updateTranscription

Update transcription configuration.
``` kotlin
abstract fun updateTranscription(myLanguage: SourceLanguage, config: TranscriptionConfig = TranscriptionConfig(), completion: CompletionHandler? = null)
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
|completion|CompletionHandler?|Completion callback (success/failure status).|

#### stopTranscription

Stop transcription.
``` kotlin
abstract fun stopTranscription(completion: CompletionHandler? = null)
```

Stop the ongoing AI transcription service. After stopping, the transcriber will no longer recognize speech or provide transcription results.

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|completion|CompletionHandler?|Completion callback (success/failure status).|

### Interpretation Control

#### startInterpretation

Start interpretation.
``` kotlin
abstract fun startInterpretation(myLanguage: SourceLanguage, config: InterpretationConfig = InterpretationConfig(), completion: CompletionHandler? = null)
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
|completion|CompletionHandler?|Completion callback (success/failure status).|

#### updateInterpretation

Update interpretation configuration.
``` kotlin
abstract fun updateInterpretation(myLanguage: SourceLanguage, config: InterpretationConfig = InterpretationConfig(), completion: CompletionHandler? = null)
```

Update the configuration of the ongoing interpretation service.

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|myLanguage|SourceLanguage|The new source language for interpretation.|
|config|InterpretationConfig|New interpretation configuration.|
|completion|CompletionHandler?|Completion callback (success/failure status).|

#### stopInterpretation

Stop interpretation.
``` kotlin
abstract fun stopInterpretation(completion: CompletionHandler? = null)
```

Stop the ongoing AI interpretation service.

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|completion|CompletionHandler?|Completion callback (success/failure status).|

#### setInterpretationVolume

Set interpretation volume.
``` kotlin
abstract fun setInterpretationVolume(volume: Int, completion: CompletionHandler? = null)
```

Set the volume level for the interpretation audio output.

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|volume|Int|Volume level.|
|completion|CompletionHandler?|Completion callback (success/failure status).|

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
|CHINESE_ENGLISH|zh_en|Chinese-English mixed recognition.|
|CHINESE|zh|Chinese.|
|ENGLISH|en|English.|
|CANTONESE|zh-yue|Cantonese.|
|VIETNAMESE|vi|Vietnamese.|
|JAPANESE|ja|Japanese.|
|KOREAN|ko|Korean.|
|INDONESIAN|id|Indonesian.|
|THAI|th|Thai.|
|PORTUGUESE|pt|Portuguese.|
|TURKISH|tr|Turkish.|
|ARABIC|ar|Arabic.|
|SPANISH|es|Spanish.|
|HINDI|hi|Hindi.|
|FRENCH|fr|French.|
|MALAY|ms|Malay.|
|FILIPINO|fil|Filipino.|
|GERMAN|de|German.|
|ITALIAN|it|Italian.|
|RUSSIAN|ru|Russian.|

### TranslationLanguage

Target language type for translation.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|CHINESE|zh|Chinese.|
|ENGLISH|en|English.|
|VIETNAMESE|vi|Vietnamese.|
|JAPANESE|ja|Japanese.|
|KOREAN|ko|Korean.|
|INDONESIAN|id|Indonesian.|
|THAI|th|Thai.|
|PORTUGUESE|pt|Portuguese.|
|ARABIC|ar|Arabic.|
|SPANISH|es|Spanish.|
|FRENCH|fr|French.|
|MALAY|ms|Malay.|
|GERMAN|de|German.|
|ITALIAN|it|Italian.|
|RUSSIAN|ru|Russian.|

### InterpretationVoice

Voice type for interpretation.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|FEMALE|female|Female voice.|
|MALE|male|Male voice.|

### TranscriberMessage

Transcription message, representing a single segment of transcribed speech.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|segmentId|String|Unique identifier of the transcription segment.|
|speakerUserId|String|User ID of the speaker.|
|speakerUserName|String|Display name of the speaker.|
|sourceText|String|Original transcribed text from the speech recognition.|
|translationTexts|MutableMap<TranslationLanguage, String>|Translation results, keyed by target language. Contains translation texts for each configured translation language.|
|timestamp|Long|Timestamp of the message.|
|isCompleted|Boolean|Whether the segment transcription is completed. When `true`, the source text and translation texts will no longer be updated.|

### TranscriptionConfig

Configuration for transcription features.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|enableTranslation|Boolean|Whether to enable translation during transcription.|

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
|translationLanguages|MutableList<TranslationLanguage>|List of target languages for translation. Multiple languages can be configured simultaneously.|

### TranscriberState

Transcription state data provided by AITranscriberStore.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|selfLanguage|StateFlow<SourceLanguage>|Current user's self language.|
|realtimeMessageList|StateFlow<List<TranscriberMessage>>|List of real-time transcription messages, updated automatically as transcription progresses.|
|isTranscriptionRunning|StateFlow<Boolean>|Whether transcription is currently running.|
|transcriptionConfig|StateFlow<TranscriptionConfig>|Current transcription configuration.|
|isInterpretationRunning|StateFlow<Boolean>|Whether interpretation is currently running.|
|interpretationConfig|StateFlow<InterpretationConfig>|Current interpretation configuration.|
|interpretationVolume|StateFlow<Int>|Current interpretation volume level.|

## Usage Example
``` kotlin
// Create instance for a specific room
val store = AITranscriberStore.create("your_room_id")
// Subscribe to state changes
lifecycleScope.launch {
    store.transcriberState.realtimeMessageList.collect { messages ->
        messages.forEach { message ->
            println("Speaker: ${message.speakerUserName}")
            println("Source text: ${message.sourceText}")
        }
    }
}
// Configure transcription
val config = TranscriberConfig(
    sourceLanguage = SourceLanguage.CHINESE_ENGLISH,
    translationLanguages = mutableListOf(TranslationLanguage.ENGLISH, TranslationLanguage.JAPANESE)
)
// Start transcription
store.startRealtimeTranscriber(config) { code, message ->
    if (code != 0) {
        println("Start failed: $message")
    }
}
```
