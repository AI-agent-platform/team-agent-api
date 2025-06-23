import * as config from 'config';

type DbConfig = {
    uri: string;
};

const dbConfiguration = config.get<DbConfig>('db');
console.log("🚀 ~ dbConfiguration:", dbConfiguration)

export const dbConfig: DbConfig = {
    uri: dbConfiguration.uri || process.env.MONGO_URL ,
};
export default dbConfig;