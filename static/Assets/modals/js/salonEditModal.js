let salonStatusTypeDropdown = document.getElementById('salon-status-type-dropdown');
let salonStatusTypeDropdownBtn = document.getElementById('salon-status-type');
let salonStatusTypeOptions = document.querySelectorAll('input[name="salon_status"]');

let salonStatesDropdown = document.getElementById('salon-states-dropdown');
let salonStatesField = document.getElementById('salon-states-field');
let salonCountryDropdown = document.getElementById('salon-country-dropdown');
let salonCountryField = document.getElementById('salon-country-field');


function closeDropdowns(event) {
    if((!salonStatusTypeDropdownBtn.contains(event.target)) && salonStatusTypeDropdown.style.display == 'flex') {
        salonStatusTypeDropdown.style.display = 'none';
    }
    else if ((!salonStatesField.contains(event.target)) && salonStatesDropdown.style.display == 'flex') {
        salonStatesDropdown.style.display = 'none';
    }
    else if ((!salonCountryField.contains(event.target)) && salonCountryDropdown.style.display == 'flex') {
        salonCountryDropdown.style.display = 'none';
    }
}

document.body.addEventListener('click', closeDropdowns);
salonStatusTypeDropdownBtn.addEventListener('click', toggleDropdown);
salonStatesField.addEventListener('click', toggleDropdown);
salonCountryField.addEventListener('click', toggleDropdown);


function populateSalonStateCountryDropdowns() {
    statesList.forEach((state, index) => {
        salonStatesDropdown.insertAdjacentHTML('beforeend', `<div class="radio-btn salon-state-item-list" data-id="${index+1}">
                                                                <input onchange="selectSalonState(this);" id="salon-state-${index}" type="radio" data-value="${state.abbreviation}" value="${state.name}" name="salon_state" />
                                                                <label for="salon-state-${index}" data-name="${state.name}" class="radio-label">${state.name}</label>
                                                            </div>`)
    })

    countryList.forEach((country, index) => {
        salonCountryDropdown.insertAdjacentHTML('beforeend', `<div class="radio-btn salon-country-item-list" data-id="${index+1}">
                                                                <input onchange="selectSalonCountry(this);" id="salon-country-${index}" type="radio" data-value="${country['Country']}" value="${country['Alpha-2 code']}" name="salon_country" />
                                                                <label for="salon-country-${index}" data-name="${country['Country']}" class="radio-label">${country['Country']}</label>
                                                            </div>`)
    })
}


function selectSalonStatusType(event) {
    let inputElement = event.target;
    if(inputElement.checked) {
        document.getElementById('selected-salon-status-type').innerText = inputElement.nextElementSibling.innerText;
        document.getElementById('selected-salon-status-type').style.color = '#000';
    }
}

function selectSalonState(inputElement) {
    if(inputElement.checked) {
        document.getElementById('selected-salon-state-text').innerText = inputElement.nextElementSibling.innerText;
        document.getElementById('selected-salon-state-text').style.color = '#000';
    }
}

function selectSalonCountry(inputElement) {
    if(inputElement.checked) {
        document.getElementById('selected-salon-country-text').innerText = inputElement.nextElementSibling.innerText;
        document.getElementById('selected-salon-country-text').style.color = '#000';
    }
}


