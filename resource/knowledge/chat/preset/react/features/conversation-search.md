`ConversationSearch` uses the Search component, supporting search functionality for users, groups, and messages. It integrates features such as the search bar, advanced search, and search result display.

## Basic Usage
``` typescript
import {
   UIKitProvider,
   ConversationList,
   ConversationSearch,
} from '@tencentcloud/chat-uikit-react';

import type {
   ConversationSearchProps,
   SearchResultItem,
   SearchType,
} from '@tencentcloud/chat-uikit-react';

const CustomConversationSearch = (props: ConversationSearchProps) => {
  const onSelectResult = (data: SearchResultItem, type: SearchType) => {
    console.warn(`Select Search Result: ${JSON.stringify(data)}, type: ${type}`);
  };
  return (
    <ConversationSearch {...props} onResultItemClick={onSelectResult} />
  );
};

const App = () => {
  return (
    <UIKitProvider>
      <ConversationList
        style={{ maxWidth: '300px', height: '600px' }}
        ConversationSearch={CustomConversationSearch}
       />
     </UIKitProvider>
  );
};
```

## Props

|**Parameter Name**|**Type**|**Default Value**|**Description**|
|---------|---------|---------|---------|
|visible|boolean|true|Whether it is visible.|
|Search|ComponentType<SearchProps>|-|custom search component|
|variant|VariantType|VariantType.MINI|Search mode: mini, standard, embedded|
|SearchBar|React.ComponentType<SearchBarProps>|DefaultSearchBar|custom search bar component|
|SearchResults|React.ComponentType<SearchResultsProps>|DefaultSearchResults|custom search result component|
|SearchAdvanced|React.ComponentType<SearchAdvancedProps>|DefaultSearchAdvanced|custom advanced search component|
|SearchResultsPresearch|React.ComponentType|-|search placeholder component|
|SearchResultsLoading|React.ComponentType|-|loading placeholder component|
|SearchResultsEmpty|React.ComponentType|-|empty result placeholder component|
|SearchResultItem|React.ComponentType<ResultItemProps>|-|custom search result item component|
|debounceTime|number|300|search debounce time (ms)|
|autoFocus|boolean|false|Whether to auto-focus the search box|
|className|string|-|custom style class name|
|style|React.CSSProperties|-|custom style|
|onKeywordChange|(keyword: string) => void|-|searchsearch keywords change callback']|
|onSearchComplete|(results: Map<SearchType, SearchResult>) => void|-|search completed callback|
|onResultItemClick|(data: SearchResultItem, type: SearchType) => void|-|search result click callback|
|onError|(error: Error) => void|-|error callback|

###
