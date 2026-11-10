const PLATFORM_TYPES = new Set([
    'api',
    'component',
    'feature',
    'plugin',
    'sdk',
    'integration',
]);
const CROSS_PLATFORM_TYPES = new Set(['server_api', 'webhook', 'product']);
const CROSS_PLATFORM_PROMPT = /计费|套餐|价格|UserSig\s*原理|签发流程|控制台|服务端\s*REST|云\s*API|Webhook|回调|callback|server\s*callback|物联网开发平台|安防摄像头|智能视觉服务|儿童手表|录音卡|多端登录|多实例|多设备登录|同平台|漫游|消息存储|峰值|DAU|群组上限|好友上限|频率限制|配额|内容审核|敏感词|审核策略|功能开关|能力开关/i;
// 判定「问题是否依赖具体端」统一由 dependsOnPlatform 承担（见下方）。
// 原 PLATFORM_PROMPT 裸关键词白名单已移除：`SDK`/`API` 等词会被 `sdkappid` 这类标识符误命中。
/**
 * push 必须问平台的强信号：仅当 prompt 明确提到具体「平台」（android/ios/flutter/...）时才拦询问。
 * 厂商（小米/OPPO/华为/FCM 等）不算平台——它们全部归属 android 厂商配置子分类（快速接入/厂商配置/Android/{vendor}.md），
 * 问厂商问题不需要再让用户选平台。
 */
const PUSH_PLATFORM_SPECIFIC_PROMPT = /\b(android|ios|flutter|harmonyos|react[\s-]?native|unity|unreal|donut|uni[\s-]?app)\b/i;
/**
 * push 综述关键词：直接对应「快速接入/接入前准备」的两个二级标题
 *   - "## 开通 Push 服务"      → 开通 / 创建应用 / SDKAppID / 控制台 / 数据中心
 *   - "## 接入流程说明"         → 接入流程 / 厂商配置 / SDK 接入 / 高级功能设置
 * 命中即跨平台综述，无需问平台。
 */
const PUSH_OVERVIEW_PROMPT = /开通|创建\s*Push|创建应用|SDKAppID|控制台|数据中心|接入流程|接入推送|厂商配置|SDK\s*接入|高级功能|离线推送(?!\s*怎么)/i;
/**
 * 服务端 / 产品级信号：这类问题与客户端平台无关，不应触发 framework 询问（trtc / chat 同样适用）。
 * - 服务端：REST API、云 API、服务端、v4/xxx/xxx 路径、tls-sig-api
 * - 产品级：计费/套餐/价格/控制台/配额/频率限制
 * 中英双语：en 侧 query 仍有约 19% 含中文，两套词必须并存。
 */
const SERVER_OR_PRODUCT_PROMPT = /REST\s*(?:ful)?\s*API|RESTful|服务端|云\s*API|v4\/\w+\/\w+|tls-sig-api|计费|套餐|价格|控制台|配额|频率限制|\bserver[\s-]?side\b|\bbilling\b|\bpricing\b|\bquota\b|\brate\s*limit\b|\bconsole\b|\bplan\b|\bpackage\s*tier\b/i;
/** TRTC 云 API 的 Action 名（区分大小写，避免误伤客户端 lowerCamel 方法如 startLocalPreview） */
const TRTC_CLOUD_API_ACTION = /\b(?:Start|Stop|Update|Control)AI\w*|\b(?:Create|Describe|Modify|Delete|Stop)Cloud\w*|\bDescribe(?:Room|User)Info\b|\b(?:Dismiss|Remove)\w*Room\b|\w*TRTCVoicePrint\w*/;
/**
 * 客户端实现信号：问题是否**依赖具体端**。
 *
 * 取代原先 `if (hasProduct(norm,'trtc')) return true` 的产品特例——
 * 判据从「产品是不是 trtc」改为「问题是不是依赖端」。
 *
 * 人工真值实测（43 条）：framework 真值为空（与平台无关）的 18 条里有 5 条被 trtc 特例误拦，
 * 而 framework 真值非空的 25 条无一被拦。说明「trtc ⇒ 必须问平台」这个前提本身不成立：
 * 服务端 API、回调时机、产品能力、AI 能力等问法与端无关，询问只是无意义打扰。
 *
 * 三类信号（命中任一才询问），每类均为中英双语：
 * 1. 显式平台词：android / ios / flutter / 小程序 ...
 * 2. 集成与工程化：集成/接入/跑通/编译/依赖/初始化 / integrate / compile / dependency ...
 * 3. 端侧实现物：UI 组件、端上 API 方法（lowerCamel）、端特有能力（美颜/悬浮窗/画中画 ...）
 */
