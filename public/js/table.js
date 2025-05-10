// funktion til at lave en tabel baseret på data fra backend
function createTable(data, options, tableID){

    const { columns, link, reverse } = options;

    // Opret tabel element
    const table = document.createElement('table');

    // Opret header
    const thead = document.createElement('thead');
    // Lav en række til headeren
    const headerRow = document.createElement('tr');
    // Loop gennem kolonnerne og tilføj dem til headeren
    columns.forEach(column => {
        const th = document.createElement('th');
        th.textContent = column.name;
        headerRow.appendChild(th);
    });

    // Tilføj headeren til thead
    thead.appendChild(headerRow);
    // Tilføj thead til tabellen
    table.appendChild(thead);


    // Opret en body
    const tbody = document.createElement('tbody');
    // Loop gennem hver række i data'en og tilføj dem til bodyen
    data.forEach(rowData => {
        // Først laver vi en række
        const row = document.createElement('tr');

        // Loop gennem kolonnerne og tilføj dem til rækken
        columns.forEach(column => {
            const td = document.createElement('td');
            // Hvis column har en custom callback funktion så kalder vi den
            if(column.callback){
                const value = column.callback(rowData)
                if(value instanceof HTMLElement){
                    // Hvis det er et element så tilføjer vi det til td
                    td.appendChild(value);
                } else {
                    // Ellers sætter vi værdien til td
                    td.textContent = value;
                }
            } else { //hvis ingen callback-funktion sættes værdien direkte ind
                td.textContent = rowData[column.key];
            }
            row.appendChild(td);
        })

        if(link){
            row.addEventListener('click', () => {
                // Redirect til linket

                window.location.href = `${link.href}/${rowData[link.key]}`;
            })
        }
        
        if (reverse) {
            tbody.prepend(row)
        } else {tbody.appendChild(row)}
    })

    // Tilføj bodyen til tabellen
    table.appendChild(tbody);

    // Tilføj tabellen til bodyen
    const tableContainer = document.getElementById(tableID);
    if(!tableContainer){
        console.error(`Table container with ID ${tableID} not found`);
        return;
    }
    // Fjerner gamle indhold - til når man skifter mellem views
    tableContainer.innerHTML = '';
    tableContainer.appendChild(table); // Tilføj tabellen til child
    return;

}

export default createTable;