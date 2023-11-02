let requiredDataURL = `${apiURL}/admin/products?page=1&perPage=1000`;

let productCategoryDropdown = document.getElementById('product-category-dropdown');
let productCategoryDropdownBtn = document.getElementById('product-category');
let productCategoryOptions = document.querySelectorAll('input[name="product_category_radio"]');

let productTypeDropdown = document.getElementById('product-type-dropdown');
let productTypeDropdownBtn = document.getElementById('product-type');
let productTypeOptions = document.querySelectorAll('input[name="product_type_radio"]');

let skinTypeDropdown = document.getElementById('skin-type-dropdown');
let skinTypeDropdownBtn = document.getElementById('skin-type');
let skinTypeOptions = document.querySelectorAll('input[name="skin_type_radio"]');


window.onload = () => {
    getData();
    populateModalDropdowns();
}

function searchForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let formData = new FormData(form);
    let data = formDataToObject(formData);
    urlParams = setParams(requiredDataURL, 'search', `${data.search}`);
    getData(urlParams);
}


async function getData(url=null) {
    let token = getCookie('admin_access');
    let headers = {
        "Authorization": `Bearer ${token}`
    }
    let data;
    let tableBody = document.getElementById('product-table');
    if (url == null) {
        data = requiredDataURL;
    }
    else {
        data = url;
        document.getElementById('table-loader').classList.remove('hide');
        tableBody.classList.add('hide');
    }
    try {
        let resp = await requestAPI(requiredDataURL, null, headers, 'GET');
        // console.log(resp);
        resp.json().then(function(res) {
            // console.log(res);
        })
        let response = await requestAPI('/get-product-list/', JSON.stringify(data), {}, 'POST');
        response.json().then(function(res) {
            // console.log(res);
            if (res.success) {
                document.getElementById('table-loader').classList.add('hide');
                tableBody.innerHTML = res.product_data;
                tableBody.classList.remove('hide');
            }
        })
    }
    catch (err) {
        console.log(err);
    }
}