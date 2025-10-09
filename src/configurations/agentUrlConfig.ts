import * as config from "config";

type AgentUrlConfig = {
  customerAgent: string;
  businessAgent: string;
};

const agentUrlConfiguration = config.has("agents")
  ? config.get<AgentUrlConfig>("agents")
  : {
      customerAgent: undefined,
      businessAgent: undefined,
    };

export const agentUrlConfig: AgentUrlConfig = {
  customerAgent: agentUrlConfiguration?.customerAgent,
  businessAgent: agentUrlConfiguration?.businessAgent,
};

export default agentUrlConfig;
