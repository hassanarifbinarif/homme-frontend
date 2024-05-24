let productSelectBtn = document.getElementById('product-select-btn');
let productSearchWrapper = document.getElementById('product-search-wrapper');
let productListWrapper = document.getElementById('product-list-items-wrapper');
let selectedProduct = null;
let productList = [];


async function populateProducts() {
    let token = getCookie('admin_access');
    let headers = {
        "Authorization": `Bearer ${token}`
    };
    let response = await requestAPI(`${apiURL}/admin/products?perPage=1000`, null, headers, 'GET');
    response.json().then(function(res) {
        if (response.status == 200) {
            productList = [...res.data];
            res.data.forEach((product) => {
                productListWrapper.innerHTML += `<div class="product-list-item" data-id="${product.id}">
                                                    <label class="cursor-pointer" for="product-${product.id}">
                                                        <span>${product.title}</span>
                                                    </label>
                                                    <div class="cursor-pointer">
                                                        <input onchange="selectProduct(this);" type="radio" value="${product.id}" data-name="${product.title}" id="product-${product.id}" data-id="${product.id}" name="product" />
                                                    </div>
                                                </div>`;
            })
        }
    })
}


productSelectBtn.addEventListener('click', function() {
    if (productSearchWrapper.classList.contains('hide')) {
        productSearchWrapper.classList.remove('hide');
    }
    else {
        productSearchWrapper.classList.add('hide');
    }
})


function checkEnter(event) {
    if (event.keyCode == 13) {
        event.preventDefault();
    }
}


function searchProduct(inputField) {
    let filteredProducts = [];
    if (inputField.value == '') {
        filteredProducts = productList.map(product => product.id);
    }
    else {
        filteredProducts = productList.filter(product => product.title.toLowerCase().includes(inputField.value.toLowerCase() || inputField.value === '')).map(product => product.id);
    }

    if (filteredProducts.length == 0) {
        document.getElementById('no-product-text').classList.remove('hide');
        document.querySelectorAll('.product-list-item').forEach((item) => item.classList.add('hide'));
    }
    else {
        document.getElementById('no-product-text').classList.add('hide');
        document.querySelectorAll('.product-list-item').forEach((item) => {
            let itemID = item.getAttribute('data-id');
            if (filteredProducts.includes(parseInt(itemID, 10))) {
                item.classList.remove('hide');
            }
            else {
                item.classList.add('hide');
            }
        })
    }
}


function selectProduct(input) {
    selectedProduct = parseInt(input.getAttribute('data-id'));
    document.getElementById('selected-product-name').innerText = input.getAttribute('data-name');
    document.getElementById('selected-product-name').style.color = '#000';
}


function openSpecialOfferModal(modalID) {
    let modal = document.getElementById(`${modalID}`);
    let form = modal.querySelector('form');
    form.setAttribute("onsubmit", 'createSpecialOfferForm(event)');
    modal.addEventListener('hidden.bs.modal', event => {
        form.reset();
        form.removeAttribute("onsubmit");
        let label = modal.querySelector('#special-image-label');
        label.querySelector('.event-img').src = '';
        label.querySelector('.event-img').classList.add('hide');
        label.querySelector('svg').style.display = 'block';
        label.querySelectorAll('span').forEach((span) => {
            span.style.display = 'block';
        })
        productSearchWrapper.classList.add('hide');
        modal.querySelector('#selected-product-name').innerText = 'Specify Product';
        modal.querySelector('#selected-product-name').style.color = 'rgba(3, 7, 6, 0.60)';
        selectedProduct = null;
        modal.querySelector('.btn-text').innerText = 'SAVE';
        document.querySelector('.special-error-div').classList.add('hide');
        document.querySelector('.create-special-error-msg').classList.remove('active');
        document.querySelector('.create-special-error-msg').innerText = "";
    })
    document.querySelector(`.${modalID}`).click();
}


