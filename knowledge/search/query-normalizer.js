import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCHEMA_ROOT = path.resolve(__dirname, '../../resource/_schema');
const QUERY_NORMALIZATION_FILE = path.join(SCHEMA_ROOT, 'query-normalization.yaml');
const MAX_APPEND_TOKENS = 6;
const BASE_QUERY_NORMALIZATION = {
    literal: {
        登录: ['login', 'signin', 'authentication', 'auth'],
        鉴权: ['authentication', 'auth', 'usersig'],
        错误码: ['error', 'error code', 'code'],
        重复登录: ['repeat login', 'multi-device login', 'login policy'],
        单聊: ['one-to-one', 'c2c', 'single chat'],
        群聊: ['group chat', 'group message'],
        直播群: ['avchatroom'],
        直播间: ['avchatroom', 'live room'],
        丢消息: ['message loss', 'reliability', 'priority'],
        消息丢失: ['message loss', 'reliability', 'priority'],
        重要消息: ['priority', 'high priority', 'critical message'],
        用户: ['user', 'account'],
        消息: ['message', 'messages'],
        userSig: ['usersig', 'auth', 'authentication'],
        AVChatRoom: ['直播群'],
        'error code': ['错误码', '错误', 'code'],
        'repeat login': ['重复登录', '多端登录', 'login policy'],
        'one-to-one': ['单聊', 'c2c', 'single chat'],
    },
    word: {
        login: ['登录', '鉴权', 'authentication', 'auth'],
        auth: ['鉴权', '登录', 'authentication'],
        authentication: ['鉴权', '登录', 'auth'],
        usersig: ['userSig', '鉴权', '登录'],
        error: ['错误', '错误码', 'error code'],
        code: ['错误码', 'error code'],
        message: ['消息', 'chat', 'conversation'],
        messages: ['消息', 'chat', 'conversation'],
        group: ['群组', '群聊', 'group chat'],
        c2c: ['单聊', 'one-to-one', 'single chat'],
        avchatroom: ['直播群'],
        priority: ['重要消息', '优先级'],
        reliability: ['消息可靠性'],
        'message loss': ['丢消息', '消息丢失'],
        'rate limit': ['限频', '刷屏'],
    },
};
let cachedConfig = null;
function unquote(input) {
    return input.trim().replace(/^['"]|['"]$/g, '');
}
function loadQueryNormalizationConfig() {
    if (cachedConfig)
        return cachedConfig;
    const config = {
        literal: { ...BASE_QUERY_NORMALIZATION.literal },
        word: { ...BASE_QUERY_NORMALIZATION.word },
    };
    if (!fs.existsSync(QUERY_NORMALIZATION_FILE)) {
        cachedConfig = config;
        return config;
    }
    const text = fs.readFileSync(QUERY_NORMALIZATION_FILE, 'utf-8');
    let currentSection = '';
    for (const rawLine of text.split('\n')) {
        const line = rawLine.trimEnd();
        if (!line.trim() || line.trimStart().startsWith('#'))
            continue;
        const sectionMatch = line.match(/^(literal|word):\s*$/);
        if (sectionMatch) {
            currentSection = sectionMatch[1];
            continue;
        }
        const entryMatch = line.match(/^\s{2}([^:#]+):\s*\[(.*)\]\s*$/);
        if (!entryMatch || !currentSection)
            continue;
        const key = unquote(entryMatch[1]);
        const values = entryMatch[2]
            .split(',')
            .map((token) => unquote(token))
            .filter(Boolean);
        if (!key || !values.length)
            continue;
        config[currentSection][key] = values;
    }
    cachedConfig = config;
    return config;
}
function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function hasCjk(text) {
    return /[\u4e00-\u9fff]/.test(text);
}
function hasWordMatch(prompt, promptLower, needle) {
    const normalizedNeedle = needle.toLowerCase();
    if (hasCjk(normalizedNeedle)) {
        return prompt.includes(needle);
    }
    const pattern = new RegExp(`\\b${escapeRegExp(normalizedNeedle)}\\b`, 'i');
    return pattern.test(promptLower);
}
export function normalizeQueryPrompt(prompt) {
    const config = loadQueryNormalizationConfig();
    const terms = new Set(prompt.split(/\s+/).filter(Boolean));
    const promptLower = prompt.toLowerCase();
    // 纯 EN 提问时跳过 CJK 注入：query expansion 的 CJK 翻译（群组/群聊/回调 等）
    // 会进入 qCjk 触发「混合 query 只走 CJK 路径」分支，导致纯 EN title 行（CJK 路径
    // 返回 0）失去 E7 boost，BM25 排名错误。典型回归：webhook 行「X webhook」全部
    // 被「Before create group webhook」抢首位（+7 row top1 退化）。
    // zh 端几乎都是 CJK 提问 → isPureEn=false → 行为完全不变。
    const isPureEn = !hasCjk(prompt);
    let appendedCount = 0;
    const tryAppend = (tokens) => {
        for (const token of tokens) {
            if (appendedCount >= MAX_APPEND_TOKENS)
                return;
            if (!terms.has(token)) {
                if (isPureEn && hasCjk(token))
                    continue;
                terms.add(token);
                appendedCount += 1;
            }
        }
    };
    for (const [needle, expansion] of Object.entries(config.literal)) {
        if (!prompt.includes(needle))
            continue;
        tryAppend(expansion);
    }
    for (const [needle, expansion] of Object.entries(config.word)) {
        if (!hasWordMatch(prompt, promptLower, needle))
            continue;
        tryAppend(expansion);
    }
    return [...terms].join(' ');
}
