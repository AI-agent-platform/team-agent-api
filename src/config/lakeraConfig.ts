import * as config from 'config';

type LakeraGuardConfig = {
    apiKey: string;
};

const lakeraGuardConfiguration = config.get<LakeraGuardConfig>('lakeraGuard');

export const LakeraGuardConfig: LakeraGuardConfig = {
    apiKey: process.env.MONGO_URL || lakeraGuardConfiguration.apiKey,
};
export default LakeraGuardConfig;