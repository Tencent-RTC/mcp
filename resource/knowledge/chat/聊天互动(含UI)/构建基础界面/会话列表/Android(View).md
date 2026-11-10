---
sync_node_id: '147637814569394176'
nav_path:
  - "聊天互动（含 UI）"
  - "构建基础界面"
  - "会话列表"
  - "Android（View）"
product: "chat"
---
This article will guide you through the process of building a conversation list interface.

## Demo

The loading effect of the conversation list is shown below:

### 

## Development Environment Requirements
- Android Studio-Giraffe 

- Gradle-7.2

- Android Gradle Plugin Version-7.0.0

- kotlin-gradle-plugin-1.5.31

## Preconditions

Before building the interface, please ensure that you have completed the following 4 things:
1. Created an application in the console.

2. Created some user accounts in the console.

3. Integrated with `TUIKit` or `TUIConversation`.

4. Called the `login` API in `TUILogin` to log in to the component.

   > **Note:**
   > 
   > 1. All components use this API to log in. You can log in once every time you start the application.
   > 2. Please make sure that the login is successful, and we recommend that you do the following in the successful login callback.

   If you haven't completed the above 4 steps, please refer to the corresponding steps in [Getting Started](https://www.tencentcloud.com/document/product/1047/60520) first, otherwise you may encounter obstacles when implementing the following features.

   If you have already completed them, please continue reading below.

## Step Instructions

To build a conversation list, you just need to add the Fragment corresponding to the conversation list to your Activity. Once added, the Fragment will automatically load recent conversations. If the chat interface is also integrated, when a user clicks on a line in the conversation list, it will automatically navigate to the corresponding chat interface.

MainActivity layout file:
``` wasm
<?xml version="1.0" encoding="utf-8"?>
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <FrameLayout
        android:id="@+id/conversation_view"
        android:layout_width="match_parent"
        android:layout_height="match_parent"/>

</FrameLayout>
```

MainActivity Java file:

【Minimalist version】
``` java
public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main_activity);
        TUIConversationMinimalistFragment fragment = new TUIConversationMinimalistFragment();
        getSupportFragmentManager()
                .beginTransaction()
                .add(R.id.conversation_view, fragment)
                .commitAllowingStateLoss();
    }
}
```

【Classic version】
``` java
public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main_activity);
        TUIConversationFragment fragment = new TUIConversationFragment();
        getSupportFragmentManager()
                .beginTransaction()
                .add(R.id.conversation_view, fragment)
                .commitAllowingStateLoss();
    }
}
```

> **Note:**
> If you haven't sent messages to any person or group before, no conversation will be generated. In this case, loading the `TUIConversationMinimalistFragment` will show an empty list. For a better experience, it's recommended to send messages to some accounts first to trigger the creation of conversations. If you want to know how to send messages in the chat interface, please refer to the document: Build Chat Interface.
> 

## More practices

You can locally [run the TUIKitDemo source code](https://www.tencentcloud.com/document/product/1047/45914) to explore more interface implementations.
