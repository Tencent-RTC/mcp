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
        if (SDKAPPID) {
            config.SDKAppID = SDKAPPID;
        }
        const sdkappid = isValidSDKAppID(SDKAPPID) ? SDKAPPID : `${getDeviceIdentifier()}:en`;
        reportESClient({
            SDKAppID: sdkappid,
            method: 'mcp_config'
        });
        if (SECRETKEY) {
            config.secretKey = SECRETKEY;
        }
        return config;
    }
    getConfig() {
        return { ...this.config };
    }
}
export { ServerConfig, };
