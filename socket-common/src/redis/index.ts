import redis, { ClientOpts } from "redis";
import { Logger } from "winston";

import { ICommonConfig } from "../config";

/**
 * Create redis client options
 * @param config
 */
export function createRedisClientOptions(config: ICommonConfig) {
    const opts = {
        host: config.redis.host || "localhost",
    };

    if (config.redis.password) {
        return { ...opts, password: config.redis.password };
    } else {
        return opts;
    }
}

/**
 * Create a Redis Client
 *
 * @param config
 */
const createRedisClient = (config: ICommonConfig, logger: Logger) => {
    // Configure the client
    const client = redis.createClient(createRedisClientOptions(config));

    // Configure listeners
    client.on("error", (e) => logger.error(`Redis error: ${e}`));
    client.on("ready", () => logger.info(`Redis connected on ${config.redis.host}`));

    return client;
};

export { createRedisClient };
