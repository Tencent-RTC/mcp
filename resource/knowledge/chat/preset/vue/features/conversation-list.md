## Component Overview

The `ConversationList` component renders the conversation list and supports search, creation, pinning, deletion, and other conversation actions.

## Component Structure

The `ConversationList` component includes the following:
- **ConversationSearch**: Conversation search

- **ConversationList UI**: Conversation list container

- **ConversationPreview**: Single-conversation preview

- **ConversationActions**: Per-conversation actions

## Basic Usage

The `ConversationList` component works without any required props.
``` typescript
<template>
  <UIKitProvider>
    <ConversationList />
  </UIKitProvider>
</template>
<script setup lang="ts">
import { UIKitProvider, ConversationList } from '@tencentcloud/chat-uikit-vue3';
</script>
```

## Customization

`ConversationList` exposes a rich, multi-dimensional props interface for customizing features, UI, modules, and more.

You can replace multiple subcomponents in `ConversationList`, including **Header**, **List**, **ConversationPreview**, **ConversationCreate**, **ConversationSearch**, **ConversationActions**, **Avatar**, and **Placeholder**. You can also extend the default subcomponents for further customization.

### Feature Toggles

Use `enableSearch`, `enableCreate`, and `enableActions` to control whether conversation search, conversation creation, and conversation actions are shown in **ConversationList**.
``` typescript
<ConversationList :enableSearch="false" />
```

``` typescript
<ConversationList :enableCreate="false" />
```

``` typescript
<ConversationList :enableActions="false" />
```

### Data Filtering and Sorting

The `ConversationList` component provides `filter` and `sort` props for filtering and sorting the conversation list.

#### Filter Conversations

To filter conversation list data, pass a filter function to the `filter` prop. The function receives a `ConversationModel` array and should return a new array containing only conversations that match your criteria.

**Example: show only conversations with unread messages**
``` typescript
<template>
  <UIKitProvider>
    <ConversationList
      :filter="(conversationList: ConversationInfo[]) =>
        conversationList.filter(conversation => conversation.unreadCount > 0)" />
  </UIKitProvider>
</template>
<script setup lang="ts">
import { UIKitProvider, ConversationList } from '@tencentcloud/chat-uikit-vue3';
import type { ConversationInfo } from '@tencentcloud/chat-uikit-vue3';
</script>
```

#### Sort Conversations

To sort conversation list data, pass a sort function to the `sort` prop. The function receives a `ConversationModel` array and should return a new array sorted according to your criteria.

**Example: sort by latest message time in descending order**
``` typescript
<template>
  <UIKitProvider>
    <ConversationList
      :sort="(conversationList: ConversationInfo[]) =>
      (a, b) => {
            const timeA = a.lastMessage?.timestamp?.getTime() || 0;
            const timeB = b.lastMessage?.timestamp?.getTime() || 0;
            return timeB - timeA;
          },
      "
    />
  </UIKitProvider>
</template>
<script setup lang="ts">
import { UIKitProvider, ConversationList } from '@tencentcloud/chat-uikit-vue3';
import type { ConversationInfo } from '@tencentcloud/chat-uikit-vue3';
</script>
```

### Custom actionsConfig

Use `actionsConfig` to customize the conversation action menu.
``` typescript
<template>
  <UIKitProvider>
    <ConversationList
      :actionsConfig="{
        enablePin: false,
        onConversationDelete: (conversation: ConversationInfo) =>
        { console.log('Delete conversation success'); },
        customConversationActions: {
          'custom-actions-1': {
            label: 'custom-actions',
            onClick: (conversation: ConversationInfo) => { console.log(conversation); },
          },
        },
     }"/>
  </UIKitProvider>
</template>
<script setup lang="ts">
import { UIKitProvider, ConversationList } from '@tencentcloud/chat-uikit-vue3';
import type { ConversationInfo } from '@tencentcloud/chat-uikit-vue3';
</script>
```

### Custom Placeholder

`ConversationList` supports custom placeholders for different states: empty list, loading, and load error.
- `PlaceholderEmpty`: Shown when the list is empty.

- `PlaceholderLoading`: Shown while loading.

- `PlaceholderError`: Shown when loading fails.

   **Example: custom empty-list placeholder**

1. **Create a custom component** `MyEmptyPlaceholder.vue`

   ``` typescript
   <template>
       <div>
         Custom PlaceholderEmptyList
       </div>
   </template>
   ```
2. **Use it in** `ConversationList`**.**

   ``` typescript
   <template>
     <UIKitProvider>
       <ConversationList
         :PlaceholderEmptyList="MyEmptyPlaceholder" />
     </UIKitProvider>
   </template>
   <script setup lang="ts">
   import { UIKitProvider, ConversationList } from '@tencentcloud/chat-uikit-vue3';
   import MyEmptyPlaceholder from "./MyEmptyPlaceholder.vue";
   </script>
   ```

### Custom Header

**ConversationListHeader** renders the header section of `ConversationList`. By default, it wraps and renders `Search` and `ConversationCreate`. You can customize it by passing `left`, `right`, and other props, or replace the entire component.

#### Props
| **Prop Name** | **Type** | **Default** | **Description** |
| --- | --- | --- | --- |
| children | Component | - | Custom center component for the conversation list header.<br>By default, `<Search>` and `<ConversationCreate>` are passed in. |
| left | Component | - | Custom left-side component for the conversation list header. |
| right | Component | - | Custom right-side component for the conversation list header. |
| className | String | - | Custom CSS class name for the root element. |
| style | CSSProperties | - | Custom inline style for the root element. |

