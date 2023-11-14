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

let requiredDataURL = `${apiURL}/admin/orders?page=1&perPage=1000&ordering=-created_at&created_at__gte=${getStartOfWeek()}&created_at__lte=&status=&search=&purchase_type=`;

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
            if (res.success) {
                document.getElementById('table-loader').classList.add('hide');
                tableBody.innerHTML = res.order_data;
                tableBody.classList.remove('hide');
                document.getElementById('total-order-value').innerHTML = res.total_orders;
                document.getElementById('total-ordered-items').innerHTML = res.order_items || 0;
                document.getElementById('total-orders-completed').innerHTML = res.completed_orders;
                document.getElementById('total-open-orders').innerHTML = res.open_orders;
                document.getElementById('total-order-completion-time').innerHTML = (parseFloat(res.completion_time) / 24) + ' Days';
                // console.log(res.completion_time);
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
    let startDate, endDate;
    if (element.innerText == 'CURRENT WEEK' && selectedOrderStatTime.innerText != element.innerText) {
        startDate = getStartOfWeek();
        requiredDataURL = setParams(requiredDataURL, 'created_at__gte', startDate);
        requiredDataURL = setParams(requiredDataURL, 'created_at__lte', '');
        getData(requiredDataURL);
    }
    else if (element.innerText == 'LAST WEEK' && selectedOrderStatTime.innerText != element.innerText) {
        const { startOfPreviousWeek, endOfPreviousWeek } = getStartAndEndOfPreviousWeek();
        requiredDataURL = setParams(requiredDataURL, 'created_at__gte', startOfPreviousWeek);
        requiredDataURL = setParams(requiredDataURL, 'created_at__lte', endOfPreviousWeek);
        getData(requiredDataURL);
    }
    else if (element.innerText == 'CURRENT MONTH' && selectedOrderStatTime.innerText != element.innerText) {
        let today = new Date();
        const { startOfMonth, endOfMonth } = getStartAndEndOfMonth(today);
        requiredDataURL = setParams(requiredDataURL, 'created_at__gte', startOfMonth);
        requiredDataURL = setParams(requiredDataURL, 'created_at__lte', endOfMonth);
        getData(requiredDataURL);
    }
    else if (element.innerText == 'LAST MONTH' && selectedOrderStatTime.innerText != element.innerText) {
        const { startOfLastMonth, endOfLastMonth } = getStartAndEndOfLastMonth();
        requiredDataURL = setParams(requiredDataURL, 'created_at__gte', startOfLastMonth);
        requiredDataURL = setParams(requiredDataURL, 'created_at__lte', endOfLastMonth);
        getData(requiredDataURL);
    }
    else if (element.innerText == 'CURRENT QUARTER' && selectedOrderStatTime.innerText != element.innerText) {
        const { startOfQuarter, endOfQuarter } = getStartAndEndOfQuarter();
        requiredDataURL = setParams(requiredDataURL, 'created_at__gte', startOfQuarter);
        requiredDataURL = setParams(requiredDataURL, 'created_at__lte', endOfQuarter);
        getData(requiredDataURL);
    }
    else if (element.innerText == 'LAST QUARTER' && selectedOrderStatTime.innerText != element.innerText) {
        const { startOfLastQuarter, endOfLastQuarter } = getStartAndEndOfLastQuarter();
        requiredDataURL = setParams(requiredDataURL, 'created_at__gte', startOfLastQuarter);
        requiredDataURL = setParams(requiredDataURL, 'created_at__lte', endOfLastQuarter);
        getData(requiredDataURL);
    }
    else if (element.innerText == 'CURRENT YEAR' && selectedOrderStatTime.innerText != element.innerText) {
        const { startOfYear, endOfYear } = getStartAndEndOfYear();
        requiredDataURL = setParams(requiredDataURL, 'created_at__gte', startOfYear);
        requiredDataURL = setParams(requiredDataURL, 'created_at__lte', endOfYear);
        getData(requiredDataURL);
    }
    else if (element.innerText == 'LAST YEAR' && selectedOrderStatTime.innerText != element.innerText) {
        const { startOfLastYear, endOfLastYear } = getStartAndEndOfLastYear();
        requiredDataURL = setParams(requiredDataURL, 'created_at__gte', startOfLastYear);
        requiredDataURL = setParams(requiredDataURL, 'created_at__lte', endOfLastYear);
        getData(requiredDataURL);
    }
    else if (element.innerText == 'ALL TIME' && selectedOrderStatTime.innerText != element.innerText) {
        requiredDataURL = setParams(requiredDataURL, 'created_at__gte', '');
        requiredDataURL = setParams(requiredDataURL, 'created_at__lte', '');
        getData(requiredDataURL);
    }
    selectedOrderStatTime.innerText = element.innerText;
    orderStatsDropdown.classList.add('hide');
    orderStatTimeBtn.click();
}


function convertToDateTime(dateTimeString) {
    return new Date(dateTimeString);
}


function sortByDateBtn(event) {
    let arrows = event.target.closest('button').querySelectorAll('path');
    const url = new URL(requiredDataURL);
    let ordering = url.searchParams.get('ordering');
    if (ordering == '-created_at') {
        ordering = 'created_at';
        arrows[0].setAttribute('opacity', '.2');
        arrows[1].setAttribute('opacity', '1');
        url.searchParams.set('ordering', ordering);
    }
    else {
        ordering = '-created_at';
        arrows[0].setAttribute('opacity', '1');
        arrows[1].setAttribute('opacity', '.2');
        url.searchParams.set('ordering', ordering);
    }
    requiredDataURL = url.toString();
    getData(requiredDataURL);
}


function sortByDate(event) {
    let arrows;
    if (event.target.closest('button')) {
        arrows = event.target.closest('button').querySelectorAll('path');
    }
    else if (event.target.closest('th')) {
        arrows = event.target.closest('th').querySelectorAll('path');
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


function searchData(event) {
    let searchField = document.getElementById('search-order');
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
    const currentYear = today.getFullYear();
  
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