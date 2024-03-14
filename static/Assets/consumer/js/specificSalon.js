let commentsWrapper = document.getElementById('comments-wrapper');
let showCommentsCheckbox = document.getElementById('comment-checkbox');

let commentWrapper = document.getElementById('comments-wrapper');
let commentLoader = document.getElementById('comment-loader');
let noCommentDiv = document.getElementById('no-comment-div');
let allCommentData = [];

let timelineDataURL = `/admin/users/activities?ordering=-created_at&user=${specific_salon_user_id}&perPage=1000`;


window.onload = () => {
    getData();
    // getNotifications();
    populateStateCountryDropdowns();
    populateSalonStateCountryDropdowns();
    getTimelineData();
}


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


async function getTimelineData() {
    commentLoader.classList.remove('hide');
    commentWrapper.classList.add('hide');
    noCommentDiv.classList.add('hide');

    try {
        let token = getCookie('admin_access');
        let headers = {
            "Authorization": `Bearer ${token}`
        };
        let response = await requestAPI(`${apiURL}${timelineDataURL}`, null, headers, 'GET');
        response.json().then(function(res) {
            
            if (response.status == 200 && res.data.length > 0) {
                allCommentData = [...res.data];
                populateTimeline(res.data);
                commentLoader.classList.add('hide');
                commentWrapper.classList.remove('hide');
                noCommentDiv.classList.add('hide');
            }
            else {
                commentLoader.classList.add('hide');
                noCommentDiv.classList.remove('hide');
            }
        })
    }
    catch (err) {
        commentLoader.classList.add('hide');
        noCommentDiv.classList.remove('hide');
        console.log(err);
    }
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
                                                        <td><div><span>${formatCustomDate(item.month)}</span></div></td>
                                                        <td><div><span>${item.total_products}</span></div></td>
                                                        <td><div><span>$${item.total_customer_purchase}</span></div></td>
                                                        <td><div><span>$${item.total_commission}</span></div></td>
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
                                                <td onclick="location.pathname = '/specific-order/${item.id}'"><div class="highlighted-data cursor-pointer"><span>#${item.id}</span></div></td>
                                                <td onclick="location.pathname = '/specific-customer/${item.user_profile.id}'"><div class="highlighted-data cursor-pointer"><span title="${item.user_profile.first_name} ${item.user_profile.last_name}" class="table-text-overflow">${item.user_profile.first_name} ${item.user_profile.last_name}</span></div></td>
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
                                                    <td onclick="location.pathname = '/specific-customer/${item.user_profile_id}'"><div class="highlighted-data cursor-pointer"><span title="${item.fullname}" class="table-text-overflow">${item.fullname}</span></div></td>
                                                    <td><div><span class="table-text-overflow" title="${addressString}">${addressString}</span></div></td>
                                                    <td><div><span class="table-text-overflow">${convertDateTime(item.created_at)}</span></div></td>
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
            res.data.forEach((item) => hairStylistWrapper.innerHTML += `<span data-role="stylist" data-id="${item.id}">${item.fullname}</span>`);
        }
        else {
            hairStylistWrapper.innerHTML = '<span class="no-stylist">No Hairstylists</span>';
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


let groupedComments = {}

function populateTimeline(data) {
    groupedComments = groupCommentsByDate(data);
    commentWrapper.innerHTML = '';

    for (const [date, comments] of Object.entries(groupedComments)) {
        const ul = document.createElement("ul");
        ul.classList.add('timeline', 'see');

        let dateParagraph = document.createElement("p");
        dateParagraph.textContent = getCommentMonthAndDate(date);
        ul.appendChild(dateParagraph);

        let commentDiv = document.createElement('div');
        ul.appendChild(commentDiv);
        commentWrapper.appendChild(ul);

        comments.forEach(commentData => {
            commentDiv.insertAdjacentHTML('beforeend', `<li>
                                                            <div>
                                                                <pre>${commentData.message}</pre>
                                                            </div>
                                                            <div class="comment-time">${getCommentTime(commentData.created_at)}</div>
                                                        </li>`);
        });
    }
}


function groupCommentsByDate(comments) {
    const grouped = {};
    comments.forEach(comment => {
        const date = new Date(comment.created_at);
        const localeDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        const dateString = localeDate.toISOString().split('T')[0];
        if (!grouped[dateString]) {
            grouped[dateString] = [];
        }
        grouped[dateString].push(comment);
    });
    return grouped;
}


function addNewComment(newComment) {
    const date = new Date(newComment.created_at);
    const abcDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    const localDate = new Date(abcDate).toISOString().split('T')[0];

    allCommentData.unshift(newComment);
    populateTimeline(allCommentData);
    noCommentDiv.classList.add('hide');
    commentWrapper.classList.remove('hide');
}


const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function getCommentMonthAndDate(dateString) {
    let dateObject = new Date(dateString);

    const dateOptions = { month: 'long', day: 'numeric' };
    let localeDateObject = dateObject.toLocaleDateString(undefined, dateOptions);
    let newDate = new Date(localeDateObject);

    const month = monthNames[newDate.getMonth()];
    const day = newDate.getDate();

    return `${month} ${day}`;
}


function getCommentTime(dateString) {
    let dateObject = new Date(dateString);

    const dateOptions = { hour12: true, hour: 'numeric', minute: '2-digit' };
    let localeDateObject = dateObject.toLocaleString(undefined, dateOptions);
    // console.log(localeDateObject);

    // const hours = localeDateObject.getHours();
    // const minutes = localeDateObject.getMinutes();

    // const ampm = hours >= 12 ? 'PM' : 'AM';
    // const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    // const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    // const result = `${formattedHours}:${formattedMinutes} ${ampm}`;

    return localeDateObject;
}


async function commentForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let commenTextarea = document.getElementById('comment-textarea');
    let errorMsg = document.querySelector('.comment-error-msg');
    let button = document.getElementById('comment-post-btn');
    let buttonText = button.innerText;

    if (commenTextarea.value.trim().length == 0) {
        errorMsg.innerHTML = 'Enter valid comment';
        errorMsg.classList.add('active');
        return false;
    }

    try {
        let data = { "data": { "comment": commenTextarea.value }, user: specific_salon_user_id };
        errorMsg.innerHTML = '';
        errorMsg.classList.remove('active');

        let token = getCookie('admin_access');
        let headers = {
            "Authorization": `Bearer ${token}`,
            "Content-Type": 'application/json'
        };

        beforeLoad(button);
        let response = await requestAPI(`${apiURL}/admin/users/activities`, JSON.stringify(data), headers, 'POST');
        response.json().then(function(res) {
            if (response.status == 201) {
                button.style.pointerEvents = 'none';
                afterLoad(button, 'POSTED');
                form.reset();
                addNewComment(res.data);
                setTimeout(() => {
                    afterLoad(button, 'POST');
                    button.style.pointerEvents = 'auto';
                }, 1200)
            }
            else {
                errorMsg.classList.add('active');
                afterLoad(button, 'ERROR');
                displayMessages(res.messages, errorMsg);
            }
        })
    }
    catch (err) {
        errorMsg.classList.add('active');
        afterLoad(button, 'ERROR');
        displayMessages(res.messages, errorMsg);
        console.log(err);
    }
}


function formatCustomDate(dateString) {
    const inputDate = new Date(dateString);

    const month = monthNames[inputDate.getUTCMonth()];
    const year = inputDate.getUTCFullYear();

    const result = `${month}, ${year}`;
    return result;

    // const formattedDate = new Date(dateString).toLocaleString('en-US', options);
    // return formattedDate;
}


function convertDateTime(dateString) {
    const inputDate = new Date(dateString);

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

    return result;
}