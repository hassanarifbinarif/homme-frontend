let orderStatTimeBtn = document.getElementById('select-order-stat-time-btn');
let selectedOrderStatTime = document.getElementById('selected-order-stat-opt');
let orderStatsDropdown = document.getElementById('order-stats-dropdown');

let purchaseTypeDropdown = document.getElementById('purchase-type-dropdown');
let purchaseTypeBtn = document.getElementById('purchase-type-btn');

let sourceTypeDropdown = document.getElementById('source-type-dropdown');
let sourceTypeBtn = document.getElementById('source-type-btn');
let selectedSourceType = document.getElementById('selected-source-type');

let salesChannelBtn = document.getElementById('select-order-channel-btn');
let salesChannelDropdown = document.getElementById('order-channel-dropdown');

let sourceChannelBtn = document.getElementById('select-source-channel-btn');
let sourceChannelDropdown = document.getElementById('source-channel-dropdown');

let perPage = 30;
let requiredDataURL = `/admin/orders?page=1&perPage=${perPage}&ordering=-created_at&created_at__gte=&created_at__lte=&status=&search=&purchase_type=`;
let searchField = document.getElementById('search-order');

let perPageDropdownOptionContainer = document.getElementById('per-page-dropdown-options-container');
let previousPageBtn = document.getElementById('previous-nav-btn');
let nextPageBtn = document.getElementById('next-nav-btn');
let currentPageElement = document.getElementById('current-nav-page');

window.onload = () => {
    if (userID != null) {
        requiredDataURL = setParams(requiredDataURL, 'user', userID);
        getData(requiredDataURL);
    }
    let url = new URL(location.href);
    let search = url.searchParams.get('status');
    if (search) {
        requiredDataURL = setParams(requiredDataURL, 'status', search);
        document.getElementById('selected-order-completion-type').innerText = search.toUpperCase();
    }
    getData();
    // getNotifications();
    populateDropdowns();
    // populatePossiblePerPageOptions();
}


function populatePossiblePerPageOptions() {
    for (let i = 10; i < 30; i++) {
        let span = document.createElement('span');
        span.textContent = i;
        span.classList.add('dropdown-item');
        span.setAttribute('onclick', `setPerPage(${i})`);
        perPageDropdownOptionContainer.appendChild(span);
    }
}


function setPerPage(count) {
    if (count == 'ALL' || count == NaN)
        perPage = 10000;
    else
        perPage = count;
    requiredDataURL = setParams(requiredDataURL, 'perPage', perPage);
    requiredDataURL = setParams(requiredDataURL, 'page', 1);
    getData();
    document.getElementById('current-per-page').innerText = count;
}


let currentOrderModal = 'orderCreate';


function closeDropdowns(event) {
    if ((!orderStatTimeBtn.contains(event.target)) && (!orderStatsDropdown.classList.contains('hide'))) {
        orderStatsDropdown.classList.add('hide');
    }
    else if ((!orderCompletionTypeBtn.contains(event.target)) && orderCompletionTypeDropdown.style.display == 'flex') {
        orderCompletionTypeDropdown.style.display = "none";
    }
    else if ((!purchaseTypeBtn.contains(event.target)) && purchaseTypeDropdown.style.display == 'flex') {
        purchaseTypeDropdown.style.display = "none";
    }
    if ((!sourceTypeBtn.contains(event.target)) && sourceTypeDropdown.style.display == 'flex') {
        sourceTypeDropdown.style.display = "none";
    }
    if (!(salesChannelBtn.contains(event.target)) && !(salesChannelDropdown.contains(event.target))) {
        salesChannelDropdown.style.display = "none";
    }
    if (!(sourceChannelBtn.contains(event.target)) && !(sourceChannelDropdown.contains(event.target))) {
        sourceChannelDropdown.style.display = "none";
    }
}

document.body.addEventListener('click', closeDropdowns);


