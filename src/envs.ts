const getEnv = (name: string) => {
    const value = process.env[name];
    if (!value) {
        throw Error(`Missing env variable ${name}`);
    }
    return value;
};

export const envs = {
    db: {
        host: getEnv('DB_HOST'),
        port: parseInt(getEnv('DB_PORT')),
        user: getEnv('DB_USER'),
        password: getEnv('DB_PASSWORD'),
        database: getEnv('DB_NAME'),
        table: getEnv('DB_TABLE'),
    },
    url: getEnv('URL_BASE'),
    categories: getEnv('CATEGORIES').split(';'),
};
