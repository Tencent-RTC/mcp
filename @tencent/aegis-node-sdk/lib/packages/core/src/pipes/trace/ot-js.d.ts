export declare const RandomIdGenerator: {
    /**
     * 生成 traceId
     * Returns a random 16-byte trace ID formatted/encoded as a 32 lowercase hex
     * characters corresponding to 128 bits.
     */
    generateTraceId: () => string;
    /**
     * 生成 spanId
     * Returns a random 8-byte span ID formatted/encoded as a 16 lowercase hex
     * characters corresponding to 64 bits.
     */
    generateSpanId: () => string;
};
