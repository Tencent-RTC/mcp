---
sync_node_id: '108053208181022720'
nav_path:
  - "聊天互动（含 UI）"
  - "添加自定义消息"
  - "iOS（UIKit）"
product: "chat"
---
TUIKit implements the sending and display for basic message types such as text, image, audio, video, and file messages by default. If these message types do not meet your requirements, you can add custom message types.

## Basic Message Types
| Message Type | Renderings |
| --- | --- |
| Text message |  |
| Image message |  |
| Audio message |  |
| Video message |  |
| File message |  |

## Custom Message

If the basic message types do not meet your requirements, you can customize messages as needed. The following uses sending a custom hypertext message that can redirect to the browser as an example to help you quickly understand the implementation process.
The built-in custom message style of TUIKit is shown in the figure below:

> **Note:**
> In TUIKit 7.4.4643, a new custom message registration mechanism was designed, which introduces many changes compared with the original scheme and supports different UI styles. We **strongly recommend** you to upgrade to version 7.4.4643. The following will use version 7.4.4643 as an example to explain.
> 

## Displaying a Custom Message

You can receive a custom message via the `onRecvNewMessage` function in `TUIMessageBaseDataProvider`,

and the received custom message will be displayed in `Cell` mode in the message list. The data required for `Cell` drawing is called `CellData`.

The following introduces how to display a custom message.

### Creating custom CellData
1. Create class `TUILinkCellData` in the `TUIChat/UI_Classic/Cell/CellData/Custom` folder, derived from `TUIMessageCellData`, for storing the text to display and the link to redirect. Sample code:

   

【Swift】
``` swift
public class TUILinkCellData: TUIBubbleMessageCellData {
    var text: String = ""
    var link: String = ""

    // ...
}
```

【Objective-C】
``` objectivec
@interface TUILinkCellData : TUIMessageCellData    

@property NSString *text;
@property NSString *link;    

@end
```

2. Rewrite the `getCellData:` method of the parent class to convert `V2TIMMessage` to the drawing data `TUILinkCellData` of the message list `Cell`. Sample code:

   

【Swift】
``` swift
public class TUILinkCellData: TUIBubbleMessageCellData {
    override public class func getCellData(message: V2TIMMessage) -> TUIMessageCellData {
      guard let data = message.customElem?.data,
      let param = try? JSONSerialization.jsonObject(with: data, options: .allowFragments) as? [String: Any]
      else {
        return TUILinkCellData(direction: .incoming)
      }
  
      let cellData = TUILinkCellData(direction: message.isSelf ? .outgoing : .incoming)
      cellData.msgID = message.msgID
      cellData.text = param["text"] as? String ?? ""
      cellData.link = param["link"] as? String ?? ""
      cellData.avatarUrl = URL(string: message.faceURL ?? "")
      return cellData
   }
}
```

【Objective-C】
``` objectivec
@implementation TUILinkCellData    
+ (TUIMessageCellData *)getCellData:(V2TIMMessage *)message {
        NSDictionary *param = [NSJSONSerialization JSONObjectWithData:message.customElem.data options:NSJSONReadingAllowFragments error:nil];
        TUILinkCellData *cellData = [[TUILinkCellData alloc] initWithDirection:message.isSelf ? MsgDirectionOutgoing : MsgDirectionIncoming];        
        cellData.innerMessage = message;        
        cellData.msgID = message.msgID;        
        cellData.text = param[@"text"];        
        cellData.link = param[@"link"];        
        cellData.avatarUrl = [NSURL URLWithString:message.faceURL];        
        return cellData;    
 }    
 @end     
```

3. Rewrite the `getDisplayString:` method of the parent class to convert `V2TIMMessage` to the `lastMsg` display text information of the conversation list.

   

   Sample code:

   

【Swift】
``` swift
public class TUILinkCellData: TUIBubbleMessageCellData {
    override public class func getDisplayString(message: V2TIMMessage) -> String {
        guard let data = message.customElem?.data,
                let param = try? JSONSerialization.jsonObject(with: data, options: .allowFragments) as? [String: Any]
        else {
            return ""
        }
        return param["text"] as? String ?? ""
    }
}
```

【Objective-C】
``` objectivec
@implementation TUILinkCellData

+ (NSString *)getDisplayString:(V2TIMMessage *)message {
    NSDictionary *param = [NSJSONSerialization JSONObjectWithData:message.customElem.data options:NSJSONReadingAllowFragments error:nil];
    return param[@"text"];
}

@end
```

