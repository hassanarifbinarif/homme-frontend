let salesChannelBtn = document.getElementById('select-order-channel-btn');
let salesChannelDropdown = document.getElementById('order-channel-dropdown');

let chartTypeBtn = document.getElementById('chart-type-btn');
let chartTypeDropdown = document.getElementById('chart-type-dropdown');

let orderStatTimeBtn = document.getElementById('select-order-stat-time-btn');
let selectedOrderStatTime = document.getElementById('selected-order-stat-opt');
let orderStatsDropdown = document.getElementById('order-stats-dropdown');

let salesChannelOverviewBtn = document.getElementById('select-sales-overview-btn');
let salesChannelOverviewDropdown = document.getElementById('sales-channel-overview-dropdown');

let salonStatTimeBtn = document.getElementById('select-salon-stat-time-btn');
let selectedSalonStatTime = document.getElementById('selected-salon-stat-opt');
let salonStatsDropdown = document.getElementById('salon-stats-dropdown');

let salonStatList = document.getElementById('salon-stat-list');
let referrerStatList = document.getElementById('referrer-stat-list');
let totalSalonNumber = document.getElementById('total-salon-number');

let netSalesChart = document.getElementById('net-sales-chart');

let selectYearBtn = document.getElementById('select-year-btn');
let selectedYearText = document.getElementById('selected-year');
let selectYearDropdown = document.getElementById('select-year-dropdown');


let requiredDataURL = `/admin/orders?perPage=8&page=1&ordering=-created_at&created_at__gte=&created_at__lte=&search=`;
let salonStatsDataURL = `/admin/dashboard/salon/overview?search=&user__created_at__gte=&user__created_at__lte=`;
let salonChartDataURL = `/admin/dashboard/salon/net-sales-graph?search=&year=${getLastNYears()}`;


window.onload = () => {
    // getNotifications();
    getData(requiredDataURL);
    getSalonStatsData();
    getChartData();
    populateYearList(20);
    getSummaryData();
}


orderStatTimeBtn.addEventListener('click', function() {
    if (orderStatsDropdown.classList.contains('hide')) {
        orderStatsDropdown.classList.remove('hide');
    }
    else {
        orderStatsDropdown.classList.add('hide');
    }
})


salonStatTimeBtn.addEventListener('click', function() {
    if (salonStatsDropdown.classList.contains('hide')) {
        salonStatsDropdown.classList.remove('hide');
    }
    else {
        salonStatsDropdown.classList.add('hide');
    }
})


salesChannelBtn.addEventListener('click', function() {
    if (salesChannelDropdown.classList.contains('hide')) {
        salesChannelDropdown.classList.remove('hide');
    }
    else {
        salesChannelDropdown.classList.add('hide');
    }
})


selectYearBtn.addEventListener('click', function() {
    if (selectYearDropdown.classList.contains('hide')) {
        selectYearDropdown.classList.remove('hide');
    }
    else {
        selectYearDropdown.classList.add('hide');
    }
})


salesChannelOverviewBtn.addEventListener('click', function() {
    if (salesChannelOverviewDropdown.classList.contains('hide')) {
        salesChannelOverviewDropdown.classList.remove('hide');
    }
    else {
        salesChannelOverviewDropdown.classList.add('hide');
    }
})


