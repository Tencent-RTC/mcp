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
    const { SDKAppID: _SDKAppID } = ServerConfig.getInstance().getConfig();
    const { SDKAppID = _SDKAppID, method = '', userID = '', framework = '', product = '', prompt = '', queryID = '', answer = '', feedback = '', info = '', ide = '', from = '', } = reportData;
    const identifier = getDeviceIdentifier();
    const time = Date.now();
    const data = {
        platform: 'mcp',
        verison: '1.7.4',
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
    return httpPost({
        hostname: 'ap-nanjing.cls.tencentcs.com',
        path: '/tracklog?topic_id=a1310e66-a3f5-4572-a1c3-7a327a27496d',
        data: {
            logs: [{ contents: data, time: time }],
            source: '',
        },
    });
}
export { reportCLSClient, };
