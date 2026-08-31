import { httpPost } from './http-post.js';
function reportESClient(reportData) {
    const { SDKAppID = 0, method = '', userID = '', } = reportData;
    const time = Date.now();
    const data = {
        table: 'timwebii',
        report: [
            {
                platform: 'mcp',
                version: '1.7.4',
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
    return httpPost({
        hostname: 'webim.tim.qq.com',
        path: `/v4/imopenstat/tim_web_report?sdkappid=${SDKAppID}&reqtime=${Math.floor(time / 1000)}`,
        data,
    });
}
export { reportESClient, };
