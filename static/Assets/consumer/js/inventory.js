let requiredDataURL = `/admin/inventory?page=1&perPage=1000&ordering=-id&search=`;

window.onload = () => {
    getData();
    getNotifications();
}

function searchForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let formData = new FormData(form);
    let data = formDataToObject(formData);
    requiredDataURL = setParams(requiredDataURL, 'search', `${data.search}`);
    getData(requiredDataURL);
}


async function getData(url=null) {
    let data;
    let tableBody = document.getElementById('inventory-table');
    if (url == null) {
        data = requiredDataURL;
    }
    else {
        data = url;
    }
    document.getElementById('table-loader').classList.remove('hide');
    tableBody.classList.add('hide');
    try {
        let response = await requestAPI('/consumer/get-inventory-list/', JSON.stringify(data), {}, 'POST');
        response.json().then(function(res) {
            if (res.success) {
                document.getElementById('table-loader').classList.add('hide');
                tableBody.innerHTML = res.inventory_data;
                tableBody.classList.remove('hide');
            }
        })
    }
    catch (err) {
        console.log(err);
    }
}


function insertTableHeaderRows(headerList, headerRow) {
    for (let i = 0; i < headerList.length; i++) {
        var th = document.createElement('th');
        th.innerHTML = `<div><span>${headerList[i]}</span></div>`;
        headerRow.appendChild(th);
    }
}


function insertTableBodyRows(data, tableBody) {
    data.forEach((item) => {
        var tr = document.createElement('tr');
        tr.innerHTML = `<td><div><span>${item.product.title}</span></div></td>
                        <td><div><span>${item.product.sku_num}</span></div></td>
                        <td><div><span>${item.current_stock}</span></div></td>
                        <td><div><span>${item.movement_week}/${item.movement_month}</span></div></td>
                        <td><div><span>${item.quantity}</span></div></td>`;
        tableBody.appendChild(tr);
    })
}


function showInventoryDetails(clickedRow, productList, salonName, salonContactNumber, salonAddress, salonNotes, id) {
    let table = document.getElementById('inventory-table');
    let nextRow = clickedRow.nextElementSibling;
    if (nextRow && nextRow.getAttribute('data-status') == "true") {
        nextRow.remove();
    }
    else {
        let newRow = table.insertRow(clickedRow.rowIndex + 1);
        newRow.setAttribute('data-status', true);
        let inventoryDetailTable = document.createElement('table');
        let inventoryDetailThead = document.createElement('thead');
        let inventoryDetailBody = document.createElement('tbody');
        let inventoryDetailTheadRow = document.createElement('tr');
        let inventoryDetailHeaderListItems = ['Product Name', 'SKU #', 'Current Stock', 'Movement (7/30 Days)', 'Quantity To Ship']
        
        insertTableHeaderRows(inventoryDetailHeaderListItems, inventoryDetailTheadRow);
        inventoryDetailThead.appendChild(inventoryDetailTheadRow);

        insertTableBodyRows(productList, inventoryDetailBody);
        
        inventoryDetailBody.id = `inventory-body-${id}`;
        inventoryDetailTable.appendChild(inventoryDetailThead);
        inventoryDetailTable.appendChild(inventoryDetailBody);
        inventoryDetailTable.classList.add('inventory-details-table');

        let status = clickedRow.getAttribute('data-status');
        
        newRow.innerHTML = `<td colspan="7">
                                <div class="stock-details-container">
                                    <div class="container-header">
                                        <span>Stock Details</span>
                                        <div>
                                            <span class="cursor-pointer" onclick="getPurchaseOrder(event, ${id});">PRINT PURCHASE ORDER</span>
                                            <div id="inventory-status-wrapper-${id}">
                                                ${status == 'shipped' ? '<span>Shipped</span>' : `<select name="status" onchange="changeInventoryStatus(event, ${id})" id="inventory-status-${id}">
                                                                                                    <option value="" selected disabled hidden>Pending</option>
                                                                                                    <option value="shipped">Shipped</option>
                                                                                                </select>`}
                                            </div>
                                        </div>
                                    </div>
                                    ${inventoryDetailTable.outerHTML}
                                    <div class="salon-info-header">
                                        <span>Salon Information</span>
                                    </div>
                                    <table class="inventory-details-table address-info-table">
                                        <thead>
                                            <th><div><span>Salon Name</span></div></th>
                                            <th><div><span>Phone Number</span></div></th>
                                            <th><div><span>Address</span></div></th>
                                            <th><div><span>Notes</span></div></th>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td><div><span class="table-text-overflow" title="${salonName}">${salonName}</span></div></td>
                                                <td><div><span>${salonContactNumber}</span></div></td>
                                                <td><div><span class="table-text-overflow" title="${salonAddress.street1}, ${salonAddress.city}, ${salonAddress.state} ${salonAddress.zip_code}">${salonAddress.street1}, ${salonAddress.city}, ${salonAddress.state} ${salonAddress.zip_code}</span></div></td>
                                                <td><div><span class="table-text-overflow" title="${salonNotes}">${salonNotes}</span></div></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </td>`;
    }
}


