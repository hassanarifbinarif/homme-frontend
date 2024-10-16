let statusTypeDropdown = document.getElementById('status-type-dropdown');
let statusTypeDropdownBtn = document.getElementById('status-type');
let statusTypeOptions = document.querySelectorAll('input[name="status"]');

let statesDropdown = document.getElementById('states-dropdown');
let statesField = document.getElementById('states-field');
let countryDropdown = document.getElementById('country-dropdown');
let countryField = document.getElementById('country-field');


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
    if((!statusTypeDropdownBtn.contains(event.target)) && statusTypeDropdown.style.display == 'flex') {
        statusTypeDropdown.style.display = 'none';
    }
    else if ((!statesField.contains(event.target)) && statesDropdown.style.display == 'flex') {
        statesDropdown.style.display = 'none';
    }
    else if ((!countryField.contains(event.target)) && countryDropdown.style.display == 'flex') {
        countryDropdown.style.display = 'none';
    }
}

document.body.addEventListener('click', closeDropdowns);
statusTypeDropdownBtn.addEventListener('click', toggleDropdown);
statesField.addEventListener('click', toggleDropdown);
countryField.addEventListener('click', toggleDropdown);


function populateStateCountryDropdowns() {
    statesList.forEach((state, index) => {
        statesDropdown.insertAdjacentHTML('beforeend', `<div class="radio-btn state-item-list" data-id="${index+1}">
                                                            <input onchange="selectState(this);" id="state-${index}" type="radio" value="${state.abbreviation}" name="state" />
                                                            <label for="state-${index}" data-name="${state.name}" class="radio-label">${state.name}</label>
                                                        </div>`)
    })

    countryList.forEach((country, index) => {
        countryDropdown.insertAdjacentHTML('beforeend', `<div class="radio-btn country-item-list" data-id="${index+1}">
                                                            <input onchange="selectCountry(this);" id="country-${index}" type="radio" data-value="${country['Country']}" value="${country['Alpha-2 code']}" name="country" />
                                                            <label for="country-${index}" data-name="${country['Country']}" class="radio-label">${country['Country']}</label>
                                                        </div>`)
    })
}


function selectStatusType(event) {
    let inputElement = event.target;
    if(inputElement.checked) {
        document.getElementById('selected-status-type').innerText = inputElement.nextElementSibling.innerText;
        document.getElementById('selected-status-type').style.color = '#000';
    }
}

function selectState(inputElement) {
    if(inputElement.checked) {
        document.getElementById('selected-state-text').innerText = inputElement.nextElementSibling.innerText;
        document.getElementById('selected-state-text').style.color = '#000';
    }
}

function selectCountry(inputElement) {
    if(inputElement.checked) {
        document.getElementById('selected-country-text').innerText = inputElement.nextElementSibling.innerText;
        document.getElementById('selected-country-text').style.color = '#000';
    }
}


function openCreateHairstylistModal(id) {
    let modal = document.getElementById('addHairstylist');
    let form = modal.querySelector('form');
    form.setAttribute('onsubmit', 'createHairstylistForm(event)');

    modal.addEventListener('hidden.bs.modal', event => {
        form.reset();
        form.removeAttribute('onsubmit');
        form.querySelector('.btn-text').innerText = 'ADD';
        form.querySelector('.create-error-msg').innerHTML = '';
        form.querySelector('.create-error-msg').classList.remove('active');
        document.getElementById('selected-status-type').innerText = 'Status';
        document.getElementById('selected-status-type').style.color = '#A9A9A9';
        document.getElementById('selected-state-text').innerText = 'State';
        document.getElementById('selected-state-text').style.color = '#A9A9A9';
        document.getElementById('selected-country-text').innerText = 'Country';
        document.getElementById('selected-country-text').style.color = '#A9A9A9';
    })

    document.querySelector('.addHairstylist').click();
}


