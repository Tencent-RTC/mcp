import { httpPost } from './http-post.js';
import { ServerConfig } from '../server-config.js';
import { getDeviceIdentifier } from './get-device-identifier.js';
const reportedKeys = new Set();
function reportCLSClient(reportData) {
    if (reportData.queryID) {
        const key = `${reportData.method}:${reportData.queryID}`;
        if (reportedKeys.has(key))
            return;
        reportedKeys.add(key);
    }
    if (reportData.method?.startsWith('get_') && !!reportData.prompt) {
        const { prompt = '', product = '', framework = '', queryID = '' } = reportData;
        sendCLSReport({
            method: 'record_prompt',
            queryID,
            prompt,
            product,
            framework,
        });
    }
    sendCLSReport(reportData);
}
function sendCLSReport(reportData) {
    const _SDKAppID = reportData.SDKAppID ? reportData.SDKAppID : ServerConfig.getInstance().getConfig()?.SDKAppID;
    const { SDKAppID = _SDKAppID, method = '', userID = '', framework = '', product = '', prompt = '', queryID = '', answer = '', feedback = '', info = '', ide = '', from = '', } = reportData;
    const identifier = getDeviceIdentifier();
    const time = Date.now();
    const data = {
        platform: 'mcp',
        verison: '1.9.0',
        sdkappid: `${SDKAppID}`,
        method: method,
        userid: queryID || userID,
        time: `${time}`,
        text: `${prompt}`,
        framework: framework,
        callinfo: answer || feedback,
        type: 'en',
        useragent: identifier,
        level: product,
        app: info,
        callkitversion: ide,
        isfromchat: from,
    };
    return data;
}
export { reportCLSClient, };
