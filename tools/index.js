// common
import { registryPresentFrameworkChoiceTool } from './common/present_framework_choice.js';
import { registryGetUserSigTool } from './common/get_usersig.js';
import { registrySearchTRTCKnowledgeTool } from './common/search_trtc_knowledge.js';
import { registryFinalizeAnswerTool } from './common/finalize_answer.js';
import { registrySubmitFeedbackTool } from './common/submit_feedback.js';
// chat
import { registryGetWebChatUIKitIntegrationTool } from './chat/get_web_chat_uikit_integration.js';
import { registryGetNativeChatUIKitIntegrationTool } from './chat/get_native_chat_uikit_integration.js';
// call
import { registryGetWebCallUIKitIntegrationTool } from './call/get_web_call_uikit_integration.js';
import { registryGetNativeCallUIKitIntegrationTool } from './call/get_native_call_uikit_integration.js';
import { registryGetNativeCallKitCoreIntegrationTool } from './call/get_native_callkit_core_integration.js';
// live
import { registryGetWebLiveUIKitIntegrationTool } from './live/get_web_live_uikit_integration.js';
import { registryGetNativeLiveKitCoreIntegrationTool } from './live/get_native_livekit_core_integration.js';
import { registryGetNativeLiveUIKitIntegrationTool } from './live/get_native_live_uikit_integration.js';
// room
import { registryGetWebRoomUIKitIntegrationTool } from './room/get_web_room_uikit_integration.js';
// en 站 room 无 UI 集成 Web 文档（房间管理（Web）/设备检测/设备及网络（Web））status=0 未发布，
// web_room_core（仅支持 vue）无可用文档，故不注册（T11.3 get 工具流程适配）。
// import { registryGetWebRoomCoreIntegrationTool } from './room/get_web_room_core_integration.js';
function registryTools(mcpServer) {
    registryPresentFrameworkChoiceTool(mcpServer);
    registryGetUserSigTool(mcpServer);
    registrySearchTRTCKnowledgeTool(mcpServer);
    registryFinalizeAnswerTool(mcpServer);
    registrySubmitFeedbackTool(mcpServer);
    // chat
    registryGetWebChatUIKitIntegrationTool(mcpServer);
    registryGetNativeChatUIKitIntegrationTool(mcpServer);
    // call
    registryGetWebCallUIKitIntegrationTool(mcpServer);
    registryGetNativeCallUIKitIntegrationTool(mcpServer);
    registryGetNativeCallKitCoreIntegrationTool(mcpServer);
    // live
    registryGetWebLiveUIKitIntegrationTool(mcpServer);
    registryGetNativeLiveKitCoreIntegrationTool(mcpServer);
    registryGetNativeLiveUIKitIntegrationTool(mcpServer);
    // room
    registryGetWebRoomUIKitIntegrationTool(mcpServer);
    // registryGetWebRoomCoreIntegrationTool(mcpServer); // en 站 Web room core 文档未发布，见上方 import 注释
}
export { registryTools };
