let sourceModalHeaderText = document.getElementById('source-modal-header-text');

let typeDropdown = document.getElementById('source-type-dropdown');
let typeField = document.getElementById('source-type-field');

let sourceOwnerDropdown = document.getElementById('source-owner-dropdown');
let sourceOwnerField = document.getElementById('source-owner-field');

let sourceChannelDropdown = document.getElementById('source-channel-dropdown');
let sourceChannelField = document.getElementById('source-channel-field');

let countryDropdown = document.getElementById('country-dropdown');
let countryField = document.getElementById('country-field');
let selectedCountry = null;

let sourceTypeData = [];
let sourceOwnerData = [];
let sourceChannelData = [];

// typeField.addEventListener('click', toggleDropdown);


// async function getSourceTypes() {
//     let token = getCookie('admin_access');
//     let headers = { "Authorization": `Bearer ${token}` };
    
// }

// window.addEventListener('load', getSourceTypes);


async function populateDropdowns() {
    countryList.forEach((country, index) => {
        countryDropdown.insertAdjacentHTML('beforeend', `<div class="radio-btn country-item-list" data-id="${index+1}">
                                                            <input onchange="selectCountry(this);" id="country-${index}" type="radio" data-value="${country['Country']}" value="${country['Alpha-2 code']}" name="country_radio" />
                                                            <label for="country-${index}" data-name="${country['Country']}" data-value="${country['Alpha-2 code']}" class="radio-label">${country['Country']}</label>
                                                        </div>`)
    })

    let token = getCookie('admin_access');
    let headers = { "Authorization": `Bearer ${token}` };
    let responseSourceTypeList = await requestAPI(`${apiURL}/admin/sources/types?page=1&perPage=10000`, null, headers, 'GET');
    let responseSourceOwnerList = await requestAPI(`${apiURL}/admin/salon-profiles?user__is_blocked=false&page=1&perPage=10000&ordering=-created_at`, null, headers, 'GET');
    let responseSourceChannelList = await requestAPI(`${apiURL}/admin/sources/channels?page=1&perPage=10000&ordering=-id`, null, headers, 'GET');
    responseSourceTypeList.json().then(function(res) {
        if (responseSourceTypeList.status == 200) {
            sourceTypeData = [...res.data];
            res.data.forEach((sourceType) => {
                typeDropdown.innerHTML += `<div class="radio-btn source-type-item-list" data-id="${sourceType.id}">
                                                <input onchange="selectType(this);" id="type-${sourceType.id}" type="radio" value="${sourceType.id}" name="type" />
                                                <label for="type-${sourceType.id}" class="radio-label">${sourceType.name}</label>
                                            </div>`;
            })
        }
    })
    responseSourceOwnerList.json().then(function(res) {
        sourceOwnerData = [...res.data];
        sourceOwnerData.unshift({'salon_name': 'HOMME', 'user': {'id': 'homme-management'}})
        sourceOwnerData.forEach((owner) => {
            sourceOwnerDropdown.insertAdjacentHTML('beforeend', `<div class="radio-btn source-owner-item-list" data-id="${owner.user.id}">
                                                                    <input onchange="selectSourceOwner(this);" id="owner-${owner.user.id}" type="radio" value="${owner.user.id}" name="owner" />
                                                                    <label for="owner-${owner.user.id}" class="radio-label">${owner.salon_name}</label>
                                                                </div>`);
        })
    })
    responseSourceChannelList.json().then(function(res) {
        sourceChannelData = [...res.data];
        sourceChannelData.forEach((channel) => {
            sourceChannelDropdown.insertAdjacentHTML('beforeend', `<div class="radio-btn source-channel-item-list" data-id="${channel.id}">
                                                                        <input onchange="selectSourceChannel(this);" id="channel-${channel.id}" type="radio" value="${channel.id}" name="channel" />
                                                                        <label for="channel-${channel.id}" class="radio-label">${channel.name}</label>
                                                                    </div>`);
        })
    })
}

window.addEventListener('load', populateDropdowns);


typeField.addEventListener('focus', function() {
    typeDropdown.style.display = 'flex';
})

typeField.addEventListener('blur', function(event) {
    setTimeout(() => {
        typeDropdown.style.display = 'none';
    }, 200);
})

