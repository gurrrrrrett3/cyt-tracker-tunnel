import { WebSocket } from "ws";
import ChatMessage from "../chatMessage";
import DuplicateChatMessageParser from "../duplicateChatMessageParser";
import Client from "./client";

export default class ClientManager {
  public clients: Map<string, Client> = new Map();
  public messageParser: DuplicateChatMessageParser = new DuplicateChatMessageParser();

  public addClient(client: Client) {
    this.clients.set(client.username, client);
    console.log(`Added client ${client.username} to the client manager`);
    return this.clients.size - 1;
  }

  public removeClient(client: Client) {
    this.clients.delete(client.ip);
    console.log(`Removed client ${client.ip} from the client manager`);
  }

  public handleChatMessage(
    ws: WebSocket,
    data: {
      type: "chat";
      data: string;
      timestamp: number;
    },
    ip: string
  ) {
    
   const client = this.clients.get(ip);
    if (!client) return;
    console.log(`Client ${client.username} received a message: ${data.data}`);

    this.messageParser.addMessage(new ChatMessage("incomingChatMessage", data.data, client.username, data.timestamp));

  }
}
