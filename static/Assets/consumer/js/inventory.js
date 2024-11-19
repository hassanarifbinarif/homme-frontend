let requiredDataURL = `/admin/inventory?ordering=-id&page=1&perPage=50&search=`;
let currentPage = 1;
let previousPageBtn = document.getElementById('previous-nav-btn');
let nextPageBtn = document.getElementById('next-nav-btn');
let currentPageElement = document.getElementById('current-nav-page');

window.onload = () => {
    const { startOfWeek, endOfWeek } = getStartAndEndOfCurrentWeek();
    requiredDataURL = setParams(requiredDataURL, 'created_at__gte', startOfWeek);
    requiredDataURL = setParams(requiredDataURL, 'created_at__lte', endOfWeek);
    document.getElementById('start-date').value = startOfWeek;
    document.getElementById('end-date').value = endOfWeek;

    dateTimeString = convertDateTime(startOfWeek) + ', ' + convertDateTime(endOfWeek);
    document.getElementById('selected-date-range').innerText = dateTimeString;
    document.getElementById('selected-date-range').title = dateTimeString;
    getData();
    // document.querySelector('span[data-value="current_week"]').click();
    // getNotifications();
}

function searchForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let formData = new FormData(form);
    let data = formDataToObject(formData);
    requiredDataURL = setParams(requiredDataURL, 'search', `${data.search}`);
    requiredDataURL = setParams(requiredDataURL, 'page', '1');
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
        document.querySelector('.order-details-wrapper').style.backgroundColor = '#000000';
        document.querySelector('.order-details-wrapper').style.overflow = 'hidden';
        let response = await requestAPI('/consumer/get-inventory-list/', JSON.stringify(data), {}, 'POST');
        response.json().then(function(res) {
            document.querySelector('.order-details-wrapper').style.overflow = 'auto';
            document.querySelector('.order-details-wrapper').style.backgroundColor = '#FFFFFF';
            if (res.success) {
                document.getElementById('table-loader').classList.add('hide');
                tableBody.innerHTML = res.inventory_data;
                tableBody.classList.remove('hide');
                setPaginationLinks(res.pagination_data);
            }
        })
    }
    catch (err) {
        console.log(err);
    }
}


function setPaginationLinks(paginationData) {
    currentPage = paginationData.currentPage;
    currentPageElement.innerText = currentPage;

    if (paginationData.links.next != null) {
        nextPageBtn.classList.remove('opacity-point-6');
        nextPageBtn.classList.add('cursor-pointer');
        nextPageBtn.setAttribute('onclick', `getPageData(${currentPage + 1})`);
    }
    else {
        nextPageBtn.classList.add('opacity-point-6');
        nextPageBtn.classList.remove('cursor-pointer');
        nextPageBtn.removeAttribute('onclick');
    }

    if (paginationData.links.previous != null) {
        previousPageBtn.classList.remove('opacity-point-6');
        previousPageBtn.classList.add('cursor-pointer');
        previousPageBtn.setAttribute('onclick', `getPageData(${currentPage - 1})`);
    }
    else {
        previousPageBtn.classList.add('opacity-point-6');
        previousPageBtn.classList.remove('cursor-pointer');
        previousPageBtn.removeAttribute('onclick');
    }
}


function getPageData(pageNumber) {
    requiredDataURL = setParams(requiredDataURL, 'page', pageNumber);
    getData(requiredDataURL);
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
                                            <div class="d-flex justify-content-center align-items-center hide inrow-loader">
                                                <span class="spinner-border spinner-border-sm" style="color: #000093;" role="status" aria-hidden="true">
                                                </span>
                                            </div>
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

    let loader = event.target.closest('td').querySelector('.inrow-loader');
    if (loader)
        loader.classList.remove('hide');
    
    let response = await requestAPI(`/consumer/get-purchase-order/${id}/`, null, {}, 'GET');
    response.json().then(async function(res) {

        var options = {
            filename: 'generated-pdf.pdf',
            image: { type: 'jpeg', quality: '.8' },
            html2canvas: { scale: 2, useCORS: true, allowTaint:true, scrollY: 0, scrollX: 0, imageTimeout: 10000000, dpi: 300 },
            jsPDF: { unit: 'px', format: [648, 860], hotfixes: ['px_scaling'], orientation: 'portrait' }
        };

        // html2pdf().from(res.packing_data).set(options).save();

        html2pdf().from(res.purchase_data).set(options).outputPdf().get('pdf').then(function (pdf) {
            if (loader)
                loader.classList.add('hide');
            let some = window.open(pdf.output('bloburl'), '_blank');
        });
        // afterLoad(button, buttonText);
    })
}


