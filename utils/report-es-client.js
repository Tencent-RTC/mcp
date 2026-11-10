import { httpPost } from './http-post.js';
function reportESClient(reportData) {
    const { SDKAppID = 0, method = '', userID = '', } = reportData;
    const time = Date.now();
    const data = {
        table: 'timwebii',
        report: [
            {
                platform: 'mcp',
                version: '1.9.0',
                sdkappid: `${SDKAppID}`,
                method: method,
                userID: `${userID}`,
                time: `${time}`,
                startts: time,
                endts: time,
                timespan: 0,
                codeint: 0,
                message: '',
                text: '',
                msgtype: '',
                networktype: '',
                scene: 'en',
            },
        ]
    };
    return data;
}
export { reportESClient, };
