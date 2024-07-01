let orderStatTimeBtn = document.getElementById('select-order-stat-time-btn');
let selectedOrderStatTime = document.getElementById('selected-order-stat-opt');
let orderStatsDropdown = document.getElementById('order-stats-dropdown');

let sourceOwnerBtn = document.getElementById('source-owner-btn');
let sourceOwnerWrapper = document.getElementById('source-owner-selector');
let sourceOwnerDropdown = document.getElementById('source-owner-dropdown');
let sourceOwnerData = {};

let sourceBtn = document.getElementById('source-btn');
let sourceWrapper = document.getElementById('source-selector');
let sourceDropdown = document.getElementById('source-dropdown');
let sourceData = {};

let purchaseTypeDropdown = document.getElementById('purchase-type-dropdown');
let purchaseTypeBtn = document.getElementById('purchase-type-btn');

let sourceTypeDropdown = document.getElementById('source-type-dropdown');
let sourceTypeBtn = document.getElementById('source-type-btn');
let selectedSourceType = document.getElementById('selected-source-type');

let salesChannelBtn = document.getElementById('select-source-channel-btn');
let salesChannelDropdown = document.getElementById('source-channel-dropdown');

let sourceChannelBtn = document.getElementById('select-source-channel-btn');
let sourceChannelDropdown = document.getElementById('source-channel-dropdown');

let requiredDataURL = `/admin/sources?page=1&perPage=1000&ordering=-id`;
let searchField = document.getElementById('search-order');
let tableBody = document.getElementById('all-sources-table');

let sourceTypeList = document.getElementById('source-type-list');
let sourceChannelList = document.getElementById('source-channel-list');

window.onload = () => {
    getData();
}


function closeDropdowns(event) {
    if ((!orderStatTimeBtn.contains(event.target)) && (!orderStatsDropdown.classList.contains('hide'))) {
        orderStatsDropdown.classList.add('hide');
    }
    if ((!sourceBtn.contains(event.target)) && sourceWrapper.style.display == 'flex') {
        sourceWrapper.style.display = "none";
    }
    if ((!sourceOwnerBtn.contains(event.target)) && sourceOwnerDropdown.style.display == 'flex') {
        sourceOwnerDropdown.style.display = "none";
    }
    if ((!sourceTypeBtn.contains(event.target)) && sourceTypeDropdown.style.display == 'flex') {
        sourceTypeDropdown.style.display = "none";
    }
    if (!(sourceChannelBtn.contains(event.target)) && !(sourceChannelDropdown.contains(event.target))) {
        sourceChannelDropdown.style.display = "none";
    }
    if ((!sourceOwnerBtn.contains(event.target)) && sourceOwnerWrapper.style.display == 'flex') {
        sourceOwnerWrapper.style.display = 'none';
    }
}

document.body.addEventListener('click', closeDropdowns);


async function getData(url=null) {
    let data;
    if (url == null) {
        data = requiredDataURL;
    }
    else {
        data = url
    }
    tableBody.classList.add('hide');
    document.getElementById('table-loader').classList.remove('hide');
    try {
        let response = await requestAPI('/get-all-sources-list/', JSON.stringify(data), {}, 'POST');
        response.json().then(function(res) {
            if (res.success) {
                document.getElementById('table-loader').classList.add('hide');
                tableBody.innerHTML = res.all_sources_data;
                tableBody.classList.remove('hide');
                document.getElementById('total-sources-count').innerHTML = res.stats.total_sources || 0;
                document.getElementById('total-users-count').innerHTML = res.stats.total_referrals || 0;
                document.getElementById('total-customers-count').innerHTML = res.stats.total_referrals_with_orders || 0;
                document.getElementById('total-order-count').innerHTML = res.stats.total_orders_by_referrals || 0;
                document.getElementById('total-sales').innerHTML = res.stats.total_sales_by_referrals || 0;
            }
            else {
                tableBody.querySelector('tbody').innerHTML = `<tr><td colspan="9" class="no-record-row">No record available</td></tr>`;
                document.getElementById('total-sources-count').innerHTML = '--';
                document.getElementById('total-users-count').innerHTML = '--';
                document.getElementById('total-customers-count').innerHTML = '--';
                document.getElementById('total-order-count').innerHTML = '--';
                document.getElementById('total-sales').innerHTML = '--';
                document.getElementById('table-loader').classList.add('hide');
                tableBody.classList.remove('hide');
            }
        })
    }
    catch (err) {
        console.log(err);
    }
}


