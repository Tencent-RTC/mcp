`BaseBeautyStore` is the module in **AtomicXCore** responsible for managing basic portrait beautification effects. This module enables you to easily add natural beautification features to your live streaming or video calling applications.

## Core Features
- **Skin Smoothing Adjustment**: Configure smoothing intensity (0–9).

- **Whitening Adjustment**: Configure whitening intensity (0–9).

- **Rosy Adjustment**: Configure rosy intensity (0–9).

- **Effect Reset**: Instantly restore all beautification parameters to their default values.

- **State Monitoring:** Access real-time values of the currently applied beautification parameters.

## Core Concepts
| <strong>Core Concept</strong> | <strong>Type</strong> | <strong>Core Responsibilities and Description</strong> |
| --- | --- | --- |
| <code>BaseBeautyState</code> | <code>data</code> | - Represents the current state of the basic beautification module.<br>- Contains the currently applied intensity values for smoothing (smoothLevel), whitening (whitenessLevel), and rosy (ruddyLevel). |
| <code>BaseBeautyStore</code> | <code>abstract</code> | - The core management class for interacting with basic beautification features.<br>-  Implemented as a global singleton (shared), responsible for setting, resetting, and synchronizing all basic beautification parameters. |

## Implementation

### Step 1: Component Integration
- **Video Live Streaming**: Please ..

- **Voice Chat Room**: Please .

### Step 2: Obtain the Instance and Subscribe to State

Obtain the global singleton instance of `BaseBeautyStore` and subscribe to receive real-time updates of the current beautification parameter state.

#### Implementation
1. **Obtain Singleton**: Use `BaseBeautyStore.shared()` to access the global instance.

2. **Subscribe to State**: Subscribe to `baseBeautyStore.baseBeautyState` to receive real-time updates of BaseBeautyState.

#### Code Example
``` kotlin
import io.trtc.tuikit.atomicxcore.api.device.BaseBeautyState
import io.trtc.tuikit.atomicxcore.api.device.BaseBeautyStore
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.flow.MutableStateFlow

class BeautyManager() {
    // 1. Obtain singleton
    private val baseBeautyStore = BaseBeautyStore.shared()
    private val coroutineScope = CoroutineScope(Dispatchers.Main)

    private val _smoothLevel = MutableStateFlow(0f)
    private val _whitenessLevel = MutableStateFlow(0f)
    private val _ruddyLevel = MutableStateFlow(0f)

    // Expose beauty state externally
    val baseBeautyState = BaseBeautyState(
        smoothLevel = _smoothLevel,
        whitenessLevel = _whitenessLevel,
        ruddyLevel = _ruddyLevel
    )

    init {
        // 2. Subscribe to state
        subscribeToBeautyState()
    }

    private fun subscribeToBeautyState() {
        coroutineScope.launch(Dispatchers.Main) {
            baseBeautyStore.baseBeautyState.smoothLevel.collect { smoothLevel ->
                _smoothLevel.value = smoothLevel
            }
        }

        coroutineScope.launch(Dispatchers.Main) {
            baseBeautyStore.baseBeautyState.whitenessLevel.collect { whitenessLevel ->
                _whitenessLevel.value = whitenessLevel
            }
        }

        coroutineScope.launch(Dispatchers.Main) {
            baseBeautyStore.baseBeautyState.ruddyLevel.collect { ruddyLevel ->
                _ruddyLevel.value = ruddyLevel
            }
        }
    }
    // ... subsequent methods
}
```

### Step 3: Set Beautification Parameters

When users adjust a beautification slider or select a preset, call the corresponding API to set the desired intensity.

#### Implementation
1. **Get Intensity Value**:

- Retrieve the value from the UI control (e.g., `SeekBar`).

- Note that the SDK interface accepts a parameter range of `[0, 9]`, where 0 means the effect is off, and 9 means the effect is most prominent. You need to map the UI control value (e.g., `0.0 - 1.0` for a `UISlider`) to the `0 - 9` range.

2. **Call API**: Use `setSmoothLevel(smoothLevel:)`, `setWhitenessLevel(whitenessLevel:)`, and `setRuddyLevel(ruddyLevel:)` to set the smoothing, whitening, and rosy intensities.

