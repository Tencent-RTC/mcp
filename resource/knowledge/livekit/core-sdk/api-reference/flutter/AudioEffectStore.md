## Introduction

`AudioEffectStore` provides a complete set of audio effect management APIs, including voice changer effects, reverb effects, and ear monitor functionality. Through this class, anchors can adjust their voice effects in real-time during live streaming to enhance the experience.

> **Important:**
> Use the **shared** singleton to get the `AudioEffectStore` instance. The set effects will automatically become invalid after leaving the room, and need to be set again for the next room entry.
>

> **Note:**
> Audio effect state updates are delivered through the **audioEffectState** publisher. Subscribe to it to receive real-time updates about voice changer, reverb, and ear monitor states.
>

> **Warning:**
> Due to the very high hardware latency of Bluetooth earphones, the ear monitor feature cannot be enabled when the anchor is wearing Bluetooth earphones. Please prompt the anchor to wear wired earphones in the user interface.
>

## Features
- **Voice Changer Effects**: Supports multiple voice changer effects such as child, little girl, uncle, etc.

- **Reverb Effects**: Supports multiple reverb effects such as KTV, small room, auditorium, etc.

- **Ear Monitor**: Anchors can hear their own voice in earphones, suitable for singing scenarios.

- **Volume Control**: Supports fine-grained ear monitor volume adjustment.

## Subscribable Data

**AudioEffectState** fields are described below:

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|audioChangerType|ValueListenable<AudioChangerType>|Voice changer state.|
|audioReverbType|ValueListenable<AudioReverbType>|Reverb state.|
|isEarMonitorOpened|ValueListenable<bool>|Ear monitor enabled.|
|earMonitorVolume|ValueListenable<int>|Ear monitor volume, with a value range from 0 to 100.<br>If the volume is still too low after setting it to 100, you can set the volume to a maximum of 150, but a volume exceeding 100 may cause distortion, please operate with caution.|

## API List

|**Function**|**Description**|
|---------|---------|
|shared|Get singleton instance.|
|setAudioChangerType|Set voice changer effect.|
|setAudioReverbType|Set reverb effect.|
|setVoiceEarMonitorEnable|Enable/disable ear monitor.|
|setVoiceEarMonitorVolume|Set ear monitor volume.|
|reset|Reset to default state.|

### Getting Instance

#### shared

Get singleton instance.

### Voice Changer Settings

#### setAudioChangerType

Set voice changer effect.
``` dart
void setAudioChangerType(AudioChangerType type);
```

Through this interface, you can set the voice changer effect for human voice.

Voice changer effects can be applied to human voice, and the voice is processed secondarily through acoustic algorithms to obtain a timbre different from the original sound.

**Version**

Supported since version 3.5.

**When to Call**

Call after entering the room and when voice changer effect is needed.

**Notes**

> **Note:**
> The set effect will automatically become invalid after leaving the room. If you need the corresponding effect for the next room entry, you need to call this interface again to set it.
>

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|type|AudioChangerType|Voice changer effect type.|

### Reverb Settings

#### setAudioReverbType

Set reverb effect.
``` dart
void setAudioReverbType(AudioReverbType type);
```

Through this interface, you can set the reverb effect for human voice.

Reverb effects can be applied to human voice, and the sound is processed through acoustic algorithms to simulate the presence in various different environments.

**Version**

Supported since version 3.5.

**When to Call**

Call after entering the room and when reverb effect is needed.

**Notes**

> **Note:**
> The set effect will automatically become invalid after leaving the room. If you need the corresponding effect for the next room entry, you need to call this interface again to set it.
>

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|type|AudioReverbType|Reverb effect type.|

### Ear Monitor Settings

#### setVoiceEarMonitorEnable

Enable/disable ear monitor.
``` dart
void setVoiceEarMonitorEnable(bool enable);
```

After the anchor enables ear monitor, they can hear their own voice captured by the microphone in the earphones. This effect is suitable for anchor singing application scenarios.

**Version**

Supported since version 3.5.

**Use Cases**

Suitable for anchor singing scenarios, allowing anchors to hear their own voice in real time to adjust their singing performance.

**When to Call**

Call after entering the room and when the anchor is wearing wired earphones.

**Notes**

> **Warning:**
> Due to the very high hardware latency of Bluetooth earphones, this effect cannot be enabled when the anchor is wearing Bluetooth earphones. Please try to prompt the anchor to wear wired earphones in the user interface.
>

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|enable|bool|Whether to enable ear monitor.|

#### setVoiceEarMonitorVolume

Set ear monitor volume.
``` dart
void setVoiceEarMonitorVolume(int volume);
```

Through this interface, you can set the volume of the sound in the ear monitor effect.

**Version**

Supported since version 3.5.

**When to Call**

Call after enabling the ear monitor feature.

**Notes**

> **Note:**
> If the volume is still too low after setting it to 100, you can set the volume to a maximum of 150, but a volume exceeding 100 may cause distortion, please operate with caution.
>

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|volume|int|Ear monitor volume, with a value range from 0 to 100. (Range: Value range from 0 to 100, exceeding 100 may cause distortion) (Default: 100).|

### Reset

#### reset

Reset to default state.
``` dart
void reset();
```

Reset all audio effect settings to default values, including disabling voice changer effect, disabling reverb effect, disabling ear monitor, and resetting ear monitor volume.

**Version**

Supported since version 3.5.

**When to Call**

Call when you need to restore the default audio effect settings, for example before leaving the live room.

## Data Structures

### AudioChangerType

Voice changer effect type.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|none|0|Disable effect.|
|child|1|Child.|
|littleGirl|2|Little girl.|
|man|3|Uncle.|
|heavyMetal|4|Heavy metal.|
|cold|5|Cold.|
|foreigner|6|Foreign accent.|
|trappedBeast|7|Trapped beast.|
|fatso|8|Otaku.|
|strongCurrent|9|Strong current.|
|heavyMachinery|10|Heavy machinery.|
|ethereal|11|Ethereal.|

### AudioReverbType

Reverb effect type.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|none|0|Disable effect.|
|ktv|1|KTV.|
|smallRoom|2|Small room.|
|auditorium|3|Auditorium.|
|deep|4|Deep.|
|loud|5|Loud.|
|metallic|6|Metallic.|
|magnetic|7|Magnetic.|

### AudioEffectState

Audio effect related state data provided by AudioEffectStore.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|audioChangerType|ValueListenable<AudioChangerType>|Voice changer state.|
|audioReverbType|ValueListenable<AudioReverbType>|Reverb state.|
|isEarMonitorOpened|ValueListenable<bool>|Ear monitor enabled.|
|earMonitorVolume|ValueListenable<int>|Ear monitor volume, with a value range from 0 to 100.<br>If the volume is still too low after setting it to 100, you can set the volume to a maximum of 150, but a volume exceeding 100 may cause distortion, please operate with caution.|

## Usage Example
``` dart
// Get singleton instance
final store = AudioEffectStore.shared;
// Subscribe to state changes
store.audioEffectState.audioChangerType.addListener(() {
    print("Current voice changer: ${store.audioEffectState.audioChangerType.value}");
});
store.audioEffectState.audioReverbType.addListener(() {
    print("Current reverb: ${store.audioEffectState.audioReverbType.value}");
});
// Set voice changer effect
store.setAudioChangerType(AudioChangerType.littleGirl);
// Set reverb effect
store.setAudioReverbType(AudioReverbType.ktv);
// Enable ear monitor
store.setVoiceEarMonitorEnable(true);
store.setVoiceEarMonitorVolume(80);
```
