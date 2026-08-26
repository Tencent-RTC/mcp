## Client error codes

### Common error codes
| Error code | Description |
| --- | --- |
| 0 | Operation succeeded |
| -1 | Uncategorized common error |
| -2 | The request was rate-limited, please retry later |
| -1000 | SDKAppID not found, please confirm the application information in the <a href="https://console.cloud.tencent.com/vcube/project/manage">Tencent Cloud VCube SDK console</a> |
| -1001 | An invalid parameter was passed when calling the API, check whether the input parameters are valid |
| -1002 | Not logged in, please call the Login interface |
| -1003 | Failed to obtain permission, the audio/video permission is currently not authorized, check whether the device permission is enabled |
| -1004 | This feature requires an additional package, please enable the corresponding package as needed in the <a href="https://console.cloud.tencent.com/vcube/project/manage">Tencent Cloud VCube SDK console</a> |

### Error definitions for local user rendering, video management, and audio management API callbacks
| Error code | Description |
| --- | --- |
| -1100 | System problem, failed to open the camera. Check whether the camera device is working properly |
| -1101 | The camera is not authorized by the system, check the system authorization |
| -1102 | The camera is occupied, check whether another process is using the camera |
| -1103 | There is currently no camera device, please plug in a camera device to resolve this problem |
| -1104 | System problem, failed to open the microphone. Check whether the microphone device is working properly |
| -1105 | The microphone is not authorized by the system, check the system authorization |
| -1106 | The microphone is occupied |
| -1107 | There is currently no microphone device |
| -1108 | Failed to obtain the screen sharing object, check the screen recording permission |
| -1109 | Failed to start screen sharing, check whether someone in the room is already sharing their screen |

### Error definitions for room management related API callbacks
| Error code | Description |
| --- | --- |
| -2100 | The room does not exist when entering, or it may have been dismissed |
| -2101 | You must enter the room before using this feature |
| -2102 | The room owner does not support the exit-room operation. Conference room type: you can transfer ownership first, then exit. LivingRoom (live) room type: the room owner can only dismiss the room |
| -2103 | This operation is not supported for the current room type |
| -2104 | This operation is not supported in the current speaking mode |
| -2105 | Illegal room ID for creating a room, a custom ID must be printable ASCII characters (0x20-0x7e), up to 48 bytes |
| -2106 | The room ID is already in use, please choose another room ID |
| -2107 | Illegal room name, the name is up to 30 bytes, the character encoding must be UTF-8, if it contains Chinese |
| -2108 | The current user is already in another room. A single roomEngine instance only supports the user entering one room. To enter a different room, exit first or use a new roomEngine instance |

### Error definitions for in-room user information API callbacks
| Error code | Description |
| --- | --- |
| -2200 | The user was not found |
| -2201 | The user was not found in the room |

### Error definitions for in-room user speaking management API callbacks & in-room seat management API callbacks
| Error code | Description |
| --- | --- |
| -2300 | Room owner permission is required to operate |
| -2301 | Room owner or administrator permission is required to operate |
| -2310 | No permission for the signaling request, e.g. canceling an invitation not initiated by yourself. |
| -2311 | The signaling request ID is invalid or has already been processed. |
| -2340 | The maximum number of seats exceeds the package limit |
| -2341 | The current user is already on a seat |
| -2342 | The current seat is already occupied |
| -2343 | The current seat is locked |
| -2344 | The seat number does not exist |
| -2345 | The current user is not on a seat |
| -2346 | The number of people on seats is full |
| -2360 | The audio of the current seat is locked |
| -2361 | You need to apply to the room owner or administrator to turn on the microphone |
| -2370 | The video of the current seat is locked, the camera can be turned on only after the room owner unlocks the seat |
| -2371 | You need to apply to the room owner or administrator to turn on the camera |
| -2380 | The current room has enabled mute all |
| -2381 | You have been muted in the current room |

## Server error codes
| Error code | Description |
| --- | --- |
| 83007 | The request was rate-limited |
| 84002 | The room does not exist |
| 84003 | The number of people in the room has exceeded the maximum package limit |
| 84004 | The user does not exist in the room |
| 84005 | The room already exists |
| 84006 | The room owner cannot exit the room |
| 85001 | The seats are full |
| 85002 | The seat is locked |
| 85003 | The user is already on a seat |
| 85004 | The seat is in use |
| 85005 | The seat number does not exist |
| 85006 | The seat audio is locked |
| 85007 | The seat video is locked |
| 85008 | Seats cannot be used in non-live scenarios |
| 87001 | Modifying member identity or room information is not allowed |
| 87002 | Insufficient permission, room owner or administrator identity is required |
| 87003 | IM group attribute update error |
| 87005 | IM group attribute retrieval exception |
| 87006 | Insufficient permission, only the room owner can operate |
| 87007 | Insufficient permission, only an administrator can operate |
| 87008 | Destroying the IM room is not allowed |
| 41001 | Error creating the IM group |
| 41002 | Error destroying the IM group |
| 41003 | Error adding an IM member |
| 41004 | Error deleting an IM member |
| 41005 | IM role change error |
| 42001 | Error scheduling the meeting |
| 42002 | Invalid scheduled meeting |
| 42003 | A scheduled meeting must be a conference scenario |
| 42004 | The scheduled meeting has not started |
| 42005 | The scheduled meeting has already started |
| 42006 | Too many invited members for the scheduled meeting, exceeding the count limit |
