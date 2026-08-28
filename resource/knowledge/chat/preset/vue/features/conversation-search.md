`ConversationSearch` uses the **Search** component and supports searching users, groups, and messages. It integrates a search bar, advanced search, and search result display.

## Basic Usage
``` typescript
<template>
  <ConversationSearch {...props} @ResultItemClick={onSelectResult} />
</template>
<script setup lang="ts">
import { ConversationSearch, SearchType } from '@tencentcloud/chat-uikit-vue3';
import type { SearchResultItem } from '@tencentcloud/chat-uikit-vue3';
const props = defineProps<ConversationSearchProps>();

const onSelectResult = (data: SearchResultItem, type: SearchType) => {
  console.warn(`Select Search Result: ${JSON.stringify(data)}, type: ${type}`);
};
</script>
```

``` typescript
<template>
  <UIKitProvider>
    <ConversationList ConversationSearch={CustomConversationSearch} />
  </UIKitProvider>
</template>
<script setup lang="ts">
import { UIKitProvider, ConversationList } from '@tencentcloud/chat-uikit-vue3';
import CustomConversationSearch from "./CustomConversationSearch.vue";
</script>
```

## Props
| <strong>Property</strong> | <strong>Type</strong> | <strong>Default</strong> | <strong>Description</strong> |
| --- | --- | --- | --- |
| visible | boolean | true | Whether the component is visible |
| Search | ComponentType<SearchProps> | - | Custom search component |
| variant | VariantType | VariantType.MINI | Search mode:<br>- mini: compact<br>- standard: standard<br>- embedded: embedded |
| SearchBar | Component<SearchBarProps> | DefaultSearchBar | Custom search bar component |
| SearchResults | Component<SearchResultsProps> | DefaultSearchResults | Custom search results component |
| SearchAdvanced | Component<SearchAdvancedProps> | DefaultSearchAdvanced | Custom advanced search component |
| SearchResultsPresearch | Component | - | Placeholder component shown before search |
| SearchResultsLoading | Component | - | Loading placeholder component |
| SearchResultsEmpty | Component | - | Empty results placeholder component |
| SearchResultItem | Component<ResultItemProps> | - | Custom search result item component |
| debounceTime | number | 300 | Search debounce interval in milliseconds |
| autoFocus | boolean | false | Whether to auto-focus the search input |
| className | string | - | Custom CSS class name |
| style | CSSProperties | - | Custom inline styles |
| onKeywordChange | (keyword: string) => void | - | Callback when the search keyword changes |
| onSearchComplete | (results: Map<SearchType, SearchResult>) => void | - | Callback when search completes |
| onResultItemClick | (data: SearchResultItem, type: SearchType) => void | - | Callback when a search result item is clicked |
| onError | (error: Error) => void | - | Callback when a search error occurs |
