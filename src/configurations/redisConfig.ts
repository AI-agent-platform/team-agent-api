import * as config from "config";

type RedisConfig = {
  userName: string;
  password: string;
  host: string;
  port: number;
};

const redisConfiguration = config.has("redis")
  ? config.get<RedisConfig>("redis")
  : {
      userName: undefined,
      password: undefined,
      host: undefined,
      port: undefined,
    };

export const redisConfig: RedisConfig = {
  userName: redisConfiguration?.userName,
  password: redisConfiguration?.password,
  host: redisConfiguration?.host,
  port: redisConfiguration?.port,
};

export default redisConfig;