async function getData(url=null) {
    let data;
    let tableBody = document.getElementById('order-table');
    if (url == null)
        data = requiredDataURL;
    else
        data = url
    tableBody.classList.add('hide');
    document.getElementById('table-loader').classList.remove('hide');
    try {
        let response = await requestAPI('/get-order-list/', JSON.stringify(data), {}, 'POST');
        response.json().then(function(res) {
            if (res.success) {
                document.getElementById('table-loader').classList.add('hide');
                tableBody.innerHTML = res.order_data;
                setPaginationLinks(res.pagination_data);
                tableBody.classList.remove('hide');
                document.getElementById('total-order-sales').innerHTML = '$' + (res.stats.total_sales || 0);
                document.getElementById('total-order-value').innerHTML = res.stats.total_orders || 0;
                document.getElementById('total-ordered-items').innerHTML = res.stats.order_items || 0;
                document.getElementById('total-orders-completed').innerHTML = res.stats.completed_orders || 0;
                document.getElementById('total-open-orders').innerHTML = res.stats.open_orders || 0;
                document.getElementById('total-order-completion-time').innerHTML = Math.ceil(roundDecimalPlaces(parseFloat(res.stats.completion_time) / 24)) + ' Days';
                convertDateTime();
            }
            else {
                tableBody.querySelector('tbody').innerHTML = `<tr><td colspan="11" class="no-record-row">No record available</td></tr>`;
                document.getElementById('total-order-value').innerHTML = '--';
                document.getElementById('total-ordered-items').innerHTML = '--';
                document.getElementById('total-orders-completed').innerHTML = '--';
                document.getElementById('total-open-orders').innerHTML = '--';
                document.getElementById('total-order-completion-time').innerHTML = '--';
                document.getElementById('table-loader').classList.add('hide');
                tableBody.classList.remove('hide');
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


salesChannelBtn.addEventListener('click', function() {
    if (salesChannelDropdown.style.display == 'flex') {
        salesChannelDropdown.style.display = 'none';
    }
    else {
        salesChannelDropdown.style.display = 'flex';
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
    salesChannelDropdown.style.display = "none";
    salesChannelBtn.click();
}


orderStatTimeBtn.addEventListener('click', function() {
    if (orderStatsDropdown.classList.contains('hide')) {
        orderStatsDropdown.classList.remove('hide');
    }
    else {
        orderStatsDropdown.classList.add('hide');
    }
})

function selectOrderStatTime(event) {
    let element = event.target;
    let startDate, endDate;
    if (element.innerText == 'CURRENT WEEK' && selectedOrderStatTime.innerText != element.innerText) {
        startDate = getStartOfWeek();
        requiredDataURL = setParams(requiredDataURL, 'created_at__gte', startDate);
        requiredDataURL = setParams(requiredDataURL, 'created_at__lte', '');
    }
    else if (element.innerText == 'LAST WEEK' && selectedOrderStatTime.innerText != element.innerText) {
        const { startOfPreviousWeek, endOfPreviousWeek } = getStartAndEndOfPreviousWeek();
        requiredDataURL = setParams(requiredDataURL, 'created_at__gte', startOfPreviousWeek);
        requiredDataURL = setParams(requiredDataURL, 'created_at__lte', endOfPreviousWeek);
    }
    else if (element.innerText == 'CURRENT MONTH' && selectedOrderStatTime.innerText != element.innerText) {
        let today = new Date();
        const { startOfMonth, endOfMonth } = getStartAndEndOfMonth(today);
        requiredDataURL = setParams(requiredDataURL, 'created_at__gte', startOfMonth);
        requiredDataURL = setParams(requiredDataURL, 'created_at__lte', endOfMonth);
    }
    else if (element.innerText == 'LAST MONTH' && selectedOrderStatTime.innerText != element.innerText) {
        const { startOfLastMonth, endOfLastMonth } = getStartAndEndOfLastMonth();
        requiredDataURL = setParams(requiredDataURL, 'created_at__gte', startOfLastMonth);
        requiredDataURL = setParams(requiredDataURL, 'created_at__lte', endOfLastMonth);
    }
    else if (element.innerText == 'CURRENT QUARTER' && selectedOrderStatTime.innerText != element.innerText) {
        const { startOfQuarter, endOfQuarter } = getStartAndEndOfQuarter();
        requiredDataURL = setParams(requiredDataURL, 'created_at__gte', startOfQuarter);
        requiredDataURL = setParams(requiredDataURL, 'created_at__lte', endOfQuarter);
    }
    else if (element.innerText == 'LAST QUARTER' && selectedOrderStatTime.innerText != element.innerText) {
        const { startOfLastQuarter, endOfLastQuarter } = getStartAndEndOfLastQuarter();
        requiredDataURL = setParams(requiredDataURL, 'created_at__gte', startOfLastQuarter);
        requiredDataURL = setParams(requiredDataURL, 'created_at__lte', endOfLastQuarter);
    }
    else if (element.innerText == 'CURRENT YEAR' && selectedOrderStatTime.innerText != element.innerText) {
        const { startOfYear, endOfYear } = getStartAndEndOfYear();
        requiredDataURL = setParams(requiredDataURL, 'created_at__gte', startOfYear);
        requiredDataURL = setParams(requiredDataURL, 'created_at__lte', endOfYear);
    }
    else if (element.innerText == 'LAST YEAR' && selectedOrderStatTime.innerText != element.innerText) {
        const { startOfLastYear, endOfLastYear } = getStartAndEndOfLastYear();
        requiredDataURL = setParams(requiredDataURL, 'created_at__gte', startOfLastYear);
        requiredDataURL = setParams(requiredDataURL, 'created_at__lte', endOfLastYear);
    }
    else if (element.innerText == 'ALL TIME' && selectedOrderStatTime.innerText != element.innerText) {
        requiredDataURL = setParams(requiredDataURL, 'created_at__gte', '');
        requiredDataURL = setParams(requiredDataURL, 'created_at__lte', '');
    }
    getData(requiredDataURL);
    selectedOrderStatTime.innerText = element.innerText;
    orderStatsDropdown.classList.add('hide');
    orderStatTimeBtn.click();
}


function convertToDateTime(dateTimeString) {
    return new Date(dateTimeString);
}


function sortByDateBtn(event) {
    let arrows = event.target.closest('button').querySelectorAll('path');
    let newOrderingValue = '';
    let paramsArray = requiredDataURL.split('&');
    let currentOrderingValue;

    for (let i = 0; i < paramsArray.length; i++) {
        if (paramsArray[i].startsWith('ordering=')) {
            currentOrderingValue = paramsArray[i].substring('ordering='.length);
            if (currentOrderingValue == '-created_at') {
                newOrderingValue = 'created_at';
                arrows[0].setAttribute('opacity', '.2');
                arrows[1].setAttribute('opacity', '1');
            }
            else {
                newOrderingValue = '-created_at';
                arrows[0].setAttribute('opacity', '1');
                arrows[1].setAttribute('opacity', '.2');
            }
            paramsArray[i] = 'ordering=' + newOrderingValue;
            break;
        }
    }

    requiredDataURL = paramsArray.join('&');
    getData(requiredDataURL);

    // const url = new URL(requiredDataURL);
    // let ordering = url.searchParams.get('ordering');
    // if (ordering == '-created_at') {
    //     ordering = 'created_at';
    //     arrows[0].setAttribute('opacity', '.2');
    //     arrows[1].setAttribute('opacity', '1');
    //     url.searchParams.set('ordering', ordering);
    // }
    // else {
    //     ordering = '-created_at';
    //     arrows[0].setAttribute('opacity', '1');
    //     arrows[1].setAttribute('opacity', '.2');
    //     url.searchParams.set('ordering', ordering);
    // }
    // requiredDataURL = url.toString();
    // getData(requiredDataURL);
}


function sortByDate(event) {
    let arrows;
    if (event.target.closest('button')) {
        arrows = event.target.closest('button').querySelectorAll('path');
    } else if (event.target.closest('th')) {
        arrows = event.target.closest('th').querySelectorAll('path');
    }
    const table = document.getElementById("order-table");
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.rows);

    const currentOrder = sortOrders[2] || 'asc';

    const sortedRows = rows.sort((rowA, rowB) => {
        const x = convertToDateTime(rowA.getElementsByTagName("td")[2].getAttribute('dateTime'));
        const y = convertToDateTime(rowB.getElementsByTagName("td")[2].getAttribute('dateTime'));

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
    sortOrders[2] = currentOrder === 'asc' ? 'desc' : 'asc';
}



// Initialize an object to store the sort order for each column
const sortOrders = {};


function extractNumber(value) {
    const match = value.match(/\d+/);
    return match ? parseFloat(match[0]) : 0;
}

function sortByOrder(event, columnIndex) {
    const columnArrows = event.target.closest('th').querySelectorAll('path');
    const table = document.getElementById("order-table");
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.rows);

    const currentOrder = sortOrders[columnIndex] || 'asc';

    const sortedRows = rows.sort((rowA, rowB) => {
        const x = extractNumber(rowA.getElementsByTagName("td")[columnIndex].textContent);
        const y = extractNumber(rowB.getElementsByTagName("td")[columnIndex].textContent);

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

    // Toggle arrow opacity and update sort order
    columnArrows[0].setAttribute('opacity', currentOrder === 'asc' ? '0.2' : '1');
    columnArrows[1].setAttribute('opacity', currentOrder === 'asc' ? '1' : '0.2');

    sortOrders[columnIndex] = currentOrder === 'asc' ? 'desc' : 'asc';
}


function sortByAlphabets(event, columnIndex) {
    const arrows = event.target.closest('th').querySelectorAll('path');
    const table = document.getElementById("order-table");
    const currentOrder = sortOrders[columnIndex] || 'asc';

    const rows = Array.from(table.rows).slice(1); // Exclude the header row

    rows.sort((rowA, rowB) => {
        const valueA = rowA.getElementsByTagName("td")[columnIndex].textContent.toLowerCase();
        const valueB = rowB.getElementsByTagName("td")[columnIndex].textContent.toLowerCase();

        return currentOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    });

    // Clear table content
    const tbody = table.querySelector('tbody');
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    // Append sorted rows to the table
    for (let i = 0; i < rows.length; i++) {
        tbody.appendChild(rows[i]);
    }

    // Toggle arrow opacity and update sortOrders object
    arrows[0].setAttribute('opacity', currentOrder === 'asc' ? '0.2' : '1');
    arrows[1].setAttribute('opacity', currentOrder === 'asc' ? '1' : '0.2');
    
    // Update sort order for the current column
    sortOrders[columnIndex] = currentOrder === 'asc' ? 'desc' : 'asc';
}



function reverseTableRows() {
    const table = document.getElementById('order-table');
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
        // const table = document.getElementById("order-table");
        // const rows = table.getElementsByTagName("tr");
        // for (let i = 1; i < rows.length; i++) {
        //     const cellValue = rows[i].getElementsByTagName("td")[3].children[0].children[0].innerText;

        //     if (cellValue.toLowerCase().includes(searchField.value.toLowerCase())) {
        //         if (rows[i].getAttribute('purchase-filtered') != 'false' && rows[i].getAttribute('order-completion-filtered') != 'false')
        //             rows[i].style.display = "";
        //         rows[i].setAttribute('search-filtered', true);
        //     } else if (searchField.value == '') {
        //         if (rows[i].getAttribute('purchase-filtered') != 'false')
        //             rows[i].style.display = "";
        //         rows[i].setAttribute('search-filtered', true);
        //     }
        //     else {
        //         rows[i].style.display = "none";
        //         rows[i].setAttribute('search-filtered', false);
        //     }
        // }
    }
}


async function getSourceTypes() {
    let token = getCookie('admin_access');
    let headers = { "Authorization": `Bearer ${token}` };
    let response = await requestAPI(`${apiURL}/admin/sources/types?page=1&perPage=1000`, null, headers, 'GET');
    response.json().then(function(res) {
        if (response.status == 200) {
            res.data.forEach((sourceType) => {
                sourceTypeDropdown.innerHTML += `<label for="source-type-dropdown-${sourceType.id}" class="cursor-pointer">
                                                    <span>${sourceType.name}</span>
                                                    <input type="checkbox" onchange="filterSourceType(this);" id="source-type-dropdown-${sourceType.id}" value="${sourceType.id}" name="source_type_dropdown_checkbox" />
                                                </label>`;
            })
        }
    })
}

window.addEventListener('load', getSourceTypes);


function toggleSourceTypeDropdown() {
    if (sourceTypeDropdown.style.display == 'flex') {
        sourceTypeDropdown.style.display = 'none';
    }
    else {
        sourceTypeDropdown.style.display = 'flex';
    }
}


let selectedSourceTypeList = [];
let sourceTypeFilterString = '';

function filterSourceType(inputElement) {
    if (inputElement.checked) {
        selectedSourceTypeList.push(inputElement.value);
    }
    else {
        const index = selectedSourceTypeList.indexOf(inputElement.value);
        if (index !== -1) {
          selectedSourceTypeList.splice(index, 1);
        }
    }
    sourceTypeFilterString = selectedSourceTypeList.join(',');
    requiredDataURL = setParams(requiredDataURL, 'user__source_referrer__type__in', sourceTypeFilterString);
    getData(requiredDataURL);
}


async function getSourceChannels() {
    let token = getCookie('admin_access');
    let headers = { "Authorization": `Bearer ${token}` };
    let response = await requestAPI(`${apiURL}/admin/sources/channels?page=1&perPage=1000`, null, headers, 'GET');
    response.json().then(function(res) {
        if (response.status == 200) {
            res.data.forEach((sourceChannel) => {
                sourceChannelDropdown.innerHTML += `<label for="source-channel-dropdown-${sourceChannel.id}" class="cursor-pointer">
                                                        <span>${sourceChannel.name}</span>
                                                        <input type="checkbox" onchange="filterSourceChannel(this);" id="source-channel-dropdown-${sourceChannel.id}" value="${sourceChannel.id}" name="source_channel_dropdown_checkbox" />
                                                    </label>`;
            })
        }
    })
}

window.addEventListener('load', getSourceChannels);


sourceChannelBtn.addEventListener('click', function() {
    if (sourceChannelDropdown.style.display == 'flex') {
        sourceChannelDropdown.style.display = 'none';
    }
    else {
        sourceChannelDropdown.style.display = 'flex';
    }
})

let selectedSourceChannel = [];
let sourceChannelFilterString = '';

function filterSourceChannel(inputElement) {
    if (inputElement.checked) {
        selectedSourceChannel.push(inputElement.value);
    }
    else {
        const index = selectedSourceChannel.indexOf(inputElement.value);
        if (index !== -1) {
          selectedSourceChannel.splice(index, 1);
        }
    }
    sourceChannelFilterString = selectedSourceChannel.join(',');
    requiredDataURL = setParams(requiredDataURL, 'user__source_referrer__channel__in', sourceChannelFilterString);
    getData(requiredDataURL);
    salesChannelDropdown.style.display = "none";
    sourceChannelBtn.click();
}


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
    // const table = document.getElementById("order-table");
    // const rows = table.getElementsByTagName("tr");
    // for (let i = 1; i < rows.length; i++) {
    //     const cellValue = rows[i].getElementsByTagName("td")[8].children[0].children[0].innerText;

    //     if (cellValue === element.innerText) {
    //         if (rows[i].getAttribute('search-filtered') != 'false' && rows[i].getAttribute('order-completion-filtered') != 'false')
    //             rows[i].style.display = "";
    //         rows[i].setAttribute('purchase-filtered', true);
    //     } else {
    //         rows[i].style.display = "none";
    //         rows[i].setAttribute('purchase-filtered', false);
    //     }
    // }
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


    // const table = document.getElementById("order-table");
    // const rows = table.getElementsByTagName("tr");
    // for (let i = 1; i < rows.length; i++) {
    //     const cellValue = rows[i].getElementsByTagName("td")[9].children[0].children[0].innerText;

    //     if (cellValue === element.getAttribute('data-value')) {
    //         if (rows[i].getAttribute('search-filtered') != 'false' && rows[i].getAttribute('purchase-filtered') != 'false')
    //             rows[i].style.display = "";
    //         rows[i].setAttribute('order-completion-filtered', true);
    //     } else {
    //         rows[i].style.display = "none";
    //         rows[i].setAttribute('order-completion-filtered', false);
    //     }
    // }
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


// For current month

function getStartAndEndOfMonth(date) {
    let today = new Date();
    let startOfMonth = new Date(date);
    let endOfMonth = new Date(date);
  
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
  
    endOfMonth.setMonth(date.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    // Adjust for time zone offset
    const timezoneOffset = today.getTimezoneOffset() * 60000;
    
    startOfMonth = new Date(startOfMonth.getTime() - timezoneOffset).toISOString().split('T')[0];
    endOfMonth = new Date(endOfMonth.getTime() - timezoneOffset).toISOString().split('T')[0];
  
    return {
        startOfMonth,
        endOfMonth,
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

// For current quarter

function getStartAndEndOfQuarter() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
  
    let startMonth, endMonth;
    
    // Determine the start and end months for the current quarter
    if (currentMonth >= 0 && currentMonth <= 2) {
      startMonth = 0; // January
      endMonth = 2;   // March
    } else if (currentMonth >= 3 && currentMonth <= 5) {
      startMonth = 3; // April
      endMonth = 5;   // June
    } else if (currentMonth >= 6 && currentMonth <= 8) {
      startMonth = 6; // July
      endMonth = 8;   // September
    } else {
      startMonth = 9; // October
      endMonth = 11;  // December
    }
  
    let startOfQuarter = new Date(currentYear, startMonth, 1, 0, 0, 0, 0);
    let endOfQuarter = new Date(currentYear, endMonth + 1, 0, 23, 59, 59, 999);

    // Adjust for time zone offset
    const timezoneOffset = today.getTimezoneOffset() * 60000;

    startOfQuarter = new Date(startOfQuarter.getTime() - timezoneOffset).toISOString().split('T')[0];
    endOfQuarter = new Date(endOfQuarter.getTime() - timezoneOffset).toISOString().split('T')[0];
  
    return {
        startOfQuarter,
        endOfQuarter,
    };
}


// For last quarter

function getStartAndEndOfLastQuarter() {
    const today = new Date();
    const currentMonth = today.getMonth();
    let currentYear = today.getFullYear();
  
    let startMonth, endMonth;
  
    // Determine the start and end months for the last quarter
    if (currentMonth >= 0 && currentMonth <= 2) {
      startMonth = 9;  // October
      endMonth = 11;   // December
      currentYear--;   // Subtract a year for the last quarter
    } else if (currentMonth >= 3 && currentMonth <= 5) {
      startMonth = 0;  // January
      endMonth = 2;    // March
    } else if (currentMonth >= 6 && currentMonth <= 8) {
      startMonth = 3;  // April
      endMonth = 5;    // June
    } else {
      startMonth = 6;  // July
      endMonth = 8;    // September
    }
  
    let startOfLastQuarter = new Date(currentYear, startMonth, 1, 0, 0, 0, 0);
    let endOfLastQuarter = new Date(currentYear, endMonth + 1, 0, 23, 59, 59, 999);

    // Adjust for time zone offset
    const timezoneOffset = today.getTimezoneOffset() * 60000;

    startOfLastQuarter = new Date(startOfLastQuarter.getTime() - timezoneOffset).toISOString().split('T')[0];
    endOfLastQuarter = new Date(endOfLastQuarter.getTime() - timezoneOffset).toISOString().split('T')[0];
  
    return {
        startOfLastQuarter,
        endOfLastQuarter,
    };
}


// For current year

function getStartAndEndOfYear() {
    const today = new Date();
    const currentYear = today.getFullYear();
    
    let startOfYear = new Date(currentYear, 0, 1, 0, 0, 0, 0);
    let endOfYear = new Date(currentYear, 11, 31, 23, 59, 59, 999);
  
    // Adjust for time zone offset
    const timezoneOffset = today.getTimezoneOffset() * 60000;

    startOfYear = new Date(startOfYear.getTime() - timezoneOffset).toISOString().split('T')[0];
    endOfYear = new Date(endOfYear.getTime() - timezoneOffset).toISOString().split('T')[0];

    return {
        startOfYear,
        endOfYear,
    };
}


// For last year

function getStartAndEndOfLastYear() {
    const today = new Date();
    const currentYear = today.getFullYear();
  
    let startOfLastYear = new Date(currentYear - 1, 0, 1, 0, 0, 0, 0);
    let endOfLastYear = new Date(currentYear - 1, 11, 31, 23, 59, 59, 999);

    // Adjust for time zone offset
    const timezoneOffset = today.getTimezoneOffset() * 60000;

    startOfLastYear = new Date(startOfLastYear.getTime() - timezoneOffset).toISOString().split('T')[0];
    endOfLastYear = new Date(endOfLastYear.getTime() - timezoneOffset).toISOString().split('T')[0];
  
    return {
        startOfLastYear,
        endOfLastYear,
    };
}


function convertDateTime() {
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


async function resetPickupPinRetries(event, button, id, defaultTries) {
    event.stopPropagation();
    let buttonText = button.innerText;
    try {
        let data = { "pickup_pin_retries": defaultTries || 5 };
        let token = getCookie('admin_access');
        let headers = {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        };
        beforeLoad(button);
        let response = await requestAPI(`${apiURL}/admin/orders/${id}`, JSON.stringify(data), headers, 'PATCH');
        response.json().then(function(res) {
            if (response.status == 200) {
                button.setAttribute('onclick', 'event.stopPropagation()');
                button.disabled = true;
                button.setAttribute('disabled', true);
                afterLoad(button, 'UPDATED');
                setTimeout(() => {
                    afterLoad(button, 'RESET');
                    button.classList.add('opacity-point-3-5');
                }, 1200)
            }
            else {
                afterLoad(button, 'ERROR');
                setTimeout(() => {
                    afterLoad(button, 'RESET');
                }, 1200)
            }
        })
    }
    catch (err) {
        console.log(err);
        afterLoad(button, 'ERROR');
        setTimeout(() => {
            afterLoad(button, 'RESET');
        }, 1200)
    }
}