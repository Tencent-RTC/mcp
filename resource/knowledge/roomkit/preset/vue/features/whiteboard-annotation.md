TUIRoomKit has built-in whiteboard and screen sharing annotation. After completing the TUIRoomKit integration, users can use the following in a meeting without writing any extra code:
- **Whiteboard**: Opens a blank canvas for writing, explaining, and brainstorming.

- **Screen sharing annotation**: Circle key points, add arrows, or mark issues on the screen being shared.

## Online experience

Visit [TUIRoomKit online experience](https://rtcube.cloud.tencent.com/component/experience-center/index.html#/detail) and enter a meeting scenario to experience the whiteboard and screen sharing annotation.

## Getting started

First, refer to [Quick Integration](https://cloud.tencent.com/document/product/647/81962) to integrate `@tencentcloud/roomkit-web-vue3`, and upgrade to version `6.1.0` or later.

### Using the whiteboard
1. Enter a **multi-person meeting**.

2. Click **Screen Share** in the bottom toolbar.

3. Select **Whiteboard** from the expanded menu.

4. The whiteboard is immediately shared with other members in the room. The initiator can use tools such as the pen, laser pointer, shapes, arrows, eraser, undo, redo, clear, and save snapshot.

   Whiteboard in a meeting

### Using screen sharing annotation
1. Start screen sharing.

2. Click the **Annotate** button on the shared screen.

3. Use the pen, shapes, or arrows to mark key points on the shared content.

4. After ending screen sharing, the annotation is automatically closed.

   Annotating on the screen sharing view

## Permission control

The whiteboard uses the same permissions as screen sharing:
- **The room owner and administrators** can prohibit or allow ordinary members from sharing their screen through meeting controls.

- **Ordinary members** who are prohibited from sharing their screen cannot start screen sharing, nor can they start the whiteboard.

- **Screen sharing annotation** is available only to the current screen sharer. Other members can view the shared view and the annotation content, but cannot draw on that view.

   If a member cannot see the whiteboard entry, first confirm whether their screen sharing permission has been disabled.

## Disabling the whiteboard and annotation

If your application does not need the whiteboard and annotation, you can hide the feature entries:
``` typescript
import {
  BuiltinWidget,
  conference,
} from '@tencentcloud/roomkit-web-vue3';

conference.setWidgetVisible({
  [BuiltinWidget.WhiteboardWidget]: false,
  [BuiltinWidget.AnnotationWidget]: false,
});
```

## Scope of use
- Supports the latest stable versions of Chrome and Edge on Windows and macOS desktops.

- Does not yet support mobile browsers and webinar (Webinar) rooms.

- Currently, the initiator draws while other members watch in real time; simultaneous drawing by multiple people is not yet supported.

- The whiteboard and regular screen sharing cannot be enabled at the same time. When you need annotation, start screen sharing first, and then start annotation on the shared view.

## FAQs

### Why is there no whiteboard entry in the meeting?

Please confirm:
1. `@tencentcloud/roomkit-web-vue3` has been upgraded to version **6.1.0** or later.

2. The current room is a multi-person meeting, not a webinar (Webinar) room.

3. The current user has screen sharing permission.

4. You are using desktop Chrome or Edge that supports screen sharing.

### Do I need to close it manually before exiting the meeting?

No. When you exit the room, the component automatically stops the whiteboard and releases related resources; screen sharing annotation is also automatically stopped when the sharing ends.
