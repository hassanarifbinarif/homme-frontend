window.onload = () => {
    getData();
    getNotifications();
}


let commentsWrapper = document.getElementById('comments-wrapper');
let showCommentsCheckbox = document.getElementById('comment-checkbox');

showCommentsCheckbox.addEventListener('change', function() {
    if (this.checked) {
        commentsWrapper.classList.remove('hide');
    }
    else {
        commentsWrapper.classList.add('hide');
    }
})


async function getData() {
    let token = getCookie('admin_access');
    let headers = {
        "Authorization": `Bearer ${token}`
    };
    let commissionsResponse = await requestAPI(`${apiURL}/admin/salons/commissions/salon?page=1&perPage=3&salon=${specific_salon_id}`, null, headers, 'GET');
    let orderResponse = await requestAPI(`${apiURL}/admin/orders?page=1&perPage=5&ordering=-created_at&salon=${specific_salon_id}`, null, headers, 'GET');
    let customerResponse = await requestAPI(`${apiURL}/admin/salons/customers?page=1&perPage=5&ordering=-created_at&salon=${specific_salon_id}`, null, headers, 'GET');
    let stylistResponse = await requestAPI(`${apiURL}/admin/salons/stylists?salon=${specific_salon_id}`, null, headers, 'GET');
    let inventoryResponse = await requestAPI(`${apiURL}/admin/inventory/salons/${specific_salon_id}/inventory-to-fulfill`, null, headers, 'GET');
    populateCommissions(commissionsResponse);
    populateOrders(orderResponse);
    populateCustomers(customerResponse);
    populateStylists(stylistResponse);
    populateInventoryStats(inventoryResponse);
}


function populateCommissions(response) {
    let commissionsTableLoader = document.getElementById('commissions-table-loader');
    let commissionsTable = document.getElementById('commissions-table');
    let commissionsTableBody = commissionsTable.querySelector('tbody');

    response.json().then(function(res) {
        commissionsTableBody.innerHTML = '';

        if (response.status == 200 && res.data.length > 0) {
            res.data.forEach((item) => {
                commissionsTableBody.innerHTML += `<tr>
                                                        <td><div><span>${formatCustomDate(item.month, { month: 'long', year: 'numeric' })}</span></div></td>
                                                        <td><div><span>${item.total_products}</span></div></td>
                                                        <td><div><span>${item.total_customer_purchase}</span></div></td>
                                                        <td><div><span>${item.total_commission}</span></div></td>
                                                        <td><div><span>${captalizeFirstLetter(item.status)}</span></div></td>
                                                    </tr>`;
            })
        }
        else {
            commissionsTableBody.innerHTML = `<tr><td colspan="5" class="no-record-row">No record available</td></tr>`;
        }
        commissionsTableLoader.classList.add('hide');
        commissionsTable.classList.remove('hide');
    })
}


function populateOrders(response) {
    let orderTableLoader = document.getElementById('order-table-loader');
    let orderTable = document.getElementById('order-table');
    let orderTableBody = orderTable.querySelector('tbody');
    let itemQuantity;

    response.json().then(function(res) {
        orderTableBody.innerHTML = '';

        if (response.status == 200 && res.data.length > 0) {
            res.data.forEach((item) => {
                itemQuantity = 0;
                item.products.forEach((prod) => {
                    itemQuantity += prod.qty;
                })
                orderTableBody.innerHTML += `<tr>
                                                <td onclick="location.pathname = '/specific-order/${item.id}'"><div class="highlighted-data"><span>#${item.id}</span></div></td>
                                                <td onclick="location.pathname = '/specific-customer/${item.user_profile.id}'"><div class="highlighted-data"><span title="${item.user_profile.first_name} ${item.user_profile.last_name}" class="table-text-overflow">${item.user_profile.first_name} ${item.user_profile.last_name}</span></div></td>
                                                <td><div><span>${itemQuantity}</span></div></td>
                                                <td><div><span>$${item.total}</span></div></td>
                                                <td><div><span>${captalizeFirstLetter(item.pickup_type)}</span></div></td>
                                                <td><div><span>${captalizeFirstLetter(item.status)}</span></div></td>
                                            </tr>`;
            })
        }
        else {
            orderTableBody.innerHTML = `<tr><td colspan="6" class="no-record-row">No record available</td></tr>`
        }
        orderTableLoader.classList.add('hide');
        orderTable.classList.remove('hide');
    })
}


function populateCustomers(response) {
    let customersTableLoader = document.getElementById('customers-table-loader');
    let customersTable = document.getElementById('customers-table');
    let customersTableBody = customersTable.querySelector('tbody');

    response.json().then(function(res) {
        customersTableBody.innerHTML = '';

        if (response.status == 200 && res.data.length > 0) {
            res.data.forEach((item) => {
                let addressString = item.address ? `${item.address.city || ''}, ${item.address.state || ''} ${item.address.zip_code || ''}` : 'No Address';
                customersTableBody.innerHTML += `<tr>
                                                    <td onclick="location.pathname = '/specific-customer/${item.user_profile_id}'"><div class="highlighted-data"><span title="${item.fullname}" class="table-text-overflow">${item.fullname}</span></div></td>
                                                    <td><div><span class="table-text-overflow" title="${addressString}">${addressString}</span></div></td>
                                                    <td><div><span class="table-text-overflow">${formatCustomDate(item.created_at, { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}</span></div></td>
                                                    <td><div><span class="table-text-overflow">$${item.net_sales || 0}</span></div></td>
                                                </tr>`;
            })
        }
        else {
            customersTableBody.innerHTML = '<tr><td colspan="4" class="no-record-row">No record available</td></tr>';
        }
        customersTableLoader.classList.add('hide');
        customersTable.classList.remove('hide');
    })
}


function populateStylists(response) {
    let hairStylistWrapper = document.getElementById('hair-stylist-wrapper');

    response.json().then(function(res) {
        if (response.status == 200 && res.data.length > 0) {
            res.data.forEach((item) => hairStylistWrapper.innerHTML += `<span>${captalizeFirstLetter(item.fullname)}</span>`)
        }
        else {
            hairStylistWrapper.innerHTML = '<span>No Hairstylists</span>';
        }
        document.getElementById('hair-stylist-loader').classList.add('hide');
        hairStylistWrapper.classList.remove('hide');
    })
}


function populateInventoryStats(response) {
    if (response.status == 200) {
        response.json().then(function(res) {
            document.getElementById('status-date').innerText = res.status_date;
            document.getElementById('sku-to-fulfill').innerText = res.sku_to_fulfill == "" ? "No SKUs" : res.sku_to_fulfill;
            document.getElementById('retail-value-to-fulfill').innerText = '$' + res.retail_value_to_fulfill;
            document.getElementById('products-stock').innerText = res.products_count + ' Products';
            document.getElementById('latest-movement').innerText = res.movement_week + '/' + res.movement_month;
        })
    }
    document.getElementById('inventory-stat-loader').classList.add('hide');
    document.getElementById('inventory-details').classList.remove('hide');
}


function formatCustomDate(dateString, options) {
    const formattedDate = new Date(dateString).toLocaleString('en-US', options);
    return formattedDate;
}