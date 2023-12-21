let requiredDataURL = `/admin/orders?page=1&perPage=1000&ordering=-created_at&created_at__gte=&created_at__lte=&status=&search=&purchase_type=`;

window.onload = () => {
    getNotifications();
    getData();
}


// function closeDropdowns(event) {
//     if ((!orderCompletionTypeBtn.contains(event.target)) && orderCompletionTypeDropdown.style.display == 'flex') {
//         orderCompletionTypeDropdown.style.display = "none";
//     }
//     else if ((!purchaseTypeBtn.contains(event.target)) && purchaseTypeDropdown.style.display == 'flex') {
//         purchaseTypeDropdown.style.display = "none";
//     }
// }

// document.body.addEventListener('click', closeDropdowns);


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
                convertDateTime();
            }
        })
    }
    catch (err) {
        console.log(err);
    }
}



const sortOrders = {};


function convertToDateTime(dateTimeString) {
    return new Date(dateTimeString);
}

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
        const x = convertToDateTime(rowA.getElementsByTagName("td")[2].getAttribute('dateTime'));
        const y = convertToDateTime(rowB.getElementsByTagName("td")[2].getAttribute('dateTime'));

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
    let searchField = document.getElementById('search-order');
    if (searchField.classList.contains('hide')) {
        searchField.classList.remove('hide');
        searchField.focus();
    }
}


function searchData(event) {
    let searchField = document.getElementById('search-order');
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