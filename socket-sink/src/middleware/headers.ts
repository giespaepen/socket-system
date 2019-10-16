import { NextFunction, Request, Response } from "express";
import os from "os";

const hostname = os.hostname();

export function allowOrigin(req: Request, res: Response, next: NextFunction) {
    res.set("Access-Control-Allow-Headers", "*");
    next();
}

export function serverName(req: Request, res: Response, next: NextFunction) {
    res.set("Server", hostname);
    next();
}
