## Overview

ContactList is a highly configurable contact list component. It supports friend list, group list, blocklist, and application management, offering core features such as group collapsing, search filtering, and custom rendering. It is suitable for contact management interfaces in instant messaging and social applications.

## ContactList Props

|Field|Type|Default Value|Description|
|---------|---------|---------|---------|
|activeContactItem|ContactGroupItem \| undefined|undefined|Currently active contact item|
|enableSearch|boolean|true|Whether to enable the search feature|
|groupConfig|Partial<Record<ContactItemType, CustomGroupConfig>>|{}|Custom group configuration|
|searchPlaceholder|string|'Search contacts'|Search box placeholder text|
|emptyText|string|'No contacts'|Empty state prompt text|
|ContactItem|Component \| undefined|ContactListItem|Custom contact item component|
|ContactSearchComponent|Component \| undefined|ContactSearch|Custom search component|
|GroupHeader|Component \| undefined|Default group header|Custom group header component|
|PlaceholderEmptyList|Component \| undefined|Default empty state|Custom empty state component|
|onContactItemClick|(item: ContactGroupItem) => void|undefined|Contact item click callback|
|onFriendApplicationAction|(action: 'accept' \| 'refuse', application: FriendApplication) => void|undefined|Friend application action callback|
|onGroupApplicationAction|(action: 'accept' \| 'refuse', application: GroupApplication) => void|undefined|Group application action callback|

## ContactList Events

|Event Name|Parameters|Description|
|---------|---------|---------|
|contact-item-click|(item: ContactGroupItem)|Contact item click event|
|friend-application-action|(action: 'accept' \| 'refuse', application: FriendApplication)|Friend application action event|
|group-application-action|(action: 'accept' \| 'refuse', application: GroupApplication)|Group application action event|

## ContactInfo Props

|Field|Type|Default Value|Description|
|---------|---------|---------|---------|
|contactItem|ContactGroupItem \| undefined|undefined|Currently displayed contact item|
|showActions|boolean|true|Whether to show action buttons|
|PlaceholderEmpty|Component \| undefined|undefined|Empty state placeholder component|
|FriendInfoComponent|Component|FriendInfo|Friend info component|
|GroupInfoComponent|Component|GroupInfo|Group info component|
|BlacklistInfoComponent|Component|BlacklistInfo|Blocklist info component|
|FriendApplicationInfoComponent|Component|FriendApplicationInfo|Friend application info component|
|GroupApplicationInfoComponent|Component|GroupApplicationInfo|Group application info component|
|SearchGroupInfoComponent|Component|SearchGroupInfo|Search group info component|
|SearchUserInfoComponent|Component|SearchUserInfo|Search user info component|

## ContactInfo Events

|Event Name|Parameters|Description|
|---------|---------|---------|
|close|-|Close info panel event|
|sendMessage|(friend: Friend)|Send message event|
|deleteFriend|(friend: Friend)|Delete friend event|
|addToBlacklist|(friend: Friend)|Add to blocklist event|
|removeFromBlacklist|(profile: UserProfile)|Remove from blocklist event|
|updateFriendRemark|(friend: Friend)|Update friend remark event|
|enterGroup|(group: GroupModel)|Enter group event|
|leaveGroup|(group: GroupModel)|Leave group event|
|dismissGroup|(group: GroupModel)|Dismiss group event|
|friendApplicationAction|(action: 'accept' \| 'refuse', application: FriendApplication)|Friend application action event|
|groupApplicationAction|(action: 'accept' \| 'refuse', application: GroupApplication)|Group application action event|
|addFriend|(user: UserProfile, wording: string)|Add friend event|
|joinGroup|(group: GroupModel, note: string)|Join group event|

## Basic Usage
``` typescript
<template>
  <div class="contact-container">
    <ContactList />
    <ContactInfo />
  </div>
</template>

<script setup lang="ts">
import { ContactList, ContactInfo } from '@tencentcloud/chat-uikit-vue3';
</script>

<style scoped>
.contact-container {
  display: flex;
  height: 100vh;
}
</style>
```