### Creating custom Cell
1. Create class `TUILinkCell_Minimalist` in the `TUIChat/UI_Minimalist/Cell/Custom` folder, derived from `TUIBubbleMessageCell_Minimalist`, for drawing `TUILinkCellData` data. Sample code:

   

【Swift】
``` swift
class TUILinkCell_Minimalist: TUIBubbleMessageCell_Minimalist {
    var myTextLabel: UILabel!
    var myLinkLabel: UILabel!
    var customData: TUILinkCellData?
    override func fill(with data: TUICommonCellData) {
        super.fill(with: data)
        if let data = data as? TUILinkCellData {
            customData = data
            myTextLabel.text = data.text

            setNeedsUpdateConstraints()
            updateConstraintsIfNeeded()
            layoutIfNeeded()
        }
    }
}
```

【Objective-C】
``` objectivec
@interface TUILinkCell_Minimalist : TUIBubbleMessageCell_Minimalist
@property UILabel *myTextLabel;  // Display text
@property UILabel *myLinkLabel;  // Link redirection text
- (void)fillWithData:(TUILinkCellData *)data; // Draw UI
@end
```

2. Override the `initWithStyle:reuseIdentifier:` method of the parent class to create `myTextLabel` and `myLinkLabel` text display objects and add them to the `container` container. Sample code:

   

【Swift】
``` swift
class TUILinkCell_Minimalist: TUIBubbleMessageCell {
     override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        setupViews()
    }

     private func setupViews() {
        myTextLabel = UILabel()
        myTextLabel.numberOfLines = 0
        myTextLabel.font = UIFont.systemFont(ofSize: 15)
        myTextLabel.textAlignment = TUISwift.isRTL() ? .right : .left
        myTextLabel.textColor = TUISwift.tuiChatDynamicColor("chat_link_message_title_color", defaultColor: "#000000")
        container.addSubview(myTextLabel)

        myLinkLabel = UILabel()
        myLinkLabel.text = TUISwift.timCommonLocalizableString("TUIKitMoreLinkDetails")
        myLinkLabel.font = UIFont.systemFont(ofSize: 15)
        myLinkLabel.textAlignment = TUISwift.isRTL() ? .right : .left
        myLinkLabel.textColor = TUISwift.tuiChatDynamicColor("chat_link_message_subtitle_color", defaultColor: "#0000FF")
        container.addSubview(myLinkLabel)
    }
}
```

【Objective-C】
``` objectivec
@implementation TUILinkCell_Minimalist
- (instancetype)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier
{
    self = [super initWithStyle:style reuseIdentifier:reuseIdentifier];
    if (self) {
        self.myTextLabel = [[UILabel alloc] init];
        [self.container addSubview:self.myTextLabel];
        self.myLinkLabel = [[UILabel alloc] init];
        self.myLinkLabel.text = @"View details >>";
        [self.container addSubview:_myLinkLabel];
    }
    return self;
}
@end
```

3. Override the `fillWithData:` method of the parent class to custom display `TUILinkCellData` data in `TUILinkCell`. Sample code:

   

【Swift】
``` swift
class TUILinkCell_Minimalist: TUIBubbleMessageCell_Minimalist {
    override func fill(with data: TUICommonCellData) {
        super.fill(with: data)
        if let data = data as? TUILinkCellData {
            customData = data
            myTextLabel.text = data.text

            setNeedsUpdateConstraints()
            updateConstraintsIfNeeded()
            layoutIfNeeded()
        }
    }
}
```

【Objective-C】
``` objectivec
@implementation TUILinkCell_Minimalist
// Draw the cell based on cellData
- (void)fillWithData:(TUILinkCellData *)data;
{
    [super fillWithData:data];
    self.myTextLabel.text = data.text;
}
@end
```

4. Override the `layoutSubviews` method of the parent class to custom layout the controls. Sample code:

   

【Swift】
``` swift
override func layoutSubviews() {
    super.layoutSubviews()
    // Custimization
}
```

【Objective-C】
``` objectivec
// Set the control coordinates
- (void)layoutSubviews
{
    [super layoutSubviews];
    self.myTextLabel.mm_top(10).mm_left(10).mm_flexToRight(10).mm_flexToBottom(50);
    self.myLinkLabel.mm_sizeToFit().mm_left(10).mm_bottom(10);
}
@end
```

5. Override the getContentSize: method of the parent class to calculate the size of the drawing zone occupied by the cellData content. Sample code:

   

