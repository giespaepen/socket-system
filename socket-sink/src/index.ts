import express from "express";

import { config } from "./config";
import { SESSIONID_KEY } from "./constants";
import { logger } from "./logging";
import * as middleware from "./middleware";
import { extractBody, extractPathVariable, failResponse, processMessage, successResponse } from "./services";



logger.debug("Starting application");
const app = express();
const router = express.Router();

app.get("/", (_, res) => {
    res.send({ apiPath: config.api });
});

router.post(`/push/:${SESSIONID_KEY}`, async (req, res) => {
    try {
        const sessionid = extractPathVariable(req, SESSIONID_KEY);
        const body = extractBody(req);

        // Process the message
        await processMessage(sessionid, body);

        // Send a response
        res.status(200)
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
