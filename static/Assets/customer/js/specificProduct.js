let requiredDataURL = `${apiURL}`;
let supportedImageWidth = 1000;
let supportedImageHeight = 1000;

window.onload = () => {
    initializeDropdowns();
    populateDropdowns();
    // getNotifications();
}

async function populateDropdowns() {
    let token = getCookie('admin_access');
    let headers = {
        "Authorization": `Bearer ${token}`
    }
    let responseProdCat = await requestAPI(`${apiURL}/admin/categories?perPage=1000`, null, headers, 'GET');
    let responseSkinType = await requestAPI(`${apiURL}/admin/skin-types?perPage=1000`, null, headers, 'GET');
    responseProdCat.json().then(function(res) {
        let tempData = [...res.data];
        tempData.forEach((cat) => {
            productCategoryDropdown.innerHTML += `<div class="radio-btn" id="prod-cat${cat.id}">
                                                    <input onchange="selectProductCategory(event);" id="cat-${cat.id}" data-id="${cat.id}" type="radio" value="${cat.name}" name="specific_product_category_radio" />
                                                    <label for="cat-${cat.id}" class="radio-label">
                                                        <span>${cat.name}</span>
                                                        <svg class="del-icon" onclick="delCategory(event, ${cat.id});" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                            <path d="M8.3369 9.16667V14.1667M11.6709 9.16667V14.1667M3.33594 5.83333H16.6718M15.8383 5.83333L15.1157 15.9517C15.0858 16.3722 14.8976 16.7657 14.589 17.053C14.2805 17.3403 13.8745 17.5 13.4529 17.5H6.55489C6.13326 17.5 5.72729 17.3403 5.41874 17.053C5.1102 16.7657 4.92201 16.3722 4.89207 15.9517L4.16943 5.83333H15.8383ZM12.5044 5.83333V3.33333C12.5044 3.11232 12.4165 2.90036 12.2602 2.74408C12.1039 2.5878 11.8919 2.5 11.6709 2.5H8.3369C8.11584 2.5 7.90384 2.5878 7.74753 2.74408C7.59122 2.90036 7.5034 3.11232 7.5034 3.33333V5.83333H12.5044Z" stroke="#CF0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                        </svg>
                                                    </label>
                                                </div>`
        })
        initializeDropdowns();
    })
    responseSkinType.json().then(function(res) {
        res.data.forEach((type) => {
            skinTypeDropdown.innerHTML += `<div class="radio-btn">
                                                <input id="skin-type-${type.id}" data-id="${type.id}" type="radio" value="${type.name}" name="skin_type_radio" />
                                                <label for="skin-type-${type.id}" class="radio-label">${type.name}</label>
                                            </div>`
        })
        initializeDropdowns();
    })
}


async function selectProductCategory(event) {
    let inputElement = event.target;
    if(inputElement.checked) {
        document.getElementById('selected-specific-product-category').innerText = inputElement.nextElementSibling.children[0].innerText;
        document.getElementById('selected-specific-product-category').style.color = '#000';
        let token = getCookie('admin_access');
        let headers = {
            "Authorization": `Bearer ${token}`
        }
        let formData = new FormData();
        let id = inputElement.getAttribute('data-id');
        formData.append('category', id);
        let response = await requestAPI(`${apiURL}/admin/products/${specific_prod_id}`, formData, headers, 'PATCH');
        response.json().then(function(res) {
            // console.log(res);
        })
    }
}


let skinTypeDropdown;
let skinTypeDropdownBtn;
let skinTypeOptions;

let productCategoryDropdown;
let productCategoryDropdownBtn;
let productCategoryOptions;
let addCategoryWrapper;
let addCategoryBtn


