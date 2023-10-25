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
    let skinTypeDropdown = modal.querySelector('#skin-type-dropdown');
    let token = getCookie("admin_access");
    let headers = {
        "Authorization": `Bearer ${token}`,
    };
    let responseProductCategory = await requestAPI(`${apiURL}/admin/categories?perPage=1000`, null, headers, 'GET');
    let responseProductType = await requestAPI(`${apiURL}/admin/product-types?perPage=1000`, null, headers, 'GET');
    let responseSkinTypes = await requestAPI(`${apiURL}/admin/skin-types?perPage=1000`, null, headers, 'GET');
    responseProductCategory.json().then(function(res) {
        let productCategories = [...res.data];
        productCategoryDropdown.innerHTML = null;
        productCategories.forEach((prodCat) => {
            productCategoryDropdown.innerHTML += `<div class="radio-btn">
                                                        <input onchange="selectProductCategory(event);" required id="product-category-${prodCat.id}" data-id="${prodCat.id}" type="radio" value="${prodCat.name}" name="product_category_radio" />
                                                        <label for="product-category-${prodCat.id}" class="radio-label">${prodCat.name}</label>
                                                    </div>`
        })
    })
    responseProductType.json().then(function(res) {
        let productTypes = [...res.data];
        productTypeDropdown.innerHTML = null;
        productTypes.forEach((prodType) => {
            productTypeDropdown.innerHTML += `<div class="radio-btn">
                                                    <input onchange="selectProductType(event);" required id="product-type-${prodType.id}" data-id="${prodType.id}" type="radio" value="${prodType.name}" name="product_type_radio" />
                                                    <label for="product-type-${prodType.id}" class="radio-label">${prodType.name}</label>
                                                </div>`
        })
    })
    responseSkinTypes.json().then(function(res) {
        let skinTypes = [...res.data];
        skinTypeDropdown.innerHTML = null;
        skinTypes.forEach((skinType) => {
            skinTypeDropdown.innerHTML += `<div class="radio-btn">
                                                <input onchange="selectSkinType(event);" required id="skin-type-${skinType.id}" data-id="${skinType.id}" type="radio" value="${skinType.name}" name="skin_type_radio" />
                                                <label for="skin-type-${skinType.id}" class="radio-label">${skinType.name}</label>
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


function selectSkinType(event) {
    let inputElement = event.target;
    if(inputElement.checked) {
        document.getElementById('selected-skin-type').innerText = inputElement.nextElementSibling.innerText;
        document.getElementById('selected-skin-type').style.color = '#000';
    }
}


async function createProductForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let formData = new FormData(form);
    let data = formDataToObject(formData);
    let allProductCatOptions = form.querySelectorAll('input[name="product_category_radio"]');
    let allProductTypeOptions = form.querySelectorAll('input[name="product_type_radio"]');
    let allSkinTypeOptions = form.querySelectorAll('input[name="skin_type_radio"]');
    allProductCatOptions.forEach((option) => {
        if (option.value == data.product_category_radio) {
            formData.append('category', option.getAttribute('data-id'));
        } 
    })
    allProductTypeOptions.forEach((option) => {
        if (option.value == data.product_type_radio) {
            formData.append('type', option.getAttribute('data-id'));
        }
    })
    allSkinTypeOptions.forEach((option) => {
        if (option.value == data.skin_type_radio) {
            formData.append('skin_type', option.getAttribute('data-id'));
        }
    })
    console.log(data);
    let prodBuyPageImg = form.querySelector('input[name="prod_buy_page_img"]');
    let prodDetailImg1 = form.querySelector('input[name="prod_detail_img_1"]');
    let prodDetailImg2 = form.querySelector('input[name="prod_detail_img_2"]');
    let prodDetailImg3 = form.querySelector('input[name="prod_detail_img_3"]');
    let prodDetailImg4 = form.querySelector('input[name="prod_detail_img_4"]');
    formData.append('images', prodBuyPageImg.files[0]);
    formData.append('images', prodDetailImg1.files[0]);
    formData.append('images', prodDetailImg2.files[0]);
    formData.append('images', prodDetailImg3.files[0]);
    formData.append('images', prodDetailImg4.files[0]);
    formData.append('is_active', true);
    formData.delete('prod_buy_page_img');
    formData.delete('prod_detail_img_1');
    formData.delete('prod_detail_img_2');
    formData.delete('prod_detail_img_3');
    formData.delete('prod_detail_img_4');
    formData.delete('product_category_radio');
    formData.delete('product_type_radio')
    formData.delete('skin_type_radio');

    data = formDataToObject(formData);
    console.log(data);
    try {
        let token = getCookie('admin_access');
        let headers = {
            "Authorization": `Bearer ${token}`,
        };
        let response = await requestAPI(`${apiURL}/admin/products`, formData, headers, 'POST');
        console.log(response);
        response.json().then(function(res) {
            console.log(res);
        })
    }
    catch (err) {
        console.log(err);
    }
}