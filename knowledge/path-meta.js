function uniq(arr) {
    return [...new Set(arr)];
}
function inferTypesFromFilename(fileName, baseTypes) {
    const types = [...baseTypes];
    const lower = fileName.toLowerCase();
    if (/error.?code|txliteavcode/.test(lower))
        types.push('error_code');
    if (lower === 'client-api.md' || lower === 'api.md' || lower === 'index.md')
        types.push('api');
    // api-<变体>.md（如 api-uniapp.md：微信小程序 uni-app 打包 API）同样是 API 文档
    if (/^api-[\w-]+\.mdx?$/.test(lower))
        types.push('api');
    if (lower === 'faq.md')
        types.push('faq');
    // 文件名 = integration.md 不再默认 push integration（由上游 framework 分支显式声明 type）
    //   live 分支 core 文档的 filename = integration.md 应是 type=core，不是 type=integration
    //   chat/preset/integration.md 等仍由 preset 分支的 types.push('integration') 处理
    if (lower.endsWith('-integration.md'))
        types.push('integration');
    if (/live-.*-interaction|voice-/.test(lower))
        types.push('feature');
    if (lower.includes('plugin') || /^\d+-advanced-/.test(lower))
        types.push('plugin');
    return uniq(types);
}
/** 目录名 → 标准 framework 值：消除 android-view / ios-uikit 这类内部目录命名泄漏到元数据标签 */
const DIR_TO_FRAMEWORK = {
    'android-view': 'android',
    'ios-uikit': 'ios',
};
function normalizeFrameworkDir(dir) {
    return DIR_TO_FRAMEWORK[dir] ?? dir;
}
function inferDocMeta(fileName) {
    const lower = fileName.toLowerCase();
    if (lower === 'capability-matrix.md') {
        return { doc_kind: 'capability_matrix' };
    }
    if (lower === 'unsupported-features.md') {
        return { doc_kind: 'unsupported_summary', capability_status: 'unsupported' };
    }
    if (lower.endsWith('-unsupported.md')) {
        return { doc_kind: 'negative_faq', capability_status: 'unsupported' };
    }
    return {};
}
function inferShareScope(fileName) {
    const lower = fileName.toLowerCase();
    if (lower === 'usersig.md') {
        return [
            'usersig', 'sdkappid', 'secretkey', 'sdk 密钥', '鉴权', '签名',
            'gentestusersig', 'tls', 'hmac',
        ];
    }
    return 'always';
}
export function inferPathMeta(relativeSource) {
    const normalized = relativeSource.replace(/\\/g, '/');
    const parts = normalized.split('/');
    const corpus = parts[0] === 'integration' ? 'integration' : 'knowledge';
    const fileName = parts[parts.length - 1] ?? '';
    let product = '*';
    let framework = ['*'];
    let types = corpus === 'integration' ? ['integration'] : [];
    let scenario = null;
    let variant;
    let doc_kind;
    let capability_status;
    let retrievable_scope;
    if (normalized.startsWith('knowledge/share/')) {
        // 通配语料（跨产品共享）显式建模，不再依赖默认兜底路径。
        product = '*';
        framework = ['*'];
        types.push('faq', 'product');
        retrievable_scope = inferShareScope(fileName);
    }
    else if (normalized.startsWith('knowledge/chat/') || normalized.startsWith('integration/chat/')) {
        product = 'chat';
        if (parts.includes('preset') && parts.length >= 4) {
            const fw = normalizeFrameworkDir(parts[parts.indexOf('preset') + 1]);
            // vue/react 运行在 Web/H5 端，追加 web 标签，使 frameworks=['web'] 也能命中
            framework = (fw === 'vue' || fw === 'react') ? [fw, 'web'] : [fw];
            variant = 'preset';
            // preset 下的 integration.md 显式标记 integration type
            if (fileName.toLowerCase() === 'integration.md') {
                types.push('integration');
            }
        }
        if (parts.includes('features')) {
            types.push('feature');
            if (parts.includes('preset')) {
                const fw = normalizeFrameworkDir(parts[parts.indexOf('preset') + 1]);
                if (fw === 'vue' || fw === 'react') {
                    types.push('component');
                }
            }
        }
        if (parts.includes('urls')) {
            if (fileName === 'product.md')
                types.push('product');
            else if (fileName === 'restapi.md')
                types.push('server_api');
            else if (fileName === 'webhook.md')
                types.push('webhook');
            else if (fileName === 'error-code.md')
                types.push('error_code');
            const urlsSdkIdx = parts.indexOf('sdk');
            if (urlsSdkIdx >= 0 && parts[urlsSdkIdx - 1] === 'urls') {
                const sdkFile = parts[urlsSdkIdx + 1];
                if (sdkFile?.endsWith('.md')) {
                    framework = [sdkFile.replace(/\.md$/, '')];
                    types.push('sdk', 'api');
                }
            }
        }
        // chat FAQ / best-practice 平台拆分：
        //   - 新结构：knowledge/chat/best-practice/{platform}/{topic}.md
        //   - 旧结构：knowledge/chat/faq/{platform}.md（保留兼容）
        // 两者都统一标记为 types=['faq']，便于通过 types=faq 命中“经验类问答”。
        if (parts[1] === 'chat' && parts[2] === 'best-practice' && parts.length >= 5) {
            const fwSlug = normalizeFrameworkDir(parts[3]);
            // chat best-practice 的 common 目录表示平台通用（Web + 小程序），
            // 不能按 framework=common 打标，否则会被 framework 硬过滤误排除。
            framework = fwSlug === 'common' ? ['web', 'miniprogram'] : [fwSlug];
            types.push('faq');
        }
        if (parts[1] === 'chat' && parts[2] === 'faq' && parts.length >= 4) {
            const fwSlug = fileName.replace(/\.mdx?$/, '');
            if (fwSlug) {
                framework = [fwSlug];
                types.push('faq');
            }
        }
        if (fileName === 'faq.md')
            types.push('faq');
    }
    else if (normalized.includes('/callkit/')) {
        product = 'call';
        const presetIdx = parts.indexOf('preset');
        const coreIdx = parts.indexOf('core-sdk');
        if (presetIdx >= 0 && parts[presetIdx + 1]) {
            framework = [normalizeFrameworkDir(parts[presetIdx + 1])];
            variant = 'preset';
        }
        if (coreIdx >= 0 && parts[coreIdx + 1]) {
            framework = [normalizeFrameworkDir(parts[coreIdx + 1])];
            variant = 'core-sdk';
        }
        // 微信小程序 uni-app 打包版：目录归入 miniprogram（运行平台=微信小程序），
        // 但技术栈是 uni-app，通过文件名 *-uniapp.md / uniapp-*.md 触发双标签，
        // 使「微信小程序」与「uni-app」两种 framework 检索都能召回同一篇文档。
        // 原生小程序（api.md/integration.md 等无 uniapp 标记）保持单 miniprogram 标签。
        if (framework[0] === 'miniprogram' && /(^uniapp[-.]|-uniapp\.mdx?$)/.test(fileName.toLowerCase())) {
            framework = ['miniprogram', 'uni-app'];
        }
        // callkit 最佳实践目录：knowledge/callkit/best-practice/{platform}/{topic}.md
        // 统一按 FAQ/经验类知识处理，支持 types=faq + frameworks={platform} 的精确检索。
        // 与 chat best-practice 对齐：common 目录表示多平台通用，按最全集覆盖。
        if (parts[1] === 'callkit' && parts[2] === 'best-practice' && parts.length >= 5) {
            const fwSlug = normalizeFrameworkDir(parts[3]);
            framework = fwSlug === 'common'
                ? ['react', 'vue', 'miniprogram', 'web', 'android', 'ios', 'flutter', 'uni-app']
                : [fwSlug];
            types.push('faq');
        }
        // preset 下的 integration.md（纯文件名，无连字符前缀）需显式标记 integration type，
        // 否则 inferTypesFromFilename 只匹配 *-integration.md，导致兜底为 faq。
        if (variant === 'preset' && fileName.toLowerCase() === 'integration.md') {
            types.push('integration');
        }
        if (parts.includes('faq'))
            types.push('faq', 'error_code');
        if (fileName === 'api.md')
            types.push('api');
        if (coreIdx >= 0)
            types.push('api', 'feature');
    }
    else if (normalized.includes('/livekit/')) {
        // livekit 目录结构：
        //   preset/{framework}/                     → 旧结构（如 preset/vue）
        //   preset/{scenario}/{platform}/           → 新结构（如 preset/live/android）
        //   core-sdk/live/{platform}/*.md          → 视频直播 core 文档（framework 标签: [live, platform]，types=[core]）
        //   core-sdk/voice/{platform}/*.md         → 语聊房 core 文档（framework 标签: [voice, platform]，types=[core]）
        //   core-sdk/features/{platform}/*.md      → 跨场景功能模块（framework 标签: [features, platform]，types=[feature]）
        //   core-sdk/api-reference/{platform}/*.md → 客户端 API（framework 标签: [platform]，types=[api]）
        //   写写上"功能模块"是 video live / voice 共享节点，所以 features/ 下文档 type=feature 而非 core
        product = 'live';
        if (parts.includes('voice'))
            scenario = 'voice';
        if (parts.includes('live'))
            scenario = 'live';
        const presetIdx = parts.indexOf('preset');
        const coreIdx = parts.indexOf('core-sdk');
        if (presetIdx >= 0 && parts[presetIdx + 1]) {
            const presetLevel1 = normalizeFrameworkDir(parts[presetIdx + 1]);
            const presetLevel2 = parts[presetIdx + 2] ? normalizeFrameworkDir(parts[presetIdx + 2]) : undefined;
            // 兼容两种 preset 目录：
            // - preset/{framework}（旧）
            // - preset/{scenario}/{platform}（新）
            if ((presetLevel1 === 'live' || presetLevel1 === 'voice') && presetLevel2) {
                scenario = presetLevel1;
                framework = [presetLevel2];
            }
            else {
                framework = [presetLevel1];
            }
            variant = 'preset';
            types.push('feature');
        }
        if (coreIdx >= 0 && parts.length >= 4) {
            // core-sdk 下的 4 个子目录（live/voice/features/api-reference），每个下挂 platform 子目录
            const sub = parts[coreIdx + 1];
            const platform = parts[coreIdx + 2];
            if (sub === 'live' && platform) {
                framework = ['live', normalizeFrameworkDir(platform)];
                types.push('core');
                if (fileName === 'integration.md') {
                    types.push('api', 'integration');
                }
                variant = 'core-sdk';
            }
            else if (sub === 'voice' && platform) {
                framework = ['voice', normalizeFrameworkDir(platform)];
                types.push('core');
                if (fileName === 'integration.md') {
                    types.push('api', 'integration');
                }
                variant = 'core-sdk';
            }
            else if (sub === 'features' && platform) {
                framework = ['features', normalizeFrameworkDir(platform)];
                types.push('feature');
                variant = 'core-sdk';
            }
            else if (sub === 'api-reference' && platform) {
                // api-reference 沿用旧逻辑：framework = platform，types = api
                framework = [normalizeFrameworkDir(platform)];
                types.push('api');
                variant = 'core-sdk';
            }
            else {
                // 兜底（不在 4 个已知子目录下）：framework = 子目录名
                framework = [normalizeFrameworkDir(sub ?? '*')];
                variant = 'core-sdk';
                types.push('feature', 'api');
            }
        }
        if (parts.includes('components'))
            types.push('component');
        if (fileName === 'faq.md')
            types.push('faq');
        // livekit 最佳实践目录：knowledge/livekit/best-practice/{platform}/{topic}.md
        // 与 chat/callkit 对齐：common 目录表示多平台通用，按最全集覆盖。
        if (parts[1] === 'livekit' && parts[2] === 'best-practice' && parts.length >= 5) {
            const fwSlug = normalizeFrameworkDir(parts[3]);
            framework = fwSlug === 'common'
                ? ['react', 'vue', 'web', 'android', 'ios', 'flutter']
                : [fwSlug];
            types.push('faq');
        }
        // 与 roomkit 对齐：core-sdk 下 capability-matrix.md / unsupported-features.md
        //   视为能力边界文档（doc_kind + capability_status），方便检索层按 doc_kind 过滤
        const docMeta = inferDocMeta(fileName);
        doc_kind = docMeta.doc_kind;
        capability_status = docMeta.capability_status ?? capability_status;
        if (doc_kind === 'capability_matrix' || doc_kind === 'unsupported_summary' || doc_kind === 'negative_faq') {
            types.push('feature', 'faq');
        }
    }
    else if (normalized.includes('/roomkit/')) {
        product = 'room';
        const presetIdx = parts.indexOf('preset');
        const coreIdx = parts.indexOf('core-sdk');
        if (presetIdx >= 0 && parts[presetIdx + 1]) {
            framework = [normalizeFrameworkDir(parts[presetIdx + 1])];
            variant = 'preset';
        }
        if (coreIdx >= 0 && parts[coreIdx + 1]) {
            framework = [normalizeFrameworkDir(parts[coreIdx + 1])];
            variant = 'core-sdk';
            types.push('feature');
            if (framework[0] === 'vue') {
                capability_status = 'supported';
            }
        }
        if (parts.includes('features'))
            types.push('feature');
        if (parts.includes('faq'))
            types.push('faq', 'error_code');
        // roomkit 最佳实践目录：knowledge/roomkit/best-practice/{platform}/{topic}.md
        // 与 chat/callkit 对齐：common 目录表示多平台通用，按最全集覆盖。
        if (parts[1] === 'roomkit' && parts[2] === 'best-practice' && parts.length >= 5) {
            const fwSlug = normalizeFrameworkDir(parts[3]);
            framework = fwSlug === 'common'
                ? ['react', 'vue', 'web', 'android', 'ios', 'flutter']
                : [fwSlug];
            types.push('faq');
        }
        const docMeta = inferDocMeta(fileName);
        doc_kind = docMeta.doc_kind;
        capability_status = docMeta.capability_status ?? capability_status;
        if (doc_kind === 'capability_matrix' || doc_kind === 'unsupported_summary' || doc_kind === 'negative_faq') {
            types.push('feature', 'faq');
        }
    }
    else if (normalized.startsWith('knowledge/trtc/')) {
        product = 'native_trtc_sdk';
        framework = [parts[2] ?? '*'];
        types.push('api', 'error_code');
    }
    else if (normalized.startsWith('knowledge/rtcengine/')) {
        product = 'rtcengine';
        framework = ['web'];
        if (parts.includes('plugin'))
            types.push('plugin');
        types.push('api', 'faq');
    }
    else if (normalized.startsWith('knowledge/push/')) {
        // push 结构：
        //   knowledge/push/overview/{topic}.md                  → 跨平台综述（接入前准备/流程/选型/计费等），framework=*，types=[product]
        //   knowledge/push/integration/{platform}.md            → framework=平台 slug，types=[integration]
        //   knowledge/push/config/android/{vendor}.md           → framework=android（vendor 厂商靠 BM25 命中），types=[integration]
        //   knowledge/push/api-reference/{platform}.md          → framework=平台 slug，types=[api]
        product = 'push';
        const category = parts[2]; // overview | integration | config | api-reference
        if (category === 'overview') {
            framework = ['*'];
            types.push('product');
        }
        else if (category === 'integration') {
            const fwSlug = fileName.replace(/\.mdx?$/, '');
            if (fwSlug) {
                framework = [fwSlug];
            }
            types.push('integration');
        }
        else if (category === 'config' && parts[3]) {
            const platform = parts[3].replace(/\.mdx?$/, '');
            framework = [platform];
            types.push('integration');
        }
        else if (category === 'api-reference') {
            const fwSlug = fileName.replace(/\.mdx?$/, '');
            if (fwSlug) {
                framework = [fwSlug];
            }
            types.push('api');
        }
        else {
            types.push('integration');
        }
    }
    if (corpus === 'integration') {
        types = ['integration'];
    }
    else if (types.length === 0) {
        types = ['faq'];
    }
    types = inferTypesFromFilename(fileName, types);
    if (types.length === 0)
        types = ['faq'];
    const primaryFramework = framework[0];
    const scope = product !== '*' && variant && primaryFramework && primaryFramework !== '*'
        ? `${product}:${variant}:${primaryFramework}`
        : undefined;
    return {
        product,
        framework,
        types: uniq(types),
        scenario,
        corpus,
        variant,
        scope,
        doc_kind,
        capability_status,
        retrievable_scope,
        meta_source: 'path',
        meta_override_fields: [],
    };
}
