import { getSourceFileContent } from '../content-loader.js';
import { tokenizeExactCJK } from '../bm25.js';
import { inferQueryApiTokens } from './search-core.js';
export const DOC_PATH_MAP = {
    android: ['core_api', 'type_def', 'callback', 'statistics', 'audio_effect', 'beauty', 'device', 'error_code'],
    ios: ['core_api', 'type_def', 'callback', 'statistics', 'audio_effect', 'beauty', 'device', 'error_code'],
    'c++': ['core_api', 'type_def', 'callback', 'statistics', 'audio_effect', 'device', 'error_code'],
};
export function inferNativeTRTCIntents(prompt) {
    const normalizedPrompt = prompt.toLowerCase();
    if (/enterroom|exitroom|startlocalpreview|mutelocalaudio|trtccloud\.|setlocal|setremote/.test(normalizedPrompt)) {
        return ['core_api'];
    }
    if (/错误|报错|error|warning|code|排查/.test(normalizedPrompt)) {
        return ['error_code'];
    }
    if (/回调|事件|监听|delegate|listener|callback|on[A-Z]/.test(prompt)) {
        return ['callback'];
    }
    if (/参数|结构体|枚举|typedef|type ?def|trtcparams|编码|配置/.test(normalizedPrompt)) {
        return ['type_def'];
    }
    // 去掉「码率|帧率」——「视频码率怎么设置/帧率推荐值」是设置/推荐意图（答案在
    // 调整视频画质实践文档与编码参数），非统计字段查询；误归 statistics 后 TRTCStatistics +100
    // 压制真正答案文档。
    if (/统计|网络质量|statistics/.test(normalizedPrompt)) {
        return ['statistics'];
    }
    if (/音效|bgm|混响|耳返|audio/.test(normalizedPrompt)) {
        return ['audio_effect'];
    }
    if (/美颜|滤镜|beauty/.test(normalizedPrompt)) {
        return ['beauty'];
    }
    if (/设备|摄像头|麦克风|扬声器|device/.test(normalizedPrompt)) {
        return ['device'];
    }
    // 无明确意图时不再兜底 core_api/error_code——实测「测速结果带宽字段」等
    // query 被 fallback core_api +100 无差别顶到 TRTCCloud，压制真正的答案文档。
    // 仅在正则明确命中意图时 boost；无意图 query 交给 BM25 正文主导。
    return [];
}
/**
 * native TRTC 意图 → 文档主标题（doc_title = nav_path 末段）。
 * 按 framework 区分：android/ios 的「TRTCCloud」同名但不同文档，靠 chunk.framework 精确到单篇。
 */
const INTENT_DOC_TITLES = {
    android: {
        core_api: ['TRTCCloud'],
        type_def: ['类型定义'],
        callback: ['TRTCCloudListener'],
        statistics: ['TRTCStatistics'],
        audio_effect: ['TXAudioEffectManager'],
        beauty: ['TXBeautyManager'],
        device: ['TXDeviceManager'],
        error_code: ['错误码表'],
    },
    ios: {
        core_api: ['TRTCCloud'],
        type_def: ['类型定义'],
        callback: ['TRTCCloudDelegate'],
        statistics: ['TRTCStatistics'],
        audio_effect: ['TXAudioEffectManager'],
        beauty: ['TXBeautyManager'],
        device: ['TXDeviceManager'],
        error_code: ['错误码表'],
    },
    'c++': {
        core_api: ['ITRTCCloud'],
        type_def: ['类型定义'],
        callback: ['TRTCCloudCallback'],
        statistics: ['ITRTCStatistics'],
        audio_effect: ['ITXAudioEffectManager'],
        device: ['ITXDeviceManager'],
        error_code: ['错误码表'],
    },
};
/**
 * 平台词（英文）：nav_path 末段若只由这些词构成，属「平台叶子名」
 * （如「Android 智能设备」「Linux & RTOS 设备」），非区分性主标题，不加权。
 * 并入高频泛化词（titleDf 实测 im=1708/54% 文档、sdk/api/app 等）——
 * doc_title「IM 搭建直播间」的英文 token 仅 [im]，query 含「im」即触发 every() 命中，
 * 同文档 13 个 chunk 各 +80，把「userid 长度限制」等正文型 query 系统性压制。
 * every() 机制天然不影响「TXIoTEngine」等真区分性单 token（不在表内即继续走英文全覆盖命中）。
 */
