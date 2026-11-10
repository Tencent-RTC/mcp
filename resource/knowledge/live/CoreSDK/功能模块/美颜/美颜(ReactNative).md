---
sync_node_id: '209156849656922112'
nav_path:
  - "直播与语聊 SDK"
  - "Core SDK"
  - "功能模块"
  - "美颜"
  - "美颜（React Native）"
product: "live"
---
`BaseBeautyState` is a module within `AtomicXCore` that manages essential portrait enhancement effects. Use this module to seamlessly integrate natural beauty filters into your live streaming or call applications.

## Core Features
- **Skin Smoothing Adjustment**: Configure smoothing intensity from 0 to 9.

- **Whitening Adjustment**: Configure whitening intensity from 0 to 9.

- **Rosy Tone Adjustment**: Configure rosy tone intensity from 0 to 9.

- **Effect Reset**: Instantly restore all beauty parameters to their default values with a single action.

- **State Monitoring**: Access real-time values for active beauty parameters.

## Implementation Steps

### Step 1: Integrate the Components
- **Live streaming**: .

- **Voice chat room**: .

### Step 2: Obtain Instance and Monitor State

Retrieve the global singleton instance of `BaseBeautyState` and monitor its reactive data to track beauty parameter changes in real time.

#### Implementation
1. **Obtain Singleton**: Use `useBaseBeautyState` to access the current instance.

2. **Monitor State**: Subscribe to `BaseBeautyState` reactive properties to trigger UI updates.

#### Code Example
``` typescript
import { useEffect } from 'react';
import { useBaseBeautyState } from 'react-native-tuikit-atomic-x/lib/module/atomic-x/state/BaseBeautyState';

// 1. Obtain the instance of BaseBeautyState
const { smoothLevel, whitenessLevel, ruddyLevel } = useBaseBeautyState();

// 2. Monitor real-time changes of smoothLevel, whitenessLevel, and ruddyLevel to drive UI updates
useEffect(() => {
  console.log('smoothLevel:', smoothLevel);
}, [smoothLevel]);

useEffect(() => {
  console.log('whitenessLevel:', whitenessLevel);
}, [whitenessLevel]);

useEffect(() => {
  console.log('ruddyLevel:', ruddyLevel);
}, [ruddyLevel]);
```

### Step 3: Set Beauty Parameters

When users adjust the beauty sliders or select presets, invoke the relevant interface to update beauty intensity levels.

#### Implementation
1. **Get Intensity Value**: Read the intensity value from the UI control. The SDK accepts values in the range `[0, 9]`, with `0` disabling the effect and `9` applying maximum intensity. Map UI values accordingly.

2. **Call Interface**: Use `setSmoothLevel`, `setWhitenessLevel`, and `setRuddyLevel` to adjust smoothing, whitening, and rosy tone intensities.

#### Code Example
``` typescript
import { useBaseBeautyState } from 'react-native-tuikit-atomic-x/lib/module/atomic-x/state/BaseBeautyState';

// Obtain the instance of BaseBeautyState
const { setSmoothLevel, setWhitenessLevel, setRuddyLevel } = useBaseBeautyState();

// Set smoothing (parameter range 0-9)
const handleSetSmooth = (smoothLevel) => {
  setSmoothLevel({ smoothLevel });
};

// Set whitening (parameter range 0-9)
const handleSetWhiteness = (whitenessLevel) => {
  setWhitenessLevel({ whitenessLevel });
};

// Set rosy tone (parameter range 0-9)
const handleSetRuddy = (ruddyLevel) => {
  setRuddyLevel({ ruddyLevel });
};
```

### Step 4: Reset Beauty Effects

To disable all beauty effects or restore defaults, set all intensity parameters to `0` via the provided interfaces.

#### Implementation

**Call Interface**: Set `smoothLevel`, `whitenessLevel`, and `ruddyLevel` to 0 using their respective methods.

#### Code Example
``` typescript
import { useBaseBeautyState } from 'react-native-tuikit-atomic-x/lib/module/atomic-x/state/BaseBeautyState;

// Obtain the instance of BaseBeautyState
const { setSmoothLevel, setWhitenessLevel, setRuddyLevel } = useBaseBeautyState;

// Reset beauty effects
const handleReset = () => {
  setSmoothLevel({ smoothLevel: 0 });
  setWhitenessLevel({ whitenessLevel: 0 });
  setRuddyLevel({ ruddyLevel: 0 });
};
```

## API Documentation

For comprehensive details on all public interfaces, properties, and methods for [BaseBeautyState](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/zh/v1.0/api/index.html#module-BaseBeautyState) and related classes, see the official AtomicXCore framework documentation. The relevant stores referenced in this guide are:

|**State**|**Feature Description**|**API Documentation**|
|---------|---------|---------|
|`BaseBeautyState`|Basic beauty filters: adjust smoothing, whitening, and rosy tone (levels 0–9), reset beauty state, synchronize effect parameters.|[API Documentation](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/zh/v1.0/api/index.html#module-BaseBeautyState)|
|`DeviceState`|Audio/Video device control: microphone (on/off/volume), camera (on/off/switch/quality), screen sharing, real-time device status monitoring.|[API Documentation](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/react-native/zh/v1.0/api/index.html#module-DeviceState)|

## FAQs

### Why are beauty effects not applied after setting parameters?

Check the following:
1. **Camera status**: The camera must be enabled for beauty effects to apply to the video stream.

2. **Parameter range**: Ensure that the intensity value is within the valid range (`0` to `9`).