typeField.addEventListener('input', function() {
    let filteredSourceType = [];
    filteredSourceType = sourceTypeData.filter(type => type.name.toLowerCase().includes(this.value.toLowerCase())).map((type => type.id));
    if (filteredSourceType.length == 0) {
        document.getElementById('no-source-type-text').classList.remove('hide');
        document.querySelectorAll('.source-type-item-list').forEach((item) => item.classList.add('hide'));
    }
    else {
        document.getElementById('no-source-type-text').classList.add('hide');
        document.querySelectorAll('.source-type-item-list').forEach((item) => {
            let itemID = item.getAttribute('data-id');
            if (filteredSourceType.includes(parseInt(itemID, 10))) {
                item.classList.remove('hide');
            }
            else {
                item.classList.add('hide');
            }
        })
    }
})


sourceOwnerField.addEventListener('focus', function() {
    sourceOwnerDropdown.style.display = 'flex';
})

sourceOwnerField.addEventListener('blur', function(event) {
    setTimeout(() => {
        sourceOwnerDropdown.style.display = 'none';
    }, 200);
})

sourceOwnerField.addEventListener('input', function() {
    let filteredSourceOwner = [];
    filteredSourceOwner = sourceOwnerData.filter(owner => owner.salon_name.toLowerCase().includes(this.value.toLowerCase())).map((owner => String(owner.user.id)));
    if (filteredSourceOwner.length == 0) {
        document.getElementById('no-source-owner-text').classList.remove('hide');
        document.querySelectorAll('.source-owner-item-list').forEach((item) => item.classList.add('hide'));
    }
    else {
        document.getElementById('no-source-owner-text').classList.add('hide');
        document.querySelectorAll('.source-owner-item-list').forEach((item) => {
            let itemID = item.getAttribute('data-id');
            if (filteredSourceOwner.includes(itemID)) {
                item.classList.remove('hide');
            }
            else {
                item.classList.add('hide');
            }
        })
    }
})


sourceChannelField.addEventListener('focus', function() {
    sourceChannelDropdown.style.display = 'flex';
})

sourceChannelField.addEventListener('blur', function(event) {
    setTimeout(() => {
        sourceChannelDropdown.style.display = 'none';
    }, 200);
})

sourceChannelField.addEventListener('input', function() {
    let filteredSourceChannel = [];
    filteredSourceChannel = sourceChannelData.filter(channel => channel.name.toLowerCase().includes(this.value.toLowerCase())).map((channel => channel.id));
    if (filteredSourceChannel.length == 0) {
        document.getElementById('no-source-channel-text').classList.remove('hide');
        document.querySelectorAll('.source-channel-item-list').forEach((item) => item.classList.add('hide'));
    }
    else {
        document.getElementById('no-source-channel-text').classList.add('hide');
        document.querySelectorAll('.source-channel-item-list').forEach((item) => {
            let itemID = item.getAttribute('data-id');
            if (filteredSourceChannel.includes(parseInt(itemID, 10))) {
                item.classList.remove('hide');
            }
            else {
                item.classList.add('hide');
            }
        })
    }
})


function selectCountry(inputField) {
    if (inputField.checked) {
        document.getElementById('selected-country-text').innerText = inputField.nextElementSibling.innerText;
        document.getElementById('selected-country-text').style.color = '#030706';
        selectedCountry = inputField.value;
    }
}


// countryField.addEventListener('focus', function() {
//     countryDropdown.style.display = 'flex';
// })

// countryField.addEventListener('blur', function(event) {
//     setTimeout(() => {
//         countryDropdown.style.display = 'none';
//     }, 200);
// })

countryField.addEventListener('click', toggleDropdown);

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


function closeCountryDropdown(event) {
    if ((!countryField.contains(event.target)) && countryDropdown.style.display == 'flex') {
        countryDropdown.style.display = 'none';
    }
}

document.body.addEventListener('click', closeCountryDropdown);


function selectSourceOwner(inputField) {
    if (inputField.checked) {
        sourceOwnerField.value = inputField.nextElementSibling.innerText;
    }
}


function selectSourceChannel(inputField) {
    if (inputField.checked) {
        sourceChannelField.value = inputField.nextElementSibling.innerText;
    }
}


function selectType(inputField) {
    if (inputField.checked) {
        typeField.value = inputField.nextElementSibling.innerText;
        // document.getElementById(`selected-type-text`).style.color = '#000';
    }
}


