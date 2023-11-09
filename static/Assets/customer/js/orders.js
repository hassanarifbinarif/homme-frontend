// window.onload = () => {
//     let table = new DataTable('#myTable', {
//         order: [],
//         columnDefs: [
//             {orderable: false, targets: 0}
//         ],
//         paging: false,
//         searching: false,
//         language: {
//             info: "",
//         },
//     });
// }

let requiredDataURL = `${apiURL}/admin/orders?page=1&perPage=1000&ordering=-created_at`;

window.onload = () => {
    getData();
    populateDropdowns();
}


let notificationIcon = document.getElementById('notification-icon');
let notificationDataWrapper = document.getElementById('notification-data-wrapper');
let notificationCloseBtn = document.getElementById('notification-close-btn');

notificationIcon.addEventListener('click', toggleNotifications);
notificationCloseBtn.addEventListener('click', toggleNotifications);

function toggleNotifications() {
    if (notificationDataWrapper.classList.contains('hide')) {
        notificationDataWrapper.classList.remove('hide');
    }
    else {
        notificationDataWrapper.classList.add('hide');
    }
}


function closeDropdowns(event) {
    if((!notificationDataWrapper.contains(event.target)) && (!notificationIcon.contains(event.target)) && (!notificationDataWrapper.classList.contains('hide'))) {
        notificationDataWrapper.classList.add('hide');
    }
    else if ((!orderStatTimeBtn.contains(event.target)) && (!orderStatsDropdown.classList.contains('hide'))) {
        orderStatsDropdown.classList.add('hide');
    }
    else if ((!orderCompletionTypeBtn.contains(event.target)) && orderCompletionTypeDropdown.style.display == 'flex') {
        orderCompletionTypeDropdown.style.display = "none";
    }
    else if ((!purchaseTypeBtn.contains(event.target)) && purchaseTypeDropdown.style.display == 'flex') {
        purchaseTypeDropdown.style.display = "none";
    }
}

document.body.addEventListener('click', closeDropdowns);


async function getData(url=null) {
    let token = getCookie('admin_access');
    let headers = {
        "Authorization": `Bearer ${token}`
    }
    let data;
    let tableBody = document.getElementById('order-table');
    if (url == null) {
        data = requiredDataURL;
    }
    else {
        data = url
    }
    tableBody.classList.add('hide');
    document.getElementById('table-loader').classList.remove('hide');
    try {
        // let resp = await requestAPI(requiredDataURL, null, headers, 'GET');
        // resp.json().then(function(res) {
        //     console.log(res);
        // })
        let response = await requestAPI('/get-order-list/', JSON.stringify(data), {}, 'POST');
        response.json().then(function(res) {
            // console.log(res);
            if (res.success) {
                document.getElementById('table-loader').classList.add('hide');
                tableBody.innerHTML = res.order_data;
                tableBody.classList.remove('hide');
                document.getElementById('total-order-value').innerHTML = res.total_orders;
                document.getElementById('total-ordered-items').innerHTML = res.ordered_items;
            }
        })
    }
    catch (err) {
        console.log(err);
    }
}


let orderStatTimeBtn = document.getElementById('select-order-stat-time-btn');
let selectedOrderStatTime = document.getElementById('selected-order-stat-opt');
let orderStatsDropdown = document.getElementById('order-stats-dropdown');

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
    selectedOrderStatTime.innerText = element.innerText;
    orderStatsDropdown.classList.add('hide');
    orderStatTimeBtn.click();
}


let isAscendingDate = true;

function convertToDateTime(dateTimeString) {
    return new Date(dateTimeString);
}

