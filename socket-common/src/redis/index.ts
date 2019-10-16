import redis, { ClientOpts } from "redis";
import { Logger } from "winston";

import { ICommonConfig } from "../config";


/**
 * Create a Redis Client
 *
 * @param config
 */
const createRedisClient = (config: ICommonConfig, logger: Logger) => {
    const client = redis.createClient(createOptions());

    // Configure it
    client.on("error", (e) => logger.error(`Redis error: ${e}`));

    function createOptions(): ClientOpts {
        const opts = {
            host: config.redis.host || "localhost",
        };

        if (config.redis.password) {
            return { ...opts, password: config.redis.password };
        } else {
            return opts;
        }
    }

    return client;
};

export { createRedisClient };