function openCreateSourceModal() {
    let modal = document.getElementById('createSource');
    let form = modal.querySelector('form');
    form.setAttribute('onsubmit', 'createSourceForm(event);');
    sourceModalHeaderText.innerText = 'Create New Source';
    modal.addEventListener('hidden.bs.modal', event => {
        form.reset();
        form.removeAttribute('onsubmit');
        selectedCountry = null;
        document.getElementById('selected-country-text').innerText = 'Country';
        document.getElementById('selected-country-text').style.color = '#A9A9A9';
        form.querySelector('.create-error-msg').innerText = '';
        form.querySelector('.create-error-msg').classList.remove('active');
        form.querySelector('.btn-text').innerText = 'CREATE';
    })
    document.querySelector('.createSource').click();
}


async function createSourceForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let errorMsg = form.querySelector('.create-error-msg');
    let formData = new FormData(form);
    let data = formDataToObject(formData);
    let button = form.querySelector('button[type="submit"]');
    let buttonText = button.innerText;

    if (data.name.trim().length == 0) {
        errorMsg.innerText = 'Enter valid source name';
        errorMsg.classList.add('active');
        return false;
    }
    // else if (data.embedded_string.trim().length == 0) {
    //     errorMsg.innerText = 'Enter valid embedded string';
    //     errorMsg.classList.add('active');
    //     return false;
    // }
    else if (!data.type) {
        errorMsg.innerText = 'Select a source type';
        errorMsg.classList.add('active');
        return false;
    }
    else if (!data.owner) {
        errorMsg.innerText = 'Select a source owner';
        errorMsg.classList.add('active');
        return false;
    }
    else if (data.description.trim().length == 0) {
        errorMsg.innerText = 'Enter description';
        errorMsg.classList.add('active');
        return false;
    }
    try {
        if (data.owner == 'homme-management')
            delete data.owner;
        if (selectedCountry != null)
            data.country = selectedCountry;
        errorMsg.innerText = '';
        errorMsg.classList.remove('active');
        let token = getCookie('admin_access');
        let headers = {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        };
        beforeLoad(button);
        let response = await requestAPI(`${apiURL}/admin/sources`, JSON.stringify(data), headers, 'POST');
        response.json().then(function(res) {

            if (response.status == 201) {
                form.removeAttribute('onsubmit');
                afterLoad(button, 'CREATED');
                if (location.pathname == '/customers/') {
                    setTimeout(() => {
                        afterLoad(button, buttonText);
                        document.querySelector('.createSource').click();
                        location.href = location.origin + '/source/';
                    }, 1000)
                }
                else {
                    getData();
                    setTimeout(() => {
                        afterLoad(button, buttonText);
                        document.querySelector('.createSource').click();
                    }, 1500)
                }
            }
            else if (response.status == 400) {
                afterLoad(button, 'ERROR');
                let keys = Object.keys(res.messages);
                keys.forEach((key) => {
                    errorMsg.innerHTML += `${key}: ${res.messages[key]}. <br />`;
                })
                errorMsg.classList.add('active');
            }
            else {
                afterLoad(button, 'ERROR');
                errorMsg.innerText = 'Error occurred! Retry later';
                errorMsg.classList.add('active');
            }
        })
    }
    catch (err) {
        console.log(err);
        afterLoad(button, buttonText);
        errorMsg.innerText = 'Error occurred! Retry later';
        errorMsg.classList.add('active');
    }
}


// async function loadMoreUsers(event) {
//     event.stopPropagation();
//     let token = getCookie('admin_access');
//     let headers = { "Authorization": `Bearer ${token}` };
//     pageNumber++;
//     let responseCustomerList = await requestAPI(`${apiURL}/admin/users?is_blocked=false&page=${pageNumber}&perPage=10`, null, headers, 'GET');
//     responseCustomerList.json().then(function(res) {
//         sourceOwnerData = [...res.data];
//         sourceOwnerData.forEach((customer) => {
//             customer.full_name = `${customer.first_name} ${customer.last_name}`;
//         })
//         res.data.forEach((customer) => {
//             customerDropdown.insertAdjacentHTML('beforeend', `<div class="radio-btn customer-item-list" data-id="${customer.user.id}">
//                                                                 <input onchange="selectCustomer(event);" id="cust-${customer.user.id}" type="radio" value="${customer.user.id}" name="customer_radio" />
//                                                                 <label for="cust-${customer.user.id}" class="radio-label">${customer.first_name} ${customer.last_name}</label>
//                                                             </div>`);
//         })
//     })
// }


