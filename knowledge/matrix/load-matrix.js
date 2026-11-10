import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
let cached = null;
let cachedMtimeMs = 0;
function resolveMatrixPath() {
    // After compilation this file lives at dist/knowledge/matrix/ -> ../../resource/knowledge/matrix.json
    return path.resolve(__dirname, '../../resource/knowledge/matrix.json');
}
/**
 * Load the package/billing knowledge matrix (in-process cache + mtime check, auto-invalidated
 * after resources are rebuilt). Returns null (never throws) if the file is missing or fails to
 * parse, so callers degrade to a fixed fallback message instead of crashing the process when
 * matrix.json isn't ready in production.
 */
export function loadPackageMatrix() {
    const p = resolveMatrixPath();
    if (!fs.existsSync(p)) {
        console.warn('[load-matrix] matrix.json is missing, package queries fall back to uncovered');
        return null;
    }
    const mtime = fs.statSync(p).mtimeMs;
    if (cached && mtime === cachedMtimeMs)
        return cached;
    try {
        cached = JSON.parse(fs.readFileSync(p, 'utf-8'));
        cachedMtimeMs = mtime;
    }
    catch (err) {
        console.warn('[load-matrix] failed to parse matrix.json, package queries fall back to uncovered:', err);
        return null;
    }
    return cached;
}
