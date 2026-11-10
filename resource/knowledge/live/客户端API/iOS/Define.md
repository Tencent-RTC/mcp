---
sync_node_id: '162947525639995392'
nav_path:
  - "直播与语聊 SDK"
  - "客户端 API"
  - "iOS"
  - "Define"
product: "live"
---
## Introduction

This module defines common base types across platforms, providing unified error handling and callback mechanisms for API calls.

## Features
- **Callback Mechanism**: Provides unified completion callback closure types.

## Data Structures

### CompletionClosure

Provides basic type definitions, including error handling structures, callback closure types, and reactive state management tools.
``` swift
public typealias CompletionClosure = (Result<Void, ErrorInfo>) -> Void
```

### ErrorInfo

Error information structure.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|code|Int|Error code.|
|message|String|Error message description.|

### StatePublisher

State publisher.

### StatePropertySelector

State property selector protocol.

### StatePublisherSelector

State publisher selector.

### ListResultCompletionClosure

List result completion callback interface.

Interface for asynchronous operation result callbacks that return paginated lists.

Swift's `Result` is a generic enum with two cases:
- `.success(value)`: Operation succeeded, associated value is the success result
- `.failure(error)`: Operation failed, associated value is the error info

### Usage Example

`**swift
// Define a method using ListResultCompletionClosure
func fetchUserList(cursor: String, completion: @escaping ListResultCompletionClosure<User>) {
    // Async operation...
}

// Call the method and handle the Result
fetchUserList(cursor: "") { result in
    switch result {
    case .success(let (users, nextCursor)):
        // Handle success - users is [User], nextCursor is String
        print("Fetched \(users.count) users, next cursor: \(nextCursor)")
        for user in users {
            print("User: \(user.name)")
        }
    case .failure(let error):
        // Handle failure - error is ErrorInfo
        print("Error code: \(error.code), message: \(error.message)")
    }
}
**`.

## Usage Example
``` swift
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
