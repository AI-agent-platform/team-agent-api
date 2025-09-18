import * as config from "config";

type GoogleAuthConfig = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
};

const googleConfig = config.get<GoogleAuthConfig>("google");

export default googleConfig;
