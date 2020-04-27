
/*Własne funkcje porównywania znaków*/

let sortDirection = false;
let tableHand;
let dataList;
let dataListCurrent;
let toSortDataList = [];
let tbody;

function sortDateCol(sort, colID) {
    toSortDataList = toSortDataList.sort((p1,p2) =>{
        return sort ? new Date(p1[colID]) - new Date(p2[colID]) : new Date(p2[colID]) - new Date(p1[colID]);
    });
}
function sortNumberCol(sort, colID) {
    toSortDataList = toSortDataList.sort((p1,p2) =>{
        return sort ? p1[colID] - p2[colID] : p2[colID] - p1[colID]  ;
    });
}
function sortStringCol(sort, colID) {
    toSortDataList = toSortDataList.sort((p1,p2) =>{
        return sort ? p1[colID].localeCompare(p2[colID]) : p2[colID].localeCompare( p1[colID])  ;
    });
}
/*Funkcja sortującja po kolumnie tabeli*/
function sortColumn(colID, specialType)
{
    sortDirection = !sortDirection;
    const dataType = typeof dataListCurrent.rows[0][colID];

    let sortedCol = document.querySelectorAll('.sortedColumn');
    for(let sortedItem of sortedCol)
        sortedItem.classList.remove('sortedColumn');
    let thisCol = document.getElementById('tableColHeader'+colID);
    thisCol.classList.add('sortedColumn');
    if(sortDirection)
        thisCol.classList.add("sortDesc");
    else
        thisCol.classList.remove("sortDesc");
    let i = 0;
    let key = 0;
    while(i < dataListCurrent.rows.length)
    {
        let value = dataListCurrent.rows[i];
        if(value.length > 0)
        {
            toSortDataList[key]=value;
            key++;
            i++;
        }
        else
        {
            i = i+2;
        }
    }

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
    dataListCurrent.rows = toSortDataList;
    setBodyRow();
}

function setBodyRow(specialDataList)
{
    let innerHTML = '';
    let datalist2;
    if(typeof specialDataList !== 'undefined')
        dataList2 = specialDataList;
    else
        dataList2 = dataListCurrent;

    console.debug(dataList2);

    for(let row of dataList2.rows)
    {
        innerHTML += '<tr class="datatable datatable__row"> ';
        let i=0;
        for(let data of row)
        {
            let specialClass = '', specialAttr = '';
            if(dataList2.col[i].specialClass != null)
            {
                let classes = dataList2.col[i].specialClass.split(" ");
                classes.forEach((item) => {
                    if(typeof dataList2.specialAttr[item] !== "undefined")
                        specialAttr= `data-tableAttr="${dataList2.specialAttr[item]}"`;
                });

                specialClass = dataList2.col[i].specialClass;
            }

            switch (dataList2.col[i].type) {
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
                    innerHTML += `<td class="${specialClass}" ${specialAttr}><a href="${data.href}">${data.label}</a> </td>`;
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
    dataListCurrent = JSON.parse(JSON.stringify(dataList));

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

    let searchText = e.target.value.toUpperCase();
    let i = 0;
    dataListCurrent = JSON.parse(JSON.stringify(dataList));

    for(let row of dataListCurrent.rows)
    {
        let sum = false;
        for(let column of row)
        {
            if (column.toString().toUpperCase().indexOf(searchText) > -1){
                sum = true;
            }
        }
        if(!sum){
            dataListCurrent.rows[i] = [];
        }

        i++;
    }
    setBodyRow(dataListCurrent);

}

function initSearchDataTable(elementHandler) {

    elementHandler.addEventListener("input", filterAll);
}