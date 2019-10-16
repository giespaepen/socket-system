import { createRedisClient } from "socket-common";

import { config } from "../config";
import { logger } from "../logging";


const client = createRedisClient(config, logger);

export { client };
