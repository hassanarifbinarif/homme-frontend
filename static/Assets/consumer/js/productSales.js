let deliveryTypeBtn = document.getElementById('delivery-type-btn');
let deliveryTypeDropdown = document.getElementById('delivery-type-dropdown');

let salesChannelBtn = document.getElementById('select-sales-channel-btn');
let salesChannelDropdown = document.getElementById('sales-channel-dropdown');

let dateSelectorBtn = document.getElementById('date-selector-btn');
let dateSelectorInputWrapper = document.getElementById('date-selector');

let statusBtn = document.getElementById('status-btn');
let statusWrapper = document.getElementById('status-selector');

let searchField = document.getElementById('search-order');

let requiredDataURL = `/admin/orders?page=1&perPage=1000&ordering=-created_at&created_at__gte=&created_at__lte=&status=&search=&purchase_type=`;


window.onload = () => {
    // getNotifications();
    getData();
}


salesChannelBtn.addEventListener('click', function() {
    if (salesChannelDropdown.classList.contains('hide')) {
        salesChannelDropdown.classList.remove('hide');
    }
    else {
        salesChannelDropdown.classList.add('hide');
    }
})

let selectedSalesChannel = [];
let salesChannelFilterString = '';

function selectSalesChannel(inputElement) {
    if (inputElement.checked) {
        selectedSalesChannel.push(inputElement.value);
    }
    else {
        const index = selectedSalesChannel.indexOf(inputElement.value);
        if (index !== -1) {
          selectedSalesChannel.splice(index, 1);
        }
    }
    salesChannelFilterString = selectedSalesChannel.join(',');
    requiredDataURL = setParams(requiredDataURL, 'sales_channel', salesChannelFilterString);
    getData(requiredDataURL);
    salesChannelDropdown.classList.add('hide');
    salesChannelBtn.click();
}


async function getData(url=null) {
    let data;
    let tableBody = document.getElementById('product-sales-table');
    if (url == null) {
        data = requiredDataURL;
    }
    else {
        data = url
    }
    tableBody.classList.add('hide');
    document.getElementById('table-loader').classList.remove('hide');
    try {
        let response = await requestAPI('/consumer/get-sales-list/', JSON.stringify(data), {}, 'POST');
        response.json().then(function(res) {
            if (res.success) {
                document.getElementById('table-loader').classList.add('hide');
                tableBody.innerHTML = res.sales_data;
                tableBody.classList.remove('hide');
                convertTableDateTime();
            }
        })
    }
    catch (err) {
        console.log(err);
    }
}


function closeDropdowns(event) {
    if ((!dateSelectorBtn.contains(event.target)) && dateSelectorInputWrapper.style.display == 'flex') {
        dateSelectorInputWrapper.style.display = 'none';
    }
    else if ((!deliveryTypeBtn.contains(event.target)) && deliveryTypeDropdown.style.display == 'flex') {
        deliveryTypeDropdown.style.display = 'none';
    }
    else if ((!statusBtn.contains(event.target)) && statusWrapper.style.display == 'flex') {
        statusWrapper.style.display = 'none';
    }
    else if (!(salesChannelBtn.contains(event.target)) && !(salesChannelDropdown.contains(event.target))) {
        salesChannelDropdown.classList.add('hide');
    }
}

document.body.addEventListener('click', closeDropdowns);


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

