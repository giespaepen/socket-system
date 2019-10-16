import winston, { Logger } from "winston";

import { ICommonConfig } from "../config";

/**
 * Create a logger
 *
 * @param config
 */
const createLogger = (config: ICommonConfig): Logger => {

    const level = config.environment === "development" ? "debug" : "info";
    const name = config.name;

    return winston.createLogger({
        defaultMeta: name,
        // format: winston.format.timestamp(),
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp({
                format: "YYYY-MM-DD HH:mm:ss",
            }),
            winston.format.printf((x) => `${x.timestamp} [${name}] ${x.level}: ${x.message}`),
        ),
        level,
        transports: [new winston.transports.Console()],
    });
};

export { createLogger };
