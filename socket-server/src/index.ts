import http from "http";
import { interval } from "rxjs";
import { createRedisClient } from "socket-common";
import WebSocket from "ws";

import { config } from "./config";
import { logger } from "./logging";
import { upgradeConnectionHandlerFactory } from "./services/http";
import { popMessage } from "./services/redis";


// Instantiate the http server
const httpServer = http.createServer();

// Instantiate the socket server
const socketServer = new WebSocket.Server({ noServer: true });

// Handle the upgrade logic
httpServer.on("upgrade", upgradeConnectionHandlerFactory(socketServer));

// Handle the connection logic
socketServer.on("connection", (connection) => {
    const sessionid = connection.url;
    logger.info(`Connected on id ${sessionid}`);

    let alive = true;

    // Send a ping message each second
    interval(10000).subscribe(() => connection.ping(sessionid));

    let timerId: NodeJS.Timeout | undefined = undefined;
    connection.on("pong", () => {
        if (timerId) clearTimeout(timerId);
        timerId = setTimeout(() => {
            alive = false;
            connection.close();
        }, 1000 * 60);
    })

    // Create a new client
    const client = createRedisClient(config, logger);

    // Wrapper of the pop function
    async function pop(): Promise<void> {
        try {
            const message = await popMessage(sessionid, client);
            if (message) {
                connection.send(message);
            }
        } catch (e) {
            logger.error(`Error occurred while popping messages, ${e}`);
            alive = false;
            connection.close(500, e);
        }

        // Loop
        if (alive) {
            process.nextTick(pop);
        }
    };

    // Start listening on redis
    logger.info("Start listening on redis");
    pop();

    connection.on("close", (code, reason) => {
        alive = false;
        logger.info(`Connection closed on id ${sessionid}: ${code} ${reason}`.trim());
    });
});

// Start listening on the http port
httpServer.listen(config.port, () => {
    logger.info(`Listening on port ${config.port}`);
    logger.info("Application initialized");
});