function toggleDateInputs(event) {
    if (event.target.nextElementSibling.classList.contains('hide')) {
        event.target.nextElementSibling.classList.remove('hide');
        event.target.style.background = '#FFF';
        event.target.style.color = '#000093';
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
        startDate = getStartOfWeek();
        requiredDataURL = setParams(requiredDataURL, 'created_at__gte', startDate);
        requiredDataURL = setParams(requiredDataURL, 'created_at__lte', '');
        document.getElementById('start-date').value = startDate;
        document.getElementById('end-date').value = '';

        dateTimeString = convertDateTime(startDate) + ', '
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


function toggleDeliveryTypeDropdown(event) {
    if ((deliveryTypeBtn.contains(event.target)) && deliveryTypeDropdown.style.display == 'none') {
        deliveryTypeDropdown.style.display = 'flex';
    }
    else if ((deliveryTypeBtn.querySelector('span').contains(event.target) || deliveryTypeBtn.querySelector('svg').contains(event.target)) && deliveryTypeDropdown.style.display == 'flex') {
        deliveryTypeDropdown.style.display = 'none';
    }
    else if ((deliveryTypeBtn.querySelector('.date-selector').contains(event.target)) && deliveryTypeDropdown.style.display == 'flex') {
    }
    else {
        deliveryTypeDropdown.style.display = 'none';
    }
}


function filterDeliveryOption(option) {
    requiredDataURL = setParams(requiredDataURL, 'pickup_type', option.getAttribute('data-value'));
    getData(requiredDataURL);
    document.getElementById('selected-delivery-type').innerText = option.innerText;
    setTimeout(() => {
        deliveryTypeBtn.click();
    }, 100)
}


const sortOrders = {};


function sortByDate(event) {
    let arrows;
    if (event.target.closest('button')) {
        arrows = event.target.closest('button').querySelectorAll('path');
    } else if (event.target.closest('th')) {
        arrows = event.target.closest('th').querySelectorAll('path');
    }
    const table = document.getElementById("product-sales-table");
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.rows);

    const currentOrder = sortOrders[2] || 'asc';

    const sortedRows = rows.sort((rowA, rowB) => {
        const x = new Date(rowA.getElementsByTagName("td")[2].getAttribute('dateTime'));
        const y = new Date(rowB.getElementsByTagName("td")[2].getAttribute('dateTime'));

        return currentOrder === 'asc' ? x - y : y - x;
    });

    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    for (const sortedRow of sortedRows) {
        tbody.appendChild(sortedRow);
    }

    arrows[0].setAttribute('opacity', currentOrder === 'asc' ? '0.2' : '1');
    arrows[1].setAttribute('opacity', currentOrder === 'asc' ? '1' : '0.2');
    sortOrders[2] = currentOrder === 'asc' ? 'desc' : 'asc';
}


function extractNumber(value) {
    const match = value.match(/\d+/);
    return match ? parseFloat(match[0]) : 0;
}

function sortByDigits(event, columnIndex) {
    const columnArrows = event.target.closest('th').querySelectorAll('path');
    const table = document.getElementById("product-sales-table");
    const tbody = table.querySelector('tbody');
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


function sortByAlphabets(event, columnIndex) {
    const arrows = event.target.closest('th').querySelectorAll('path');
    const table = document.getElementById("product-sales-table");
    const currentOrder = sortOrders[columnIndex] || 'asc';

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



function reverseTableRows() {
    const table = document.getElementById('product-sales-table');
    const tableBody = table.querySelector('tbody');
    const rows = Array.from(tableBody.querySelectorAll('tr'));

    rows.reverse();
    tableBody.innerHTML = '';

    for (const row of rows) {
        tableBody.appendChild(row);
    }
}


function openSearchInput() {
    if (searchField.classList.contains('hide')) {
        searchField.classList.remove('hide');
        searchField.focus();
    }
}


function closeSearchInput(event) {
    if (!searchField.classList.contains('hide')) {
        searchField.classList.add('hide');
        event.stopPropagation();
    }
}


function searchData(event) {
    if (event.key == 'Enter') {
        urlParams = setParams(requiredDataURL, 'search', `${searchField.value}`);
        getData(urlParams);
    }
}

let purchaseTypeDropdown = document.getElementById('purchase-type-dropdown');
let purchaseTypeBtn = document.getElementById('purchase-type-btn');

function togglePurchaseDropdown() {
    if (purchaseTypeDropdown.style.display == 'flex') {
        purchaseTypeDropdown.style.display = 'none';
    }
    else {
        purchaseTypeDropdown.style.display = 'flex';
    }
}


function filterPurchaseType(event) {
    let element = event.target;
    let selectedPurchaseType = document.getElementById('selected-purchase-type');
    if (selectedPurchaseType.innerText != element.innerText) {
        requiredDataURL = setParams(requiredDataURL, 'purchase_type', element.getAttribute('data-value'));
        getData(requiredDataURL);
    }
    selectedPurchaseType.innerText = element.innerText;
}


let orderCompletionTypeDropdown = document.getElementById('order-completion-type-dropdown');
let orderCompletionTypeBtn = document.getElementById('order-completion-type-btn');

function toggleOrderCompletionDropdown() {
    if (orderCompletionTypeDropdown.style.display == 'flex') {
        orderCompletionTypeDropdown.style.display = 'none';
    }
    else {
        orderCompletionTypeDropdown.style.display = 'flex';
    }
}


function filterOrderCompletionType(event) {
    let element = event.target;
    requiredDataURL = setParams(requiredDataURL, 'status', element.getAttribute('data-value'));
    getData(requiredDataURL);
    document.getElementById('selected-order-completion-type').innerText = element.innerText;
}


function convertTableDateTime() {
    let orderTimes = document.querySelectorAll('.order-date');
    orderTimes.forEach((dateTime) => {
        const inputDate = new Date(dateTime.textContent);

        // Format date components
        const day = new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(inputDate);
        const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(inputDate);
        const year = new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(inputDate);

        // Create the desired format
        const result = `${day}-${month}-${year}`;

        dateTime.textContent = result;
    })
}


// For current week

function getStartOfWeek() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const daysUntilMonday = (dayOfWeek + 6) % 7;
    const startOfWeek = new Date(now);

    startOfWeek.setDate(now.getDate() - daysUntilMonday + 1);

    startOfWeek.setHours(0, 0, 0, 0);
    const formattedDate = startOfWeek.toISOString().split('T')[0];

    return formattedDate;
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


function convertDateTime(dateString) {
    const inputDate = new Date(dateString);

    const day = new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(inputDate);
    const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(inputDate);
    const year = new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(inputDate);

    const result = `${day}-${month}-${year}`;

    return result;
}