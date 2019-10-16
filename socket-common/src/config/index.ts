export type ApiVersion = "v1" | "v2" | "v3";
export type Environment = "development" | "production";

export interface ICommonConfig {
    api: ApiVersion;
    environment: Environment;
    name: string;
    port: number;
    redis: IRedisConfig;
}

export interface IRedisConfig {
    host?: string;
    password?: string;
}

/**
 * Create a config
 *
 * @param defaultName
 * @param defaultPort
 * @param defaultEnvironment
 * @param defaultApi
 */
const createConfig = (
    defaultName: string = "app",
    defaultPort: number = 3000,
    defaultEnvironment: string = "development",
    defaultApi: ApiVersion = "v1"): ICommonConfig => {
    return {
        // Base configuration
        api: defaultApi,
        environment: process.env.NODE_ENV as Environment || defaultEnvironment,
        name: process.env.NAME || defaultName,
        port: parseInt(process.env.PORT || "", 10) || defaultPort,

        // Redis configuration
        redis: {
            host: process.env.REDIS_HOST || "localhost",
            password: process.env.REDIS_PASSWORD,
        },
    };
};

export { createConfig };
