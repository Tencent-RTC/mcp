import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { splitChildChunks } from '../chunker.js';
import { attachPoolContent } from '../content-loader.js';
import { chunkSearchText } from '../bm25.js';
import { embedTexts } from './embed-model.js';
import { allIndexPath } from './vector-index.js';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RESOURCE_ROOT = path.resolve(__dirname, '../../resource');
const BATCH = 32;
function loadManifest() {
    const p = path.join(RESOURCE_ROOT, 'index', 'manifest.json');
    const m = JSON.parse(fs.readFileSync(p, 'utf-8'));
    return m.chunks;
}
/** chunk 内容指纹：offset / title / doc_title / nav_path / tags 变化即视为内容变化，触发重算。
 *  追加嵌入文本模板标记（面包屑开关，bm25.ts BREADCRUMB）——模板变化改变 chunkSearchText
 *  输出，但 manifest 元数据不变，指纹不感知会导致「up-to-date」假阳性。
 *  zh 固化 'bc'（带面包屑）；en 由 sync-code locale patch 翻转为 'nobc'。 */
function fingerprint(chunk) {
    const nav = (chunk.nav_path ?? []).join('/');
    const tags = (chunk.tags ?? []).join(',');
    const embedTemplate = 'nobc';
    return `${chunk.source}:${chunk.char_start}:${chunk.char_end}:${chunk.title}:${chunk.doc_title ?? ''}:${nav}:${tags}:${embedTemplate}`;
}
/**
 * 子块 vectra 主键（唯一）：父块 id + 子块绝对 char_start。
 * 子块=父块整体（父块 ≤512 token）时 char_start 退化为父块 char_start，主键与旧父块主键一致，
 * 保证「小父块不切子块」的向量 key 稳定、增量复用。
 */
function childVectorKey(parent, childCharStart) {
    return `${parent.id}@${childCharStart}`;
}
/** 子块内容指纹：父块指纹 + 子块 char 范围（父块元数据/切分位置任一变化均触发重算）。 */
function childFingerprint(parent, childCharStart, childCharEnd) {
    return `${fingerprint(parent)}:${childCharStart}:${childCharEnd}`;
}
/** product 小写归一：容忍数据源大小写不一致（如 livekit faq 的 'Live' vs 'live'），
 * 与 vector-index.queryVectors 的归一保持一致，避免向量召回因大小写漏检。*/
function normalizedProduct(chunk) {
    return (chunk.product || '*').toLowerCase();
}
/**
 * 增量构建单一全局向量库（父子块：向量索引只含「子块」，≤512 token，消除向量截断）：
 * - 子块是父块 content 的确定性函数（splitChildChunks），构建期临时切分、不落盘。
 * - 已存在且子块指纹一致 → 跳过；新增/指纹变化 → 重新编码 upsert。
 * - manifest 已删除的父块，其全部子块 key 不在 wantKeys → 从索引 delete。
 * - metadata.chunk_id / parent_id 存父块 id，供运行期「子块 → 父块」映射。
 */
export async function buildVectors() {
    const chunks = loadManifest();
    console.warn(`[build-vectors] ${chunks.length} chunks (single global index)`);
    // vectra 是 optionalDependency，构建期由 maybe-build-vectors.js 判定开关后才进入，
    // 这里改为动态 import，避免直接误跑本脚本时在模块解析阶段抛错。
    const { LocalIndex } = await import('vectra');
    const idx = new LocalIndex(allIndexPath());
    if (!(await idx.isIndexCreated())) {
        await idx.createIndex({ version: 1, deleteIfExists: false });
    }
    // 现有条目：vectorKey → fingerprint
    const existing = new Map();
    for (const item of await idx.listItems()) {
        const key = String(item.metadata.vkey ?? item.metadata.chunk_id);
        existing.set(key, String(item.metadata.fp ?? ''));
    }
    // 全量读 content → 切子块
    const withContent = attachPoolContent(chunks);
    const children = [];
    for (const c of withContent) {
        for (const child of splitChildChunks(c.content, c.id, c.char_start)) {
            children.push({ parent: c, child });
        }
    }
    const wantKeys = new Set(children.map(({ parent, child }) => childVectorKey(parent, child.char_start)));
    const toEncode = children.filter(({ parent, child }) => existing.get(childVectorKey(parent, child.char_start)) !== childFingerprint(parent, child.char_start, child.char_end));
    const toDelete = [...existing.keys()].filter((key) => !wantKeys.has(key));
    if (toDelete.length > 0) {
        // vectra 0.14.x 无批量 deleteItems，逐个删除（增量删除数量少，可接受）
        for (const key of toDelete) {
            await idx.deleteItem(key);
        }
    }
    if (toEncode.length === 0) {
        console.warn(`[build-vectors] up-to-date (${children.length} children, +0/-${toDelete.length})`);
        return;
    }
    // 子块嵌入文本：继承父块标题/路径上下文，正文用子块片段
    const texts = toEncode.map(({ parent, child }) => chunkSearchText({ ...parent, content: child.text }));
    await idx.beginUpdate();
    try {
        for (let i = 0; i < texts.length; i += BATCH) {
            const batch = toEncode.slice(i, i + BATCH);
            const vectors = await embedTexts(texts.slice(i, i + BATCH));
            for (let j = 0; j < batch.length; j += 1) {
                const { parent, child } = batch[j];
                await idx.upsertItem({
                    id: childVectorKey(parent, child.char_start),
                    vector: Array.from(vectors[j]),
                    metadata: {
                        chunk_id: parent.id,
                        parent_id: parent.id,
                        vkey: childVectorKey(parent, child.char_start),
                        fp: childFingerprint(parent, child.char_start, child.char_end),
                        product: normalizedProduct(parent),
                    },
                });
            }
        }
        await idx.endUpdate();
    }
    catch (e) {
        idx.cancelUpdate();
        throw e;
    }
    console.warn(`[build-vectors] +${toEncode.length}/-${toDelete.length} (total ${children.length} children)`);
    console.warn('[build-vectors] done');
}
