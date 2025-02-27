let dateSelectorBtn = document.getElementById('date-selector-btn');
let dateSelectorInputWrapper = document.getElementById('date-selector');

let monthDropdown = document.getElementById('month-dropdown');
let monthField = document.getElementById('month-field');

let yearDropdown = document.getElementById('year-dropdown');
let yearField = document.getElementById('year-field');

let statusBtn = document.getElementById('status-btn');
let statusWrapper = document.getElementById('status-selector');

let hairstylistBtn = document.getElementById('hairstylist-btn');
let hairstylistWrapper = document.getElementById('hairstylist-selector');
let hairstylistDropdown = document.getElementById('hairstylist-dropdown');
let hairstylistData = {};
let selectedHairStylist = '';

let salonFilerBtn = document.getElementById('salon-btn');
let salonFilterWrapper = document.getElementById('salon-selector');

let requiredDataURL = `/admin/salons/commissions/monthly?page=1&perPage=1000&search=&ordering=-date`;
let requiredHairStylistURL = '/admin/salons/stylists?perPage=1000';

let filterMonthValue = null;
let filterYearValue = null;

monthField.addEventListener('click', toggleDropdown);
yearField.addEventListener('click', toggleDropdown);


window.onload = () => {
    // getNotifications();
    getData();
    populateSalonDropdown();
    populateYearList(20);
    populateHairStylists();
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


function toggleHairstylistDropdown(event) {
    if ((hairstylistBtn.contains(event.target)) && hairstylistWrapper.style.display == 'none') {
        hairstylistWrapper.style.display = 'flex';
    }
    else {
        statusWrapper.style.display = 'none';
    }
}

function toggleSalonDropdown(event) {
    if ((salonFilerBtn.contains(event.target)) && salonFilterWrapper.style.display == 'none') {
        salonFilterWrapper.style.display = 'flex';
    }
    else {
        statusWrapper.style.display = 'none';
    }
}


function toggleDateSelectorDropdown(event) {
    if ((dateSelectorBtn.contains(event.target)) && dateSelectorInputWrapper.style.display == 'none') {
        dateSelectorInputWrapper.style.display = 'flex';
    }
    else if ((dateSelectorBtn.querySelector('span').contains(event.target) || dateSelectorBtn.querySelector('svg').contains(event.target)) && dateSelectorInputWrapper.style.display == 'flex') {
        dateSelectorInputWrapper.style.display = 'none';
    }
    else if ((dateSelectorBtn.querySelector('.date-selector').contains(event.target)) && dateSelectorInputWrapper.style.display == 'flex') {
    }
    else {
        dateSelectorInputWrapper.style.display = 'none';
    }
}


function toggleDropdown(event) {
    let elementBtn = event.target;
    if(!elementBtn.classList.contains('filter-btn')) {
        elementBtn = elementBtn.closest('.filter-btn');
    }
    let elementDropdown = elementBtn.nextElementSibling;
    if(elementDropdown.style.display == 'flex') {
        elementDropdown.style.display = 'none';
    }
    else {
        elementDropdown.style.display = 'flex';
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


function searchSalon(event, inputElement) {
    if (event.keyCode == 13) {
        requiredDataURL = setParams(requiredDataURL, 'salon__salon_name__icontains', inputElement.value);
        getData();
        document.getElementById('selected-salon-filter-text').innerText = inputElement.value == '' ? 'SALON' : inputElement.value;
        document.getElementById('selected-salon-filter-text').title = inputElement.value == '' ? 'SALON' : inputElement.value;
        salonFilterWrapper.style.display = 'none';
    }
}


function closeDropdowns(event) {
    if ((!statusBtn.contains(event.target)) && statusWrapper.style.display == 'flex') {
        statusWrapper.style.display = 'none';
    }
    if ((!hairstylistBtn.contains(event.target)) && hairstylistWrapper.style.display == 'flex') {
        hairstylistWrapper.style.display = 'none';
    }
    if ((!salonFilerBtn.contains(event.target)) && salonFilterWrapper.style.display == 'flex') {
        salonFilterWrapper.style.display = 'none';
    }
    if ((!dateSelectorBtn.contains(event.target)) && dateSelectorInputWrapper.style.display == 'flex') {
        dateSelectorInputWrapper.style.display = 'none';
    }
    if ((!monthField.contains(event.target)) && monthDropdown.style.display == 'flex') {
        monthDropdown.style.display = 'none';
    }
    if ((!yearField.contains(event.target)) && yearDropdown.style.display == 'flex') {
        yearDropdown.style.display = 'none';
    }
}

document.body.addEventListener('click', closeDropdowns);


function filterMonthOption(inputElement) {
    filterMonthValue = inputElement.getAttribute('data-value');
    requiredDataURL = setParams(requiredDataURL, 'date__month', filterMonthValue);
    getData();
    document.getElementById('selected-month-text').innerText = inputElement.innerText;
    document.getElementById('selected-month-value').innerText = inputElement.innerText;
}


function filterYearOption(inputElement) {
    filterYearValue = inputElement.innerText;
    requiredDataURL = setParams(requiredDataURL, 'date__year', filterYearValue);
    getData();
    document.getElementById('selected-year-text').innerText = inputElement.innerText;
    document.getElementById('selected-year-value').innerText = inputElement.innerText;
}


function searchForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let formData = new FormData(form);
    let data = formDataToObject(formData);
    requiredDataURL = setParams(requiredDataURL, 'search', `${data.search}`);
    getData(requiredDataURL);
}


function sortBySalonBtn(event) {
    let arrows = event.target.closest('button').querySelectorAll('path');
    let newOrderingValue = '';
    let paramsArray = requiredDataURL.split('&');
    let currentOrderingValue;

    for (let i = 0; i < paramsArray.length; i++) {
        if (paramsArray[i].startsWith('ordering=')) {
            currentOrderingValue = paramsArray[i].substring('ordering='.length);
            if (currentOrderingValue == '-salon') {
                newOrderingValue = 'salon';
                arrows[0].setAttribute('opacity', '.2');
                arrows[1].setAttribute('opacity', '1');
            }
            else {
                newOrderingValue = '-salon';
                arrows[0].setAttribute('opacity', '1');
                arrows[1].setAttribute('opacity', '.2');
            }
            paramsArray[i] = 'ordering=' + newOrderingValue;
            break;
        }
    }

    requiredDataURL = paramsArray.join('&');
    getData(requiredDataURL);
}


async function getData(url=null) {
    let data;
    let tableBody = document.getElementById('commission-table');
    if (url == null) {
        data = requiredDataURL;
    }
    else {
        data = url;
    }
    document.getElementById('table-loader').classList.remove('hide');
    tableBody.classList.add('hide');
    try {
        let response = await requestAPI('/consumer/get-commissions-list/', JSON.stringify(data), {}, 'POST');
        response.json().then(function(res) {
            if (res.success) {
                document.getElementById('table-loader').classList.add('hide');
                tableBody.innerHTML = res.commission_data;
                convertDateTime();
                tableBody.classList.remove('hide');
            }
        })
    }
    catch (err) {
        console.log(err);
    }
}


async function populateHairStylists() {
    let token = getCookie('admin_access');
    let headers = { "Authorization": `Bearer ${token}` };
    let response = await requestAPI(`${apiURL}${requiredHairStylistURL}`, null, headers, 'GET');
    response.json().then(function(res) {
        hairstylistData = [...res.data];
        res.data.forEach((stylist) => {
            hairstylistDropdown.insertAdjacentHTML('beforeend', `<div class="radio-btn hairstylist-item-list" data-id="${stylist.id}">
                                                                    <input onchange="selectHairStylist(this);" id="hs-${stylist.id}" type="radio" value="${stylist.fullname}" name="stylist_radio" />
                                                                    <label for="hs-${stylist.id}" class="radio-label">${stylist.fullname}</label>
                                                                </div>`);
        })
    })
}


function searchHairstylist(event, inputElement) {
    if (event.keyCode == 13) {
        requiredDataURL = setParams(requiredDataURL, 'hairstylist__fullname', inputElement.value);
        getData();
        document.querySelectorAll('input[name="stylist_radio"]').forEach(input => input.checked = false);
        selectedHairStylist = inputElement.value;
        document.getElementById('selected-hairstylist-text').innerText = inputElement.value == '' ? 'HAIRSTYLIST' : inputElement.value;
        document.getElementById('selected-hairstylist-text').title = inputElement.value == '' ? 'HAIRSTYLIST' : inputElement.value;
        hairstylistWrapper.style.display = 'none';
    }
    else {
        let filteredCustomer = [];
        filteredCustomer = hairstylistData.filter(stylist => stylist.fullname.toLowerCase().includes(inputElement.value.toLowerCase())).map((stylist => stylist.id));
        if (filteredCustomer.length == 0) {
            document.getElementById('no-hairstylist-text').classList.remove('hide');
            document.querySelectorAll('.hairstylist-item-list').forEach((item) => item.classList.add('hide'));
        }
        else {
            document.getElementById('no-hairstylist-text').classList.add('hide');
            document.querySelectorAll('.hairstylist-item-list').forEach((item) => {
                let itemID = item.getAttribute('data-id');
                if (filteredCustomer.includes(parseInt(itemID, 10))) {
                    item.classList.remove('hide');
                }
                else {
                    item.classList.add('hide');
                }
            })
        }
    }
}


function selectHairStylist(inputElement) {
    if (inputElement.checked) {
        requiredDataURL = setParams(requiredDataURL, 'hairstylist__fullname', inputElement.value);
        getData();
        selectedHairStylist = inputElement.value;
        document.getElementById('selected-hairstylist-text').innerText = inputElement.value == '' ? 'HAIRSTYLIST' : inputElement.value;
        document.getElementById('selected-hairstylist-text').title = inputElement.value == '' ? 'HAIRSTYLIST' : inputElement.value;
        document.getElementById('hairstylist-filter-input').value = inputElement.value;
        hairstylistWrapper.style.display = 'none';
    }
}


function insertTableBodyRows(data, tableBody) {
    data.forEach((item) => {
        var tr = document.createElement('tr');
        tr.innerHTML = `<td><div><span class="table-text-overflow" title="${item.order ? item.order.customer_name : 'None'}">${item.order ? item.order.customer_name : 'None'}</span></div></td>
                        <td><div><span class="order-number">${item.order ? item.order.id : '---'}</span></div></td>
                        <td><div><span class="table-text-overflow" title="${item.order ? item.order.hairstylist : 'None'}">${item.order ? item.order.hairstylist : 'None'}</span></div></td>
                        <td><div><span>${item.order ? '$' + item.order.retail_value : '---'}</span></div></td>
                        <td><div><span>${item.order ? '$' + item.order.net_sales : '---'}</span></div></td>
                        <td><div><span>${item.type == 'debit' ? '-' : ''}$${item.amount}</span></div></td>
                        <td><div><span>${item.order ? captalizeFirstLetter(item.order.status) : '---'}</span></div></td>
                        <td><div><span>${item.order ? (item.order.pickup_type == 'self' ? 'Picked-Up' : 'Shipped') : 'None'}</span></div></td>
                        <td><div><span>${item.description == "" ? '---' : item.description}</span></div></td>`;
        tableBody.appendChild(tr);
    })
}


async function showCommissionDetails(clickedRow, salonId, month) {
    let table = document.getElementById('commission-table');
    let nextRow = clickedRow.nextElementSibling;

    if (nextRow && nextRow.getAttribute('data-status') == "true") {
        nextRow.remove();
        clickedRow.style.background = '#FFFFFF';
    }
    else {
        clickedRow.style.background = '#DCDCFF';
        let newRow = table.insertRow(clickedRow.rowIndex + 1);
        newRow.setAttribute('data-status', true);

        let commissionDetailTable = document.createElement('table');
        let commissionDetailThead = document.createElement('thead');
        let commissionDetailBody = document.createElement('tbody');
        let commissionDetailTheadRow = document.createElement('tr');
        commissionDetailTheadRow.innerHTML = `<th width="12.76%"><div><span>Customer Name</span></div></th>
                                                <th width="7.93%"><div><span>Order #</span></div></th>
                                                <th width="10.75%"><div><span>Hairstylist</span></div></th>
                                                <th width="10.20%"><div><span>Retail Value</span></div></th>
                                                <th width="10.94%"><div><span>Net Sales</span></div></th>
                                                <th width="10.75%"><div><span>Commission</span></div></th>
                                                <th width="11.03%"><div><span>Status</span></div></th>
                                                <th width="10.60%"><div><span>Delivery Method</span></div></th>
                                                <th width="25.60%"><div><span>Description</span></div></th>`;
        

        commissionDetailThead.appendChild(commissionDetailTheadRow);
        
        try {
            newRow.innerHTML = `<td colspan="9">
                                    <div class="w-100 h-100 d-flex justify-content-center align-items-center pt-2 pb-2">
                                        <span class="spinner-border spinner-border-md" style="color: #000093;" role="status" aria-hidden="true">
                                        </span>
                                    </div>
                                </td>`;

            let token = getCookie('admin_access');
            let headers = { "Authorization": `Bearer ${token}` };

            let response = await requestAPI(`${apiURL}/admin/salons/commissions?salon=${salonId}&date_month=${month}&page=1&perPage=1000&ordering=-date&hairstylist__fullname=${selectedHairStylist}`, null, headers, 'GET');
            response.json().then(function(res) {
                if (response.status == 200) {
                    insertTableBodyRows(res.data, commissionDetailBody);

                    commissionDetailBody.id = `commission-body-${res.data.id}}`;
                    commissionDetailTable.appendChild(commissionDetailThead);
                    commissionDetailTable.appendChild(commissionDetailBody);
                    commissionDetailTable.classList.add('inventory-details-table');

                    newRow.innerHTML = `<td colspan="9" data-id="commission-details-${res.data.id}">
                                            <div class="stock-details-container">
                                                <div class="container-header">
                                                    <span>Commission Details</span>
                                                    <svg onclick="closeCommissionDetail(event);" class="cursor-pointer" aria-label="Close" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                        <path d="M13.4672 9.67878C13.8189 8.8295 14 7.91925 14 7C14 5.14348 13.2625 3.36301 11.9497 2.05025C10.637 0.737498 8.85652 0 7 0C5.14348 0 3.36301 0.737498 2.05025 2.05025C0.737498 3.36301 0 5.14348 0 7C0 7.91925 0.18106 8.8295 0.532843 9.67878C0.884626 10.5281 1.40024 11.2997 2.05025 11.9497C2.70026 12.5998 3.47194 13.1154 4.32122 13.4672C5.1705 13.8189 6.08075 14 7 14C7.91925 14 8.8295 13.8189 9.67878 13.4672C10.5281 13.1154 11.2997 12.5998 11.9497 11.9497C12.5998 11.2997 13.1154 10.5281 13.4672 9.67878Z" fill="#D9D9D9"/>
                                                        <path d="M4.66602 9.33518L6.99962 7.00157M6.99962 7.00157L9.33323 4.66797M6.99962 7.00157L4.66602 4.66797M6.99962 7.00157L9.33323 9.33518" stroke="#3F3F46" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                    </svg>
                                                </div>
                                                ${commissionDetailTable.outerHTML}
                                                <div class="details-footer">
                                                    <button onclick="closeCommissionDetail(event);" type="button">OK</button>
                                                </div>
                                            </div>
                                        </td>`;
                }
            })
        }
        catch (err) {
            console.log(err);
        }
    }
}


function closeCommissionDetail(event) {
    let tableElement = event.target.closest('tr[data-status="true"]');
    if (tableElement) {
        let previousRowIndex = tableElement.rowIndex - 1;
        document.getElementById('commission-table').rows[previousRowIndex].style.background = '#FFFFFF';
        tableElement.remove();
    }
}


async function changeCommissionStatus(event, salonId, month) {
    event.preventDefault();
    // let selectElement = event.target.closest('select');
    // let selectedValue = selectElement.options[selectElement.selectedIndex].value;

    let selectedValue = event.target.getAttribute('data-value');
    
    try {
        let token = getCookie('admin_access');
        let headers = {
            "Authorization": `Bearer ${token}`,
            "Content-Type": 'application/json'
        };

        let data = { "status": selectedValue, "month": month };

        let response = await requestAPI(`${apiURL}/admin/salons/commissions/salons/${salonId}`, JSON.stringify(data), headers, 'PATCH');
        response.json().then(function(res) {
            // console.log(res);
            if (response.status == 200) {
                // let statusDiv = selectElement.closest('.commission-status-div');
                getData();
                // let statusDiv = event.target.closest('.commission-status-div');
                // statusDiv.innerHTML = '<span>Paid</span>';
            }
        })
    }
    catch (err) {
        console.log(err);
    }
}


const sortOrders = {};

function sortByAlphabets(event, columnIndex) {
    const arrows = event.target.closest('th').querySelectorAll('path');
    const table = document.getElementById("commission-table");
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


function sortByDate(event, columnIndex) {
    let arrows = event.target.closest('th').querySelectorAll('path');
    const table = document.getElementById("commission-table");
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.rows);

    const currentOrder = sortOrders[columnIndex] || 'asc';

    const sortedRows = rows.sort((rowA, rowB) => {
        const x = new Date(rowA.getElementsByTagName("td")[columnIndex].getAttribute('dateTime'));
        const y = new Date(rowB.getElementsByTagName("td")[columnIndex].getAttribute('dateTime'));

        return currentOrder === 'asc' ? x - y : y - x;
    });

    // Clear table content
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    // Append sorted rows to the table
    for (const sortedRow of sortedRows) {
        tbody.appendChild(sortedRow);
    }

    // Toggle arrow opacity
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
    const table = document.getElementById("commission-table");
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
    const table = document.getElementById('commission-table');
    const tableBody = table.querySelector('tbody');
    document.querySelectorAll('tr[data-status="true"]').forEach((row) => row.remove());
    const rows = Array.from(tableBody.querySelectorAll('tr'));

    rows.reverse();
    tableBody.innerHTML = '';

    for (const row of rows) {
        tableBody.appendChild(row);
    }
}


const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function convertDateTime() {
    let dateTimes = document.querySelectorAll('.month');
    dateTimes.forEach((timeString) => {
        const inputDate = new Date(timeString.innerText);
        // console.log(monthNames[inputDate.getUTCMonth()], inputDate.getUTCFullYear());

        const month = monthNames[inputDate.getUTCMonth()];
        const year = inputDate.getUTCFullYear();

        // const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(inputDate);
        // const year = new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(inputDate);

        const result = `${month}, ${year}`;
        timeString.innerText = result;
    })
}


function populateYearList(n=0) {
    let yearList = getLastNYears(n);
    yearList.forEach((year) => {
        yearDropdown.innerHTML += `<span onclick="filterYearOption(this);">${year}</span>`;
    })
}


function getLastNYears(n=0) {
    const currentYear = new Date().getFullYear();
    let lastNYears = [];

    for (let i = currentYear; i >= currentYear - n; i--) {
        lastNYears.push(i);
    }

    return lastNYears;
}