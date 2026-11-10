---
sync_node_id: '183969148453998592'
nav_path:
  - "聊天互动（含 UI）"
  - "单功能接入"
  - "联系人列表"
  - "React"
  - "Contact Store"
product: "chat"
---
ContactStore offers robust contact data management for chat applications. It provides core features including friend list management, group list support, blacklist controls, and friend application workflows. If your requirements exceed what custom components can deliver, ContactStore can be leveraged to meet your needs.

### Properties

|Data Name|Type|Description|
|---------|---------|---------|
|friendList|ContactInfo[]|The friend list. Each entry contains user ID, nickname, avatar, friend remark, online status, isFriend flag, and blacklist status.|
|friendApplicationList|FriendApplicationInfo[]|List of friend applications. Tracks both incoming and outgoing friend requests.|
|friendApplicationUnreadCount|number|Number of unread friend applications.|
|blackList|ContactInfo[]|Blacklist. Each entry uses the ContactInfo structure and is flagged with isInBlacklist: true.|

### Methods

|Method|Signature|Description|
|---------|---------|---------|
|loadFriends|() => Promise|Loads the friend list, including relationships, blacklist status, and online state.|
|addFriend|(params: AddFriendParams) => Promise|Adds a friend. Parameters: userID, source, remark, and addWording.|
|deleteFriend|(userID: string) => Promise|Removes the specified friend and updates the local friendList.|
|setFriendRemark|(userID: string, remark: string) => Promise|Sets a friend remark and updates it locally for the designated friend.|
|getContactInfo|(userIDList: string[]) => Promise|Retrieves user profiles in bulk and returns standardized ContactInfo, including current friend and blacklist status.|
|loadBlackList|() => Promise|Loads the blacklist and synchronizes isInBlacklist status in the friend list.|
|addToBlacklist|(userID: string) => Promise|Adds the specified user to the blacklist and updates both blackList and friendList locally.|
|removeFromBlacklist|(userID: string) => Promise|Removes the specified user from the blacklist and updates blackList and friendList locally.|
|loadFriendApplications|() => Promise|Loads the friend application list and the count of unread applications.|
|acceptFriendApplication|(info: FriendApplicationInfo) => Promise|Accepts a friend application. Status changes are synchronized via SDK events.|
|refuseFriendApplication|(info: FriendApplicationInfo) => Promise|Rejects a friend application. Status changes are synchronized via SDK events.|
|clearFriendApplicationUnreadCount|() => Promise|Marks all friend applications as read and resets the local unread count to zero.|
|destroy|() => void|Unregisters event listeners, clears status subscriptions, and resets Store state. Usually managed by framework wrappers.|

## Usage Example

The following example shows how to use ContactStore and GroupStore to build a simple contacts page displaying both the friend list and group chat list.

【index.tsx】
``` typescript
import { useEffect } from 'react';
import {
  ContactStore,
  GroupStore,
} from '@tencentcloud/chat-uikit-react';
import './styles.css';

function ContactStoreBasicDemo() {
  const { friendList, loadFriends } = ContactStore();
  const { joinedGroupList, loadJoinedGroups } = GroupStore();

  useEffect(() => {
    loadFriends();
    loadJoinedGroups();
  }, []);

  return (
    <div className="contact-store-basic-demo">
      <div className="contact-store-basic-demo__header">
        <h2>Contact Store Basic</h2>
        <p>Simple friend and group list powered by ContactStore and GroupStore.</p>
      </div>

      <div className="contact-store-basic-demo__columns">
        <section className="contact-store-basic-demo__panel">
          <h3>Friends ({friendList.length})</h3>
          {friendList.length > 0 ? (
            <ul className="contact-store-basic-demo__list">
              {friendList.map(friend => (
                <li className="contact-store-basic-demo__item" key={friend.userID}>
                  <span className="contact-store-basic-demo__avatar">
                    {(friend.friendRemark || friend.nickname || friend.userID).slice(0, 1).toUpperCase()}
                  </span>
                  <span>
                    <strong>{friend.friendRemark || friend.nickname || friend.userID}</strong>
                    <small>{friend.userID}</small>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="contact-store-basic-demo__empty">No friends.</div>
          )}
        </section>

        <section className="contact-store-basic-demo__panel">
          <h3>Groups ({joinedGroupList.length})</h3>
          {joinedGroupList.length > 0 ? (
            <ul className="contact-store-basic-demo__list">
              {joinedGroupList.map(group => (
                <li className="contact-store-basic-demo__item" key={group.groupID}>
                  <span className="contact-store-basic-demo__avatar">
                    {(group.groupName || group.groupID).slice(0, 1).toUpperCase()}
                  </span>
                  <span>
                    <strong>{group.groupName || group.groupID}</strong>
                    <small>{group.groupID}</small>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="contact-store-basic-demo__empty">No groups.</div>
          )}
        </section>
      </div>
    </div>
  );
}

```

【styles.css】
``` css
.contact-store-basic-demo {
  display: flex;
  height: 100%;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
  overflow: hidden;
}

.contact-store-basic-demo__header h2 {
  margin: 0 0 8px;
  color: #111827;
  font-size: 22px;
}

.contact-store-basic-demo__header p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.contact-store-basic-demo__columns {
  display: grid;
  min-height: 0;
  flex: 1;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.contact-store-basic-demo__panel {
  display: flex;
  min-width: 0;
  min-height: 0;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #edf0f5;
  border-radius: 12px;
  background: #fff;
}

.contact-store-basic-demo__panel h3 {
  margin: 0;
  padding: 14px 16px;
  border-bottom: 1px solid #edf0f5;
  color: #111827;
  font-size: 15px;
}

.contact-store-basic-demo__list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 12px;
  overflow: auto;
  list-style: none;
}

.contact-store-basic-demo__item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 10px;
  background: #f9fafb;
}

.contact-store-basic-demo__avatar {
  display: inline-flex;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #eef2ff;
  color: #4f46e5;
  font-size: 13px;
  font-weight: 700;
}

.contact-store-basic-demo__item strong,
.contact-store-basic-demo__item small {
  display: block;
}

.contact-store-basic-demo__item strong {
  color: #111827;
  font-size: 14px;
}

.contact-store-basic-demo__item small {
  margin-top: 2px;
  color: #6b7280;
  font-size: 12px;
}

.contact-store-basic-demo__empty {
  padding: 24px;
  color: #6b7280;
  text-align: center;
}

```
