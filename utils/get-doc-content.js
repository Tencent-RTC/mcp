import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { reportCLSClient } from './report-cls-client.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
/**
 * 获取文档内容
 * @param docPath 相对 resource/{root}/ 的路径段
 * @param root integration | knowledge，默认 knowledge
 */
function getDocContent(docPath, root = 'knowledge') {
    const base = path.resolve(__dirname, `../resource/${root}`);
    const docFilePath = path.join(base, ...docPath);
    try {
        const stats = fs.statSync(docFilePath);
        if (stats.isFile()) {
            return fs.readFileSync(docFilePath, 'utf-8');
        }
        if (stats.isDirectory()) {
            const files = fs.readdirSync(docFilePath, { withFileTypes: true });
            let docContent = '';
            for (const file of files) {
                if (file.isFile() && file.name.endsWith('.md')) {
                    const filePath = path.join(docFilePath, file.name);
                    const content = fs.readFileSync(filePath, 'utf-8');
                    docContent += `\n\n## ${file.name}\n\n${content}`;
                }
            }
            if (docContent.trim()) {
                return `Document\n${docContent}`;
            }
            return 'Not found relevant documents';
        }
    }
    catch (error) {
        reportCLSClient({
            method: 'calling_tool_error',
            info: error ? JSON.stringify(error) : '',
        });
        return 'Not found relevant documents';
    }
    return 'Not found relevant documents';
}
/**
 * 按逻辑名（别名）读取文档原文。
 * 运行时只读 dist/resource/index/doc-registry.json（build 产物），不读 sync/。
 * 任一步缺失（doc-registry 不存在 / 别名不存在 / nodeId 不存在 / 文件不存在）返回 'Not found relevant documents'。
 * 返回文件原文，不剥离、不处理 frontmatter（D27）。
 */
function getDocByAlias(alias) {
    const registryPath = path.resolve(__dirname, '../resource/index/doc-registry.json');
    let registry;
    try {
        registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
    }
    catch (error) {
        reportCLSClient({
            method: 'calling_tool_error',
            info: error ? JSON.stringify(error) : '',
        });
        return 'Not found relevant documents';
    }
    const nodeId = registry?.aliases?.[alias];
    if (!nodeId)
        return 'Not found relevant documents';
    const localPath = registry?.byNodeId?.[nodeId];
    if (!localPath)
        return 'Not found relevant documents';
    const abs = path.resolve(__dirname, '../resource', localPath);
    try {
        if (fs.statSync(abs).isFile()) {
            return fs.readFileSync(abs, 'utf-8');
        }
    }
    catch (error) {
        reportCLSClient({
            method: 'calling_tool_error',
            info: error ? JSON.stringify(error) : '',
        });
    }
    return 'Not found relevant documents';
}
export { getDocContent, getDocByAlias };
