/**
 * 元数据
 */
export declare type Metadata = Record<string, string>;
/**
 * 元数据匹配条件，实际值来源
 */
export declare enum MetadataDynamicValueSource {
    /**
     * 来源于 `Payload` 字段
     */
    Payload = 0,
    /**
     * 来源于请求传入的值
     */
    Parameter = 1,
    /**
     * 来源于配置或环境变量中获取的值
     */
    Variable = 2
}
/**
 * 元数据匹配条件
 */
export declare type MetadataDynamicValue = {
    /**
     * 实际值来源
     */
    source: MetadataDynamicValueSource.Payload | MetadataDynamicValueSource.Variable;
    /**
     * 换取实际值所需信息
     */
    payload: string | RegExp;
} | {
    /**
     * 实际值来源
     */
    source: MetadataDynamicValueSource.Parameter;
};
/**
 * @deprecated 使用 MetadataDynamicValue 替代
 */
export declare type MetadataDeprecatedValue = string | RegExp;
/**
 * 元数据匹配条件
 */
export declare type MetadataCondition = Record<string, MetadataDeprecatedValue | MetadataDynamicValue>;
/**
 * 判断两个元数据是否匹配条件
 *
 * @param val 元数据
 * @param cond 元数据匹配条件
 * @param variables 变量列表
 * @param parameters 参数列表
 * @returns 是否匹配
 */
export declare function isMetadataMatch(val: Metadata, cond: MetadataCondition, variables: Record<string, string>, parameters: Record<string, string>): boolean;
/**
 * 判断两个元数据是否匹配条件
 *
 * @param val 元数据
 * @param cond 元数据匹配条件
 * @param variables 变量列表
 * @returns 如不匹配返回 `false`，否则返回所匹配到的参数列表
 */
export declare function isMetadataMatch(val: Metadata, cond: MetadataCondition, variables: Record<string, string>): Record<string, string> | false;
/**
 * 判断元数据是否为空
 * @param metadata 元数据
 */
export declare function isEmptyMetadata(metadata: Metadata): boolean;
/**
 * 找到两个元数据相交的部分
 * @param a 元数据 A
 * @param b 元数据 B
 * @returns 交集
 */
export declare function intersectionMetadata(a: Metadata, b: Metadata): Metadata;
