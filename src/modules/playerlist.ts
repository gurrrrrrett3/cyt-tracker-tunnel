import Logger from "./logs";

export default class Playerlist {
  public table: HTMLTableElement = document.getElementById("playerlist") as HTMLTableElement;

  constructor() {
    setInterval(this.update.bind(this), 1000);
  }

  public async update() {
    let data = await fetch("/ws/onlineList").then((res) => res.json());
    let players = data.data.players as Array<MapPlayer>;

    this.table.innerHTML = "";

    players.sort((a, b) => {
        if (Playerlist.isPlayerAfk(a) && !Playerlist.isPlayerAfk(b)) return 1;
        if (!Playerlist.isPlayerAfk(a) && Playerlist.isPlayerAfk(b)) return -1;
        return 0;
    })

    for (let player of players) {
      let i = players.indexOf(player);
      let row = this.table.insertRow();
      row.className = i % 2 == 0 ? "" : "table-active";

      let buttonCell = row.insertCell();
      let tpButton = document.createElement("button");
        tpButton.className = "btn btn-primary";
        tpButton.innerText = "tp";
        tpButton.onclick = () => {
            //copy text to clipboard
            navigator.clipboard.writeText(`/tp ${player.name}`);
            Logger.log(`Copied /tp ${player.name} to clipboard`);
        }
        buttonCell.appendChild(tpButton);

     let mapButton = document.createElement("button");
        mapButton.className = "btn btn-primary";
        mapButton.innerText = "map";
        mapButton.onclick = () => {
            // open map in new tab
            window.open(`https://map.craftyourtown.com/#${player.world};flat;${player.x},64m,${player.z};5`, "_blank");
            Logger.log(`Opened map for ${player.name}`);
        }
        buttonCell.appendChild(mapButton);

      let nameCell = row.insertCell();
      nameCell.innerText = player.name + (Playerlist.isPlayerAfk(player) ? " (AFK)" : "");

      let coordsCell = row.insertCell();
        coordsCell.innerText = `${player.x}, ${player.z} | ${player.world}`;
    }
  }

  public static isPlayerAfk(player: MapPlayer) {
    return (player.x == 0 && player.z == 0) || (player.x == 25 && player.z == 42);
  }
}

interface MapPlayer {
  world: string;
  armor: number;
  name: string;
  x: number;
  health: number;
  z: number;
  uuid: string;
  yaw: number;
}
