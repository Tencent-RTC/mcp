This document provides guidance on integrating audio effect controls into your live streaming application using the `AudioEffectStore` and `DeviceStore` modules from the **AtomicXCore** framework. These modules enable features such as microphone volume control, ear monitoring, and a variety of voice changing and reverb effects.

## Core Features

By combining `AudioEffectStore` and DeviceStore, you can implement the following core features:
- **Microphone Volume Adjustment**: Control the local microphone (capture) volume, which determines the volume your audience hears.

- **Ear Monitoring**: Allow hosts or co-hosts to hear their own voice in real time through headphones for monitoring and pronunciation correction.

- **Voice Effects**: Apply various voice changing effects, such as "Little Girl", "Deep Male", "Naughty Child", and more.

- **Reverb Effects**: Simulate different acoustic environments, such as KTV, metallic, deep, bright, and others.

## Core Concepts

|**Core Concept**|**Type**|**Core Responsibility & Description**|
|---------|---------|---------|
|`AudioChangerType`|`enum`|Enumerates available voice effects, such as "child", "man", etc.|
|`AudioReverbType`|`enum`|Enumerates available reverb effects, such as "ktv", "hall", etc.|
|`AudioEffectState`|`data`|Represents the current state of the audio effect module, typically used for UI rendering. Includes voice effect state, reverb state, ear monitoring enabled state, and ear monitor volume.|
|`AudioEffectStore`|`abstract`|Singleton data management class for audio effects. Use it to invoke audio effect APIs. After calling an API, the corresponding state property is automatically updated. Subscribe to this reactive state to receive and monitor updates.|
|`DeviceState`|`data`|Represents the current state of the device module, typically used for UI rendering. Core properties include camera and microphone status.|
|`DeviceStore`|`abstract`|Singleton data management class for device operations. Use it to control the camera and microphone. After calling an API, the corresponding state property is automatically updated. Subscribe to this reactive state to receive and monitor updates.|

## Implementation

### Step 1: Component Integration
- **Video Live Streaming**: Please .**

- **Voice Chat Room**: Please .

### Step 2: Obtain Store Instances

