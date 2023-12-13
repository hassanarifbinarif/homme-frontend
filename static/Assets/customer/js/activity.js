let salesChannelDropdown = document.getElementById('sales-channel-dropdown');
let salesChannelBtn = document.getElementById('sales-channel-btn');

let typeDropdown = document.getElementById('type-dropdown');
let typeBtn = document.getElementById('type-btn');

let dateSelectorBtn = document.getElementById('date-selector-btn');
let dateSelectorInputWrapper = document.getElementById('date-selector');

let netCashBtn = document.getElementById('net-cash-btn');
let netCashInputWrapper = document.getElementById('net-cash-selector');

let rewardsBtn = document.getElementById('rewards-btn');
let rewardsInputWrapper = document.getElementById('rewards-selector');

let requiredDataURL = `/admin/activities?page=1&perPage=1000&ordering=-created_at`;


window.onload = () => {
    getNotifications();
    getData();
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
    let tableBody = document.getElementById('activity-table');
    if (url == null) {
        data = requiredDataURL;
    }
    else {
        data = url;
    }
    document.getElementById('table-loader').classList.remove('hide');
    tableBody.classList.add('hide');
    try {
        let response = await requestAPI('/get-activities-list/', JSON.stringify(data), {}, 'POST');
        response.json().then(function(res) {
            if (res.success) {
                document.getElementById('table-loader').classList.add('hide');
                tableBody.innerHTML = res.activity_data;
                convertDateTime();
                tableBody.classList.remove('hide');
            }
        })
    }
    catch (err) {
        console.log(err);
    }
}


function toggleSalesChannelDropdown(event) {
    if (salesChannelDropdown.style.display == 'flex' && (!salesChannelBtn.querySelector('.search-div').contains(event.target))) {
        salesChannelDropdown.style.display = 'none';
    }
    else {
        salesChannelDropdown.style.display = 'flex';
    }
}

function filterSalesChannelOption(event) {
    let element = event.target;
    // document.getElementById('selected-sales-channel').innerText = element.innerText;
}



function filterTypeOption(event) {
    let element = event.target;
    requiredDataURL = setParams(requiredDataURL, 'type', element.getAttribute('data-value'));
    getData(requiredDataURL);
    document.getElementById('selected-type').innerText = element.innerText;
}

