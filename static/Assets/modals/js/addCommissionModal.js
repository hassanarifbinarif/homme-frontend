let salonDropdown = document.getElementById('salon-dropdown');
let salonField = document.getElementById('salon-field');
let salonData = {};
let selectedSalon = null;

let targetTypeDropdown = document.getElementById('target-type-dropdown');
let targetTypeField = document.getElementById('target-type');

targetTypeField.addEventListener('click', toggleDropdown);


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
    if ((!targetTypeField.contains(event.target)) && targetTypeDropdown.style.display == 'flex') {
        targetTypeDropdown.style.display = 'none';
    }
}

document.body.addEventListener('click', closeDropdowns);


function selectType(inputField, type) {
    if (inputField.checked) {
        document.getElementById(`selected-target-type`).innerText = inputField.nextElementSibling.innerText;
        document.getElementById(`selected-target-type`).style.color = '#000';
    }
}


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


function selectSalon(inputElement) {
    if(inputElement.checked) {
        salonField.value = inputElement.nextElementSibling.innerText;
        selectedSalon = inputElement.value;
    }
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


function openAddCommissionModal() {
    let modal = document.getElementById('addCommission');
    let form = modal.querySelector('form');
    form.setAttribute('onsubmit', 'addCommissionForm(event)');

    modal.addEventListener('hidden.bs.modal', event => {
        form.reset();
        form.removeAttribute('onsubmit');
        form.querySelector('.btn-text').innerText = 'DONE';
        form.querySelector('.create-error-msg').innerHTML = '';
        form.querySelector('.create-error-msg').classList.remove('active');
        document.getElementById('selected-target-type').innerText = 'Status';
        document.getElementById('selected-target-type').style.color = '#A9A9A9';
    })

    document.querySelector('.addCommission').click();
}


async function addCommissionForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let formData = new FormData(form);
    let data = formDataToObject(formData);
    let button = form.querySelector('button[type="submit"]')
    let errorMsg = form.querySelector('.create-error-msg');

    if (selectedSalon == null) {
        errorMsg.innerHTML = 'Select a salon';
        errorMsg.classList.add('active');
        return false;
    }
    else if ((!data.type)) {
        errorMsg.innerHTML = 'Select a type';
        errorMsg.classList.add('active');
        return false;
    }
    else if (data.amount.trim().length == 0) {
        errorMsg.innerHTML = 'Enter an amount';
        errorMsg.classList.add('active');
        return false;
    }
    else if (data.description.trim().length == 0) {
        errorMsg.innerHTML = 'Enter description';
        errorMsg.classList.add('active');
        return false;
    }

    try {
        errorMsg.innerHTML = '';
        errorMsg.classList.remove('active');

        data.salon = parseInt(selectedSalon);
        data.status = 'unpaid';
        
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
        const day = currentDate.getDate().toString().padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`;
        data.date = formattedDate;

        let token = getCookie('admin_access');
        let headers = {
            "Authorization": `Bearer ${token}`,
            "Content-Type": 'application/json'
        }

        beforeLoad(button);
        let response = await requestAPI(`${apiURL}/admin/salons/commissions`, JSON.stringify(data), headers, 'POST');
        response.json().then(function(res) {

            if (response.status == 201) {
                afterLoad(button, 'CREATED');
                form.reset();
                form.removeAttribute('onsubmit');
                getData();

                setTimeout(() => {
                    afterLoad(button, 'DONE');
                    document.querySelector('.addCommission').click();
                }, 1200)
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