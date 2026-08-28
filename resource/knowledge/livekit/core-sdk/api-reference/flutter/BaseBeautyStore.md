## Introduction

Basic beauty functionality achieves real-time beauty effect adjustment through easy-to-use APIs. `BaseBeautyStore` provides a complete set of interfaces to manage beauty effect settings and state subscriptions.

> **Note:**
> Beauty state updates are delivered through the **baseBeautyState** publisher. Subscribe to it to receive real-time updates about beauty effect levels.
>

## Features
- **Smooth Effect**: Supports 0-9 level smooth effect adjustment.

- **Whiteness Effect**: Supports 0-9 level whiteness effect adjustment.

- **Ruddy Effect**: Supports 0-9 level ruddy effect adjustment.

- **State Subscription**: Real-time subscription to beauty state changes, synchronizing UI display with actual effects.

## Subscribable Data

**BaseBeautyState** fields are described below:

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|smoothLevel|ValueListenable<double>|Smooth level, with a value range from 0 to 9; 0 means off, 9 means most obvious effect.|
|whitenessLevel|ValueListenable<double>|Whiteness level, with a value range from 0 to 9; 0 means off, 9 means most obvious effect.|
|ruddyLevel|ValueListenable<double>|Ruddy level, with a value range from 0 to 9; 0 means off, 9 means most obvious effect.|

## API List

|**Function**|**Description**|
|---------|---------|
|shared|Get singleton instance.|
|setSmoothLevel|Set smooth level.|
|setWhitenessLevel|Set whiteness level.|
|setRuddyLevel|Set ruddy level.|
|reset|Reset to default state.|

### Getting Instance

#### shared

Get singleton instance.

### Beauty Adjustment

#### setSmoothLevel

Set smooth level.
``` dart
void setSmoothLevel(double smoothLevel);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|smoothLevel|double|Smooth level, with a value range from 0 to 9; 0 means off, 9 means most obvious effect.|

#### setWhitenessLevel

Set whiteness level.
``` dart
void setWhitenessLevel(double whitenessLevel);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|whitenessLevel|double|Whiteness level, with a value range from 0 to 9; 0 means off, 9 means most obvious effect.|

#### setRuddyLevel

Set ruddy level.
``` dart
void setRuddyLevel(double ruddyLevel);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|ruddyLevel|double|Ruddy level, with a value range from 0 to 9; 0 means off, 9 means most obvious effect.|

#### reset

Reset all beauty parameters (smooth, whiteness, ruddy) to default off state (value 0).
``` dart
void reset();
```

**Version**

Supported since version 3.5.

## Data Structures

### BaseBeautyState

Basic beauty state, managing the level data of smooth, whiteness, ruddy and other beauty effects. Supports subscription to synchronize UI display with actual effects.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|smoothLevel|ValueListenable<double>|Smooth level, with a value range from 0 to 9; 0 means off, 9 means most obvious effect.|
|whitenessLevel|ValueListenable<double>|Whiteness level, with a value range from 0 to 9; 0 means off, 9 means most obvious effect.|
|ruddyLevel|ValueListenable<double>|Ruddy level, with a value range from 0 to 9; 0 means off, 9 means most obvious effect.|

## Usage Example
``` dart
// Get singleton instance
final store = BaseBeautyStore.shared;
// Define listeners
late final VoidCallback smoothLevelListener = _onSmoothLevelChanged;
late final VoidCallback whitenessLevelListener = _onWhitenessLevelChanged;
late final VoidCallback ruddyLevelListener = _onRuddyLevelChanged;
void _onSmoothLevelChanged() {
    print('Smooth level: ${store.baseBeautyState.smoothLevel.value}');
}
void _onWhitenessLevelChanged() {
    print('Whiteness level: ${store.baseBeautyState.whitenessLevel.value}');
}
void _onRuddyLevelChanged() {
    print('Ruddy level: ${store.baseBeautyState.ruddyLevel.value}');
}
// Subscribe to state changes
store.baseBeautyState.smoothLevel.addListener(smoothLevelListener);
store.baseBeautyState.whitenessLevel.addListener(whitenessLevelListener);
store.baseBeautyState.ruddyLevel.addListener(ruddyLevelListener);
// Set beauty effects
store.setSmoothLevel(5.0);
store.setWhitenessLevel(3.0);
store.setRuddyLevel(2.0);
// Reset all beauty effects
store.reset();
// Unsubscribe when done
store.baseBeautyState.smoothLevel.removeListener(smoothLevelListener);
store.baseBeautyState.whitenessLevel.removeListener(whitenessLevelListener);
store.baseBeautyState.ruddyLevel.removeListener(ruddyLevelListener);
```