async function createSpecialOfferForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let formData = new FormData(form);
    let data = formDataToObject(formData);
    let errorDiv = form.querySelector('.special-error-div');
    let errorMsg = form.querySelector('.create-special-error-msg');
    let button = form.querySelector('button[type="submit"]');
    let buttonText = button.innerText;

    if (data.title.trim().length == 0) {
        errorDiv.classList.remove('hide');
        errorMsg.innerText = 'Enter valid title';
        errorMsg.classList.add('active');
        return false;
    }
    else if (data.sub_title.trim().length == 0) {
        errorDiv.classList.remove('hide');
        errorMsg.innerText = 'Enter valid sub-title';
        errorMsg.classList.add('active');
        return false;
    }
    else if (selectedProduct == null) {
        errorDiv.classList.remove('hide');
        errorMsg.innerText = 'Select a product';
        errorMsg.classList.add('active');
        return false;
    }
    else if (data.discount_percent < 0 || data.discount_percent > 100 || data.discount_percent.trim().length == 0) {
        errorDiv.classList.remove('hide');
        errorMsg.innerText = 'Enter valid discount percent';
        errorMsg.classList.add('active');
        return false;
    }
    else if (data.description.trim().length == 0) {
        errorDiv.classList.remove('hide');
        errorMsg.innerText = 'Enter valid description';
        errorMsg.classList.add('active');
        return false;
    }
    else {
        try {
            data.is_expired = false;
            // delete data.image;
            errorDiv.classList.add('hide');
            errorMsg.innerText = '';
            errorMsg.classList.remove('active');
            let token = getCookie('admin_access');
            let headers = {
                "Authorization": `Bearer ${token}`,
                // "Content-Type": 'application/json'
            };
            beforeLoad(button);
            let response = await requestAPI(`${apiURL}/admin/content/special-offers`, formData, headers, 'POST');
            response.json().then(function(res) {
                if (response.status == 201) {
                    afterLoad(button, 'SAVED');
                    form.reset();
                    form.removeAttribute('onsubmit');
                    setTimeout(() => {
                        document.querySelector('.eventCreateOffer').click();
                        afterLoad(button, 'SAVE');
                    }, 1000)
                }
                else if (response.status == 400) {
                    afterLoad(button, buttonText);
                    errorDiv.classList.remove('hide');
                    let keys = Object.keys(res.messages);
                    keys.forEach((key) => {
                        errorMsg.innerHTML += `${key}: ${res.messages[key]} <br />`;
                    })
                    errorMsg.classList.add('active');
                }
                else {
                    afterLoad(button, 'ERROR');
                }
            })
        }
        catch (err) {
            console.log(err);
            afterLoad(button, 'ERROR');
        }
    }
}


function verifyOfferImage(input) {
    if (input.files.length > 0) {
        let label = input.closest('label');
        const img = document.createElement('img');
        const selectedImage = input.files[0];
        const objectURL = URL.createObjectURL(selectedImage);
        let imageTag = label.querySelector('.event-img');
        img.onload = function handleLoad() {
            // console.log(`Width: ${img.width}, Height: ${img.height}`);
    
            if (img.width == supportedImageWidth && img.height == supportedImageHeight) {
                imageTag.src = objectURL;
                imageTag.classList.remove('hide');
                label.querySelector('svg').style.display = 'none';
                label.querySelectorAll('span').forEach((span) => {
                    span.style.display = 'none';
                })
                document.querySelector('.special-error-div').classList.add('hide');
                document.querySelector('.create-special-error-msg').classList.remove('active');
                document.querySelector('.create-special-error-msg').innerText = "";
            }
            else {
                URL.revokeObjectURL(objectURL);
                imageTag.classList.add('hide');
                label.querySelector('svg').style.display = 'block';
                label.querySelectorAll('span').forEach((span) => {
                    span.style.display = 'block';
                })
                document.querySelector('.special-error-div').classList.remove('hide');
                document.querySelector('.create-special-error-msg').classList.add('active');
                document.querySelector('.create-special-error-msg').innerText = `Image does not match supported dimensions: ${supportedImageWidth}x${supportedImageHeight} px`;
                input.value = null;
            }
        };
  
        img.src = objectURL;
    }
}


