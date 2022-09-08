export default class Ticker {
    
    tickerElement: HTMLParagraphElement = document.getElementById("ticker") as HTMLParagraphElement;
    
    constructor() {
        setInterval(this.update.bind(this), 1000);
    }

    public async update() {
        let data = await fetch("/ws/ticker").then((res) => res.json());
        let ticker = data.data as string;
        this.tickerElement.innerText = ticker;
    }
}