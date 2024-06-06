let typeDropdown = document.getElementById('type-dropdown');
let typeField = document.getElementById('type-field');

let sourceOwnerDropdown = document.getElementById('source-owner-dropdown');
let sourceOwnerField = document.getElementById('source-owner-field');

let sourceOwnerData = [];

typeField.addEventListener('click', toggleDropdown);


async function getSourceTypes() {
    let token = getCookie('admin_access');
    let headers = { "Authorization": `Bearer ${token}` };
    let response = await requestAPI(`${apiURL}/admin/sources/types?page=1&perPage=10000`, null, headers, 'GET');
    response.json().then(function(res) {
        if (response.status == 200) {
            res.data.forEach((sourceType) => {
                typeDropdown.innerHTML += `<div class="radio-btn type-item-list">
                                                <input onchange="selectType(this);" id="type-${sourceType.id}" type="radio" value="${sourceType.id}" name="type" />
                                                <label for="type-${sourceType.id}" class="radio-label">${sourceType.name}</label>
                                            </div>`;
            })
        }
    })
}

window.addEventListener('load', getSourceTypes);


async function populateDropdowns() {
    let token = getCookie('admin_access');
    let headers = { "Authorization": `Bearer ${token}` };
    let responseSourceOwnerList = await requestAPI(`${apiURL}/admin/users?is_blocked=false&page=1&perPage=10000`, null, headers, 'GET');
    responseSourceOwnerList.json().then(function(res) {
        sourceOwnerData = [...res.data];
        res.data.forEach((user) => {
            sourceOwnerDropdown.insertAdjacentHTML('beforeend', `<div class="radio-btn source-owner-item-list" data-id="${user.id}">
                                                                <input onchange="selectSourceOwner(this);" id="owner-${user.id}" type="radio" value="${user.id}" name="owner" />
                                                                <label for="owner-${user.id}" class="radio-label">${user.name}</label>
                                                            </div>`);
        })
    })
}

window.addEventListener('load', populateDropdowns);


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
    filteredSourceOwner = sourceOwnerData.filter(user => user.name.toLowerCase().includes(this.value.toLowerCase())).map((user => user.id));
    if (filteredSourceOwner.length == 0) {
        document.getElementById('no-source-owner-text').classList.remove('hide');
        document.querySelectorAll('.source-owner-item-list').forEach((item) => item.classList.add('hide'));
    }
    else {
        document.getElementById('no-source-owner-text').classList.add('hide');
        document.querySelectorAll('.source-owner-item-list').forEach((item) => {
            let itemID = item.getAttribute('data-id');
            if (filteredSourceOwner.includes(parseInt(itemID, 10))) {
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


function closeDropdowns(event) {
    if ((!typeField.contains(event.target)) && typeDropdown.style.display == 'flex') {
        typeDropdown.style.display = 'none';
    }
}

document.body.addEventListener('click', closeDropdowns);


function selectSourceOwner(inputField) {
    if (inputField.checked) {
        sourceOwnerField.value = inputField.nextElementSibling.innerText;
    }
}


function selectType(inputField) {
    if (inputField.checked) {
        document.getElementById(`selected-type-text`).innerText = inputField.nextElementSibling.innerText;
        document.getElementById(`selected-type-text`).style.color = '#000';
    }
}


function openCreateSourceModal() {
    let modal = document.getElementById('createSource');
    let form = modal.querySelector('form');
    form.setAttribute('onsubmit', 'createSourceForm(event);');
    modal.addEventListener('hidden.bs.modal', event => {
        form.reset();
        form.removeAttribute('onsubmit');
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
    else if (data.embedded_string.trim().length == 0) {
        errorMsg.innerText = 'Enter valid embedded string';
        errorMsg.classList.add('active');
        return false;
    }
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
    else {
        try {
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