const PLATFORM_WORDS = new Set([
    'android', 'ios', 'web', 'h5', 'windows', 'mac', 'macos', 'linux', 'rtos',
    'flutter', 'react', 'vue', 'unity', 'uniapp', 'harmonyos', 'electron',
    'miniprogram', 'desktop', 'mobile', 'compose', 'swiftui', 'c', 'cpp', 'native',
    // 高频泛化词（titleDf 占比过半或跨产品通用缩写）：不构成「主标题精确匹配」的区分信号
    'im', 'imsdk', 'sdk', 'api', 'app', 'ui', 'css', 'av', 'rest', 'faq', 'demo',
    'kit', 'trtc', 'webrtc', 'http', 'url', 'json',
]);
/**
 * 中文平台叶子名：nav_path 末段（文件名去 .md）若整体就是这些词，属「平台叶子名」
 * （如「小程序」「智能设备」），非区分性主标题，不加权。
 * 数据配置，与 taxonomy.yaml / bm25.ts 的 TECHNICAL_TERMS 同类，可扩展。
 */
const CN_PLATFORM_LEAF = new Set([
    '小程序', '设备', '智能设备', '应用端', '设备端', '客户端', '服务端',
]);
/**
 * 判断 query 是否命中文档主标题（doc_title = nav_path 末段）。两种命中口径：
 * - 中文词级匹配：doc_title 的中文部分（jieba 精确分词后）是 query 中文精确分词的
 *   完整连续词序列（如「云台控制」完整出现在「安防摄像头云台控制怎么接入」）。
 *   不再用「任意 2 字子串」，从机制上消除「设备端 → 设备」这类前缀子串误命中。
 * - 英文 token 全覆盖：doc_title 的英文 token 全部出现在 query（如「TXIoTEngine」）。
 * 平台叶子名过滤：doc_title 的英文 token 全为平台词（「Linux & RTOS 设备」），
 * 或中文部分整体是中文平台名（「小程序」）→ 非区分性主标题，返回 false。
 */
