let sourceTypeDropdown = document.getElementById('source-type-list-dropdown');
let sourceTypeBtn = document.getElementById('source-type-btn');
let selectedSourceType = document.getElementById('selected-source-type');

let salesChannelBtn = document.getElementById('select-order-channel-btn');
let salesChannelDropdown = document.getElementById('order-channel-dropdown');

let sourceChannelBtn = document.getElementById('select-source-channel-btn');
let sourceChannelListDropdown = document.getElementById('source-channel-list-dropdown');

let selectedSalesChannel = [];
let salesChannelFilterString = '';

let perPage = 29;
let requiredDataURL = `/admin/user-profiles?user__is_blocked=false&perPage=${perPage}&search=&ordering=-id`;

let perPageDropdownOptionContainer = document.getElementById('per-page-dropdown-options-container');
let previousPageBtn = document.getElementById('previous-nav-btn');
let nextPageBtn = document.getElementById('next-nav-btn');
let currentPageElement = document.getElementById('current-nav-page');


window.onload = () => {
    let url = new URL(location.href);
    let search = url.searchParams.get('search');
    if (search) {
        requiredDataURL = setParams(requiredDataURL, 'search', search);
    }
    // getNotifications();
    getData();
    populateSalonDropdown();
    populatePossiblePerPageOptions();
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
    perPage = count;
    requiredDataURL = setParams(requiredDataURL, 'perPage', perPage);
    requiredDataURL = setParams(requiredDataURL, 'page', 1);
    getData();
    document.getElementById('current-per-page').innerText = perPage;
}


function closeDropdowns(event) {
    if ((!sourceTypeBtn.contains(event.target)) && sourceTypeDropdown.style.display == 'flex') {
        sourceTypeDropdown.style.display = "none";
    }
    if (!(salesChannelBtn.contains(event.target)) && !(salesChannelDropdown.contains(event.target))) {
        salesChannelDropdown.style.display = "none";
    }
    if (!(sourceChannelBtn.contains(event.target)) && !(sourceChannelListDropdown.contains(event.target))) {
        sourceChannelListDropdown.style.display = "none";
    }
}

document.body.addEventListener('click', closeDropdowns);


function searchForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let formData = new FormData(form);
    let data = formDataToObject(formData);
    urlParams = setParams(requiredDataURL, 'search', `${data.search}`);
    getData(urlParams);
}


let totalCustomers = null;

async function getData(url=null) {
    let data;
    let tableBody = document.getElementById('customer-table');
    if (url == null)
        data = requiredDataURL;
    else
        data = url;
    document.getElementById('table-loader').classList.remove('hide');
    tableBody.classList.add('hide');
    try {
        let response = await requestAPI('/get-customer-list/', JSON.stringify(data), {}, 'POST');
        response.json().then(function(res) {
            if (res.success) {
                document.getElementById('table-loader').classList.add('hide');
                tableBody.innerHTML = res.customer_data;
                if (totalCustomers == null) {
                    totalCustomers = res.total_customers;
                    document.getElementById('total-customer-number').innerText = res.total_customers;
                }
                setPaginationLinks(res.pagination_data);
                tableBody.classList.remove('hide');
            }
            else {
                tableBody.querySelector('tbody').innerHTML = `<tr>
                                                                <td colspan="10" class="no-record-row">No record available</td>
                                                            </tr>`;
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
                sourceChannelListDropdown.innerHTML += `<label for="source-channel-dropdown-${sourceChannel.id}" class="cursor-pointer">
                                                            <span>${sourceChannel.name}</span>
                                                            <input type="checkbox" onchange="filterSourceChannel(this);" id="source-channel-dropdown-${sourceChannel.id}" value="${sourceChannel.id}" name="source_channel_dropdown_checkbox" />
                                                        </label>`;
            })
        }
    })
}

window.addEventListener('load', getSourceChannels);


sourceChannelBtn.addEventListener('click', function() {
    if (sourceChannelListDropdown.style.display == 'flex') {
        sourceChannelListDropdown.style.display = 'none';
    }
    else {
        sourceChannelListDropdown.style.display = 'flex';
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


function reverseTableRows() {
    const table = document.getElementById('customer-table');
    const tableBody = table.querySelector('tbody');
    const rows = Array.from(tableBody.querySelectorAll('tr'));

    rows.reverse();
    tableBody.innerHTML = '';

    for (const row of rows) {
        tableBody.appendChild(row);
    }
}


const sortOrders = {};


function sortByAlphabets(event, columnIndex) {
    const arrows = event.target.closest('th').querySelectorAll('path');
    const table = document.getElementById("customer-table");
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


function extractNumber(value) {
    const match = value.match(/\d+/);
    return match ? parseFloat(match[0]) : 0;
}

function sortByOrder(event, columnIndex) {
    const columnArrows = event.target.closest('th').querySelectorAll('path');
    const table = document.getElementById("customer-table");
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