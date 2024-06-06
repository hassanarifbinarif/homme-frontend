let sourceTypeDropdown = document.getElementById('source-type-dropdown');
let sourceTypeBtn = document.getElementById('source-type-btn');
let selectedSourceType = document.getElementById('selected-source-type');

let salesChannelBtn = document.getElementById('select-order-channel-btn');
let salesChannelDropdown = document.getElementById('order-channel-dropdown');

let sourceChannelBtn = document.getElementById('select-source-channel-btn');
let sourceChannelDropdown = document.getElementById('source-channel-dropdown');

let selectedSalesChannel = [];
let salesChannelFilterString = '';

let selectedSourceChannel = [];
let sourceChannelFilterString = '';

let requiredDataURL = `/admin/user-profiles?user__is_blocked=false&perPage=1000&search=&ordering=-id`;


window.onload = () => {
    let url = new URL(location.href);
    let search = url.searchParams.get('search');
    if (search) {
        requiredDataURL = setParams(requiredDataURL, 'search', search);
    }
    // getNotifications();
    getData();
    populateSalonDropdown();
}


function closeDropdowns(event) {
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
    if (url == null) {
        data = requiredDataURL;
    }
    else {
        data = url;
    }
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


sourceChannelBtn.addEventListener('click', function() {
    if (sourceChannelDropdown.style.display == 'flex') {
        sourceChannelDropdown.style.display = 'none';
    }
    else {
        sourceChannelDropdown.style.display = 'flex';
    }
})


function selectSourceChannel(inputElement) {
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


async function getSourceTypes() {
    let token = getCookie('admin_access');
    let headers = { "Authorization": `Bearer ${token}` };
    let response = await requestAPI(`${apiURL}/admin/sources/types?page=1&perPage=1000`, null, headers, 'GET');
    response.json().then(function(res) {
        if (response.status == 200) {
            res.data.forEach((sourceType) => {
                sourceTypeDropdown.innerHTML += `<span onclick="filterSourceType(this);" data-value="${sourceType.id}">${sourceType.name}</span>`;
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


function filterSourceType(element) {
    if (selectedSourceType.innerText != element.innerText) {
        requiredDataURL = setParams(requiredDataURL, 'user__source_referrer__type', element.getAttribute('data-value'));
        getData(requiredDataURL);
    }
    selectedSourceType.innerText = element.innerText;
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