【Swift】
``` swift
override class func getContentSize(_ data: TUIMessageCellData) -> CGSize {
    guard let linkCellData = data as? TUILinkCellData else {
        assertionFailure("data must be kind of TUILinkCellData")
        return .zero
    }

    let textMaxWidth = 245
    let font = UIFont.systemFont(ofSize: 15)
    let attributes: [NSAttributedString.Key: Any] = [NSAttributedString.Key.font: font]
    var size = CGSize(width: textMaxWidth, height: Int.max)

    let rect = linkCellData.text.boundingRect(with: size,
                                                options: [.usesLineFragmentOrigin, .usesFontLeading],
                                                attributes: attributes,
                                                context: nil)
    size = CGSize(width: textMaxWidth + 15, height: Int(rect.size.height) + 56)
    return size
}
```

【Objective-C】
``` objectivec
+ (CGSize)getContentSize:(TUIMessageCellData *)data {
 NSAssert([data isKindOfClass:TUILinkCellData.class], @"data must be kind of TUILinkCellData");
 TUILinkCellData *linkCellData = (TUILinkCellData *)data;
 
 CGFloat textMaxWidth = 245.f;
 CGRect rect = [linkCellData.text boundingRectWithSize:CGSizeMake(textMaxWidth, MAXFLOAT)
                                               options:NSStringDrawingUsesLineFragmentOrigin | NSStringDrawingUsesFontLeading
                                            attributes:@{NSFontAttributeName : [UIFont systemFontOfSize:15]}
                                               context:nil];
 CGSize size = CGSizeMake(textMaxWidth + 15, rect.size.height + 56);
 return size;
}
```

### Register Registering your custom Cell and CellData into TUIChat

> **Note:**
> - Each custom message must have a unique businessID. The businessID is case-sensitive and should not be duplicated with the businessID of other custom messages. TUIChat needs to find the corresponding custom message according to this businessID.
> - The businessID of the newly added custom message also cannot be duplicated with the businessID of the built-in custom messages within TUIKit.

**Method 1**: When you use DevelopPods for source code integration and want to modify requirements directly within a component, you can make the modifications directly inside the TUIChat component by following the steps below.

Register your own custom Definition Cell in the registerExternalCustomMessageInfo within TUIMessageCellConfig_Minimalist.m

【Swift】
``` swift
public class TUIMessageCellConfig_Minimalist: NSObject {
    // ...
    
    static func registerExternalCustomMessageInfo() {
        /*
         Insert your own custom message UI here, your businessID can not be same with built-in
         Example:
         registerCustomMessageCell(#your message cell#, messageCellData: #your message cell data#, forBusinessID: #your id#)
         */
    }
}
```

【Objective-C】
``` objectivec
@implementation TUIMessageCellConfig_Minimalist (CustomMessageRegister)
+ (void)registerExternalCustomMessageInfo {
    // Insert your own custom message UI here, your businessID can not be same with built-in    //
    // Example:
    [self registerCustomMessageCell:@"TUILinkCell_Minimalist" messageCellData:@"TUILinkCellData" forBusinessID:BussinessID_TextLink];
}

```

**Method 2**: Integrate TUIChat via Pod.

At App initialization, you can also proactively register `cell` and `cellData` information in the `registerCustomMessage` function of `TUIChatConfig`.

Below is the sample code:

【Swift】
``` swift
// The custom message's businessID (note that there should not be a duplication)
TUIChatConfig_Minimalist.shared.registerCustomMessage(businessID: "text_link", messageCellClassName: "TUIChat.TUILinkCell", messageCellDataClassName: "TUIChat.TUILinkCellData")

```

【Objective-C】
``` objectivec
// The custom message's businessID (note that there should not be a duplication)
#define BussinessID_TextLink @"text_link"

/** Register custom message's to TUIChat. The three parameters are 
* @param businessID Custom message's businessID
* @param messagellClass Custom message's NSString type
* @param messageCellDataClassName Custom message's NSString type
* @param styleType UI style corresponding to this custom message, for example TUIChatRegisterCustomMessageStyleTypeMinimalist
*/
- (void)registerCustomMessageCell {
 
    [TUIChatConfig.defaultConfig registerCustomMessage:BussinessID_TextLink
                                  messageCellClassName:@"TUILinkCell_Minimalist"
                              messageCellDataClassName:@"TUILinkCellData" 
                                             styleType:TUIChatRegisterCustomMessageStyleTypeMinimalist
     ];
}
```

## Sending Custom Messages

You can customize the text and image information you want to display by setting `TUICustomActionSheetItem` `title` `leftMark` attributes. If you need to adjust the order of the buttons, you can set the `priority` attribute, where a higher `priority` value means the button appears further to the front. You can also set `actionHandler` to respond to button clicks and implement your own business logic.

