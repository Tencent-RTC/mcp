---
sync_node_id: '209156856823955456'
nav_path:
  - "直播与语聊 SDK"
  - "Core SDK"
  - "功能模块"
  - "音效"
  - "音效（React Native）"
product: "live"
---
This guide shows you how to use the `AudioEffectState` and `DeviceState` modules from the `AtomicXCore` framework to quickly add audio effect controls to your live streaming application. You’ll learn how to manage microphone volume, enable ear monitoring, and apply fun voice changer and reverb effects.

## Core Features

By combining `AudioEffectState` and `DeviceState`, you can implement the following core features:
- **Voice Volume Adjustment**: Control the local capturing volume, which determines the volume your audience hears.

- **Ear Monitoring**: Enable hosts or co-hosts to monitor their microphone input in real time through headphones, helping with pronunciation and performance.

- **Voice Changer Effects**: Apply a variety of entertaining voice changer effects, such as child, deep male, mischievous kid, and more.

- **Reverb Effects**: Simulate different acoustic environments including KTV, metallic, deep, loud, and more.

## Implementation Steps

### Step 1: Component Integration
- **Live streaming**: .

- **Voice chat room**: .

### Step 2: Obtain State Instances

`AudioEffectState` and `DeviceState` are singleton objects. You can access their instances from anywhere in your project.
``` typescript
import { useAudioEffectState } from 'react-native-tuikit-atomic-x/lib/module/atomic-x/state/AudioEffectState';
import { useDeviceState } from 'react-native-tuikit-atomic-x/lib/module/atomic-x/state/DeviceState';

// Get state instances
const audioEffect = useAudioEffectState();
const deviceState = useDeviceState();
```

### Step 3: Enable In-Ear Monitoring

Ear monitoring lets users hear their microphone input in real time. Manage ear monitoring using the interfaces described below.

> **Note:**
> Ear monitoring requires headphones for proper operation.
> 

#### Implementation:
1. Enable/Disable In-Ear Monitoring: Add a toggle to your UI that calls the enable/disable API when the user switches in-ear monitoring on or off.

2. Adjust In-Ear Monitoring Volume: Add a volume slider to your UI. Pass the slider value — expressed as an integer in the range [0, 100] — to `setVoiceEarMonitorVolume`.

3. React to State Changes: Subscribe to in-ear monitoring state events to keep your UI in sync with the current state in real time.

#### Code Example:
``` typescript
import { useEffect } from 'react';
import { useAudioEffectState } from 'react-native-tuikit-atomic-x/lib/module/atomic-x/state/AudioEffectState';

// Access state instance
const { setVoiceEarMonitorEnable, setVoiceEarMonitorVolume, earMonitorVolume } = useAudioEffectState();

// 1. Toggle ear monitoring
const handleSetVoiceEarMonitorEnable = (enable) => {
  setVoiceEarMonitorEnable({ enable });
};

// 2. Adjust ear monitoring volume
const handleSetVoiceEarMonitorVolume = (volume) => {
  setVoiceEarMonitorVolume({ volume });
};

// 3. Listen for volume changes
useEffect(() => {
  console.log('Ear monitoring volume:', earMonitorVolume);
}, [earMonitorVolume]);
```

#### setVoiceEarMonitorEnable Parameters
| Parameter Name | Type | Description |
| --- | --- | --- |
| <code>enable</code> | boolean | Enable ear monitoring.<br>- true: Enable<br>- false: Disable |

#### setVoiceEarMonitorVolume Parameters
| Parameter Name | Type | Description |
| --- | --- | --- |
| <code>volume</code> | number | Ear monitoring volume.<br>- Range: [0, 100]<br>- Default: 100 |

### Step 4: Adjust Voice Volume

To let the host adjust their uplink capturing volume, call the `setCaptureVolume` method from `DeviceState` with the desired value.

#### Implementation:
1. **Set Capturing Volume**: Add a volume slider to your UI, map the UI value to the `[0, 100]` range, and call `setCaptureVolume`.

2. **Subscribe to State Updates**: Listen for real-time volume changes to keep your UI in sync.

#### Sample Code:
``` typescript
import { useEffect } from 'react';
import { useDeviceState } from 'react-native-tuikit-atomic-x/lib/module/atomic-x/state/DeviceState';

// Access state instance
const { setCaptureVolume, captureVolume } = useDeviceState();

// 1. Adjust capturing volume
const handleSetCaptureVolume = (volume) => {
  setCaptureVolume({ volume });
};

// 2. Listen for volume changes
useEffect(() => {
  console.log('Capturing volume:', captureVolume);
}, [captureVolume]);
```

#### setCaptureVolume Parameters
| Parameter Name | Type | Description |
| --- | --- | --- |
| <code>volume</code> | number | Capturing volume.<br>- Range: [0, 100]<br>- Default: 100 |

### Step 5: Apply Voice Changer Effects

To change the host's voice, call `setAudioChangerType` and pass the desired enum value.

