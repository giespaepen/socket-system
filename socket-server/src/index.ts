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

// Instantiate the redis client
const redisClient = createRedisClient(config, logger);

// Handle the upgrade logic
httpServer.on("upgrade", upgradeConnectionHandlerFactory(socketServer));

// Handle the connection logic
socketServer.on("connection", (connection) => {
    const sessionid = connection.url;
    logger.info(`Connected on id ${sessionid}`);

    // Send a ping message each second, TODO: implement pong receive mechanism
    interval(10000).subscribe(() => connection.ping(() => { logger.debug("Ping"); }));

    let alive = true;

    // Wrapper of the pop function
    const pop = () => {
        popMessage(sessionid, connection.send);

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
