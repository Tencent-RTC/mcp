import { isProductScopePrompt } from './product-scope-intent.js';
const PLATFORM_TYPES = new Set([
    'api',
    'component',
    'feature',
    'plugin',
    'sdk',
    'integration',
]);
const CROSS_PLATFORM_TYPES = new Set(['server_api', 'webhook', 'product']);
const CROSS_PLATFORM_PROMPT = /计费|套餐|价格|UserSig\s*原理|签发流程|控制台|服务端\s*REST|云\s*API|Webhook|回调/i;
const PLATFORM_PROMPT = /API|组件|怎么用|怎么开|怎么设置|怎么配置|虚拟背景|屏幕分享|enterRoom|SDK|插件|集成步骤|客户端|Feature|主题定制|连麦|上麦/i;
/**
 * push 必须问平台的强信号：仅当 prompt 明确提到具体「平台」（android/ios/flutter/...）时才拦询问。
 * 厂商（小米/OPPO/华为/FCM 等）不算平台——它们全部归属 android 厂商配置子分类（knowledge/push/config/android/{vendor}.md），
 * 问厂商问题不需要再让用户选平台。
 */
const PUSH_PLATFORM_SPECIFIC_PROMPT = /\b(android|ios|flutter|harmonyos|react[\s-]?native|unity|unreal|donut|uni[\s-]?app)\b/i;
/**
 * push 综述关键词：直接对应 knowledge/push/overview/prepare.md 的两个二级标题
 *   - "## 开通 Push 服务"      → 开通 / 创建应用 / SDKAppID / 控制台 / 数据中心
 *   - "## 接入流程说明"         → 接入流程 / 厂商配置 / SDK 接入 / 高级功能设置
 * 命中即跨平台综述，无需问平台。
 */
const PUSH_OVERVIEW_PROMPT = /开通|创建\s*Push|创建应用|SDKAppID|控制台|数据中心|接入流程|接入推送|厂商配置|SDK\s*接入|高级功能|离线推送(?!\s*怎么)/i;
function hasProduct(norm, p) {
    return !!(norm.product?.includes(p));
}
/** chat/urls/product.md：产品/账号级配置，非客户端 SDK feature */
function isChatProductScopeQuery(norm) {
    if (!hasProduct(norm, 'chat'))
        return false;
    return isProductScopePrompt(norm.prompt);
}
/** chat error-code URL 同时列了「服务端 / Web / Native」三类入口，必须先问平台才能定位 */
function isChatErrorCodeAmbiguous(norm) {
    if (!hasProduct(norm, 'chat'))
        return false;
    if (norm.framework)
        return false;
    if (norm.searchIntent?.includes('error_code'))
        return true;
    return /错误码|error\s*code|ERR_/i.test(norm.prompt);
}
/** 未传 framework 时，是否应先 present_framework_choice 再检索 */
export function requiresFramework(norm) {
    if (norm.frameworks?.length)
        return false;
    // 硬规则：chat 错误码场景必须问平台（服务端 / Web / Native 三个 URL）
    if (isChatErrorCodeAmbiguous(norm))
        return true;
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
    // native_trtc_sdk：所有平台相关咨询都依赖具体客户端（android/ios/c++），必须先问
    if (hasProduct(norm, 'native_trtc_sdk'))
        return true;
    if (CROSS_PLATFORM_PROMPT.test(norm.prompt))
        return false;
    if (isChatProductScopeQuery(norm))
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
    return PLATFORM_PROMPT.test(norm.prompt);
}
