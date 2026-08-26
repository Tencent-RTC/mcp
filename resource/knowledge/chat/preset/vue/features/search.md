## Overview

Search is a complete search solution with a full set of components, including search bar, result display, advanced search, and more. It is suitable for user, group, and message search in instant messaging, online meeting, and online education scenarios.

> This feature is a value-added service. You need to purchase the cloud search plugin. Click [Purchase](https://cloud.tencent.com/document/product/269/120945).
>

## Search Modes
| **Mini Mode (MINI)** | **Standard Mode (STANDARD)** | **Embedded Mode (EMBEDDED)** |
| --- | --- | --- |
| Suitable for sidebars or small containers<br>Shows a limited number of results<br>Supports expand to view more | Suitable for full-screen search UI<br>Full feature set<br>Supports advanced search | Suitable for chat UI<br>Focused on message search<br>Optimized layout |

## Props

|Prop Name|Type|Default Value|Description|
|---------|---------|---------|---------|
|variant|VariantType|VariantType.MINI|Search mode: mini, standard, embedded|
|SearchBar|Component<SearchBarProps>|DefaultSearchBar|Custom search bar component|
|SearchResults|Component<SearchResultsProps>|DefaultSearchResults|Custom search results component|
|SearchAdvanced|Component<SearchAdvancedProps>|DefaultSearchAdvanced|Custom advanced search component|
|SearchResultsPresearch|Component|-|Pre-search placeholder component|
|SearchResultsLoading|Component|-|Loading placeholder component|
|SearchResultsEmpty|Component|-|Empty result placeholder component|
|SearchResultItem|Component<ResultItemProps>|-|Custom search result item component|
|debounceTime|number|300|Search debounce time (ms)|
|autoFocus|boolean|false|Whether to auto-focus the search box|
|className|string|-|Custom CSS class name|
|style|CSSProperties|-|Custom inline style|
|onKeywordChange|(keyword: string) => void|-|Callback when the search keyword changes|
|onSearchComplete|(results: Map<SearchType, SearchResult>) => void|-|Callback when search completes|
|onResultItemClick|(data: SearchResultItem, type: SearchType) => void|-|Callback when a search result is clicked|
|onError|(error: Error) => void|-|Search error callback|

## Basic Usage
``` typescript
<template>
  <div class="app">
    <Search
      :variant="VariantType.STANDARD"
      @result-item-click="handleResultClick"
      @keyword-change="handleKeywordChange"
      @error="handleError"
    />
  </div>
</template>

<script setup lang="ts">
import { Search, VariantType } from '@tencentcloud/chat-uikit-vue3';
import type { SearchResultItemType, SearchType } from '@tencentcloud/chat-uikit-vue3';

const handleResultClick = (data: SearchResultItemType, type: SearchType) => {
  console.log('Search result click:', data, type);
};

const handleKeywordChange = (keyword: string) => {
  console.log('Search keyword changed:', keyword);
};

const handleError = (error: Error) => {
  console.error('Search error:', error);
};
</script>
```

## Customization

The `Search` component provides multiple replaceable subcomponents, allowing you to customize `SearchBar`, `SearchResults`, `SearchAdvanced`, `SearchResultItem`, `SearchResultsPresearch`, `SearchResultsLoading`, and `SearchResultsEmpty`. You can also extend the default subcomponents for further customization.

【Custom SearchBar】

**Props**

|Prop Name|Type|Default Value|Description|
|---------|---------|---------|---------|
|value|string|-|Search box value|
|onChange|(e: Event) => void|-|Input change callback|
|onKeyDown|(e: KeyboardEvent) => void|-|Keyboard event callback|
|onClear|() => void|-|Clear callback|
|placeholder|string|-|Placeholder text|
|SearchIcon|Component|-|Custom search icon|
|ClearIcon|Component|-|Custom clear icon|
|className|string|-|Custom CSS class name|
|style|CSSProperties|-|Custom inline style|
|onFocus|(e: FocusEvent) => void|-|Focus callback|
|onBlur|(e: FocusEvent) => void|-|Blur callback|
|autoFocus|boolean|false|Whether to auto-focus|
|variant|VariantType|-|Search mode|

**Example**
``` typescript
<template>
  <div class="custom-search-bar">
    <div class="search-bar-header">
      <span class="search-icon">🔍</span>
      <span class="search-title">Smart Search</span>
    </div>
    <div class="search-input-wrapper">
      <input
        type="text"
        :value="value"
        :placeholder="placeholder || 'Enter a keyword to start searching...'"
        @input="handleChange"
        class="enhanced-search-input"
      />
      <button
        v-if="value"
        @click="handleClear"
        class="enhanced-clear-btn"
      >
        ✕
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface SearchBarProps {
  value?: string;
  onChange?: (event: Event) => void;
  onClear?: () => void;
  placeholder?: string;
  variant?: string;
}

const props = defineProps<SearchBarProps>();

const emit = defineEmits<{
  change: [event: Event];
  clear: [];
}>();

const handleChange = (event: Event) => {
  if (props.onChange) {
    props.onChange(event);
  }
  emit('change', event);
};

const handleClear = () => {
  if (props.onClear) {
    props.onClear();
  }
  emit('clear');
};
</script>

<style scoped>
.custom-search-bar {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.search-bar-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-icon {
  font-size: 16px;
}

.search-title {
  font-weight: 500;
  color: #333;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.enhanced-search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
}

.enhanced-search-input:focus {
  border-color: #007bff;
}

.enhanced-clear-btn {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  font-size: 16px;
}

.enhanced-clear-btn:hover {
  color: #666;
}
</style>

```

``` typescript
<template>
  <Search :SearchBar="CustomSearchBar" />
</template>

<script setup lang="ts">
import { Search } from '@tencentcloud/chat-uikit-vue3';
import CustomSearchBar from './CustomSearchBar.vue';
</script>

```

【Custom SearchResults】

**Props**

|Prop Name|Type|Default Value|Description|
|---------|---------|---------|---------|
|results|Map<SearchType, SearchResult>|-|Search result data|
|isLoading|boolean|-|Whether loading is in progress|
|error|Error \| null|-|Error information|
|keyword|string|-|Search keyword|
|typeLabels|Record<SearchType, string>|-|Search type labels|
|onLoadMore|(type: SearchType) => void|-|Load more callback|
|onResultItemClick|(data: SearchResultItemType, type: SearchType) => void|-|Result item click callback|
|SearchResultsLoading|Component|Loading|Custom loading component|
|SearchResultsPresearch|Component|-|Pre-search placeholder component|
|SearchResultsEmpty|Component|EmptyResult|Empty result placeholder component|
|SearchResultItem|Component<ResultItemProps>|DefaultSearchResultsItem|Custom result item component|
|variant|VariantType|VariantType.STANDARD|Display mode|
|searchType|SearchType \| 'all'|'all'|Current search type|

**Example**
``` typescript
<template>
  <div class="custom-search-results">
    <div class="search-results-header">
      <span class="results-icon">📋</span>
      <span class="results-title">Search Results</span>
    </div>
    <div class="search-results-content">
      <div v-if="!results || results.size === 0" class="no-results">
        No search results
      </div>
      <div v-else class="results-list">
        <div
          v-for="(item, key) in results.keys()"
          :key="key"
          class="result-item"
        >
          <div class="result-group">
            <div class="result-title">
              {{ item }}
            </div>
            <ul v-if="item === SearchType.MESSAGE" class="result-description">
              <li
                v-for="(data, index) in results.get(item)?.resultList"
                :key="index"
                @click="handleResultClick(data)"
              >
                {{ (data as SearchCloudMessagesResultItem).conversation?.getShowName() }}
              </li>
            </ul>
            <ul v-if="item === SearchType.USER" class="result-description">
              <li
                v-for="(data, index) in results.get(item)?.resultList"
                :key="index"
                @click="handleResultClick(data)"
              >
                {{ (data as SearchCloudUsersResultItem).profile.nick
                 || (data as SearchCloudUsersResultItem).profile.userID }}
              </li>
            </ul>
            <ul v-if="item === SearchType.GROUP" class="result-description">
              <li
                v-for="(data, index) in results.get(item)?.resultList"
                :key="index"
                @click="handleResultClick(data)"
              >
                {{ (data as SearchCloudGroupsResultItem).groupInfo.name
                || (data as SearchCloudGroupsResultItem).groupInfo.groupID }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SearchType } from '@tencentcloud/chat-uikit-vue3';
import type {
  SearchCloudGroupsResultItem,
  SearchCloudMessagesResultItem,
  SearchCloudUsersResultItem,
  SearchResult,
  SearchResultItemType,
} from '@tencentcloud/chat-uikit-vue3';

interface SearchResultsProps {
  results?: Map<SearchType, SearchResult<any>>;
  loading?: boolean;
  keyword?: string;
  searchType?: SearchType;
}

const props = defineProps<SearchResultsProps>();

const emit = defineEmits<{
  'result-item-click': [data: SearchResultItemType, type: any];
}>();

const handleResultClick = (item: SearchResultItemType) => {
  emit('result-item-click', item, props.searchType || 'ALL');
};
</script>

<style scoped>
.custom-search-results {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.search-results-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.results-icon {
  font-size: 16px;
}

.results-title {
  font-weight: 500;
  color: #333;
}

.search-results-content {
  max-height: 400px;
  overflow-y: auto;
}

.no-results {
  padding: 20px;
  text-align: center;
  color: #999;
  font-size: 14px;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.result-item {
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.result-item:hover {
  background-color: #f5f5f5;
}

.result-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.result-title {
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.result-description {
  color: #666;
  font-size: 12px;
  line-height: 1.4;
}
</style>

```

``` typescript
<template>
  <Search :SearchResults="CustomSearchResults" />
</template>

<script setup lang="ts">
import { Search } from '@tencentcloud/chat-uikit-vue3';
import CustomSearchResults from './CustomSearchResults.vue';
</script>
```

【Custom SearchAdvanced】

**Props**

|Prop Name|Type|Default Value|Description|
|---------|---------|---------|---------|
|variant|VariantType|-|Display mode|
|searchType|SearchTabType|-|Current search type|
|advancedParams|Map<SearchType, SearchParamsMap[SearchType]>|-|Advanced search parameters|
|onAdvancedParamsChange|(type: SearchType, params: SearchParamsMap[SearchType]) => void|-|Parameter change callback|

**Example**
``` typescript
<template>
  <div class="custom-search-advanced">
    <div class="search-advanced-header">
      <span class="advanced-icon">⚙️</span>
      <span class="advanced-title">Advanced Search</span>
    </div>
    <div class="search-advanced-content">
      <div class="search-type-section">
        <div class="section-title">
          Search Type
        </div>
        <div class="search-type-options">
          <label
            v-for="type in searchTypes"
            :key="type.value"
            class="type-option"
          >
            <input
              type="radio"
              :value="type.value"
              :checked="searchType === type.value"
              @change="handleSearchTypeChange(type.value as SearchType)"
            >
            <span class="type-label">{{ type.label }}</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { SearchType, useSearchState } from '@tencentcloud/chat-uikit-vue3';
import type { VariantType } from '@tencentcloud/chat-uikit-vue3';

interface CustomSearchAdvancedProps {
  variant?: VariantType;
  searchType?: SearchType;
}

const props = defineProps<CustomSearchAdvancedProps>();
const { setSelectedType } = useSearchState();

const emit = defineEmits<{
  'search-type-change': [type: SearchType | 'all'];
}>();

const searchTypes = [
  { value: 'all', label: 'All' },
  { value: SearchType.MESSAGE, label: 'Messages' },
  { value: SearchType.USER, label: 'Users' },
  { value: SearchType.GROUP, label: 'Groups' },
];

const searchType = ref<SearchType | 'all'>(props.searchType || 'all');

const handleSearchTypeChange = (type: SearchType) => {
  searchType.value = type;
  setSelectedType(type);
  emit('search-type-change', type);
};
</script>

<style scoped>
.custom-search-advanced {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: #fff;
}

.search-advanced-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.advanced-icon {
  font-size: 16px;
}

.advanced-title {
  font-weight: 500;
  color: #333;
  font-size: 16px;
}

.search-advanced-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-title {
  font-weight: 500;
  color: #333;
  font-size: 14px;
  margin-bottom: 8px;
}

.search-type-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.type-option {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.type-option input[type="radio"] {
  margin: 0;
}

.type-label {
  font-size: 14px;
  color: #666;
}
</style>

```

``` typescript
<template>
  <Search :SearchAdvanced="CustomSearchAdvanced" />
</template>

<script setup lang="ts">
import { Search } from '@tencentcloud/chat-uikit-vue3';
import CustomSearchAdvanced from './CustomSearchAdvanced.vue';
</script>
```

【Custom SearchResultItem】

**Props**

|Prop Name|Type|Default Value|Description|
|---------|---------|---------|---------|
|data|SearchResultItem|-|Search result data|
|type|SearchType|-|Search result type|
|keyword|string|-|Search keyword|
|onClick|(data: SearchResultItem, type: SearchType) => void|-|Click callback|
|className|string|-|Custom CSS class name|

**Example**
``` java
<template>
  <div class="custom-search-item">
    <div
      v-if="type === SearchType.USER"
      class="user-item"
      @click="handleClick"
    >
      <div class="user-avatar">

      </div>
      <div class="user-info">
        <div class="user-name">{{ data.profile.nick }}</div>
        <div class="user-id">{{ data.profile.userID }}</div>
      </div>
    </div>

    <div
      v-else-if="type === SearchType.GROUP"
      class="group-item"
      @click="handleClick"
    >
      <div class="group-avatar">👥</div>
      <div class="group-info">
        <div class="group-name">{{ data.groupInfo.name }}</div>
        <div class="group-id">{{ data.groupInfo.groupID }}</div>
      </div>
    </div>

    <div
      v-else-if="type === SearchType.MESSAGE"
      class="message-item"
      @click="handleClick"
    >
      <div class="message-content">{{ data.conversation.getShowName() }}</div>
      <div class="message-num">{{ data.messageCount }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SearchType } from '@tencentcloud/chat-uikit-vue3';
import type { SearchResultItemType } from '@tencentcloud/chat-uikit-vue3';

interface CustomSearchItemProps {
  data: SearchResultItemType;
  type?: SearchType;
  onClick?: (data: SearchResultItemType, type: SearchType) => void;
}

const props = defineProps<CustomSearchItemProps>();

console.warn('CustomSearchItem', props);

const handleClick = () => {
  if (props.onClick && props.type) {
    props.onClick(props.data, props.type);
  }
};

const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleString();
};
</script>

<style scoped>
.custom-search-item {
  cursor: pointer;
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
}

.custom-search-item:hover {
  background-color: #f5f5f5;
}

.user-item,
.group-item,
.message-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.group-avatar {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.user-info,
.group-info {
  flex: 1;
}

.user-name,
.group-name {
  font-weight: 500;
  color: #333;
  font-size: 14px;
  margin-bottom: 4px;
}

.user-id,
.group-id {
  color: #666;
  font-size: 12px;
}

.message-content {
  flex: 1;
  color: #333;
  font-size: 14px;
  line-height: 1.4;
}

.message-num {
  color: #666;
  font-size: 12px;
  white-space: nowrap;
}
</style>
```

``` typescript
<template>
  <Search :SearchResultItem="CustomSearchItem" />
</template>

<script setup lang="ts">
import { Search } from '@tencentcloud/chat-uikit-vue3';
import CustomSearchItem from './CustomSearchItem.vue';
</script>
```

【Custom Placeholders】

**Props**

|Prop Name|Type|Default Value|Description|
|---------|---------|---------|---------|
|SearchResultsPresearch|Component|-|Pre-search placeholder component|
|SearchResultsLoading|Component|-|Loading placeholder component|
|SearchResultsEmpty|Component|-|Empty result placeholder component|

**Example**
``` typescript
<template>
  <Search
    :search-results-presearch="PresearchComponent"
    :search-results-loading="LoadingComponent"
    :search-results-empty="EmptyComponent"
  />
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue';
import { Search } from '@tencentcloud/chat-uikit-vue3';

const PresearchComponent = defineComponent({
  name: 'PresearchComponent',
  setup() {
    return () => h('div', { class: 'presearch-placeholder' }, [
      h('div', { class: 'placeholder-icon' }, '🔍'),
      h('div', { class: 'placeholder-text' }, 'Enter a keyword to start searching')
    ]);
  }
});

const LoadingComponent = defineComponent({
  name: 'LoadingComponent',
  setup() {
    return () => h('div', { class: 'loading-placeholder' }, [
      h('div', { class: 'loading-spinner' }),
      h('div', { class: 'loading-text' }, 'Searching...')
    ]);
  }
});

const EmptyComponent = defineComponent({
  name: 'EmptyComponent',
  setup() {
    return () => h('div', { class: 'empty-placeholder' }, [
      h('div', { class: 'empty-icon' }, '😔'),
      h('div', { class: 'empty-text' }, 'No results found'),
      h('div', { class: 'empty-hint' }, 'Try searching with different keywords')
    ]);
  }
});
</script>

<style scoped>
.presearch-placeholder,
.loading-placeholder,
.empty-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #999;
}

.placeholder-icon,
.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #1890ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.placeholder-text,
.loading-text,
.empty-text {
  font-size: 16px;
  margin-bottom: 8px;
}

.empty-hint {
  font-size: 14px;
  color: #bbb;
}
</style>
```
