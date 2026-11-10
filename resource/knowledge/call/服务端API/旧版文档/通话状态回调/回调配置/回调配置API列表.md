---
sync_node_id: '141368867310379008'
nav_path:
  - "视频通话 SDK"
  - "服务端 API"
  - "旧版文档"
  - "通话状态回调"
  - "回调配置"
  - "回调配置 API 列表"
product: "call"
---
## Callback Information Configuration

|Feature Overview|API|
|---------|---------|
|Create Callback|v1/callback/set|
|Query Callback|v1/callback/get|
|Update Callback|v1/callback/update|
|Deleting callback|v1/callback/delete|

## Callback Command Word List
| Call Status Callback | Call Event Callback |
| --- | --- |
| - <code>cancel</code> Cancel: Caller cancels the call before it is answered<br>- <code>reject</code> Declined: The callee rejects the call<br>- <code>not_answer</code> Missed call: The callee does not answer within the timeout period<br>- <code>normal_end</code> Complete: The call is connected and ends normally<br>- <code>call_busy</code> Busy Line: The call is on a busy line<br>- <code>interrupt</code> Interruption: The call is interrupted due to network or other reasons | - <code>caller_start_call</code> Originator Initiates Call<br>- <code>caller_call_accepted</code> Originator Answers Call<br>- <code>caller_call_missed</code> Originator Misses Call<br>- <code>caller_call_rejected</code> Caller Rejects Call<br>- <code>caller_call_busy</code> Caller Line is Busy<br>- <code>caller_cancel_call</code> Caller Cancels Call<br>- <code>caller_call_failed</code> Caller Fails to Initiate Call<br>- <code>caller_call_end</code> Caller Ends Call Normally<br>- <code>caller_call_interrupted</code> Caller's Call Interrupted<br>- <code>callee_receive_call</code> Callee Receives Call<br>- <code>callee_accept_call</code> Callee Answers Call<br>- <code>callee_not_answer_call</code> Callee Does Not Answer<br>- <code>callee_reject_call</code> Callee Rejects Call<br>- <code>callee_ignore_call</code> Callee Ignores Call<br>- <code>callee_call_canceled</code> Callee Cancels Call<br>- <code>callee_call_end</code> Callee Ends Call Normally<br>- <code>callee_call_interrupted</code> Callee's Call Interrupted<br>- <code>invite_user</code> Midway invite user<br>- <code>join_in_group_call</code> Join the call midway |