function initializeDropdowns() {

    skinTypeDropdown = document.getElementById('skin-type-dropdown');
    skinTypeDropdownBtn = document.getElementById('skin-type');
    skinTypeOptions = document.querySelectorAll('input[name="skin_type_radio"]');

    skinTypeOptions.forEach((option) => {
        option. addEventListener('change', function() {
            if (this.checked) {
                document.getElementById('selected-skin-type').innerText = this.nextElementSibling.innerText;
                document.getElementById('selected-skin-type').style.color = '#000';   
            }
        })
    })
    skinTypeDropdownBtn.addEventListener('click', toggleDropdown);


    productCategoryDropdown = document.getElementById('specific-product-category-dropdown');
    productCategoryDropdownBtn = document.getElementById('specific-product-category');
    productCategoryOptions = document.querySelectorAll('input[name="specific_product_category_radio"]');
    addCategoryWrapper = document.getElementById('add-category-wrapper');
    addCategoryBtn = document.getElementById('add-category-btn');

    productCategoryOptions.forEach((option) => {
        option.addEventListener('change', function() {
            if(this.checked) {
                document.getElementById('selected-specific-product-category').innerText = this.nextElementSibling.children[0].innerText;
                document.getElementById('selected-specific-product-category').style.color = '#000';
            }
        })
    })
    productCategoryDropdownBtn.addEventListener('click', toggleDropdown);

    addCategoryBtn.addEventListener('click', function(event) {
        document.querySelector('.cat-name-msg').classList.remove('active');
        document.querySelector('.cat-name-msg').innerText = '';
        if (addCategoryBtn.nextElementSibling.style.display == 'none') {
            addCategoryBtn.nextElementSibling.style.display = 'block';
            addCategoryBtn.type = 'submit';
        }
        else if (addCategoryBtn.nextElementSibling.style.display == 'block' && addCategoryBtn.type == 'button') {
            // addCategoryBtn.click();
        }
    })
}


let criteriaDropdown = document.getElementById('criteria-dropdown');
let criteriaDropdownBtn = document.getElementById('criteria');
let criteriaOptions = document.querySelectorAll('input[name="criteria_radio"]');

criteriaOptions.forEach((option) => {
    option.addEventListener('change', async function() {
        if(this.checked) {
            document.getElementById('selected-criteria').innerText = this.nextElementSibling.innerText;
            let token = getCookie('admin_access');
            let headers = {
                "Authorization": `Bearer ${token}`
            }
            let formData = new FormData();
            let status = true;
            if (this.value == 'active') {
                status = true;
            }
            else {
                status = false;
            }
            formData.append('is_active', status);
            let response = await requestAPI(`${apiURL}/admin/products/${specific_prod_id}`, formData, headers, 'PATCH');
            response.json().then(function(res) {
                // console.log(res);
                if (response.status == 200) {
                    if (res.data.is_active == true)
                        document.getElementById('specific-prod-current-state').innerText = 'ACTIVE';
                    else
                        document.getElementById('specific-prod-current-state').innerText = 'INACTIVE';
                }
            })
        }
    })
})

criteriaDropdownBtn.addEventListener('click', (event) => {
    // if (!document.getElementById('overlay-identification')) {
    //     let overlay = document.createElement('span');
    //     overlay.className = 'screen-darken';
    //     overlay.id = 'overlay-identification';
    //     document.body.appendChild(overlay);
    // }
    // else {
    //     document.getElementById('overlay-identification').remove();
    // }
    toggleDropdown(event);
});



function toggleDropdown(event) {
    // console.log('in toggle', event.target);
    let elementBtn = event.target;
    if(!elementBtn.classList.contains('filter-btn')) {
        elementBtn = elementBtn.closest('.filter-btn');
    }
    let elementDropdown = elementBtn.nextElementSibling;
    if(elementDropdown.style.display == 'flex') {
        elementDropdown.style.display = 'none';
    }
    else {
        elementDropdown.style.display = 'flex';
    }
    document.querySelector('.cat-name-msg').classList.remove('active');
    document.querySelector('.cat-name-msg').innerText = '';
}


let insightDiv = document.getElementById('insight-div');
let insightDropdown = document.getElementById('insight-dropdown');

function toggleInsightDropdown() {
    if (insightDropdown.style.display == 'none') {
        insightDropdown.style.display = 'flex';
    }
    else {
        insightDropdown.style.display = 'none';
    }
}


async function selectInsightTime(event) {
    let element = event.target;
    let elementValue = element.getAttribute('data-value');
    let token = getCookie('admin_access');
    let headers = {
        "Authorization": `Bearer ${token}`
    };

    try {
        let url = `${apiURL}/admin/products/${specific_prod_id}`;
        if (elementValue.length > 0) {
            url += `?insight_days=${elementValue}`;
        }
        let response = await requestAPI(url, null, headers, 'GET');
        let res = await response.json();

        if (response.status === 200) {
            document.getElementById('insight-stat').innerText = res.data.insights;
        }
        document.getElementById('selected-insight').innerText = element.innerText;
    } catch (err) {
        console.error(err);
    }
}


