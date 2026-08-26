## Component Overview

ContactList is a Jetpack Compose-based contact list component that provides users with robust contact management features. It supports displaying friends, handling friend requests, managing group lists, managing blacklists, and offers a comprehensive set of interactive webhook interfaces.

## Component Integration

The `ContactList` component is included in TUIKit Compose. To use `ContactList`, integrate TUIKit Compose into your project. For detailed integration steps, see the [TUIKit Compose documentation](https://www.tencentcloud.com/document/product/1047/77459).

## Component Structure

`ContactList` is the primary component for displaying the contact list page:
| <strong>Method</strong> | <strong>Parameter</strong> | <strong>Description</strong> |
| --- | --- | --- |
| <code>ContactList</code> | <code>modifier: Modifier</code> | Jetpack Compose modifier for configuring the component’s style, layout, behavior, and appearance. |
| <code>onGroupClick: (ContactInfo) -> Unit</code> | Webhook triggered when a group is clicked; this parameter is optional. |  |
| <code>onContactClick: (ContactInfo) -> Unit</code> | Webhook triggered when a contact is clicked; this parameter is optional. |  |
| <code>contactListViewModelFactory: ContactListViewModelFactory</code> | Factory for creating the internal ContactListViewModel. Typically, you do not need to provide this manually, as a default implementation is included. |  |

## Basic Usage
- When you tap the entry points for friend requests, group chat requests, group chat list, or blacklist in `ContactList`, the component automatically handles navigation—no extra configuration is required.

- When you tap a group in the group chat list or a contact in the contact list or blacklist, the corresponding webhook (`onGroupClick` or `onContactClick`) is triggered. You must handle these webhooks to implement custom navigation. See the routing example below:

   ``` swift
   Box(
       modifier = Modifier
           .fillMaxSize()
           .systemBarsPadding()
   ) {
       ContactList(onGroupClick = {
           // Handle group click event
       }, onContactClick = {
           // Handle contact click event
       })
   }
   ```
