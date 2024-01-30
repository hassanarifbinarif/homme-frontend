let salonDropdown = document.getElementById('salon-dropdown');
let salonField = document.getElementById('salon-field');
let salonData = {};
let selectedSalon = null;

let stylistDropdown = document.getElementById('stylist-dropdown');
let stylistField = document.getElementById('stylist-field');

let referralInput = document.querySelector('input[name="referral_code"]');
let referralBtn = document.getElementById('referral-btn');
let referrer = null;
let source_referrer = null;
let stylist = null;


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
                                                                <input onchange="selectSalon(this);" id="cust-${salon.id}" type="radio" value="${salon.id}" name="salon" />
                                                                <label for="cust-${salon.id}" class="radio-label">${salon.salon_name}</label>
                                                            </div>`);
        })
    })
}


async function selectSalon(inputElement) {
    if(inputElement.checked) {
        salonField.value = inputElement.nextElementSibling.innerText;
        selectedSalon = inputElement.value;

        let stylistDiv = document.querySelector('.stylist-div');
        stylistDiv.classList.add('hide');

        let token = getCookie('admin_access');
        let headers = {
            "Authorization": `Bearer ${token}`,
        };

        let stylistResponse = await requestAPI(`${apiURL}/admin/salons/stylists?salon=${inputElement.value}`, null, headers, 'GET');
        populateStylists(stylistResponse);
    }
}


function populateStylists(stylistResponse) {
    let stylistDiv = document.querySelector('.stylist-div');
    stylistDiv.classList.add('hide');

    stylistResponse.json().then(function(stylistRes) {

        if (stylistResponse.status == 200 && stylistRes.data.length > 0) {
            stylistDropdown.innerHTML = '';
            stylistRes.data.forEach((stylist) => {
                stylistDropdown.insertAdjacentHTML('beforeend', `<div class="radio-btn salon-item-list" data-id="${stylist.id}">
                                                                    <input onchange="selectStylist(this);" id="stylist-${stylist.id}" type="radio" value="${stylist.id}" name="stylist" />
                                                                    <label for="stylist-${stylist.id}" class="radio-label">${stylist.first_name} ${stylist.last_name}</label>
                                                                </div>`);
            })
            stylistDiv.classList.remove('hide');
        }
        else {
            stylist = null;
            stylistDiv.classList.add('hide');
        }
        document.getElementById('stylist-loader').classList.add('hide');
    })
}


function showSalons() {
    salonDropdown.style.display = 'flex';
}

function hideSalons() {
    setTimeout(() => {
        salonDropdown.style.display = 'none';
    }, 300);
}

function searchSalons() {
    let filteredSalon = [];
    filteredSalon = salonData.filter(salon => salon.salon_name.toLowerCase().includes(salonField.value.toLowerCase())).map((salon => salon.id));
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
}

salonField.addEventListener('focus', showSalons);
salonField.addEventListener('blur', hideSalons);
salonField.addEventListener('input', searchSalons);


function addSalonEventListners() {
    salonField.addEventListener('focus', showSalons);
    salonField.addEventListener('blur', hideSalons);
    salonField.addEventListener('input', searchSalons);
    salonField.readOnly = false;
}

function removeSalonEventListeners() {
    salonField.removeEventListener('focus', showSalons);
    salonField.removeEventListener('blur', hideSalons);
    salonField.removeEventListener('input', searchSalons);
    salonField.readOnly = true;
}


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
    if((!stylistField.contains(event.target)) && stylistDropdown.style.display == 'flex') {
        stylistDropdown.style.display = 'none';
    }
}

document.body.addEventListener('click', closeDropdowns);
stylistField.addEventListener('click', toggleDropdown);


function selectStylist(inputElement) {
    if(inputElement.checked) {
        stylist = inputElement.value;
        document.getElementById('selected-stylist-text').innerText = inputElement.nextElementSibling.innerText;
        document.getElementById('selected-stylist-text').style.color = '#000';
    }
}


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
        document.querySelector('.stylist-div').classList.add('hide');
        document.getElementById('selected-stylist-text').innerText = 'Stylist';
        document.getElementById('selected-stylist-text').style.color = '#A9A9A9';
        referrer = null;
        source_referrer = null;
        stylist = null;
        selectedSalon = null;
        salonField.value = '';
    })
    document.querySelector(`.createCustomer`).click();
}


referralInput.addEventListener('keydown', (event) => {
    if (event.keyCode == 13)
        getReferralData(event);
})


async function getReferralData(event) {
    event.preventDefault()
    let referralInput = document.querySelector('input[name="referral_code"]');
    let stylistDiv = document.querySelector('.stylist-div');
    let errorMsg = document.querySelector('#customer-create-msg');

    if (referralInput.value.trim().length == 0) {
        errorMsg.innerText = 'Enter referral code';
        errorMsg.classList.add('active');
        referrer = null;
        selectedSalon = null;
        source_referrer = null;
        salonField.value = '';
        stylistDiv.classList.add('hide');
        addSalonEventListners();
        return false;
    }
    
    try {

        errorMsg.innerText = '';
        errorMsg.classList.remove('active');
        
        referralBtn.querySelector('svg').classList.add('hide');
        referralBtn.querySelector('.spinner-border').classList.remove('hide');

        let token = getCookie('admin_access');
        let headers = {
            "Authorization": `Bearer ${token}`,
        };
        
        let response = await requestAPI(`${apiURL}/users/referral?referral_code=${referralInput.value}`, null, {}, 'GET');
        response.json().then(async function(res) {
            
            if (response.status != 200) {
                referrer = null;
                selectedSalon = null;
                source_referrer = null;
                salonField.value = '';
                stylistDiv.classList.add('hide');
                addSalonEventListners();

                referralBtn.querySelector('svg').classList.remove('hide');
                referralBtn.querySelector('.spinner-border').classList.add('hide');
                let keys = Object.keys(res.messages);
                
                keys.forEach((key) => {
                    errorMsg.innerHTML += `${res.messages[key]} <br />`;
                })
                errorMsg.classList.add('active');
            }
            else {
                if (res.type == 'salon') {
                    referrer = res.id;
                    selectedSalon = res.salon_id;

                    let isSalon = document.querySelector(`input[name="salon"][value="${res.salon_id}"]`);
                    if (isSalon) {
                        salonField.value = isSalon.nextElementSibling.innerText;
                    }
                    
                    document.getElementById('stylist-loader').classList.remove('hide');
                    stylistDiv.classList.add('hide');

                    let stylistResponse = await requestAPI(`${apiURL}/admin/salons/stylists?salon=${res.salon_id}`, null, headers, 'GET');
                    populateStylists(stylistResponse);
                    removeSalonEventListeners();
                }
                else if (res.type == 'user') {
                    referrer = res.id;
                    source_referrer = null;
                    if (selectedSalon == null) {
                        stylistDiv.classList.add('hide');
                        stylist = null;
                    }
                    addSalonEventListners();
                }
                else if (res.type == 'source') {
                    referrer = null;
                    source_referrer = res.id;
                    if (selectedSalon == null) {
                        stylistDiv.classList.add('hide');
                        stylist = null;
                    }
                    // salonField.value = '';
                    // selectedSalon = null;
                    addSalonEventListners();
                }
                referralBtn.querySelector('svg').classList.remove('hide');
                referralBtn.querySelector('.spinner-border').classList.add('hide');
            }
        })
    }
    catch (err) {
        referralBtn.querySelector('svg').classList.remove('hide');
        referralBtn.querySelector('.spinner-border').classList.add('hide');
        console.log(err);
    }
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
    else if (phoneRegex.test(data.phone) == false) {
        errorMsg.innerText = 'Please enter a valid number with country code';
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
                user: {
                    phone: data.phone,
                    email: data.email,
                    password: data.password,
                    confirm_password: data.confirm_password,
                    role: "user"
                }
            };
            
            if (selectedSalon != null)
                customerData.salon = parseInt(selectedSalon);
            if (stylist)
                customerData.stylist = parseInt(stylist);
            if (source_referrer) {
                customerData.user.source_referrer = parseInt(source_referrer);
            }
            else {
                if (referrer) {
                    customerData.user.referrer = parseInt(referrer);
                }
            }
            // console.log(customerData);
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