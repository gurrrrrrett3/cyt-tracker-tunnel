import { WebSocket } from "ws";
import { clientManager } from "../../..";
import ChatMessage from "../chatMessage";
import WebsocketClientUtils from "./clientUtils";

export default class Client {
  private _socket: WebSocket;

  public username: string;
  public uuid: string;
  public server: string;
  public ip: string; // NOTE: This is not stored, shown to me, or anyone else. It only exits so I can seperate incoming messages from differing clients.

  public constructor(websocket: WebSocket, username: string, uuid: string, server: string, ip: string) {
    this.username = username;
    this.uuid = uuid;
    this.server = server;

    this.ip = websocket.url;

    this._socket = websocket;

    
      setTimeout(() => {
        if (this.username == "54M44R") {
          this.sendMessage("Hello i am 54");
        }
      }, 3000);
  }

  public sendMessage(message: string) {
    clientManager.messageParser.addMessage(
      new ChatMessage("outgoingChatMessage", message, this.username, Date.now())
    );
    this._socket.send(WebsocketClientUtils.constructMessage("chat", message));
  }

  public sendCommand(command: string) {
    this._socket.send(WebsocketClientUtils.constructMessage("command", command));
  }

  public showClientSideMessage(message: string) {
    clientManager.messageParser.addMessage(
      new ChatMessage("outgoingPrivateMessage", message, this.username, Date.now())
    );
    this._socket.send(WebsocketClientUtils.constructMessage("private", message));
  }
}
