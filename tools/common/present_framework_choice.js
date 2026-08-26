import { z } from 'zod';
import { PRESENT_FRAMEWORK_CHOICE_DEFINITION } from '../definitions/present_framework_choice_def.js';
const PRODUCT_OPTIONS_MAP = {
    chat: {
        title: 'Supported Chat / IM platforms or frameworks',
        options: ['react', 'vue', 'flutter', 'android', 'ios'],
    },
    call: {
        title: 'Supported Call / CallKit platforms or frameworks',
        options: ['web', 'miniprogram', 'react', 'vue', 'flutter', 'android', 'ios', 'uni-app'],
    },
    live: {
        title: 'Supported Live / LiveKit platforms or frameworks',
        options: ['vue', 'flutter', 'android', 'ios'],
    },
    room: {
        title: 'Supported Room / RoomKit platforms or frameworks',
        options: ['vue'],
    },
    rtcengine: {
        title: 'Supported Web TRTC / rtcEngine platforms or frameworks',
        options: ['web'],
    },
    native_trtc_sdk: {
        title: 'Supported Native TRTC SDK platforms or frameworks',
        options: ['android', 'ios', 'c++'],
    },
    push: {
        title: 'Supported Push / TIMPush platforms or frameworks',
        options: ['android', 'ios', 'flutter', 'harmonyos', 'react-native', 'uni-app', 'unity', 'unreal-engine', 'donut'],
    },
};
function buildSelectionText(product, selectionText) {
    const config = PRODUCT_OPTIONS_MAP[product];
    if (!config) {
        return selectionText;
    }
    const options = config.options.map((option) => `- '${option}'`).join('\n');
    return `${selectionText}

Please ask the user to choose one of the supported platforms or frameworks:

${config.title}:
${options}

After the user replies (hard rule — do not skip):
- **Consultation / docs / API / component / feature lookup** → MUST call \`search_trtc_knowledge\` with **product + frameworks**
- **Write integration code into a project** → MUST call the matching \`get_*_integration\` tool`;
}
const registryPresentFrameworkChoiceTool = (mcpServer) => {
    const { name, description, selectionText, parameter_descriptions } = PRESENT_FRAMEWORK_CHOICE_DEFINITION;
    mcpServer.registerTool(name, {
        description,
        inputSchema: {
            product: z.enum(['chat', 'call', 'live', 'room', 'rtcengine', 'native_trtc_sdk', 'push']).describe(parameter_descriptions.product),
        },
    }, ({ product }) => {
        return {
            content: [
                {
                    type: 'text',
                    text: buildSelectionText(product, selectionText),
                },
            ],
        };
    });
};
export { registryPresentFrameworkChoiceTool };
