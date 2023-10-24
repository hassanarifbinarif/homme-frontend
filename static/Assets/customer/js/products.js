let requiredDataURL = `${apiURL}/admin/products?page=1&perPage=1000`;

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


async function getData(url=null) {
    let token = getCookie('admin_access');
    let headers = {
        "Authorization": `Bearer ${token}`
    }
    let data;
    if (url == null) {
        data = requiredDataURL;
    }
    else {
        data = url
    }
    let tableBody = document.getElementById('product-table');
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


async function openProductCreateModal(modalID) {
    let modal = document.querySelector(`#${modalID}`);
    let form = modal.querySelector("form");
    form.setAttribute("onsubmit", `createProductForm(event)`);
    let productCategoryDropdown = modal.querySelector('#product-category-dropdown');
    let productTypeDropdown = modal.querySelector('#product-type-dropdown');
    let token = getCookie("admin_access");
    let headers = {
        "Authorization": `Bearer ${token}`,
    };
    let responseProductCategory = await requestAPI(`${apiURL}/categories?perPage=1000`, null, headers, 'GET');
    let responseProductType = await requestAPI(`${apiURL}/admin/product-types?perPage=1000`, null, headers, 'GET');
    responseProductCategory.json().then(function(res) {
        let productCategories = [...res.data];
        productCategories.forEach((prodCat) => {
            productCategoryDropdown.innerHTML += `<div class="radio-btn">
                                                        <input onchange="selectProductCategory(event);" id="product-category-${prodCat.id}" type="radio" value="${prodCat.name}" name="product_category_radio" />
                                                        <label for="product-category-${prodCat.id}" class="radio-label">${prodCat.name}</label>
                                                    </div>`
        })
    })
    responseProductType.json().then(function(res) {
        let productTypes = [...res.data];
        productTypes.forEach((prodType) => {
            productTypeDropdown.innerHTML += `<div class="radio-btn">
                                                    <input onchange="selectProductType(event);" id="product-type-${prodType.id}" type="radio" value="${prodType.name}" name="product_type_radio" />
                                                    <label for="product-type-${prodType.id}" class="radio-label">${prodType.name}</label>
                                                </div>`
        })
    })

    document.querySelector(`.${modalID}`).click();
}


function selectProductCategory(event) {
    let inputElement = event.target;
    if(inputElement.checked) {
        document.getElementById('selected-product-category').innerText = inputElement.nextElementSibling.innerText;
        document.getElementById('selected-product-category').style.color = '#000';
    }
}


function selectProductType(event) {
    let inputElement = event.target;
    if(inputElement.checked) {
        document.getElementById('selected-product-type').innerText = inputElement.nextElementSibling.innerText;
        document.getElementById('selected-product-type').style.color = '#000';
    }
}


async function createProductForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let formData = new FormData(form);
    let data = formDataToObject(formData);
    console.log(data);
}