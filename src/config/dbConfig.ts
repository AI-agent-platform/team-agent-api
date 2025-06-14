import * as config from 'config';

type DbConfig = {
    uri: string;
};

const dbConfiguration = config.get<DbConfig>('db');

export const dbConfig: DbConfig = {
    uri: process.env.MONGO_URL || dbConfiguration.uri,
};
export default dbConfig;