import { createLogger } from "socket-common";

import { config } from "../config";


const logger = createLogger(config);

export { logger };