function openSalonEditModal(type='notes', addressData=null) {
    let modal = document.getElementById('salonEditModal');
    let form = modal.querySelector('form');
    form.setAttribute('onsubmit', `updateSalon${captalizeFirstLetter(type)}(event, ${specific_salon_id})`);

    if (type == 'notes') {
        modal.querySelector('input[name="admin_comment"]').value = document.getElementById('salon-notes').innerText;
    }
    else if (type == 'status') {
        modal.querySelector(`input[name="salon_status"][value="${document.querySelector('#salon-current-status').innerText.toLowerCase()}"]`).checked = true;
        modal.querySelector('#selected-salon-status-type').innerText = document.querySelector('#salon-current-status').innerText;
        modal.querySelector('#selected-salon-status-type').style.color = '#000';
    }
    else if (type == 'contact') {
        modal.querySelector('input[name="contact_name"]').value = document.querySelector('#salon-contact-name').innerText;
        modal.querySelector('input[name="email"]').value = document.querySelector('#salon-user-email').innerText;
        modal.querySelector('input[name="phone"]').value = document.querySelector('#salon-user-phone').innerText;
    }
    else if (type == 'address') {
        modal.querySelector('input[name="address"]').value = addressData.address || '';
        modal.querySelector('input[name="city"]').value = addressData.city || '';
        
        let isSalonState = modal.querySelector(`input[name="salon_state"][value="${addressData.state}"]`);
        if (isSalonState) {
            isSalonState.checked = true;
            modal.querySelector('#selected-salon-state-text').innerText = isSalonState.nextElementSibling.innerText;
            modal.querySelector('#selected-salon-state-text').style.color = '#000';
        }

        modal.querySelector('input[name="zip_code"]').value = addressData.zip_code;

        let isSalonCountry = modal.querySelector(`input[name="salon_country"][value="${addressData.country}"], input[name="salon_country"][data-value="${addressData.country}"]`);
        if (isSalonCountry) {
            isSalonCountry.checked = true;
            modal.querySelector('#selected-salon-country-text').innerText = isSalonCountry.nextElementSibling.innerText;
            modal.querySelector('#selected-salon-country-text').style.color = '#000';
        }
    }

    modal.addEventListener('hidden.bs.modal', event => {
        form.reset();
        form.removeAttribute('onsubmit');
        form.querySelector('.btn-text').innerText = 'UPDATE';
        form.querySelector('.create-error-msg').innerHTML = '';
        form.querySelector('.create-error-msg').classList.remove('active');
        document.getElementById('selected-salon-status-type').innerText = 'Status';
        document.getElementById('selected-salon-status-type').style.color = '#A9A9A9';
        document.getElementById('selected-salon-state-text').innerText = 'State';
        document.getElementById('selected-salon-state-text').style.color = '#A9A9A9';
        document.getElementById('selected-salon-country-text').innerText = 'Country';
        document.getElementById('selected-salon-country-text').style.color = '#A9A9A9';
        modal.querySelector(`#salon-${type}-div`).classList.add('hide');
    })

    modal.querySelector(`#salon-${type}-div`).classList.remove('hide');
    document.querySelector('.salonEditModal').click();
}


async function updateSalonNotes(event, id) {
    event.preventDefault();
    let form = event.currentTarget;
    let formData = new FormData(form);
    let formObject = formDataToObject(formData);
    let button = form.querySelector('button[type="submit"]');
    let buttonText = button.innerText;
    let errorMsg = form.querySelector('.create-error-msg');

    let data = { "partnership_application": { "admin_comment": formObject.admin_comment } };

    try {
        errorMsg.innerHTML = '';
        let token = getCookie('admin_access');
        let headers = {
            "Authorization": `Bearer ${token}`,
            "Content-Type": 'application/json'
        };

        beforeLoad(button);
        let response = await requestAPI(`${apiURL}/admin/salon-profiles/${id}`, JSON.stringify(data), headers, 'PATCH');
        response.json().then(function(res) {
            if (response.status == 200) {
                form.reset();
                form.removeAttribute('onsubmit');
                afterLoad(button, 'UPDATED');
                document.getElementById('salon-notes').innerText = res.data.partnership_application.admin_comment;
                
                setTimeout(() => {
                    afterLoad(button, 'UPDATE');
                    document.querySelector('.salonEditModal').click();
                }, 1200)
            }
            else {
                afterLoad(button, 'ERROR');
                errorMsg.classList.add('active');
                displayMessages(res.messages, errorMsg);
            }
        })
    }
    catch (err) {
        console.log(err);
    }
}


async function updateSalonStatus(event, id) {
    event.preventDefault();
    let form = event.currentTarget;
    let formData = new FormData(form);
    let formObject = formDataToObject(formData);
    let button = form.querySelector('button[type="submit"]');
    let buttonText = button.innerText;
    let errorMsg = form.querySelector('.create-error-msg');

    let data = { "partnership_application": { "status": formObject.salon_status } };

    try {
        errorMsg.classList.remove('active');
        errorMsg.innerHTML = '';
        let token = getCookie('admin_access');
        let headers = {
            "Authorization": `Bearer ${token}`,
            "Content-Type": 'application/json'
        };

        beforeLoad(button);
        let response = await requestAPI(`${apiURL}/admin/salon-profiles/${id}`, JSON.stringify(data), headers, 'PATCH');
        response.json().then(function(res) {
            if (response.status == 200) {
                form.reset();
                form.removeAttribute('onsubmit');
                afterLoad(button, 'UPDATED');
                document.querySelector('#salon-current-status').innerText = captalizeFirstLetter(res.data.partnership_application.status);
                
                setTimeout(() => {
                    afterLoad(button, 'UPDATE');
                    document.querySelector('.salonEditModal').click();
                }, 1200)
            }
            else {
                afterLoad(button, 'ERROR');
                errorMsg.classList.add('active');
                displayMessages(res.messages, errorMsg);
            }
        })
    }
    catch (err) {
        console.log(err);
    }
}