Sample code:

【Swift】
``` swift
class TUIChatDataProvider: TUIChatBaseDataProvider {
    // ...

    private func createCustomInputMoreActionItemList(model: TUIChatConversationModel) -> [TUICustomActionSheetItem] {
        if self.customInputMoreActionItemList.isEmpty {
            var arrayM: [TUICustomActionSheetItem] = []

            let showCustom = TUIChatConfig.shared.enableWelcomeCustomMessage && model.enableWelcomeCustomMessage
            if showCustom {
                let link = TUICustomActionSheetItem(title: TUISwift.timCommonLocalizableString("TUIKitMoreLink"), leftMark: UIImage.safeImage(TUISwift.tuiChatImagePath_Minimalist("icon_more_custom"))) { [weak self] _ in
                    guard let self else { return }
                    let text = TUISwift.timCommonLocalizableString("TUIKitWelcome")
                    var homePageLink = TUITencentCloudHomePageEN
                    let language = TUIGlobalization.getPreferredLanguage() ?? ""
                    if language.contains("zh-") {
                        homePageLink = TUITencentCloudHomePageCN
                    }
                    do {
                        let param: [String: Any] = ["businessID": "text_link", "text": text, "link": homePageLink]
                        let data = try JSONSerialization.data(withJSONObject: param, options: [])
                        let message = TUIMessageDataProvider.getCustomMessageWithJsonData(data, desc: text, extensionInfo: text)
                        self.delegate?.dataProvider(self, sendMessage: message)
                    } catch {
                        print("[\(self)] Post Json Error")
                    }
                }
                link.priority = 100
                arrayM.append(link)
            }

            if let items = model.customizedNewItemsInMoreMenu as? [TUICustomActionSheetItem], items.count > 0 {
                arrayM.append(contentsOf: items)
            }
            self.customInputMoreActionItemList = arrayM
        }
        return self.customInputMoreActionItemList
    }

    // For Minimalist Edition.
    func getInputMoreActionItemList(userID: String, groupID: String, conversationModel: TUIChatConversationModel, pushVC: UINavigationController?, actionController: TIMInputViewMoreActionProtocol) -> [TUICustomActionSheetItem] {
        var result: [TUICustomActionSheetItem] = []
        result.append(contentsOf: self.createBuiltInInputMoreActionItemList(model: conversationModel))
        result.append(contentsOf: self.createCustomInputMoreActionItemList(model: conversationModel))

        // ...
    }
}
```

【Objective-C】
``` objectivec
@implementation TUIChatDataProvider
- (NSArray<TUICustomActionSheetItem *> *)customInputMoreActionItemList {
    if (_customInputMoreActionItemList == nil) {
        NSMutableArray *arrayM = [NSMutableArray array];
        if (TUIChatConfig.defaultConfig.enableWelcomeCustomMessage) {
            __weak typeof(self) weakSelf = self;
            TUICustomActionSheetItem *link =
                [[TUICustomActionSheetItem alloc] initWithTitle:TIMCommonLocalizableString(TUIKitMoreLink)
                       leftMark:[UIImage imageNamed:TUIChatImagePath_Minimalist(@"icon_more_custom")]
                withActionHandler:^(UIAlertAction *_Nonnull action) {
                    link.priority = 100;
                    NSString *text = TIMCommonLocalizableString(TUIKitWelcome);
                    NSString *link = TUITencentCloudHomePageEN;
                    NSString *language = [TUIGlobalization tk_localizableLanguageKey];
                    if ([language containsString:@"zh-"]) {
                        link = TUITencentCloudHomePageCN;
                    }
                    NSError *error = nil;
                    NSDictionary *param = @{BussinessID : BussinessID_TextLink, @"text" : text, @"link" : link};
                    NSData *data = [NSJSONSerialization dataWithJSONObject:param options:0 error:&error];
                    if (error) {
                        NSLog(@"[%@] Post Json Error", [self class]);
                        return;
                    }
                       V2TIMMessage *message = [TUIMessageDataProvider getCustomMessageWithJsonData:data desc:text extension:text];
                    if ([weakSelf.delegate respondsToSelector:@selector(dataProvider:sendMessage:)]) {
                        [weakSelf.delegate dataProvider:weakSelf sendMessage:message];
                    }
                }];
                    [arrayM addObject:link];
                }
                _customInputMoreActionItemList = [NSArray arrayWithArray:arrayM];
    }
    return _customInputMoreActionItemList;
}
@end
```