let dateSelectorBtn = document.getElementById('date-selector-btn');
let dateSelectorInputWrapper = document.getElementById('date-selector');

let statusBtn = document.getElementById('status-btn');
let statusWrapper = document.getElementById('status-selector');


function closeDropdowns(event) {
    if ((!dateSelectorBtn.contains(event.target)) && dateSelectorInputWrapper.style.display == 'flex') {
        dateSelectorInputWrapper.style.display = 'none';
        document.querySelector('.order-details-wrapper').style.overflow = 'auto';
    }
    else if ((!statusBtn.contains(event.target)) && statusWrapper.style.display == 'flex') {
        statusWrapper.style.display = 'none';
    }
}

document.body.addEventListener('click', closeDropdowns);


function toggleDateSelectorDropdown(event) {
    if ((dateSelectorBtn.contains(event.target)) && dateSelectorInputWrapper.style.display == 'none') {
        dateSelectorInputWrapper.style.display = 'flex';
        document.querySelector('.order-details-wrapper').style.overflow = 'hidden';
    }
    else if ((dateSelectorBtn.querySelector('span').contains(event.target) || dateSelectorBtn.querySelector('svg').contains(event.target)) && dateSelectorInputWrapper.style.display == 'flex') {
        dateSelectorInputWrapper.style.display = 'none';
        document.querySelector('.order-details-wrapper').style.overflow = 'auto';
    }
    else if ((dateSelectorBtn.querySelector('.date-selector').contains(event.target)) && dateSelectorInputWrapper.style.display == 'flex') {
    }
    else {
        dateSelectorInputWrapper.style.display = 'none';
        document.querySelector('.order-details-wrapper').style.overflow = 'auto';
    }
}

function toggleDateInputs(event) {
    if (event.target.nextElementSibling.classList.contains('hide')) {
        event.target.nextElementSibling.classList.remove('hide');
        event.target.style.background = '#FFF';
        event.target.style.color = '#000093';
        document.querySelector('.order-details-wrapper').style.overflow = 'hidden';
    }
    else {
        event.target.nextElementSibling.classList.add('hide');
        event.target.style.color = '#FFF';
        event.target.style.background = '#000093';
    }
}

function filterDataRangeOption(event) {
    let element = event.target;
    let startDate, endDate;
    let dateTimeString = '';

    if (element.innerText == 'CURRENT WEEK') {
        const { startOfWeek, endOfWeek } = getStartAndEndOfCurrentWeek();
        requiredDataURL = setParams(requiredDataURL, 'created_at__gte', startOfWeek);
        requiredDataURL = setParams(requiredDataURL, 'created_at__lte', endOfWeek);
        document.getElementById('start-date').value = startOfWeek;
        document.getElementById('end-date').value = endOfWeek;

        dateTimeString = convertDateTime(startOfWeek) + ', ' + convertDateTime(endOfWeek);
        document.getElementById('selected-date-range').innerText = dateTimeString;
        document.getElementById('selected-date-range').title = dateTimeString;
    }
    else if (element.innerText == 'LAST WEEK') {
        const { startOfPreviousWeek, endOfPreviousWeek } = getStartAndEndOfPreviousWeek();
        requiredDataURL = setParams(requiredDataURL, 'created_at__gte', startOfPreviousWeek);
        requiredDataURL = setParams(requiredDataURL, 'created_at__lte', endOfPreviousWeek);
        document.getElementById('start-date').value = startOfPreviousWeek;
        document.getElementById('end-date').value = endOfPreviousWeek;
        
        dateTimeString = convertDateTime(startOfPreviousWeek) + ', ' + convertDateTime(endOfPreviousWeek)
        document.getElementById('selected-date-range').innerText = dateTimeString;
        document.getElementById('selected-date-range').title = dateTimeString;
    }
    else if (element.innerText == 'LAST MONTH') {
        const { startOfLastMonth, endOfLastMonth } = getStartAndEndOfLastMonth();
        requiredDataURL = setParams(requiredDataURL, 'created_at__gte', startOfLastMonth);
        requiredDataURL = setParams(requiredDataURL, 'created_at__lte', endOfLastMonth);
        document.getElementById('start-date').value = startOfLastMonth;
        document.getElementById('end-date').value = endOfLastMonth;

        dateTimeString = convertDateTime(startOfLastMonth) + ', ' + convertDateTime(endOfLastMonth);
        document.getElementById('selected-date-range').innerText = dateTimeString;
        document.getElementById('selected-date-range').title = dateTimeString;
    }
    getData();
    setTimeout(() => {
        dateSelectorBtn.click();
    }, 100)
}

