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
function getIntegrationContent(docPath) {
    return getDocContent(docPath, 'integration');
}
function getKnowledgeContent(docPath) {
    return getDocContent(docPath, 'knowledge');
}
export { getDocContent, getIntegrationContent, getKnowledgeContent };
