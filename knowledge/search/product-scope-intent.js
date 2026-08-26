/**
 * Product-scope intent (routes to chat/urls/product.md, type=product).
 *
 * These questions are about the PRODUCT / account scope — billing, packages, console settings,
 * account & data capabilities configured in the console, storage/retention, usage limits.
 * They are cross-platform and must NOT require a framework.
 *
 * Detection keys on *intent* words (console / billing / limit / product-setting), NOT on
 * capability nouns alone (e.g. "relationship chain", "group management"): those nouns are
 * ambiguous and can also be client-SDK feature questions on a specific platform.
 * A platform / SDK / "how to implement" signal disqualifies the product-scope interpretation.
 */
const PRODUCT_SCOPE_INTENT = /控制台|计费|套餐|价格|退费|续费|配额|使用限制|数量限制|存储时长|漫游.{0,4}时长|多端登录|登录策略|console|dashboard|billing|pricing|package\s*(plan|feature|difference)|quota|usage\s*limit|multi[\s-]?device\s*login|login\s*(policy|strategy)|(message\s*)?storage\s*(duration|period)|retention/i;
const CLIENT_IMPL_SIGNAL = /\b(android|ios|flutter|harmonyos|react[\s-]?native|unity|unreal(\s*engine)?|donut|uni[\s-]?app)\b|\bSDK\b|\bAPI\b|怎么(实现|调用|集成|接入|写)|如何(实现|调用|集成|接入|写)|\b(implement|integrate)\b/i;
export function isProductScopePrompt(prompt) {
    if (!PRODUCT_SCOPE_INTENT.test(prompt))
        return false;
    if (CLIENT_IMPL_SIGNAL.test(prompt))
        return false;
    return true;
}
/**
 * When the Agent mislabels a product-scope question as `feature` (no framework given),
 * rewrite the type to `product` so filterPool can hit chat/urls/product.md.
 * If a framework is present, the Agent genuinely wants a client feature — do not downgrade.
 */
export function downgradeToProductType(products, types, prompt, frameworks) {
    if (frameworks?.length)
        return types;
    if (!types.includes('feature'))
        return types;
    if (!products?.includes('chat'))
        return types;
    if (!isProductScopePrompt(prompt))
        return types;
    const downgraded = types.filter((t) => t !== 'feature');
    if (!downgraded.includes('product'))
        downgraded.push('product');
    return downgraded;
}