function toggleTypeDropdown() {
    if (typeDropdown.style.display == 'flex') {
        typeDropdown.style.display = 'none';
    }
    else {
        typeDropdown.style.display = 'flex';
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
    if (element.innerText == 'CURRENT WEEK') {
        startDate = getStartOfWeek();
        requiredDataURL = setParams(requiredDataURL, 'created_at__gte', startDate);
        requiredDataURL = setParams(requiredDataURL, 'created_at__lte', '');
        document.getElementById('start-date').value = startDate;
        document.getElementById('end-date').value = '';
        document.getElementById('selected-date-range').innerText = startDate + ' / ';
        document.getElementById('selected-date-range').title = startDate + ' / ';
    }
    else if (element.innerText == 'LAST WEEK') {
        const { startOfPreviousWeek, endOfPreviousWeek } = getStartAndEndOfPreviousWeek();
        requiredDataURL = setParams(requiredDataURL, 'created_at__gte', startOfPreviousWeek);
        requiredDataURL = setParams(requiredDataURL, 'created_at__lte', endOfPreviousWeek);
        document.getElementById('start-date').value = startOfPreviousWeek;
        document.getElementById('end-date').value = endOfPreviousWeek;
        document.getElementById('selected-date-range').innerText = startOfPreviousWeek + ' / ' + endOfPreviousWeek;
        document.getElementById('selected-date-range').title = startOfPreviousWeek + ' / ' + endOfPreviousWeek;
    }
    else if (element.innerText == 'LAST MONTH') {
        const { startOfLastMonth, endOfLastMonth } = getStartAndEndOfLastMonth();
        requiredDataURL = setParams(requiredDataURL, 'created_at__gte', startOfLastMonth);
        requiredDataURL = setParams(requiredDataURL, 'created_at__lte', endOfLastMonth);
        document.getElementById('start-date').value = startOfLastMonth;
        document.getElementById('end-date').value = endOfLastMonth;
        document.getElementById('selected-date-range').innerText = startOfLastMonth + ' / ' + endOfLastMonth;
        document.getElementById('selected-date-range').title = startOfLastMonth + ' / ' + endOfLastMonth;
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
        document.getElementById('selected-date-range').innerText = data.start_date + ' / ' + data.end_date;
        document.getElementById('selected-date-range').title = data.start_date + ' / ' + data.end_date;
    }
}


function toggleNetCashDropdown(event) {
    if ((netCashBtn.contains(event.target)) && netCashInputWrapper.style.display == 'none') {
        netCashInputWrapper.style.display = 'flex';
    }
    else if ((netCashBtn.querySelector('span').contains(event.target) || netCashBtn.querySelector('svg').contains(event.target)) && netCashInputWrapper.style.display == 'flex') {
        netCashInputWrapper.style.display = 'none';
    }
    else if ((netCashBtn.querySelector('.net-cash-selector').contains(event.target)) && netCashInputWrapper.style.display == 'flex') {
    }
    else {
        netCashInputWrapper.style.display = 'none';
    }
}

function toggleNetCashInputs(event) {
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

function filterNetCashOption(event) {
    let element = event.target;
    requiredDataURL = setParams(requiredDataURL, 'net_cash__gte', element.getAttribute('data-min'));
    requiredDataURL = setParams(requiredDataURL, 'net_cash__lte', element.getAttribute('data-max') || '');
    document.getElementById('min-cash-value').value = element.getAttribute('data-min');
    document.getElementById('max-cash-value').value = element.getAttribute('data-max') || '';
    getData();
    document.getElementById('selected-net-cash-range').innerText = element.getAttribute('data-min') + ' - ' + (element.getAttribute('data-max') || '');
    document.getElementById('selected-net-cash-range').title = element.getAttribute('data-min') + ' - ' + (element.getAttribute('data-max') || '');
    setTimeout(() => {
        netCashBtn.click();
    }, 100)
}

function netCashForm(event) {
    if (event.key == 'Enter') {
        let form = event.target.closest('form');
        let formData = new FormData(form);
        let data = formDataToObject(formData);
        if (data.min_cash == '' || data.max_cash == '') {
            return false;
        }
        else if (!(/^-?\d*\.?\d+$/.test(data.min_cash)) || !(/^-?\d*\.?\d+$/.test(data.max_cash))) {
            return false;
        }
        else if (parseFloat(data.min_cash) >= parseFloat(data.max_cash)) {
            return false;
        }
        else {
            requiredDataURL = setParams(requiredDataURL, 'net_cash__gte', data.min_cash);
            requiredDataURL = setParams(requiredDataURL, 'net_cash__lte', data.max_cash);
            getData(requiredDataURL);
            document.getElementById('selected-net-cash-range').innerText = data.min_cash + ' - ' + data.max_cash;
            document.getElementById('selected-net-cash-range').title = data.min_cash + ' - ' + data.max_cash;
        }
    }
}


function toggleRewardsDropdown(event) {
    if ((rewardsBtn.contains(event.target)) && rewardsInputWrapper.style.display == 'none') {
        rewardsInputWrapper.style.display = 'flex';
    }
    else if ((rewardsBtn.querySelector('span').contains(event.target) || rewardsBtn.querySelector('svg').contains(event.target)) && rewardsInputWrapper.style.display == 'flex') {
        rewardsInputWrapper.style.display = 'none';
    }
    else if ((rewardsBtn.querySelector('.rewards-selector').contains(event.target)) && rewardsInputWrapper.style.display == 'flex') {
    }
    else {
        rewardsInputWrapper.style.display = 'none';
    }
}

function toggleRewardsInputs(event) {
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

function filterRewardOption(event) {
    let element = event.target;
    requiredDataURL = setParams(requiredDataURL, 'rewards__gte', element.getAttribute('data-min'));
    requiredDataURL = setParams(requiredDataURL, 'rewards__lte', element.getAttribute('data-max') || '');
    document.getElementById('min-rewards-value').value = element.getAttribute('data-min');
    document.getElementById('max-rewards-value').value = element.getAttribute('data-max') || '';
    getData();
    document.getElementById('selected-rewards-range').innerText = element.getAttribute('data-min') + ' - ' + (element.getAttribute('data-max') || '');
    document.getElementById('selected-rewards-range').title = element.getAttribute('data-min') + ' - ' + (element.getAttribute('data-max') || '');
    setTimeout(() => {
        rewardsBtn.click();
    }, 100)
}

function rewardForm(event) {
    if (event.key == 'Enter') {
        let form = event.target.closest('form');
        let formData = new FormData(form);
        let data = formDataToObject(formData);
        if (data.min_rewards == '' || data.max_rewards == '') {
            return false;
        }
        else if (!(/^-?\d*\.?\d+$/.test(data.min_rewards)) || !(/^-?\d*\.?\d+$/.test(data.max_rewards))) {
            return false;
        }
        else if (parseInt(data.min_rewards) >= parseInt(data.max_rewards)) {
            return false;
        }
        else {
            requiredDataURL = setParams(requiredDataURL, 'rewards__gte', data.min_rewards);
            requiredDataURL = setParams(requiredDataURL, 'rewards__lte', data.max_rewards);
            getData(requiredDataURL);
            document.getElementById('selected-rewards-range').innerText = data.min_rewards + ' - ' + data.max_rewards;
            document.getElementById('selected-rewards-range').title = data.min_rewards + ' - ' + data.max_rewards;
        }
    }
}


function closeDropdowns(event) {
    if ((!salesChannelBtn.contains(event.target)) && salesChannelDropdown.style.display == 'flex') {
        salesChannelDropdown.style.display = "none";
    }
    else if((!typeBtn.contains(event.target)) && typeDropdown.style.display == 'flex') {
        typeDropdown.style.display = 'none';
    }
    else if ((!dateSelectorBtn.contains(event.target)) && dateSelectorInputWrapper.style.display == 'flex') {
        dateSelectorInputWrapper.style.display = 'none';
    }
    else if ((!netCashBtn.contains(event.target)) && netCashInputWrapper.style.display == 'flex') {
        netCashInputWrapper.style.display = 'none';
    }
    else if ((!rewardsBtn.contains(event.target)) && rewardsInputWrapper.style.display == 'flex') {
        rewardsInputWrapper.style.display = 'none';
    }
}

document.body.addEventListener('click', closeDropdowns);


function reverseTableRows() {
    const table = document.getElementById('activity-table');
    const tableBody = table.querySelector('tbody');
    const rows = Array.from(tableBody.querySelectorAll('tr'));

    rows.reverse();
    tableBody.innerHTML = '';

    for (const row of rows) {
        tableBody.appendChild(row);
    }
}


// Initialize an object to store the sort order for each column
const sortOrders = {};


function sortByAlphabets(event, columnIndex) {
    const arrows = event.target.closest('th').querySelectorAll('path');
    const table = document.getElementById("activity-table");
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


function extractNumber(value) {
    const match = value.match(/\d+/);
    return match ? parseFloat(match[0]) : 0;
}

function sortByDigits(event, columnIndex) {
    const columnArrows = event.target.closest('th').querySelectorAll('path');
    const table = document.getElementById("activity-table");
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


function sortByDate(event, columnIndex) {
    let arrows;
    if (event.target.closest('button')) {
        arrows = event.target.closest('button').querySelectorAll('path');
    } else if (event.target.closest('th')) {
        arrows = event.target.closest('th').querySelectorAll('path');
    }
    const table = document.getElementById("activity-table");
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
    sortOrders[2] = currentOrder === 'asc' ? 'desc' : 'asc';
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


function convertDateTime() {
    let activityTimes = document.querySelectorAll('.date-value');
    activityTimes.forEach((dateTime) => {
        const inputDate = new Date(dateTime.textContent);

        const day = new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(inputDate);
        const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(inputDate);
        const year = new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(inputDate);
        const result = `${day}-${month}-${year}`;

        dateTime.textContent = result;
    })
}


async function openProductPurchaseModal(modalID, id) {
    let modal = document.getElementById(`${modalID}`);
    modal.querySelector('.modal-content').classList.add('hide');
    modal.querySelector('.loader').classList.remove('hide');
    document.querySelector(`.${modalID}`).click();
    try {
        let token = getCookie('admin_access');
        let headers = {
            "Authorization": `Bearer ${token}`
        };
        let response = await requestAPI(`${apiURL}/admin/orders/${id}`, null, headers, 'GET');
        response.json().then(function(res) {
            console.log(res);
            if (response.status == 200) {
                modal.querySelector('#purchase-total').innerText = res.data.total;
                modal.querySelector('#purchase-rewards').innerText = res.data.rewards_earned;
                if (res.data.salon)
                    modal.querySelector('#purchase-salon').innerText = res.data.salon.salon_name;
                else
                    modal.querySelector('#purchase-salon').innerText = 'No Salon';
                modal.querySelector('#purchase-status').innerText = captalizeFirstLetter(res.data.status);
                if (res.data.order_shipping)
                    modal.querySelector('#purchase-tracking').innerText = res.data.order_shipping.tracking_number;
                else
                    modal.querySelector('#purchase-tracking').innerText = 'No tracking link';
                if (res.data.shipping_address)
                    modal.querySelector('#purchase-location').innerText = res.data.shipping_address.address;
                else
                    modal.querySelector('#purchase-location').innerText = 'No location';
                modal.querySelector('.loader').classList.add('hide');
                modal.querySelector('.modal-content').classList.remove('hide');
            }
        })
    }
    catch (err) {
        console.log(err);
    }
}