/** 枚举/目录浏览意图 */
const DISCOVERY_INTENT_RE = /有哪些|支持哪些|列一下|列出来|清单|目录|可用|全部|全量|对比|怎么选|选哪个|哪些\s+(组件|功能|接口|能力)|which\s+one|compare|comparison|what\s+(is|are)\s+available|what\s+.*\b(components?|features?|apis?)\b|available\s+(components?|features?|apis?)|supported\s+(components?|features?|apis?)|list\s+(all|available)|catalog/i;
/** 显式完整文档意图（用户明确说"完整/从零/step by step"） */
const NARRATIVE_INTENT_RE = /从头到尾|一步一步|完整指南|完整教程|完整流程|完整接入|完整集成|完整的\s*(接入|集成|教程|指南|流程)|从零|全流程|接入指南|集成指南|step\s*by(?:\s*step)?|end[-\s]?to[-\s]?end|full\s+(guide|tutorial|flow|integration)|complete\s+(guide|tutorial|integration)|quick\s*start|getting\s*started/i;
/** 强 point 信号：API token / 错误码 / 具体操作词 → 优先走 point。
 *  注意 camelCase 检测必须区分大小写（不加 /i），否则 React/RoomKit 这类普通专有名词会被误判为 API。 */
const POINT_STRONG_SIGNAL_RE = /\b\d{5,7}\b|\bERR_[A-Z0-9_]+\b|\buse[A-Z]\w*\b|\b[A-Z][A-Za-z0-9_]*\.[A-Za-z_][A-Za-z0-9_]*\b|\b(TRTC|TX)[A-Za-z0-9_]+\b|\bprops?\b|参数|事件|回调|error\s*code|错误码|怎么用|如何用|怎么实现|如何实现|怎么做|怎么发送|怎么获取|怎么监听|怎么接收|怎么调用|如何发送|如何获取|如何监听|如何调用|参数是什么/i;
/** 判断是否含 API token（驼峰/点号/错误码/数字），这是最强的 point 结构信号。
 *  camelCase 检测区分大小写，避免把 React/RoomKit 等专有名词误判为 API。 */
function hasApiToken(prompt) {
    return /\b[a-z]+[A-Z][A-Za-z0-9_]*\b|\b[A-Z][A-Za-z0-9_]*\.[A-Za-z_]\w*\b|\b(TRTC|TX)[A-Za-z0-9_]+\b|\b\d{5,7}\b|\bERR_[A-Z0-9_]+\b/.test(prompt);
}
export function classifyRetrievalMode(prompt) {
    // 优先级分层（结构化信号，不依赖句末问号）：
    // 1) narrative 优先（保守）：用户明确要完整指南/从零/step by step，
    //    即使带操作词（如"完整指南怎么做"）也走 narrative，因为意图是完整文档。
    if (NARRATIVE_INTENT_RE.test(prompt) && !hasApiToken(prompt)) {
        return 'narrative';
    }
    // 2) API token 是最强 point 信号：query 出现具体 API/错误码/数字 → point
    if (hasApiToken(prompt)) {
        return 'point';
    }
    // 3) discovery：枚举词 + 无具体操作词（"有哪些接口 怎么实现"这类混合问法 → 走 point）
    if (DISCOVERY_INTENT_RE.test(prompt) && !POINT_STRONG_SIGNAL_RE.test(prompt)) {
        return 'discovery';
    }
    return 'point';
}
