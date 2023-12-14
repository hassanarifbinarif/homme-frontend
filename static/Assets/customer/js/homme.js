let orderChannelBtn = document.getElementById('select-order-channel-btn');
let selectedOrderChannel = document.getElementById('selected-order-channel-opt');
let orderChannelDropdown = document.getElementById('order-channel-dropdown');

let chartTypeBtn = document.getElementById('chart-type-btn');
let chartTypeDropdown = document.getElementById('chart-type-dropdown');

let requiredDataURL = `/admin/orders?perPage=8&page=1&ordering=-created_at&created_at__gte=&created_at__lte=&search=`;


window.onload = () => {
    getNotifications();
    getData(requiredDataURL);
}

orderChannelBtn.addEventListener('click', function() {
    if (orderChannelDropdown.classList.contains('hide')) {
        orderChannelDropdown.classList.remove('hide');
    }
    else {
        orderChannelDropdown.classList.add('hide');
    }
})

function selectOrderChannel(event) {
    let element = event.target;
    // selectedOrderChannel.innerText = element.innerText;
    orderChannelDropdown.classList.add('hide');
    orderChannelBtn.click();
}


if (chartTypeBtn) {
    chartTypeBtn.addEventListener('click', function() {
        if (chartTypeDropdown.classList.contains('hide')) {
            chartTypeDropdown.classList.remove('hide');
        }
        else {
            chartTypeDropdown.classList.add('hide');
        }
    })
}

function selectChartType(event) {
    let element = event.target;
    if (element.getAttribute('data-value') == 'sales') {
        document.getElementById('pick-ship-chart').classList.add('hide');
        document.getElementById('channel-chart').classList.remove('hide');
        document.getElementById('selected-chart-type').innerText = 'Sales Per Channel';
    }
    else if (element.getAttribute('data-value') == 'pick_ship') {
        document.getElementById('channel-chart').classList.add('hide');
        document.getElementById('pick-ship-chart').classList.remove('hide');
        document.getElementById('selected-chart-type').innerText = 'Picked-up VS Shipped';
    }
}


function closeDropdowns(event) {
    if (!(orderStatTimeBtn.contains(event.target)) && !(orderStatsDropdown.classList.contains('hide'))) {
        orderStatsDropdown.classList.add('hide');
    }
    else if (!(orderChannelBtn.contains(event.target)) && !(orderChannelDropdown.contains(event.target))) {
        orderChannelDropdown.classList.add('hide');
    }
}

document.body.addEventListener("click", closeDropdowns);



async function getData(url=null) {
    let data;
    let tableBody = document.getElementById('homme-order-table');
    if (url == null) {
        data = requiredDataURL;
    }
    else {
        let temp = url.split(`api`);
        data = temp.length > 1 ? temp[1] : temp[0];
    }
    tableBody.classList.add('hide');
    document.getElementById('table-loader').classList.remove('hide');
    try {
        let response = await requestAPI('/homme-orders-list/', JSON.stringify(data), {}, 'POST');
        response.json().then(function(res) {
            if (res.success) {
                document.getElementById('table-loader').classList.add('hide');
                tableBody.innerHTML = res.orders_data;
                tableBody.classList.remove('hide');
                generatePages(res.paginationData.currentPage, res.paginationData.total);
                convertDateTime();
            }
            else {
                document.getElementById('table-loader').classList.add('hide');
                tableBody.classList.remove('hide');
                tableBody.querySelector('tbody').innerHTML = `<tr>
                                                                <td colspan="5" class="no-record-row">No record available</td>
                                                            </tr>`;
            }
        })
    }
    catch (err) {
        console.log(err);
    }
}