let selectedSalesChannel = [];
let salesChannelFilterString = '';

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
    salesChannelDropdown.classList.add('hide');
    salesChannelBtn.click();
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
    if (!(salonStatTimeBtn.contains(event.target)) && !(salonStatsDropdown.classList.contains('hide'))) {
        salonStatsDropdown.classList.add('hide');
    }
    if (!(salesChannelBtn.contains(event.target)) && !(salesChannelDropdown.contains(event.target))) {
        salesChannelDropdown.classList.add('hide');
    }
    if (!(selectYearBtn.contains(event.target)) && !(selectYearDropdown.classList.contains('hide'))) {
        selectYearDropdown.classList.add('hide');
    }
    if (!(salesChannelOverviewBtn.contains(event.target)) && !(salesChannelOverviewDropdown.contains(event.target))) {
        salesChannelOverviewDropdown.classList.add('hide');
    }
    if (!(chartTypeBtn.contains(event.target)) && !(chartTypeDropdown.classList.contains('hide'))) {
        chartTypeDropdown.classList.add('hide');
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


async function getSalonStatsData() {
    let salonStatsBody = document.getElementById('salon-stats');
    salonStatsBody.classList.add('hide');
    document.getElementById('salon-stat-loader').classList.remove('hide');
    try {
        let token = getCookie('admin_access');
        let headers = {
            "Authorization": `Bearer ${token}`
        };
        let response = await requestAPI(`${apiURL}${salonStatsDataURL}`, null, headers, 'GET');
        response.json().then(function(res) {
            populateSalonStats(response.status, res);
            populateReferralsStats(response.status, res);
        })        
        salonStatsBody.classList.remove('hide');
        document.getElementById('salon-stat-loader').classList.add('hide');
    }
    catch (err) {
        totalSalonNumber.innerText = 0;
        salonStatList.innerHTML = `<div class="stat-card">
                                        <span class="w-100 text-center">No Salons</span>
                                    </div>`;
        referrerStatList.innerHTML = `<div class="stat-card">
                                        <span class="w-100 text-center">No Referrers</span>
                                    </div>`;
        
        salonStatsBody.classList.remove('hide');
        document.getElementById('salon-stat-loader').classList.add('hide');
        console.log(err);
    }
}


async function getChartData() {
    netSalesChart.classList.add('hide');
    document.getElementById('chart-loader').classList.remove('hide');
    document.getElementById('no-chart-data').classList.add('hide');
    try {
        let token = getCookie('admin_access');
        let headers = {
            "Authorization": `Bearer ${token}`
        };
        let response = await requestAPI(`${apiURL}${salonChartDataURL}`, null, headers, 'GET');
        if (response.status == 200) {
            response.json().then(function(res) {
                salonNetSalesChart(res);
            })
        }
        else {
            document.getElementById('no-chart-data').classList.remove('hide');
        }
        netSalesChart.classList.remove('hide');
        document.getElementById('chart-loader').classList.add('hide');
    }
    catch (err) {
        document.getElementById('no-chart-data').classList.remove('hide');
        netSalesChart.classList.remove('hide');
        document.getElementById('chart-loader').classList.add('hide');
        console.log(err);
    }
}


async function getSummaryData() {
    try {
        let token = getCookie('admin_access');
        let headers = {
            "Authorization": `Bearer ${token}`
        };
        let response = await requestAPI(`${apiURL}/admin/orders/summary`, null, headers, 'GET');
        if (response.status == 200) {
            response.json().then(function(res) {
                document.getElementById('pickup-quantity').innerText = res.total_pending_pickups;
            })
        }
    }
    catch (err) {
        console.log(err);
    }
}


function populateSalonStats(status, data) {
    salonStatList.innerHTML = '';
    if (status == 200 && data.new_salons.length > 0) {
        totalSalonNumber.innerText = data.salons_count || 0;
        data.new_salons.forEach((salon) => {
            salonStatList.innerHTML += `<div class="stat-card">
                                            <div class="salon-identity">
                                                <div class="salon-image">
                                                    <img src="${salon.profile_picture}" alt="salon image" />
                                                </div>
                                                <div>
                                                    <span>Salon name:</span>
                                                    <span title="${salon.salon_name}">${salon.salon_name}</span>
                                                </div>
                                            </div>
                                            <div class="vr"></div>
                                            <div class="salon-contact">
                                                <span>Main Contact:</span>
                                                <span title="${salon.contact_name}">${salon.contact_name}</span>
                                            </div>
                                            <div class="vr"></div>
                                            <div class="salon-number">
                                                <span>Phone Number:</span>
                                                <span>${salon.contact_phone}</span>
                                            </div>
                                        </div>`;
        })
    }
    else {
        totalSalonNumber.innerText = 0;
        salonStatList.innerHTML = `<div class="stat-card">
                                        <span class="w-100 text-center">No Salons</span>
                                    </div>`;
    }
}


function populateReferralsStats(status, data) {
    referrerStatList.innerHTML = '';
    if (status == 200 && data.top_referrals.length > 0) {
        data.top_referrals.forEach((referral) => {
            referrerStatList.innerHTML += `<div class="stat-card">
                                                <div class="salon-identity">
                                                    <div class="salon-image">
                                                        <img src="${referral.profile_picture}" alt="salon image" />
                                                    </div>
                                                    <div>
                                                        <span>Salon name:</span>
                                                        <span title="${referral.salon_name}">${referral.salon_name}</span>
                                                    </div>
                                                </div>
                                                <div class="vr"></div>
                                                <div class="salon-new-customers">
                                                    <span>New Customers:</span>
                                                    <span>${referral.customers_count}(${referral.completed_customers_count})</span>
                                                </div>
                                                <div class="vr"></div>
                                                <div class="salon-products-sold">
                                                    <span>Products Sold</span>
                                                    <span>${referral.products_sold_count}(${referral.new_customer_products_count})</span>
                                                </div>
                                            </div>`;
        })
    }
    else {
        referrerStatList.innerHTML = `<div class="stat-card">
                                        <span class="w-100 text-center">No Referrers</span>
                                    </div>`;
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
        pagesContainer.innerHTML += '<span class="cursor-pointer">1</span>';
        if (startPage > 2) {
            pagesContainer.innerHTML += '<span class="ellipsis-container">...</span>';
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pagesContainer.innerHTML += `<span${i === currentPage ? ' class="active"' : ' class="cursor-pointer"'}>${i}</span>`;
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            pagesContainer.innerHTML += '<span class="ellipsis-container">...</span>';
        }
        pagesContainer.innerHTML += `<span class="cursor-pointer">${totalPages}</span>`;
    }
    pagesContainer.querySelectorAll('span').forEach((span) => {
        if ((!span.classList.contains('active'))  && (!span.classList.contains('ellipsis-container'))) {
            let page = span.innerText;
            let pageUrl = setParams(requiredDataURL, 'page', page);
            span.setAttribute("onclick", `getData('${pageUrl}')`);
        }
    })
}


let stackedChart;

function salonNetSalesChart(res) {
    let stackedChartElement = document.getElementById('net-sales-chart');
    stackedChart = new Chart(stackedChartElement, {
        type: 'bar',
        data: {
            labels: res.labels,
            datasets: [
                {
                    label: 'Shipped',
                    data: res.data_ship,
                    backgroundColor: '#000000',
                    borderWidth: 0
                },
                {
                    label: 'Pick-Ups',
                    data: res.data_self,
                    backgroundColor: '#000093',
                    borderWidth: 0
                }
            ]
        },
        options: {
            devicePixelRatio: 2,
            responsive: true,
            maintainAspectRatio: false,
            ticks: {
                font: {
                    size: 12,
                    family: 'Gotham Book',
                    weight: 500
                }
            },
            barThickness: 25,
            scales: {
                x: {
                    ticks: {
                        color: '#000000'
                    },
                    stacked: true,
                    border: {
                        display: false
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    ticks: {
                        color: '#000000'
                    },
                    stacked: true,
                    beginAtZero: true,
                    border: {
                        display: false
                    },
                    grid: {
                        display: true
                    }
                }
            },
            plugins: {
                legend: {
                    onHover: (event, chartElement) => {
                        event.native.target.style.cursor = 'pointer';
                    },
                    onLeave: (event, chartElement) => {
                        event.native.target.style.cursor = 'default';
                    },
                    display: true,
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'circle',
                        pointStyleWidth: 11,
                        boxHeight: 8,
                        font: {
                            size: 12,
                            family: 'Gotham Book',
                            weight: '500'
                        },
                        color: '#000000'
                    },
                }
            }
        }
    })
}


function populateYearList(n=0) {
    let yearList = getLastNYears(n);
    yearList.forEach((year) => {
        selectYearDropdown.innerHTML += `<span onclick="selectDataYear(event);">${year}</span>`;
    })
}


function selectDataYear(event) {
    let year = event.target.innerText;
    salonChartDataURL = setParams(salonChartDataURL, 'year', year);
    selectedYearText.innerText = year;
    if (typeof stackedChart == 'object')
        stackedChart.destroy();
    getChartData();
}


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


function selectSalonStatTime(event) {
    let element = event.target;
    let startDate, endDate;
    if (element.innerText == 'TODAY' && selectedSalonStatTime.innerText != element.innerText) {
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        const timezoneOffset = today.getTimezoneOffset() * 60000;
        let todayStartingTime = new Date(today.getTime() - timezoneOffset).toISOString();
        salonStatsDataURL = setParams(salonStatsDataURL, 'user__created_at__gte', todayStartingTime);
        salonStatsDataURL = setParams(salonStatsDataURL, 'user__created_at__lte', '');
    }
    else if (element.innerText == 'CURRENT WEEK' && selectedSalonStatTime.innerText != element.innerText) {
        const { startOfWeek, endOfWeek } = getStartOfWeek();
        salonStatsDataURL = setParams(salonStatsDataURL, 'user__created_at__gte', startOfWeek);
        salonStatsDataURL = setParams(salonStatsDataURL, 'user__created_at__lte', endOfWeek);
    }
    else if (element.innerText == 'LAST WEEK' && selectedSalonStatTime.innerText != element.innerText) {
        const { startOfPreviousWeek, endOfPreviousWeek } = getStartAndEndOfPreviousWeek();
        salonStatsDataURL = setParams(salonStatsDataURL, 'user__created_at__gte', startOfPreviousWeek);
        salonStatsDataURL = setParams(salonStatsDataURL, 'user__created_at__lte', endOfPreviousWeek);
    }
    else if (element.innerText == 'CURRENT MONTH' && selectedSalonStatTime.innerText != element.innerText) {
        let today = new Date();
        const { startOfMonth, endOfMonth } = getStartAndEndOfMonth(today);
        salonStatsDataURL = setParams(salonStatsDataURL, 'user__created_at__gte', startOfMonth);
        salonStatsDataURL = setParams(salonStatsDataURL, 'user__created_at__lte', endOfMonth);
    }
    else if (element.innerText == 'LAST MONTH' && selectedSalonStatTime.innerText != element.innerText) {
        const { startOfLastMonth, endOfLastMonth } = getStartAndEndOfLastMonth();
        salonStatsDataURL = setParams(salonStatsDataURL, 'user__created_at__gte', startOfLastMonth);
        salonStatsDataURL = setParams(salonStatsDataURL, 'user__created_at__lte', endOfLastMonth);
    }
    else if (element.innerText == 'CURRENT QUARTER' && selectedSalonStatTime.innerText != element.innerText) {
        const { startOfQuarter, endOfQuarter } = getStartAndEndOfQuarter();
        salonStatsDataURL = setParams(salonStatsDataURL, 'user__created_at__gte', startOfQuarter);
        salonStatsDataURL = setParams(salonStatsDataURL, 'user__created_at__lte', endOfQuarter);
    }
    else if (element.innerText == 'LAST QUARTER' && selectedSalonStatTime.innerText != element.innerText) {
        const { startOfLastQuarter, endOfLastQuarter } = getStartAndEndOfLastQuarter();
        salonStatsDataURL = setParams(salonStatsDataURL, 'user__created_at__gte', startOfLastQuarter);
        salonStatsDataURL = setParams(salonStatsDataURL, 'user__created_at__lte', endOfLastQuarter);
    }
    else if (element.innerText == 'CURRENT YEAR' && selectedSalonStatTime.innerText != element.innerText) {
        const { startOfYear, endOfYear } = getStartAndEndOfYear();
        salonStatsDataURL = setParams(salonStatsDataURL, 'user__created_at__gte', startOfYear);
        salonStatsDataURL = setParams(salonStatsDataURL, 'user__created_at__lte', endOfYear);
    }
    else if (element.innerText == 'LAST YEAR' && selectedSalonStatTime.innerText != element.innerText) {
        const { startOfLastYear, endOfLastYear } = getStartAndEndOfLastYear();
        salonStatsDataURL = setParams(salonStatsDataURL, 'user__created_at__gte', startOfLastYear);
        salonStatsDataURL = setParams(salonStatsDataURL, 'user__created_at__lte', endOfLastYear);
    }
    else if (element.innerText == 'ALL TIME' && selectedSalonStatTime.innerText != element.innerText) {
        salonStatsDataURL = setParams(salonStatsDataURL, 'user__created_at__gte', '');
        salonStatsDataURL = setParams(salonStatsDataURL, 'user__created_at__lte', '');
    }
    getSalonStatsData();
    selectedSalonStatTime.innerText = element.innerText;
    selectedSalonStatTime.title = element.innerText;
    salonStatsDropdown.classList.add('hide');
    salonStatTimeBtn.click();
}


function openOrdersPage() {
    let url = location.origin + '/orders/' + location.search;
    const urlObj = new URL(url);
    urlObj.searchParams.set('status', 'pickup');
    location.href = urlObj.toString();
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
    let currentYear = today.getFullYear();
  
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


function getLastNYears(n=0) {
    const currentYear = new Date().getFullYear();
    let lastNYears = [];

    for (let i = currentYear; i >= currentYear - n; i--) {
        lastNYears.push(i);
    }

    return lastNYears;
}