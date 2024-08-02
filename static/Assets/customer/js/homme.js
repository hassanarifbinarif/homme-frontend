let salesChannelBtn = document.getElementById('select-order-channel-btn');
let salesChannelDropdown = document.getElementById('order-channel-dropdown');

let chartContainer = document.getElementById('chart-container');
let salesPerChannelChart = document.getElementById('sales-per-channel-chart');
let pickedupVsShippedSalesChart = document.getElementById('picked-vs-shipped-sales-chart');
let sourceTypeSalesChart = document.getElementById('source-type-sales-chart');
let sourceChannelSalesChart = document.getElementById('source-channel-sales-chart');

let chartTypeBtn = document.getElementById('chart-type-btn');
let chartTypeDropdown = document.getElementById('chart-type-dropdown');

let selectYearBtn = document.getElementById('select-year-btn');
let selectedYearText = document.getElementById('selected-year');
let selectYearDropdown = document.getElementById('select-year-dropdown');

let orderStatTimeBtn = document.getElementById('select-order-stat-time-btn');
let selectedOrderStatTime = document.getElementById('selected-order-stat-opt');
let orderStatsDropdown = document.getElementById('order-stats-dropdown');

let salesChannelOverviewBtn = document.getElementById('select-sales-overview-btn');
let salesChannelOverviewDropdown = document.getElementById('sales-channel-overview-dropdown');

let salesOverviewTimeBtn = document.getElementById('select-sales-stat-time-btn');
let selectedSalesOverviewTime = document.getElementById('selected-sales-stat-opt');
let salesOverviewTimeDropdown = document.getElementById('sales-overview-dropdown');

let pickupSalesList = document.getElementById('pickup-sales-list');
let shippedSalesList = document.getElementById('shipped-sales-list');
let topProductsTableBody = document.getElementById('top-products-table-body');
let topReferrersTableBody = document.getElementById('top-referrers-table-body');
let totalPickUpSalesNumber = document.getElementById('total-pick-up-sales-number');

let requiredDataURL = `/admin/orders?perPage=8&page=1&ordering=-created_at&created_at__gte=&created_at__lte=&search=`;
let salesOverviewDataURL = `/admin/dashboard/customer/sales-overview?search=&sales_channel=&created_at__gte=&created_at__lte=`;
let salesChannelChartDataURL = `/admin/dashboard/customer/net-sales-graph-by-sales-channel?search=&year=${getLastNYears()}`;
let pickedupVsShippedChartDataURL = `/admin/dashboard/customer/net-sales-graph?search=&year=${getLastNYears()}`;
let sourceTypeChartDataURL = `/admin/dashboard/customer/net-sales-graph-by-source-type?search=&year=${getLastNYears()}`;
let sourceChannelChartDataURL = `/admin/dashboard/customer/net-sales-graph-by-source-channel?search=&year=${getLastNYears()}`;


window.onload = () => {
    // getNotifications();
    getData(requiredDataURL);
    getSalesOverviewData();
    populateYearList(20);
    getChartData(salesChannelChartDataURL, 'sales_per_channel');
    getChartData(pickedupVsShippedChartDataURL, 'picked_up_vs_shipped');
    getChartData(sourceTypeChartDataURL, 'source_type');
    getChartData(sourceChannelChartDataURL, 'source_channel');
    getSummaryData();
    checkPageCount();
    getSourceTypes();
}


function checkPageCount() {
    let count = getStorage('homme_dashboard');
    if (count == null) {
        setStorage('homme_dashboard', 1);
    }
    else {
        setStorage('homme_dashboard', parseInt(count)+1);
    }
}


