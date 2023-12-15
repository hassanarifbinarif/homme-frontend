let requiredDataURL = `/admin/inventory?page=1&perPage=1000&search=`;

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
                        <td><div><span>4/31</span></div></td>
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
        
        inventoryDetailTable.appendChild(inventoryDetailThead);
        inventoryDetailTable.appendChild(inventoryDetailBody);
        inventoryDetailTable.classList.add('inventory-details-table');
        
        newRow.innerHTML = `<td colspan="7">
                                <div class="stock-details-container">
                                    <div class="container-header">
                                        <span>Stock Details</span>
                                        <div>
                                            <span class="cursor-pointer" onclick="getPurchaseOrder(event, ${id});">PRINT PURCHASE ORDER</span>
                                            <div>
                                                <span>Shipped</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none">
                                                    <path d="M13.2012 0L6.60059 8.00071L0 0H13.2012Z" fill="#030706"/>
                                                </svg>
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

        // Use html2pdf to generate the PDF
        // html2pdf().from(res.packing_data).set(options).save();

        html2pdf().from(res.purchase_data).set(options).toPdf().get('pdf').then(function (pdf) {
            // loader.classList.add('hide');
            let some = window.open(pdf.output('bloburl'), '_blank');
        });
        // afterLoad(button, buttonText);
    })
}