const PLATFORM_WEB_SIGNAL = /\b(web|h5|html5|browser|webview)\b|\bweb[_-]?rtc\b|浏览器|网页|Web端|H5端|网页端|web\s+(?:app|client|page)|in-?browser|mobile\s+browser|安卓\s*(浏览器|网页|H5|Web|webview)|iOS\s*(浏览器|网页|H5|Web|webview)|Android\s*(?:浏览器|网页|H5|Web|webview|browser|web)|iPad\s*(?:浏览器|网页|H5|Web|browser|web)|\b(Safari|Chrome|Edge|UC|QQ浏览器|QQ\s+Browser)\b/i;
const FRAMEWORK_UNIAPP_SIGNAL = /\buni[-\s]?app\b|\buniapp\b|uni-app|HBuilderX/i;
const FRAMEWORK_FLUTTER_SIGNAL = /\bflutter\b/i;
const FRAMEWORK_REACT_NATIVE_SIGNAL = /\breact-native\b/i;
const FRAMEWORK_VUE_SIGNAL = /\bvue(?:\.js|js)?\b|\bvue\s*[23]\b|\bvue[23]\b/i;
const FRAMEWORK_REACT_SIGNAL = /\breact(?:\.js|js)?\b(?!\s*-?\s*native)|\breact\s*[0-9]+\b/i;
const PLATFORM_MINIPROGRAM_SIGNAL = /小程序|微信小程序|\bmini[-\s]?program\b|\bminiprogram\b|\bAppService\b/i;
const WEB_PRODUCT_PAIR_SIGNAL = /\bweb\s+(trtc|sdk|im|chat|roomkit)\b|\b(trtc|sdk|im|chat|roomkit)\s+web\b|trtc[-\s]sdk[-\s]?web|trtc\.js/i;
const NATIVE_TRTC_CLASS_SIGNAL = /\b(TRTCCloud|TRTCCloudListener|TRTCCloudDelegate|ITRTCCloud|TRTCTypeDef|TRTCCloudCallback|TXAudioEffectManager|TXBeautyManager|TXDeviceManager|TXLiteAVCode|TXLiveSDKTypeDef)\b/i;
const NATIVE_TRTC_METHOD_SIGNAL = /\b(?:TRTCCloud|ITRTCCloud|TX[A-Za-z0-9_]+)\s*(?:\.|::|->)\s*(?:set|get|start|stop|enable|disable)[A-Z][A-Za-z0-9_]+\b/i;
// Web-only TRTC API 特征识别（合并为一条正则，用 | 分支组织三类判定条件）：
//   1. setCurrentSpeaker/getMicrophoneList/getSpeakerList/getCameraList
//      —— Web SDK 专属命名，native SDK 无同名方法，允许裸词命中（无需 "TRTC."/"trtc." 前缀）
//   2. TRTC.isSupported / TRTC.create —— 语义过于通用，仍要求带点号前缀限定
//   3. trtc.startLocalAudio/startLocalVideo/updateLocalAudio/updateLocalVideo
//      —— native（TRTCCloud.xxx）也有同名方法，不是 Web 专属，仍要求带 "trtc."（小写）前缀区分
const WEB_TRTC_API_RE = /\b(setCurrentSpeaker|getMicrophoneList|getSpeakerList|getCameraList)\b|TRTC\.(isSupported|create)|trtc\.(startLocalAudio|startLocalVideo|updateLocalAudio|updateLocalVideo)/i;
const IOT_PRODUCT_SIGNAL = /\bIoT\b|物联网开发平台|设备端|安防摄像头|智能视觉服务|儿童手表|录音卡|TxIot/i;
function uniq(list) {
    return [...new Set(list)];
}
function detectHostEnv(prompt) {
    if (/\bios\b|iphone|ipad|苹果/i.test(prompt))
        return 'ios';
    if (/\bandroid\b|安卓/i.test(prompt))
        return 'android';
    return null;
}
function applyFrameworkLock(frameworks) {
    const unique = uniq(frameworks);
    if (unique.includes('uni-app'))
        return ['uni-app'];
    if (unique.includes('flutter'))
        return ['flutter'];
    if (unique.includes('react-native'))
        return ['react-native'];
    if (unique.includes('miniprogram'))
        return ['miniprogram'];
    return unique;
}
function collectPromptFrameworks(prompt) {
    const values = [];
    const uniapp = FRAMEWORK_UNIAPP_SIGNAL.test(prompt);
    const flutter = FRAMEWORK_FLUTTER_SIGNAL.test(prompt);
    const reactNative = FRAMEWORK_REACT_NATIVE_SIGNAL.test(prompt);
    const vue = FRAMEWORK_VUE_SIGNAL.test(prompt);
    const react = !reactNative && FRAMEWORK_REACT_SIGNAL.test(prompt);
    if (uniapp)
        values.push('uni-app');
    if (flutter)
        values.push('flutter');
    if (reactNative)
        values.push('react-native');
    if (vue)
        values.push('vue');
    if (react)
        values.push('react');
    const web = !uniapp && !flutter && !reactNative && (PLATFORM_WEB_SIGNAL.test(prompt) || WEB_PRODUCT_PAIR_SIGNAL.test(prompt));
    if (web)
        values.push('web');
    const miniprogram = !uniapp && !flutter && !reactNative && PLATFORM_MINIPROGRAM_SIGNAL.test(prompt);
    if (miniprogram)
        values.push('miniprogram');
    if (!uniapp && !flutter && !reactNative && /\b(?:unreal|UE[45]?|unreal-engine)\b/i.test(prompt))
        values.push('unreal-engine');
    if (!uniapp && !flutter && !reactNative && /\b(?:unity)\b/i.test(prompt))
        values.push('unity');
    if (!uniapp && !flutter && !reactNative && /\b(?:harmonyos|鸿蒙|HarmonyOS)\b/i.test(prompt))
        values.push('harmonyos');
    if (!uniapp && !flutter && !reactNative && /\b(?:c\+\+)\b/i.test(prompt))
        values.push('c++');
    if (!uniapp && !flutter && !reactNative && !web && !miniprogram && /\b(?:ios|iphone|ipad)\b|苹果/i.test(prompt))
        values.push('ios');
    if (!uniapp && !flutter && !reactNative && !web && !miniprogram && /\b(?:apns|voip)\b/i.test(prompt))
        values.push('ios');
    if (!uniapp && !flutter && !reactNative && !web && !miniprogram && /\bandroid\b|安卓/i.test(prompt))
        values.push('android');
    return uniq(values);
}
function collectHardSignals(prompt) {
    const hasWebTrtcApi = WEB_TRTC_API_RE.test(prompt);
    return {
        hostEnv: detectHostEnv(prompt),
        promptFrameworks: collectPromptFrameworks(prompt),
        hasStrongFrameworkLock: FRAMEWORK_UNIAPP_SIGNAL.test(prompt)
            || FRAMEWORK_FLUTTER_SIGNAL.test(prompt)
            || FRAMEWORK_REACT_NATIVE_SIGNAL.test(prompt)
            || PLATFORM_MINIPROGRAM_SIGNAL.test(prompt),
        hasWebRtcHardSignal: /\bweb[_-]?rtc\b|webrtc/i.test(prompt)
            || hasWebTrtcApi
            || /trtc\.js/i.test(prompt),
        hasWebTrtcApiSignal: hasWebTrtcApi,
        hasNativeTrtcHardSignal: NATIVE_TRTC_CLASS_SIGNAL.test(prompt) || NATIVE_TRTC_METHOD_SIGNAL.test(prompt),
    };
}
function intersect(base, target) {
    const set = new Set(target);
    return base.filter((item) => set.has(item));
}
function sameStringArray(a, b) {
    const left = uniq(a ?? []);
    const right = uniq(b);
    if (left.length !== right.length)
        return false;
    const set = new Set(left);
    return right.every((item) => set.has(item));
}
function reconcileFrameworkAgentFirst(agentFrameworks, signals) {
    // agent 保留原始多框架，不执行 applyFrameworkLock（避免丢失 miniprogram/android 等）
    const agent = uniq(agentFrameworks ?? []);
    // prompt 保留完整采集信号，不提前强锁（强锁只在最终输出时按需执行）
    const prompt = uniq(signals.promptFrameworks);
    // native TRTC 硬信号且无 WebRTC，agent frameworks=['web'] → 去掉 web（交给 requires-framework 询问原生平台）。
    if (signals.hasNativeTrtcHardSignal && !signals.hasWebRtcHardSignal) {
        const onlyWeb = agent.length === 1 && agent[0] === 'web';
        if (onlyWeb) {
            return { values: [], changed: true, reason: 'framework_corrected_by_native_trtc_hard_signal' };
        }
    }
    // WebRTC 硬信号：强制剔除 host-env（android/ios），保留真实 framework 或补 web。
    if (signals.hasWebRtcHardSignal) {
        const strongFw = agent.filter((f) => !['android', 'ios'].includes(f));
        if (strongFw.length > 0) {
            const same = sameStringArray(agentFrameworks, strongFw);
            return { values: strongFw, changed: !same, reason: same ? 'framework_keep_agent' : 'framework_narrowed_by_prompt' };
        }
        const already = agent.includes('web');
        return { values: ['web'], changed: !already, reason: already ? 'framework_keep_agent' : 'framework_corrected_by_hard_signal' };
    }
    if (signals.hasStrongFrameworkLock && prompt.length > 0) {
        const promptSet = new Set(prompt);
        // 强框架命中时，先剔除 agent 里的纯 host-env（ios/android 不应作为独立 framework 保留）
        const HOST_ENV = new Set(['android', 'ios']);
        const agentNonHost = agent.filter((f) => !HOST_ENV.has(f));
        const base = agentNonHost.length > 0 ? agentNonHost : agent;
        // prompt 是 base 子集 → base 更丰富，保留 base，不收窄
        if (prompt.every((f) => new Set(base).has(f))) {
            const same = sameStringArray(agentFrameworks, base);
            return { values: base, changed: !same, reason: same ? 'framework_keep_agent' : 'framework_narrowed_by_prompt' };
        }
        // prompt 与 base 有交集 → 取交集，有限收窄
        const intersection = base.filter((f) => promptSet.has(f));
        if (intersection.length > 0) {
            const same = sameStringArray(agentFrameworks, intersection);
            return { values: intersection, changed: !same, reason: same ? 'framework_keep_agent' : 'framework_narrowed_by_prompt' };
        }
        // 无交集（真冲突）：
        // - agentNonHost 含真实框架（非 host-env、非泛平台词 web）→ agent 推断可信，透传
        // - agentNonHost 为空或只含泛平台词（web/android/ios）→ prompt 强框架更具体，执行纠偏
        const GENERIC_PLATFORM = new Set(['android', 'ios', 'web']);
        const agentSpecific = agentNonHost.filter((f) => !GENERIC_PLATFORM.has(f));
        if (agentSpecific.length > 0) {
            return { values: base, changed: false, reason: 'framework_keep_agent' };
        }
        return { values: applyFrameworkLock(prompt), changed: true, reason: 'framework_corrected_by_hard_signal' };
    }
    if (agent.length > 0 && prompt.length > 0) {
        const narrowed = intersect(agent, prompt);
        if (narrowed.length > 0 && narrowed.length < agent.length) {
            return { values: narrowed, changed: true, reason: 'framework_narrowed_by_prompt' };
        }
        return { values: agent, changed: false, reason: 'framework_keep_agent' };
    }
    if (agent.length > 0) {
        return { values: agent, changed: false, reason: 'framework_keep_agent' };
    }
    if (prompt.length > 0) {
        return { values: applyFrameworkLock(prompt), changed: true, reason: 'framework_adopt_prompt' };
    }
    return { values: [], changed: false, reason: 'framework_no_signal' };
}
function reconcileProductAgentFirst(agentProducts, _signals, prompt) {
    const agent = uniq(agentProducts ?? []);
    // 产品合并后，TRTC 的 Web/Native 区分移到 framework 层（reconcileFrameworkAgentFirst），
    // product 纠偏只剩 IoT 信号（方案 6.5）。
    if (IOT_PRODUCT_SIGNAL.test(prompt)) {
        if (agent.length === 0) {
            return { values: ['iot'], changed: true, reason: 'product_corrected_by_iot_signal' };
        }
        if (agent.includes('iot')) {
            return { values: agent, changed: false, reason: 'product_keep_agent' };
        }
    }
    return { values: agent, changed: false, reason: agent.length > 0 ? 'product_keep_agent' : 'product_no_signal' };
}
function buildRouteReason(frameworkDecision, productDecision) {
    const reasons = [frameworkDecision.reason, productDecision.reason]
        .filter((r) => r !== 'framework_no_signal' && r !== 'product_no_signal' && r !== 'framework_keep_agent' && r !== 'product_keep_agent');
    if (reasons.length === 0)
        return 'agent_passthrough';
    return reasons.join('+');
}
function passthroughPlan(params, reason, env) {
    return { primary: params, meta: { route_reason: reason, environment_downgraded: env } };
}
export function preflightRoute(params) {
    const prompt = params.prompt ?? '';
    const signals = collectHardSignals(prompt);
    const frameworkDecision = reconcileFrameworkAgentFirst(params.frameworks, signals);
    const finalFrameworks = frameworkDecision.values;
    const productDecision = reconcileProductAgentFirst(params.product, signals, prompt);
    const finalProducts = productDecision.values;
    const reason = buildRouteReason(frameworkDecision, productDecision);
    const envDowngraded = signals.hostEnv != null && finalFrameworks.length > 0 && !finalFrameworks.includes(signals.hostEnv);
    if (!frameworkDecision.changed
        && !productDecision.changed
        && sameStringArray(params.product, finalProducts)
        && sameStringArray(params.frameworks, finalFrameworks)) {
        return passthroughPlan(params, reason, envDowngraded);
    }
    return {
        primary: {
            ...params,
            product: finalProducts,
            frameworks: finalFrameworks,
        },
        meta: {
            route_reason: reason,
            environment_downgraded: envDowngraded,
        },
    };
}
