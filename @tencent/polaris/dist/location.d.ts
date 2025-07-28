/**
 * 位置信息
 */
export interface Location {
    /**
     * CMDB Region
     */
    region: string;
    /**
     * CMDB Zone
     */
    zone: string;
    /**
     * CMDB Campus(IDC)
     */
    campus: string;
}
/**
 * 位置信息比较级别
 */
export declare const enum LocationMatchLevel {
    Region = 0,
    Zone = 1,
    Campus = 2,
    None = 3
}
/**
 * 判断两个位置信息是否匹配
 * @param a 位置信息 A
 * @param b 位置信息 B
 * @param level 比较级别
 */
export declare const isLocationMatch: (a: Location, b: Location, level: LocationMatchLevel) => boolean;
/**
 * 判断位置信息是否为空
 * @param loc 位置信息
 */
export declare const isEmptyLocation: (loc?: Location | null | undefined) => boolean;
/**
 * 空白位置信息
 */
export declare const blankLocation: Location;
/**
 * 找到两个位置信息相交的部分
 * @param a 位置信息 A
 * @param b 位置信息 B
 */
export declare const intersectionLocation: (a: Partial<Location>, b: Partial<Location>) => Location;
