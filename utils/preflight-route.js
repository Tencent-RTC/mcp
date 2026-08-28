// ========== 信号分层（方案 §3，中英双语） ==========
// 产品词：产品线路标识
const PRODUCT_SIGNALS = {
    call: /CallKit|TUICallKit|TUICallEngine|语音通话|视频通话|来电|去电|拨打|\b(?:voice|video)\s+calls?\b|incoming\s+calls?|outgoing\s+calls?|make\s+a\s+call|\bdial(?:ing)?\b/i,
    live: /LiveKit|TUILiveKit|直播|语聊房|连麦|开播|观看直播|\blive\s+stream(?:ing)?\b|\bvoice\s+room\b|co-?host(?:ing)?|go\s+live|start\s+stream(?:ing)?|watch(?:ing)?\s+live|\bbroadcast(?:ing)?\b/i,
    room: /RoomKit|会议|会中|会议室|屏幕分享|白板|\bconference\b|\bmeetings?\b|in-?meeting|meeting\s+room|screen\s+shar(?:e|ing)|white\s*board/i,
    chat: /\bchat\b|\bim\b|会话|消息|TUIKit|ChatKit|\bconversation\b|\bmessaging\b|\binstant\s+messaging\b/i,
    push: /TIMPush|推送|离线推送|FCM|APNs|华为|小米|OPPO|vivo|\bpush(?:\s+notification)?s?\b|offline\s+push|vendor\s+channel|\bHuawei\b|\bXiaomi\b|\bHonor\b/i,
};
// 平台词（纯运行形态，不含任何产品词）
const PLATFORM_NATIVE_SIGNAL = /\b(android|ios|flutter|c\+\+|native)\b|安卓\s*(sdk|端|原生)|iOS\s*(SDK|端|原生)|原生\s*(sdk|端)?|native\s+(?:sdk|client|app)|mobile\s+(?:sdk|native)/i;
const PLATFORM_WEB_SIGNAL = /\b(web|h5|html5|browser|webview)\b|浏览器|网页|Web端|H5端|网页端|web\s+(?:app|client|page)|in-?browser|mobile\s+browser|安卓\s*(浏览器|网页|H5|Web|webview)|iOS\s*(浏览器|网页|H5|Web|webview)|Android\s*(?:浏览器|网页|H5|Web|webview|browser|web)|iPad\s*(?:浏览器|网页|H5|Web|browser|web)|\b(Safari|Chrome|Edge|UC|QQ浏览器|QQ\s+Browser)\b/i;
// 小程序信号：小程序 / 微信小程序 / miniprogram / mini program / AppService（小程序逻辑层专有名词）。
// 命中即锁定 miniprogram，并像 web 一样压制 native 单字与 native 兜底，
// 避免「PC 微信小程序…没有原生 WebSocket」这类描述里的「原生」被 PLATFORM_NATIVE_SIGNAL 误命中后兜底成 android。
const PLATFORM_MINIPROGRAM_SIGNAL = /小程序|微信小程序|\bmini[-\s]?program\b|\bminiprogram\b|\bAppService\b/i;
// 平台+产品复合词（运行形态 + 产品线路标识）
const WEB_PRODUCT_PAIR_SIGNAL = /\bweb\s+(trtc|sdk|im|chat|roomkit)\b|\b(trtc|sdk|im|chat|roomkit)\s+web\b|trtc[-\s]?sdk|trtc\.js/i;
// API 词（客户端调用形态）
const NATIVE_TRTC_CLASS_SIGNAL = /\b(TRTCCloud|TRTCCloudListener|TRTCCloudDelegate|ITRTCCloud|TRTCTypeDef|TRTCCloudCallback|TXAudioEffectManager|TXBeautyManager|TXDeviceManager|TXLiteAVCode|TXLiveSDKTypeDef)\b/i;
const NATIVE_TRTC_METHOD_SIGNAL = /\b(?:TRTCCloud|ITRTCCloud|TX[A-Za-z0-9_]+)\s*(?:\.|::|->)\s*(?:set|get|start|stop|enable|disable)[A-Z][A-Za-z0-9_]+\b/i;
const WEB_TRTC_API_RE = /TRTC\.(setCurrentSpeaker|getMicrophoneList|getSpeakerList|getCameraList|isSupported|create)|trtc\.(startLocalAudio|startLocalVideo|updateLocalAudio|updateLocalVideo)/i;
const WEB_TRTC_TOKEN_RE = /^TRTC\.(setCurrentSpeaker|getMicrophoneList|getSpeakerList|getCameraList|isSupported|create)$/i;
// 协议级 TRTC 信号
const TRTC_SIGNAL = /\bTRTC\b|\bWebRTC\b|rtcengine|TRTCCloud|腾讯实时音视频/i;
// ========== 工具函数 ==========
function uniq(list) {
    return [...new Set(list)];
}
function extractQueryApiTokens(prompt) {
    const matches = prompt.match(/\b(?:TRTC|trtc)\.[A-Za-z_][A-Za-z0-9_]*\b/g) ?? [];
    return uniq(matches.map((m) => m.replace(/^trtc\./i, 'TRTC.')));
}
function collectPromptSignals(prompt) {
    const products = new Set();
    if (PRODUCT_SIGNALS.call.test(prompt))
        products.add('call');
    if (PRODUCT_SIGNALS.live.test(prompt))
        products.add('live');
    if (PRODUCT_SIGNALS.room.test(prompt))
        products.add('room');
    if (PRODUCT_SIGNALS.chat.test(prompt))
        products.add('chat');
    if (PRODUCT_SIGNALS.push.test(prompt))
        products.add('push');
    if (TRTC_SIGNAL.test(prompt))
        products.add('trtc');
    // 平台 tokens：web signal 锁定 → 压制 native 单字(安卓/iOS 仅归 hostEnv);
    // miniprogram signal 锁定 → 同样压制 native 单字与 native 兜底(小程序逻辑层"没有原生 X"不应被判成 native)。
    // 真复合词(unreal/unity/harmonyos/react-native/flutter/c++)不受影响。
    const platforms = [];
    const webLocked = PLATFORM_WEB_SIGNAL.test(prompt) || WEB_PRODUCT_PAIR_SIGNAL.test(prompt);
    if (webLocked) {
        platforms.push('web');
    }
    // 小程序信号优先级高于 native 单字/兜底：命中即锁定 miniprogram。
    // web + 小程序可同时成立(如"小程序 web-view"),各自入 platforms 由 search core 做多平台归并。
    const mpLocked = PLATFORM_MINIPROGRAM_SIGNAL.test(prompt);
    if (mpLocked) {
        platforms.push('miniprogram');
    }
    const nativeSpecificHits = [];
    if (/\b(?:unreal|UE[45]?|unreal-engine)\b/i.test(prompt))
        nativeSpecificHits.push('unreal-engine');
    if (/\b(?:unity)\b/i.test(prompt))
        nativeSpecificHits.push('unity');
    if (/\b(?:harmonyos|鸿蒙|HarmonyOS)\b/i.test(prompt))
        nativeSpecificHits.push('harmonyos');
    if (/\b(?:react-native)\b/i.test(prompt))
        nativeSpecificHits.push('react-native');
    if (/\b(?:flutter)\b/i.test(prompt))
        nativeSpecificHits.push('flutter');
    if (/\b(?:c\+\+)\b/i.test(prompt))
        nativeSpecificHits.push('c++');
    // 安卓/iOS 单字只在非 web-locked 且非 miniprogram-locked 时进 platforms(否则仅归 hostEnv)
    if (!webLocked && !mpLocked && /\b(?:ios|iphone|ipad|苹果)\b/i.test(prompt))
        nativeSpecificHits.push('ios');
    if (!webLocked && !mpLocked && /\b(?:android|安卓)\b/i.test(prompt))
        nativeSpecificHits.push('android');
    // 真复合词(如 unity/unreal/flutter/harmonyos/react-native/c++)无条件 push;单字在 web/miniprogram 锁定时被压制
    if (nativeSpecificHits.length > 0) {
        platforms.push(...nativeSpecificHits);
    }
    else if (!webLocked && !mpLocked && PLATFORM_NATIVE_SIGNAL.test(prompt)) {
        // 仅 "native" 词,未指定细分 → 默认 android(web/miniprogram 锁定时不触发 fallback,
        // 避免被 \b(android|ios|...) 或"原生"反向命中把 web/小程序 路径覆盖成 native)
        platforms.push('android');
    }
    // Host env：仅用于标记，不进 platforms 归一化
    let hostEnv = null;
    if (/\bios\b|iphone|ipad|苹果/i.test(prompt))
        hostEnv = 'ios';
    else if (/\bandroid\b|安卓/i.test(prompt))
        hostEnv = 'android';
    const queryApiTokens = extractQueryApiTokens(prompt);
    const hasWebTrtcApi = PLATFORM_WEB_SIGNAL.test(prompt)
        || WEB_TRTC_API_RE.test(prompt)
        || queryApiTokens.some((t) => WEB_TRTC_TOKEN_RE.test(t));
    const hasNativeTrtcApi = NATIVE_TRTC_CLASS_SIGNAL.test(prompt) || NATIVE_TRTC_METHOD_SIGNAL.test(prompt);
    return { products, platforms, hostEnv, hasWebTrtcApi, hasNativeTrtcApi, queryApiTokens };
}
function reconcileWithPrompt(promptValues, explicit) {
    // 核心规则：prompt 是真值源，explicit 只在 prompt 为空时启用。
    // 这条规则必须严格遵守——
    //   「prompt 是用户问题表达出来的真实意图」，explicit 只在外部上下文（IDE/文件/历史）有补充价值，
    //   但 prompt 既然明示了「Web」，就要按 Web 来，不要因为 explicit 多了 'android' 就把它"补"进来当成双路。
    // 情形 1：prompt 真值存在 → 信任 prompt 真值
    //   - 即便 explicit 扩张（prompt 外多列了平台）→ 也只输出 prompt 真值（prompt_override=true 表示 agent 推理被忽略）
    //   - 即便 explicit 收缩（prompt 真值的子集）→ 也只输出 prompt 真值（避免丢失用户意图）
    if (promptValues.length > 0) {
        const promptSet = new Set(promptValues);
        const sameAsExplicit = !!explicit?.length
            && explicit.length === promptValues.length
            && explicit.every((v) => promptSet.has(v));
        return { values: uniq(promptValues), corrected: !sameAsExplicit };
    }
    // 情形 2：prompt 真值无平台信息 → 信任上游 agent 基于上下文（IDE/文件/历史）的推理
    if (!promptValues.length) {
        return { values: uniq(explicit ?? []), corrected: false };
    }
    return { values: [], corrected: false };
}
// ========== Phase 3: 单 SearchParams 构造 ==========
//
// 关键约束：**永远只返回单 primary**，consumer 只跑一次 searchKnowledge。
// multi-platform / multi-product 通过把 frameworks / product 设成数组交给 search core 处理。
// search core 的 filterPool.applyRankMultipliers 已原生支持多值归并。
function passthroughPlan(params, reason, env) {
    return { primary: params, meta: { route_reason: reason, environment_downgraded: env } };
}
/** 单产品路径：product 是单值；frameworks 是数组（可能多平台共享一个 product） */
function singleProductPlan(params, product, frameworks, hostEnv, reason) {
    const envDiff = hostEnv != null && !frameworks.includes(hostEnv);
    return {
        primary: { ...params, product: [product], frameworks },
        meta: { route_reason: reason, environment_downgraded: envDiff },
    };
}
/** TRC 路径：product 是数组（rtcengine/native_trtc_sdk 两个产品码，按 platforms 各命中其一）；frameworks 也是数组 */
function trcMultiProductPlan(params, products, frameworks, reason, env) {
    return {
        primary: { ...params, product: products, frameworks },
        meta: { route_reason: reason, environment_downgraded: env },
    };
}
// ========== 主入口（基于 prompt 真值归一化） ==========
export function preflightRoute(params) {
    const prompt = params.prompt ?? '';
    const explicitFrameworks = params.frameworks?.length ? uniq(params.frameworks) : undefined;
    const explicitProducts = params.product?.length ? uniq(params.product) : undefined;
    // Phase 1
    const signals = collectPromptSignals(prompt);
    // —— 真跨主题（多产品信号）直接 passthrough
    const nonTrtcProducts = [...signals.products].filter((p) => p !== 'trtc');
    if (nonTrtcProducts.length > 1) {
        return passthroughPlan(params, 'cross_product_passthrough', false);
    }
    // Phase 2: frameworks 调和
    const fwRecon = reconcileWithPrompt(signals.platforms, explicitFrameworks);
    const frameworks = fwRecon.values;
    const envDowngraded = signals.hostEnv != null && !frameworks.includes(signals.hostEnv);
    // Phase 2.5: products 调和（仅当 prompt 有非 TRTC 单产品时取此产品；TRTC 由 platform 推断 rtcengine/native_trtc_sdk）
    const explicitTrtcBoth = explicitProducts?.includes('rtcengine') && explicitProducts?.includes('native_trtc_sdk');
    const explicitTrtcAny = explicitProducts?.some((p) => p === 'rtcengine' || p === 'native_trtc_sdk') ?? false;
    const isTrtcFamily = signals.products.has('trtc') || explicitTrtcBoth || (explicitTrtcAny && !nonTrtcProducts[0]);
    // —— TRTC 家族：产物随平台分流
    if (isTrtcFamily) {
        const hasWeb = frameworks.includes('web');
        const natives = frameworks.filter((f) => f !== 'web');
        // TRTC + 多平台（web + native）→ product 数组，search core filterPool 原生接受多 product 交集
        if (hasWeb && natives.length > 0) {
            const reason = fwRecon.corrected ? 'trtc_multi_platform_prompt_override' : 'trtc_multi_platform';
            return trcMultiProductPlan(params, ['rtcengine', 'native_trtc_sdk'], frameworks, reason, envDowngraded);
        }
        // TRTC + 仅 web
        if (hasWeb) {
            const reason = fwRecon.corrected ? 'trtc_web_prompt_override' : 'trtc_web';
            return singleProductPlan(params, 'rtcengine', ['web'], signals.hostEnv, reason);
        }
        // TRTC + 仅 native
        if (natives.length > 0) {
            const reason = fwRecon.corrected ? 'trtc_native_prompt_override' : 'trtc_native';
            return singleProductPlan(params, 'native_trtc_sdk', natives, signals.hostEnv, reason);
        }
        // TRTC 但 prompt / explicit 都没有可用平台 → 透传
        return passthroughPlan(params, 'trtc_no_platform_resolved', false);
    }
    // —— 单非 TRTC 产品
    if (nonTrtcProducts.length === 1) {
        const product = nonTrtcProducts[0];
        // 多平台 → product 单值，frameworks 多值（search core filterPool 原生按 framework 交集过滤）
        if (frameworks.length >= 2) {
            const reason = fwRecon.corrected ? 'multi_platform_prompt_override' : 'multi_platform';
            return singleProductPlan(params, product, frameworks, signals.hostEnv, reason);
        }
        // 单平台
        if (frameworks.length === 1) {
            const reason = fwRecon.corrected ? 'single_platform_prompt_override' : 'single_platform';
            return singleProductPlan(params, product, frameworks, signals.hostEnv, reason);
        }
        // 无平台信号：透传（保留 explicit frameworks）
        if (explicitFrameworks?.length) {
            return singleProductPlan(params, product, uniq(explicitFrameworks), signals.hostEnv, 'product_no_platform_explicit');
        }
        return passthroughPlan(params, 'product_no_platform_signal', false);
    }
    // —— 无产品信号：纯透传
    return passthroughPlan(params, 'no_product_signal', false);
}
