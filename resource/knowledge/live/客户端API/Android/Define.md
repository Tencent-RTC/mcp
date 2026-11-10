---
sync_node_id: '162319173054558208'
nav_path:
  - "直播与语聊 SDK"
  - "客户端 API"
  - "Android"
  - "Define"
product: "live"
---
## Introduction

This module defines common base types across platforms, providing unified error handling and callback mechanisms for API calls.

## Features
- **Callback Mechanism**: Provides unified completion callback closure types.

## Data Structures

### CompletionHandler

Provides basic type definitions, including error handling structures, callback closure types, and reactive state management tools.

**Methods**

**onSuccess**: Called when operation succeeds.
``` kotlin
fun onSuccess()
```

**onFailure**: Called when operation fails.
``` kotlin
fun onFailure(code: Int, desc: String)
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|code|Int|Error code.|
|desc|String|Error description.|

### ListResultCompletionHandler

List result completion callback interface.

Interface for asynchronous operation result callbacks that return paginated lists.

**Methods**

**onSuccess**: Called when operation succeeds, returns list result and cursor.
``` kotlin
fun onSuccess(
    result: List<T>,
    cursor: String
)
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|result|List<T>|Result list.|
|cursor|String|Pagination cursor.|

**onFailure**: Called when operation fails.
``` kotlin
fun onFailure(
    code: Int,
    desc: String
)
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|code|Int|Error code.|
|desc|String|Error description.|

## Usage Example
``` kotlin
// CompletionClosure uses Swift's Result type:
// - .success(Void): Operation succeeded
// - .failure(ErrorInfo): Operation failed
func someAsyncOperation(completion: @escaping CompletionClosure) {
    // Async operation...
}
someAsyncOperation { result in
    switch result {
    case .success:
        print("Operation succeeded")
    case .failure(let error):
        print("Error code: \(error.code), message: \(error.message)")
    }
}
```
