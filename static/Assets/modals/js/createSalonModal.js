let paymentTypeDropdown = document.getElementById('payment-type-dropdown');
let paymentTypeDropdownBtn = document.getElementById('payment-type');
let paymentTypeOptions = document.querySelectorAll('input[name="payment_type"]');

let legalStatesDropdown = document.getElementById('legal-states-dropdown');
let legalStatesField = document.getElementById('legal-states-field');
let legalCountryDropdown = document.getElementById('legal-country-dropdown');
let legalCountryField = document.getElementById('legal-country-field');

let salonStatesDropdown = document.getElementById('salon-states-dropdown');
let salonStatesField = document.getElementById('salon-states-field');
let salonCountryDropdown = document.getElementById('salon-country-dropdown');
let salonCountryField = document.getElementById('salon-country-field');

let paymentStatesDropdown = document.getElementById('payment-states-dropdown');
let paymentStatesField = document.getElementById('payment-states-field');
let paymentCountryDropdown = document.getElementById('payment-country-dropdown');
let paymentCountryField = document.getElementById('payment-country-field');

let supportedImageWidth = 1000;
let supportedImageHeight = 1000;

paymentTypeDropdownBtn.addEventListener('click', toggleDropdown);
legalStatesField.addEventListener('click', toggleDropdown);
legalCountryField.addEventListener('click', toggleDropdown);
salonStatesField.addEventListener('click', toggleDropdown);
salonCountryField.addEventListener('click', toggleDropdown);
paymentStatesField.addEventListener('click', toggleDropdown);
paymentCountryField.addEventListener('click', toggleDropdown);


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
    if((!paymentTypeDropdownBtn.contains(event.target)) && paymentTypeDropdown.style.display == 'flex') {
        paymentTypeDropdown.style.display = 'none';
    }
    else if ((!legalStatesField.contains(event.target)) && legalStatesDropdown.style.display == 'flex') {
        legalStatesDropdown.style.display = 'none';
    }
    else if ((!legalCountryField.contains(event.target)) && legalCountryDropdown.style.display == 'flex') {
        legalCountryDropdown.style.display = 'none';
    }
    else if ((!salonStatesField.contains(event.target)) && salonStatesDropdown.style.display == 'flex') {
        salonStatesDropdown.style.display = 'none';
    }
    else if ((!salonCountryField.contains(event.target)) && salonCountryDropdown.style.display == 'flex') {
        salonCountryDropdown.style.display = 'none';
    }
    else if ((!paymentStatesField.contains(event.target)) && paymentStatesDropdown.style.display == 'flex') {
        paymentStatesDropdown.style.display = 'none';
    }
    else if ((!paymentCountryField.contains(event.target)) && paymentCountryDropdown.style.display == 'flex') {
        paymentCountryDropdown.style.display = 'none';
    }
}

document.body.addEventListener('click', closeDropdowns);