salesChannelBtn.addEventListener('click', function() {
    if (salesChannelDropdown.classList.contains('hide')) {
        salesChannelDropdown.classList.remove('hide');
    }
    else {
        salesChannelDropdown.classList.add('hide');
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


orderStatTimeBtn.addEventListener('click', function() {
    if (orderStatsDropdown.classList.contains('hide')) {
        orderStatsDropdown.classList.remove('hide');
    }
    else {
        orderStatsDropdown.classList.add('hide');
    }
})


salesOverviewTimeBtn.addEventListener('click', function() {
    if (salesOverviewTimeDropdown.classList.contains('hide')) {
        salesOverviewTimeDropdown.classList.remove('hide');
    }
    else {
        salesOverviewTimeDropdown.classList.add('hide');
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


let selectedSalesChannelOverview = [];
let salesChannelOverviewFilterString = '';

function selectSalesChannelOverview(inputElement) {
    if (inputElement.checked) {
        selectedSalesChannelOverview.push(inputElement.value);
    }
    else {
        const index = selectedSalesChannelOverview.indexOf(inputElement.value);
        if (index !== -1) {
            selectedSalesChannelOverview.splice(index, 1);
        }
    }
    salesChannelOverviewFilterString = selectedSalesChannelOverview.join(',');
    salesOverviewDataURL = setParams(salesOverviewDataURL, 'sales_channel', salesChannelOverviewFilterString);
    getSalesOverviewData();
    salesChannelOverviewDropdown.classList.add('hide');
    salesChannelOverviewBtn.click();
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
        pickedupVsShippedSalesChart.classList.add('hide');
        sourceTypeSalesChart.classList.add('hide');
        sourceChannelSalesChart.classList.add('hide');
        salesPerChannelChart.classList.remove('hide');
        document.getElementById('selected-chart-type').innerText = 'Sales by Sales Channel';
    }
    else if (element.getAttribute('data-value') == 'pick_ship') {
        salesPerChannelChart.classList.add('hide');
        sourceTypeSalesChart.classList.add('hide');
        sourceChannelSalesChart.classList.add('hide');
        pickedupVsShippedSalesChart.classList.remove('hide');
        document.getElementById('selected-chart-type').innerText = 'Picked-up VS Shipped';
    }
    else if (element.getAttribute('data-value') == 'source_channel') {
        salesPerChannelChart.classList.add('hide');
        pickedupVsShippedSalesChart.classList.add('hide');
        sourceTypeSalesChart.classList.add('hide');
        sourceChannelSalesChart.classList.remove('hide');
        document.getElementById('selected-chart-type').innerText = element.innerText;
    }
    else if (element.getAttribute('data-value') == 'source_type') {
        salesPerChannelChart.classList.add('hide');
        pickedupVsShippedSalesChart.classList.add('hide');
        sourceChannelSalesChart.classList.add('hide');
        sourceTypeSalesChart.classList.remove('hide');
        document.getElementById('selected-chart-type').innerText = element.innerText;
    }
}


function closeDropdowns(event) {
    if (!(orderStatTimeBtn.contains(event.target)) && !(orderStatsDropdown.classList.contains('hide'))) {
        orderStatsDropdown.classList.add('hide');
    }
    if (!(salesChannelBtn.contains(event.target)) && !(salesChannelDropdown.contains(event.target))) {
        salesChannelDropdown.classList.add('hide');
    }
    if (!(salesChannelOverviewBtn.contains(event.target)) && !(salesChannelOverviewDropdown.contains(event.target))) {
        salesChannelOverviewDropdown.classList.add('hide');
    }
    if (!(salesOverviewTimeBtn.contains(event.target)) && !(salesOverviewTimeDropdown.classList.contains('hide'))) {
        salesOverviewTimeDropdown.classList.add('hide');
    }
    if (!(chartTypeBtn.contains(event.target)) && !(chartTypeDropdown.classList.contains('hide'))) {
        chartTypeDropdown.classList.add('hide');
    }
    if (!(selectYearBtn.contains(event.target)) && !(selectYearDropdown.classList.contains('hide'))) {
        selectYearDropdown.classList.add('hide');
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


async function getSourceTypes() {
    
    let token = getCookie('admin_access');
    let headers = { "Authorization": `Bearer ${token}` };
    let response = await requestAPI(`${apiURL}/admin/sources/types?page=1&perPage=1000`, null, headers, 'GET');
    response.json().then(function(res) {
        console.log('here');
        if (response.status == 200) {
            res.data.forEach((sourceType) => {
                salesChannelOverviewDropdown.innerHTML += `<label for="source-${sourceType.id}" class="cursor-pointer">
                                                                <span>${sourceType.name}</span>
                                                                <input type="checkbox" onchange="filterSourceType(this);" id="source-${sourceType.id}" value="${sourceType.id}" name="source_channel" />
                                                            </label>`;
            })
        }
    })
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
    salesOverviewDataURL = setParams(salesOverviewDataURL, 'user__source_referrer__type__in', sourceTypeFilterString);
    getSalesOverviewData();
}


// function filterSourceType(inputElement) {
//     if (inputElement.checked) {
//         salesOverviewDataURL = setParams(salesOverviewDataURL, 'user__source_referrer__type', inputElement.value);
//         getSalesOverviewData();
//     }
//     // selectedSourceType.innerText = element.innerText;
// }


async function getSalesOverviewData() {
    let salesOverviewBody = document.getElementById('sales-overview-div');
    salesOverviewBody.classList.add('hide');
    document.getElementById('sales-overview-loader').classList.remove('hide');
    try {
        let token = getCookie('admin_access');
        let headers = {
            "Authorization": `Bearer ${token}`
        };
        let response = await requestAPI(`${apiURL}${salesOverviewDataURL}`, null, headers, 'GET');
        response.json().then(function(res) {
            populatePickedUpSales(response.status, res);
            populateShippedSales(response.status, res);
            populateTopProducts(response.status, res);
            populateTopReferrers(response.status, res);
        })        
        salesOverviewBody.classList.remove('hide');
        document.getElementById('sales-overview-loader').classList.add('hide');
    }
    catch (err) {
        totalPickUpSalesNumber.innerText = '$' + 0;
        pickupSalesList.innerHTML = `<div>
                                        <span class="w-100 text-center">No Pick-Up Sales</span>
                                    </div>`;
        shippedSalesList.innerHTML = `<div>
                                        <span class="w-100 text-center">No Shipped Sales</span>
                                    </div>`;
        topProductsTableBody.innerHTML += `<tr colspan="3">
                                                <td class="no-record-row">No Top Products</td>
                                            </tr>`;
        
        salesOverviewBody.classList.remove('hide');
        document.getElementById('sales-overview-loader').classList.add('hide');
        console.log(err);
    }
}


async function getChartData(url, type='sales_per_channel') {
    chartContainer.classList.add('hide');
    document.getElementById('chart-loader').classList.remove('hide');
    document.getElementById('no-chart-data').classList.add('hide');
    try {
        let token = getCookie('admin_access');
        let headers = {
            "Authorization": `Bearer ${token}`
        };
        let response = await requestAPI(`${apiURL}${url}`, null, headers, 'GET');
        if (response.status == 200) {
            response.json().then(function(res) {
                if (type == 'sales_per_channel') {
                    drawSalesPerChannelChart(res);
                }
                else if (type == 'picked_up_vs_shipped') {
                    drawPickedupVsShippedSalesChart(res);
                }
                else if (type == 'source_type') {
                    drawSourceTypeSalesChart(res);
                }
                else if (type == 'source_channel') {
                    drawSourceChannelSalesChart(res);
                }
                // type == 'sales_per_channel' ? drawSalesPerChannelChart(res) : drawPickedupVsShippedSalesChart(res);
            })
        }
        else {
            document.getElementById('no-chart-data').classList.remove('hide');
        }
        chartContainer.classList.remove('hide');
        document.getElementById('chart-loader').classList.add('hide');
    }
    catch (err) {
        document.getElementById('no-chart-data').classList.remove('hide');
        chartContainer.classList.remove('hide');
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
                document.getElementById('fulfill-quantity').innerText = res.total_pending_shipping;
            })
        }
    }
    catch (err) {
        console.log(err);
    }
}


function populatePickedUpSales(status, data) {
    if (status == 200 && data.pickup_sales.length > 0) {
        totalPickUpSalesNumber.innerText = '$' + data.total_pickup_sales;
        pickupSalesList.innerHTML = '';
        data.pickup_sales.forEach((sale) => {
            pickupSalesList.innerHTML += `<div>
                                            <span class="table-text-overflow" title="${sale.name}">${sale.name}</span>
                                            <span>$${sale.total_sales}</span>
                                        </div>`;
        })
    }
    else {
        totalPickUpSalesNumber.innerText = '$' + 0;
        pickupSalesList.innerHTML = `<div>
                                        <span class="w-100 text-center">No Pick-Up Sales</span>
                                    </div>`;
    }
}


function populateShippedSales(status, data) {
    if (status == 200 && data.shipping_sales.length > 0) {
        shippedSalesList.innerHTML = '';
        data.shipping_sales.forEach((sale) => {
            shippedSalesList.innerHTML += `<div>
                                                <span class="table-text-overflow" title="${sale.name}">${sale.name}</span>
                                                <span>$${sale.total_sales}</span>
                                            </div>`;
        })
    }
    else {
        shippedSalesList.innerHTML = `<div>
                                        <span class="w-100 text-center">No Shipped Sales</span>
                                    </div>`;
    }
}


function populateTopProducts(status, data) {
    if (status == 200 && data.top_products.length > 0) {
        topProductsTableBody.innerHTML = '';
        data.top_products.forEach((product) => {
            topProductsTableBody.innerHTML += `<tr>
                                                    <td width="44.5%" class="table-text-overflow" title="${product.title}">${product.title}</td>
                                                    <td width="33.8%" class="table-text-overflow" title="${product.quantity} units">${product.quantity} units</td>
                                                    <td width="21.6%" class="table-text-overflow" title="$${product.total_sales}">$${product.total_sales}</td>
                                                </tr>`;
        })
    }
    else {
        topProductsTableBody.innerHTML = `<tr>
                                            <td colspan="3" class="no-record-row">No Top Products</td>
                                        </tr>`;
    }
}


function populateTopReferrers(status, data) {
    if (status == 200 && data.top_referrals.length > 0) {
        topReferrersTableBody.innerHTML = '';
        data.top_referrals.forEach((referral) => {
            topReferrersTableBody.innerHTML += `<tr>
                                                    <td class="table-text-overflow" title="${referral.name}">${referral.name}</td>
                                                    <td class="table-text-overflow" title="${referral.referral_count}(${referral.completed_referral_count})">${referral.referral_count}(${referral.completed_referral_count})</td>
                                                    <td class="table-text-overflow" title="$${referral.total_sales}">$${referral.total_sales}</td>
                                                </tr>`;
        })
    }
    else {
        topReferrersTableBody.innerHTML = `<tr>
                                                <td colspan="3" class="no-record-row">No Top Referrers</td>
                                            </tr>`;
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


function populateYearList(n=0) {
    let yearList = getLastNYears(n);
    yearList.forEach((year) => {
        selectYearDropdown.innerHTML += `<span onclick="selectDataYear(event);">${year}</span>`;
    })
}


function selectDataYear(event) {
    let year = event.target.innerText;
    salesChannelChartDataURL = setParams(salesChannelChartDataURL, 'year', year);
    pickedupVsShippedChartDataURL = setParams(pickedupVsShippedChartDataURL, 'year', year);
    sourceTypeChartDataURL = setParams(sourceTypeChartDataURL, 'year', year);
    sourceChannelChartDataURL = setParams(sourceChannelChartDataURL, 'year', year);
    selectedYearText.innerText = year;
    if (typeof salesPerChannelStackedChart == 'object')
        salesPerChannelStackedChart.destroy();
    if (typeof pickedupVsShippedStackedChart == 'object')
        pickedupVsShippedStackedChart.destroy();
    if (typeof sourceTypeStackedChart == 'object')
        sourceTypeStackedChart.destroy();
    if (typeof sourceChannelStackedChart == 'object')
        sourceChannelStackedChart.destroy();
    
    getChartData(salesChannelChartDataURL, 'sales_per_channel');
    getChartData(pickedupVsShippedChartDataURL, 'picked_up_vs_shipped');
    getChartData(sourceTypeChartDataURL, 'source_type');
    getChartData(sourceChannelChartDataURL, 'source_channel');
}


let salesPerChannelStackedChart;
let pickedupVsShippedStackedChart;
let sourceTypeStackedChart;
let sourceChannelStackedChart;

function drawSalesPerChannelChart(res) {
    let stackedChartElement = document.getElementById('sales-per-channel-chart');
    salesPerChannelStackedChart = new Chart(stackedChartElement, {
        type: 'bar',
        data: {
            labels: res.labels,
            datasets: [
                {
                    label: 'Salons',
                    data: res.data_salon,
                    backgroundColor: '#000093',
                    borderWidth: 0
                },
                {
                    label: 'HOMME',
                    data: res.data_homme,
                    backgroundColor: '#000000',
                    borderWidth: 0
                },
                // {
                //     label: 'Referrals',
                //     data: res.data_referral,
                //     backgroundColor: '#CF0000',
                //     borderWidth: 0
                // },
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
                // tooltips: {
                //     mode: 'dataset',
                // },
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
                        color: '#000000',
                    },
                },
            }
        }
    })
}


function drawPickedupVsShippedSalesChart(res) {
    let stackedChartElement = document.getElementById('picked-vs-shipped-sales-chart');
    pickedupVsShippedStackedChart = new Chart(stackedChartElement, {
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


const labels = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const predefinedColors = [
    "#2C2E7F", "#DA3832", "#0D0F11", "#FFF34A",
    "#00AAE9", "#D92D8A", "#00A359", "#E37739"
];


function drawSourceTypeSalesChart(res) {  
    const sourceTypes = [...new Set(res.map(item => item.source_type))];
    const colorMap = {};
  
    // Generate colors for each source_type on first load
    sourceTypes.forEach((type, index) => {
        colorMap[type] = {
            backgroundColor: predefinedColors[index] || getRandomColor(),
            borderColor: predefinedColors[index] || getRandomColor()
        };
    });
  
    let datasets = generateDatasets(res, sourceTypes, colorMap, 'type');

    const ctx = document.getElementById('source-type-sales-chart').getContext('2d');
    sourceTypeStackedChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: datasets
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
    });

    // const dropdownMenu = document.getElementById('sourceTypeDropdownMenu');
    // sourceTypes.forEach(type => {
    //     const checkboxItem = document.createElement('div');
    //     checkboxItem.className = 'form-check dropdown-item';

    //     const checkbox = document.createElement('input');
    //     checkbox.type = 'checkbox';
    //     checkbox.className = 'form-check-input';
    //     checkbox.id = `checkbox-${type}`;
    //     checkbox.checked = true;
    //     checkbox.onchange = () => updateChart();

    //     const label = document.createElement('label');
    //     label.className = 'form-check-label';
    //     label.htmlFor = `checkbox-${type}`;
        
    //     const colorCircle = document.createElement('span');
    //     colorCircle.className = 'color-circle';
    //     colorCircle.style.backgroundColor = colorMap[type].backgroundColor;
    //     colorCircle.style.width = '11px';
    //     colorCircle.style.height = '11px';
    //     colorCircle.style.display = 'inline-block';
    //     colorCircle.style.borderRadius = '50%';

    //     label.appendChild(colorCircle);
    //     label.append(type);

    //     checkboxItem.appendChild(checkbox);
    //     checkboxItem.appendChild(label);
    //     dropdownMenu.appendChild(checkboxItem);
    // });

    function updateChart() {
        const activeTypes = sourceTypes.filter(type => document.getElementById(`checkbox-${type}`).checked);
        sourceTypeStackedChart.data.datasets = generateDatasets(data).filter(dataset => activeTypes.includes(dataset.label));
        sourceTypeStackedChart.update();
    }
}


function drawSourceChannelSalesChart(res) {  
    const sourceChannels = [...new Set(res.map(item => item.source_channel))];
    const colorMap = {};
  
    // Generate colors for each source_type on first load
    sourceChannels.forEach((channel, index) => {
        colorMap[channel] = {
            backgroundColor: predefinedColors[index] || getRandomColor(),
            borderColor: predefinedColors[index] || getRandomColor()
        };
    });
  
    let datasets = generateDatasets(res, sourceChannels, colorMap, 'channel');

    const ctx = document.getElementById('source-channel-sales-chart').getContext('2d');
    sourceChannelStackedChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: datasets
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
    });

    // const dropdownMenu = document.getElementById('sourceTypeDropdownMenu');
    // sourceChannels.forEach(type => {
    //     const checkboxItem = document.createElement('div');
    //     checkboxItem.className = 'form-check dropdown-item';

    //     const checkbox = document.createElement('input');
    //     checkbox.type = 'checkbox';
    //     checkbox.className = 'form-check-input';
    //     checkbox.id = `checkbox-${type}`;
    //     checkbox.checked = true;
    //     checkbox.onchange = () => updateChart();

    //     const label = document.createElement('label');
    //     label.className = 'form-check-label';
    //     label.htmlFor = `checkbox-${type}`;
        
    //     const colorCircle = document.createElement('span');
    //     colorCircle.className = 'color-circle';
    //     colorCircle.style.backgroundColor = colorMap[type].backgroundColor;
    //     colorCircle.style.width = '11px';
    //     colorCircle.style.height = '11px';
    //     colorCircle.style.display = 'inline-block';
    //     colorCircle.style.borderRadius = '50%';

    //     label.appendChild(colorCircle);
    //     label.append(type);

    //     checkboxItem.appendChild(checkbox);
    //     checkboxItem.appendChild(label);
    //     dropdownMenu.appendChild(checkboxItem);
    // });

    function updateChart() {
        const activeTypes = sourceChannels.filter(channel => document.getElementById(`checkbox-${channel}`).checked);
        sourceChannelStackedChart.data.datasets = generateDatasets(data).filter(dataset => activeTypes.includes(dataset.label));
        sourceChannelStackedChart.update();
    }
}


// Generate datasets function
function generateDatasets(chartData, legends, colorMap, type='type') {
    const datasets = [];
    const dataByChartType = {};

    legends.forEach(type => {
        dataByChartType[type] = Array.from({ length: 12 }, () => 0);
    });

    chartData.forEach(item => {
        const monthIndex = new Date(item.month).getUTCMonth();
        if (type == 'type')
            dataByChartType[item.source_type][monthIndex] += parseFloat(item.total_sales);
        else if (type == 'channel')
            dataByChartType[item.source_channel][monthIndex] += parseFloat(item.total_sales);
    });

    legends.forEach(type => {
        datasets.push({
            label: type,
            data: dataByChartType[type],
            backgroundColor: colorMap[type].backgroundColor,
            borderColor: colorMap[type].borderColor,
            borderWidth: 1
        });
    });

    return datasets;
}


function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


async function getOrderDataInCSVFormat(button) {
    try {
        let token = getCookie('admin_access');
        let headers = {
            "Authorization": `Bearer ${token}`,
            "Accept": "text/csv"
        };
        beforeLoad(button);
        // let response = await requestAPI(`${apiURL}/admin/orders/tax-report`, null, headers, 'GET');
        let response = await requestAPI(`${apiURL}/admin/orders/detail/sale-and-tax-report`, null, headers, 'GET');
        if (response.status == 200) {
            response.text().then(function(res) {
                downloadCSV(res, 'sale-and-tax-report');
            })
            afterLoad(button, 'EXPORT ORDERS');
        }
        else {
            afterLoad(button, 'ERROR');
        }
    }
    catch (err) {
        afterLoad(button, 'ERROR');
        console.log(err);
    }
}


function downloadCSV(csvData, filename) {
    const blob = new Blob([csvData], { type: 'text/csv' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);

    link.download = filename;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
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


function selectSalesOverviewTime(event) {
    let element = event.target;
    let startDate, endDate;
    if (element.innerText == 'TODAY' && selectedSalesOverviewTime.innerText != element.innerText) {
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        const timezoneOffset = today.getTimezoneOffset() * 60000;
        let todayStartingTime = new Date(today.getTime() - timezoneOffset).toISOString();
        salesOverviewDataURL = setParams(salesOverviewDataURL, 'created_at__gte', todayStartingTime);
        salesOverviewDataURL = setParams(salesOverviewDataURL, 'created_at__lte', '');
    }
    else if (element.innerText == 'CURRENT WEEK' && selectedSalesOverviewTime.innerText != element.innerText) {
        const { startOfWeek, endOfWeek } = getStartOfWeek();
        salesOverviewDataURL = setParams(salesOverviewDataURL, 'created_at__gte', startOfWeek);
        salesOverviewDataURL = setParams(salesOverviewDataURL, 'created_at__lte', endOfWeek);
    }
    else if (element.innerText == 'LAST WEEK' && selectedSalesOverviewTime.innerText != element.innerText) {
        const { startOfPreviousWeek, endOfPreviousWeek } = getStartAndEndOfPreviousWeek();
        salesOverviewDataURL = setParams(salesOverviewDataURL, 'created_at__gte', startOfPreviousWeek);
        salesOverviewDataURL = setParams(salesOverviewDataURL, 'created_at__lte', endOfPreviousWeek);
    }
    else if (element.innerText == 'CURRENT MONTH' && selectedSalesOverviewTime.innerText != element.innerText) {
        let today = new Date();
        const { startOfMonth, endOfMonth } = getStartAndEndOfMonth(today);
        salesOverviewDataURL = setParams(salesOverviewDataURL, 'created_at__gte', startOfMonth);
        salesOverviewDataURL = setParams(salesOverviewDataURL, 'created_at__lte', endOfMonth);
    }
    else if (element.innerText == 'LAST MONTH' && selectedSalesOverviewTime.innerText != element.innerText) {
        const { startOfLastMonth, endOfLastMonth } = getStartAndEndOfLastMonth();
        salesOverviewDataURL = setParams(salesOverviewDataURL, 'created_at__gte', startOfLastMonth);
        salesOverviewDataURL = setParams(salesOverviewDataURL, 'created_at__lte', endOfLastMonth);
    }
    else if (element.innerText == 'CURRENT QUARTER' && selectedSalesOverviewTime.innerText != element.innerText) {
        const { startOfQuarter, endOfQuarter } = getStartAndEndOfQuarter();
        salesOverviewDataURL = setParams(salesOverviewDataURL, 'created_at__gte', startOfQuarter);
        salesOverviewDataURL = setParams(salesOverviewDataURL, 'created_at__lte', endOfQuarter);
    }
    else if (element.innerText == 'LAST QUARTER' && selectedSalesOverviewTime.innerText != element.innerText) {
        const { startOfLastQuarter, endOfLastQuarter } = getStartAndEndOfLastQuarter();
        salesOverviewDataURL = setParams(salesOverviewDataURL, 'created_at__gte', startOfLastQuarter);
        salesOverviewDataURL = setParams(salesOverviewDataURL, 'created_at__lte', endOfLastQuarter);
    }
    else if (element.innerText == 'CURRENT YEAR' && selectedSalesOverviewTime.innerText != element.innerText) {
        const { startOfYear, endOfYear } = getStartAndEndOfYear();
        salesOverviewDataURL = setParams(salesOverviewDataURL, 'created_at__gte', startOfYear);
        salesOverviewDataURL = setParams(salesOverviewDataURL, 'created_at__lte', endOfYear);
    }
    else if (element.innerText == 'LAST YEAR' && selectedSalesOverviewTime.innerText != element.innerText) {
        const { startOfLastYear, endOfLastYear } = getStartAndEndOfLastYear();
        salesOverviewDataURL = setParams(salesOverviewDataURL, 'created_at__gte', startOfLastYear);
        salesOverviewDataURL = setParams(salesOverviewDataURL, 'created_at__lte', endOfLastYear);
    }
    else if (element.innerText == 'ALL TIME' && selectedSalesOverviewTime.innerText != element.innerText) {
        salesOverviewDataURL = setParams(salesOverviewDataURL, 'created_at__gte', '');
        salesOverviewDataURL = setParams(salesOverviewDataURL, 'created_at__lte', '');
    }
    getSalesOverviewData();
    selectedSalesOverviewTime.innerText = element.innerText;
    selectedSalesOverviewTime.title = element.innerText;
    salesOverviewTimeDropdown.classList.add('hide');
    salesOverviewTimeBtn.click();
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