async function changeInventoryStatus(event, id) {
    try {
        let token = getCookie('admin_access');
        let headers = {
            "Authorization": `Bearer ${token}`,
            "Content-Type": 'application/json'
        };
        let response = await requestAPI(`${apiURL}/admin/inventory/${id}`, JSON.stringify({status: 'shipped'}), headers, 'PATCH');
        response.json().then(function(res) {

            if (response.status == 200) {
                document.getElementById(`row-status-field-${id}`).innerText = 'Shipped';
                let updatedRow = document.getElementById(`row-status-field-${id}`).closest('tr');
                updatedRow.setAttribute('data-status', 'shipped');
                
                let dropdownWrapper = document.getElementById(`inventory-status-wrapper-${id}`);
                dropdownWrapper.innerHTML = `<span>Shipped</span>`;

                let tableBody = document.getElementById(`inventory-body-${id}`);
                tableBody.innerHTML = '';
                insertTableBodyRows(res.data.products, tableBody);
            }
        })
    }
    catch (err) {
        console.log(err);
    }
}


async function getPurchaseOrder(event, id) {
    event.stopPropagation();

    // let loader = event.target.closest('td').querySelector('.inrow-loader');
    // loader.classList.remove('hide');
    let response = await requestAPI(`/consumer/get-purchase-order/${id}/`, null, {}, 'GET');
    response.json().then(function(res) {
        var options = {
            filename: 'generated-pdf.pdf',
            html2canvas: { scale: 4, useCORS: true, scrollY: 0, scrollX: 0 },
        };

        // html2pdf().from(res.packing_data).set(options).save();

        html2pdf().from(res.purchase_data).set(options).toPdf().get('pdf').then(function (pdf) {
            // loader.classList.add('hide');
            let some = window.open(pdf.output('bloburl'), '_blank');
        });
        // afterLoad(button, buttonText);
    })
}


const sortOrders = {};

function sortByAlphabets(event, columnIndex) {
    const arrows = event.target.closest('th').querySelectorAll('path');
    const table = document.getElementById("inventory-table");
    const currentOrder = sortOrders[columnIndex] || 'asc';

    document.querySelectorAll('tr[data-status="true"]').forEach((row) => row.remove());
    const rows = Array.from(table.rows).slice(1);

    rows.sort((rowA, rowB) => {
        const valueA = rowA.getElementsByTagName("td")[columnIndex].textContent.toLowerCase();
        const valueB = rowB.getElementsByTagName("td")[columnIndex].textContent.toLowerCase();

        return currentOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    });

    const tbody = table.querySelector('tbody');
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    for (let i = 0; i < rows.length; i++) {
        tbody.appendChild(rows[i]);
    }

    arrows[0].setAttribute('opacity', currentOrder === 'asc' ? '0.2' : '1');
    arrows[1].setAttribute('opacity', currentOrder === 'asc' ? '1' : '0.2');
    
    sortOrders[columnIndex] = currentOrder === 'asc' ? 'desc' : 'asc';
}


function extractNumber(value) {
    const match = value.match(/\d+/);
    return match ? parseFloat(match[0]) : 0;
}

function sortByDigits(event, columnIndex) {
    const columnArrows = event.target.closest('th').querySelectorAll('path');
    const table = document.getElementById("inventory-table");
    const tbody = table.querySelector('tbody');
    document.querySelectorAll('tr[data-status="true"]').forEach((row) => row.remove());
    const rows = Array.from(tbody.rows);

    const currentOrder = sortOrders[columnIndex] || 'asc';

    const sortedRows = rows.sort((rowA, rowB) => {
        const x = extractNumber(rowA.getElementsByTagName("td")[columnIndex].textContent);
        const y = extractNumber(rowB.getElementsByTagName("td")[columnIndex].textContent);

        return currentOrder === 'asc' ? x - y : y - x;
    });

    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    for (const sortedRow of sortedRows) {
        tbody.appendChild(sortedRow);
    }

    columnArrows[0].setAttribute('opacity', currentOrder === 'asc' ? '0.2' : '1');
    columnArrows[1].setAttribute('opacity', currentOrder === 'asc' ? '1' : '0.2');

    sortOrders[columnIndex] = currentOrder === 'asc' ? 'desc' : 'asc';
}


function reverseTableRows() {
    const table = document.getElementById('inventory-table');
    const tableBody = table.querySelector('tbody');
    document.querySelectorAll('tr[data-status="true"]').forEach((row) => row.remove());
    const rows = Array.from(tableBody.querySelectorAll('tr'));

    rows.reverse();
    tableBody.innerHTML = '';

    for (const row of rows) {
        tableBody.appendChild(row);
    }
}