#### Sample Code:
``` typescript
import { useAudioEffectState } from 'react-native-tuikit-atomic-x/lib/module/atomic-x/state/AudioEffectState';

// Access state instance
const { setAudioChangerType } = useAudioEffectState();

// Set voice changer effect
const handleSetAudioChangerType = (changerType) => {
  setAudioChangerType({ changerType });
};
```

#### setAudioChangerType Parameters
| Parameter Name | Type | Description |
| --- | --- | --- |
| <code>changerType</code> | string | Voice changer effect, available options:<br>- <code>NONE</code>: Disable voice changer.<br>- <code>CHILD</code>: Mischievous kid, lively tone.<br>- <code>LITTLE_GIRL</code>: Child, sweet and crisp.<br>- <code>MAN</code>: Deep male, powerful tone.<br>- <code>HEAVY_METAL</code>: Heavy metal, metallic, rugged.<br>- <code>COLD</code>: Nasal, cold-like tone.<br>- <code>FOREIGNER</code>: Foreign accent.<br>- <code>TRAPPED_BEAST</code>: Deep, roaring tone.<br>- <code>FATSO</code>: Thick, humorous, full-bodied.<br>- <code>STRONG_CURRENT</code>: Sci-fi, electric interference.<br>- <code>HEAVY_MACHINERY</code>: Mechanical echo, industrial style.<br>- <code>ETHEREAL</code>: Airy, transparent, fairy-like. |

### Step 6: Apply Reverb Effects

To add reverb effects to the host’s voice, call `setAudioReverbType` with the desired enum value.
``` typescript
import { useAudioEffectState } from 'react-native-tuikit-atomic-x/lib/module/atomic-x/state/AudioEffectState';

// Access state instance
const { setAudioReverbType } = useAudioEffectState;

// Set reverb effect
const handleSetAudioReverbType = (reverbType) => {
  setAudioReverbType({ reverbType });
};
```

#### setAudioReverbType Parameters
| Parameter Name | Type | Description |
| --- | --- | --- |
| <code>reverbType</code> | string | Reverb effect, available options:<br>- <code>NONE</code>: Disable reverb.<br>- <code>KTV</code>: Simulates KTV private room, moderate echo, suited for singing.<br>- <code>SMALL_ROOM</code>: Compact spatial feel.<br>- <code>AUDITORIUM</code>: Wide echo, strong spatial presence.<br>- <code>DEEP</code>: Low-frequency, deep sound.<br>- <code>LOUD</code>: Increases loudness, fuller sound.<br>- <code>METALLIC</code>: Crisp, metallic reverb.<br>- <code>MAGNETIC</code>: Soft, warm, magnetic tone. |

## API Documentation

For full details on all public interfaces and properties of [AudioEffectState](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/zh/v1.0/api/index.html#module-AudioEffectState) and [DeviceState](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/zh/v1.0/api/index.html#module-DeviceState), see the official API documentation for AtomicXCore.

|State|Feature Description|API Documentation|
|---------|---------|---------|
|`AudioEffectState`|Manage audio effects: configure effects and get real-time status.|[API Documentation](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/zh/v1.0/api/index.html#module-AudioEffectState)|
|`DeviceState`|Manage devices: operate camera and microphone, get real-time status.|[API Documentation](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/zh/v1.0/api/index.html#module-DeviceState)|

## FAQs

### Are there any restrictions on when to call audio effect and device interfaces?

No restrictions. Settings for `AudioEffectState` and `DeviceState` are global. You can call these interfaces (such as setting voice changer, reverb, or ear monitoring) at any time—before or after entering the live room. Changes take effect immediately and persist.

### What is the difference between "Voice Volume" and "Ear Monitoring Volume"?

This distinction is important and often misunderstood:
- **Voice Volume (CaptureVolume):** Set via `setCaptureVolume`. This is what your audience hears.

- **Ear Monitoring Volume (EarMonitorVolume):** Set via `setVoiceEarMonitorVolume`. This only affects your own monitoring headphones and does not impact audience volume.

### Why does a newly created live room have audio effects already enabled, or the volume is unexpectedly loud or quiet?

Since `AudioEffectState` and `DeviceState` are singletons, their settings apply globally. If you see unexpected effects or volumes, it’s likely due to previous settings that were not reset. Make sure to reset these values when appropriate.

### Why can't I hear my own voice after enabling "Ear Monitoring"?

Check the following:
1. **Headphones connected:** Ear monitoring requires headphones. Ensure you are using wired or Bluetooth headphones.

2. **Volume setting:** Make sure "Ear Monitoring Volume" is not set to 0.

3. **Microphone enabled:** Confirm that the microphone in `DeviceState` is enabled (call `openLocalMicrophone`).

### Can voice changer and reverb effects be enabled simultaneously?

Yes. You can apply both `AudioChangerType` and `AudioReverbType` at the same time. For example, you can use the `'LITTLE_GIRL'` voice changer together with the `'KTV'` reverb.
