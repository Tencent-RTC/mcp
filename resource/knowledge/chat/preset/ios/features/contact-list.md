## Component Overview

ContactList is a SwiftUI component that provides a complete contact management interface. It supports displaying contacts, handling friend requests, managing group lists, blacklist management, and offers a variety of interactive webhook interfaces.

## Component Integration

The `ContactList` component is included in TUIKit SwiftUI. To use `ContactList`, integrate TUIKit SwiftUI into your project. For detailed integration steps, refer to the [TUIKit SwiftUI](https://www.tencentcloud.com/document/product/1047/77460) documentation.

## Component Structure

`ContactList` is the primary component for displaying and managing contacts. It represents the full contact list page and provides a public initializer:
| <strong>Method</strong> | <strong>Parameter</strong> | <strong>Description</strong> |
| --- | --- | --- |
| <code>init</code> | <code>contactStore: ContactListStore</code> | Contact data store. Use <code>ContactListStore.create()</code> to create a default instance. |
| <code>onContactClick: ((AZOrderedListItem) -> Void)?</code> | Webhook triggered when a contact is clicked. Optional. |  |
| <code>onGroupClick: ((AZOrderedListItem) -> Void)?</code> | Webhook triggered when a group is clicked. Optional. |  |

`ContactList` includes built-in navigation for subpages. When you tap entries such as friend requests, group requests, group list, or blacklist, the corresponding subpage opens automatically as a full-screen modal (fullScreenCover). No manual navigation handling is required.

If you want to use subpages independently (such as the friend request list or group list), each subpage provides its own initializer, as described below:
| <strong>Subpage</strong> | <strong>Method Name</strong> | <strong>Parameter</strong> | <strong>Description</strong> |
| --- | --- | --- | --- |
| Friend Request Page (FriendApplicationListView) | init | <code>contactStore: ContactListStore</code> | Contact data store, passed from ContactList |
| init | <code>onDismiss: (() -> Void)?</code> | Webhook triggered when the page is closed. Optional. |  |
| Group Request Page (GroupApplicationListView) | init | <code>contactStore: ContactListStore</code> | Contact data store, passed from ContactList |
| init | <code>onDismiss: (() -> Void)?</code> | Webhook triggered when the page is closed. Optional. |  |
| Group List Page (GroupListView) | init | <code>contactStore: ContactListStore</code> | Contact data store, passed from ContactList |
| init | <code>onGroupClick: ((AZOrderedListItem) -> Void)?</code> | Webhook triggered when a group is clicked in the group list. Optional. |  |
| init | <code>onDismiss: (() -> Void)?</code> | Webhook triggered when the page is closed. Optional. |  |
| Blacklist Page (BlackListView) | init | <code>contactStore: ContactListStore</code> | Contact data store, passed from ContactList |
| init | <code>onDismiss: (() -> Void)?</code> | Webhook triggered when the page is closed. Optional. |  |

## Basic Usage

### Quick Integration

ContactList includes built-in navigation for all subpages. Simply initialize the component to enable full contact management features:
``` swift
import AtomicX
import SwiftUI

struct ContactsPage: View {
    private let contactStore = ContactListStore.create()

    var body: some View {
        ContactList(
            contactStore: contactStore,
            onContactClick: { contact in
                // Handle contact click
                print("Contact clicked: \(contact.title)")
            },
            onGroupClick: { group in
                // Handle group click (triggered when a group is clicked from the group list page)
                print("Group clicked: \(group.title)")
            }
        )
    }
}
```

When you tap entries such as friend requests, group requests, group list, or blacklist, the component automatically opens the corresponding subpage as a full-screen modal. No additional navigation logic is required. See the navigation demo below:

### Key Considerations

#### Built-in Navigation

ContactList automatically manages navigation for its subpages and presents them using fullScreenCover:
- Friend Request Page (FriendApplicationListView)

- Group Request Page (GroupApplicationListView)

- Group List Page (GroupListView)

- Blacklist Page (BlackListView)

   You do not need to manage navigation state or configure NavigationLink manually.

#### Webhook Handling

ContactList provides two optional webhook callbacks:
``` swift
ContactList(
    contactStore: contactStore,
    onContactClick: { contact in
        // Triggered when a contact in the contact list is clicked
    },
    onGroupClick: { group in
        // Triggered when a group in the group list is clicked
    }
)
```

#### Data Sharing

Create a data store instance using `ContactListStore.create()`. The component automatically shares this instance with all subpages to maintain data consistency:
``` swift
private let contactStore = ContactListStore.create()
```

#### Using Subpages Independently

To use subpages independently in other parts of your app, initialize the corresponding view directly:
``` swift
// Use the group list page independently
GroupListView(
    contactStore: contactStore,
    onGroupClick: { group in
        print("Group clicked: \(group.title)")
    },
    onDismiss: {
        // Close the page
    }
)
```