// salesChannelBtn.addEventListener('click', function() {
//     if (salesChannelDropdown.style.display == 'flex') {
//         salesChannelDropdown.style.display = 'none';
//     }
//     else {
//         salesChannelDropdown.style.display = 'flex';
//     }
// })


// let selectedSalesChannel = [];
// let salesChannelFilterString = '';

// function selectSalesChannel(inputElement) {
//     if (inputElement.checked) {
//         selectedSalesChannel.push(inputElement.value);
//     }
//     else {
//         const index = selectedSalesChannel.indexOf(inputElement.value);
//         if (index !== -1) {
//           selectedSalesChannel.splice(index, 1);
//         }
//     }
//     salesChannelFilterString = selectedSalesChannel.join(',');
//     requiredDataURL = setParams(requiredDataURL, 'sales_channel', salesChannelFilterString);
//     getData(requiredDataURL);
//     salesChannelDropdown.style.display = "none";
//     salesChannelBtn.click();
// }


sourceChannelBtn.addEventListener('click', function() {
    if (sourceChannelDropdown.style.display == 'flex') {
        sourceChannelDropdown.style.display = 'none';
    }
    else {
        sourceChannelDropdown.style.display = 'flex';
    }
})

// let selectedSourceChannel = [];
// let sourceChannelFilterString = '';