function openEditSourceModal(modalId, id) {
    let modal = document.querySelector(`#${modalId}`);
    sourceModalHeaderText.innerText = 'Edit Source';
    modal.querySelector('.btn-text').innerText = 'UPDATE';
    let specificSourceData = sourceData.find(source => source.id == id);
    let form = modal.querySelector("form");
    form.setAttribute("onsubmit", `updateSourceForm(event, ${id})`);
    form.querySelector('input[name="name"]').value = specificSourceData.name;
    if (specificSourceData.type != null) {
        form.querySelector('input[name="source_type"]').value = specificSourceData.type.name;
        form.querySelector(`input[name="type"][value="${specificSourceData.type.id}"]`).checked = true;
    }
    if (specificSourceData.owner != null) {
        let ownerInput = form.querySelector(`input[name="owner"][value="${specificSourceData.owner.id}"]`);
        if (ownerInput)
            ownerInput.checked = true;
        form.querySelector('input[name="source_owner"]').value = specificSourceData.owner.name;
    }
    else {
        form.querySelector('input[name="source_owner"]').value = 'HOMME';
        form.querySelector(`input[name="owner"][value="homme-management"]`).checked = true;
    }
    if (specificSourceData.channel != null) {
        form.querySelector('input[name="source_channel"]').value = specificSourceData.channel.name;
        form.querySelector(`input[name="channel"][value="${specificSourceData.channel.id}"]`).checked = true;
    }
    form.querySelector('input[name="city"]').value = specificSourceData.city;
    let isCountry = document.querySelector(`label[data-value="${specificSourceData.country}"], label[data-name="${specificSourceData.country}"]`);
    if (isCountry)
        isCountry.click();
    form.querySelector('input[name="embedded_string"]').value = specificSourceData.embedded_string;
    form.querySelector('textarea[name="description"]').value = specificSourceData.description;
    form.querySelector('button[type="submit"]').disabled = false;
    modal.addEventListener('hidden.bs.modal', event => {
        sourceModalHeaderText.innerText = 'Create New Source';
        form.reset();
        form.removeAttribute("onsubmit");
        form.querySelector('button[type="submit"]').disabled = false;
        modal.querySelector('.btn-text').innerText = 'CREATE';
        selectedCountry = null;
        document.getElementById('selected-country-text').innerText = 'Country';
        document.getElementById('selected-country-text').style.color = '#A9A9A9';
        // document.querySelector('.error-div').classList.add('hide');
        document.querySelector('.create-error-msg').classList.remove('active');
        document.querySelector('.create-error-msg').innerText = "";
    })
    document.querySelector(`.${modalId}`).click();
}


async function updateSourceForm(event, id) {
    event.preventDefault();
    let form = event.currentTarget;
    let errorMsg = form.querySelector('.create-error-msg');
    let formData = new FormData(form);
    let data = formDataToObject(formData);
    let button = form.querySelector('button[type="submit"]');
    let buttonText = button.innerText;
    
    if (data.name.trim().length == 0) {
        errorMsg.innerText = 'Enter valid source name';
        errorMsg.classList.add('active');
        return false;
    }
    else if (!data.type) {
        errorMsg.innerText = 'Select a source type';
        errorMsg.classList.add('active');
        console.log('here');
        return false;
    }
    // else if (!data.owner) {
    //     errorMsg.innerText = 'Select a source owner';
    //     errorMsg.classList.add('active');
    //     return false;
    // }
    else if (data.description.trim().length == 0) {
        errorMsg.innerText = 'Enter description';
        errorMsg.classList.add('active');
        return false;
    }
    try {
        console.log('there');
        if ('owner' in data && data.owner == 'homme-management')
            data.owner = "";
        if (selectedCountry != null)
            data.country = selectedCountry;
        errorMsg.innerText = '';
        errorMsg.classList.remove('active');
        let token = getCookie('admin_access');
        let headers = {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        };
        beforeLoad(button);
        let response = await requestAPI(`${apiURL}/admin/sources/${id}`, JSON.stringify(data), headers, 'PATCH');
        response.json().then(function(res) {
            if (response.status == 200) {
                form.removeAttribute('onsubmit');
                afterLoad(button, 'UPDATED');
                getData();
                setTimeout(() => {
                    // afterLoad(button, buttonText);
                    document.querySelector('.createSource').click();
                }, 1500)
            }
            else {
                errorMsg.classList.add('active');
                afterLoad(button, 'ERROR');
                displayMessages(res.messages, errorMsg);
            }
        })
    }
    catch (err) {
        console.log(err);
        afterLoad(button, buttonText);
        errorMsg.innerText = 'Error occurred! Retry later';
        errorMsg.classList.add('active');
    }
}