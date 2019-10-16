import http, { IncomingMessage } from "http";
import { Socket } from "net";
import { interval } from "rxjs";
import { createRedisClient } from "socket-common";
import WebSocket from "ws";

import { config } from "./config";
import { logger } from "./logging";
















// Instantiate the http server
const httpServer = http.createServer();

// Instantiate the socket server
const socketServer = new WebSocket.Server({ noServer: true });

// Instantiate the redis client
const redisClient = createRedisClient(config, logger);

// Handle the upgrade logic
httpServer.on("upgrade", (request: IncomingMessage, socket: Socket, head: Buffer) => {
    logger.debug(`Trying to upgrade: ${request.url}`);

    // Get the session id
    const { url } = request;
    const sessionid = (url || "").split("/").pop();

    if (sessionid && sessionid.length > 0) {
        logger.info(`Creating socket for id ${sessionid}`);
        socketServer.handleUpgrade(request, socket, head, (connection) => {
            logger.debug(`Requesting connection on ${sessionid}`);
            // Set the sessionid in the connection
            connection.url = sessionid;

            // Emit the connection
            socketServer.emit("connection", connection, request);
        });
    } else {
        logger.warn("No valid session id found, closing connection");
        socket.destroy();
    }
});

// Handle the connection logic
socketServer.on("connection", (connection) => {
    const sessionid = connection.url;
    logger.info(`Connected on id ${sessionid}`);

    // Send a ping message each second, TODO: implement pong
    interval(10000).subscribe(() => connection.ping(() => { logger.debug("Ping"); }));

    let alive = true;

    // The internal loop function
    function pop() {
        redisClient.blpop([sessionid, 0], (list, item) => {

            if (item && item.length === 2) {
                logger.debug(`Relaying value from ${sessionid}`);
                const value = item.pop();
                connection.send(value);
            } else {
                logger.warn(`Empty value received on ${sessionid}`);
            }

            // Loop
            if (alive) {
                process.nextTick(pop);
            }
        });
    }

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