function populateStateCountryDropdowns() {
    statesList.forEach((state, index) => {
        legalStatesDropdown.insertAdjacentHTML('beforeend', `<div class="radio-btn state-item-list" data-id="${index+1}">
                                                                <input onchange="selectState(this, 'legal');" id="legal-state-${index}" type="radio" data-value="${state.abbreviation}" value="${state.name}" name="legal_state" />
                                                                <label for="legal-state-${index}" data-name="${state.name}" class="radio-label">${state.name}</label>
                                                            </div>`)
        salonStatesDropdown.insertAdjacentHTML('beforeend', `<div class="radio-btn state-item-list" data-id="${index+1}">
                                                                <input onchange="selectState(this, 'salon');" id="salon-state-${index}" type="radio" data-value="${state.abbreviation}" value="${state.name}" name="salon_state" />
                                                                <label for="salon-state-${index}" data-name="${state.name}" class="radio-label">${state.name}</label>
                                                            </div>`)
        paymentStatesDropdown.insertAdjacentHTML('beforeend', `<div class="radio-btn state-item-list" data-id="${index+1}">
                                                                    <input onchange="selectState(this, 'payment');" id="payment-state-${index}" type="radio" data-value="${state.abbreviation}" value="${state.name}" name="payment_state" />
                                                                    <label for="payment-state-${index}" data-name="${state.name}" class="radio-label">${state.name}</label>
                                                                </div>`)
    })

    countryList.forEach((country, index) => {
        legalCountryDropdown.insertAdjacentHTML('beforeend', `<div class="radio-btn country-item-list" data-id="${index+1}">
                                                                <input onchange="selectCountry(this, 'legal');" id="legal-country-${index}" type="radio" value="${country['Country']}" name="legal_country" />
                                                                <label for="legal-country-${index}" data-name="${country['Country']}" class="radio-label">${country['Country']}</label>
                                                            </div>`)
        salonCountryDropdown.insertAdjacentHTML('beforeend', `<div class="radio-btn country-item-list" data-id="${index+1}">
                                                                <input onchange="selectCountry(this, 'salon');" id="salon-country-${index}" type="radio" value="${country['Country']}" name="salon_country" />
                                                                <label for="salon-country-${index}" data-name="${country['Country']}" class="radio-label">${country['Country']}</label>
                                                            </div>`)
        paymentCountryDropdown.insertAdjacentHTML('beforeend', `<div class="radio-btn country-item-list" data-id="${index+1}">
                                                                    <input onchange="selectCountry(this, 'payment');" id="payment-country-${index}" type="radio" value="${country['Country']}" name="payment_country" />
                                                                    <label for="payment-country-${index}" data-name="${country['Country']}" class="radio-label">${country['Country']}</label>
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


function selectPaymentType(event) {
    let inputElement = event.target;
    let modal = document.getElementById('salonCreate');
    
    if(inputElement.checked) {
        document.getElementById('selected-payment-type').innerText = inputElement.nextElementSibling.innerText;
        document.getElementById('selected-payment-type').style.color = '#000';
        if (inputElement.value == 'ach') {
            modal.querySelectorAll('input[data-name="for_ach"]').forEach((input) => {
                input.classList.remove('hide');
            })
            modal.querySelectorAll('input[data-name="for_cheque"]').forEach((input) => {
                input.classList.add('hide');
            })
            modal.querySelectorAll('div[data-name="for_cheque"]').forEach((input) => {
                input.classList.add('hide');
            })
        }
        else if (inputElement.value == 'check') {
            modal.querySelectorAll('input[data-name="for_cheque"]').forEach((input) => {
                input.classList.remove('hide');
            })
            modal.querySelectorAll('div[data-name="for_cheque"]').forEach((input) => {
                input.classList.remove('hide');
            })
            modal.querySelectorAll('input[data-name="for_ach"]').forEach((input) => {
                input.classList.add('hide');
            })
        }
    }
}


// function previewImage(event) {
//     let imageInput = event.currentTarget;
//     let image = imageInput.files;
//     let imageTag = imageInput.closest('label').querySelector('.salon-image');
//     imageTag.src = window.URL.createObjectURL(image[0]);
//     imageTag.classList.remove('hide');
//     imageInput.closest('label').querySelector('svg').style.display = 'none';
//     imageInput.closest('label').querySelector('span').style.display = 'none';
// }

function previewImage(event, input) {
    let label = input.closest('label');
        const img = document.createElement('img');
        const selectedImage = input.files[0];
        const objectURL = URL.createObjectURL(selectedImage);
        let imageTag = label.querySelector('.salon-image');
        img.onload = function handleLoad() {
            // console.log(`Width: ${img.width}, Height: ${img.height}`);
    
            if (img.width == supportedImageWidth && img.height == supportedImageHeight) {
                imageTag.src = objectURL;
                imageTag.classList.remove('hide');
                label.querySelector('svg').style.display = 'none';
                label.querySelectorAll('span').forEach((span) => {
                    span.style.display = 'none';
                })
                // document.querySelector('.error-div').classList.add('hide');
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


function openCreateSalonModal() {
    let modal = document.getElementById('salonCreate');
    let form = modal.querySelector('form');
    form.setAttribute('onsubmit', 'createSalonForm(event)');
    let imageLabel = modal.querySelector('.image-label');
    modal.addEventListener('hidden.bs.modal', event => {
        form.reset();
        imageLabel.querySelector('.salon-image').src = '';
        imageLabel.querySelector('.salon-image').classList.add('hide');
        imageLabel.querySelector('svg').style.display = "block";
        imageLabel.querySelector('span').style.display = "block";
        form.querySelector('.create-error-msg').innerHTML = '';
        form.querySelector('.btn-text').innerText = 'SAVE';
        form.querySelector('.create-error-msg').classList.remove('active');
        document.getElementById(`selected-legal-state-text`).innerText = 'State';
        document.getElementById(`selected-legal-state-text`).style.color = '#A9A9A9';
        document.getElementById(`selected-salon-state-text`).innerText = 'State';
        document.getElementById(`selected-salon-state-text`).style.color = '#A9A9A9';
        document.getElementById(`selected-payment-state-text`).innerText = 'State';
        document.getElementById(`selected-payment-state-text`).style.color = '#A9A9A9';
        document.getElementById(`selected-legal-country-text`).innerText = 'Country';
        document.getElementById(`selected-legal-country-text`).style.color = '#A9A9A9';
        document.getElementById(`selected-salon-country-text`).innerText = 'Country';
        document.getElementById(`selected-salon-country-text`).style.color = '#A9A9A9';
        document.getElementById(`selected-payment-country-text`).innerText = 'Country';
        document.getElementById(`selected-payment-country-text`).style.color = '#A9A9A9';
    })
    document.querySelector('.salonCreate').click();
}


async function createSalonForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let imageInput = form.querySelector('#salon-image');
    let errorMsg = form.querySelector('.create-error-msg');
    let button = form.querySelector('button[type="submit"]');
    let buttonText = button.innerText;
    let formData = new FormData(form);
    let data = formDataToObject(formData);

    let checkValidations = true;
    errorMsg.innerHTML = '';
    if (data.person_name.trim().length == 0 || phoneRegex.test(data.person_phone) == false || /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(data.person_email) == false || data.salon_name.trim().length == 0) {
        errorMsg.innerHTML += "General Information: Enter valid data in all fields <br />";
        checkValidations = false;
    }
    if (data.legal_name.trim().length == 0 || data.business_name.trim().length == 0 || data.tax_id.trim().length == 0 || data.street_number.trim().length == 0) {
        errorMsg.innerHTML += "Entity Information: Enter valid data in all fields <br />";
        checkValidations = false;
    }
    if (data.legal_street1.trim().length == 0 || data.legal_street2.trim().length == 0 || data.legal_city.trim().length == 0 || (!data.legal_state) || data.legal_zip_code.trim().length != 5 || (!data.legal_country)) {
        errorMsg.innerHTML += "Legal Address: Enter valid data in all fields <br />";
        checkValidations = false;
    }
    if (imageInput.files.length == 0 || data.salon_website.trim().length == 0 || data.salon_map.trim().length == 0 || phoneRegex.test(data.salon_phone) == false || data.salon_description.trim().length == 0) {
        errorMsg.innerHTML += "Salon Information: Enter valid data in all fields <br />";
        checkValidations = false;
    }
    if (data.salon_street1.trim().length == 0 || data.salon_street2.trim().length == 0 || data.salon_city.trim().length == 0 || (!data.salon_state) || data.salon_zip_code.trim().length != 5 || (!data.salon_country)) {
        errorMsg.innerHTML += "Salon Address: Enter valid data in all fields <br />";
        checkValidations = false;
    }
    if (data.payment_type == 'ach') {
        if (data.name_on_account.trim().length == 0 || data.bank_name.trim().length == 0 || data.routing_number.trim().length == 0 || data.account_number.trim().length == 0) {
            errorMsg.innerHTML += "Payment Detail: Enter valid data in all fields";
            checkValidations = false;
        }
    }
    else {
        if (data.payment_street1.trim().length == 0 || data.payment_street2.trim().length == 0 || data.payment_city.trim().length == 0 || (!data.payment_state) || data.payment_zip_code.trim().length != 5 || (!data.payment_country)) {
            errorMsg.innerHTML += "Payment Detail: Enter valid data in all fields";
            checkValidations = false;
        }
    }
    if (!checkValidations) {
        errorMsg.classList.add('active');
        return false;
    }
    else {
        try {
            errorMsg.classList.remove('active');
            let salonData = {
                "salon_name": data.salon_name,
                "contact_name": data.person_name,
                "user": {
                    "phone": data.person_phone,
                    "email": data.person_email,
                    "role": "salon"
                },
                "partnership_application": {
                    "salon_website": data.salon_website,
                    "salon_phone": data.salon_phone,
                    "salon_map": data.salon_map,
                    "salon_description": data.salon_description,
                    "person_name": data.person_name,
                    "person_email": data.person_email,
                    "person_phone": data.person_phone,
                    "legal_name": data.legal_name,
                    "business_name": data.business_name,
                    "tax_id": data.tax_id,
                    "payment_type": data.payment_type,
                    "legal_address": {
                        "street1": data.legal_street1,
                        "street2": data.legal_street2,
                        "zip_code": data.legal_zip_code,
                        "city": data.legal_city,
                        "state": data.legal_state,
                        "country": data.legal_country
                    },
                    "salon_address": {
                        "street1": data.salon_street1,
                        "street2": data.salon_street2,
                        "zip_code": data.salon_zip_code,
                        "city": data.salon_city,
                        "state": data.salon_state,
                        "country": data.salon_country
                    },
                    "other_information": {
                        "hear_about_us": "Current client",
                        "looking_in_mens_products": "",
                        "extra_info": "",
                        "annual_sales": 5000,
                        "number_of_location": 3
                    }
                }
            }
            if (data.payment_type == 'ach') {
                salonData.partnership_application.name_on_account = data.name_on_account;
                salonData.partnership_application.bank_name = data.bank_name;
                salonData.partnership_application.routing_number = data.routing_number;
                salonData.partnership_application.account_number = data.account_number;
            }
            else {
                salonData.partnership_application.payment_address = {
                    "street1": data.payment_street1,
                    "street2": data.payment_street2,
                    "zip_code": data.payment_zip_code,
                    "city": data.payment_city,
                    "state": data.payment_state,
                    "country": data.payment_country
                }
            }
            let token = getCookie('admin_access');
            let headers = {
                "Authorization": `Bearer ${token}`,
                "Content-Type": 'application/json'
            }
            beforeLoad(button);
            let response = await requestAPI(`${apiURL}/admin/salon-profiles`, JSON.stringify(salonData), headers, 'POST');
            response.json().then(async function(res) {
                // console.log(res);

                if (response.status == 201) {
                    delete headers["Content-Type"];
                    let imageFormData = new FormData();
                    imageFormData.append('salon_picture', imageInput.files[0]);

                    let resp = await requestAPI(`${apiURL}/admin/salon-profiles/${res.data.id}`, imageFormData, headers, 'PATCH');
                    resp.json().then(function(updateRes) {

                        if (resp.status == 200) {
                            afterLoad(button, 'SAVED');
                            getData();
                            setTimeout(() => {
                                afterLoad(button, 'SAVE');
                                document.querySelector('.salonCreate').click();
                            }, 1000);
                        }
                        else {
                            afterLoad(button, 'ERROR');
                            errorMsg.classList.add('active');
                            let keys = Object.keys(updateRes.messages);
                            
                            keys.forEach((key) => {
                                errorMsg.innerHTML += `${key}: ${updateRes.messages[key]} <br />`;
                            })
                        }
                    })
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
            afterLoad(button, 'ERROR');
            console.log(err);
        }
    }
}