function closeDropdowns(event) {
    let closestForm = event.target.closest('form');
    // if (document.getElementById('overlay-identification').contains(event.target)) {
    // }
    if ((!criteriaDropdownBtn.contains(event.target)) && criteriaDropdown.style.display == 'flex') {
        criteriaDropdown.style.display = 'none';
        if (document.getElementById('overlay-identification')) {
            document.getElementById('overlay-identification').remove();
        }
    }
    else if ((!skinTypeDropdownBtn.contains(event.target)) && skinTypeDropdown.style.display == 'flex') {
        skinTypeDropdown.style.display = 'none';
    }
    else if ((!productCategoryDropdownBtn.contains(event.target)) && productCategoryDropdown.style.display == 'flex') {
        if (closestForm == null) {
            productCategoryDropdown.style.display = 'none';
            addCategoryBtn.type == 'button';
        }
    }
    else if ((!insightDiv.contains(event.target) && insightDropdown.style.display == 'flex')) {
        insightDropdown.style.display = 'none';
    }
    document.querySelector('.cat-name-msg').classList.remove('active');
    document.querySelector('.cat-name-msg').innerText = '';
}

document.body.addEventListener('click', closeDropdowns);



let editDescriptionBtn = document.getElementById('edit-product-descriptions');
let updateDescriptionBtnWrapper = document.getElementById('description-update-btn');
editDescriptionBtn.addEventListener('click', toggleDescriptionInputs)

function toggleDescriptionInputs() {
    if (updateDescriptionBtnWrapper.classList.contains('hide')) {
        updateDescriptionBtnWrapper.classList.remove('hide');
        document.getElementById('product-description-wrapper').querySelectorAll('input').forEach((input) => input.readOnly = false);
        document.getElementById('product-description-wrapper').querySelector('textarea').readOnly = false;
        document.getElementById('product-description-wrapper').setAttribute('onsubmit', `updateProductDescriptions(event, ${specific_prod_id})`);
    }
    else {
        updateDescriptionBtnWrapper.classList.add('hide');
        document.getElementById('product-description-wrapper').querySelectorAll('input').forEach((input) => input.readOnly = true);
        document.getElementById('product-description-wrapper').querySelector('textarea').readOnly = true;
        document.getElementById('product-description-wrapper').setAttribute('onsubmit', `updateProductDescriptions(event)`);
    }
}


let editInventoryBtn = document.getElementById('edit-product-inventory');
let updateInventoryBtnWrapper = document.getElementById('update-product-inventory-wrapper');
editInventoryBtn.addEventListener('click', toggleInventoryInputs);

function toggleInventoryInputs() {
    if (updateInventoryBtnWrapper.classList.contains('hide')) {
        updateInventoryBtnWrapper.classList.remove('hide');
        // document.getElementById('specific-product-inventory-details').querySelectorAll('input').forEach((input) => input.readOnly = false);
        document.getElementById('specific-product-inventory-details').querySelector('input[name="sku_num"]').readOnly = false;
        document.getElementById('specific-product-inventory-wrapper').setAttribute('onsubmit', `updateProductInventory(event, ${specific_prod_id})`);
    }
    else {
        updateInventoryBtnWrapper.classList.add('hide');
        // document.getElementById('specific-product-inventory-details').querySelectorAll('input').forEach((input) => input.readOnly = true);
        document.getElementById('specific-product-inventory-details').querySelector('input[name="sku_num"]').readOnly = true;
        document.getElementById('specific-product-inventory-wrapper').removeAttribute('onsubmit');
    }
}


let editShippingBtn = document.getElementById('edit-product-shipping');
let updateShippingBtnWrapper = document.getElementById('update-product-shipping-wrapper');
editShippingBtn.addEventListener('click', toggleShippingInputs);

function toggleShippingInputs() {
    if (updateShippingBtnWrapper.classList.contains('hide')) {
        updateShippingBtnWrapper.classList.remove('hide');
        document.getElementById('specific-product-shipping-details').querySelectorAll('input').forEach((input) => input.readOnly = false);
        document.getElementById('specific-product-shipping-form').setAttribute('onsubmit', `updateShippingSizes(event, ${specific_prod_id})`);
    }
    else {
        updateShippingBtnWrapper.classList.add('hide');
        document.getElementById('specific-product-shipping-details').querySelectorAll('input').forEach((input) => input.readOnly = true);
        document.getElementById('specific-product-shipping-form').setAttribute('onsubmit', `updateShippingSizes(event)`);
    }
}


