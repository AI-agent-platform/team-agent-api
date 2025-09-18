import * as config from "config";

type DbConfig = {
  uri: string;
};

const dbConfiguration = config.has("db")
  ? config.get<DbConfig>("db")
  : { uri: undefined };

export const dbConfig: DbConfig = {
  uri: dbConfiguration?.uri,
};

export default dbConfig;
