let customerDropdown = document.getElementById('customer-dropdown');
let customerField = document.getElementById('customer-field');

let productDropdown = document.getElementById('product-dropdown');
let productField = document.getElementById('product-field');
let productTotalWrapper = document.getElementById('product-totals-wrapper');

let addedProductsWrapper = document.getElementById('added-products-wrapper');

let customerData = [];
let productData = [];

async function populateDropdowns() {
    let token = getCookie('admin_access');
    let headers = {
        "Authorization": `Bearer ${token}`
    }
    let responseCustomerList = await requestAPI(`${apiURL}/admin/user-profiles?user__is_blocked=false&perPage=1000`, null, headers, 'GET');
    let response = await requestAPI(`${apiURL}/admin/products?perPage=1000`, null, headers, 'GET');
    responseCustomerList.json().then(function(res) {
        customerData = [...res.data];
        customerData.forEach((customer) => {
            customer.full_name = `${customer.first_name} ${customer.last_name}`;
        })
        res.data.forEach((customer) => {
            customerDropdown.innerHTML += `<div class="radio-btn customer-item-list" data-id="${customer.user}">
                                                <input onchange="selectCustomer(event);" id="cust-${customer.user}" type="radio" value="${customer.user}" name="customer_radio" />
                                                <label for="cust-${customer.user}" class="radio-label">${customer.first_name} ${customer.last_name}</label>
                                            </div>`;
        })
    })
    response.json().then(function(res) {
        productData = [...res.data];
        productData.forEach((product) => {
            productDropdown.innerHTML += `<div class="radio-btn product-item-list" data-id="${product.id}">
                                            <input onclick="selectProduct(event);" id="prod-${product.id}" type="radio" value="${product.title}" name="product_radio" />
                                            <label for="prod-${product.id}" class="radio-label">${product.title}</label>
                                        </div>`;
        });
    })
}


function selectProduct(event) {
    let inputElement = event.target;
    if(inputElement.checked) {
        let id = inputElement.closest('.product-item-list').getAttribute('data-id');
        let checkDuplicateCard = document.querySelector(`.product-card[data-id="${id}"]`);
        if (checkDuplicateCard == null) {
            let selectedProduct = productData.filter(product => product.id == id)[0];
            addedProductsWrapper.innerHTML += `<div class="product-card" data-id="${selectedProduct.id}">
                                                    <div class="product-details">
                                                        <div class="product-image">
                                                            <div>
                                                                <span>1</span>
                                                            </div>
                                                            <img src="${selectedProduct.images[0].image}" alt="product image" />
                                                        </div>
                                                        <div>
                                                            <span>${selectedProduct.title}</span>
                                                            <span>#${selectedProduct.id}</span>
                                                        </div>
                                                    </div>
                                                    <div class="product-values">
                                                        <div>
                                                            <span>Quantity</span>
                                                            <input type="number" min="1" value="1" name="quantity" id="" />
                                                        </div>
                                                        <div>
                                                            <span>Price</span>
                                                            <input type="number" min="0" value="${selectedProduct.price}" placeholder="$25.00" name="price" id="" />
                                                        </div>
                                                    </div>
                                                    <div class="delete-btn cursor-pointer">
                                                        <svg class="cursor-pointer" onclick="delSelectedProduct(event, ${selectedProduct.id})" xmlns="http://www.w3.org/2000/svg" width="17" height="20" viewBox="0 0 17 20" fill="none">
                                                            <path d="M15.8333 3.33333H13.25C13.0566 2.39284 12.5449 1.54779 11.801 0.940598C11.0572 0.333408 10.1268 0.0012121 9.16667 0L7.5 0C6.53983 0.0012121 5.60943 0.333408 4.86562 0.940598C4.12182 1.54779 3.61008 2.39284 3.41667 3.33333H0.833333C0.61232 3.33333 0.400358 3.42113 0.244078 3.57741C0.0877973 3.73369 0 3.94565 0 4.16667C0 4.38768 0.0877973 4.59964 0.244078 4.75592C0.400358 4.9122 0.61232 5 0.833333 5H1.66667V15.8333C1.66799 16.938 2.1074 17.997 2.88852 18.7782C3.66963 19.5593 4.72867 19.9987 5.83333 20H10.8333C11.938 19.9987 12.997 19.5593 13.7782 18.7782C14.5593 17.997 14.9987 16.938 15 15.8333V5H15.8333C16.0543 5 16.2663 4.9122 16.4226 4.75592C16.5789 4.59964 16.6667 4.38768 16.6667 4.16667C16.6667 3.94565 16.5789 3.73369 16.4226 3.57741C16.2663 3.42113 16.0543 3.33333 15.8333 3.33333ZM7.5 1.66667H9.16667C9.68356 1.6673 10.1876 1.82781 10.6097 2.1262C11.0317 2.42459 11.3512 2.84624 11.5242 3.33333H5.1425C5.31549 2.84624 5.63492 2.42459 6.05699 2.1262C6.47906 1.82781 6.98311 1.6673 7.5 1.66667ZM13.3333 15.8333C13.3333 16.4964 13.0699 17.1323 12.6011 17.6011C12.1323 18.0699 11.4964 18.3333 10.8333 18.3333H5.83333C5.17029 18.3333 4.53441 18.0699 4.06557 17.6011C3.59673 17.1323 3.33333 16.4964 3.33333 15.8333V5H13.3333V15.8333Z" fill="#000093"/>
                                                            <path d="M6.66683 14.9987C6.88784 14.9987 7.0998 14.9109 7.25609 14.7546C7.41237 14.5983 7.50016 14.3864 7.50016 14.1654V9.16536C7.50016 8.94435 7.41237 8.73239 7.25609 8.57611C7.0998 8.41983 6.88784 8.33203 6.66683 8.33203C6.44582 8.33203 6.23385 8.41983 6.07757 8.57611C5.92129 8.73239 5.8335 8.94435 5.8335 9.16536V14.1654C5.8335 14.3864 5.92129 14.5983 6.07757 14.7546C6.23385 14.9109 6.44582 14.9987 6.66683 14.9987Z" fill="#000093"/>
                                                            <path d="M9.99984 14.9987C10.2209 14.9987 10.4328 14.9109 10.5891 14.7546C10.7454 14.5983 10.8332 14.3864 10.8332 14.1654V9.16536C10.8332 8.94435 10.7454 8.73239 10.5891 8.57611C10.4328 8.41983 10.2209 8.33203 9.99984 8.33203C9.77882 8.33203 9.56686 8.41983 9.41058 8.57611C9.2543 8.73239 9.1665 8.94435 9.1665 9.16536V14.1654C9.1665 14.3864 9.2543 14.5983 9.41058 14.7546C9.56686 14.9109 9.77882 14.9987 9.99984 14.9987Z" fill="#000093"/>
                                                        </svg>
                                                    </div>
                                                </div>`;
            addedProductsWrapper.classList.remove('hide');
            productTotalWrapper.classList.remove('hide');
        }
        // productField.value = inputElement.nextElementSibling.innerText;
    }
}


