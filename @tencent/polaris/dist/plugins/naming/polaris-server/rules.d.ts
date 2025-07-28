import { MetadataCondition, RoutingRules } from "../../..";
import { v1 as Polaris } from "./discover-pb/types";
import { Boxable, DeconstructorWrappers } from "./types";
declare type Metadata = NonNullable<DeconstructorWrappers<(Polaris.IDestination & Polaris.ISource)["metadata"]>>;
export declare class RuleProcessor {
    private readonly unbox;
    constructor(unbox: Boxable["unbox"]);
    procRules(rules: DeconstructorWrappers<Polaris.IRoute>[]): RoutingRules[];
    produceMetadata(metadata?: Metadata): MetadataCondition;
    private procSourceRules;
    private procDestinationRules;
}
export {};