function selectSourceChannel(inputElement) {
    if (inputElement.checked) {
        // selectedSourceChannel.push(inputElement.value);
        requiredDataURL = setParams(requiredDataURL, 'channel', inputElement.value);
        getData(requiredDataURL);
        sourceChannelDropdown.style.display = "none";
        sourceChannelBtn.click();
    }
    // else {
    //     const index = selectedSourceChannel.indexOf(inputElement.value);
    //     if (index !== -1) {
    //       selectedSourceChannel.splice(index, 1);
    //     }
    // }
    // sourceChannelFilterString = selectedSourceChannel.join(',');
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


const sortOrders = {};


function extractNumber(value) {
    const match = value.match(/\d+/);
    return match ? parseFloat(match[0]) : 0;
}

function sortByOrder(event, columnIndex) {
    const columnArrows = event.target.closest('th').querySelectorAll('path');
    const table = document.getElementById("all-sources-table");
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
    const table = document.getElementById("all-sources-table");
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
    const table = document.getElementById('all-sources-table');
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


async function getSourceTypes() {
    let token = getCookie('admin_access');
    let headers = { "Authorization": `Bearer ${token}` };
    let response = await requestAPI(`${apiURL}/admin/sources/types?page=1&perPage=1000`, null, headers, 'GET');
    response.json().then(function(res) {
        if (response.status == 200) {
            sourceTypeList.innerHTML = '';
            sourceTypeDropdown.innerHTML = '';
            res.data.forEach((sourceType) => {
                sourceTypeDropdown.innerHTML += `<span onclick="filterSourceType(this);" data-value="${sourceType.id}">${sourceType.name}</span>`;
                sourceTypeList.innerHTML += `<div class="source">
                                                    <input maxlength="100" readonly class="individual-source-input" type="text" name="edit_source_name_${sourceType.id}" value="${sourceType.name}" placeholder="Source Name" />
                                                    <div>
                                                        <svg class="cursor-pointer" onclick="openUpdateSourceTypeChannelModal('editSourceTypeChannelModal', 'type', ${sourceType.id}, '${sourceType.name}')" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M9.16683 4.16762H5.00016C4.55814 4.16762 4.13421 4.34321 3.82165 4.65577C3.50909 4.96833 3.3335 5.39225 3.3335 5.83428V15.0009C3.3335 15.443 3.50909 15.8669 3.82165 16.1795C4.13421 16.492 4.55814 16.6676 5.00016 16.6676H14.1668C14.6089 16.6676 15.0328 16.492 15.3453 16.1795C15.6579 15.8669 15.8335 15.443 15.8335 15.0009V10.8343M14.6552 2.98928C14.8089 2.8301 14.9928 2.70313 15.1962 2.61578C15.3995 2.52843 15.6182 2.48245 15.8395 2.48053C16.0608 2.47861 16.2803 2.52078 16.4851 2.60458C16.6899 2.68838 16.876 2.81214 17.0325 2.96862C17.189 3.12511 17.3127 3.3112 17.3965 3.51603C17.4803 3.72085 17.5225 3.94032 17.5206 4.16162C17.5187 4.38292 17.4727 4.60162 17.3853 4.80496C17.298 5.0083 17.171 5.1922 17.0118 5.34595L9.85683 12.5009H7.50016V10.1443L14.6552 2.98928Z" stroke="#000093" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                        </svg>
                                                        <svg class="cursor-pointer" onclick="openDelSourceTypeModal('delModal', ${sourceType.id})" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M8.3335 9.16667V14.1667M11.6668 9.16667V14.1667M3.3335 5.83333H16.6668M15.8335 5.83333L15.111 15.9517C15.0811 16.3722 14.8929 16.7657 14.5844 17.053C14.2759 17.3403 13.87 17.5 13.4485 17.5H6.55183C6.13028 17.5 5.72438 17.3403 5.4159 17.053C5.10742 16.7657 4.91926 16.3722 4.88933 15.9517L4.16683 5.83333H15.8335ZM12.5002 5.83333V3.33333C12.5002 3.11232 12.4124 2.90036 12.2561 2.74408C12.0998 2.5878 11.8878 2.5 11.6668 2.5H8.3335C8.11248 2.5 7.90052 2.5878 7.74424 2.74408C7.58796 2.90036 7.50016 3.11232 7.50016 3.33333V5.83333H12.5002Z" stroke="#CF0000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                        </svg>
                                                    </div>
                                                </div>`;
            })
        }
    })
}

window.addEventListener('load', getSourceTypes);


async function getSourceChannels() {
    let token = getCookie('admin_access');
    let headers = { "Authorization": `Bearer ${token}` };
    let response = await requestAPI(`${apiURL}/admin/sources/channels?page=1&perPage=10000`, null, headers, 'GET');
    response.json().then(function(res) {
        if (response.status == 200) {
            sourceChannelList.innerHTML = '';
            // sourceTypeDropdown.innerHTML = '';
            res.data.forEach((sourceChannel) => {
                // sourceTypeDropdown.innerHTML += `<span onclick="filterSourceType(this);" data-value="${sourceType.id}">${sourceType.name}</span>`;
                sourceChannelList.innerHTML += `<div class="source">
                                                    <input maxlength="100" readonly class="individual-source-input" type="text" name="edit_source_name_${sourceChannel.id}" value="${sourceChannel.name}" placeholder="Source Channel Name" />
                                                    <div>
                                                        <svg class="${sourceChannel.is_basic == true ? 'opacity-point-3-5' : 'cursor-pointer'}" ${sourceChannel.is_basic == false ? `onclick="openUpdateSourceTypeChannelModal('editSourceTypeChannelModal', 'channel', ${sourceChannel.id}, '${sourceChannel.name}')"` : '' } width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            ${sourceChannel.is_basic == true ? '<title>Non-editable</title>' : ''}
                                                            <path d="M9.16683 4.16762H5.00016C4.55814 4.16762 4.13421 4.34321 3.82165 4.65577C3.50909 4.96833 3.3335 5.39225 3.3335 5.83428V15.0009C3.3335 15.443 3.50909 15.8669 3.82165 16.1795C4.13421 16.492 4.55814 16.6676 5.00016 16.6676H14.1668C14.6089 16.6676 15.0328 16.492 15.3453 16.1795C15.6579 15.8669 15.8335 15.443 15.8335 15.0009V10.8343M14.6552 2.98928C14.8089 2.8301 14.9928 2.70313 15.1962 2.61578C15.3995 2.52843 15.6182 2.48245 15.8395 2.48053C16.0608 2.47861 16.2803 2.52078 16.4851 2.60458C16.6899 2.68838 16.876 2.81214 17.0325 2.96862C17.189 3.12511 17.3127 3.3112 17.3965 3.51603C17.4803 3.72085 17.5225 3.94032 17.5206 4.16162C17.5187 4.38292 17.4727 4.60162 17.3853 4.80496C17.298 5.0083 17.171 5.1922 17.0118 5.34595L9.85683 12.5009H7.50016V10.1443L14.6552 2.98928Z" stroke="#000093" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                        </svg>
                                                        <svg class="${sourceChannel.is_basic == true ? 'opacity-point-3-5' : 'cursor-pointer'}" ${sourceChannel.is_basic == false ? `onclick="openDelSourceChannelModal('delModal', ${sourceChannel.id})"` : '' } width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            ${sourceChannel.is_basic == true ? '<title>Non-deleteable</title>' : ''}
                                                            <path d="M8.3335 9.16667V14.1667M11.6668 9.16667V14.1667M3.3335 5.83333H16.6668M15.8335 5.83333L15.111 15.9517C15.0811 16.3722 14.8929 16.7657 14.5844 17.053C14.2759 17.3403 13.87 17.5 13.4485 17.5H6.55183C6.13028 17.5 5.72438 17.3403 5.4159 17.053C5.10742 16.7657 4.91926 16.3722 4.88933 15.9517L4.16683 5.83333H15.8335ZM12.5002 5.83333V3.33333C12.5002 3.11232 12.4124 2.90036 12.2561 2.74408C12.0998 2.5878 11.8878 2.5 11.6668 2.5H8.3335C8.11248 2.5 7.90052 2.5878 7.74424 2.74408C7.58796 2.90036 7.50016 3.11232 7.50016 3.33333V5.83333H12.5002Z" stroke="#CF0000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                        </svg>
                                                    </div>
                                                </div>`;
            })
        }
    })
}

window.addEventListener('load', getSourceChannels);


async function getSourceOwner() {
    let token = getCookie('admin_access');
    let headers = { "Authorization": `Bearer ${token}` };
    let responseSourceOwnerList = await requestAPI(`${apiURL}/admin/salon-profiles?user__is_blocked=false&page=1&perPage=10000&ordering=-created_at`, null, headers, 'GET');
    responseSourceOwnerList.json().then(function(res) {
        sourceOwnerData = [...res.data];
        // sourceOwnerData.unshift({'salon_name': 'HOMME', 'user': {'id': 'homme-management'}})
        sourceOwnerData.forEach((owner) => {
            sourceOwnerDropdown.insertAdjacentHTML('beforeend', `<div class="radio-btn source-owner-item-list" data-id="${owner.user.id}">
                                                                    <input onchange="selectSourceOwner(this);" id="owner-${owner.user.id}" type="radio" value="${owner.user.id}" name="owner" />
                                                                    <label for="owner-${owner.user.id}" class="radio-label">${owner.salon_name}</label>
                                                                </div>`);
        })
    })
}

window.addEventListener('load', getSourceOwner);


function searchSourceOwner(event, inputElement) {
    let filteredCustomer = [];
    filteredCustomer = sourceOwnerData.filter(owner => owner.salon_name.toLowerCase().includes(inputElement.value.toLowerCase())).map((owner => owner.user.id));
    if (filteredCustomer.length == 0) {
        document.getElementById('no-source-owner-text').classList.remove('hide');
        document.querySelectorAll('.source-owner-item-list').forEach((item) => item.classList.add('hide'));
    }
    else {
        document.getElementById('no-source-owner-text').classList.add('hide');
        document.querySelectorAll('.source-owner-item-list').forEach((item) => {
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


function selectSourceOwner(inputElement) {
    if (inputElement.checked) {
        requiredDataURL = setParams(requiredDataURL, 'owner', inputElement.value);
        getData();
        document.getElementById('selected-source-owner').innerText = inputElement.nextElementSibling.innerText;
        document.getElementById('selected-source-owner').title = inputElement.nextElementSibling.innerText;
        document.getElementById('source-owner-filter-input').value = inputElement.nextElementSibling.innerText;
        sourceOwnerWrapper.style.display = 'none';
    }
}


async function getSource() {
    let token = getCookie('admin_access');
    let headers = { "Authorization": `Bearer ${token}` };
    let responseSourceList = await requestAPI(`${apiURL}${requiredDataURL}`, null, headers, 'GET');
    responseSourceList.json().then(function(res) {
        sourceData = [...res.data];
        res.data.forEach((source) => {
            sourceDropdown.insertAdjacentHTML('beforeend', `<div class="radio-btn source-item-list" data-id="${source.id}">
                                                                    <input onchange="selectSource(this);" id="source-name-${source.id}" type="radio" value="${source.name}" name="source_name" />
                                                                    <label for="source-name-${source.id}" class="radio-label">${source.name}</label>
                                                                </div>`);
        })
    })
}

window.addEventListener('load', getSource);


function searchSource(event, inputElement) {
    let filteredCustomer = [];
    filteredCustomer = sourceData.filter(source => source.name.toLowerCase().includes(inputElement.value.toLowerCase())).map((source => source.id));
    if (filteredCustomer.length == 0) {
        document.getElementById('no-source-text').classList.remove('hide');
        document.querySelectorAll('.source-item-list').forEach((item) => item.classList.add('hide'));
    }
    else {
        document.getElementById('no-source-text').classList.add('hide');
        document.querySelectorAll('.source-item-list').forEach((item) => {
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


function selectSource(inputElement) {
    if (inputElement.checked) {
        requiredDataURL = setParams(requiredDataURL, 'name__icontains', inputElement.value);
        getData();
        // document.getElementById('selected-source').innerText = inputElement.nextElementSibling.innerText;
        // document.getElementById('selected-source').title = inputElement.nextElementSibling.innerText;
        document.getElementById('source-filter-input').value = inputElement.nextElementSibling.innerText;
        sourceWrapper.style.display = 'none';
    }
}


function toggleSourceTypeDropdown() {
    if (sourceTypeDropdown.style.display == 'flex') {
        sourceTypeDropdown.style.display = 'none';
    }
    else {
        sourceTypeDropdown.style.display = 'flex';
    }
}


function filterSourceType(element) {
    if (selectedSourceType.innerText != element.innerText) {
        requiredDataURL = setParams(requiredDataURL, 'type', element.getAttribute('data-value'));
        getData(requiredDataURL);
    }
    selectedSourceType.innerText = element.innerText;
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
}


function toggleSourceOwnerDropdown(event) {
    if ((sourceOwnerBtn.contains(event.target)) && sourceOwnerWrapper.style.display == 'none') {
        sourceOwnerWrapper.style.display = 'flex';
    }
}


function toggleSourceDropdown(event) {
    if ((sourceBtn.contains(event.target)) && sourceWrapper.style.display == 'none') {
        sourceWrapper.style.display = 'flex';
    }
}


function filterOrderCompletionType(event) {
    let element = event.target;
    requiredDataURL = setParams(requiredDataURL, 'status', element.getAttribute('data-value'));
    getData(requiredDataURL);
    document.getElementById('selected-order-completion-type').innerText = element.innerText;
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
    
    if (currentMonth >= 0 && currentMonth <= 2) {
      startMonth = 0;
      endMonth = 2;
    } else if (currentMonth >= 3 && currentMonth <= 5) {
      startMonth = 3;
      endMonth = 5;
    } else if (currentMonth >= 6 && currentMonth <= 8) {
      startMonth = 6;
      endMonth = 8;
    } else {
      startMonth = 9;
      endMonth = 11;
    }
  
    let startOfQuarter = new Date(currentYear, startMonth, 1, 0, 0, 0, 0);
    let endOfQuarter = new Date(currentYear, endMonth + 1, 0, 23, 59, 59, 999);

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
  
    if (currentMonth >= 0 && currentMonth <= 2) {
      startMonth = 9;
      endMonth = 11;
      currentYear--;
    } else if (currentMonth >= 3 && currentMonth <= 5) {
      startMonth = 0;
      endMonth = 2;
    } else if (currentMonth >= 6 && currentMonth <= 8) {
      startMonth = 3;
      endMonth = 5;
    } else {
      startMonth = 6;
      endMonth = 8;
    }
  
    let startOfLastQuarter = new Date(currentYear, startMonth, 1, 0, 0, 0, 0);
    let endOfLastQuarter = new Date(currentYear, endMonth + 1, 0, 23, 59, 59, 999);

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

        const day = new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(inputDate);
        const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(inputDate);
        const year = new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(inputDate);

        const result = `${day}-${month}-${year}`;

        dateTime.textContent = result;
    })
}


function openUpdateSourceTypeChannelModal(modalID, type='type', id, name) {
    let modal = document.querySelector(`#${modalID}`);
    let form = modal.querySelector('form');
    modal.querySelector('#source-type-channel-modal-header').innerText = `Edit Source ${captalizeFirstLetter(type)}`;
    form.querySelector('input[name="name"]').value = name || '';
    form.setAttribute("onsubmit", `updateSource${captalizeFirstLetter(type)}Form(event, ${id})`);
    modal.addEventListener('hidden.bs.modal', event => {
        form.reset();
        form.removeAttribute("onsubmit");
        modal.querySelector('.btn-text').innerText = 'SAVE';
    })
    document.querySelector(`.${modalID}`).click();
}