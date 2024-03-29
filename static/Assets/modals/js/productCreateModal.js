let addCategoryBtn = document.getElementById('add-category-btn');
let addTypeBtn = document.getElementById('add-type-btn');
let addSkinTypeBtn = document.getElementById('add-skin-btn');
let supportedImageWidth = 1000;
let supportedImageHeight = 1000;


async function populateModalDropdowns() {
    let productCategoryDropdown = document.querySelector('#product-category-dropdown');
    let productTypeDropdown = document.querySelector('#product-type-dropdown');
    let skinTypeDropdown = document.querySelector('#skin-type-dropdown');
    let token = getCookie("admin_access");
    let headers = {
        "Authorization": `Bearer ${token}`,
    };
    let responseProductCategory = await requestAPI(`${apiURL}/admin/categories?perPage=1000`, null, headers, 'GET');
    let responseProductType = await requestAPI(`${apiURL}/admin/product-types?perPage=1000`, null, headers, 'GET');
    let responseSkinTypes = await requestAPI(`${apiURL}/admin/skin-types?perPage=1000`, null, headers, 'GET');
    responseProductCategory.json().then(function(res) {
        let productCategories = [...res.data];
        productCategories.forEach((prodCat) => {
            productCategoryDropdown.innerHTML += `<div class="radio-btn" id="prod-cat${prodCat.id}">
                                                        <input onchange="selectProductCategory(event);" id="cat-${prodCat.id}" data-id="${prodCat.id}" type="radio" value="${prodCat.name}" name="product_category_radio" />
                                                        <label for="cat-${prodCat.id}" class="radio-label">
                                                            <span>${prodCat.name}</span>
                                                            <svg class="del-icon" onclick="delCategory(event, ${prodCat.id});" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                                <path d="M8.3369 9.16667V14.1667M11.6709 9.16667V14.1667M3.33594 5.83333H16.6718M15.8383 5.83333L15.1157 15.9517C15.0858 16.3722 14.8976 16.7657 14.589 17.053C14.2805 17.3403 13.8745 17.5 13.4529 17.5H6.55489C6.13326 17.5 5.72729 17.3403 5.41874 17.053C5.1102 16.7657 4.92201 16.3722 4.89207 15.9517L4.16943 5.83333H15.8383ZM12.5044 5.83333V3.33333C12.5044 3.11232 12.4165 2.90036 12.2602 2.74408C12.1039 2.5878 11.8919 2.5 11.6709 2.5H8.3369C8.11584 2.5 7.90384 2.5878 7.74753 2.74408C7.59122 2.90036 7.5034 3.11232 7.5034 3.33333V5.83333H12.5044Z" stroke="#CF0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                            </svg>
                                                        </label>
                                                    </div>`
        })
    })
    responseProductType.json().then(function(res) {
        let productTypes = [...res.data];
        productTypes.forEach((prodType) => {
            productTypeDropdown.innerHTML += `<div class="radio-btn" id="prod-type${prodType.id}">
                                                    <input onchange="selectProductType(event);" id="type-${prodType.id}" data-id="${prodType.id}" type="radio" value="${prodType.name}" name="product_type_radio" />
                                                    <label for="type-${prodType.id}" class="radio-label">
                                                        <span>${prodType.name}</span>
                                                        <svg class="del-icon" onclick="delType(event, ${prodType.id});" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                            <path d="M8.3369 9.16667V14.1667M11.6709 9.16667V14.1667M3.33594 5.83333H16.6718M15.8383 5.83333L15.1157 15.9517C15.0858 16.3722 14.8976 16.7657 14.589 17.053C14.2805 17.3403 13.8745 17.5 13.4529 17.5H6.55489C6.13326 17.5 5.72729 17.3403 5.41874 17.053C5.1102 16.7657 4.92201 16.3722 4.89207 15.9517L4.16943 5.83333H15.8383ZM12.5044 5.83333V3.33333C12.5044 3.11232 12.4165 2.90036 12.2602 2.74408C12.1039 2.5878 11.8919 2.5 11.6709 2.5H8.3369C8.11584 2.5 7.90384 2.5878 7.74753 2.74408C7.59122 2.90036 7.5034 3.11232 7.5034 3.33333V5.83333H12.5044Z" stroke="#CF0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                        </svg>
                                                    </label>
                                                </div>`
        })
    })
    responseSkinTypes.json().then(function(res) {
        let skinTypes = [...res.data];
        skinTypes.forEach((skinType) => {
            skinTypeDropdown.innerHTML += `<div class="radio-btn" id="skin-type${skinType.id}">
                                                <input onchange="selectSkinType(event);" id="skin-${skinType.id}" data-id="${skinType.id}" type="radio" value="${skinType.name}" name="skin_type_radio" />
                                                <label for="skin-${skinType.id}" class="radio-label">
                                                    <span>${skinType.name}</span>
                                                    <svg class="del-icon" onclick="delSkinType(event, ${skinType.id});" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                        <path d="M8.3369 9.16667V14.1667M11.6709 9.16667V14.1667M3.33594 5.83333H16.6718M15.8383 5.83333L15.1157 15.9517C15.0858 16.3722 14.8976 16.7657 14.589 17.053C14.2805 17.3403 13.8745 17.5 13.4529 17.5H6.55489C6.13326 17.5 5.72729 17.3403 5.41874 17.053C5.1102 16.7657 4.92201 16.3722 4.89207 15.9517L4.16943 5.83333H15.8383ZM12.5044 5.83333V3.33333C12.5044 3.11232 12.4165 2.90036 12.2602 2.74408C12.1039 2.5878 11.8919 2.5 11.6709 2.5H8.3369C8.11584 2.5 7.90384 2.5878 7.74753 2.74408C7.59122 2.90036 7.5034 3.11232 7.5034 3.33333V5.83333H12.5044Z" stroke="#CF0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                    </svg>
                                                </label>
                                            </div>`
        })
    })
}


