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

export function failResponse(message: string) {
    logger.error(`Request failed: ${message}`);

    return {
        message,
        success: false,
        time: new Date(),
    };
}
