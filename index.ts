import config from "./config";
import express from "express";
import ws from "ws"
import path from "path"
import BotClientInterface from "./modules/ws/botClientInterface";
import ClientManager from "./modules/ws/clientManager/clientManager";

const app = express();
const websocketServer = new ws.WebSocketServer({ port: config.websocketPort });
export const bci = new BotClientInterface(websocketServer);

app.listen(config.webserverPort, () => {
  console.log(`Listening on port ${config.webserverPort}, websocket port ${config.websocketPort}`);
});

app.use("/ws", require("./routers/socketRouter").default);

export const clientManager = new ClientManager()