async function openProductCreateModal(modalID) {
    let modal = document.querySelector(`#${modalID}`);
    let form = modal.querySelector("#add-product-form");
    form.setAttribute("onsubmit", `createProductForm(event)`);
    document.querySelector('.cat-name-msg').classList.remove('active');
    document.querySelector('.cat-name-msg').innerText = '';
    document.querySelector('.type-name-msg').classList.remove('active');
    document.querySelector('.type-name-msg').innerText = '';
    document.querySelector('.skin-type-msg').classList.remove('active');
    document.querySelector('.skin-type-msg').innerText = '';
    document.querySelector('.create-error-msg').classList.remove('active');
    document.querySelector('.create-error-msg').innerText = '';
    form.querySelector('.btn-text').innerText = 'CREATE';
    modal.addEventListener('hidden.bs.modal', event => {
        form.reset();
        document.getElementById('selected-product-category').innerText = 'Product Category';
        document.getElementById('selected-product-category').style.color = '#A9A9A9';
        document.getElementById('selected-product-type').innerText = 'Product Type';
        document.getElementById('selected-product-type').style.color = '#A9A9A9';
        document.getElementById('selected-skin-type').innerText = 'Skin Type';
        document.getElementById('selected-skin-type').style.color = '#A9A9A9';
        modal.querySelectorAll('.product-image-label').forEach((label) => {
            label.querySelector('img').classList.add('hide');
            label.querySelector('img').src = '';
            label.querySelector('svg').style.display = 'block';
            label.querySelector('span').style.display = 'block';
        })
    })
    document.querySelector(`.${modalID}`).click();
}


function toggleDropdown(event) {
    document.querySelector('.cat-name-msg').classList.remove('active');
    document.querySelector('.cat-name-msg').innerText = '';
    document.querySelector('.type-name-msg').classList.remove('active');
    document.querySelector('.type-name-msg').innerText = '';
    document.querySelector('.skin-type-msg').classList.remove('active');
    document.querySelector('.skin-type-msg').innerText = '';
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
}

function getNewCatInput() {
    document.querySelector('.cat-name-msg').classList.remove('active');
    document.querySelector('.cat-name-msg').innerText = '';
    let inputField = document.getElementById('add-category-inp');
    if (inputField.style.display == 'block') {
        const newEvent = new KeyboardEvent('keypress', {
            key: 'Enter',
            code: 'Enter',
            which: 13,
            keyCode: 13,
        });
        inputField.dispatchEvent(newEvent);
    }
    else {
        document.getElementById('add-category-inp').style.display = 'block';
    }
}


