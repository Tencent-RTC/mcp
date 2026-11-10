---
sync_node_id: '183333395656286208'
nav_path:
  - "聊天互动（含 UI）"
  - "单功能接入"
  - "搜索"
  - "React"
  - "Search Store"
product: "chat"
---
SearchStore offers search functionality built on Cloud Search. If the default component features do not fully address your business requirements, you can leverage SearchStore for custom search scenarios.

#### Properties

|Property Name|Type|Description|
|---------|---------|---------|
|userList|UserProfile[]|List of user search results.|
|userTotalCount|number|Total number of user search results.|
|hasMoreUsers|boolean|Indicates whether additional pages of user search results are available.|
|groupList|GroupSearchInfo[]|List of group search results.|
|groupTotalCount|number|Total number of group search results.|
|hasMoreGroups|boolean|Indicates whether additional pages of group search results are available.|
|groupMemberList|Record|Group member search results, grouped by groupID.|
|groupMemberTotalCount|number|Total number of group member search results.|
|hasMoreGroupMembers|boolean|Indicates whether additional pages of group member search results are available.|
|messageResults|MessageSearchResultItem[]|List of message search results. Each result is grouped by conversation and includes conversation ID, display information, the number of matched messages, and the message list.|
|messageResultTotalCount|number|Total number of message search results.|
|hasMoreMessageResults|boolean|Indicates whether additional pages of message search results are available.|

#### Methods

|Method Name|Type|Description|
|---------|---------|---------|
|search|(keywordList: string[], option?: SearchOption) => Promise|Performs a search. By default, users, groups, group members, and messages are queried simultaneously. Use option.searchScope to limit the search scope. Calling this method resets the current results and pagination cursor.|
|searchMore|(searchType: SearchType) => Promise|Retrieves the next page of results for the specified search type. searchType can be User, Group, GroupMember, or Message.|
|destroy|() => void|Destroys the current SearchStore instance and clears subscriptions and state. Typically managed automatically by React/Vue3 wrapper layers.|

SearchOption

|Field Name|Type|Description|
|---------|---------|---------|
|keywordListMatchMode|KeywordListMatchMode|Multi-keyword match mode: Or or And. The default is Or.|
|searchScope|SearchType[]|Defines the search scope. By default, users, groups, group members, and messages are included.|
|pageSize|number|Number of results per page. Default is 20.|
|userFilter|UserSearchFilter|User search filter conditions.|
|messageFilter|MessageSearchFilter|Message search filter conditions.|
|groupMemberFilter|GroupMemberSearchFilter|Group member search filter conditions.|

## Usage Example

The example below shows how to use SearchStore to build a simple cloud-based user search component.

【index.tsx】
``` typescript
import { useState } from 'react';
import {
  SearchType,
  SearchStore,
} from '@tencentcloud/chat-uikit-react';
import './styles.css';

function SearchStoreBasicDemo() {
  const {
    hasMoreUsers,
    search,
    searchMore,
    userList,
    userTotalCount,
  } = SearchStore.create();

  const [keyword, setKeyword] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    const nextKeyword = keyword.trim();
    if (!nextKeyword) {
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    try {
      await search([nextKeyword], {
        pageSize: 20,
        searchScope: [SearchType.User],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = async () => {
    setIsLoading(true);
    try {
      await searchMore(SearchType.User);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="search-store-basic-demo">
      <div className="search-store-basic-demo__header">
        <h2>Search Store Basic</h2>
        <p>Very simple user search powered by SearchStore.</p>
      </div>

      <div className="search-store-basic-demo__toolbar">
        <input
          onChange={event => setKeyword(event.target.value)}
          onKeyDown={event => {
            if (event.key === 'Enter') {
              handleSearch();
            }
          }}
          placeholder="Enter user keyword"
          value={keyword}
        />
        <button disabled={isLoading || !keyword.trim()} onClick={handleSearch} type="button">
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>

      <div className="search-store-basic-demo__panel">
        <h3>Users ({userTotalCount})</h3>
        {userList.length > 0 ? (
          <ul className="search-store-basic-demo__list">
            {userList.map(user => (
              <li className="search-store-basic-demo__item" key={user.userID}>
                <span className="search-store-basic-demo__avatar">
                  {(user.nickname || user.userID).slice(0, 1).toUpperCase()}
                </span>
                <span>
                  <strong>{user.nickname || user.userID}</strong>
                  <small>{user.userID}</small>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="search-store-basic-demo__empty">
            {hasSearched ? 'No users found.' : 'Enter a keyword and search.'}
          </div>
        )}
      </div>

      {hasMoreUsers && (
        <button
          className="search-store-basic-demo__more"
          disabled={isLoading}
          onClick={handleLoadMore}
          type="button"
        >
          Load More
        </button>
      )}
    </div>
  );
}
```

【styles.css】
``` css
.search-store-basic-demo {
  display: flex;
  height: 100%;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  overflow: hidden;
}

.search-store-basic-demo__header h2 {
  margin: 0 0 8px;
  color: #111827;
  font-size: 22px;
}

.search-store-basic-demo__header p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.search-store-basic-demo__toolbar {
  display: flex;
  gap: 8px;
}

.search-store-basic-demo__toolbar input {
  width: 260px;
  padding: 8px 10px;
  border: 1px solid #d7dce5;
  border-radius: 8px;
}

.search-store-basic-demo__toolbar button,
.search-store-basic-demo__more {
  padding: 8px 12px;
  border: 1px solid #667eea;
  border-radius: 8px;
  background: #667eea;
  color: #fff;
  cursor: pointer;
}

.search-store-basic-demo__toolbar button:disabled,
.search-store-basic-demo__more:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.search-store-basic-demo__panel {
  display: flex;
  width: min(560px, 100%);
  min-height: 0;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #edf0f5;
  border-radius: 12px;
  background: #fff;
}

.search-store-basic-demo__panel h3 {
  margin: 0;
  padding: 14px 16px;
  border-bottom: 1px solid #edf0f5;
  color: #111827;
  font-size: 15px;
}

.search-store-basic-demo__list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 12px;
  overflow: auto;
  list-style: none;
}

.search-store-basic-demo__item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 10px;
  background: #f9fafb;
}

.search-store-basic-demo__avatar {
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

.search-store-basic-demo__item strong,
.search-store-basic-demo__item small {
  display: block;
}

.search-store-basic-demo__item strong {
  color: #111827;
  font-size: 14px;
}

.search-store-basic-demo__item small {
  margin-top: 2px;
  color: #6b7280;
  font-size: 12px;
}

.search-store-basic-demo__empty {
  padding: 24px;
  color: #6b7280;
  text-align: center;
}

.search-store-basic-demo__more {
  width: fit-content;
}

```
