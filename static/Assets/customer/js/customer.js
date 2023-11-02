let requiredDataURL = `${apiURL}/admin/user-profiles?user__is_blocked=false&perPage=1000`;

window.onload = () => {
    getData();
}

function searchForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let formData = new FormData(form);
    let data = formDataToObject(formData);
    urlParams = setParams(requiredDataURL, 'search', `${data.search}`);
    getData(urlParams);
}

let totalCustomers = null;

async function getData(url=null) {
    let token = getCookie('admin_access');
    let headers = {
        "Authorization": `Bearer ${token}`
    }
    let data;
    let tableBody = document.getElementById('customer-table');
    if (url == null) {
        data = requiredDataURL;
    }
    else {
        data = url;
        document.getElementById('table-loader').classList.remove('hide');
        tableBody.classList.add('hide');
    }
    try {
        // let resp = await requestAPI(requiredDataURL, null, headers, 'GET');
        // resp.json().then(function(res) {
        //     console.log(res);
        // })
        let response = await requestAPI('/get-customer-list/', JSON.stringify(data), {}, 'POST');
        response.json().then(function(res) {
            if (res.success) {
                document.getElementById('table-loader').classList.add('hide');
                tableBody.innerHTML = res.customer_data;
                if (totalCustomers == null) {
                    totalCustomers = res.total_customers;
                    document.getElementById('total-customer-number').innerText = res.total_customers;
                }
                tableBody.classList.remove('hide');
            }
        })
    }
    catch (err) {
        console.log(err);
    }
}