function getNewTypeInput() {
    document.querySelector('.type-name-msg').classList.remove('active');
    document.querySelector('.type-name-msg').innerText = '';
    let inputField = document.getElementById('add-type-inp');
    if (inputField.style.display == 'block') {
        const newEvent = new KeyboardEvent('keypress', {
            key: 'Enter',
            code: 'Enter',
            which: 13,
            keyCode: 13,
        });
        inputField.dispatchEvent(newEvent);
    }
    else {
        document.getElementById('add-type-inp').style.display = 'block';
    }
}


function getNewSkinTypeInput() {
    document.querySelector('.skin-type-msg').classList.remove('active');
    document.querySelector('.skin-type-msg').innerText = '';
    let inputField = document.getElementById('add-skin-inp');
    if (inputField.style.display == 'block') {
        const newEvent = new KeyboardEvent('keypress', {
            key: 'Enter',
            code: 'Enter',
            which: 13,
            keyCode: 13,
        });
        inputField.dispatchEvent(newEvent);
    }
    else {
        document.getElementById('add-skin-inp').style.display = 'block';
    }
}


async function getCatField(event) {
    if (event.key == "Enter") {
        event.preventDefault();
        let catNameField = document.getElementById('add-category-inp');
        let catNameMsg = document.querySelector('.cat-name-msg');
        if(!isValidName(catNameField)) {
            catNameMsg.classList.add('active');
            return false;
        }
        else {
            document.querySelector('.cat-name-msg').classList.remove('active');
            document.querySelector('.cat-name-msg').innerText = '';
            let formData = new FormData();
            formData.append('name', catNameField.value);
            let data = formDataToObject(formData);
            // console.log(data);
            try {
                let token = getCookie('admin_access');
                let headers = {
                    "Authorization": `Bearer ${token}`
                }
                let response = await requestAPI(`${apiURL}/admin/categories`, formData, headers, 'POST');
                response.json().then(function(res) {
                    // console.log(res);
                    productCategoryDropdown.innerHTML += `<div class="radio-btn" id="prod-cat${res.data.id}">
                                                            <input onchange="selectProductCategory(event);" id="cat-${res.data.id}" data-id="${res.data.id}" type="radio" value="${res.data.name}" name="product_category_radio" />
                                                            <label for="cat-${res.data.id}" class="radio-label">
                                                                <span>${res.data.name}</span>
                                                                <svg class="del-icon" onclick="delCategory(event, ${res.data.id});" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                                    <path d="M8.3369 9.16667V14.1667M11.6709 9.16667V14.1667M3.33594 5.83333H16.6718M15.8383 5.83333L15.1157 15.9517C15.0858 16.3722 14.8976 16.7657 14.589 17.053C14.2805 17.3403 13.8745 17.5 13.4529 17.5H6.55489C6.13326 17.5 5.72729 17.3403 5.41874 17.053C5.1102 16.7657 4.92201 16.3722 4.89207 15.9517L4.16943 5.83333H15.8383ZM12.5044 5.83333V3.33333C12.5044 3.11232 12.4165 2.90036 12.2602 2.74408C12.1039 2.5878 11.8919 2.5 11.6709 2.5H8.3369C8.11584 2.5 7.90384 2.5878 7.74753 2.74408C7.59122 2.90036 7.5034 3.11232 7.5034 3.33333V5.83333H12.5044Z" stroke="#CF0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                                </svg>
                                                            </label>
                                                        </div>`
                })
            }
            catch (err) {
                console.log(err);
            }
        }
    }
}