`AudioEffectStore` and `DeviceStore` are singleton objects. Access their instances anywhere in your project via the shared property. For a complete implementation example, see [AudioEffectPanel.kt](https://github.com/Tencent-RTC/TUIKit_Android/blob/main/live/tuilivekit/src/main/java/com/trtc/uikit/livekit/component/audioeffect/AudioEffectPanel.kt) in the TUILiveKit open-source UI demo.
``` java
import io.trtc.tuikit.atomicxcore.api.device.AudioEffectStore
import io.trtc.tuikit.atomicxcore.api.device.DeviceStore

val audioEffectStore = AudioEffectStore.shared()
val deviceStore = DeviceStore.shared()
```

### Step 3: Implement In-Ear Monitoring

Ear monitoring allows users to hear their own microphone audio in real time. Manage ear monitoring using the following APIs.

> **Note：**Ear monitoring typically requires headphones to function properly.
>

#### Implementation
1. **Toggle Ear Monitoring**: Use a `Switch` control to enable or disable ear monitoring.

2. **Set Ear Monitor Volume**: Use a `SeekBar` (or similar control) to adjust the ear monitor volume. Map the UI control's value to the [0, 150] range and call setVoiceEarMonitorVolume(volume).

3. **Listen for State Updates**: Subscribe to ear monitor state changes to update the UI in real time.

#### Code Example
``` java
import io.trtc.tuikit.atomicxcore.api.device.AudioEffectStore
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

// 1. Enable ear monitoring (prompt the user to connect headphones)
audioEffectStore.setVoiceEarMonitorEnable(true)

// 2. Set ear monitor volume
audioEffectStore.setVoiceEarMonitorVolume(80)

// 3. Disable ear monitoring
audioEffectStore.setVoiceEarMonitorEnable(false)

// 4. Listen for state updates
CoroutineScope(Dispatchers.Main).launch {
  audioEffectStore.audioEffectState.earMonitorVolume.collect {
    print("Ear monitor volume: $it")
    // Update UI with the value
  }
}
```

#### setVoiceEarMonitorEnable Parameters
| <strong>Parameter Name</strong> | <strong>Type</strong> | <strong>Description</strong> |
| --- | --- | --- |
| <code>enable</code> | <code>Boolean</code> | Whether to enable ear monitoring.<br>- true: Enable<br>- false: Disable |

#### setVoiceEarMonitorVolume Parameters
| <strong>Parameter Name</strong> | <strong>Type</strong> | <strong>Description</strong> |
| --- | --- | --- |
| <code>volume</code> | <code>Int</code> | Ear monitor volume.<br>- Range: [0, 150]<br>- Default: 100 |

### Step 4: Implement Microphone Volume Adjustment

To adjust the microphone (capture) volume, call `setCaptureVolume(volume)` on `DeviceStore` with the desired value.

#### Implementation
1. **Set Capture Volume**: Use a `SeekBar` or similar control to adjust the microphone volume. Map the UI control's value to the [0, 150] range and call `setCaptureVolume(volume)`.

2. **Listen for State Updates**: Subscribe to capture volume state changes to update the UI in real time.

#### Code Example
``` java
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import io.trtc.tuikit.atomicxcore.api.device.DeviceStore

// 1. Adjust microphone volume
deviceStore.setCaptureVolume(80)

// 2. Listen for volume changes
CoroutineScope(Dispatchers.Main).launch {
   deviceStore.deviceState.captureVolume.collect {
     print("Capture volume: $it")
     // Update UI with the value
   }
}
```

#### setCaptureVolume Parameters
| <strong>Parameter Name</strong> | <strong>Type</strong> | <strong>Description</strong> |
| --- | --- | --- |
| <code>volume</code> | <code>Int</code> | Microphone (capture) volume.<br>- Range: [0, 150]<br>- Default: 100 |

### Step 5: Implement Voice Effects

To apply a voice effect, call `setAudioChangerType(type)` with the desired `AudioChangerType` enum value.

#### Code Example
``` java
import io.trtc.tuikit.atomicxcore.api.device.AudioEffectStore
import io.trtc.tuikit.atomicxcore.api.device.AudioChangerType

// Set voice effect to "Little Girl"
audioEffectStore.setAudioChangerType(AudioChangerType.LITTLE_GIRL)

// Disable voice effect
audioEffectStore.setAudioChangerType(AudioChangerType.NONE)
```

#### setAudioChangerType Parameters

|**Parameter Name**|**Type**|**Description**|
|---------|---------|---------|
|`type`|`AudioChangerType`|Voice effect enum value.|

### Step 6: Implement Reverb Effects

To apply a reverb effect, call `setAudioReverbType(type)` with the desired `AudioReverbType` enum value.
``` java
import io.trtc.tuikit.atomicxcore.api.device.AudioEffectStore
import io.trtc.tuikit.atomicxcore.api.device.AudioReverbType

// Set reverb to "KTV"
audioEffectStore.setAudioReverbType(AudioReverbType.KTV)

// Disable reverb
audioEffectStore.setAudioReverbType(AudioReverbType.NONE)
```

#### setAudioReverbType Parameters

|**Parameter Name**|**Type**|**Description**|
|---------|---------|---------|
|`type`|`AudioReverbType`|Reverb effect enum value.|

### Step 7: Reset Audio Effect Settings

> **Note：**
> `AudioEffectStore` and `DeviceStore` are singletons, so audio effect and device settings are globally applied. To prevent settings from one live room affecting others, reset audio effect and device settings when the current live room ends.
>

Reset audio effect settings in the following scenarios:
1. When the current live room ends.

2. To provide a "one-click restore" feature, call the`reset()`() method on each store.

   ``` java
   import io.trtc.tuikit.atomicxcore.api.device.AudioEffectStore
   import io.trtc.tuikit.atomicxcore.api.device.DeviceStore

   // One-click reset for all voice and reverb effects
   AudioEffectStore.shared().reset()
   DeviceStore.shared().reset()
   ```

## API Documentation

For detailed information on all public interfaces and properties of [AudioEffectStore](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.device/-audio-effect-store/index.html), [DeviceStore](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.device/-device-store/index.html), and their related classes, refer to the official API documentation for the [AtomicXCore](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore) framework.

|**Store/Component**|**Feature Description**|**API Documentation**|
|---------|---------|---------|
|AudioEffectStore|Manage audio effects: configure and retrieve real-time audio effect status.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.device/-audio-effect-store/index.html)|
|DeviceStore|Manage devices: control camera and microphone, and retrieve real-time device status.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.device/-device-store/index.html)|

## FAQs

### Are there any restrictions on when to call audio effect and device APIs?

No. `AudioEffectStore` and `DeviceStore` settings are globally effective. You can call relevant APIs (such as setting voice effects, reverb, or ear monitoring) at any time before or after entering a live room. Settings take effect immediately and persist.

### What is the difference between "Microphone Volume" and "Ear Monitor Volume"?

This is a common point of confusion:
- **Microphone Volume (Capture Volume)**: Set via `DeviceStore.setCaptureVolume()`. Controls the volume your audience hears.

- **Ear Monitor Volume**: Set via `AudioEffectStore.setVoiceEarMonitorVolume()`.  It only determines the volume level you hear in your in-ear monitor and does not affect the audience.

### Why does a newly created live room already have audio effects, or why is the volume too high or too low?

Because `AudioEffectStore` and `DeviceStore` are singletons, audio effect and device settings are globally applied. If you previously set audio effects and did not reset them, those settings persist. Call the `reset()` method at the appropriate time to clear them.

### Why can't I hear my own voice after enabling "Ear Monitoring"?

Check the following:
1. **Are headphones connected?** Ear monitoring generally requires headphones. Ensure wired or Bluetooth headphones are connected.

2. **Is the ear monitor volume set to 0?** Check that the ear monitor volume is above 0.

3. **Is the microphone enabled?** Confirm that the microphone is enabled in DeviceStore (i.e., openLocalMicrophone has been called).

### Can voice effects and reverb be enabled at the same time?

Yes. `AudioChangerType` and `AudioReverbType` can be enabled simultaneously. For example, you can set both `AudioChangerType.LITTLE_GIRL`and `AudioReverbType.KTV` at the same time.