// function previewImage(event) {
//     let imageInput = event.currentTarget;
//     let image = imageInput.files;
//     let imageTag = imageInput.closest('label').querySelector('.product-image');
//     let svgIcon = imageInput.closest('label').querySelector('svg');
//     let spanText = imageInput.closest('label').querySelector('span');
//     if (svgIcon) {
//         svgIcon.style.display = 'none';
//     }
//     if (spanText) {
//         spanText.style.display = 'none';
//     }
//     imageTag.closest('label').classList.remove('label-border');
//     imageTag.src = window.URL.createObjectURL(image[0]);
//     imageTag.classList.remove('hide');
// }

function previewImage(event, input) {
    let label = input.closest('label');
    const img = document.createElement('img');
    const selectedImage = input.files[0];
    const objectURL = URL.createObjectURL(selectedImage);
    let imageTag = label.querySelector('.product-image');
    let svgIcon = label.querySelector('svg');

    img.onload = function handleLoad() {

        if (img.width == supportedImageWidth && img.height == supportedImageHeight) {
            imageTag.src = objectURL;
            imageTag.classList.remove('hide');
            label.querySelector('svg').style.display = 'none';
            label.querySelectorAll('span').forEach((span) => {
                span.style.display = 'none';
            })
            document.querySelector('.error-div').classList.add('hide');
            document.querySelector('.upload-image-error-msg').classList.remove('active');
            document.querySelector('.upload-image-error-msg').innerText = "";
        }
        else {
            URL.revokeObjectURL(objectURL);
            if (imageTag.getAttribute('data-src') == "0") {
                imageTag.classList.add('hide');
                svgIcon.style.display = 'block';
                label.querySelectorAll('span').forEach((span) => {
                    span.style.display = 'block';
                })
            }
            document.querySelector('.error-div').classList.remove('hide');
            document.querySelector('.upload-image-error-msg').classList.add('active');
            document.querySelector('.upload-image-error-msg').innerText = `Image does not match supported dimensions: ${supportedImageWidth}x${supportedImageHeight} px`;
            input.value = null;
        }
    };
    img.src = objectURL;
}

async function uploadImage(event, inputFieldName, oldImageID=null) {
    event.preventDefault();
    
    let imageFile = document.querySelector(`input[name='${inputFieldName}']`);
    if (imageFile.files[0]) {
        let token = getCookie('admin_access');
        let headers = {
            "Authorization": `Bearer ${token}`
        }
        let formData = new FormData();
        if (oldImageID != 'null') {
            let del_images = [oldImageID];
            formData.append('del_images', del_images);
        }
        formData.append('images', imageFile.files[0]);
        let imagesWrapper = document.getElementById('specific-product-media-images');
        imagesWrapper.innerHTML = '<div class="w-100 d-flex justify-content-center align-items-center pt-2 pb-2"><span class="spinner-border spinner-border-md" style="color: #000093;" role="status" aria-hidden="true"></span></div>';
        document.querySelector('.error-div').classList.add('hide');
        document.querySelector('.upload-image-error-msg').classList.remove('active');
        document.querySelector('.upload-image-error-msg').innerText = "";
        let response = await requestAPI(`${apiURL}/admin/products/${specific_prod_id}`, formData, headers, 'PATCH');
        response.json().then(async function(res) {
            if (response.status == 200) {
                let responseImages = await requestAPI('/get-product-images/', JSON.stringify(res.data), {}, 'POST');
                responseImages.json().then(function(resImg) {
                    imagesWrapper.innerHTML = resImg.product_images;
                })
            }
        })
    }
}


async function delImage(event, imageID) {
    event.preventDefault();
    if (imageID != null || imageID != 'null') {
        let del_images = [imageID];

        let modal = document.querySelector(`#delModal`);
        let form = modal.querySelector('form');
        form.setAttribute("onsubmit", `delForm(event, ${specific_prod_id}, 'products', ${del_images}, 'PATCH')`);
        modal.querySelector('#modal-header-text').innerText = 'Delete Product Image';
        modal.querySelector('#warning-statement').innerText = 'Are you sure you want to delete this product image?';
        modal.addEventListener('hidden.bs.modal', event => {
            form.reset();
            form.removeAttribute("onsubmit");
            modal.querySelector('#modal-header-text').innerText = '';
            modal.querySelector('#warning-statement').innerText = '';
            modal.querySelector('.btn-text').innerText = 'DELETE';
        })
        document.querySelector(`.delModal`).click();
    }
}


