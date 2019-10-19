import { IncomingMessage } from "http";
import { Socket } from "net";
import WebSocket from "ws";

import { logger } from "../logging";

function upgradeConnectionHandler(
    request: IncomingMessage, socket: Socket, socketServer: WebSocket.Server, head: Buffer) {

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
}

/**
 * Creates an upgrade connection handler to perform a connection upgrade.
 *
 * @param socketServer
 */
export function upgradeConnectionHandlerFactory(socketServer: WebSocket.Server) {
    return (request: IncomingMessage, socket: Socket, head: Buffer) => {
        upgradeConnectionHandler(request, socket, socketServer, head);
    };
}