function sortByDate(event) {
    // const url = new URL(requiredDataURL);
    // let ordering = url.searchParams.get('ordering');
    // if (ordering == '-created_at') {
    //     ordering = 'created_at';
    //     url.searchParams.set('ordering', ordering);
    // }
    // else {
    //     ordering = '-created_at';
    //     url.searchParams.set('ordering', ordering);
    // }
    // requiredDataURL = url.toString();
    // getData(requiredDataURL);

    let arrows;
    if (event.target.closest('button')) {
        arrows = event.target.closest('button').querySelectorAll('path');
        // console.log('button');
    }
    else if (event.target.closest('th')) {
        arrows = event.target.closest('th').querySelectorAll('path');
        // console.log('column')
    }
    var table = document.getElementById("order-table");
    var rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    switching = true;
    dir = "asc";

    while (switching) {
        switching = false;
        rows = table.rows;

        for (i = 1; i < rows.length - 1; i++) {
            shouldSwitch = false;

            x = convertToDateTime(rows[i].getElementsByTagName("td")[2].getAttribute('dateTime'));
            y = convertToDateTime(rows[i + 1].getElementsByTagName("td")[2].getAttribute('dateTime'));

            if (dir === "asc") {
                if (x > y) {
                    shouldSwitch = true;
                    arrows[0].setAttribute('opacity', '.2');
                    arrows[1].setAttribute('opacity', '1');
                    break;
                }
            } else if (dir === "desc") {
                if (x < y) {
                    shouldSwitch = true;
                    arrows[0].setAttribute('opacity', '1');
                    arrows[1].setAttribute('opacity', '.2');
                    break;
                }
            }
        }

        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        } else {
            if (switchcount === 0 && dir === "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}


function extractNumber(value) {
    return parseFloat(value.match(/\d+/)[0]);
}

function sortByOrder(event, columnIndex) {
    let columnArrows = event.target.closest('th').querySelectorAll('path');
    var table = document.getElementById("order-table");
    var rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    switching = true;
    dir = "asc"; // Set the default sorting direction to ascending

    while (switching) {
        switching = false;
        rows = table.rows;
    
        for (i = 1; i < rows.length - 1; i++) {
            shouldSwitch = false;
    
            x = extractNumber(rows[i].getElementsByTagName("td")[columnIndex].textContent);
            y = extractNumber(rows[i + 1].getElementsByTagName("td")[columnIndex].textContent);
        
            if (dir === "asc") {
                columnArrows[0].setAttribute('opacity', '.2');
                columnArrows[1].setAttribute('opacity', '1');
                if (x > y) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir === "desc") {
                columnArrows[0].setAttribute('opacity', '1');
                columnArrows[1].setAttribute('opacity', '.2');
                if (x < y) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
    
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        } else {
            if (switchcount === 0 && dir === "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}


function sortByAlphabets(event, columnIndex) {
    let arrows = event.target.closest('th').querySelectorAll('path');
    var rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("order-table");
    switching = true;
    dir = "asc";

    while (switching) {
        switching = false;
        rows = table.rows;

        for (i = 1; i < rows.length - 1; i++) {
            shouldSwitch = false;

            x = rows[i].getElementsByTagName("td")[columnIndex].textContent;
            y = rows[i + 1].getElementsByTagName("td")[columnIndex].textContent;

            if (dir === "asc") {
                arrows[0].setAttribute('opacity', '.2');
                arrows[1].setAttribute('opacity', '1');
                if (x.toLowerCase() > y.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir === "desc") {
                arrows[0].setAttribute('opacity', '1');
                arrows[1].setAttribute('opacity', '.2');
                if (x.toLowerCase() < y.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }

        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        } else {
            if (switchcount === 0 && dir === "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
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
    let searchField = document.getElementById('search-order');
    if (searchField.classList.contains('hide')) {
        searchField.classList.remove('hide');
        searchField.focus();
    }
}

let isSearchFiltered = false;
let isPurchaseFiltered = false;

function searchData(event) {
    let searchField = document.getElementById('search-order');
    if (event.key == 'Enter') {
        const table = document.getElementById("order-table");
        const rows = table.getElementsByTagName("tr");
        for (let i = 1; i < rows.length; i++) {
            const cellValue = rows[i].getElementsByTagName("td")[3].children[0].children[0].innerText;

            if (cellValue.toLowerCase().includes(searchField.value.toLowerCase())) {
                if (rows[i].getAttribute('purchase-filtered') != 'false' && rows[i].getAttribute('order-completion-filtered') != 'false')
                    rows[i].style.display = "";
                rows[i].setAttribute('search-filtered', true);
            } else if (searchField.value == '') {
                if (rows[i].getAttribute('purchase-filtered') != 'false')
                    rows[i].style.display = "";
                rows[i].setAttribute('search-filtered', true);
            }
            else {
                rows[i].style.display = "none";
                rows[i].setAttribute('search-filtered', false);
            }
        }
        // urlParams = setParams(requiredDataURL, 'search', `${searchField.value}`);
        // getData(urlParams);
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


function sortPurchaseType(event) {
    let element = event.target;
    document.getElementById('selected-purchase-type').innerText = element.innerText;
    const table = document.getElementById("order-table");
    const rows = table.getElementsByTagName("tr");
    for (let i = 1; i < rows.length; i++) {
        const cellValue = rows[i].getElementsByTagName("td")[8].children[0].children[0].innerText;

        if (cellValue === element.innerText) {
            if (rows[i].getAttribute('search-filtered') != 'false' && rows[i].getAttribute('order-completion-filtered') != 'false')
                rows[i].style.display = "";
            rows[i].setAttribute('purchase-filtered', true);
        } else {
            rows[i].style.display = "none";
            rows[i].setAttribute('purchase-filtered', false);
        }
    }
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
    document.getElementById('selected-order-completion-type').innerText = element.innerText;

    const table = document.getElementById("order-table");
    const rows = table.getElementsByTagName("tr");
    for (let i = 1; i < rows.length; i++) {
        const cellValue = rows[i].getElementsByTagName("td")[9].children[0].children[0].innerText;

        if (cellValue === element.getAttribute('data-value')) {
            if (rows[i].getAttribute('search-filtered') != 'false' && rows[i].getAttribute('purchase-filtered') != 'false')
                rows[i].style.display = "";
            rows[i].setAttribute('order-completion-filtered', true);
        } else {
            rows[i].style.display = "none";
            rows[i].setAttribute('order-completion-filtered', false);
        }
    }
}