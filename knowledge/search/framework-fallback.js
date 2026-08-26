export function hasExplicitFrameworkMatch(chunkFrameworks, requestFrameworks) {
    if (!requestFrameworks?.length)
        return false;
    return requestFrameworks.some((fw) => chunkFrameworks.includes(fw));
}
export function hasFrameworkFallbackMatch(chunk, opts) {
    const callCoreWebFallback = Boolean(opts.product?.includes('call')
        && (opts.framework === 'react' || opts.framework === 'vue')
        && chunk.variant === 'core-sdk'
        && chunk.framework.includes('web'));
    const liveWebVueFallback = Boolean(opts.product?.includes('live')
        && opts.framework === 'web'
        && chunk.variant === 'core-sdk'
        && chunk.framework.includes('vue')
        && chunk.source.includes('/api-reference/'));
    const roomWebVueFallback = Boolean(opts.product?.includes('room')
        && opts.framework === 'web'
        && chunk.variant === 'core-sdk'
        && chunk.framework.includes('vue')
        && chunk.source.includes('knowledge/roomkit/core-sdk/vue/'));
    return callCoreWebFallback || liveWebVueFallback || roomWebVueFallback;
}
