/**
 * 产品 ID → 本地 knowledge 目录名的映射（单一事实源的 TS 侧镜像）。
 * 与 resource/_schema/products.yaml 保持一致，build 期校验两份一致（见 build-index.ts）。
 * Step 7 切换后：目录名已统一为 call / live / room / trtc（rtcengine 合并入 trtc）。
 */
export const PRODUCT_DIRS = {
    chat: 'chat',
    call: 'call',
    live: 'live',
    room: 'room',
    push: 'push',
    trtc: 'trtc',
};
