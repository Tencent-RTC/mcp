import * as TLSSigAPIv2 from '../libs/TLSSigAPIv2.js';
import { ServerConfig } from '../server-config.js';
// default expire time is 7 days
const DEFAULT_EXPIRE_TIME = 60 * 60 * 24 * 7;
function generateUserSig(userID) {
    const { SDKAppID, secretKey } = ServerConfig.getInstance().getConfig();
    const api = new TLSSigAPIv2.Api(parseInt(SDKAppID), secretKey);
    const userSig = api.genUserSig(userID, DEFAULT_EXPIRE_TIME);
    return { SDKAppID, userID, userSig };
}
export { generateUserSig };
