## Introduction

Basic beauty functionality achieves real-time beauty effect adjustment through easy-to-use APIs. `BaseBeautyStore` provides a complete set of interfaces to manage beauty effect settings and state subscriptions.

> **Note:**
> Beauty state updates are delivered through the **state** publisher. Subscribe to it to receive real-time updates about beauty effect levels.
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
|smoothLevel|Float|Smooth level, with a value range from 0 to 9; 0 means off, 9 means most obvious effect.|
|whitenessLevel|Float|Whiteness level, with a value range from 0 to 9; 0 means off, 9 means most obvious effect.|
|ruddyLevel|Float|Ruddy level, with a value range from 0 to 9; 0 means off, 9 means most obvious effect.|

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
``` swift
public func setSmoothLevel(smoothLevel: Float) {
    fatalError("\(#function) must be overridden by subclass")
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|smoothLevel|Float|Smooth level, with a value range from 0 to 9; 0 means off, 9 means most obvious effect.|

#### setWhitenessLevel

Set whiteness level.
``` swift
public func setWhitenessLevel(whitenessLevel: Float) {
    fatalError("\(#function) must be overridden by subclass")
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|whitenessLevel|Float|Whiteness level, with a value range from 0 to 9; 0 means off, 9 means most obvious effect.|

#### setRuddyLevel

Set ruddy level.
``` swift
public func setRuddyLevel(ruddyLevel: Float) {
    fatalError("\(#function) must be overridden by subclass")
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|ruddyLevel|Float|Ruddy level, with a value range from 0 to 9; 0 means off, 9 means most obvious effect.|

#### reset

Reset all beauty parameters (smooth, whiteness, ruddy) to default off state (value 0).
``` swift
public func reset() {
    fatalError("\(#function) must be overridden by subclass")
}
```

**Version**

Supported since version 3.5.

## Data Structures

### BaseBeautyState

Basic beauty state, managing the level data of smooth, whiteness, ruddy and other beauty effects. Supports subscription to synchronize UI display with actual effects.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|smoothLevel|Float|Smooth level, with a value range from 0 to 9; 0 means off, 9 means most obvious effect.|
|whitenessLevel|Float|Whiteness level, with a value range from 0 to 9; 0 means off, 9 means most obvious effect.|
|ruddyLevel|Float|Ruddy level, with a value range from 0 to 9; 0 means off, 9 means most obvious effect.|

## Usage Example
``` swift
// Get singleton instance
let store = BaseBeautyStore.shared
// Subscribe to state changes
store.state.subscribe { state in
    print("Smooth level: \(state.smoothLevel)")
    print("Whiteness level: \(state.whitenessLevel)")
    print("Ruddy level: \(state.ruddyLevel)")
}
// Set beauty effects
store.setSmoothLevel(smoothLevel: 5)
store.setWhitenessLevel(whitenessLevel: 3)
store.setRuddyLevel(ruddyLevel: 2)
// Reset all beauty effects
store.reset()
```
