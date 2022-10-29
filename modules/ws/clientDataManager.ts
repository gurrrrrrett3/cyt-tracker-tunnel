import Client from "./clientManager/client";
import fs from "fs";
import path from "path";

export default class ClientDataManager {
  public static onClientConnect(client: Client) {
    const data = this.openFile();

    let clientData = data.users.find((user) => user.username == client.username);
    if (!clientData) {
      data.users.push({
        sentSecurityMessage: false,
        username: client.username,
      });

      clientData = {
        sentSecurityMessage: false,
        username: client.username,
      }
    }

    if (!clientData?.sentSecurityMessage) {
      // send security message

      client.showClientSideMessage("§b== §6CYTUtilMod §b==");
      client.showClientSideMessage(`§6Hey! Gart here!`);
      client.showClientSideMessage(
        `§6Just wanted to let you know that I use your IP to identify your client from others.`
      );
      client.showClientSideMessage(`§6I do not store your IP, nor can I see it.`);
      client.showClientSideMessage(`§bThanks for installing my mod!`);

      clientData.sentSecurityMessage = true;
    }

    this.saveFile(data);
  }

  public static openFile(): ClientData {
    return JSON.parse(fs.readFileSync(path.resolve("data.json"), "utf-8"));
  }

  public static saveFile(data: ClientData) {
    fs.writeFileSync(path.resolve("data.json"), JSON.stringify(data, null, 2));
  }
}

interface ClientData {
  urls: {
    url: string;
    count: number;
  };
  users: {
    username: string;
    sentSecurityMessage: boolean;
  }[];
}