function generatePages(currentPage, totalPages) {
    const pagesContainer = document.getElementById('pages-container');
    pagesContainer.innerHTML = '';

    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, startPage + 2);

    if (endPage - startPage < 2) {
        startPage = Math.max(1, endPage - 2);
    }

    if (startPage > 1) {
        pagesContainer.innerHTML += '<span>1</span>';
        if (startPage > 2) {
            pagesContainer.innerHTML += '<span class="ellipsis-container">...</span>';
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pagesContainer.innerHTML += `<span${i === currentPage ? ' class="active"' : ''}>${i}</span>`;
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            pagesContainer.innerHTML += '<span class="ellipsis-container">...</span>';
        }
        pagesContainer.innerHTML += `<span>${totalPages}</span>`;
    }
    pagesContainer.querySelectorAll('span').forEach((span) => {
        if ((!span.classList.contains('active'))  && (!span.classList.contains('ellipsis-container'))) {
            let page = span.innerText;
            let pageUrl = setParams(requiredDataURL, 'page', page);
            span.setAttribute("onclick", `getData('${pageUrl}')`);
        }
    })
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
    if (element.innerText == 'TODAY' && selectedOrderStatTime.innerText != element.innerText) {
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        const timezoneOffset = today.getTimezoneOffset() * 60000;
        let todayStartingTime = new Date(today.getTime() - timezoneOffset).toISOString();
        requiredDataURL = setParams(requiredDataURL, 'created_at__gte', todayStartingTime);
        requiredDataURL = setParams(requiredDataURL, 'created_at__lte', '');
    }
    else if (element.innerText == 'CURRENT WEEK' && selectedOrderStatTime.innerText != element.innerText) {
        const { startOfWeek, endOfWeek } = getStartOfWeek();
        requiredDataURL = setParams(requiredDataURL, 'created_at__gte', startOfWeek);
        requiredDataURL = setParams(requiredDataURL, 'created_at__lte', endOfWeek);
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


// For current week

function getStartOfWeek() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const daysUntilMonday = (dayOfWeek + 6) % 7;
    let startOfWeek = new Date(now);
    let endOfWeek = new Date(now);

    startOfWeek.setDate(now.getDate() - daysUntilMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const timezoneOffset = now.getTimezoneOffset() * 60000;

    startOfWeek = new Date(startOfWeek.getTime() - timezoneOffset).toISOString();
    endOfWeek = new Date(endOfWeek.getTime() - timezoneOffset).toISOString();

    return {
        startOfWeek,
        endOfWeek,
    };

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
        startOfPreviousWeek: new Date(startOfWeek.getTime() - timezoneOffset).toISOString(),
        endOfPreviousWeek: new Date(endOfWeek.getTime() - timezoneOffset).toISOString(),
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
    
    startOfMonth = new Date(startOfMonth.getTime() - timezoneOffset).toISOString();
    endOfMonth = new Date(endOfMonth.getTime() - timezoneOffset).toISOString();
  
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
    
    startOfLastMonth = new Date(startOfLastMonth.getTime() - timezoneOffset).toISOString();
    endOfLastMonth = new Date(endOfLastMonth.getTime() - timezoneOffset).toISOString();
  
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

    startOfQuarter = new Date(startOfQuarter.getTime() - timezoneOffset).toISOString();
    endOfQuarter = new Date(endOfQuarter.getTime() - timezoneOffset).toISOString();
  
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

    startOfLastQuarter = new Date(startOfLastQuarter.getTime() - timezoneOffset).toISOString();
    endOfLastQuarter = new Date(endOfLastQuarter.getTime() - timezoneOffset).toISOString();
  
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

    startOfYear = new Date(startOfYear.getTime() - timezoneOffset).toISOString();
    endOfYear = new Date(endOfYear.getTime() - timezoneOffset).toISOString();

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

    startOfLastYear = new Date(startOfLastYear.getTime() - timezoneOffset).toISOString();
    endOfLastYear = new Date(endOfLastYear.getTime() - timezoneOffset).toISOString();
  
    return {
        startOfLastYear,
        endOfLastYear,
    };
}


function convertDateTime() {
    let orderTimes = document.querySelectorAll('.order-time');
    orderTimes.forEach((dateTime) => {
        // Input date in the format '2023-11-30T04:44:12.156070Z'
        const inputDate = new Date(dateTime.textContent);

        // Format date components
        const day = new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(inputDate);
        const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(inputDate);
        const year = new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(inputDate);

        const formattedTime = new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: 'numeric',
            hour12: true,
        }).format(inputDate);

        // Create the desired format
        const result = `${day}-${month}-${year} @ ${formattedTime}`;

        dateTime.textContent = result;
    })
}