let salonDropdown = document.getElementById('salon-dropdown');
let salonField = document.getElementById('salon-field');
let salonData = {};
let selectedSalon = null;


async function populateSalonDropdown() {
    let token = getCookie('admin_access');
    let headers = {
        "Authorization": `Bearer ${token}`
    }
    let responseSalonList = await requestAPI(`${apiURL}/admin/salon-profiles?ordering=-created_at&user__is_blocked=false&page=1&perPage=1000`, null, headers, 'GET');
    responseSalonList.json().then(function(res) {
        salonData = [...res.data];
        res.data.forEach((salon) => {
            salonDropdown.insertAdjacentHTML('beforeend', `<div class="radio-btn salon-item-list" data-id="${salon.id}">
                                                                <input onchange="selectSalon(event);" id="cust-${salon.id}" type="radio" value="${salon.id}" name="salon" />
                                                                <label for="cust-${salon.id}" class="radio-label">${salon.salon_name}</label>
                                                            </div>`);
        })
    })
}


function selectSalon(event) {
    let inputElement = event.target;
    if(inputElement.checked) {
        salonField.value = inputElement.nextElementSibling.innerText;
        selectedSalon = inputElement.value;
    }
}


salonField.addEventListener('focus', function() {
    salonDropdown.style.display = 'flex';
})

salonField.addEventListener('blur', function(event) {
    setTimeout(() => {
        salonDropdown.style.display = 'none';
    }, 200);
})

salonField.addEventListener('input', function() {
    let filteredSalon = [];
    filteredSalon = salonData.filter(salon => salon.salon_name.toLowerCase().includes(this.value.toLowerCase())).map((salon => salon.id));
    if (filteredSalon.length == 0) {
        document.getElementById('no-salon-text').classList.remove('hide');
        document.querySelectorAll('.salon-item-list').forEach((item) => item.classList.add('hide'));
    }
    else {
        document.getElementById('no-salon-text').classList.add('hide');
        document.querySelectorAll('.salon-item-list').forEach((item) => {
            let itemID = item.getAttribute('data-id');
            if (filteredSalon.includes(parseInt(itemID, 10))) {
                item.classList.remove('hide');
            }
            else {
                item.classList.add('hide');
            }
        })
    }
})


function openCreateCustomerModal() {
    let modal = document.querySelector(`#createCustomer`);
    let form = modal.querySelector('form');
    form.setAttribute("onsubmit", 'createCustomerForm(event)');
    modal.addEventListener('hidden.bs.modal', event => {
        form.reset();
        form.removeAttribute("onsubmit");
        modal.querySelector('.btn-text').innerText = 'ADD';
        document.querySelector('.create-error-msg').classList.remove('active');
        document.querySelector('.create-error-msg').innerText = "";
        selectedSalon = null;
        salonField.value = '';
    })
    document.querySelector(`.createCustomer`).click();
}


async function createCustomerForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let formData = new FormData(form);
    let data = formDataToObject(formData);
    let button = form.querySelector('button[type="submit"]');
    let buttonText = button.innerText;
    let errorMsg = form.querySelector('.create-error-msg');

    if (data.first_name.trim().length == 0) {
        errorMsg.innerText = 'Enter valid first name';
        errorMsg.classList.add('active');
        return false;
    }
    else if (data.last_name.trim().length == 0) {
        errorMsg.innerText = 'Enter valid last name';
        errorMsg.classList.add('active');
        return false;
    }
    else if (/^\+?\d{12,}$/.test(data.phone) == false) {
        errorMsg.innerText = 'Enter valid phone number';
        errorMsg.classList.add('active');
        return false;
    }
    else if (/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(data.email) == false) {
        errorMsg.innerText = 'Enter valid email';
        errorMsg.classList.add('active');
        return false;
    }
    // else if (selectedSalon == null) {
    //     errorMsg.innerText = 'Select a salon';
    //     errorMsg.classList.add('active');
    //     return false;
    // }
    else if (data.password.trim().length < 8 || data.confirm_password.trim().length < 8) {
        errorMsg.innerText = 'Password and Confirm Password should atleast be 8 characters';
        errorMsg.classList.add('active');
        return false;
    }
    else if (data.password != data.confirm_password) {
        errorMsg.innerText = 'Password and Confirm Password should be same';
        errorMsg.classList.add('active');
        return false;
    }
    else {
        try {
            let customerData = {
                first_name: data.first_name,
                last_name: data.last_name,
                // salon: parseInt(selectedSalon),
                user: {
                    phone: data.phone,
                    email: data.email,
                    password: data.password,
                    confirm_password: data.confirm_password
                }
            };
            if (selectedSalon != null)
                customerData.salon = parseInt(selectedSalon);
            errorMsg.innerText = '';
            errorMsg.classList.remove('active');
            let token = getCookie('admin_access');
            let headers = {
                "Authorization": `Bearer ${token}`,
                "Content-Type": 'application/json'
            };
            beforeLoad(button);
            let response = await requestAPI(`${apiURL}/admin/user-profiles`, JSON.stringify(customerData), headers, 'POST');
            // console.log(response);
            response.json().then(function(res) {
                // console.log(res);
                if (response.status == 201) {
                    getData();
                    afterLoad(button, 'ADDED');
                    form.removeAttribute('onsubmit');
                    setTimeout(() => {
                        document.querySelector('.createCustomer').click();
                    }, 1000)
                }
                else {
                    afterLoad(button, 'ERROR');
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
                    errorMsg.classList.add('active');
                }
            })
        }
        catch (err) {
            afterLoad(button, 'ERROR');
            console.log(err);
        }
    }
}