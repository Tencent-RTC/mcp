---
sync_node_id: '203640181332484096'
nav_path:
  - "直播与语聊 SDK"
  - "客户端 API"
  - "Flutter"
  - "Define"
product: "live"
---
## Introduction

This module defines common base types across platforms, providing unified error handling and callback mechanisms for API calls.

## Features
- **Callback Mechanism**: Provides unified completion callback closure types.

## Data Structures

### CompletionHandler

Completion callback interface.

Interface for asynchronous operation result callbacks. Calls onSuccess on success, onFailure on failure.

**Properties**

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|errorCode|int|Error code.|
|errorMessage|String?|Error message description.|
|isSuccess|bool|Whether successful.|

## Usage Example
``` dart
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