async function addCategoryForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let catNameField = form.querySelector('input[name="name"]');
    let catNameMsg = form.querySelector('.cat-name-msg');
    let formData = new FormData(form);
    let data = formDataToObject(formData);
    if(!isValidName(catNameField)) {
        catNameMsg.classList.add('active');
        return false;
    }
    else {
        catNameMsg.classList.remove('active');
        catNameMsg.classList.innerText = '';
        try {
            let token = getCookie('admin_access');
            let headers = {
                "Authorization": `Bearer ${token}`
            }
            let response = await requestAPI(`${apiURL}/admin/categories`, formData, headers, 'POST');
            response.json().then(function(res) {
                if (response.status == 201) {
                    productCategoryDropdown.innerHTML += `<div class="radio-btn" id="prod-cat${res.data.id}">
                                                            <input onchange="selectProductCategory(event);" id="cat-${res.data.id}" data-id="${res.data.id}" type="radio" value="${res.data.name}" name="specific_product_category_radio" />
                                                            <label for="cat-${res.data.id}" class="radio-label">
                                                                <span>${res.data.name}</span>
                                                                <svg class="del-icon" onclick="delCategory(event, ${res.data.id});" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                                    <path d="M8.3369 9.16667V14.1667M11.6709 9.16667V14.1667M3.33594 5.83333H16.6718M15.8383 5.83333L15.1157 15.9517C15.0858 16.3722 14.8976 16.7657 14.589 17.053C14.2805 17.3403 13.8745 17.5 13.4529 17.5H6.55489C6.13326 17.5 5.72729 17.3403 5.41874 17.053C5.1102 16.7657 4.92201 16.3722 4.89207 15.9517L4.16943 5.83333H15.8383ZM12.5044 5.83333V3.33333C12.5044 3.11232 12.4165 2.90036 12.2602 2.74408C12.1039 2.5878 11.8919 2.5 11.6709 2.5H8.3369C8.11584 2.5 7.90384 2.5878 7.74753 2.74408C7.59122 2.90036 7.5034 3.11232 7.5034 3.33333V5.83333H12.5044Z" stroke="#CF0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                                </svg>
                                                            </label>
                                                        </div>`
                }
            })
            initializeDropdowns();
        }
        catch (err) {
            console.log(err);
        }
    }
}


