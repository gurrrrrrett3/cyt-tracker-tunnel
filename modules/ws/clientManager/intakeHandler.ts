import { WebSocket } from "ws";
import { clientManager } from "../../..";
import ClientDataManager from "../clientDataManager";
import Client from "./client";
import WebsocketClientUtils from "./clientUtils";

export default class WebsocketIntakeHandler {

    public static onClientMessage(ws: WebSocket, message: string, ip: string) {
        if (!message.startsWith("client:")) return;
        const type = message.split(":")[1];
        const data = JSON.parse(message.split(":").splice(2).join(":"));

        if (type == "ready") {
            
            const username = data.username;
            const uuid = data.uuid;
            const server = data.server;
            const timestamp = data.timestamp;

            const client = new Client(ws, username, uuid, server, ip);
            clientManager.addClient(client);

            client.showClientSideMessage(`Successfully connected! You are id ${clientManager.clients.size - 1}`);
            client.showClientSideMessage(`Estimated ping: ${Date.now() - timestamp}ms`);

            ClientDataManager.onClientConnect(client);

            return;
        } else if (type == "chat") {
            clientManager.handleChatMessage(ws, data, ip);
        }
    }

}