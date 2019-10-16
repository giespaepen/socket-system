import bodyParser from "body-parser";
import express from "express";

import { config } from "./config";
import { SESSIONID_KEY } from "./constants";
import { logger } from "./logging";
import * as middleware from "./middleware";
import { client } from "./redis";
import { extractBody, extractPathVariable, failResponse, successResponse } from "./services";

logger.debug("Starting application");
const app = express();
const router = express.Router();

app.get("/", (_, res) => {
    res.send({ apiPath: config.api });
});

router.post(`/push/:${SESSIONID_KEY}`, (req, res) => {
    try {
        const sessionid = extractPathVariable(req, SESSIONID_KEY);
        const body = extractBody(req);

        client.lpush(sessionid, body, (e) => {
            if (!e) {
                logger.debug(`Pushed to session ${sessionid}`);
                client.expire(sessionid, 60);
            } else {
                res
                    .status(500)
                    .send(failResponse(e));
            }
        });

        res
            .status(200)
            .send(successResponse());
    } catch (e) {
        res
            .status(400)
            .send(failResponse(e));
    }
});

// Load all middleware
Object.keys(middleware).forEach((key) => {
    logger.debug(`Loading middleware ${key}`);
    app.use((middleware as any)[key]);
});

// Config the router
app.use(`/${config.api}`, router);

// Open the gate
app.listen(config.port, () => {
    logger.info(`Listening on port ${config.port}`);
    logger.info("Application initialized");
});
