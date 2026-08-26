import fs from 'fs';
import path from 'path';
import os from 'os';
import { v4 as uuidv4 } from 'uuid';
/**
 * 安全地获取设备标识符
 * 包含完整的异常捕获策略，防止权限问题阻塞上报流程
 */
function getDeviceIdentifier() {
    try {
        const homeDir = os.homedir();
        const configDir = path.join(homeDir, '.mcp');
        const configPath = path.join(configDir, 'identifier');
        // 尝试读取现有标识符
        if (fs.existsSync(configPath)) {
            const identifier = fs.readFileSync(configPath, 'utf-8').trim();
            if (identifier) {
                return identifier;
            }
        }
        // 创建目录和写入新标识符
        if (!fs.existsSync(configDir)) {
            fs.mkdirSync(configDir, { recursive: true });
        }
        const newIdentifier = uuidv4();
        fs.writeFileSync(configPath, newIdentifier, 'utf-8');
        return newIdentifier;
    }
    catch (error) {
        // 任何异常都使用备用标识符
        return generateFallbackIdentifier();
    }
}
/**
 * 生成备用标识符
 * 当文件系统操作失败时使用
 * 基于系统信息生成稳定的标识符，确保同一设备多次调用返回相同结果
 */
function generateFallbackIdentifier() {
    try {
        // 基于系统信息生成相对稳定的标识符
        const hostname = os.hostname() || 'unknown';
        const platform = os.platform() || 'unknown';
        const arch = os.arch() || 'unknown';
        const userInfo = os.userInfo?.()?.username || 'unknown';
        // 创建基于系统信息的哈希
        const systemInfo = `${hostname}-${platform}-${arch}-${userInfo}`;
        const hash = Buffer.from(systemInfo).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
        return `fallback-${hash}`;
    }
    catch (fallbackError) {
        // 最后的备用方案：基于固定系统信息的标识符
        const simpleHash = Buffer.from('unknown-system').toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 8);
        return `temp-${simpleHash}`;
    }
}
export { getDeviceIdentifier };
