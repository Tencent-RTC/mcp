import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getSourceFileContent } from '../content-loader.js';
import { computeCommonSectionTokens, isUrlMappingSource, normalizeUrlRowQuery, queryMatchesSection, scoreUrlRow } from './url-row-scorer.js';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCHEMA_ROOT = path.resolve(__dirname, '../../resource/_schema');
/**
 * 分组语义命中的基础分：当 scoreUrlRow=0 但该 url 行「分组被 query 命中 + types 匹配」时给予。
 * 取值需满足 E7 strongCandidates 门槛（typeMatch ×1.2 后 ≥500 → base ≥417）。
 * 只在「分组命中」时给（区别于旧的「所有 types 匹配行给 500」），避免无关行涌入。
 */
const SECTION_MATCH_BASE_SCORE = 450;
export const DOC_PATH_MAP = {
    android: {
        core_api: 'TRTCCloud',
        type_def: 'TRTCCloudDef',
        callback: 'TRTCCloudListener',
        statistics: 'TRTCStatistics',
        audio_effect: 'TXAudioEffectManager',
        beauty: 'TXBeautyManager',
        device: 'TXDeviceManager',
        error_code: 'TXLiteAVCode',
    },
    ios: {
        core_api: 'TRTCCloud',
        type_def: 'TXLiveSDKTypeDef',
        callback: 'TRTCCloudDelegate',
        statistics: 'TRTCStatistics',
        audio_effect: 'TXAudioEffectManager',
        beauty: 'TXBeautyManager',
        device: 'TXDeviceManager',
        error_code: 'TXLiteAVCode',
    },
    'c++': {
        core_api: 'ITRTCCloud',
        type_def: 'TRTCTypeDef',
        callback: 'TRTCCloudCallback',
        statistics: 'ITRTCStatistics',
        audio_effect: 'ITXAudioEffectManager',
        beauty: null,
        device: 'ITXDeviceManager',
        error_code: 'TXLiteAVCode',
    },
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
    if (/统计|网络质量|码率|帧率|statistics/.test(normalizedPrompt)) {
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
    return ['core_api', 'error_code'];
}
function loadJson(fileName, fallback) {
    const filePath = path.join(SCHEMA_ROOT, fileName);
    if (!fs.existsSync(filePath))
        return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}
function loadFeatureAliases() {
    const filePath = path.join(SCHEMA_ROOT, 'feature-aliases.yaml');
    if (!fs.existsSync(filePath))
        return {};
    const text = fs.readFileSync(filePath, 'utf-8');
    const result = {};
    let currentProduct = '';
    for (const line of text.split('\n')) {
        const productMatch = line.match(/^(\w+):$/);
        if (productMatch) {
            currentProduct = productMatch[1];
            result[currentProduct] = {};
            continue;
        }
        const aliasMatch = line.match(/^\s+([\w.-]+\.md):\s*\[(.+)\]/);
        if (aliasMatch && currentProduct) {
            const aliases = aliasMatch[2]
                .split(',')
                .map((s) => s.trim().replace(/^["']|["']$/g, ''))
                .filter(Boolean);
            result[currentProduct][aliasMatch[1]] = aliases;
        }
    }
    return result;
}
const ROOM_CORE_SIGNAL = /atomicx\s*core|atomicxcore|atomicx|core\s*sdk|no\s*ui|custom\s*ui|self\s*implement|roomstore|store|useRoomState|useDeviceState|useLoginState|无\s*ui|自定义\s*ui|自实现/i;
const ROOM_PRESET_SIGNAL = /preset|roommainview|roommainwidget|default\s*ui|main\s*page|预制|默认\s*ui|主页面|房间主页面/i;
const ROOM_FEATURE_SPECS = [
    {
        fileName: 'room-chat.md',
        titlePattern: /room\s*chat|in-room\s*im\s*chat|会中聊天|聊天能力|im\s*chat/i,
        promptPattern: /room\s*chat|会中聊天|in[- ]room\s*(im\s*)?chat|im\s*chat|messagelist|messageinput|messagestore|聊天面板|房间聊天/i,
    },
    {
        fileName: 'screen-share.md',
        titlePattern: /screen\s*share|屏幕分享/i,
        promptPattern: /screen\s*share|屏幕分享|共享屏幕|startScreenShare/i,
    },
    {
        fileName: 'virtual-background.md',
        titlePattern: /virtual\s*background|虚拟背景/i,
        promptPattern: /virtual\s*background|虚拟背景|背景虚化|背景替换|initVirtualBackground/i,
    },
    {
        fileName: 'room-view.md',
        titlePattern: /roomview|room\s*view|房间主视图|视频布局/i,
        promptPattern: /roomview|room\s*view|房间主视图|视频布局|画面布局|layoutTemplate/i,
    },
    {
        fileName: 'device-detection.md',
        titlePattern: /device\s*detection|设备检测|设备预览/i,
        promptPattern: /device\s*detection|设备检测|设备预览|startCameraTest|startMicrophoneTest|startSpeakerTest/i,
    },
    {
        fileName: 'device-state.md',
        titlePattern: /device\s*state|设备状态|设备管理/i,
        promptPattern: /device\s*state|设备状态|设备管理|摄像头|麦克风|扬声器|switchMirror|setCurrentCamera|networkInfo/i,
    },
    {
        fileName: 'free-beauty-panel.md',
        titlePattern: /free\s*beauty|美颜面板|基础美颜/i,
        promptPattern: /free\s*beauty|美颜面板|基础美颜|beauty/i,
    },
];
function detectRoomFeatureHits(prompt) {
    return ROOM_FEATURE_SPECS.filter((spec) => spec.promptPattern.test(prompt));
}
export function runExactLookup(prompt, pool, norm) {
    const boosts = {};
    const exactHits = [];
    const urlRowHitChunkIds = new Set();
    const lowerPrompt = prompt.toLowerCase();
    const addBoost = (chunk, amount, label) => {
        boosts[chunk.id] = (boosts[chunk.id] ?? 0) + amount;
        if (!exactHits.includes(label))
            exactHits.push(label);
    };
    const addPenalty = (chunk, amount) => {
        boosts[chunk.id] = (boosts[chunk.id] ?? 0) - Math.abs(amount);
    };
    // E1: error codes
    const errorMatches = [
        ...prompt.matchAll(/\b(\d{5,7})\b/g),
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
    // P1-3：跟踪 E2 已 boost 的文件，避免 E4 在同文件重复满额放大（双重 boost 会压垮 BM25 文件内排序）
    const e2BoostedFiles = new Set();
    // E2: native TRTC intents（只在传了 framework 时 boost；未传 framework 由 requires-framework 拦截）
    // 衰减策略：同文件首 chunk +100，第 2 个 +50，第 3 个 +25 ...（下限 +5），
    // 让 BM25 原始打分主导文件内方法级排序，避免「createSubCloud 顶掉 enterRoom」。
    if (norm.product?.includes('native_trtc_sdk') && norm.frameworks?.length) {
        const intents = inferNativeTRTCIntents(prompt);
        for (const fw of norm.frameworks) {
            const platformMap = DOC_PATH_MAP[fw];
            if (!platformMap)
                continue;
            for (const intent of intents) {
                const docName = platformMap[intent];
                if (!docName)
                    continue;
                const target = `knowledge/trtc/${fw}/${docName}.md`;
                // 收集同文件 chunks 按 char_start 排序（即文件内顺序）
                const fileChunks = pool
                    .filter((c) => c.source === target || c.source.endsWith(`/${docName}.md`))
                    .sort((a, b) => a.char_start - b.char_start);
                for (let i = 0; i < fileChunks.length; i += 1) {
                    const decay = Math.max(5, Math.floor(100 / Math.pow(2, i)));
                    addBoost(fileChunks[i], decay, `E2:${docName}`);
                    e2BoostedFiles.add(fileChunks[i].source);
                }
            }
        }
    }
    // E3: component slugs
    const componentSlugs = loadJson('../index/component-slugs.json', {});
    const indexPath = path.resolve(__dirname, '../../resource/index/component-slugs.json');
    const slugs = fs.existsSync(indexPath)
        ? JSON.parse(fs.readFileSync(indexPath, 'utf-8'))
        : componentSlugs;
    for (const [slug, aliases] of Object.entries(slugs)) {
        const hit = [slug, ...aliases].some((alias) => lowerPrompt.includes(alias.toLowerCase()));
        if (!hit)
            continue;
        for (const chunk of pool) {
            if (chunk.source.includes(`components/${slug}.md`) ||
                chunk.source.includes(`features/${slug}.md`)) {
                addBoost(chunk, 100, `E3:${slug}`);
            }
        }
    }
    // E4: symbols / Class.method
    // P1-3：若 chunk 所在文件已被 E2 boost，则 E4 减半（避免双重放大压制 BM25 内序）
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
    // E5: feature aliases
    const featureAliases = loadFeatureAliases();
    const productKey = norm.product?.includes('room') ? 'room'
        : norm.product?.includes('chat') ? 'chat'
            : norm.product?.includes('live') || !norm.product?.length ? 'live'
                : '';
    if (productKey && featureAliases[productKey]) {
        for (const [fileName, aliases] of Object.entries(featureAliases[productKey])) {
            const hit = aliases.some((alias) => lowerPrompt.includes(alias.toLowerCase()) || lowerPrompt.includes(fileName.replace('.md', '')));
            if (!hit)
                continue;
            for (const chunk of pool) {
                if (chunk.source.endsWith(fileName)) {
                    addBoost(chunk, 100, `E5:${fileName}`);
                }
            }
        }
    }
    if (norm.scenario === 'voice') {
        for (const chunk of pool) {
            if (chunk.source.includes('/voice/') && /co-guest|上麦/.test(lowerPrompt)) {
                if (chunk.source.includes('voice-co-guest-interaction')) {
                    addBoost(chunk, 120, 'E5:voice-co-guest');
                }
            }
        }
    }
    // E5.5: push overview boost——当用户问 push 综述类问题时把 overview/prepare.md 顶到前列。
    // 关键词分两类：
    //   (1) prepare.md 标题语义：开通服务 / 接入流程 / 厂商配置 / SDK 接入 / 高级功能
    //   (2) 自然入口问法：准备工作 / 前置 / 前提 / 注意事项 / 是什么 / 计费
    // 否则 BM25 会把各平台 integration.md 顶上来（"步骤/集成"等词在多平台文档高频）。
    if (norm.product?.includes('push')) {
        const isOverviewIntent = /开通|创建\s*Push|创建应用|SDKAppID|控制台|数据中心|接入流程|接入推送|厂商配置|SDK\s*接入|高级功能|准备工作|准备|前置|前提|注意事项|是什么|介绍|计费/i.test(prompt)
            || /\b(push\s+)?(overview|getting\s+started|prerequisites|billing|what\s+is\s+push)\b/i.test(prompt);
        if (isOverviewIntent) {
            for (const chunk of pool) {
                if (chunk.source.includes('knowledge/push/overview/')) {
                    addBoost(chunk, 150, 'E5.5:push-overview');
                }
            }
        }
        // E5.6: push 厂商精确命中——英文 push config 改为与写写一致的平台级页面：
        // Android 厂商配置集中在 config/android.md，iOS/APNs 集中在 config/ios.md。
        // 当 prompt 提到具体厂商时，把对应平台配置页顶到前列，避免被跨平台 integration 文档稀释。
        const ANDROID_VENDOR_PROMPT = /华为|huawei|hms|harmonyconnect|小米|xiaomi|miui|mipush|\boppo\b|colorpush|\bvivo\b|vpush|荣耀|honor|魅族|meizu|flymepush|\bfcm\b|google\s*推送|firebase/i;
        const IOS_VENDOR_PROMPT = /\bapns\b|apple\s*push|ios\s*certificate|p8\s*certificate|p12\s*certificate/i;
        if (ANDROID_VENDOR_PROMPT.test(prompt)) {
            for (const chunk of pool) {
                if (chunk.source === 'knowledge/push/config/android.md') {
                    addBoost(chunk, 260, 'E5.6:push-vendor:android');
                }
                if (chunk.source === 'knowledge/push/integration/android.md') {
                    addBoost(chunk, 60, 'E5.6:push-vendor:android-fallback');
                }
            }
        }
        if (IOS_VENDOR_PROMPT.test(prompt)) {
            for (const chunk of pool) {
                if (chunk.source === 'knowledge/push/config/ios.md') {
                    addBoost(chunk, 120, 'E5.6:push-vendor:ios');
                }
            }
        }
    }
    // E6: URL 映射文件 boost（L1；产品无关：任意 product 的 urls 均适用）
    const hasUrlChunks = pool.some((c) => isUrlMappingSource(c.source));
    if (hasUrlChunks) {
        if (/payload|usersig|authentication|auth|login|signature|登录|鉴权/i.test(prompt)) {
            for (const chunk of pool) {
                if (isUrlMappingSource(chunk.source)) {
                    addBoost(chunk, 100, 'E6:urls');
                }
            }
        }
        const errorCodeIntent = /错误码|\berror\s*code\b/i.test(prompt) || errorMatches.length > 0 || norm.searchIntent?.includes('error_code');
        if (errorCodeIntent) {
            for (const chunk of pool) {
                if (/\/error-code\.md$/i.test(chunk.source)) {
                    addBoost(chunk, 180, 'E6:error-code-url');
                }
            }
        }
        // E7: URL 映射表行级匹配（chunk.title = 子问题列）
        // 共享 scorer 按「REST 端点 > API token > 语义词对齐(IDF 加权)」打分。
        // 支持 types 领域限定：上游推断出 types 时，优先 types 匹配的子文件行，
        // 不匹配的行降权（避免跨域误命中，如 SDK 问题命中 restapi）。
        if (normalizeUrlRowQuery(prompt).replace(/\s+/g, '').length >= 2) {
            const candidates = [];
            const hasTypeFilter = Boolean(norm.searchIntent?.length);
            // 预收集 urls 行的分组结构：按 source 读整个 md 源文件，解析 `##` 分组与每行归属。
            // 分组粗筛对所有 urls 资源生效（产品无关），不针对 webhook.md 打补丁。
            const urlChunks = pool.filter((c) => isUrlMappingSource(c.source) && c.title.trim());
            const sectionByChunk = new Map(); // chunk.id -> 分组标题
            const sectionsBySource = new Map(); // source -> 分组标题集合
            const mdRowsBySource = new Map(); // source -> {行title -> 分组标题}
            for (const source of new Set(urlChunks.map((c) => c.source))) {
                let full = '';
                try {
                    full = getSourceFileContent(source);
                }
                catch {
                    full = '';
                }
                let cur = '';
                const rows = new Map();
                const sections = new Set();
                for (const line of full.split('\n')) {
                    const h = line.match(/^#{2,3}\s+(.+)$/);
                    if (h) {
                        cur = h[1].trim();
                        sections.add(cur);
                        continue;
                    }
                    const row = line.match(/^\|\s*([^|]+?)\s*\|\s*`(https?:[^`]+)`/);
                    if (row)
                        rows.set(row[1].trim(), cur);
                }
                mdRowsBySource.set(source, rows);
                sectionsBySource.set(source, sections);
            }
            for (const chunk of urlChunks) {
                const section = mdRowsBySource.get(chunk.source)?.get(chunk.title);
                if (section)
                    sectionByChunk.set(chunk.id, section);
            }
            // 计算每个 source 的共有词（该文件所有分组都出现的词）
            const commonTokensBySource = new Map();
            for (const [source, sections] of sectionsBySource) {
                commonTokensBySource.set(source, computeCommonSectionTokens([...sections]));
            }
            for (const chunk of urlChunks) {
                const scoreResult = scoreUrlRow(prompt, chunk.title);
                // types 领域限定：query types 与 chunk types 是否有交集
                const typeMatch = hasTypeFilter
                    ? (norm.searchIntent ?? []).some((t) => chunk.types.includes(t))
                    : true;
                // 分组粗筛：query 是否命中该 chunk 所在的分组。
                // 命中分组 → 正常；未命中分组 → 降权（不排除，避免 query 与分组名匹配不准时误杀）。
                const section = sectionByChunk.get(chunk.id);
                const commonTokens = commonTokensBySource.get(chunk.source);
                const sectionMatch = section && commonTokens
                    ? queryMatchesSection(prompt, section, commonTokens)
                    : true; // 无分组信息时不做粗筛（保持原行为）
                // 高 scoreUrlRow 兜底：scoreUrlRow ≥ 700 是极强语义信号（query 2-gram 全覆盖），
                // 此时不应被 sectionMatch 软降权压制。常见场景：短 query 如「群消息发送异常」
                // 跟 section 标题「群组系统回调」共享字符少（仅「群」），sectionMatch 失败，
                // 但 row title 本身完美匹配 user 意图，强行降权会让单聊 row 顶上。
                const highConfidence = scoreResult.score >= 700;
                // 分组语义命中基础分：scoreUrlRow 可能因「同义词/长句」对精确行打 0 分
                // （如「群消息发送前回调」vs「群内发言之前回调」），但分组已语义命中，
                // 给予基础分进入候选，避免该领域行被 score<=0 排除。
                // 区别于旧的「所有 types 匹配行给 500」——只在分组命中时才给，避免无关行涌入。
                if (scoreResult.score <= 0) {
                    if (sectionMatch && typeMatch) {
                        candidates.push({ chunk, score: SECTION_MATCH_BASE_SCORE, typeMatch, sectionMatch });
                    }
                    continue;
                }
                // finalScore 排序用：sectionMatch 失败且非高置信时，×0.7 软降权。
                // 高置信（scoreUrlRow ≥ 700）跳过降权，避免短 query + 长 section 标题时的误杀。
                const finalScore = (sectionMatch || highConfidence) ? scoreResult.score : scoreResult.score * 0.7;
                candidates.push({ chunk, score: finalScore, typeMatch, sectionMatch });
            }
            candidates.sort((a, b) => b.score - a.score);
            // types 匹配的行加分（更优先）；不匹配的行轻度降权但仍可兜底召回。
            // 避免上游 types 推断不准确时误杀正确文档（如「多端登录配置」被推断为 feature 而非 product）。
            const typeScored = candidates
                .map((c) => (c.typeMatch ? { ...c, score: c.score * 1.2 } : { ...c, score: c.score * 0.6 }))
                .filter(({ score }) => score >= 500);
            // 同分 row（典型：query「群消息撤回回调」时「撤回群消息」跟「单聊消息撤回」都 scoreUrlRow=660），
            // 按「query 字符集被 row title 覆盖比例」再排，覆盖更高的 row 排前。
            // 修 E7 boost idx=0 多 40 分的副作用：让字符集更精准的 row 拿 idx=0 → 300 分而不是 260 分。
            const queryChars = new Set(prompt.match(/[\u4e00-\u9fff]/g) ?? []);
            const charCoverage = (title) => {
                if (queryChars.size === 0)
                    return 0;
                const titleChars = new Set(title.match(/[\u4e00-\u9fff]/g) ?? []);
                let hit = 0;
                for (const ch of queryChars)
                    if (titleChars.has(ch))
                        hit += 1;
                return hit / queryChars.size;
            };
            const strongCandidates = typeScored
                .sort((a, b) => {
                // 优先按 typeScored score 降序；同分时按字符集覆盖率降序
                if (b.score !== a.score)
                    return b.score - a.score;
                return charCoverage(b.chunk.title) - charCoverage(a.chunk.title);
            })
                .slice(0, 12);
            strongCandidates.forEach(({ chunk, score }, idx) => {
                // 递减 boost：前两条更高，其余保持可召回但不过度压制 BM25
                const amount = idx === 0
                    ? 200 + Math.min(score, 100)
                    : idx === 1
                        ? 170 + Math.min(score, 90)
                        : Math.max(score >= 600 ? 150 : 90, 140 - idx * 8);
                addBoost(chunk, amount, `E7:url-row:${chunk.title}`);
                urlRowHitChunkIds.add(chunk.id);
            });
        }
    }
    // E9: chat faq — types=faq 时优先 knowledge/ 语料，避免 integration 文档内 FAQ 章节抢首位
    if (norm.searchIntent?.includes('faq') && norm.product?.includes('chat')) {
        const authPrompt = /auth|login|signature|usersig|鉴权|登录/i.test(prompt);
        for (const chunk of pool) {
            if (chunk.source.startsWith('knowledge/chat/')) {
                const urlBoost = authPrompt && chunk.source.includes('/urls/') ? 180 : 100;
                addBoost(chunk, urlBoost, 'E9:chat-faq:knowledge');
            }
            if (chunk.source.startsWith('integration/chat/')) {
                addBoost(chunk, -120, 'E9:chat-faq:penalize-integration');
            }
        }
    }
    // E10: RoomKit Core/Preset disambiguation + unsupported feature routing
    if (norm.product?.includes('room') && norm.frameworks?.length) {
        const platform = norm.frameworks.find((fw) => ['android', 'ios', 'flutter', 'vue'].includes(fw));
        const featureHits = detectRoomFeatureHits(prompt);
        const coreIntent = ROOM_CORE_SIGNAL.test(prompt) || !ROOM_PRESET_SIGNAL.test(prompt);
        const presetIntent = ROOM_PRESET_SIGNAL.test(prompt) && !ROOM_CORE_SIGNAL.test(prompt);
        if (platform) {
            const coreScope = `room:core-sdk:${platform}`;
            const presetScope = `room:preset:${platform}`;
            for (const chunk of pool) {
                if (chunk.product !== 'room')
                    continue;
                if (chunk.scope === coreScope) {
                    addBoost(chunk, 40, `E10:room-core-scope:${platform}`);
                    if (platform !== 'vue' && chunk.doc_kind === 'capability_matrix') {
                        addBoost(chunk, 120, `E10:room-matrix:${platform}`);
                    }
                }
                if (coreIntent && chunk.scope === presetScope) {
                    addPenalty(chunk, 120);
                }
                if (presetIntent && chunk.scope === coreScope && chunk.capability_status === 'unsupported') {
                    addPenalty(chunk, 180);
                }
            }
            for (const feature of featureHits) {
                for (const chunk of pool) {
                    if (chunk.product !== 'room')
                        continue;
                    if (platform === 'vue' && chunk.scope === coreScope && chunk.source.endsWith(feature.fileName)) {
                        addBoost(chunk, 220, `E10:room-vue-feature:${feature.fileName}`);
                    }
                    if (platform !== 'vue' && chunk.scope === coreScope) {
                        if (chunk.source.endsWith('unsupported-features.md') && feature.titlePattern.test(chunk.title)) {
                            addBoost(chunk, 280, `E10:room-unsupported:${platform}:${feature.fileName}`);
                        }
                        if (chunk.doc_kind === 'capability_matrix') {
                            addBoost(chunk, 120, `E10:room-matrix:${platform}:${feature.fileName}`);
                        }
                    }
                }
            }
        }
    }
    // E12/E13: CallKit type disambiguation + calls best-practice boost
    if (norm.product?.includes('call')) {
        const isStatusIntent = /statuschanged|\bstatus\b|callmediatype|media\s*type|通话状态|状态回调/i.test(prompt);
        const isStoreIntent = /callstatus|callrole|iuserinfo|storename\.?call|store|name\s*constant|enum\s*value|field\s*definition|字段定义/i.test(prompt);
        const isEngineInvitationIntent = /tuicallengine|on_call_received|call\s*invitation|incoming\s*call|accept\(|reject\(|accept\s*call|reject\s*call|inviteid|userData|邀请|来电|接听|拒接|信令/i.test(prompt);
        const isCallkitDiffIntent = /\bcall\s*vs\s*calls\b|\bcalls?\b|groupcall|tuicallkitapi\.calls|tuicallkitserver\.call|tuicallkitserver\.groupcall|\bv4(\.x)?\b|useridlist|chatgroupid|发起(单人|多人)?通话|呼叫|拨打/i.test(prompt);
        const isLogIntent = /setloglevel|log\s*level|disable\s*log|console\s*log|日志级别|关闭\s*log/i.test(prompt);
        for (const chunk of pool) {
            if (chunk.product !== 'call')
                continue;
            const source = chunk.source.toLowerCase();
            if (isStatusIntent && source.includes('knowledge/callkit/preset/vue/uikit-api-reference.md')) {
                addBoost(chunk, 180, 'E12:callkit-vue-status');
            }
            if (isStoreIntent && source.includes('knowledge/callkit/core-sdk/web/')) {
                addBoost(chunk, 220, 'E12:callkit-core-store');
            }
            if (isStoreIntent && source.includes('knowledge/callkit/preset/vue/')) {
                addPenalty(chunk, 80);
            }
            if (isEngineInvitationIntent && source.includes('knowledge/callkit/best-practice/web/callengine-invitation.md')) {
                addBoost(chunk, 300, 'E13A:callengine-invitation');
            }
            if (isEngineInvitationIntent && source.includes('knowledge/callkit/best-practice/web/callkit-call-vs-calls.md')) {
                addPenalty(chunk, 80);
            }
            if (isCallkitDiffIntent && source.includes('knowledge/callkit/best-practice/web/callkit-call-vs-calls.md')) {
                addBoost(chunk, 300, 'E13B:callkit-call-vs-calls');
            }
            if (isCallkitDiffIntent && source.includes('knowledge/callkit/best-practice/web/callengine-invitation.md')) {
                addPenalty(chunk, 80);
            }
            if (isCallkitDiffIntent && source.includes('knowledge/callkit/preset/vue/uikit-api-reference.md')) {
                addPenalty(chunk, 40);
            }
            if (isLogIntent && source.includes('knowledge/callkit/best-practice/web/callengine-log-control.md')) {
                addBoost(chunk, 260, 'E13:callengine-log-control');
            }
        }
    }
    return { boosts, exactHits, urlRowHitChunkIds: [...urlRowHitChunkIds] };
}