##### Example: implement a simple conversation grouping feature

Group conversations into All, Unread, One-to-one, and Group tabs. Clicking a tab applies the corresponding filter rule.

【App.vue】
``` typescript
<template>
  <UIKitProvider>
    <ConversationList
      :Header="CustomConversationListHeader"
      :filter="conversationFilter"
  </UIKitProvider>
</template>
<script setup lang="ts">
import { UIKitProvider, ConversationList } from '@tencentcloud/chat-uikit-vue3';
import type { ConversationInfo } from '@tencentcloud/chat-uikit-vue3';
import CustomConversationListHeader from "./CustomConversationListHeader.vue";
const conversationFilter = ref<((conversations: ConversationInfo[]) => ConversationModel[]) | undefined>(undefined);
const handleFilterChange = (filter: (conversations: ConversationInfo[]) => ConversationModel[]) => {
  conversationFilter.value = filter;
};
provide('setConversationFilter', handleFilterChange);
</script>
```

【CustomConversationListHeader.vue】
``` typescript
<template>
  <div class="customHeader">
    <div class="filterTabs">
      <button
        v-for="(label, key) in filterLabels"
        :key="key"
        :class="[
          'filterTab',
          { ['active']: activeFilter === key }
        ]"
        @click="handleFilterClick(key as FilterType)"
      >
        {{ label }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject } from 'vue';
import type { ConversationInfo } from '@tencentcloud/chat-uikit-vue3';

type FilterType = 'All' | 'Unread' | 'C2C' | 'Group';

interface Props {
  children?: any;
}

defineProps<Props>();

const activeFilter = ref<FilterType>('All');

const filterLabels: Record<FilterType, string> = {
  All: 'All',
  Unread: 'Unread',
  C2C: 'One-to-one',
  Group: 'Group',
};

const conversationGroupFilter: Record<string, (conversationList: ConversationInfo[]) => ConversationModel[]> = {
  All: (conversationList: ConversationInfo[]) => conversationList,
  Unread: (conversationList: ConversationInfo[]) => conversationList?.filter((item: ConversationModel) => item.unreadCount > 0),
  C2C: (conversationList: ConversationInfo[]) => conversationList?.filter((item: ConversationModel) => item.type === 'C2C'),
  Group: (conversationList: ConversationInfo[]) => conversationList?.filter((item: ConversationModel) => item.type === 'GROUP'),
};

const setFilter = inject<(filter: any) => void>('setConversationFilter');

const handleFilterClick = (filterType: FilterType) => {
  activeFilter.value = filterType;
  const filterFn = conversationGroupFilter[filterType];
  setFilter?.(filterFn);
};
</script>

<style lang="scss">
.customHeader {
  padding: 8px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filterTabs {
  display: flex;
  gap: 4px;
  align-items: center;
}

.filterTab {
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  background: transparent;
  cursor: pointer;
  font-size: 12px;
  font-weight: 400;
  color: #3b3d43;
  transition: all 0.2s ease;
  outline: none;

  &.active {
    border: 1px solid #1c66e5;
    color: #1c66e5;
    font-weight: 500;
  }
}
</style>

```

## Props

|**Prop Name**|**Type**|**Default**|**Description**|
|---------|---------|---------|---------|
|enableSearch|Boolean|true|Controls whether conversation search is shown.|
|enableCreate|Boolean|true|Controls whether conversation creation is shown.|
|enableActions|Boolean|true|Controls whether conversation actions are shown.|
|actionsConfig|ConversationActionsConfig|-|Custom conversation action configuration.|
|Header|Component|Header|Custom Header component.|
|List|Component|List|Custom conversation list component.|
|Preview|Component|ConversationPreview|Custom conversation preview component.|
|ConversationCreate|Component|ConversationCreate|Custom conversation creation component.|
|ConversationSearch|Component|Search|Custom conversation search component.|
|ConversationActions|Component|ConversationActions|Custom conversation actions component.|
|Avatar|Component|Avatar|Custom avatar component.|
|PlaceholderEmptyList|Component|<PlaceHolder type={PlaceHolderTypes.NO_CONVERSATIONS} />|Custom placeholder when the conversation list is empty.|
|PlaceholderLoading|Component|<PlaceHolder type={PlaceHolderTypes.LOADING} />|Custom placeholder while the conversation list is loading.|
|PlaceholderLoadError|Component|<PlaceHolder type={PlaceHolderTypes.WRONG} />|Custom placeholder when the conversation list fails to load.|
|filter|(conversationList: ConversationInfo[]) => ConversationInfo[]|-|Function for filtering the conversation list.|
|sort|(conversationList: ConversationModel[]) => ConversationModel[]|-|Function for sorting the conversation list.|
|onConversationSelect|(conversation: ConversationInfo) => void;|-|Callback when a conversation is clicked. Receives the selected conversation.|
|onBeforeCreateConversation|(params: CreateParams) => CreateParams;|-|Custom logic before creating a conversation. Receives the creation parameters.|
|onConversationCreate|(conversation: ConversationInfo)  => void;|-|Callback after a conversation is created. Receives the created conversation.|
|className|String|-|Custom CSS class name for the root element.|
|style|CSSProperties|-|Custom inline style for the root element.|