function delSelectedProduct(event, id) {
    event.preventDefault();
    let divToDelete = event.target.closest('.product-card');
    divToDelete.remove();
    if (document.querySelectorAll('.product-card').length == 0) {
        addedProductsWrapper.classList.add('hide');
        productTotalWrapper.classList.add('hide');
    }
}


productField.addEventListener('focus', function() {
    productDropdown.style.display = 'flex';
})

productField.addEventListener('blur', function() {
    setTimeout(() => {
        productDropdown.style.display = 'none';
    }, 100);
})

productField.addEventListener('input', function() {
    let filteredProducts = [];
    filteredProducts = productData.filter(product => product.title.toLowerCase().includes(this.value.toLowerCase())).map(product => product.id);
    if (filteredProducts.length == 0) {
        document.getElementById('no-product-text').classList.remove('hide');
        document.querySelectorAll('.product-item-list').forEach((item) => item.classList.add('hide'));
    }
    else {
        document.getElementById('no-product-text').classList.add('hide');
        document.querySelectorAll('.product-item-list').forEach((item) => {
            let itemID = item.getAttribute('data-id');
            if (filteredProducts.includes(parseInt(itemID, 10))) {
                item.classList.remove('hide');
            }
            else {
                item.classList.add('hide');
            }
        })
    }
})


function selectCustomer(event) {
    let inputElement = event.target;
    if(inputElement.checked) {
        customerField.value = inputElement.nextElementSibling.innerText;
        let customerDetails = customerData.filter(customer => customer.user == inputElement.value).map(customer => customer.shipping_address);
        // console.log(customerDetails);
        if (customerDetails[0]) {
            // console.log('yes', customerDetails[0]);
            document.querySelector('#orderCreate input[name="address"]').value = customerDetails[0].address;
            document.querySelector('#orderCreate input[name="city"]').value = customerDetails[0].city;
            document.querySelector('#orderCreate input[name="state"]').value = customerDetails[0].state;
            document.querySelector('#orderCreate input[name="zip_code"]').value = customerDetails[0].zip_code;
            document.querySelector('#orderCreate input[name="country"]').value = customerDetails[0].country;
        }
    }
}

customerField.addEventListener('focus', function() {
    customerDropdown.style.display = 'flex';
})

customerField.addEventListener('blur', function(event) {
    setTimeout(() => {
        customerDropdown.style.display = 'none';
    }, 100);
})

customerField.addEventListener('input', function() {
    let filteredCustomer = [];
    filteredCustomer = customerData.filter(customer => customer.full_name.toLowerCase().includes(this.value.toLowerCase())).map((customer => customer.user));
    if (filteredCustomer.length == 0) {
        document.getElementById('no-customer-text').classList.remove('hide');
        document.querySelectorAll('.customer-item-list').forEach((item) => item.classList.add('hide'));
    }
    else {
        document.getElementById('no-customer-text').classList.add('hide');
        document.querySelectorAll('.customer-item-list').forEach((item) => {
            let itemID = item.getAttribute('data-id');
            if (filteredCustomer.includes(parseInt(itemID, 10))) {
                item.classList.remove('hide');
            }
            else {
                item.classList.add('hide');
            }
        })
    }
})


function toggleDropdown(event) {
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

// productDropdownBtn.addEventListener('click', toggleDropdown);

function closeDropdowns(event) {
    // if((!productDropdownBtn.contains(event.target)) && productDropdown.style.display == 'flex') {
    //     productDropdown.style.display = 'none';
    // }
}

document.body.addEventListener('click', closeDropdowns);



async function openCreateOrderModal(modalId) {
    let modal = document.querySelector(`#${modalId}`);
    document.querySelector(`.${modalId}`).click();
}


// let registrationCheckbox = document.getElementById('registration-status-checkbox');
// registrationCheckbox.addEventListener('change', function() {
//     if (registrationCheckbox.checked) {
//         document.getElementById('customer').classList.add('hide');
//         document.getElementById('first-last-name-inputs').classList.remove('hide');
//     }
//     else {
//         document.getElementById('customer').classList.remove('hide');
//         document.getElementById('first-last-name-inputs').classList.add('hide');
//     }
// })