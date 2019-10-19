import { Request } from "express";

import { logger } from "../logging";


/**
 * Extract
 * @param request
 * @param pathVariable
 */
export function extractPathVariable(request: Request, pathVariable: string): string {
    const value = request.params[pathVariable];
    if (value) {
        return value;
    } else {
        throw new Error(`Cannot find path variable ${pathVariable} in url`);
    }
}

export function extractBody(request: Request): string {
    logger.debug(request.body);
    const value = request.body;
    if (value && value.length > 0) {
        return value;
    } else {
        throw new Error("Cannod find body in request");
    }
}