async function getTypeField(event) {
    if (event.key == "Enter") {
        event.preventDefault();
        let typeNameField = document.getElementById('add-type-inp');
        let typeNameMsg = document.querySelector('.type-name-msg');
        if(!isValidName(typeNameField)) {
            typeNameMsg.classList.add('active');
            return false;
        }
        else {
            typeNameMsg.classList.remove('active');
            typeNameMsg.innerText = '';
            let formData = new FormData();
            formData.append('name', typeNameField.value);
            let data = formDataToObject(formData);
            // console.log(data);
            try {
                let token = getCookie('admin_access');
                let headers = {
                    "Authorization": `Bearer ${token}`
                }
                let response = await requestAPI(`${apiURL}/admin/product-types`, formData, headers, 'POST');
                response.json().then(function(res) {
                    // console.log(res);
                    productTypeDropdown.innerHTML += `<div class="radio-btn" id="prod-type${res.data.id}">
                                                            <input onchange="selectProductType(event);" id="type-${res.data.id}" data-id="${res.data.id}" type="radio" value="${res.data.name}" name="product_type_radio" />
                                                            <label for="type-${res.data.id}" class="radio-label">
                                                                <span>${res.data.name}</span>
                                                                <svg class="del-icon" onclick="delType(event, ${res.data.id});" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                                    <path d="M8.3369 9.16667V14.1667M11.6709 9.16667V14.1667M3.33594 5.83333H16.6718M15.8383 5.83333L15.1157 15.9517C15.0858 16.3722 14.8976 16.7657 14.589 17.053C14.2805 17.3403 13.8745 17.5 13.4529 17.5H6.55489C6.13326 17.5 5.72729 17.3403 5.41874 17.053C5.1102 16.7657 4.92201 16.3722 4.89207 15.9517L4.16943 5.83333H15.8383ZM12.5044 5.83333V3.33333C12.5044 3.11232 12.4165 2.90036 12.2602 2.74408C12.1039 2.5878 11.8919 2.5 11.6709 2.5H8.3369C8.11584 2.5 7.90384 2.5878 7.74753 2.74408C7.59122 2.90036 7.5034 3.11232 7.5034 3.33333V5.83333H12.5044Z" stroke="#CF0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                                </svg>
                                                            </label>
                                                        </div>`
                })
            }
            catch (err) {
                console.log(err);
            }
        }
    }
}


async function getSkinField(event) {
    if (event.key == "Enter") {
        event.preventDefault();
        let skinTypeNameField = document.getElementById('add-skin-inp');
        let skinTypeNameMsg = document.querySelector('.skin-type-msg');
        if(!isValidName(skinTypeNameField)) {
            skinTypeNameMsg.classList.add('active');
            return false;
        }
        else {
            skinTypeNameMsg.classList.remove('active');
            skinTypeNameMsg.innerText = '';
            let formData = new FormData();
            formData.append('name', skinTypeNameField.value);
            let data = formDataToObject(formData);
            // console.log(data);
            try {
                let token = getCookie('admin_access');
                let headers = {
                    "Authorization": `Bearer ${token}`
                }
                let response = await requestAPI(`${apiURL}/admin/skin-types`, formData, headers, 'POST');
                response.json().then(function(res) {
                    // console.log(res);
                    skinTypeDropdown.innerHTML += `<div class="radio-btn" id="skin-type${res.data.id}">
                                                            <input onchange="selectSkinType(event);" id="skin-${res.data.id}" data-id="${res.data.id}" type="radio" value="${res.data.name}" name="skin_type_radio" />
                                                            <label for="skin-${res.data.id}" class="radio-label">
                                                                <span>${res.data.name}</span>
                                                                <svg class="del-icon" onclick="delSkinType(event, ${res.data.id});" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                                    <path d="M8.3369 9.16667V14.1667M11.6709 9.16667V14.1667M3.33594 5.83333H16.6718M15.8383 5.83333L15.1157 15.9517C15.0858 16.3722 14.8976 16.7657 14.589 17.053C14.2805 17.3403 13.8745 17.5 13.4529 17.5H6.55489C6.13326 17.5 5.72729 17.3403 5.41874 17.053C5.1102 16.7657 4.92201 16.3722 4.89207 15.9517L4.16943 5.83333H15.8383ZM12.5044 5.83333V3.33333C12.5044 3.11232 12.4165 2.90036 12.2602 2.74408C12.1039 2.5878 11.8919 2.5 11.6709 2.5H8.3369C8.11584 2.5 7.90384 2.5878 7.74753 2.74408C7.59122 2.90036 7.5034 3.11232 7.5034 3.33333V5.83333H12.5044Z" stroke="#CF0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                                </svg>
                                                            </label>
                                                        </div>`
                })
            }
            catch (err) {
                console.log(err);
            }
        }
    }
}


