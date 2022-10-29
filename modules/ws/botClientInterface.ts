import socket from "ws";
import { clientManager } from "../..";
import WebsocketIntakeHandler from "./clientManager/intakeHandler";

export default class BotClientInterface {
  public client?: socket;

  public messageIds: Map<
    string,
    {
      callback: (data: Object, took: number) => any;
      timestamp: number;
    }
  > = new Map();

  constructor(ws: socket.Server<socket>) {
    ws.on("connection", (client, req) => {
      client.on("message", (data) => {
        const str = data.toString();

        console.log(`Message: ${str}`)

        if (str == "botserver:ready") {
          this.client = client;
          console.info("Bot server connected");
          return;
        }

        if (str.startsWith("botserver:")) {
          this.handleBotMessage(str.split(":").splice(1).join(":"));
        }

        if (str.startsWith("command:")) {
          this.handleBotCommand(str.split(":").splice(1).join(":"));
        }

        if (str.startsWith("client:")) {
          WebsocketIntakeHandler.onClientMessage(client, str, req.socket.remoteAddress ?? "");
        }
      });
    });
  }

  private async handleBotMessage(str: string) {
    const id = str.split(":")[0];
    const data = JSON.parse(str.split(":").splice(1).join(":"));
    const msg = this.messageIds.get(id);
    if (msg) {
      msg.callback(data, Date.now() - msg.timestamp);
      this.messageIds.delete(id);
    }
  }

  public getData(
    obj: {
      type: string;
      [key: string]: any;
    },
    callback: (data: Object, took: number) => any
  ) {
    const key = Math.random().toString(36).substring(7);
    this.client?.send(`${key}:${JSON.stringify(obj)}`);
    this.messageIds.set(key, {
      callback,
      timestamp: Date.now(),
    });
  }

  private handleBotCommand(str: string) {
    const type = str.split(":")[0];
    const data = JSON.parse(str.split(":").splice(1).join(":"));
    console.log(`Bot command: ${type}`);
    console.log(`Bot data: ${JSON.stringify(data)}`);
    
    if (type == "chat") {
     const client = clientManager.getClient(data.username);
      if (!client) return;

      client.sendMessage(data.message);
    } else if (type == "command") {
      const client = clientManager.getClient(data.username);
      if (!client) return;

      client.sendCommand(data.command);
    } else if (type == "private") {
      const client = clientManager.getClient(data.username);
      if (!client) return;

      client.showClientSideMessage(data.message);
    }
  }

  public sendBotMessage(type: string, data: Object) {
    this.client?.send(`tunnel:${type}:${JSON.stringify(data)}`);
  }
}
