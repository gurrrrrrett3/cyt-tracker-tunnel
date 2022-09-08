export default class Logger {
    public static log(text: string) {
        const logTable = document.getElementById("logTable") as HTMLTableElement;
        let row = logTable.insertRow();
        let cell = row.insertCell();
        cell.innerText = text;

        const rowCount = logTable.rows.length;
        if (rowCount > 100) {
            logTable.deleteRow(0);
        }

        row.className = rowCount % 2 == 0 ? "" : "table-active";
    }
}