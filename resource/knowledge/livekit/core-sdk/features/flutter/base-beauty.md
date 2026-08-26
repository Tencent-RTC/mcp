`BaseBeautyStore` is the module in `AtomicXCore` for management of basic beauty effects for portraits. Through it, you can easily add natural beauty effects to your live stream or call applications.

## Core Features
- **Skin smoothing adjustment**: Set the skin smoothing strength (0-9).

- **Brightening effect adjustment**: Set the brightening strength (0-9).

- **Rosy effect adjustment**: Set the rosy strength (0-9).

- **Effect reset**: One-click restore all beauty parameters to default value.

- **Listen for status**: Get currently effective beauty parameters in real time.

## Core Concepts

Before starting integration, we first learn about the core concepts related to `BaseBeautyStore` in the following table:

|**Core Concepts**|**Type**|**Core Responsibilities and Description**|
|---------|---------|---------|
|[BaseBeautyState](https://tencent-rtc.github.io/TUIKit_Flutter/api_device_base_beauty_store/BaseBeautyState-class.html)|`class`|Represents the current status of the beauty module. It includes the intensity values of currently effective skin smoothing (`smoothLevel`), whitening (`whitenessLevel`), and rosy (`ruddyLevel`). All attributes are `ValueListenable<double>` data type and support subscription listening.|
|[BaseBeautyStore](https://tencent-rtc.github.io/TUIKit_Flutter/api_device_base_beauty_store/BaseBeautyStore-class.html)|`class`|This is the core management class for interacting with the basic beauty filter feature. It is a Global Singleton (`shared`), responsible for ALL basic beauty parameter settings, reset and state synchronization.|

## Implementation Steps

### Step 1: Integrate the Component

### Step 2: Obtain the Instance and Listen to the State

Get the Global Singleton of `BaseBeautyStore` and set a listener to get the current beauty effect parameter status in real time.
1. **Get the singleton**: Directly use `BaseBeautyStore.shared` to get the globally unique `BaseBeautyStore` instance.

2. **Subscription status**: Listen for changes in the `baseBeautyState` properties via `addListener` to get beauty parameter updates in real time.

#### Sample Code
``` java
import 'package:flutter/material.dart';
import 'package:atomic_x_core/atomicxcore.dart';

class BeautyManager {
  // 1. Get a singleton
  final _baseBeautyStore = BaseBeautyStore.shared;
  late final VoidCallback _smoothLevelChangedListener = _onSmoothLevelChanged;
  late final VoidCallback _whitenessLevelChangedListener = _onWhitenessLevelChanged;
  late final VoidCallback _ruddyLevelChangedListener = _onRuddyLevelChanged;

  // 2. Subscription status
  void subscribeToBeautyState() {
    _baseBeautyStore.baseBeautyState.smoothLevel.addListener(_smoothLevelChangedListener);
    _baseBeautyStore.baseBeautyState.whitenessLevel.addListener(_whitenessLevelChangedListener);
    _baseBeautyStore.baseBeautyState.ruddyLevel.addListener(_ruddyLevelChangedListener);
  }

  void _onSmoothLevelChanged() {
    final level = _baseBeautyStore.baseBeautyState.smoothLevel.value;
    debugPrint('Skin smoothing strength adjustment: $level');
  }

  void _onWhitenessLevelChanged() {
    final level = _baseBeautyStore.baseBeautyState.whitenessLevel.value;
    debugPrint('Whitening strength adjustment: $level');
  }

  void _onRuddyLevelChanged() {
    final level = _baseBeautyStore.baseBeautyState.ruddyLevel.value;
    debugPrint('Rosy strength adjustment: $level');
  }

  // Execute dispose before logging out of the App
  void dispose() {
    _baseBeautyStore.baseBeautyState.smoothLevel.removeListener(_smoothLevelChangedListener);
    _baseBeautyStore.baseBeautyState.whitenessLevel.removeListener(_whitenessLevelChangedListener);
    _baseBeautyStore.baseBeautyState.ruddyLevel.removeListener(_ruddyLevelChangedListener);
  }
}
```

### Step 3: Set Beauty Parameters

When the user drags the beauty effect slider or clicks the preset button, call the appropriate API to set the intensity of beauty effects.
1. **Get intensity value**: Obtain the intensity value set by the user from the UI control (such as `Slider`). The parameter range accepted by the SDK API is `0-9`, where `0` means disabling the effect and `9` indicates the most obvious effect. You need to map the value of the UI control (for example, `0.0 - 1.0` of the Slider) to the range of `0 - 9`.

2. **API call**: Call `setSmoothLevel()`, `setWhitenessLevel()`, and `setRuddyLevel()` to set the intensity of skin smoothing, whitening, and rosy effect.

#### Sample Code
``` java
extension BeautyManagerExtension on BeautyManager {
  /// Set the skin smoothing strength (input range 0.0 ~ 1.0, internal conversion to 0 ~ 9)
  void updateSmoothLevel(double uiLevel) {
    // Map the UI's 0.0 ~ 1.0 to the SDK's 0 ~ 9
    final sdkLevel = uiLevel * 9.0;
    _baseBeautyStore.setSmoothLevel(sdkLevel);
  }

  /// Set the whitening strength (input range 0.0 ~ 1.0, internal conversion to 0 ~ 9)
  void updateWhitenessLevel(double uiLevel) {
    final sdkLevel = uiLevel * 9.0;
    _baseBeautyStore.setWhitenessLevel(sdkLevel);
  }

  /// Set the ruddy level (input range 0.0 ~ 1.0, internal conversion to 0 ~ 9)
  void updateRuddyLevel(double uiLevel) {
    final sdkLevel = uiLevel * 9.0;
    _baseBeautyStore.setRuddyLevel(sdkLevel);
  }
}
```

### Step 4: Reset Beauty Effects

When the user clicks the "**Reset**" or "**Disable Beauty Effects**" button, call the `baseBeautyStore.reset()` method to restore all beauty parameters to the default value (usually 0).

#### Sample Code
``` java
extension BeautyManagerReset on BeautyManager {
  /// Reset ALL basic beauty effects
  void resetBeautyEffects() {
    _baseBeautyStore.reset();
  }
}
```

## Build a Beauty Effect UI

Flutter recommends using `ValueListenableBuilder` to build responsive UI, which auto-updates the interface when beauty effect parameters change:
``` java
class BeautySliderWidget extends StatelessWidget {
  final beautyStore = BaseBeautyStore.shared;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Skin smoothing slider
        ValueListenableBuilder<double>(
          valueListenable: beautyStore.baseBeautyState.smoothLevel,
          builder: (context, smoothLevel, child) {
            return Row(
              children: [
                Text('Skin smoothing')
                Expanded(
                  child: Slider(
                    value: smoothLevel,
                    min: 0,
                    max: 9,
                    divisions: 9,
                    onChanged: (value) {
                      beautyStore.setSmoothLevel(value);
                    },
                  ),
                ),
                Text('${smoothLevel.toInt()}'),
              ],
            );
          },
        ),
        // Whitening slider
        ValueListenableBuilder<double>(
          valueListenable: beautyStore.baseBeautyState.whitenessLevel,
          builder: (context, whitenessLevel, child) {
            return Row(
              children: [
                Text('Whitening')
                Expanded(
                  child: Slider(
                    value: whitenessLevel,
                    min: 0,
                    max: 9,
                    divisions: 9,
                    onChanged: (value) {
                      beautyStore.setWhitenessLevel(value);
                    },
                  ),
                ),
                Text('${whitenessLevel.toInt()}'),
              ],
            );
          },
        ),
        // rosy slider
        ValueListenableBuilder<double>(
          valueListenable: beautyStore.baseBeautyState.ruddyLevel,
          builder: (context, ruddyLevel, child) {
            return Row(
              children: [
                Text('Rosy')
                Expanded(
                  child: Slider(
                    value: ruddyLevel,
                    min: 0,
                    max: 9,
                    divisions: 9,
                    onChanged: (value) {
                      beautyStore.setRuddyLevel(value);
                    },
                  ),
                ),
                Text('${ruddyLevel.toInt()}'),
              ],
            );
          },
        ),
      ],
    );
  }
}
```

## Complete Sample Code
``` java
import 'package:flutter/material.dart';
import 'package:atomic_x_core/atomicxcore.dart';

class BeautySettingsPage extends StatelessWidget {
  final beautyStore = BaseBeautyStore.shared;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Beauty settings')),
      body: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          children: [
            // Skin smoothing
            _buildBeautySlider(
              title: 'Skin smoothing'
              valueListenable: beautyStore.baseBeautyState.smoothLevel,
              onChanged: (value) => beautyStore.setSmoothLevel(value),
            ),
            SizedBox(height: 20),
            // Whitening
            _buildBeautySlider(
              title: 'Whitening',
              valueListenable: beautyStore.baseBeautyState.whitenessLevel,
              onChanged: (value) => beautyStore.setWhitenessLevel(value),
            ),
            SizedBox(height: 20),
            // Rosy
            _buildBeautySlider(
              title: 'Rosy'
              valueListenable: beautyStore.baseBeautyState.ruddyLevel,
              onChanged: (value) => beautyStore.setRuddyLevel(value),
            ),
            SizedBox(height: 40),
            // reset button
            ElevatedButton(
              onPressed: () {
                beautyStore.reset();
              },
              child: Text('Reset beauty effect'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBeautySlider({
    required String title,
    required ValueListenable<double> valueListenable,
    required ValueChanged<double> onChanged,
  }) {
    return ValueListenableBuilder<double>(
      valueListenable: valueListenable,
      builder: (context, value, child) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(title, style: TextStyle(fontSize: 16)),
                Text('${value.toInt()}', style: TextStyle(fontSize: 16)),
              ],
            ),
            Slider(
              value: value,
              min: 0,
              max: 9,
              divisions: 9,
              onChanged: onChanged,
            ),
          ],
        );
      },
    );
  }
}
```

## Advanced Features

### Basic Beauty Filter Vs Advanced Beauty Effect

AtomicXCore also provides advanced beauty features for more demanding scenarios:

|Comparison Item|Basic Beauty (BaseBeautyStore)|Advanced Beauty (TencentEffect, requires additional integration)|
|---------|---------|---------|
|Core Features|Skin smoothing, whitening, rosy|All basic beauty features, plus V-shaped face, eye distance, nose slimming, 3D stickers, filters, makeup, and more|
|Pricing|Free (included with AtomicXCore license)|Paid (requires separate TencentEffect SDK license)|
|Integration Method|Built-in by default, use BaseBeautyStore.shared directly|Requires additional integration of the TencentEffect component and authentication|
|Recommended Scenarios|Use for simple beauty requirements or when you need to quickly enable basic beauty features|Use for advanced beauty requirements, including shaping, stickers, filters, and other enhanced effects|

### Integrate Advanced Beauty

If you need to use the advanced beauty function, refer to the [Advanced Beauty](https://trtc.io/document/73778) document for integration. After successful integration and authentication of `TencentEffect`, you can control ALL beauty effects through the API provided by `TencentEffect`.

## API Reference

### BaseBeautyStore

|**Property/Method**|**Type**|**Description**|
|---------|---------|---------|
|`shared`|`BaseBeautyStore`|Singleton instance|
|`baseBeautyState`|`BaseBeautyState`|Beauty effect status|
|`setSmoothLevel`|`void`|Set the skin smoothing strength (0-9).|
|`setWhitenessLevel`|`void`|Set the brightening strength (0-9).|
|`setRuddyLevel`|`void`|Set the rosy strength (0-9).|
|`reset`|`void`|Reset all beauty parameters to default value (0).|

### BaseBeautyState

|**Attribute**|**Type**|**Description**|
|---------|---------|---------|
|`smoothLevel`|`ValueListenable<double>`|Skin smoothing strength (0-9).|
|`whitenessLevel`|`ValueListenable<double>`|Brightening strength (0-9).|
|`ruddyLevel`|`ValueListenable<double>`|Rosy strength (0-9).|

## FAQs

### Beauty parameters have no effect after being set

If you do not see any beauty effect after setting the parameters, check the following:
1. Camera enabled: Make sure the camera is open (for example, using `DeviceStore.shared.openLocalCamera()`). Beauty effects are only applied to the video stream when the camera is active.

2. Advanced beauty integration: If you have integrated TencentEffect (advanced beauty), ensure you are using the APIs provided by TencentEffect to adjust beauty settings.

3. Parameter range: For basic beauty, verify that the intensity values you provide are within the valid range (0 to 9, as a double).
