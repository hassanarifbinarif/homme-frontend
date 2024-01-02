let billingAddressWrapper = document.getElementById('billing-address-wrapper');
let addressCheckbox = document.getElementById('address-checkbox');

addressCheckbox.addEventListener('change', function() {
    if (this.checked) {
        billingAddressWrapper.classList.add('hide');
    }
    else {
        billingAddressWrapper.classList.remove('hide');
    }
})


let shippingStatesDropdown = document.getElementById('shipping-states-dropdown');
let shippingStatesField = document.getElementById('shipping-states-field');
let shippingCountryDropdown = document.getElementById('shipping-country-dropdown');
let shippingCountryField = document.getElementById('shipping-country-field');

let billingStatesDropdown = document.getElementById('billing-states-dropdown');
let billingStatesField = document.getElementById('billing-states-field');
let billingCountryDropdown = document.getElementById('billing-country-dropdown');
let billingCountryField = document.getElementById('billing-country-field');


shippingStatesField.addEventListener('click', toggleDropdown);
shippingCountryField.addEventListener('click', toggleDropdown);
billingStatesField.addEventListener('click', toggleDropdown);
billingCountryField.addEventListener('click', toggleDropdown);


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


function closeDropdowns(event) {
    if ((!shippingStatesField.contains(event.target)) && shippingStatesDropdown.style.display == 'flex') {
        shippingStatesDropdown.style.display = 'none';
    }
    else if ((!shippingCountryField.contains(event.target)) && shippingCountryDropdown.style.display == 'flex') {
        shippingCountryDropdown.style.display = 'none';
    }
    else if ((!billingStatesField.contains(event.target)) && billingStatesDropdown.style.display == 'flex') {
        billingStatesDropdown.style.display = 'none';
    }
    else if ((!billingCountryField.contains(event.target)) && billingCountryDropdown.style.display == 'flex') {
        billingCountryDropdown.style.display = 'none';
    }
}

document.body.addEventListener('click', closeDropdowns);


window.onload = () => {
    populateStatesAndCountriesDropdown();
}


function populateStatesAndCountriesDropdown() {
    statesList.forEach((state, index) => {
        shippingStatesDropdown.insertAdjacentHTML('beforeend', `<div class="radio-btn state-item-list" data-id="${index+1}">
                                                                    <input onchange="selectState(this, 'shipping');" id="shipping-state-${index}" type="radio" data-value="${state.name}" value="${state.abbreviation}" name="shipping_state" />
                                                                    <label for="shipping-state-${index}" data-name="${state.name}" class="radio-label">${state.name}</label>
                                                                </div>`)
        billingStatesDropdown.insertAdjacentHTML('beforeend', `<div class="radio-btn state-item-list" data-id="${index+1}">
                                                                    <input onchange="selectState(this, 'billing');" id="billing-state-${index}" type="radio" data-value="${state.name}" value="${state.abbreviation}" name="billing_state" />
                                                                    <label for="billing-state-${index}" data-name="${state.name}" class="radio-label">${state.name}</label>
                                                                </div>`)
    })

    countryList.forEach((country, index) => {
        shippingCountryDropdown.insertAdjacentHTML('beforeend', `<div class="radio-btn country-item-list" data-id="${index+1}">
                                                                    <input onchange="selectCountry(this, 'shipping');" id="shipping-country-${index}" type="radio" value="${country['Country']}" name="shipping_country" />
                                                                    <label for="shipping-country-${index}" data-name="${country['Country']}" class="radio-label">${country['Country']}</label>
                                                                </div>`)
        billingCountryDropdown.insertAdjacentHTML('beforeend', `<div class="radio-btn country-item-list" data-id="${index+1}">
                                                                    <input onchange="selectCountry(this, 'billing');" id="billing-country-${index}" type="radio" value="${country['Country']}" name="billing_country" />
                                                                    <label for="billing-country-${index}" data-name="${country['Country']}" class="radio-label">${country['Country']}</label>
                                                                </div>`)
    })
}


function selectState(inputField, type) {
    if (inputField.checked) {
        document.getElementById(`selected-${type}-state-text`).innerText = inputField.nextElementSibling.innerText;
        document.getElementById(`selected-${type}-state-text`).style.color = '#000';
    }
}

function selectCountry(inputField, type) {
    if (inputField.checked) {
        document.getElementById(`selected-${type}-country-text`).innerText = inputField.nextElementSibling.innerText;
        document.getElementById(`selected-${type}-country-text`).style.color = '#000';
    }
}


