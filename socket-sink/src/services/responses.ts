import { logger } from "../logging";

export interface IResponseMessage {
    success: boolean;
    message: string;
    time: Date;
}

export function successResponse(message = "Request processed") {
    return {
        message,
        success: true,
        time: new Date(),
    };
}

export function failResponse(e: Error) {
    logger.error(`Request failed: ${e.message}`);
    logger.debug(e);

    return {
        message: e.message,
        success: false,
        time: new Date(),
    };
}
