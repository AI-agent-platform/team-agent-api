import * as config from "config";

type FastAPI = {
  uri: string;
};

const fastAPIConfiguration = config.has("fastAPI")
  ? config.get<FastAPI>("fastAPI")
  : { uri: undefined };

export const fastAPIConfig: FastAPI = {
  uri: fastAPIConfiguration?.uri,
};

export default fastAPIConfig;
