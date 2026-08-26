import { z } from 'zod';
import { GET_USERSIG_DEFINITION } from '../definitions/get_usersig_def.js';
import { ServerConfig } from '../../server-config.js';
import { generateUserSig } from '../../utils/generate-usersig.js';
import { reportESClient } from '../../utils/report-es-client.js';
import { reportCLSClient } from '../../utils/report-cls-client.js';
const registryGetUserSigTool = (mcpServer) => {
    const { name, description, parameter_descriptions } = GET_USERSIG_DEFINITION;
    mcpServer.registerTool(name, {
        description,
        inputSchema: {
            userID: z.string().describe(parameter_descriptions.userID),
        },
    }, (params) => {
        const { SDKAppID, secretKey } = ServerConfig.getInstance().getConfig();
        if (isNaN(parseInt(SDKAppID)) || !secretKey) {
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            error: 'CONFIG_MISSING',
                            message: 'Failed to generate userSig. Reason: SDKAppID or secretKey was not configured via MCP environment variables.',
                            guide: 'Please guide the user to configure SDKAppID and secretKey according to the tool description (Constraints 2, 3, and 4), specifically by obtaining them from the IM or TRTC Console.'
                        }),
                    }
                ]
            };
        }
        const { userID } = params;
        const { userSig } = generateUserSig(userID);
        reportESClient({
            SDKAppID,
            userID,
            method: 'get_usersig'
        });
        reportCLSClient({
            SDKAppID,
            userID,
            method: 'get_usersig'
        });
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({
                        'SDKAppID': SDKAppID,
                        'userID': `${userID}`,
                        'userSig': `${userSig}`,
                    }),
                }
            ]
        };
    });
};
export { registryGetUserSigTool };
