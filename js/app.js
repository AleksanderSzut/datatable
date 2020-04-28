
/*Własne funkcje porównywania znaków*/
// mainFunc
let sortDirection = false;
let tableHand;//Table handler
let dataList; //orginal data list
//sort
let dataListCurrent; //data list current used
let toSortDataList = []; //data list to filter *Delete empty rows*
let tbody; //tbody element in table handler

//pagination
let paginationNav;//Pagination container
let quantityOnPage = 20;
let idPage = 1;

//global function

function lengthWithoutEmpty(arr) {
    let i = 0;
    arr.forEach((value)=>{
        if(value.length > 0)
            i++;
    });
    return i;
}

//sorting function
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
            i++;
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



    let rowI = 1;
    for(let row of dataList2.rows)
    {
        if(row.length > 0)
        {
            let pageNumber =  Math.ceil(rowI/ quantityOnPage);

            if(idPage === pageNumber)
            {
                innerHTML += '<tr class="datatable__table datatable__table__row"> ';
                let i = 0;
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
            rowI++;
        }
    }
    tbody.innerHTML = innerHTML;
}

function loadTableBody() {
    tbody = document.createElement("tbody");
    tbody.classList.add("datatable__table");
    tbody.classList.add("datatable__table__body");
    tableHand.appendChild(tbody);

    setBodyRow();
}


function filterAll(e) {

    let searchText = e.target.value.toUpperCase();

    let i = 0;

    dataListCurrent = JSON.parse(JSON.stringify(dataList));

    let sortedColumn = document.querySelector(".sortedColumn");


    if(sortedColumn != null){
        sortedColumn.classList.remove("sortedColumn");
        sortedColumn.classList.remove("sortDesc");
    }

    for(let row of dataListCurrent.rows)
    {
        let sum = false;
        for(let column of row)
        {
            if (column.toString().toUpperCase().indexOf(searchText) > -1)
            {
                sum = true;
            }
        }
        if(!sum){
            dataListCurrent.rows[i] = [];
        }

        i++;
    }
    setPaginationNav();
    setBodyRow(dataListCurrent);
}

function initPagination(elementHandler, quantityOnPageAttr) {
    if(typeof quantityOnPageAttr !== 'undefined')
    {
        quantityOnPage = quantityOnPageAttr;
    }



}

function initSearchDataTable(elementHandler) {

    elementHandler.addEventListener("input", filterAll);
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
        thead.classList.add("datatable__table");
        thead.classList.add("datatable__table__header");
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

function initQuantityInput(inputHandler) {
    inputHandler.value = quantityOnPage;
    inputHandler.addEventListener("change",  function (e) {
        changeQuantity(e.target.value);
    });

}

function setPaginationNav(navHandler) {
    let numberPages =  Math.ceil(lengthWithoutEmpty(dataListCurrent.rows)/quantityOnPage);

    if(typeof navHandler !== 'undefined')
        paginationNav = navHandler;

    let itemNav = document.createElement("div");
    itemNav.classList.add("datatable__pagination");
    itemNav.classList.add("datatable__pagination__item");
    paginationNav.innerHTML = '';
    for(let i=1; i <= numberPages; i++)
    {
        let el = itemNav.cloneNode(true);
        el.innerText = `${i}`;
        el.addEventListener("click", function (e) {

            let active = document.querySelector(".datatable__pagination__item.active");
            if(active != null)
                active.classList.remove("active");

            e.target.classList.add("active");

            idPage = i;

            setBodyRow();
        });
        paginationNav.appendChild(el);
    }

}

//change function

function changeQuantity(quantity) {
    if(quantity < 1)
        quantityOnPage = 1;
    else
        quantityOnPage = quantity;
    setPaginationNav();
    setBodyRow();
}