const EXPLICIT_PLATFORM_PROMPT = /\b(android|ios|iphone|ipad|mac|windows|flutter|harmonyos|react[\s-]?native|unity|unreal|donut|uni[\s-]?app|electron|web|h5|mini[\s-]?program|desktop|mobile)\b|小程序|鸿蒙|安卓|苹果端|移动端|桌面端|浏览器/i;
const CLIENT_INTEGRATION_PROMPT = /集成|接入|跑通|编译|构建|打包|依赖|初始化|生命周期|SDK\s*版本|插件|init\b|destroy|minSdk|Podfile|gradle|npm|yarn|pub\s*get|license|demo|\bintegrat(?:e|ing|ion)\b|\binitializ(?:e|ing|ation)\b|\bcompile\b|\bbuild\s*(?:fail|error|gradle)|\bdependenc(?:y|ies)\b|\blifecycle\b|\bimport\b|\binstall\b|\bupgrade\b|\bSDK\s*version\b/i;
const CLIENT_FEATURE_PROMPT = /UI\s*组件|组件|主题定制|美颜|虚拟背景|变声|耳返|混响|悬浮窗|画中画|屏幕分享|录屏|截图|推流|拉流|本地预览|摄像头|麦克风权限|前后台|保活|\bUI\s*component\b|\bbeauty\b|\bvirtual\s*background\b|\bscreen\s*(?:share|sharing|record)|\bpicture[\s-]?in[\s-]?picture\b|\bfloating\s*window\b|\bcamera\b|\bmicrophone\s*permission\b|\bbackground\s*mode\b|\bkeep\s*alive\b|\blocal\s*preview\b/i;
/** 端侧 API 方法形态（lowerCamel，如 enterRoom / startLocalPreview）；云 API 的 PascalCase 不算。 */
const CLIENT_API_METHOD = /\b[a-z]+[A-Z][A-Za-z0-9_]*\s*\(?/;
function dependsOnPlatform(prompt) {
    return EXPLICIT_PLATFORM_PROMPT.test(prompt)
        || CLIENT_INTEGRATION_PROMPT.test(prompt)
        || CLIENT_FEATURE_PROMPT.test(prompt)
        || CLIENT_API_METHOD.test(prompt);
}
function hasProduct(norm, p) {
    return !!(norm.product?.includes(p));
}
/** 未传 framework 时，是否应先 present_framework_choice 再检索 */
export function requiresFramework(norm) {
    if (norm.frameworks?.length)
        return false;
    // 通用：显式声明的跨平台类型（server_api / webhook / product）直接跳过
    if (norm.searchIntent?.length && norm.searchIntent.every((t) => CROSS_PLATFORM_TYPES.has(t))) {
        return false;
    }
    // 服务端与产品级咨询不依赖客户端平台（含 agent 未传 product 的情况）
    if (SERVER_OR_PRODUCT_PROMPT.test(norm.prompt) || TRTC_CLOUD_API_ACTION.test(norm.prompt)) {
        return false;
    }
    // push：判定逻辑（自上而下）
    if (hasProduct(norm, 'push')) {
        if (norm.searchIntent?.length && norm.searchIntent.every((t) => CROSS_PLATFORM_TYPES.has(t))) {
            return false;
        }
        if (PUSH_PLATFORM_SPECIFIC_PROMPT.test(norm.prompt))
            return true;
        if (PUSH_OVERVIEW_PROMPT.test(norm.prompt))
            return false;
        return false;
    }
    // iot：产品级/能力线/API 问法第一阶段允许跨平台检索，不做 framework 前置拦截
    if (hasProduct(norm, 'iot'))
        return false;
    // trtc：不再因「产品是 trtc」一律询问，改为仅当问题依赖具体端时才询问（见 dependsOnPlatform）。
    if (hasProduct(norm, 'trtc'))
        return dependsOnPlatform(norm.prompt);
    if (CROSS_PLATFORM_PROMPT.test(norm.prompt))
        return false;
    if (norm.searchIntent?.length) {
        if (norm.searchIntent.some((t) => PLATFORM_TYPES.has(t)))
            return true;
        if (norm.searchIntent.every((t) => CROSS_PLATFORM_TYPES.has(t)))
            return false;
        // faq / error_code 等默认可跨平台检索
        if (norm.searchIntent.every((t) => t === 'faq' || t === 'error_code' || CROSS_PLATFORM_TYPES.has(t))) {
            return false;
        }
    }
    // 兜底：统一用「问题是否依赖具体端」判定，与 trtc 分支同源。
    // 不再用 PLATFORM_PROMPT 的裸关键词白名单——`SDK` 会被 `sdkappid` 这类标识符串误命中
    // （实测 livekit_<sdkappid>_feedback_<roomid> 问法被误拦）。
    return dependsOnPlatform(norm.prompt);
}
