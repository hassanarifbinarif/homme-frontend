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

let requiredDataURL = `${apiURL}/admin/orders?page=1&perPage=1000&ordering=created_at`;

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


async function getData() {
    let token = getCookie('admin_access');
    let headers = {
        "Authorization": `Bearer ${token}`
    }
    let data = requiredDataURL;
    let tableBody = document.getElementById('order-table');
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