async function delForm(event, id, type) {
    event.preventDefault();
    let form = event.currentTarget;
    let button = form.querySelector('button[type="submit"]');
    let buttonText = button.innerText;
    let token = getCookie('admin_access');
    let headers = {
        "Authorization": `Bearer ${token}`
    };
    try {
        beforeLoad(button);
        let response = await requestAPI(`${apiURL}/admin/${type}/${id}`, null, headers, 'DELETE');
        if (response.status == 204) {
            form.reset();
            form.removeAttribute("onsubmit");
            afterLoad(button, 'DELETED');
            setTimeout(() => {
                document.querySelector('.delModal').click();
            }, 1000)
            if (type == 'categories') {
                let divToDelete = document.getElementById(`prod-cat${id}`);
                let selectedCat = document.getElementById('selected-product-category');
                let deletedCat = document.getElementById(`cat-${id}`);
                if (selectedCat.innerText == deletedCat.value) {
                    selectedCat.innerText = '';
                }
                divToDelete.remove();
            }
            else if (type == 'product-types') {
                let divToDelete = document.getElementById(`prod-type${id}`);
                let selectedType = document.getElementById('selected-product-type');
                let deletedType = document.getElementById(`type-${id}`);
                if (selectedType.innerText == deletedType.value) {
                    selectedType.innerText = '';
                }
                divToDelete.remove();
            }
            else if (type == 'skin-types') {
                let divToDelete = document.getElementById(`skin-type${id}`);
                let selectedType = document.getElementById('selected-skin-type');
                let deletedType = document.getElementById(`skin-${id}`);
                if (selectedType.innerText == deletedType.value) {
                    selectedType.innerText = '';
                }
                divToDelete.remove();
            }
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


async function delType(event, id) {
    event.preventDefault();
    event.stopPropagation();
    let modal = document.querySelector(`#delModal`);
    let form = modal.querySelector('form');
    form.setAttribute("onsubmit", `delForm(event, ${id}, 'product-types')`);
    modal.querySelector('#modal-header-text').innerText = 'Delete Product Type';
    modal.querySelector('#warning-statement').innerText = 'Are you sure you want to delete this product type?';
    modal.addEventListener('hidden.bs.modal', event => {
        form.reset();
        form.removeAttribute("onsubmit");
        modal.querySelector('#modal-header-text').innerText = '';
        modal.querySelector('#warning-statement').innerText = '';
        modal.querySelector('.btn-text').innerText = 'DELETE';
    })
    document.querySelector(`.delModal`).click();
}


async function delSkinType(event, id) {
    event.preventDefault();
    event.stopPropagation();
    let modal = document.querySelector(`#delModal`);
    let form = modal.querySelector('form');
    form.setAttribute("onsubmit", `delForm(event, ${id}, 'skin-types')`);
    modal.querySelector('#modal-header-text').innerText = 'Delete Skin Type';
    modal.querySelector('#warning-statement').innerText = 'Are you sure you want to delete this skin type?';
    modal.addEventListener('hidden.bs.modal', event => {
        form.reset();
        form.removeAttribute("onsubmit");
        modal.querySelector('#modal-header-text').innerText = '';
        modal.querySelector('#warning-statement').innerText = '';
        modal.querySelector('.btn-text').innerText = 'DELETE';
    })
    document.querySelector(`.delModal`).click();
}


function closeDropdowns(event) {
    let closestForm = event.target.closest('.add-btn');
    if((!productCategoryDropdownBtn.contains(event.target)) && productCategoryDropdown.style.display == 'flex') {
        if (closestForm == null) {
            productCategoryDropdown.style.display = 'none';
            addCategoryBtn.type == 'button';
        }
    }
    else if((!productTypeDropdownBtn.contains(event.target)) && productTypeDropdown.style.display == 'flex') {
        if (closestForm == null) {
            productTypeDropdown.style.display = 'none';
            addTypeBtn.type == 'button';
        }
    }
    else if((!skinTypeDropdownBtn.contains(event.target)) && skinTypeDropdown.style.display == 'flex') {
        if (closestForm == null) {
            skinTypeDropdown.style.display = 'none';
            addSkinTypeBtn.type == 'button'
        }
        // skinTypeDropdown.style.display = 'none';
    }
    
}

document.body.addEventListener('click', closeDropdowns);


productCategoryDropdownBtn.addEventListener('click', toggleDropdown);
productTypeDropdownBtn.addEventListener('click', toggleDropdown);
skinTypeDropdownBtn.addEventListener('click', toggleDropdown);


function selectProductCategory(event) {
    let inputElement = event.target;
    if(inputElement.checked) {
        document.getElementById('selected-product-category').innerText = inputElement.nextElementSibling.children[0].innerText;
        document.getElementById('selected-product-category').style.color = '#000';
    }
}


function selectProductType(event) {
    let inputElement = event.target;
    if(inputElement.checked) {
        document.getElementById('selected-product-type').innerText = inputElement.nextElementSibling.children[0].innerText;
        document.getElementById('selected-product-type').style.color = '#000';
    }
}


function selectSkinType(event) {
    let inputElement = event.target;
    if(inputElement.checked) {
        document.getElementById('selected-skin-type').innerText = inputElement.nextElementSibling.children[0].innerText;
        document.getElementById('selected-skin-type').style.color = '#000';
    }
}


// Old function without image dimension validation

// function previewImage(event) {
//     let imageInput = event.currentTarget;
//     let image = imageInput.files;
//     let imageTag = imageInput.closest('label').querySelector('.product-image');
//     imageTag.src = window.URL.createObjectURL(image[0]);
//     imageTag.classList.remove('hide');
//     imageInput.closest('label').querySelector('svg').style.display = 'none';
//     imageInput.closest('label').querySelector('span').style.display = 'none';
// }


// New function with image dimension validation

function previewImage(event, input) {
    let label = input.closest('label');
    const img = document.createElement('img');
    const selectedImage = input.files[0];
    const objectURL = URL.createObjectURL(selectedImage);
    let imageTag = label.querySelector('.product-image');

    img.onload = function handleLoad() {

        if (img.width == supportedImageWidth && img.height == supportedImageHeight) {
            imageTag.src = objectURL;
            imageTag.classList.remove('hide');
            label.querySelector('svg').style.display = 'none';
            label.querySelectorAll('span').forEach((span) => {
                span.style.display = 'none';
            })
            document.querySelector('.error-div').classList.add('hide');
            document.querySelector('.create-error-msg').classList.remove('active');
            document.querySelector('.create-error-msg').innerText = "";
        }
        else {
            URL.revokeObjectURL(objectURL);
            imageTag.classList.add('hide');
            label.querySelector('svg').style.display = 'block';
            label.querySelectorAll('span').forEach((span) => {
                span.style.display = 'block';
            })
            document.querySelector('.error-div').classList.remove('hide');
            document.querySelector('.create-error-msg').classList.add('active');
            document.querySelector('.create-error-msg').innerText = `Image does not match supported dimensions: ${supportedImageWidth}x${supportedImageHeight} px`;
            input.value = null;
        }
    };
    img.src = objectURL;
}


async function createProductForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let button = form.querySelector('button[type="submit"]');
    let formData = new FormData(form);
    let data = formDataToObject(formData);
    let errorMsg = form.querySelector('.create-error-msg');
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
    let prodBuyPageImg = form.querySelector('input[name="prod_buy_page_img"]');
    let prodDetailImg1 = form.querySelector('input[name="prod_detail_img_1"]');
    let prodDetailImg2 = form.querySelector('input[name="prod_detail_img_2"]');
    let prodDetailImg3 = form.querySelector('input[name="prod_detail_img_3"]');
    let prodDetailImg4 = form.querySelector('input[name="prod_detail_img_4"]');
    
    let atLeastOneImageSelected = false;
    if (prodBuyPageImg.files.length > 0) {
        formData.append('images', prodBuyPageImg.files[0]);
        atLeastOneImageSelected = true;
    }
    if (prodDetailImg1.files.length > 0) {
        formData.append('images', prodDetailImg1.files[0]);
        atLeastOneImageSelected = true;
    }
    if (prodDetailImg2.files.length > 0) {
        formData.append('images', prodDetailImg2.files[0]);
        atLeastOneImageSelected = true;
    }
    if (prodDetailImg3.files.length > 0) {
        formData.append('images', prodDetailImg3.files[0]);
        atLeastOneImageSelected = true;
    }
    if (prodDetailImg4.files.length > 0) {
        formData.append('images', prodDetailImg4.files[0]);
        atLeastOneImageSelected = true;
    }

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
    if(form.querySelector('input[name="title"]').value.trim().length == 0) {
        errorMsg.classList.add('active');
        errorMsg.innerText = 'Enter valid title'
        return false;
    }
    else if(form.querySelector('input[name="sku_num"]').value.trim().length == 0) {
        errorMsg.classList.add('active');
        errorMsg.innerText = 'Enter valid sku'
        return false;
    }
    else if(data.category == null) {
        errorMsg.classList.add('active');
        errorMsg.innerText = 'Select product category'
        return false;
    }
    else if(data.type == null) {
        errorMsg.classList.add('active');
        errorMsg.innerText = 'Select product type'
        return false;
    }
    else if(data.skin_type == null) {
        errorMsg.classList.add('active');
        errorMsg.innerText = 'Select skin type'
        return false;
    }
    else if(form.querySelector('input[name="short_description"]').value.trim().length == 0) {
        errorMsg.classList.add('active');
        errorMsg.innerText = 'Enter short description'
        return false;
    }
    else if(form.querySelector('input[name="price"]').value.trim().length == 0) {
        errorMsg.classList.add('active');
        errorMsg.innerText = 'Enter price'
        return false;
    }
    else if(form.querySelector('input[name="size"]').value.trim().length == 0) {
        errorMsg.classList.add('active');
        errorMsg.innerText = 'Enter size'
        return false;
    }
    else if(form.querySelector('textarea[name="description"]').value.trim().length == 0) {
        errorMsg.classList.add('active');
        errorMsg.innerText = 'Enter description'
        return false;
    }
    else if(atLeastOneImageSelected == false) {
        errorMsg.classList.add('active');
        errorMsg.innerText = 'Upload atleast one image';
        return false;
    }
    else if(form.querySelector('input[name="length"]').value.trim().length == 0) {
        errorMsg.classList.add('active');
        errorMsg.innerText = 'Enter length'
        return false;
    }
    else if(form.querySelector('input[name="width"]').value.trim().length == 0) {
        errorMsg.classList.add('active');
        errorMsg.innerText = 'Enter width'
        return false;
    }
    else if(form.querySelector('input[name="height"]').value.trim().length == 0) {
        errorMsg.classList.add('active');
        errorMsg.innerText = 'Enter height'
        return false;
    }
    else if(form.querySelector('input[name="weight"]').value.trim().length == 0) {
        errorMsg.classList.add('active');
        errorMsg.innerText = 'Enter weight'
        return false;
    }
    else {
        try {
            errorMsg.classList.remove('active');
            errorMsg.innerText = '';
            let token = getCookie('admin_access');
            let headers = {
                "Authorization": `Bearer ${token}`,
            };
            beforeLoad(button);
            let response = await requestAPI(`${apiURL}/admin/products`, formData, headers, 'POST');
            // console.log(response);
            response.json().then(function(res) {
                // console.log(res);
                if (response.status == 201) {
                    form.reset();
                    afterLoad(button, 'CREATED');
                    getData();
                    setTimeout(() => {
                        document.querySelector('.productCreate').click();
                    }, 1500)
                }
                else {
                    let keys = Object.keys(res.messages);
                    keys.forEach((key) => {
                        console.log(key);
                        errorMsg.classList.add('active');
                        errorMsg.innerHTML += `${key}: ${res.messages[key]}. <br />`;
                    })
                    afterLoad(button, 'Error');
                }
            })
        }
        catch (err) {
            afterLoad(button, 'ERROR');
            console.log(err);
        }
    }
}