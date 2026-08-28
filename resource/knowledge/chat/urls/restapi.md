# Server REST API — official documentation URL map

## General

| Query | Documentation |
|-------|---------------|
| Generate UserSig | `https://trtc.io/document/34385` |
| Server message format | `https://trtc.io/document/33527` |

## Message REST APIs

### Send messages

| Query | Documentation |
|-------|---------------|
| Send one-to-one message (v4/openim/sendmsg) | `https://trtc.io/document/34919` |
| Send one-to-one messages to multiple users (v4/openim/batchsendmsg) | `https://trtc.io/document/34920` |
| Send ordinary group message (v4/group_open_http_svc/send_group_msg) | `https://trtc.io/document/34959` |
| Send C2C streaming message | `https://trtc.io/document/71131` |
| Send group streaming message | `https://trtc.io/document/71131` |
| AVChatRoom broadcast message (v4/group_open_http_svc/send_broadcast_msg) | `https://trtc.io/document/49440` |
| Import group messages (v4/group_open_http_svc/import_group_msg) | `https://trtc.io/document/34968` |
| Import one-to-one messages (v4/openim/importmsg) | `https://trtc.io/document/35014` |
| Official account user broadcast message | `https://trtc.io/document/60810` |

### Message history

| Query | Documentation |
|-------|---------------|
| Modify historical one-to-one messages (v4/openim/modify_c2c_msg) | `https://trtc.io/document/47722` |
| Modify historical group messages (v4/openim/modify_group_msg) | `https://trtc.io/document/47948` |
| Query one-to-one message history (v4/openim/admin_getroammsg) | `https://trtc.io/document/35478` |
| Get group message history (v4/group_open_http_svc/group_msg_get_simple) | `https://trtc.io/document/34971` |

### Delete messages

| Query | Documentation |
|-------|---------------|
| Delete messages sent by a specified user (v4/group_open_http_svc/delete_group_msg_by_sender) | `https://trtc.io/document/34970` |

### Recall messages

| Query | Documentation |
|-------|---------------|
| Recall one-to-one message (v4/openim/admin_msgwithdraw) | `https://trtc.io/document/35015` |
| Recall group message (v4/group_open_http_svc/group_msg_recall) | `https://trtc.io/document/34965` |

### Read receipts

| Query | Documentation |
|-------|---------------|
| Group message read receipt (v4/group_open_http_svc/send_group_msg) | `https://trtc.io/document/34959` |
| Mark one-to-one messages as read (v4/openim/admin_set_msg_read) | `https://trtc.io/document/34919` |
| Pull group message read receipt details | `https://trtc.io/document/49438` |
| Pull group message read receipt info | `https://trtc.io/document/49439` |

### Message extension

| Query | Documentation |
|-------|---------------|
| Pull one-to-one message extension | `https://trtc.io/document/51194` |
| Set one-to-one message extension | `https://trtc.io/document/51195` |
| Pull group message extension | `https://trtc.io/document/52169` |
| Set group message extension | `https://trtc.io/document/52170` |

## Conversation REST APIs

### Conversation basics

| Query | Documentation |
|-------|---------------|
| Pull conversation list (v4/recentcontact/get_list) | `https://trtc.io/document/43087` |
| Set member unread message count (v4/group_open_http_svc/set_unread_msg_num) | `https://trtc.io/document/34909` |
| Query one-to-one unread message count (v4/openim/get_c2c_unread_msg_num) | `https://trtc.io/document/41046` |
| Delete a conversation (v4/recentcontact/delete) | `https://trtc.io/document/43088` |

### Conversation groups and marks

| Query | Documentation |
|-------|---------------|
| Create conversation group data (v4/recentcontact/create_contact_group) | `https://trtc.io/document/53437` |
| Update conversation group data (v4/recentcontact/update_contact_group) | `https://trtc.io/document/53439` |
| Delete conversation group data (v4/recentcontact/del_contact_group) | `https://trtc.io/document/53441` |
| Create or update conversation mark data (v4/recentcontact/mark_contact) | `https://trtc.io/document/53438` |
| Search conversation group marks (v4/recentcontact/search_contact_group) | `https://trtc.io/document/53442` |
| Pull conversation group mark data (v4/recentcontact/get_contact_group) | `https://trtc.io/document/53440` |

## Group REST APIs

### Group management

| Query | Documentation |
|-------|---------------|
| Create a group (v4/group_open_http_svc/create_group) | `https://trtc.io/document/34895` |
| Disband a group (v4/group_open_http_svc/destroy_group) | `https://trtc.io/document/34896` |
| Get groups a user has joined (v4/group_open_http_svc/get_joined_group_list) | `https://trtc.io/document/34925` |
| Get all groups in an app (v4/group_open_http_svc/get_appid_group_list) | `https://trtc.io/document/34960` |

### Group profile

| Query | Documentation |
|-------|---------------|
| Get group profiles (v4/group_open_http_svc/get_group_info) | `https://trtc.io/document/34961` |
| Modify group basic info (v4/group_open_http_svc/modify_group_base_info) | `https://trtc.io/document/34962` |
| Import group profile (v4/group_open_http_svc/import_group) | `https://trtc.io/document/34967` |