async function delForm(event, id, type, data=null, method='DELETE') {
    event.preventDefault();
    if (data != null) {
        temp = data;
        data = new FormData();
        data.append('del_images', temp);
    }
    let form = event.currentTarget;
    let button = form.querySelector('button[type="submit"]');
    let buttonText = button.innerText;
    let token = getCookie('admin_access');
    let headers = {
        "Authorization": `Bearer ${token}`
    };
    try {
        beforeLoad(button);
        let response = await requestAPI(`${apiURL}/admin/${type}/${id}`, data, headers, method);
        if (response.status == 204) {
            form.reset();
            form.removeAttribute("onsubmit");
            afterLoad(button, 'DELETED');
            setTimeout(() => {
                document.querySelector('.delModal').click();
            }, 1000)
            if (type == 'categories') {
                let divToDelete = document.getElementById(`prod-cat${id}`);
                let selectedCat = document.getElementById('selected-specific-product-category');
                let deletedCat = document.getElementById(`cat-${id}`);
                if (selectedCat.innerText == deletedCat.value) {
                    selectedCat.innerText = '';
                }
                divToDelete.remove();
            }
        }
        else if (response.status == 200) {
            response.json().then(async function(res) {
                form.reset();
                form.removeAttribute("onsubmit");
                afterLoad(button, 'DELETED');
                setTimeout(() => {
                    document.querySelector('.delModal').click();
                }, 1000)
                let imagesWrapper = document.getElementById('specific-product-media-images');
                imagesWrapper.innerHTML = '<div class="w-100 d-flex justify-content-center align-items-center pt-2 pb-2"><span class="spinner-border spinner-border-md" style="color: #000093;" role="status" aria-hidden="true"></span></div>';
                let responseImages = await requestAPI('/get-product-images/', JSON.stringify(res.data), {}, 'POST');
                responseImages.json().then(function(resImg) {
                    imagesWrapper.innerHTML = resImg.product_images;
                })
            })
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


async function delCategory(event, id) {
    event.preventDefault();
    event.stopPropagation();
    let modal = document.querySelector(`#delModal`);
    let form = modal.querySelector('form');
    form.setAttribute("onsubmit", `delForm(event, ${id}, 'categories')`);
    modal.querySelector('#modal-header-text').innerText = 'Delete Product Category';
    modal.querySelector('#warning-statement').innerText = 'Are you sure you want to delete this product category?';
    modal.addEventListener('hidden.bs.modal', event => {
        form.reset();
        form.removeAttribute("onsubmit");
        modal.querySelector('#modal-header-text').innerText = '';
        modal.querySelector('#warning-statement').innerText = '';
        modal.querySelector('.btn-text').innerText = 'DELETE';
    })
    document.querySelector(`.delModal`).click();
}


async function updateProductDescriptions(event, id=null) {
    event.preventDefault();
    if (id != null) {
        let form = event.currentTarget;
        let errorMsg = document.querySelector('.update-product-error-msg');
        let button = form.querySelector('button[type="submit"]');
        let formData = new FormData(form);
        let data = formDataToObject(formData);
        if (data.skin_type_radio == null) {
            skinTypeOptions.forEach((option) => {
                if (option.value == document.querySelector('#selected-skin-type').innerText) {
                    formData.append('skin_type', option.getAttribute('data-id'));    
                }
            })
        }
        else {
            skinTypeOptions.forEach((option) => {
                if (option.value == data.skin_type_radio) {
                    formData.append('skin_type', option.getAttribute('data-id'));
                }
            })
        }
        formData.delete('skin_type_radio');
        let token = getCookie('admin_access');
        let headers = {
            "Authorization": `Bearer ${token}`
        }
        
        errorMsg.innerText = '';
        errorMsg.classList.remove('active');
        
        beforeLoad(button);
        let response = await requestAPI(`${apiURL}/admin/products/${specific_prod_id}`, formData, headers, 'PATCH');
        response.json().then(function(res) {
            if (response.status == 200) {
                afterLoad(button, 'SAVED');
                setTimeout(() => {
                    afterLoad(button, 'SAVE');
                }, 1000);
                toggleDescriptionInputs();
            }
            else {
                errorMsg.classList.add('active');
                displayMessages(res.messages, errorMsg);
                afterLoad(button, 'Error');
            }
        })
    }
}


async function updateProductInventory(event, id) {
    event.preventDefault();
    if(id != null) {
        let form = event.currentTarget;
        let button = form.querySelector('button[type="submit"]');
        let formData = new FormData(form);
        let data = formDataToObject(formData);
        let token = getCookie('admin_access');
        let headers = {
            "Authorization": `Bearer ${token}`,
            "Content-Type": 'application/json'
        }
        beforeLoad(button);
        let response = await requestAPI(`${apiURL}/admin/products/${specific_prod_id}`, JSON.stringify(data), headers, 'PATCH');
        response.json().then(function(res) {
            if (response.status == 200) {
                afterLoad(button, 'SAVED');
                setTimeout(() => {
                    afterLoad(button, 'SAVE');
                }, 1000);
                toggleInventoryInputs();
            }
            else {
                afterLoad(button, 'Error');
            }
        })
    }
}


async function updateShippingSizes(event, id) {
    event.preventDefault();
    if(id != null) {
        let form = event.currentTarget;
        let button = form.querySelector('button[type="submit"]');
        let formData = new FormData(form);
        let data = formDataToObject(formData);
        let token = getCookie('admin_access');
        let headers = {
            "Authorization": `Bearer ${token}`,
            "Content-Type": 'application/json'
        }
        beforeLoad(button);
        let response = await requestAPI(`${apiURL}/admin/products/${specific_prod_id}`, JSON.stringify(data), headers, 'PATCH');
        response.json().then(function(res) {
            if (response.status == 200) {
                afterLoad(button, 'SAVED');
                setTimeout(() => {
                    afterLoad(button, 'SAVE');
                }, 1000);
                toggleShippingInputs();
            }
            else {
                afterLoad(button, 'Error');
            }
        })
    }
}