async function updateSalonContact(event, id) {
    event.preventDefault();
    let form = event.currentTarget;
    let formData = new FormData(form);
    let data = formDataToObject(formData);
    let button = form.querySelector('button[type="submit"]');
    let buttonText = button.innerText;
    let errorMsg = form.querySelector('.create-error-msg');

    if (data.contact_name.trim().length == 0) {
        errorMsg.classList.add('active');
        errorMsg.innerHTML = 'Enter valid contact name';
        return false;
    }
    else if (emailRegex.test(data.email) == false) {
        errorMsg.classList.add('active');
        errorMsg.innerHTML = 'Enter valid email';
        return false;
    }
    else if (phoneRegex.test(data.phone) == false) {
        errorMsg.classList.add('active');
        errorMsg.innerHTML = 'Please enter a valid number with country code';
        return false;
    }

    try {
        errorMsg.classList.remove('active');
        errorMsg.innerHTML = '';
        let updateData = {
            "contact_name": data.contact_name,
            "user": {
                "email": data.email,
                "phone": data.phone
            }
        };

        let token = getCookie('admin_access');
        let headers = {
            "Authorization": `Bearer ${token}`,
            "Content-Type": 'application/json'
        };

        beforeLoad(button);
        let response = await requestAPI(`${apiURL}/admin/salon-profiles/${id}`, JSON.stringify(updateData), headers, 'PATCH');
        response.json().then(function(res) {
            if (response.status == 200) {
                form.reset();
                form.removeAttribute('onsubmit');
                afterLoad(button, 'UPDATED');
                
                document.getElementById('salon-contact-name').innerText = res.data.contact_name;
                document.getElementById('salon-user-email').innerText = res.data.user.email;
                document.getElementById('salon-user-phone').innerText = res.data.user.phone;
                
                setTimeout(() => {
                    afterLoad(button, 'UPDATE');
                    document.querySelector('.salonEditModal').click();
                }, 1200)
            }
            else {
                afterLoad(button, 'ERROR');
                errorMsg.classList.add('active');
                displayMessages(res.messages, errorMsg);
            }
        })
    }
    catch (err) {
        console.log(err);
    }
}


async function updateSalonAddress(event, id) {
    event.preventDefault();
    let form = event.currentTarget;
    let formData = new FormData(form);
    let data = formDataToObject(formData);
    let button = form.querySelector('button[type="submit"]');
    let buttonText = button.innerText;
    let errorMsg = form.querySelector('.create-error-msg');

    if (data.address.trim().length == 0) {
        errorMsg.classList.add('active');
        errorMsg.innerHTML = 'Enter address';
        return false;
    }
    else if (data.city.trim().length == 0) {
        errorMsg.classList.add('active');
        errorMsg.innerHTML = 'Enter city name';
        return false;
    }
    else if ((!data.salon_state)) {
        errorMsg.classList.add('active');
        errorMsg.innerHTML = 'Select a state';
        return false;
    }
    else if (data.zip_code.trim().length != 5) {
        errorMsg.classList.add('active');
        errorMsg.innerHTML = 'Enter valid zip code';
        return false;
    }
    else if ((!data.salon_country)) {
        errorMsg.classList.add('active');
        errorMsg.innerHTML = 'Select a country';
        return false;
    }

    try {
        errorMsg.classList.remove('active');
        errorMsg.innerHTML = '';
        let updateData = {
            "partnership_application": {
                "salon_address": {
                    "street1": data.address,
                    "city": data.city,
                    "state": data.salon_state,
                    "country": data.salon_country,
                    "zip_code": data.zip_code
                }
            }
        };

        let token = getCookie('admin_access');
        let headers = {
            "Authorization": `Bearer ${token}`,
            "Content-Type": 'application/json'
        };

        beforeLoad(button);
        let response = await requestAPI(`${apiURL}/admin/salon-profiles/${id}`, JSON.stringify(updateData), headers, 'PATCH');
        response.json().then(function(res) {
            if (response.status == 200) {
                form.reset();
                form.removeAttribute('onsubmit');
                afterLoad(button, 'UPDATED');
                
                document.getElementById('salon-current-address').innerText = `${res.data.partnership_application.salon_address.street1}, ${res.data.partnership_application.salon_address.city}, ${res.data.partnership_application.salon_address.state} ${res.data.partnership_application.salon_address.zip_code} ${res.data.partnership_application.salon_address.country}`;
                document.getElementById('address-update-div').setAttribute('onclick', `openSalonEditModal('address', {address: '${res.data.partnership_application.salon_address.street1}', city: '${res.data.partnership_application.salon_address.city}', state: '${res.data.partnership_application.salon_address.state}', zip_code: '${res.data.partnership_application.salon_address.zip_code}', country: '${res.data.partnership_application.salon_address.country}'})`);
                
                setTimeout(() => {
                    afterLoad(button, 'UPDATE');
                    document.querySelector('.salonEditModal').click();
                }, 1200)
            }
            else {
                afterLoad(button, 'ERROR');
                errorMsg.classList.add('active');
                displayMessages(res.messages, errorMsg);
            }
        })
    }
    catch (err) {
        console.log(err);
    }
}