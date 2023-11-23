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

let requiredDataURL = `${apiURL}/admin/activities?page=1&perPage=1000&ordering=-created_at`;


window.onload = () => {
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
    let token = getCookie('admin_access');
    let headers = {
        "Authorization": `Bearer ${token}`
    }
    let data;
    let tableBody = document.getElementById('activity-table');
    if (url == null) {
        data = requiredDataURL;
    }
    else {
        data = url;
        document.getElementById('table-loader').classList.remove('hide');
        tableBody.classList.add('hide');
    }
    try {
        let response = await requestAPI('/get-activities-list/', JSON.stringify(data), {}, 'POST');
        response.json().then(function(res) {
            if (res.success) {
                document.getElementById('table-loader').classList.add('hide');
                tableBody.innerHTML = res.activity_data;
                tableBody.classList.remove('hide');
            }
        })
    }
    catch (err) {
        console.log(err);
    }
}


function toggleSalesChannelDropdown() {
    if (salesChannelDropdown.style.display == 'flex') {
        salesChannelDropdown.style.display = 'none';
    }
    else {
        salesChannelDropdown.style.display = 'flex';
    }
}

function filterSalesChannelOption(event) {
    let element = event.target;
    document.getElementById('selected-sales-channel').innerText = element.innerText;
}



function filterTypeOption(event) {
    let element = event.target;
    requiredDataURL = setParams(requiredDataURL, 'type', element.getAttribute('data-value'));
    getData(requiredDataURL);
    // document.getElementById('selected-type').innerText = element.innerText;
}

function toggleTypeDropdown() {
    if (typeDropdown.style.display == 'flex') {
        typeDropdown.style.display = 'none';
    }
    else {
        typeDropdown.style.display = 'flex';
    }
}


function toggleDateSelectorInputs(event) {
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
    }
}


function toggleNetCashInputs(event) {
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
        }
    }
}


function toggleRewardsInputs(event) {
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