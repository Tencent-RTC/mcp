const DEFAULT_PROFILE = {
    name: 'default',
    maxPerSource: 3,
    rerankTopK: 20,
    lowConfidenceRerankTopK: 0,
    lowConfidenceTopScoreThreshold: 0,
    lowConfidenceGapRatioThreshold: 0,
    titleExactMultiplier: 1.03,
    titleTokenBoost: 0.05,
};
const IOT_PROFILE = {
    name: 'iot',
    maxPerSource: 2,
    rerankTopK: 24,
    lowConfidenceRerankTopK: 10,
    lowConfidenceTopScoreThreshold: 28,
    lowConfidenceGapRatioThreshold: 1.08,
    titleExactMultiplier: 1.15,
    titleTokenBoost: 0.15,
};
export function resolveRankProfile(params) {
    if (params.product?.includes('iot'))
        return IOT_PROFILE;
    return DEFAULT_PROFILE;
}
