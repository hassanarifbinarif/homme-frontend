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


function closeDropdowns(event) {
    if ((!orderStatTimeBtn.contains(event.target)) && (!orderStatsDropdown.classList.contains('hide'))) {
        orderStatsDropdown.classList.add('hide');
    }
}


let isAscendingDate = true;

function sortByDate() {
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

    var table = document.getElementById("order-table");
    var rows = Array.from(table.getElementsByTagName("tr"));

    rows.shift();

    rows.sort(function(a, b) {
        var dateA = new Date(getDateFromCell(a.cells[2].children[0].children[0].innerText));
        var dateB = new Date(getDateFromCell(b.cells[2].children[0].children[0].innerText));
        if (isAscendingDate) {
            return dateA - dateB;
        } else {
            return dateB - dateA;
        }
    });

    isAscendingDate = !isAscendingDate;

    var tableBody = table.querySelector("tbody");
    rows.forEach(function(row) {
        tableBody.appendChild(row);
    });
}


function getDateFromCell(cellContent) {
    var parts = cellContent.split("-");
    var day = parseInt(parts[0]);
    var month = parts[1];
    var year = parseInt(parts[2]);

    var months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    var monthNumber = months.indexOf(month);
    var dateString = day + '-' + (monthNumber + 1) + '-' + year;

    return dateString;
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

            if (isPurchaseFiltered) {
                if (cellValue.toLowerCase().includes(searchField.value.toLowerCase())) {
                    if (rows[i].getAttribute('purchase-filtered') != 'false')
                        rows[i].style.display = "";
                    rows[i].setAttribute('search-filtered', true);
                } else if (searchField.value == '') {
                    if (rows[i].getAttribute('purchase-filtered') != 'false')
                        rows[i].style.display = "";
                    rows[i].setAttribute('search-filtered', true);
                }
                else {
                    // if (rows[i].getAttribute('search-filtered') == true)
                    rows[i].style.display = "none";
                    rows[i].setAttribute('search-filtered', false);
                }
            }
            else {
                if (cellValue.toLowerCase().includes(searchField.value.toLowerCase())) {
                    rows[i].style.display = "";
                    rows[i].setAttribute('search-filtered', true);
                } else if (searchField.value == '') {
                    rows[i].style.display = "";
                    rows[i].setAttribute('search-filtered', true);
                }
                else {
                    rows[i].style.display = "none";
                    rows[i].setAttribute('search-filtered', false);
                }
            }
        }
        isSearchFiltered = true;
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

        if (isSearchFiltered) {
            if (cellValue === element.innerText) {
                if (rows[i].getAttribute('search-filtered') != 'false')
                    rows[i].style.display = "";
                rows[i].setAttribute('purchase-filtered', true);
            } else {
                rows[i].style.display = "none";
                rows[i].setAttribute('purchase-filtered', false);
            }
        }
        else {
            if (cellValue === element.innerText) {
                rows[i].style.display = "";
                rows[i].setAttribute('purchase-filtered', true);
            } else {
                rows[i].style.display = "none";
                rows[i].setAttribute('purchase-filtered', false);
            }
        }
    }
    isPurchaseFiltered = true;
}