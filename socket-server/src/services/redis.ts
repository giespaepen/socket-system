import { RedisClient } from "socket-common/node_modules/@types/redis";

import { logger } from "../logging";

/**
 * 
 * @param sessionid 
 */
export async function popMessage(sessionid: string, client: RedisClient): Promise<string> {
    return new Promise((resolve, reject) => {
        client.brpop(sessionid, 0, (error, item) => {

            if (error) {
                reject(error);
            }

            if (item && item.length === 2) {
                logger.debug(`Relaying value from ${sessionid}`);
                const message = item.pop();
                if (message) {
                    resolve(message);
                } else {
                    logger.warn(`Null value received on ${sessionid}`)
                    resolve(undefined);
                }
            } else {
                logger.warn(`Empty value received on ${sessionid}`);
                resolve(undefined);
            }
        });
    });
}