function docTitleHit(query, docTitle) {
    if (!docTitle)
        return false;
    const normQuery = query.toLowerCase();
    const titleTokens = docTitle.toLowerCase().match(/[a-z0-9_]+/g) ?? [];
    // 平台叶子名：英文 token 全为平台词（如「Linux & RTOS 设备」）→ 非区分性主标题
    if (titleTokens.length > 0 && titleTokens.every((t) => PLATFORM_WORDS.has(t)))
        return false;
    const cnTitle = docTitle.replace(/[^\u4e00-\u9fff]/g, '');
    // 平台叶子名：中文部分整体是中文平台名（如「小程序」）→ 非区分性主标题
    if (cnTitle && CN_PLATFORM_LEAF.has(cnTitle))
        return false;
    // 中文命中：doc_title 中文是 query 中文精确分词的完整连续词序列（词级匹配，非子串）
    if (cnTitle.length >= 2) {
        const cnQuery = query.replace(/[^\u4e00-\u9fff]/g, '');
        if (containsSequence(tokenizeExactCJK(cnQuery), tokenizeExactCJK(cnTitle)))
            return true;
    }
    // 英文命中：doc_title 英文 token 全部出现在 query
    if (titleTokens.length === 0)
        return false;
    const queryTokens = new Set(normQuery.match(/[a-z0-9_]+/g) ?? []);
    return titleTokens.every((t) => queryTokens.has(t));
}
/** 判断 tWords 是否作为连续子序列出现在 qWords 中。 */
function containsSequence(qWords, tWords) {
    if (tWords.length === 0 || tWords.length > qWords.length)
        return false;
    outer: for (let i = 0; i + tWords.length <= qWords.length; i += 1) {
        for (let j = 0; j < tWords.length; j += 1) {
            if (qWords[i + j] !== tWords[j])
                continue outer;
        }
        return true;
    }
    return false;
}
export function runExactLookup(prompt, pool, norm) {
    const boosts = {};
    const exactHits = [];
    const lowerPrompt = prompt.toLowerCase();
    const addBoost = (chunk, amount, label) => {
        boosts[chunk.id] = (boosts[chunk.id] ?? 0) + amount;
        if (!exactHits.includes(label))
            exactHits.push(label);
    };
    // 文档主标题（doc_title = nav_path 末段）精确匹配加权。
    // 解决「总览文档内嵌同名子章节抢占专题文档」与「按类名/平台名召回不到」两类问题。
    // 80 → 40：实测 +80 一票定乾坤，doc_title「生成 UserSig」唯一英文 token [usersig]
    // （不在泛化词表，单 token every() 命中），同文档 3 个 chunk 各 +80 后 133 分压制「usersig 有效期」
    // 答案文档。降半保留标题信号强度，BM25 正文可竞争。
    for (const chunk of pool) {
        if (!chunk.doc_title)
            continue;
        if (docTitleHit(prompt, chunk.doc_title)) {
            addBoost(chunk, 40, `E0:doc-title:${chunk.doc_title}`);
        }
    }
    // 查询意图→文档类型对齐：query 含「回调/callback」→ 第三方回调文档（types=webhook）加权，
    // 并互斥抑制服务端 API 加权——「服务端…回调」的意图是找回调文档，不是 REST API；
    // 解决「发消息前回调」被「在群组中发送普通消息」（其 ForbidCallbackControl 字段说明里
    // 恰有「发消息前回调」字面）抢占、真正的回调接口文档沉底的问题。
    // 概念关键词 ↔ 文档类型 的通用对齐，非 case 特化。
    const isCallbackQuery = /回调|callback/i.test(prompt);
    if (isCallbackQuery) {
        for (const chunk of pool) {
            if ((chunk.types ?? []).includes('webhook')) {
                addBoost(chunk, 120, 'E13:webhook');
            }
        }
    }
    // 方案名锚点：query 带方案意图词（解决方案/方案/场景）且词序列命中 nav_path
    // 场景段（≥4 字中文段、词级连续匹配）→ +60。「视频交友」等方案目录名只落在 nav_path
    // （BM25 ×1），竞争不过竞品 content ×2 的高频词（如「无UI接入/Flutter」的 CallKit 正文）；
    // query 明确在找「方案」时，方案目录就是答案本身。
    // 收窄原因：iot 功能目录段（动态注册/微信通话/监控拉流）与功能词 query 高度重叠，
    // 无条件段命中会把整目录 boost 拉乱；
    // 方案意图词判别「query 找的是方案而非具体功能」，功能词 query（动态注册流程等）不触发，
    // 泛化段（快速接入等）也不会出现在 query 里，天然排除，无需黑名单。
    if (/解决方案|方案|场景/i.test(prompt)) {
        const cnQueryTokens = tokenizeExactCJK(prompt.replace(/[^\u4e00-\u9fff]/g, ''));
        if (cnQueryTokens.length > 0) {
            for (const chunk of pool) {
                for (const seg of chunk.nav_path ?? []) {
                    const cn = seg.replace(/[^\u4e00-\u9fff]/g, '');
                    if (cn.length < 4)
                        continue;
                    if (containsSequence(cnQueryTokens, tokenizeExactCJK(cn))) {
                        addBoost(chunk, 60, `E14:nav-seg:${seg}`);
                        break;
                    }
                }
            }
        }
    }
    // 服务端意图：query 含「服务端」→ 服务端 API 文档（types=server_api）加权。
    // 解决「服务端发送系统消息」被「发送红包」等客户端/实践文档抢占的问题。
    // 回调 query 时跳过：回调意图优先，避免把 server_api 文档顶过回调文档。
    if (!isCallbackQuery && /服务端|server\s*api|rest\s*api/i.test(prompt)) {
        for (const chunk of pool) {
            if ((chunk.types ?? []).includes('server_api')) {
                addBoost(chunk, 80, 'E11:server-api');
            }
        }
    }
    // 教程型 query（如何/怎么，非报错/问题）时，「常见问题/FAQ」类文档降权。
    // 解决「如何进入房间」被 tutorial-06-info-faq 抢占、「推送消息怎么发」被常见问题抢占。
    const isHowToQuery = /如何|怎么|怎样/i.test(prompt) && !/报错|错误|失败|问题|排查|error/i.test(prompt);
    if (isHowToQuery) {
        for (const chunk of pool) {
            const isFaqDoc = /问题|faq/i.test(chunk.doc_title ?? '')
                || /常见问题|\/faq\/|-info-faq/i.test(chunk.source ?? '');
            if (isFaqDoc) {
                addBoost(chunk, -80, 'E12:howto-faq-downgrade');
            }
        }
    }
    // 网络访问限制文档意图门控。
    // 「IM应对网络访问限制实践教程」的「域名IP白名单/模式优缺点」chunk 含大量域名/IP/端口 token，
    // BM25 短 chunk 虚高 + 向量跨语义误召回，导致「userid长度/多端登录/群组峰值」等
    // 无网络访问意图的 query 被抢占。
    // 门控：query 无「代理/域名/白名单/网络访问」意图时，对这类 chunk 强降权，让真正目标文档浮上来。
    const hasNetworkIntent = /代理|内网|域名|白名单|防火墙|网络访问|正向代理|SOCKS|tunnel|局域网|翻墙/i.test(prompt);
    if (!hasNetworkIntent) {
        for (const chunk of pool) {
            const isNetworkRestrictChunk = /网络访问限制/i.test(chunk.source ?? '')
                || /域名\s*IP\s*白名单|模式优缺点|正向代理/i.test(chunk.title ?? '');
            if (isNetworkRestrictChunk) {
                addBoost(chunk, -300, 'E15:network-restrict-gate');
            }
        }
    }
    // error codes
    // 位数 5-7 → 4-7。厂商错误码 4 位（如厂商发送阶段 6014）实测不触发，
    // query「错误码 6014 是什么」正解（错误码.md +200）缺失，反被「是什么」意图 +150 抢到接入前准备。
    const errorMatches = [
        ...prompt.matchAll(/\b(\d{4,7})\b/g),
        ...prompt.matchAll(/\b(ERR_[A-Z0-9_]+)\b/g),
    ];
    for (const match of errorMatches) {
        const code = match[1];
        for (const chunk of pool) {
            if (chunk.error_codes.includes(code) || chunk.title.includes(code)) {
                addBoost(chunk, 200, `E1:${code}`);
            }
        }
    }
    // 跟踪已按 native 意图 boost 的文件，避免 symbols 在同文件重复满额放大（双重 boost 会压垮 BM25 文件内排序）
    const e2BoostedFiles = new Set();
    // native TRTC 意图（只在传了 framework 时 boost；未传 framework 由 requires-framework 拦截）
    // 衰减策略：同文件首 chunk +100，第 2 个 +50，第 3 个 +25 ...（下限 +5），
    // 让 BM25 原始打分主导文件内方法级排序，避免「createSubCloud 顶掉 enterRoom」。
    if (norm.product?.includes('trtc') && norm.frameworks?.some((fw) => ['android', 'ios', 'c++'].includes(fw))) {
        const intents = inferNativeTRTCIntents(prompt);
        for (const fw of norm.frameworks) {
            const supportedIntents = DOC_PATH_MAP[fw];
            if (!supportedIntents)
                continue;
            const intentTitles = INTENT_DOC_TITLES[fw];
            for (const intent of intents) {
                if (!supportedIntents.includes(intent))
                    continue;
                const titles = intentTitles?.[intent];
                if (!titles || titles.length === 0)
                    continue;
                const titleSet = new Set(titles);
                // 收集命中（doc_title + framework 精确到单篇）的 chunks 按 char_start 排序（即文件内顺序）
                const fileChunks = pool
                    .filter((c) => c.product === 'trtc' && !!c.doc_title && titleSet.has(c.doc_title) && (c.framework ?? []).includes(fw))
                    .sort((a, b) => a.char_start - b.char_start);
                for (let i = 0; i < fileChunks.length; i += 1) {
                    const decay = Math.max(5, Math.floor(100 / Math.pow(2, i)));
                    addBoost(fileChunks[i], decay, `E2:${intent}`);
                    e2BoostedFiles.add(fileChunks[i].source);
                }
            }
        }
    }
    // symbols / Class.method
    // 若 chunk 所在文件已被 native 意图 boost，则减半（避免双重放大压制 BM25 内序）
    const symbolMatches = [
        ...prompt.matchAll(/\b([A-Z][A-Za-z0-9_]*\.[A-Za-z_]\w*)\b/g),
        ...prompt.matchAll(/\b(use[A-Z]\w*)\b/g),
        ...prompt.matchAll(/\b(TRTC[A-Za-z0-9_]+|TX[A-Za-z0-9_]+)\b/g),
    ];
    for (const match of symbolMatches) {
        const symbol = match[1];
        for (const chunk of pool) {
            if (chunk.symbols.includes(symbol)) {
                const amount = e2BoostedFiles.has(chunk.source) ? 50 : 100;
                addBoost(chunk, amount, `E4:${symbol}`);
            }
        }
    }
    // push 综述 boost——当用户问 push 综述类问题时把 overview/prepare.md 顶到前列。
    // 关键词分两类：
    //   (1) prepare.md 标题语义：开通服务 / 接入流程 / 厂商配置 / SDK 接入 / 高级功能
    //   (2) 自然入口问法：准备工作 / 前置 / 前提 / 注意事项 / 是什么 / 计费
    // 否则 BM25 会把各平台 integration.md 顶上来（"步骤/集成"等词在多平台文档高频）。
    if (norm.product?.includes('push')) {
        // 排除「具体错误码 query」——「错误码 6014 是什么」的「是什么」误触发综述意图，
        // +150 把接入前准备顶过错误码表。带 4+ 位数字或「错误码」的 query 找的是错误码表，不是综述。
        const hasErrorCodeIntent = /\d{4}/.test(prompt) || /错误码|error\s*code/i.test(prompt);
        const isOverviewIntent = !hasErrorCodeIntent
            && /开通|创建\s*Push|创建应用|SDKAppID|控制台|数据中心|接入流程|接入推送|厂商配置|SDK\s*接入|高级功能|准备工作|准备|前置|前提|注意事项|是什么|介绍|计费/i.test(prompt);
        if (isOverviewIntent) {
            for (const chunk of pool) {
                if (chunk.product === 'push' && chunk.doc_title === '接入前准备') {
                    addBoost(chunk, 150, 'E5.5:push-overview');
                }
            }
        }
        // push 厂商精确命中——prompt 提到具体厂商时，把对应厂商配置文档顶到前列
        // 否则 BM25 会被 integration/donut.md 这类高密度多语言文档顶掉真正相关的厂商配置文档
        const VENDOR_MAP = {
            huawei: { re: /华为|huawei|hms|harmonyconnect/i, docTitle: '华为' },
            xiaomi: { re: /小米|xiaomi|miui|mipush/i, docTitle: '小米' },
            oppo: { re: /\boppo\b|colorpush/i, docTitle: 'OPPO' },
            vivo: { re: /\bvivo\b|vpush/i, docTitle: 'vivo' },
            honor: { re: /荣耀|honor/i, docTitle: '荣耀' },
            meizu: { re: /魅族|meizu|flymepush/i, docTitle: '魅族' },
            fcm: { re: /\bfcm\b|google\s*推送|firebase/i, docTitle: 'Google FCM' },
        };
        for (const [vendor, { re, docTitle }] of Object.entries(VENDOR_MAP)) {
            if (!re.test(prompt))
                continue;
            for (const chunk of pool) {
                if (chunk.product === 'push' && chunk.doc_title === docTitle) {
                    addBoost(chunk, 120, `E5.6:push-vendor:${vendor}`);
                }
            }
        }
    }
    // chat faq——types=faq 时，integration 类 chat chunk 降权，其余 chat chunk 加权
    if ((norm.types ?? []).includes('faq') && norm.product?.includes('chat')) {
        for (const chunk of pool) {
            if (chunk.product !== 'chat')
                continue;
            if ((chunk.types ?? []).includes('integration')) {
                addBoost(chunk, -120, 'E9:chat-faq:penalize-integration');
            }
            else {
                addBoost(chunk, 100, 'E9:chat-faq:knowledge');
            }
        }
    }
    // room best-practice 召回补偿
    // 背景：room 语料 scope 已重构为 platform_common/platform_specific（原 room:core-sdk/room:preset 已废弃），
    // core/preset 消歧的 scope 匹配已失效，best-practice 跨平台 FAQ 需显式补偿才能顶到前列。
    if (norm.product?.includes('room') && norm.frameworks?.length) {
        const platform = norm.frameworks.find((fw) => ['android', 'ios', 'flutter', 'vue'].includes(fw));
        if (platform) {
            // 三层加分（可叠加）：
            //   1) 广谱 +80：所有 room best-practice chunk 统一 +80；
            //   2) 平台匹配 +40：chunk.framework 与当前 platform 有交集（含 web/common 兼容项）；
            //   3) 同义问法命中 +200：读源文件解析「同义问法覆盖」条目，query 命中任一问法 → +200。
            // 参考 callkit 同类的 +260~+300 精准 boost，room 这里用略低的 +200 尊重现有排序。
            const bpChunks = pool.filter((c) => c.product === 'room' && c.source.includes('/best-practice/'));
            // Source → 同义问法条目缓存（同一 source 下多 chunk 共用文件级问法）
            const bpSynonymsBySource = new Map();
            const extractSynonyms = (source) => {
                if (bpSynonymsBySource.has(source))
                    return bpSynonymsBySource.get(source);
                let full = '';
                try {
                    full = getSourceFileContent(source);
                }
                catch {
                    full = '';
                }
                const lines = full.split('\n');
                const list = [];
                let inSection = false;
                for (const line of lines) {
                    // 允许 "## 8. xxx" 或 "## 同义问法..." 两种标题格式
                    if (/^##\s+(8\.\s*)?同义问法/.test(line)) {
                        inSection = true;
                        continue;
                    }
                    if (inSection && /^##\s+/.test(line))
                        break;
                    if (inSection) {
                        const item = line.match(/^-\s+(.+?)[?？]?$/);
                        if (item)
                            list.push(item[1].trim());
                    }
                }
                bpSynonymsBySource.set(source, list);
                return list;
            };
            // 平台兼容集：query platform 命中 chunk.framework 里的这些标签均视为匹配
            // vue → [vue, web, common, react]（跨平台 web 类问法通常写作 react/vue/web）
            // react → [react, web, common, vue]
            // android/ios/flutter → [self, common]
            const platformCompat = {
                vue: ['vue', 'web', 'common', 'react'],
                react: ['react', 'web', 'common', 'vue'],
                android: ['android', 'common'],
                ios: ['ios', 'common'],
                flutter: ['flutter', 'common'],
            };
            const compatSet = new Set(platformCompat[platform] ?? [platform, 'common']);
            // query 归一化：小写 + 去空格，用于宽松包含匹配（问法通常是短句）
            const promptForMatch = prompt.toLowerCase().replace(/\s+/g, '');
            for (const chunk of bpChunks) {
                // 1) 广谱 +80
                addBoost(chunk, 80, 'E10.5:room-bp');
                // 2) 平台匹配 +40
                const frameworkMatch = (chunk.framework ?? []).some((fw) => compatSet.has(fw));
                if (frameworkMatch) {
                    addBoost(chunk, 40, `E10.5:room-bp-platform:${platform}`);
                }
                // 3) 同义问法命中 +200（同 source 只算一次，避免同文件多 chunk 重复加）
                const synonyms = extractSynonyms(chunk.source);
                if (synonyms.length === 0)
                    continue;
                const hit = synonyms.some((q) => {
                    const normQ = q.toLowerCase().replace(/\s+/g, '');
                    if (normQ.length < 4)
                        return false;
                    // 双向宽松匹配：query 包含问法（短问法命中长 query），或问法包含 query（罕见，防守）
                    return promptForMatch.includes(normQ) || normQ.includes(promptForMatch);
                });
                if (hit) {
                    addBoost(chunk, 200, `E10.5:room-bp-synonym`);
                }
                else {
                    // 退化匹配：若整句问法未匹配，用问法内 4+ 长中文/英文子串扫描
                    // 覆盖 "整屏共享怎么避免无限镜像" vs "分享屏幕出现无限套娃" 这类只共享部分词汇的情况
                    const keywords = new Set();
                    for (const q of synonyms) {
                        const zhTokens = q.match(/[\u4e00-\u9fff]{2,}/g) ?? [];
                        for (const t of zhTokens)
                            if (t.length >= 2)
                                keywords.add(t);
                    }
                    let matchedKeywordCount = 0;
                    for (const kw of keywords) {
                        if (promptForMatch.includes(kw.toLowerCase()))
                            matchedKeywordCount += 1;
                        if (matchedKeywordCount >= 2)
                            break;
                    }
                    if (matchedKeywordCount >= 2) {
                        addBoost(chunk, 120, `E10.5:room-bp-keywords`);
                    }
                }
            }
        }
    }
    // 精确标识符命中 → 硬提权。
    //
    // 生产数据实测：22.3% 的失败是「黄金文档 BM25 在 4~20 名但没进 top3」，
    // 根因是精确 API 名/错误码命中只走 BM25（identifier 被压成粘连小写词）与 generic-rerank
    // 的 W_ANCHOR=40 小额加分，敌不过长文档靠通用词堆出的 BM25 分。
    //
    // 这里改成：query 里的 API 形态 token 命中 chunk 的 api_names / symbols / error_codes
    // （或正文精确串），直接给远大于 BM25 区间（top 分约 20~50）的 boost。
    // 按命中标识符数量与区分度递增，多命中 > 单命中。
    const queryApiTokens = inferQueryApiTokens(prompt);
    if (queryApiTokens.length > 0) {
        const lowered = queryApiTokens.map((t) => t.toLowerCase());
        for (const chunk of pool) {
            const nameSet = new Set();
            for (const n of chunk.api_names ?? [])
                nameSet.add(n.toLowerCase());
            for (const n of chunk.symbols ?? [])
                nameSet.add(n.toLowerCase());
            for (const n of chunk.error_codes ?? [])
                nameSet.add(n.toLowerCase());
            let hits = 0;
            const hitNames = [];
            for (const t of lowered) {
                if (nameSet.has(t)) {
                    hits += 1;
                    hitNames.push(t);
                }
            }
            if (hits > 0) {
                // 单命中 260（高于 E1 错误码 200，因为这是 query 主动点名的标识符）；
                // 每多命中一个再 +80，上限 3 个，避免长 query 无限叠加。
                //
                // 权重敏感性实测：
                //   120 / 180 / 260 → hit@1 22.2%、hit@3 37.0%、hit@5 40.7%（完全一致，安全平台区）
                //   400            → hit@3 33.3%、hit@5 37.0%（劣化：总览/错误码表类文档开始抢占）
                // 260 位于平台区上沿，保留裕度但不越界；上调需重跑本评测。
                const amount = 260 + Math.min(hits - 1, 2) * 80;
                addBoost(chunk, amount, `E16:symbol:${hitNames.slice(0, 3).join(',')}`);
            }
        }
    }
    return { boosts, exactHits };
}