function dateRangeForm(event) {
    event.preventDefault();
    let form = event.target.closest('form');
    let formData = new FormData(form);
    let data = formDataToObject(formData);
    if (data.start_date == '' || data.end_date == '') {
        return false;
    }
    else if (isNaN(new Date(data.start_date)) || isNaN(new Date(data.end_date))) {
        return false;
    }
    else if (new Date(data.end_date) - new Date(data.start_date) <= 0) {
        return false;
    }
    else {
        requiredDataURL = setParams(requiredDataURL, 'created_at__gte', data.start_date);
        requiredDataURL = setParams(requiredDataURL, 'created_at__lte', data.end_date);
        getData(requiredDataURL);

        let dateTimeString = convertDateTime(data.start_date) + ', ' + convertDateTime(data.end_date);
        document.getElementById('selected-date-range').innerText = dateTimeString;
        document.getElementById('selected-date-range').title = dateTimeString;
    }
}


function toggleStatusDropdown(event) {
    if ((statusBtn.contains(event.target)) && statusWrapper.style.display == 'none') {
        statusWrapper.style.display = 'flex';
    }
    else if ((statusBtn.querySelector('span').contains(event.target) || statusBtn.querySelector('svg').contains(event.target)) && statusWrapper.style.display == 'flex') {
        statusWrapper.style.display = 'none';
    }
    else if ((statusBtn.querySelector('.status-selector').contains(event.target)) && statusWrapper.style.display == 'flex') {
    }
    else {
        statusWrapper.style.display = 'none';
    }
}

function filterStatusOption(event) {
    let element = event.target;
    requiredDataURL = setParams(requiredDataURL, 'status', element.getAttribute('data-value'));
    getData();
    document.getElementById('selected-status-text').innerText = element.innerText;
    setTimeout(() => {
        statusBtn.click();
    }, 100)
}


// For current week

function getStartAndEndOfCurrentWeek() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const daysUntilMonday = (dayOfWeek + 6) % 7;
    
    let startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - daysUntilMonday);
    startOfWeek.setHours(0, 0, 0, 0);
    
    let endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const timezoneOffset = now.getTimezoneOffset() * 60000;

    startOfWeek = new Date(startOfWeek.getTime() - timezoneOffset).toISOString();
    endOfWeek = new Date(endOfWeek.getTime()).toISOString();

    return {
        startOfWeek,
        endOfWeek,
    };
}


// For last week

function getStartAndEndOfWeek(date) {
    const startOfWeek = new Date(date);
    const endOfWeek = new Date(date);

    const dayOfWeek = date.getDay();

    startOfWeek.setDate(date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
    startOfWeek.setHours(0, 0, 0, 0);

    endOfWeek.setDate(date.getDate() + (7 - dayOfWeek + (dayOfWeek === 0 ? -6 : 0)));
    endOfWeek.setHours(23, 59, 59, 999);

    return {
        startOfWeek,
        endOfWeek,
    };
}

function getStartAndEndOfPreviousWeek() {
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);

    const { startOfWeek, endOfWeek } = getStartAndEndOfWeek(lastWeek);

    const timezoneOffset = today.getTimezoneOffset() * 60000;
    return {
        startOfPreviousWeek: new Date(startOfWeek.getTime() - timezoneOffset).toISOString().split('T')[0],
        endOfPreviousWeek: new Date(endOfWeek.getTime() - timezoneOffset).toISOString().split('T')[0],
    };
}


// For last month

function getStartAndEndOfLastMonth() {
    const today = new Date();
    const lastMonth = new Date(today);
  
    lastMonth.setDate(1);
  
    lastMonth.setDate(0);
  
    let startOfLastMonth = new Date(lastMonth);
    startOfLastMonth.setDate(1);
    startOfLastMonth.setHours(0, 0, 0, 0);
  
    let endOfLastMonth = new Date(lastMonth);
    endOfLastMonth.setHours(23, 59, 59, 999);

    // Adjust for time zone offset
    const timezoneOffset = today.getTimezoneOffset() * 60000;
    
    startOfLastMonth = new Date(startOfLastMonth.getTime() - timezoneOffset).toISOString().split('T')[0];
    endOfLastMonth = new Date(endOfLastMonth.getTime() - timezoneOffset).toISOString().split('T')[0];
  
    return {
        startOfLastMonth,
        endOfLastMonth,
    };
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


function convertDateTime(dateString) {
    const inputDate = new Date(dateString);

    const day = new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(inputDate);
    const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(inputDate);
    const year = new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(inputDate);

    const result = `${day}-${month}-${year}`;

    return result;
}