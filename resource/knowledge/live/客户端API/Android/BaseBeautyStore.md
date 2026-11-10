---
sync_node_id: '203640151745441792'
nav_path:
  - "直播与语聊 SDK"
  - "客户端 API"
  - "Android"
  - "BaseBeautyStore"
product: "live"
---
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
|smoothLevel|StateFlow<Float>|Smooth level, with a value range from 0 to 9; 0 means off, 9 means most obvious effect.|
|whitenessLevel|StateFlow<Float>|Whiteness level, with a value range from 0 to 9; 0 means off, 9 means most obvious effect.|
|ruddyLevel|StateFlow<Float>|Ruddy level, with a value range from 0 to 9; 0 means off, 9 means most obvious effect.|

## API List

|**Function**|**Description**|
|---------|---------|
|BaseBeautyStore.shared|Get singleton instance.|
|setSmoothLevel|Set smooth level.|
|setWhitenessLevel|Set whiteness level.|
|setRuddyLevel|Set ruddy level.|
|reset|Reset to default state.|

### Getting Instance

#### BaseBeautyStore.shared

Get singleton instance.

### Beauty Adjustment

#### setSmoothLevel

Set smooth level.
``` kotlin
abstract fun setSmoothLevel(smoothLevel: Float)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|smoothLevel|Float|Smooth level, with a value range from 0 to 9; 0 means off, 9 means most obvious effect.|

#### setWhitenessLevel

Set whiteness level.
``` kotlin
abstract fun setWhitenessLevel(whitenessLevel: Float)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|whitenessLevel|Float|Whiteness level, with a value range from 0 to 9; 0 means off, 9 means most obvious effect.|

#### setRuddyLevel

Set ruddy level.
``` kotlin
abstract fun setRuddyLevel(ruddyLevel: Float)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|ruddyLevel|Float|Ruddy level, with a value range from 0 to 9; 0 means off, 9 means most obvious effect.|

#### reset

Reset all beauty parameters (smooth, whiteness, ruddy) to default off state (value 0).
``` kotlin
abstract fun reset()
```

**Version**

Supported since version 3.5.

## Data Structures

### BaseBeautyState

Basic beauty state, managing the level data of smooth, whiteness, ruddy and other beauty effects. Supports subscription to synchronize UI display with actual effects.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|smoothLevel|StateFlow<Float>|Smooth level, with a value range from 0 to 9; 0 means off, 9 means most obvious effect.|
|whitenessLevel|StateFlow<Float>|Whiteness level, with a value range from 0 to 9; 0 means off, 9 means most obvious effect.|
|ruddyLevel|StateFlow<Float>|Ruddy level, with a value range from 0 to 9; 0 means off, 9 means most obvious effect.|

## Usage Example
``` kotlin
// Get singleton instance
val store = BaseBeautyStore.shared()
// Subscribe to state changes
lifecycleScope.launch {
    store.baseBeautyState.smoothLevel.collect { level ->
        println("Smooth level: $level")
    }
}
// Set beauty effects
store.setSmoothLevel(5f)
store.setWhitenessLevel(3f)
store.setRuddyLevel(2f)
// Reset all beauty effects
store.reset()
```
