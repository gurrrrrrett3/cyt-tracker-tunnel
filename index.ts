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
  console.log(`Listening on port ${config.webserverPort}`);
});

app.use("/ws", require("./routers/socketRouter").default);

app.get("/", (req, res) => {
    res.sendFile(path.resolve("index.html"));
})

app.get("/script", (req, res) => {
    res.sendFile(path.resolve("dist/bundle.js"));
})

export const clientManager = new ClientManager()