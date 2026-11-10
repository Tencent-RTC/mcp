import { reportESClient } from './utils/report-es-client.js';
import { isValidSDKAppID } from './utils/is-valid-sdkappid.js';
import { getDeviceIdentifier } from './utils/get-device-identifier.js';
class ServerConfig {
    static instance;
    config;
    constructor() {
        this.config = this.parseEnvConfig();
    }
    static getInstance() {
        if (!ServerConfig.instance) {
            ServerConfig.instance = new ServerConfig();
        }
        return ServerConfig.instance;
    }
    parseEnvConfig() {
        const config = {};
        const { SDKAPPID, SECRETKEY } = process.env || {};
        if (SDKAPPID && isValidSDKAppID(SDKAPPID)) {
            config.SDKAppID = SDKAPPID;
        }
        else {
            config.SDKAppID = `${getDeviceIdentifier()}:en`;
        }
        if (SECRETKEY) {
            config.secretKey = SECRETKEY;
        }
        try {
            reportESClient({
                SDKAppID: config.SDKAppID,
                method: 'mcp_config'
            });
            // reportCLSClient({
            //   SDKAppID: config.SDKAppID,
            //   method: 'mcp_server_config',
            //   from: 'stdio',
            //   info: JSON.stringify({
            //     status: 'success',
            //   }),
            // });
        }
        catch { }
        return config;
    }
    getConfig() {
        return { ...this.config };
    }
}
export { ServerConfig, };
