---
sync_node_id: '153440163237294080'
nav_path:
  - "直播与语聊 SDK"
  - "服务端 API"
  - "REST API"
  - "REST API 列表"
product: "live"
---
## Room management

|Feature|API|
|---------|---------|
|Create Room|live_engine_http_srv/create_room|
|Dismiss room|live_engine_http_srv/destroy_room|
|Update Room Information|live_engine_http_srv/update_room_info|
|Retrieve Room Information|live_engine_http_srv/get_room_info|
|Getting the Live Stream List|live_engine_http_srv/get_room_list|
|Retrieve Room Metadata|live_engine_http_srv/get_room_metadata|
|Set Room Metadata|live_engine_http_srv/set_room_metadata|
|Delete Room Metadata|live_engine_http_srv/del_room_metadata|
|Retrieve Room Statistics|live_engine_http_srv/get_room_statistics|

## User management

|Feature|API|
|---------|---------|
|Fetch Administrator List|live_engine_http_srv/get_admin_list|
|Member Ban|live_engine_http_srv/ban_member|
|Unblocking Members|live_engine_http_srv/unban_member|
|Obtaining the Block List|live_engine_http_srv/get_banned_member_list|
|Modify Administrator|live_engine_http_srv/modify_admin|
|Mute Member|live_engine_http_srv/mute_member|
|Get Muted Member List|live_engine_http_srv/get_muted_member_list|
|Get Room Member List|live_engine_http_srv/get_member_list|
|Transfer Room Ownership|live_engine_http_srv/change_room_owner|

## Account Management

|Feature|API|
|---------|---------|
|Import Single Account|im_open_login_svc/account_import|
|User Profile|profile/portrait_set|

## Seat Management

|Feature|API|
|---------|---------|
|Get Seat List|live_engine_http_srv/get_seat_list|
|Take Seat|live_engine_http_srv/take_seat|
|Leave Seat|live_engine_http_srv/leave_seat|
|Lock Seat|live_engine_http_srv/lock_seat|
|Move Seat|live_engine_http_srv/move_seat|

## PK

|Feature|API|
|---------|---------|
|Start PK|live_engine_http_srv/start_pk|
|Set PK Score|live_engine_http_srv/update_pk_score|
|Get PK Info|live_engine_http_srv/get_pk_info|

## Robot

|Feature|API|
|---------|---------|
|Add Robot|live_engine_http_srv/add_robot|
|Delete Robot|live_engine_http_srv/delete_robot|
|Get Robot|live_engine_http_srv/get_robot|

## Message Management

|Feature|API|
|---------|---------|
|Send Normal Message|live_engine_http_srv/send_normal_message|
|Send Custom Message|live_engine_http_srv/send_custom_message|
|Message Format Description|live_engine_http_srv/message_format|