async function createHairstylistForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let formData = new FormData(form);
    let data = formDataToObject(formData);
    let button = form.querySelector('button[type="submit"]');
    let errorMsg = form.querySelector('.create-error-msg');
    let hairStylistWrapper = document.getElementById('hair-stylist-wrapper');

    if (data.first_name.trim().length == 0 || data.last_name.trim().length == 0) {
        errorMsg.classList.add('active');
        errorMsg.innerHTML = 'Enter valid first and last names';
        return false;
    }
    else if (data.email != '' && emailRegex.test(data.email) == false) {
        errorMsg.classList.add('active');
        errorMsg.innerHTML = 'Enter valid email';
        return false;
    }
    else if (data.status != 'active' && data.status != 'inactive' && data.status != 'leave') {
        errorMsg.classList.add('active');
        errorMsg.innerHTML = 'Select a status';
        return false;
    }
    else if (data.phone != '' && phoneRegex.test(data.phone) == false) {
        errorMsg.classList.add('active');
        errorMsg.innerHTML = 'Please enter a valid number with country code';
        return false;
    }
    // else if (data.address.trim().length == 0) {
    //     errorMsg.classList.add('active');
    //     errorMsg.innerHTML = 'Enter valid address';
    //     return false;
    // }
    // else if (data.city.trim().length == 0) {
    //     errorMsg.classList.add('active');
    //     errorMsg.innerHTML = 'Enter valid city name';
    //     return false;
    // }
    // else if ((!data.state)) {
    //     errorMsg.classList.add('active');
    //     errorMsg.innerHTML = 'Select a state';
    //     return false;
    // }
    else if (data.zip_code != '' && data.zip_code.trim().length != 5) {
        errorMsg.classList.add('active');
        errorMsg.innerHTML = 'Enter valid zipcode';
        return false;
    }
    // else if ((!data.country)) {
    //     errorMsg.classList.add('active');
    //     errorMsg.innerHTML = 'Select a country';
    //     return false;
    // }
    else {
        errorMsg.classList.remove('active');
        errorMsg.innerHTML = '';
        data.salon = specific_salon_id;
        try {
            let token = getCookie('admin_access');
            let headers = {
                "Authorization": `Bearer ${token}`,
                "Content-Type": 'application/json'
            };
            beforeLoad(button);
            let response = await requestAPI(`${apiURL}/admin/salons/stylists`, JSON.stringify(data), headers, 'POST');
            response.json().then(function(res) {
                // console.log(res);    
                if (response.status == 201) {
                    form.reset();
                    form.removeAttribute('onsubmit');
                    afterLoad(button, 'ADDED');
                    
                    hairStylistWrapper.innerHTML += `<span data-role="stylist" data-id="${res.data.id}">${data.first_name} ${data.last_name}</span>`;
                    if (hairStylistWrapper.querySelector('.no-stylist')) {
                        hairStylistWrapper.querySelector('.no-stylist').classList.add('hide');
                    }

                    setTimeout(() => {
                        document.querySelector('.addHairstylist').click();
                    }, 1500)
                }
                else {
                    afterLoad(button, 'ERROR');
                    errorMsg.classList.add('active');
                    let keys = Object.keys(res.messages);
                    keys.forEach((key) => {
                        errorMsg.innerHTML += `${key}: ${res.messages[key]}. <br />`;
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


function openEditHairStylistModal(id, openState=null) {
    let modal = document.getElementById('addHairstylist');
    let form = modal.querySelector('form');
    form.setAttribute('onsubmit', `updateHairstylistForm(event, ${id})`);
    form.querySelector('.btn-text').innerText = 'UPDATE';
    modal.querySelector('.add-stylist-modal-header-text').innerText = 'Update Hairstylist';

    modal.addEventListener('hidden.bs.modal', event => {
        form.reset();
        form.removeAttribute('onsubmit');
        form.querySelector('.submit-btn').classList.remove('hide');
        form.querySelector('.btn-text').innerText = 'ADD';
        form.querySelector('.create-error-msg').innerHTML = '';
        form.querySelector('.create-error-msg').classList.remove('active');
        modal.querySelector('.add-stylist-modal-header-text').innerText = 'Add New Hairstylist';
        modal.querySelectorAll('input').forEach((input) => input.readOnly = false);
        modal.querySelector('#selected-status-type').innerText = 'Status';
        modal.querySelector('#selected-status-type').style.color = '#A9A9A9';
    })

    let specificStylist = stylistData.filter((stylist) => stylist.id == id)[0];
    modal.querySelector('input[name=first_name]').value = specificStylist.first_name;
    modal.querySelector('input[name=last_name]').value = specificStylist.last_name;
    modal.querySelector('input[name=email]').value = specificStylist.email;
    modal.querySelector('input[name=phone]').value = specificStylist.phone;
    modal.querySelector('#selected-status-type').innerText = captalizeFirstLetter(specificStylist.status == 'leave' ? 'on leave' : specificStylist.status);
    modal.querySelector('#selected-status-type').style.color = '#000';
    modal.querySelector(`input[value="${specificStylist.status}"]`).checked = true;
    modal.querySelector('input[name=address]').value = specificStylist.address;
    modal.querySelector('input[name=city]').value = specificStylist.city;
    // modal.querySelector('input[name=state]').value = specificStylist.state;
    modal.querySelector('input[name=zip_code]').value = specificStylist.zip_code;
    // modal.querySelector('input[name=country]').value = specificStylist.country;

    let isState = modal.querySelector(`input[name='state'][value='${specificStylist.state}']`);
    if (isState) {
        isState.checked = true;
        document.getElementById('selected-state-text').innerText = isState.nextElementSibling.innerText;
        document.getElementById('selected-state-text').style.color = '#000';
    }

    let isCountry = modal.querySelector(`input[name='country'][value='${specificStylist.country}'], input[name='country'][data-value='${specificStylist.country}']`);
    if (isCountry) {
        isCountry.checked = true;
        document.getElementById('selected-country-text').innerText = isCountry.nextElementSibling.innerText;
        document.getElementById('selected-country-text').style.color = '#000';
    }

    if (openState == 'disable') {
        form.removeAttribute('onsubmit');
        form.querySelector('.submit-btn').classList.add('hide');
        modal.querySelector('.add-stylist-modal-header-text').innerText = 'Hairstylist';
        modal.querySelectorAll('input').forEach((input) => input.readOnly = true);
        modal.querySelector('#selected-status-type').style.color = '#000';
    }

    document.querySelector('.addHairstylist').click();
}


async function updateHairstylistForm(event, id) {
    event.preventDefault();
    let form = event.currentTarget;
    let formData = new FormData(form);
    let data = formDataToObject(formData);
    let button = form.querySelector('button[type="submit"]');
    let errorMsg = form.querySelector('.create-error-msg');
    let hairStylistWrapper = document.getElementById('hair-stylist-wrapper');
    let hairStylistList = hairStylistWrapper.querySelectorAll('span[data-role="stylist"]');


    if (data.first_name.trim().length == 0 || data.last_name.trim().length == 0) {
        errorMsg.classList.add('active');
        errorMsg.innerHTML = 'Enter valid first and last names';
        return false;
    }
    else if (data.email != '' && emailRegex.test(data.email) == false) {
        errorMsg.classList.add('active');
        errorMsg.innerHTML = 'Enter valid email';
        return false;
    }
    else if (data.phone != '' && phoneRegex.test(data.phone) == false) {
        errorMsg.classList.add('active');
        errorMsg.innerHTML = 'Please enter a valid number with country code';
        return false;
    }
    else if (data.status != 'active' && data.status != 'inactive' && data.status != 'leave') {
        errorMsg.classList.add('active');
        errorMsg.innerHTML = 'Select a status';
        return false;
    }
    // else if (data.address.trim().length == 0) {
    //     errorMsg.classList.add('active');
    //     errorMsg.innerHTML = 'Enter valid address';
    //     return false;
    // }
    // else if (data.city.trim().length == 0) {
    //     errorMsg.classList.add('active');
    //     errorMsg.innerHTML = 'Enter valid city name';
    //     return false;
    // }
    // else if ((!data.state)) {
    //     errorMsg.classList.add('active');
    //     errorMsg.innerHTML = 'Enter valid state';
    //     return false;
    // }
    else if (data.zip_code != '' && data.zip_code.trim().length != 5) {
        errorMsg.classList.add('active');
        errorMsg.innerHTML = 'Enter valid zipcode';
        return false;
    }
    // else if ((!data.country)) {
    //     errorMsg.classList.add('active');
    //     errorMsg.innerHTML = 'Enter valid country';
    //     return false;
    // }
    else {
        errorMsg.classList.remove('active');
        errorMsg.innerHTML = '';
        data.salon = specific_salon_id;
        try {
            let token = getCookie('admin_access');
            let headers = {
                "Authorization": `Bearer ${token}`,
                "Content-Type": 'application/json'
            };
            beforeLoad(button);
            let response = await requestAPI(`${apiURL}/admin/salons/stylists/${id}`, JSON.stringify(data), headers, 'PATCH');
            response.json().then(function(res) {
                // console.log(res);
                if (response.status == 200) {
                    form.reset();
                    form.removeAttribute('onsubmit');
                    afterLoad(button, 'UPDATED');
                    let row = document.querySelector(`tr[data-id='stylist-row-${id}']`);
                    row.querySelector('input[name="fullname"]').value = `${res.data.first_name} ${res.data.last_name}`;
                    row.querySelector('input[name="phone"]').value = res.data.phone;
                    row.querySelector(`option[value="${res.data.status}"]`).selected = true;

                    stylistData.forEach((stylist, index) => {
                        if (stylist.id == res.data.id) {
                            stylistData[index] = res.data;
                            stylistData[index].action = ""
                        }
                    })

                    hairStylistList.forEach((stylist) => {
                        if (res.data.id == parseInt(stylist.getAttribute('data-id'))) {
                            stylist.innerText = `${res.data.first_name} ${res.data.last_name}`;
                        }
                    })

                    setTimeout(() => {
                        document.querySelector('.addHairstylist').click();
                    }, 1500)
                }
                else {
                    afterLoad(button, 'ERROR');
                    errorMsg.classList.add('active');
                    let keys = Object.keys(res.messages);
                    keys.forEach((key) => {
                        errorMsg.innerHTML += `${key}: ${res.messages[key]}. <br />`;
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