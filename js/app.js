
/*Własne funkcje porównywania znaków*/

let sortDirection = false;
let tableHand;
let dataList;
let tbody;

function sortDateCol(sort, colID) {
    dataList.rows = dataList.rows.sort((p1,p2) =>{
        return sort ? new Date(p1[colID]) - new Date(p2[colID]) : new Date(p2[colID]) - new Date(p1[colID]);
    });
    console.log("Date");
}
function sortNumberCol(sort, colID) {
    dataList.rows = dataList.rows.sort((p1,p2) =>{
        return sort ? p1[colID] - p2[colID] : p2[colID] - p1[colID]  ;
    });
}
function sortStringCol(sort, colID) {
    dataList.rows = dataList.rows.sort((p1,p2) =>{
        return sort ? p1[colID].localeCompare(p2[colID]) : p2[colID].localeCompare( p1[colID])  ;
    });
}
/*Funkcja sortującja po kolumnie tabeli*/
function sortColumn(colID, specialType)
{
    sortDirection = !sortDirection;
    const dataType = typeof dataList.rows[0][colID];

    let sortedCol = document.querySelectorAll('.sortedColumn');
    for(let sortedItem of sortedCol)
        sortedItem.classList.remove('sortedColumn');
    let thisCol = document.getElementById('tableColHeader'+colID);
    thisCol.classList.add('sortedColumn');
    if(sortDirection)
        thisCol.classList.add("sortDesc");
    else
        thisCol.classList.remove("sortDesc");

    if(typeof specialType != 'undefined')
    {
        switch (specialType) {
            case 'date':
                sortDateCol(sortDirection, colID);
                break;
            case 'nosort':
                break;
            default:
                sortNumberCol(sortDirection, colID);
        }

    }
    else
    {
        switch (dataType) {
            case 'number':
                sortNumberCol(sortDirection, colID);
                break;
            case 'string':
                sortStringCol(sortDirection, colID);
                break;
        }
    }

    setBodyRow();
}

function setBodyRow() {
    let innerHTML = '';

    for(let row of dataList.rows)
    {
        innerHTML += '<tr class="datatable datatable__row"> ';
        let i=0;
        for(let data of row)
        {
            let specialClass = '', specialAttr = '';
            if(dataList.col[i].specialClass != null)
            {
                let classes = dataList.col[i].specialClass.split(" ");
                classes.forEach((item) => {
                    if(typeof dataList.specialAttr[item] !== "undefined")
                        specialAttr= `data-tableAttr="${dataList.specialAttr[item]}"`;
                });

                specialClass = dataList.col[i].specialClass;
            }

            switch (dataList.col[i].type) {
                case "status":
                    switch (data) {
                        case 0:
                            specialClass += " red";
                            break;
                        case 1:
                            specialClass += " orange";
                            break;
                        case 2:
                            specialClass += " green";
                            break;
                        default:
                            specialClass += " red";
                    }
                    innerHTML += `<td class="${specialClass}" ${specialAttr}>${data}</td>`;
                    break;
                case "button":
                    innerHTML += `<td class="${specialClass}" ${specialAttr}><a href="#wad">${data}</a> </td>`;
                    break;
                default:
                    innerHTML += `<td class="${specialClass}" ${specialAttr}>${data}</td>`;
            }


            i++
        }
        innerHTML += '</tr>';
    }
    tbody.innerHTML = innerHTML;
}

function loadTableBody() {
    tbody = document.createElement("tbody");
    tbody.classList.add("datatable");
    tbody.classList.add("datatable__body");
    tableHand.appendChild(tbody);

    setBodyRow();
}

function initDataTables(elementHandler, tableObject) {

    tableHand = elementHandler;
    dataList = tableObject;


    /*Load head*/
    if (typeof tableObject.head !== "undefined")
    {

        let thead = document.createElement("thead");
        let tr = document.createElement("tr");
        thead.classList.add("datatable");
        thead.classList.add("datatable__header");
        thead.appendChild(tr);

        let tdElements = '';
        let i = 0;
        for (let tdElement of tableObject.head) {
            let specialType = '';
            if(tableObject.col[i].type != null)
            {
                specialType = `, '`+tableObject.col[i].type+`'`;
            }
            tdElements += `<th id="tableColHeader${i}" class="" onclick="sortColumn(${i}${specialType})">${tdElement}</th>`;


            i++;
        }
        elementHandler.appendChild(thead).innerHTML = `<tr>${tdElements}</tr>`;
    }
    else
        console.error('Objekt danych nie posiada nagłówka "head"');

    /*Load body*/

    if (typeof tableObject.rows !== "undefined")
    {
        loadTableBody(dataList);
    }
    else
        console.error('Objekt danych nie posiada elementu "rows"');

}

function filterAll(e) {
    console.log(e.target.value);

}

function initSearchDataTable(elementHandler) {

    elementHandler.addEventListener("keyup", filterAll);
}