## Customization

### Custom Contact List Search Toggle

Use the `enableSearch` prop to control whether friend and group search is shown in `ContactList`.
``` typescript
<template>
  <ContactList :enableSearch="false" />
</template>
```

|enableSearch="true"|enableSearch="false"|
|---------|---------|
|<br>|<br>|

### Custom Contact List Group Configuration

Use `groupConfig` to customize group settings, including title, display order, and hidden groups.
``` typescript
<template>
  <ContactList :groupConfig="customGroupConfig" />
</template>

<script setup lang="ts">
import { ContactList } from '@tencentcloud/chat-uikit-vue3';
import { ContactItemType } from '@tencentcloud/chat-uikit-vue3';

const customGroupConfig = {
  [ContactItemType.FRIEND]: {
    title: 'My Friends',
    order: 1,
  },
  [ContactItemType.GROUP]: {
    title: 'Group Chats',
    order: 2,
  },
  [ContactItemType.BLACK]: {
    hidden: true,
  },
  [ContactItemType.FRIEND_REQUEST]: {
    title: 'Friend Requests',
    order: 0,
  }
};
</script>
```

|Before|After|
|---------|---------|
|<br>|<br>|

### Custom Contact List Item

Pass a custom `ContactItem` component to fully control how each contact list item is rendered.
``` typescript
<template>
  <div class="custom-contact-item" @click="handleClick">
    <label>Custom contact</label>
    <span v-if="props.contactItem.type === ContactItemType.FRIEND">{{ props.contactItem.data.nick }}</span>
    <span v-if="props.contactItem.type === ContactItemType.GROUP">{{ props.contactItem.data.name }}</span>
  </div>
</template>
<script setup lang="ts">
import { ContactItemType } from '@tencentcloud/chat-uikit-vue3';

const props = defineProps<{
  contactItem: any;
}>();
const emit = defineEmits<{
  click: [type: ContactItemType, item: any];
}>();
const handleClick = () => {
  emit('click', props.contactItem.type, props.contactItem.data);
};
</script>
<style scoped>
.custom-contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  border-bottom: 1px solid #eee;
}
</style>

```

``` typescript
<template>
  <ContactList :ContactItem="CustomContactItem" />
</template>

<script setup lang="ts">
import { ContactList } from '@tencentcloud/chat-uikit-vue3';
import CustomContactItem from './CustomContactItem.vue';
</script>
```

### Custom Contact Detail Action Toggle

Use the `showActions` prop to control whether action buttons are shown on the contact detail page.
``` typescript
<template>
  <ContactInfo
    :showActions="false"
  />
</template>
```

### Custom Contact Detail Empty State

When no contact is selected, you can customize the empty state component.
``` typescript
<template>
  <div>
    Custom empty state
  </div>
</template>
```

``` typescript
<template>
  <ContactInfo
    :PlaceholderEmpty="CustomEmpty"
  />
</template>

<script setup lang="ts">
import { ContactList } from '@tencentcloud/chat-uikit-vue3';
import CustomEmpty from './CustomEmpty.vue';
</script>
```

### Custom Friend Detail Component

You can customize the detail view component for different contact types.
``` typescript
<template>
  <div class="custom-contact-info">
    <label>Custom friend detail</label>
    <div class="friend-info">

      <span>{{ friend.nick }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Friend } from '@tencentcloud/chat-uikit-vue3';

defineProps<{
  friend: Friend;
}>();
</script>
<style scoped>
.custom-contact-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
}
.friend-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}
.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%
}
</style>

```

``` typescript
<template>
  <ContactInfo
    :FriendInfoComponent="CustomFriendInfo"
  />
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue';
import type { FriendInfoProps, GroupInfoProps } from '@tencentcloud/chat-uikit-vue3';
import CustomFriendInfo from './CustomFriendInfo.vue';
</script>
```
