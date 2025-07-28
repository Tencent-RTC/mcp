import { Instance } from "../../instance";
import { LocalRegistryPlugin, PluginType, RegistryCategory, RegistryData, ServiceRules } from "../../plugins";
import { RatelimitRule } from "../../rules";
export declare class MemoryOnlyRegistry implements LocalRegistryPlugin {
    readonly name: string;
    readonly type = PluginType.LocalRegistry;
    readonly [RegistryCategory.Instance]: RegistryData<Instance[]>;
    readonly [RegistryCategory.Rule]: RegistryData<ServiceRules>;
    readonly [RegistryCategory.Ratelimit]: RegistryData<RatelimitRule[]>;
}