function openAddressesModal(id, type=null) {
    let modal = document.querySelector(`#addressesModal`);
    let form = modal.querySelector('form');
    
    form.setAttribute("onsubmit", `updateAddressesForm(event, ${id}, '${type}')`);
    modal.querySelector('.btn-text').innerText = 'UPDATE';

    if (customerShippingAddress != null) {
        form.querySelector('input[name="shipping_first_name"]').value = customerShippingAddress.first_name;
        form.querySelector('input[name="shipping_last_name"]').value = customerShippingAddress.last_name;
        form.querySelector('input[name="shipping_phone"]').value = customerShippingAddress.phone;
        form.querySelector('input[name="shipping_address1"]').value = customerShippingAddress.address;
        form.querySelector('input[name="shipping_address2"]').value = customerShippingAddress.address2;
        form.querySelector('input[name="shipping_city"]').value = customerShippingAddress.city;
        form.querySelector('input[name="shipping_zip_code"]').value = customerShippingAddress.zip_code;

        let isShippingState = modal.querySelector(`input[name='shipping_state'][value='${customerShippingAddress.state}'], input[name='shipping_state'][data-value='${customerShippingAddress.state}']`);
        if (isShippingState) {
            isShippingState.checked = true;
            document.getElementById('selected-shipping-state-text').innerText = isShippingState.nextElementSibling.innerText;
            document.getElementById('selected-shipping-state-text').style.color = '#000';
        }

        let isShippingCountry = modal.querySelector(`input[name='shipping_country'][value='${customerShippingAddress.country}']`);
        if (isShippingCountry) {
            isShippingCountry.checked = true;
            document.getElementById('selected-shipping-country-text').innerText = isShippingCountry.nextElementSibling.innerText;
            document.getElementById('selected-shipping-country-text').style.color = '#000';
        }
    }

    if (customerBillingAddress != null) {
        form.querySelector('input[name="billing_first_name"]').value = customerBillingAddress.first_name;
        form.querySelector('input[name="billing_last_name"]').value = customerBillingAddress.last_name;
        form.querySelector('input[name="billing_phone"]').value = customerBillingAddress.phone;
        form.querySelector('input[name="billing_address1"]').value = customerBillingAddress.address;
        form.querySelector('input[name="billing_address2"]').value = customerBillingAddress.address2;
        form.querySelector('input[name="billing_city"]').value = customerBillingAddress.city;
        form.querySelector('input[name="billing_zip_code"]').value = customerBillingAddress.zip_code;

        let isBillingState = modal.querySelector(`input[name='billing_state'][value='${customerBillingAddress.state}'], input[name='billing_state'][data-value='${customerBillingAddress.state}']`);
        if (isBillingState) {
            isBillingState.checked = true;
            document.getElementById('selected-billing-state-text').innerText = isBillingState.nextElementSibling.innerText;
            document.getElementById('selected-billing-state-text').style.color = '#000';
        }

        let isBillingCountry = modal.querySelector(`input[name='billing_country'][value='${customerBillingAddress.country}']`);
        if (isBillingCountry) {
            isBillingCountry.checked = true;
            document.getElementById('selected-billing-country-text').innerText = isBillingCountry.nextElementSibling.innerText;
            document.getElementById('selected-billing-country-text').style.color = '#000';
        }
    }
    modal.addEventListener('hidden.bs.modal', event => {
        form.reset();
        form.removeAttribute("onsubmit");
        modal.querySelector('.btn-text').innerText = 'UPDATE';
        document.querySelector('.create-error-msg').classList.remove('active');
        document.querySelector('.create-error-msg').innerText = "";
        document.getElementById('selected-shipping-state-text').innerText = 'State';
        document.getElementById('selected-shipping-state-text').style.color = '#A9A9A9';
        document.getElementById('selected-shipping-country-text').innerText = 'Country';
        document.getElementById('selected-shipping-country-text').style.color = '#A9A9A9';
        document.getElementById('selected-billing-state-text').innerText = 'State';
        document.getElementById('selected-billing-state-text').style.color = '#A9A9A9';
        document.getElementById('selected-billing-country-text').innerText = 'Country';
        document.getElementById('selected-billing-country-text').style.color = '#A9A9A9';
        billingAddressWrapper.classList.remove('hide');
    })

    document.querySelector(`.addressesModal`).click();
}


