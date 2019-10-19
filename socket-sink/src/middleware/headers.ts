import { NextFunction, Request, Response } from "express";

import { config } from "../config";

export function allowOrigin(req: Request, res: Response, next: NextFunction) {
    res.set("Access-Control-Allow-Headers", "*");
    next();
}

export function serverName(req: Request, res: Response, next: NextFunction) {
    res.set("Server", config.hostname);
    next();
}
