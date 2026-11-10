---
sync_node_id: '217127958196359168'
nav_path:
  - "直播与语聊 SDK"
  - "高级功能"
  - "AI 字幕"
product: "live"
---
This document explains how to integrate the AI Subtitles feature in **TUILiveKit**. With AI Subtitles, you can convert real-time audio in a room into text subtitles after entering the room, and instantly translate recognized speech into multiple target languages. This enables seamless cross-language communication for users from different language backgrounds.

> **Note:**
> - AI Subtitles currently support real-time speech-to-text and multi-language translation. Simultaneous interpretation is not yet available in **TUILiveKit**, but will be supported in future releases.
> - After you [activate the service](https://trtc.io/document/69002), using the AI Subtitles feature will incur corresponding charges. For detailed billing rules, see [AI Speech Billing Description](https://trtc.io/document/67832).

## Core Concepts

The following are core concepts about AI Subtitles:

|Concept|Description|
|---------|---------|
|**SourceLanguage**|Specifies the language to be recognized for speech-to-text. Supports 20 languages, including Chinese-English mixed recognition. .|
|**TranslationLanguage**|When translation is enabled, this parameter specifies the language for translated subtitles. .|
|**TranscriberMessage**|Represents a single subtitle message for a continuous speech segment from a speaker. Contains the original text, translation, speaker information, and completion status.|
|**TranscriberState**|Represents the real-time state of the subtitle module. Subscribe to this state to display the subtitle list and running status in your UI.|

## Environment Setup

AI Subtitles are provided via the `AITranscriberStore` interface in the **AtomicXCore** SDK. Before using the interface, ensure the **AtomicXCore** SDK is integrated with your platform and you have successfully entered a room.

【Android】
- Integrate the `atomicxcore` dependency and import `io.trtc.tuikit.atomicxcore.api.ai.AITranscriberStore` in your project.

- Enter a room (using `startLive` or `joinLive`) before calling subtitle-related interfaces.

【iOS】
- Integrate `AtomicXCore` via CocoaPods and import `AtomicXCore` in your source code.

- Enter a room (using `startLive` or `joinLive`) before calling subtitle-related interfaces.

【Flutter】
- Add the `atomic_x_core` dependency in `pubspec.yaml`.

- Enter a room (using `startLive` or `joinLive`) before calling subtitle-related interfaces.

【Web】
- Integrate the `tuikit-atomicx-vue3` dependency and import  `useAITranscriberStateLive` in your project.

- Enter a room (using `startLive` or `joinLive`) before calling subtitle-related interfaces.

## Create an AITranscriberStore Instance

Manage AI Subtitles using `AITranscriberStore`. Use the factory method to create an instance by room ID. Multiple calls with the same room ID will return the same instance.

【Android】
``` kotlin
import io.trtc.tuikit.atomicxcore.api.ai.AITranscriberStore

// Create an instance by room ID (multiple calls with the same room return the same instance)
val transcriberStore = AITranscriberStore.create("your_room_id")
```

【iOS】
``` swift
import AtomicXCore

// Create an instance by room ID (multiple calls with the same room return the same instance)
let transcriberStore = AITranscriberStore.create(roomID: "your_room_id")
```

【Flutter】
``` dart
import 'package:atomic_x_core/api/ai/ai_transcriber_store.dart';

// Create an instance by room ID (multiple calls with the same room return the same instance)
final transcriberStore = AITranscriberStore.create("your_room_id");
```

【Web】

On the `Web`, you can utilize AI captioning capabilities via the `useAITranscriberStateLive Composable` provided by `tuikit-atomicx-vue3`, without needing to manually create an instance using a room ID. Simply call this hook within a component to access captioning status and control methods; it automatically associates with the current room.
``` typescript
import { useAITranscriberStateLive } from 'tuikit-atomicx-vue3';

// Called within the component's `setup` to retrieve state and action methods 
// (the same state is shared within the same room).
const {
  myLanguage,
  realtimeMessageList,
  isTranscriptionRunning,
  transcriptionConfig,
  startTranscription,
  updateTranscription,
  stopTranscription,
} = useAITranscriberStateLive();
```

## Subscribe to Subtitle State

Real-time subtitle data—including message list, running status, and configuration—is exposed via state publishers (State / StateFlow / ValueListenable). Subscribe before enabling subtitles to ensure timely UI updates.

### State Field Descriptions

|Field|Type|Description|
|---------|---------|---------|
|`selfLanguage`|`SourceLanguage`|Source language set by the current user|
|`realtimeMessageList`|`List`|Real-time subtitle message list, updated automatically as transcription progresses|
|`isTranscriptionRunning`|`Bool`|Indicates if the transcription service is running|
|`transcriptionConfig`|`TranscriptionConfig`|Current transcription configuration|

### Subscription Example

【Android】
``` kotlin
import kotlinx.coroutines.launch
import androidx.lifecycle.lifecycleScope
import io.trtc.tuikit.atomicxcore.api.ai.AITranscriberStore

// Subscribe to real-time subtitle message list
lifecycleScope.launch {
    transcriberStore.transcriberState.realtimeMessageList.collect { messages ->
        messages.forEach { message ->
            println("Speaker: ${message.speakerUserName}")
            println("Source text: ${message.sourceText}")
            message.translationTexts.forEach { (lang, text) ->
                println("Translation[$lang]: $text")
            }
        }
    }
}

// Subscribe to transcription running status
lifecycleScope.launch {
    transcriberStore.transcriberState.isTranscriptionRunning.collect { running ->
        println("Transcription running: $running")
    }
}
```

【iOS】
``` swift
// Subscribe to overall subtitle state
transcriberStore.state.subscribe { state in
    for message in state.realtimeMessageList {
        print("Speaker: \(message.speakerUserName)")
        print("Source text: \(message.sourceText)")
        for (lang, text) in message.translationTexts {
            print("Translation[\(lang)]: \(text)")
        }
    }
    print("Transcription running: \(state.isTranscriptionRunning)")
}
```

【Flutter】
``` dart
import 'package:atomic_x_core/api/ai/ai_transcriber_store.dart';

// Subscribe to real-time subtitle message list
transcriberStore.transcriberState.realtimeMessageList.addListener(() {
    final messages = transcriberStore.transcriberState.realtimeMessageList.value;
    for (final message in messages) {
        print("Speaker: ${message.speakerUserName}");
        print("Source text: ${message.sourceText}");
        message.translationTexts.forEach((lang, text) {
            print("Translation[$lang]: $text");
        });
    }
});

// Subscribe to transcription running status
transcriberStore.transcriberState.isTranscriptionRunning.addListener(() {
    final running = transcriberStore.transcriberState.isTranscriptionRunning.value;
    print("Transcription running: $running");
});
```

【Web】

On the `Web`, the subtitle status is exposed as `Vue` reactive data `(ref)` ，allowing it to be rendered directly in templates or monitored for changes using `watch`.
``` typescript
import { watch } from 'vue';
import { useAITranscriberStateLive } from 'tuikit-atomicx-vue3';

const {
  realtimeMessageList,
  isTranscriptionRunning,
} = useAITranscriberStateLive();

// Subscribe to the real-time subtitle message list.
watch(realtimeMessageList, (messages) => {
  messages.forEach((message) => {
    console.log(`Speaker: ${message.speakerUserName}`);
    console.log(`Source text: ${message.sourceText}`);
    Object.entries(message.translationTexts).forEach(([lang, text]) => {
      console.log(`Translation[${lang}]: ${text}`);
    });
  });
});

// Subscribe to transcribe running status
watch(isTranscriptionRunning, (running) => {
  console.log(`Transcription running: ${running}`);
});
```

## Enable AI Subtitles

After creating the instance and subscribing to state, call `startTranscription` to enable real-time transcription. To enable translation, set `enableTranslation` to `true` in `TranscriptionConfig`.

Once AI Subtitles are enabled, the system generates transcription content from anchor audio streams. If translation is enabled, translations are generated based on the speaker's source language and the configured target language. Keep the following in mind:
- **Translation is shown only when languages differ**

   Translated captions appear only when another on-mic user’s source language is different from yours.

   `myLanguage` is the caption language the current user wants to see. It is also used as the default language for that user’s own speech.

   Example: The room owner turns on captions and translation, and sets myLanguage to English. If they are the only person on the mic and they start speaking, the system treats their speech as English. They will see the original transcript only — the system will not generate a second “English translation” of English speech.

   To verify translation, have another on-mic user speak a different language. For example, if an on-mic audience member speaks Chinese, the room owner will see that member’s original transcript plus the corresponding translation.

- **On-mic users should declare their spoken language**

    `myLanguage` declares the language the current user is speaking. Passing a value that matches their actual speech improves recognition accuracy.

    If an on-mic user never sets `myLanguage` through the API, the system falls back to that device’s system language. Captions can still appear after AI captions are enabled, even without an explicit language setting. For better accuracy, prompt users to select or pass the language they usually speak.

- **Audience members enabling subtitles do not trigger transcription tasks, but can add translation tasks.**

    When an off-mic audience member enables captions, they only subscribe to transcription results that already exist in the room. This does not start a new transcription task, and it does not send a transcription bot into the room to pull on-mic audio.

    If an on-mic user has already enabled captions and a transcription task is running, an off-mic audience member will see those captions as soon as they enable captions themselves. They can also turn on translation; the system then adds a translation task for that viewer on top of the existing transcription results.

   > **Note:**
   > 
   > The source language `myLanguage` specifies the subtitle language you want to see and serves as the recognition language for your speech. We recommend passing the language you use. When translation is enabled, the system translates speech from other anchors into your `myLanguage`.
   > 

   

【Android】
``` kotlin
import io.trtc.tuikit.atomicxcore.api.ai.SourceLanguage
import io.trtc.tuikit.atomicxcore.api.ai.TranscriptionConfig
import io.trtc.tuikit.atomicxcore.api.ai.AITranscriberStore

// 1. Configure transcription parameters: enable translation
val config = TranscriptionConfig(enableTranslation = true)

// 2. Start transcription, specifying source language as Chinese-English mixed
transcriberStore.startTranscription(
    myLanguage = SourceLanguage.CHINESE_ENGLISH,
    config = config
) { code, message ->
    if (code != 0) {
        println("Start transcription failed: $message")
    } else {
        println("Start transcription success")
    }
}
```

【iOS】
``` swift
import AtomicXCore

// 1. Configure transcription parameters: enable translation
let config = TranscriptionConfig(enableTranslation: true)

// 2. Start transcription, specifying source language as Chinese-English mixed
transcriberStore.startTranscription(myLanguage: .chineseEnglish, config: config) { error in
    if let error = error {
        print("Start transcription failed: \(error)")
    } else {
        print("Start transcription success")
    }
}
```

【Flutter】
``` dart
import 'package:atomic_x_core/api/ai/ai_transcriber_store.dart';

// 1. Configure transcription parameters: enable translation
final config = TranscriptionConfig(enableTranslation: true);

// 2. Start transcription, specifying source language as Chinese-English mixed
final result = await transcriberStore.startTranscription(
    SourceLanguage.chineseEnglish,
    config: config,
);

if (!result.isSuccess) {
    print("Start transcription failed: ${result.errorMessage}");
} else {
    print("Start transcription success");
}
```

【Web】

On the `Web`, initiate transcription by calling `startTranscription` and passing in `myLanguage` and `config`. The method returns a `Promise`, allowing you to handle the result using `try/catch`.
``` typescript
import { useAITranscriberStateLive } from 'tuikit-atomicx-vue3';

const { startTranscription } = useAITranscriberStateLive();

// Enable transcription, specify the source language as mixed Chinese and English, and enable translation.
try {
  await startTranscription({
    myLanguage: 'zh_en',
    config: { enableTranslation: true },
  });
  console.log('Start transcription success');
} catch (error) {
  console.error('Start transcription failed:', error);
}
```

## Updating Subtitle Configuration

While the transcription service is running, call `updateTranscription` to change the source language or toggle translation without stopping the service.

【Android】
``` kotlin
import io.trtc.tuikit.atomicxcore.api.ai.SourceLanguage
import io.trtc.tuikit.atomicxcore.api.ai.TranscriptionConfig
import io.trtc.tuikit.atomicxcore.api.ai.AITranscriberStore

// Switch source language to English and disable translation while running
val newConfig = TranscriptionConfig(enableTranslation = false)
transcriberStore.updateTranscription(
    myLanguage = SourceLanguage.ENGLISH,
    config = newConfig
) { code, message ->
    if (code != 0) {
        println("Update transcription failed: $message")
    }
}
```

【iOS】
``` swift
import AtomicXCore

// Switch source language to English and disable translation while running
var newConfig = TranscriptionConfig(enableTranslation: false)
transcriberStore.updateTranscription(myLanguage: .english, config: newConfig) { error in
    if let error = error {
        print("Update transcription failed: \(error)")
    }
}
```

【Flutter】
``` dart
import 'package:atomic_x_core/api/ai/ai_transcriber_store.dart';

// Switch source language to English and disable translation while running
final newConfig = TranscriptionConfig(enableTranslation: false);
final result = await transcriberStore.updateTranscription(
    SourceLanguage.english,
    config: newConfig,
);

if (!result.isSuccess) {
    print("Update transcription failed: ${result.errorMessage}");
}
```

【Web】
``` typescript
import { useAITranscriberStateLive } from 'tuikit-atomicx-vue3';

const { updateTranscription } = useAITranscriberStateLive();

// Switch the source language to English while running, and turn off translation.
try {
  await updateTranscription({
    myLanguage: 'en',
    config: { enableTranslation: false },
  });
} catch (error) {
  console.error('Update transcription failed:', error);
}
```

## Stop AI Subtitles

Call `stopTranscription` to stop the transcription service. Once stopped, the transcription bot will no longer recognize speech, and the subtitle message list will stop updating.

【Android】
``` kotlin
import io.trtc.tuikit.atomicxcore.api.ai.AITranscriberStore

transcriberStore.stopTranscription { code, message ->
    if (code != 0) {
        println("Stop transcription failed: $message")
    } else {
        println("Stop transcription success")
    }
}
```

【iOS】
``` swift
import AtomicXCore

transcriberStore.stopTranscription { error in
    if let error = error {
        print("Stop transcription failed: \(error)")
    } else {
        print("Stop transcription success")
    }
}
```

【Flutter】
``` dart
import 'package:atomic_x_core/api/ai/ai_transcriber_store.dart';

final result = await transcriberStore.stopTranscription();

if (!result.isSuccess) {
    print("Stop transcription failed: ${result.errorMessage}");
} else {
    print("Stop transcription success");
}
```

【Web】
``` typescript
import { useAITranscriberStateLive } from 'tuikit-atomicx-vue3';

const { stopTranscription } = useAITranscriberStateLive();

try {
  await stopTranscription();
  console.log('Stop transcription success');
} catch (error) {
  console.error('Stop transcription failed:', error);
}
```

## Subtitle Message Structure

Each subtitle message represents a continuous speech segment from a speaker, with the following structure:

|Property|Type|Description|
|---------|---------|---------|
|`segmentID`|`String`|Unique identifier for the subtitle segment|
|`speakerUserID`|`String`|User ID of the speaker|
|`speakerUserName`|`String`|Nickname of the speaker|
|`sourceText`|`String`|Recognized original text|
|`translationTexts`|`Map`|Translated text in target languages|
|`timestamp`|`Int / Long`|Message timestamp|
|`isCompleted`|`Bool`|Indicates whether the speech segment has ended. When `true`, original and translated texts stop updating|

> **Note:**
> - While a speech segment is active, `sourceText` and `translationTexts` are continuously updated. When `isCompleted` is `true`, the segment has ended. We recommend updating the UI for active segments in real time and archiving completed segments as history.
> - `translationTexts` contains a single key-value pair, where the key matches the `TranslationLanguage` corresponding to the `myLanguage` parameter. Access it by key or print the map directly.

## Complete Usage Example

The following example shows the full workflow: creating an instance, subscribing to state, and enabling subtitles.

【Android】
``` kotlin
import io.trtc.tuikit.atomicxcore.api.ai.AITranscriberStore
import io.trtc.tuikit.atomicxcore.api.ai.SourceLanguage
import io.trtc.tuikit.atomicxcore.api.ai.TranscriptionConfig
import androidx.lifecycle.lifecycleScope
import kotlinx.coroutines.launch

fun setupAITranscriber(roomID: String) {
    // 1. Create instance
    val store = AITranscriberStore.create(roomID)

    // 2. Subscribe to subtitle messages
    lifecycleScope.launch {
        store.transcriberState.realtimeMessageList.collect { messages ->
            messages.forEach { msg ->
                Log.d("AITranscriber", "[${msg.speakerUserName}] ${msg.sourceText}")
            }
        }
    }

    // 3. Enable subtitles (with translation)
    val transConfig = TranscriptionConfig(enableTranslation = true)
    store.startTranscription(
        myLanguage = SourceLanguage.CHINESE_ENGLISH,
        config = transConfig
    ) { code, message ->
        if (code != 0) Log.e("AITranscriber", "start failed: $message")
    }
}
```

【iOS】
``` swift
import AtomicXCore

func setupAITranscriber(roomID: String) {
    // 1. Create instance
    let store = AITranscriberStore.create(roomID: roomID)

    // 2. Subscribe to subtitle state
    store.state.subscribe { state in
        for msg in state.realtimeMessageList {
            print("[\(msg.speakerUserName)] \(msg.sourceText)")
        }
    }

    // 3. Enable subtitles (with translation)
    let transConfig = TranscriptionConfig(enableTranslation: true)
    store.startTranscription(myLanguage: .chineseEnglish, config: transConfig) { error in
        if let error = error {
            print("start failed: \(error)")
        }
    }
}
```

【Flutter】
``` dart
import 'package:atomic_x_core/api/ai/ai_transcriber_store.dart';

Future<void> setupAITranscriber(String roomID) async {
    // 1. Create instance
    final store = AITranscriberStore.create(roomID);

    // 2. Subscribe to subtitle messages
    store.transcriberState.realtimeMessageList.addListener(() {
        final messages = store.transcriberState.realtimeMessageList.value;
        for (final msg in messages) {
            print("[${msg.speakerUserName}] ${msg.sourceText}");
        }
    });

    // 3. Enable subtitles (with translation)
    final transConfig = TranscriptionConfig(enableTranslation: true);
    final transResult = await store.startTranscription(
        SourceLanguage.chineseEnglish,
        config: transConfig,
    );
    if (!transResult.isSuccess) {
        print("start failed: ${transResult.errorMessage}");
    }
}
```

【Web】
``` typescript
<script setup lang="ts">
import { ref } from 'vue';
import { useAITranscriberStateLive } from 'tuikit-atomicx-vue3';

const {
  realtimeMessageList,
  isTranscriptionRunning,
  startTranscription,
  updateTranscription,
  stopTranscription,
} = useAITranscriberStateLive();

const myLanguage = ref<'zh' | 'en' | 'ja' | 'ko'>('zh');
const enableTranslation = ref(true);
const loading = ref(false);

// Turn subtitles on / off
async function handleClick() {
  if (loading.value) {
    return;
  }
  loading.value = true;
  try {
    if (isTranscriptionRunning.value) {
      await stopTranscription();
    } else {
      await startTranscription({
        myLanguage: myLanguage.value,
        config: { enableTranslation: enableTranslation.value },
      });
    }
  } catch (error: any) {
    console.error('[AITranscriber] failed:', error);
  } finally {
    loading.value = false;
  }
}

// Dynamically switch the source language at runtime.
async function handleLanguageChange(next: typeof myLanguage.value) {
  myLanguage.value = next;
  if (isTranscriptionRunning.value) {
    await updateTranscription({
      myLanguage: next,
      config: { enableTranslation: enableTranslation.value },
    });
  }
}
</script>

<template>
  <div>
    <select
      :value="myLanguage"
      @change="handleLanguageChange(($event.target as HTMLSelectElement).value as any)"
    >
      <option value="zh">Chinese</option>
      <option value="en">English</option>
      <option value="ja">Japanese</option>
      <option value="ko">Korean</option>
    </select>

    <label>
      <input v-model="enableTranslation" type="checkbox" :disabled="isTranscriptionRunning" />
      Enable translation
    </label>

    <button :disabled="loading" @click="handleClick">
      {{ isTranscriptionRunning ? 'Stop subtitle' : 'Start subtitle' }}
    </button>

    <ul>
      <li
        v-for="msg in realtimeMessageList"
        :key="msg.segmentID"
      >
        <strong>{{ msg.speakerUserName || msg.speakerUserID }}：</strong>
        <span>{{ msg.sourceText }}</span>
        <em v-if="msg.translationTexts?.[myLanguage]">
          ({{ msg.translationTexts[myLanguage] }})
        </em>
      </li>
    </ul>
  </div>
</template>
```

## Supported Languages

### Source Language List

The transcription service supports 20 source languages. Select the language that matches the speaker's actual language for best results. For Chinese-English mixed scenarios, use `chineseEnglish`.

> **Note:**
> AI Subtitles support Chinese, English, Japanese, and Korean by default. To enable other languages
> 

|Language|Value|Description|
|---------|---------|---------|
|chineseEnglish|zh_en|Chinese-English mixed|
|chinese|zh|Chinese|
|english|en|English|
|cantonese|zh-yue|Cantonese|
|vietnamese|vi|Vietnamese|
|japanese|ja|Japanese|
|korean|ko|Korean|
|indonesian|id|Indonesian|
|thai|th|Thai|
|portuguese|pt|Portuguese|
|turkish|tr|Turkish|
|arabic|ar|Arabic|
|spanish|es|Spanish|
|hindi|hi|Hindi|
|french|fr|French|
|malay|ms|Malay|
|filipino|fil|Filipino|
|german|de|German|
|italian|it|Italian|
|russian|ru|Russian|

### Translation Language List

Transcribed text can be translated in real time into the following 15 target languages.

|Language|Value|Description|
|---------|---------|---------|
|chinese|zh|Chinese|
|english|en|English|
|vietnamese|vi|Vietnamese|
|japanese|ja|Japanese|
|korean|ko|Korean|
|indonesian|id|Indonesian|
|thai|th|Thai|
|portuguese|pt|Portuguese|
|arabic|ar|Arabic|
|spanish|es|Spanish|
|french|fr|French|
|malay|ms|Malay|
|german|de|German|
|italian|it|Italian|
|russian|ru|Russian|

## FAQs

### Unable to enable subtitles: error reported when calling startTranscription

Please check the following prerequisites:
1. The current SDKAppID may not have activated the AI speech service. Activate the capability in the console.

2. You have successfully entered the room (room status is connected). AI Subtitles are only available in-room.

3. The source language `myLanguage` is correctly set and within the supported language list.

4. There is at least one valid audio stream in the room; otherwise, the transcription bot has no speech to recognize.

### Why do I only see the original text after enabling translation, but not the translated text?

Check whether there are anchors speaking in other languages.

`myLanguage` specifies the subtitle language you want to see and serves as the default for your spoken language.

For example, if the host enables subtitles and translation, sets `myLanguage` to English, and only the host or all anchors have `myLanguage` set to English, the system assumes all anchors are speaking English and only returns the original text—not a translated English version.

To see translation, have another anchor speak in a different language. For instance, if a Chinese audience member takes a mic seat and speaks, the host will see both the original and translated text.

### Can anchors use AI Subtitles without setting `myLanguage`?

Yes. If anchors do not explicitly set `myLanguage`, the system defaults to their device system language. Users will still see subtitles after enabling AI Subtitles.

However, the device system language may not match the user's actual spoken language. For better recognition accuracy, guide users to select or set their actual spoken language.

### Why do audience members see no content after enabling subtitles or translation?
1. Enabling subtitles as an audience member does not trigger a transcription task. Only when an anchor has enabled AI Subtitles and a transcription task is running in the room will audience members receive subtitle content after enabling subtitles.

2. If no anchor has enabled subtitles, audience members enabling subtitles alone will not see any content, as there are no transcription results to subscribe to.

3. When a transcription task is running, audience members can enable translation in addition to receiving original subtitles. The system will add a translation task for them based on existing transcription results.

### Subtitle messages are not updating, and realtimeMessageList is empty.

Please verify:
1. There are members speaking in the room (with audio upstream).

2. You have subscribed correctly to the `realtimeMessageList` state, and the subscription timing is before or at the same time as enabling transcription.

3. The transcription service is running (`isTranscriptionRunning` is `true`).

### Are historical subtitles retained after switching the source language during transcription?

Switching the source language does not clear historical subtitle messages. Historical messages remain unchanged, and new speech segments are recognized using the new source language. If you wish to clear the display, handle the list data in your UI as needed.