function openUpdateSpecialOfferModal(modalID, id, title, sub_title, description, discount_percent, summary, venue_name, venue_address, venue_link, image, product_id) {
    let modal = document.getElementById(`${modalID}`);
    let form = modal.querySelector('form');
    form.setAttribute("onsubmit", `updateSpecialOfferForm(event, ${id})`);
    form.querySelector('input[name="title"]').value = title;
    form.querySelector('input[name="sub_title"]').value = sub_title;
    form.querySelector('input[name="summary"]').value = summary;
    form.querySelector('input[name="title"]').value = title;
    form.querySelector('input[name="discount_percent"]').value = discount_percent;
    form.querySelector('input[name="title"]').value = title;
    form.querySelector('textarea[name="description"]').value = description;
    form.querySelector('input[name="title"]').value = title;
    form.querySelector('input[name="venue_name"]').value = venue_name;
    form.querySelector('input[name="venue_address"]').value = venue_address;
    form.querySelector('input[name="venue_link"]').value = venue_link;
    let productOption = form.querySelector(`input[name="product"][value="${product_id}"]`);
    if (productOption) {
        productOption.click();
    }
    let label = modal.querySelector('#special-image-label');
    if (image != 'None') {
        form.querySelector('#special-offer-image').src = image;
        form.querySelector('#special-offer-image').classList.remove('hide');
        label.querySelector('svg').style.display = 'none';
        label.querySelectorAll('span').forEach((span) => {
            span.style.display = 'none';
        })
    }
    modal.querySelector('#special-offer-modal-header-text').innerText = 'Edit Special Offer';
    modal.addEventListener('hidden.bs.modal', event => {
        modal.querySelector('#special-offer-modal-header-text').innerText = 'Create Special Offer';
        form.reset();
        form.removeAttribute("onsubmit");
        form.querySelector('#special-offer-image').classList.add('hide');
        label.querySelector('.event-img').src = '';
        label.querySelector('.event-img').classList.add('hide');
        label.querySelector('svg').style.display = 'block';
        label.querySelectorAll('span').forEach((span) => {
            span.style.display = 'block';
        })
        modal.querySelector('#selected-product-name').innerText = 'Specify Product';
        modal.querySelector('#selected-product-name').style.color = 'rgba(3, 7, 6, 0.60)';
        selectedProduct = null;
        productSearchWrapper.classList.add('hide');
        modal.querySelector('.btn-text').innerText = 'SAVE';
        document.querySelector('.special-error-div').classList.add('hide');
        document.querySelector('.create-special-error-msg').classList.remove('active');
        document.querySelector('.create-special-error-msg').innerText = "";
    })
    document.querySelector(`.${modalID}`).click();
}


async function updateSpecialOfferForm(event, id) {
    event.preventDefault();
    let form = event.currentTarget;
    let formData = new FormData(form);
    let data = formDataToObject(formData);
    let errorDiv = form.querySelector('.special-error-div');
    let errorMsg = form.querySelector('.create-special-error-msg');
    let button = form.querySelector('button[type="submit"]');
    let buttonText = button.innerText;

    if (data.title.trim().length == 0) {
        errorDiv.classList.remove('hide');
        errorMsg.innerText = 'Enter valid title';
        errorMsg.classList.add('active');
        return false;
    }
    else if (data.sub_title.trim().length == 0) {
        errorDiv.classList.remove('hide');
        errorMsg.innerText = 'Enter valid sub-title';
        errorMsg.classList.add('active');
        return false;
    }
    else if (selectedProduct == null) {
        errorDiv.classList.remove('hide');
        errorMsg.innerText = 'Select a product';
        errorMsg.classList.add('active');
        return false;
    }
    else if (data.discount_percent < 0 || data.discount_percent > 100 || data.discount_percent.trim().length == 0) {
        errorDiv.classList.remove('hide');
        errorMsg.innerText = 'Enter valid discount percent';
        errorMsg.classList.add('active');
        return false;
    }
    else if (data.description.trim().length == 0) {
        errorDiv.classList.remove('hide');
        errorMsg.innerText = 'Enter valid description';
        errorMsg.classList.add('active');
        return false;
    }
    else {
        try {
            // data.is_expired = false;
            // delete data.image;
            errorDiv.classList.add('hide');
            errorMsg.innerText = '';
            errorMsg.classList.remove('active');
            let token = getCookie('admin_access');
            let headers = {
                "Authorization": `Bearer ${token}`,
                // "Content-Type": 'application/json'
            };
            beforeLoad(button);
            let response = await requestAPI(`${apiURL}/admin/content/special-offers/${id}`, formData, headers, 'PATCH');
            response.json().then(function(res) {
                if (response.status == 200) {
                    afterLoad(button, 'SAVED');
                    form.reset();
                    form.removeAttribute('onsubmit');
                    getData();
                    setTimeout(() => {
                        document.querySelector('.eventCreateOffer').click();
                        afterLoad(button, 'SAVE');
                    }, 1000)
                }
                else if (response.status == 400) {
                    afterLoad(button, buttonText);
                    errorDiv.classList.remove('hide');
                    let keys = Object.keys(res.messages);
                    keys.forEach((key) => {
                        errorMsg.innerHTML += `${key}: ${res.messages[key]} <br />`;
                    })
                    errorMsg.classList.add('active');
                }
                else {
                    afterLoad(button, 'ERROR');
                }
            })
        }
        catch (err) {
            console.log(err);
            afterLoad(button, 'ERROR');
        }
    }
}