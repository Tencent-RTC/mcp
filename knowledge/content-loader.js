import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fileCache = new Map();
function resolveResourceRoot() {
    // 运行时读 md 源目录（与 knowledge/ 同级的 resource/）：
    //   npm 包：<pkg>/knowledge/  →  <pkg>/resource/
    //   本地：  dist/knowledge/   →  dist/resource/（依赖 build 时 copy-resource.js）
    return path.resolve(__dirname, '../resource');
}
function readSourceFile(source) {
    const cached = fileCache.get(source);
    if (cached !== undefined)
        return cached;
    const abs = path.join(resolveResourceRoot(), source);
    const text = fs.readFileSync(abs, 'utf-8');
    fileCache.set(source, text);
    return text;
}
export function getSourceFileContent(source) {
    return readSourceFile(source);
}
/** 按 build 时写入的 char 偏移从 md 源文件切片（方案 B：manifest 不存 content） */
export function getChunkContent(chunk) {
    const full = readSourceFile(chunk.source);
    return full.slice(chunk.char_start, chunk.char_end);
}
export function attachChunkContent(chunk) {
    return { ...chunk, content: getChunkContent(chunk) };
}
/** 预读 pool 涉及的唯一 source，再批量挂载 content（供 BM25 与 fragments 使用） */
export function attachPoolContent(pool) {
    for (const source of new Set(pool.map((chunk) => chunk.source))) {
        readSourceFile(source);
    }
    return pool.map((chunk) => attachChunkContent(chunk));
}
export function clearContentCache() {
    fileCache.clear();
}
