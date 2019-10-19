import { createRedisClient } from "socket-common";

import { config } from "../config";
import { logger } from "../logging";

const client = createRedisClient(config, logger);

/**
 * Process a message with a given sessionid
 * @param sessionid session id key
 * @param body body key
 */
export function processMessage(sessionid: string, body: string): boolean {
    client.lpush(sessionid, body, (e) => {
        if (!e) {
            logger.debug(`Pushed to session ${sessionid}`);
            client.expire(sessionid, 60);
            return true;
        } else {
            logger.warn(`Cannot process message: ${e}`);
            return false;
        }
    });
}