#### Code Example
``` kotlin
class BeautyManager() {
    private val baseBeautyStore = BaseBeautyStore.shared()

    // Set smoothing level (input range 0–100, internally converted to 0–9)
    fun updateSmoothLevel(uiLevel: Int) {
        val sdkLevel = (uiLevel / 100.0f * 9.0f)
        baseBeautyStore.setSmoothLevel(sdkLevel)
        println("Set smoothing level: UI=$uiLevel, SDK=$sdkLevel")
    }

    // Set whitening level (input range 0–100, internally converted to 0–9)
    fun updateWhitenessLevel(uiLevel: Int) {
        val sdkLevel = (uiLevel / 100.0f * 9.0f)
        baseBeautyStore.setWhitenessLevel(sdkLevel)
        println("Set whitening level: UI=$uiLevel, SDK=$sdkLevel")
    }

    // Set rosy level (input range 0–100, internally converted to 0–9)
    fun updateRuddyLevel(uiLevel: Int) {
        val sdkLevel = (uiLevel / 100.0f * 9.0f)
        baseBeautyStore.setRuddyLevel(sdkLevel)
        println("Set rosy level: UI=$uiLevel, SDK=$sdkLevel")
    }
}
```

### Step 4: Reset Beautification Effects

When users click "Reset" or "Disable Beauty," restore all beautification parameters to their default values (typically 0).

#### Implementation
- **Call API**: Call the `baseBeautyStore.reset()` method.

#### Code Example
``` kotlin
class BeautyManager() {
    private val baseBeautyStore = BaseBeautyStore.shared()

    // Reset all basic beautification effects
    fun resetBeautyEffects() {
        baseBeautyStore.reset()
    }
}
```

## Advanced Features

### Comparison: Basic vs. Advanced Beautification

AtomicXCore also provides advanced beautification features for more demanding scenarios:

|**Comparison Item**|**Basic Beautification (BaseBeautyStore)**|**Advanced Beautification (TEBeautyKit, requires additional integration)**|
|---------|---------|---------|
|Core Features|Smoothing, Whitening, Rosy|Includes all basic features, plus V-shape face, eye distance adjustment, nose slimming, 3D stickers, filters, makeup, and more|
|Pricing|Free (included with AtomicXCore license)|Paid (requires separate Tencent Effects SDK license)|
|Integration Method|Built-in by default; use BaseBeautyStore.shared() directly|Requires additional integration of the TEBeautyKit component and authentication|
|Recommended Scenarios|Scenarios with basic beautification needs and rapid implementation requirements|Scenarios requiring advanced beautification, shaping, stickers, filters, and other premium features|

### Integrating Advanced Beautification

To use advanced beautification features, refer to the [Advanced Beauty](https://trtc.io/document/60196) documentation. After integrating and authenticating TEBeautyKit, use its APIs to control all beautification effects.

## API Documentation

For detailed information on all public interfaces, properties, and methods of [BaseBeautyStore](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.device/-base-beauty-store/index.html) and related classes, see the official API documentation for the [AtomicXCore](https://tencent-rtc.github.io/TUIKit_Android/index.html) framework. The relevant stores referenced in this guide are:

|**Store/Component**|**Feature Description**|**API Documentation**|
|---------|---------|---------|
|`LiveCoreView`|Core view component for displaying and interacting with live video streams. Handles video rendering and view widgets, supports host streaming, audience co-hosting, host connections, and more.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.view/-live-core-view/index.html)|
|`BaseBeautyStore`|Basic beautification: adjust smoothing, whitening, and rosy (levels 0–9), reset status, synchronize effect parameters.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.device/-base-beauty-store/index.html)|
|`DeviceStore`|Audio and video device control: microphone (on/off, volume), camera (on/off, switch, quality), screen sharing, real-time device status monitoring.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.device/-device-store/index.html)|

## FAQs

### I set the beautification parameters, but why is there no effect?

**Check the following:**
1. **Camera is enabled**:  Ensure the camera is turned on (e.g., via DeviceStore.shared().openLocalCamera). Beauty effects cannot apply to a black screen or audio-only stream.

2. **Using advanced beautification**: If you have integrated `TEBeautyKit` (advanced beautification), ensure you are using the APIs provided by `TEBeautyKit` to adjust beautification effects.

3. **Parameter range**: If you are using the basic beautification feature, ensure the intensity values you provide are within the valid range (float values between 0 and 9).