async function updateAddressesForm(event, id, type) {
    event.preventDefault();
    let form = event.currentTarget;
    let formData = new FormData(form);
    let data = formDataToObject(formData);
    let button = form.querySelector('button[type="submit"]');
    let errorMsg = form.querySelector('.create-error-msg');

    let addressData = {};

    if (data.shipping_first_name.trim().length == 0) {
        errorMsg.innerHTML = 'Enter shipping first name';
        errorMsg.classList.add('active');
        return false;
    }
    else if (data.shipping_last_name.trim().length == 0) {
        errorMsg.innerHTML = 'Enter shipping last name';
        errorMsg.classList.add('active');
        return false;
    }
    else if (phoneRegex.test(data.shipping_phone) == false) {
        errorMsg.innerHTML = 'Please enter a valid shipping number with country code';
        errorMsg.classList.add('active');
        return false;
    }
    else if (data.shipping_address1.trim().length == 0) {
        errorMsg.innerHTML = 'Enter shipping address';
        errorMsg.classList.add('active');
        return false;
    }
    else if (data.shipping_city.trim().length == 0) {
        errorMsg.innerHTML = 'Enter shipping city';
        errorMsg.classList.add('active');
        return false;
    }
    else if ((!data.shipping_state)) {
        errorMsg.innerHTML = 'Select shipping state';
        errorMsg.classList.add('active');
        return false;
    }
    else if (data.shipping_zip_code.trim().length != 5) {
        errorMsg.innerHTML = 'Enter shipping zipcode';
        errorMsg.classList.add('active');
        return false;
    }
    else if ((!data.shipping_country)) {
        errorMsg.innerHTML = 'Select shipping country';
        errorMsg.classList.add('active');
        return false;
    }

    addressData = {
        "shipping_address": {
            "first_name": data.shipping_first_name,
            "last_name": data.shipping_last_name,
            "phone": data.shipping_phone,
            "country": data.shipping_country,
            "state": data.shipping_state,
            "city": data.shipping_city,
            "address": data.shipping_address1,
            "address2": data.shipping_address2,
            "zip_code": data.shipping_zip_code
        }
    }

    if (addressCheckbox.checked) {
        addressData.billing_address = addressData.shipping_address;
    }
    else {
        if (data.billing_first_name.trim().length == 0) {
            errorMsg.innerHTML = 'Enter billing first name';
            errorMsg.classList.add('active');
            return false;
        }
        else if (data.billing_last_name.trim().length == 0) {
            errorMsg.innerHTML = 'Enter billing last name';
            errorMsg.classList.add('active');
            return false;
        }
        else if (phoneRegex.test(data.billing_phone) == false) {
            errorMsg.innerHTML = 'Please enter a valid billing number with country code';
            errorMsg.classList.add('active');
            return false;
        }
        else if (data.billing_address1.trim().length == 0) {
            errorMsg.innerHTML = 'Enter billing address';
            errorMsg.classList.add('active');
            return false;
        }
        else if (data.billing_city.trim().length == 0) {
            errorMsg.innerHTML = 'Enter billing city';
            errorMsg.classList.add('active');
            return false;
        }
        else if ((!data.billing_state)) {
            errorMsg.innerHTML = 'Select billing state';
            errorMsg.classList.add('active');
            return false;
        }
        else if (data.billing_zip_code.trim().length != 5) {
            errorMsg.innerHTML = 'Enter billing zipcode';
            errorMsg.classList.add('active');
            return false;
        }
        else if ((!data.billing_country)) {
            errorMsg.innerHTML = 'Select billing country';
            errorMsg.classList.add('active');
            return false;
        }

        addressData.billing_address = {
            "first_name": data.billing_first_name,
            "last_name": data.billing_last_name,
            "phone": data.billing_phone,
            "country": data.billing_country,
            "state": data.billing_state,
            "city": data.billing_city,
            "address": data.billing_address1,
            "address2": data.billing_address2,
            "zip_code": data.billing_zip_code
        }
    }

    try {
        errorMsg.innerHTML = '';
        errorMsg.classList.remove('active');

        let token = getCookie('admin_access');
        let headers = {
            "Authorization": `Bearer ${token}`,
            "Content-Type": 'application/json'
        }

        let requestURL = type == 'order' ? `${apiURL}/admin/orders/${id}` : `${apiURL}/admin/user-profiles/${id}`;

        beforeLoad(button);
        let response = await requestAPI(requestURL, JSON.stringify(addressData), headers, 'PATCH');
        response.json().then(function(res) {

            if (response.status == 200) {
                afterLoad(button, 'UPDATED');
                customerShippingAddress = addressData.shipping_address;
                customerBillingAddress = addressData.billing_address;

                document.getElementById('current-shipping-address').innerText = `${addressData.shipping_address.address}, ${addressData.shipping_address.city}, ${addressData.shipping_address.state} ${addressData.shipping_address.zip_code} ${addressData.shipping_address.country}`;
                document.getElementById('current-billing-address').innerText = `${addressData.billing_address.address}, ${addressData.billing_address.city}, ${addressData.billing_address.state} ${addressData.billing_address.zip_code} ${addressData.billing_address.country}`;
                
                setTimeout(() => {
                    afterLoad(button, 'UPDATE');
                    document.querySelector('.addressesModal').click();
                }, 1000);
            }
            else {
                afterLoad(button, 'ERROR');
                errorMsg.classList.add('active');
                let keys = Object.keys(res.messages);
                
                keys.forEach((key) => {
                    if (Array.isArray(res.messages[key])) {
                        keys.forEach((key) => {
                            errorMsg.innerHTML += `${res.messages[key]} <br />`;
                        })
                    }
                    else if (typeof res.messages[key] === 'object') {
                        const nestedKeys = Object.keys(res.messages[key]);
                        nestedKeys.forEach((nestedKey) => {
                            for( let i = 0; i < nestedKey.length; i++) {
                                if (res.messages[key][nestedKey][i] == undefined)
                                    continue;
                                else
                                    errorMsg.innerHTML += `${res.messages[key][nestedKey][i]} <br />`;
                            }
                        });
                    }
                })
            }
        })
    }
    catch (err) {
        console.log(err);
    }
}