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

let productData = [];

async function openCreateOrderModal(modalId) {
    let modal = document.querySelector(`#${modalId}`);
    let token = getCookie("admin_access");
    let headers = {
        "Authorization": `Bearer ${token}`,
    };
    // {{base_url}}admin/user-profiles?ordering=-created_at&search=&user__is_blocked=false&page=1&perPage=1000
    // let response = await requestAPI(`${apiURL}/admin/user-profiles?user__is_blocked=false`, null, headers, 'GET');
    let response = await requestAPI(`${apiURL}/admin/products?perPage=1000`, null, headers, 'GET');
    console.log(response);
    response.json().then(function(res) {
        console.log(res);
        productData = [...res.data];
        let productChoiceContainer = document.querySelector("#product-select-choices");
        console.log(productData);
        productData.forEach((product) => {
            productChoiceContainer.innerHTML += `<option value="product-${product.id}">${product.title}</option>`;
        });
    })
    document.querySelector(`.${modalId}`).click();
}