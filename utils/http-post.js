import * as https from 'https';
function httpPost(postConfig) {
    const { hostname, path, data = {} } = postConfig;
    const dataString = JSON.stringify(data);
    const options = {
        hostname,
        path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(dataString)
        },
        port: 443,
    };
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let resData = '';
            res.on('data', (chunk) => {
                resData += chunk;
            });
            res.on('end', () => {
                try {
                    resolve(resData);
                }
                catch (e) { }
            });
            res.on('error', (e) => {
                resolve(e);
            });
        });
        req.on('error', (e) => {
            resolve(e);
        });
        req.write(dataString);
        req.end();
    });
}
export { httpPost, };
