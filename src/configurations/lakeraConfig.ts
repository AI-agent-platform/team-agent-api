import * as config from "config";

type LakeraGuardConfig = {
  apiKey: string;
};

const lakeraGuardConfiguration = config.has("lakeraGuard")
  ? config.get<LakeraGuardConfig>("lakeraGuard")
  : { apiKey: undefined };

export const LakeraGuardConfig: LakeraGuardConfig = {
  apiKey:
    process.env.LAKERA_GUARD_API_KEY || lakeraGuardConfiguration?.apiKey || "",
};

export default LakeraGuardConfig;