### Group member management

| Query | Documentation |
|-------|---------------|
| Add group members (v4/group_open_http_svc/add_group_member) | `https://trtc.io/document/34921` |
| Delete group members (v4/group_open_http_svc/delete_group_member) | `https://trtc.io/document/34949` |
| Ban group members (v4/group_open_http_svc/ban_group_member) | `https://trtc.io/document/50296` |
| Unban group members (v4/group_open_http_svc/unban_group_member) | `https://trtc.io/document/50297` |
| Get banned group member list (v4/group_open_http_svc/get_group_ban_member) | `https://trtc.io/document/50295` |
| Mute and unmute group members (v4/group_open_http_svc/forbid_send_msg) | `https://trtc.io/document/34951` |
| Get muted group member list (v4/group_open_http_svc/get_group_shutted_uin) | `https://trtc.io/document/34964` |
| Change group owner (v4/group_open_http_svc/change_group_owner) | `https://trtc.io/document/34966` |
| Query user role in group (v4/group_open_http_svc/get_role_in_group) | `https://trtc.io/document/34963` |
| Import group members (v4/group_open_http_svc/import_group_member) | `https://trtc.io/document/34969` |

### Group member profile

| Query | Documentation |
|-------|---------------|
| Get group member profiles (v4/group_open_http_svc/get_group_member_info) | `https://trtc.io/document/34948` |
| Get specified group member profiles | `https://trtc.io/document/64897` |
| Modify group member profile (v4/group_open_http_svc/modify_group_member_info) | `https://trtc.io/document/34900` |

### Group custom attributes

| Query | Documentation |
|-------|---------------|
| Get group custom attributes (v4/group_open_attr_http_svc/get_group_attr) | `https://trtc.io/document/44187` |
| Modify group custom attributes (v4/group_open_http_svc/modify_group_attr) | `https://trtc.io/document/44188` |
| Clear group custom attributes (v4/group_open_http_svc/clear_group_attr) | `https://trtc.io/document/44189` |
| Reset group custom attributes (v4/group_open_http_svc/set_group_attr) | `https://trtc.io/document/44190` |
| Delete group custom attributes (v4/group_open_http_svc/delete_group_attr) | `https://trtc.io/document/59499` |

### AVChatRoom management

| Query | Documentation |
|-------|---------------|
| Get AVChatRoom online member count (v4/group_open_http_svc/get_online_member_num) | `https://trtc.io/document/38521` |
| Get AVChatRoom online member list | `https://trtc.io/document/50293` |
| Set AVChatRoom member marks | `https://trtc.io/document/50294` |

### Community management

| Query | Documentation |
|-------|---------------|
| Create topic | `https://trtc.io/document/49471` |
| Disband topic | `https://trtc.io/document/49470` |
| Get topic profile | `https://trtc.io/document/49469` |
| Modify topic profile | `https://trtc.io/document/49468` |
| Import topic profile | `https://trtc.io/document/53448` |

### Group counter

| Query | Documentation |
|-------|---------------|
| Get group counter (v4/group_open_http_svc/get_group_counter) | `https://trtc.io/document/53427` |
| Update group counter (v4/group_open_http_svc/update_group_counter) | `https://trtc.io/document/53428` |
| Delete group counter (v4/group_open_http_svc/delete_group_counter) | `https://trtc.io/document/53429` |

## User REST APIs

### Account management

| Query | Documentation |
|-------|---------------|
| Import a single account (v4/im_open_login_svc/account_import) | `https://trtc.io/document/34953` |
| Import multiple accounts (v4/im_open_login_svc/multiaccount_import) | `https://trtc.io/document/34954` |
| Query accounts (v4/im_open_login_svc/account_check) | `https://trtc.io/document/34956` |
| Delete accounts (v4/im_open_login_svc/account_delete) | `https://trtc.io/document/34955` |

### User profile management

| Query | Documentation |
|-------|---------------|
| Pull user profiles (v4/profile/portrait_get) | `https://trtc.io/document/34917` |
| Configure user profiles (v4/profile/portrait_set) | `https://trtc.io/document/34916` |

### User online status

| Query | Documentation |
|-------|---------------|
| Query account online status (v4/openim/query_online_status) | `https://trtc.io/document/35477` |
| Invalidate account login state (v4/im_open_login_svc/kick) | `https://trtc.io/document/34957` |

### Global mute management

| Query | Documentation |
|-------|---------------|
| Set global mute (v4/openconfigsvr/setnospeaking) | `https://trtc.io/document/34923` |
| Query global mute (v4/openconfigsvr/getnospeaking) | `https://trtc.io/document/34924` |

### Chatbots

| Query | Documentation |
|-------|---------------|
| Send streaming response message | `https://trtc.io/document/71131` |
| Create chatbot | `https://trtc.io/document/55281` |
| Delete chatbot | `https://trtc.io/document/55282` |
| Get all chatbots | `https://trtc.io/document/55280` |
