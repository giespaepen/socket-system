import { NextFunction, Request, Response } from "express";

export function security(req: Request, res: Response, next: NextFunction) {
    // TODO implement security
    next();
}
