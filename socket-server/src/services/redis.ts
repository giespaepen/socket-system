import { createRedisClient } from "socket-common";

import { config } from "../config";
import { logger } from "../logging";

export type PopCallback = (value: string) => void;

// Instantiate the redis client
const redisClient = createRedisClient(config, logger);

export function popMessage(sessionid: string, callback: PopCallback) {
    redisClient.blpop([sessionid, 0], (list, item) => {
        if (item && item.length === 2) {
            logger.debug(`Relaying value from ${sessionid}`);
            const [_, message] = item;
            callback(message);
        } else {
            logger.warn(`Empty value received on ${sessionid}`);
        }
    });
}
