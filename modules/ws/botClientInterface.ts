import socket from "ws";

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
        if (str == "botserver:ready") {
          this.client = client;
          console.info("Bot server connected");
          return;
        }

        if (str.startsWith("botserver:")) {
          this.handleBotMessage(str.split(":").splice(1).join(":"));
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
}
