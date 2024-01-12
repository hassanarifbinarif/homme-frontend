let addSalonsBtn = document.getElementById('add-salons-btn');
let salonSearchWrapper = document.getElementById('salon-search-wrapper');
let salonListWrapper = document.getElementById('salon-list-items-wrapper');
let selectedSalons = document.getElementById('selected-salons');
let salonsWrapper = document.getElementById('salons-wrapper');
let salonSelectBtn = document.getElementById('salon-select-btn');
let salonsList = [];
let currentSelectedSalons = [];

let stateSelectBtn = document.getElementById('notification-state-select-btn');
let stateSearchWrapper = document.getElementById('notification-state-search-wrapper');
let stateListWrapper = document.getElementById('notification-state-list-items-wrapper');
let selectedState = null;


function openCreateNotificationModal(modalID) {
    let modal = document.querySelector(`#${modalID}`);
    let form = modal.querySelector("form");
    let errorMsg = form.querySelector('.create-error-msg');
    errorMsg.classList.remove('active');
    errorMsg.innerText = '';
    form.reset();
    form.setAttribute("onsubmit", `sendNotificationForm(event)`);
    form.querySelector('.btn-text').innerText = 'SEND';
    modal.addEventListener('hidden.bs.modal', event => {
        form.reset();
        selectedSalons.innerHTML = '';
        salonListWrapper.innerHTML = '';
        selectedSalons.classList.add('hide');
        salonsWrapper.classList.add('hide');
        document.getElementById('selected-state-name').innerText = 'Select Target';
        document.getElementById('selected-state-name').style.color = '#A9A9A9';
        document.querySelectorAll('.salon-list-item').forEach((item) =>item.classList.remove('hide'));
        document.querySelectorAll('.state-list-item').forEach((state) => state.classList.remove('hide'));
    })
    document.querySelector(`.${modalID}`).click();
}


async function populateDropdowns() {
    statesList.forEach((state) => {
        stateListWrapper.innerHTML += `<div class="state-list-item" data-id="${state.id}">
                                            <label class="cursor-pointer" for="notification-state-${state.id}">
                                                <span>${state.name}</span>
                                            </label>
                                            <div class="cursor-pointer hide">
                                                <input onchange="selectState(this);" type="radio" value="${state.name}" id="notification-state-${state.id}" data-id="${state.id}" name="state" />
                                            </div>
                                        </div>`;
    })
}


stateSelectBtn.addEventListener('click', function() {
    if (stateSearchWrapper.classList.contains('hide')) {
        stateSearchWrapper.classList.remove('hide');
    }
    else {
        stateSearchWrapper.classList.add('hide');
    }
})


function checkEnter(event) {
    if (event.keyCode == 13) {
        event.preventDefault();
    }
}


function searchState(inputField) {
    let filteredStates = [];
    if (inputField.value == '') {
        filteredStates = statesList.map(state => state.id);
    }
    else {
        filteredStates = statesList.filter(state => state.name.toLowerCase().includes(inputField.value.toLowerCase() || inputField.value === '')).map(state => state.id);
    }

    if (filteredStates.length == 0) {
        document.getElementById('no-state-text').classList.remove('hide');
        document.querySelectorAll('.state-list-item').forEach((item) => item.classList.add('hide'));
    }
    else {
        document.getElementById('no-state-text').classList.add('hide');
        document.querySelectorAll('.state-list-item').forEach((item) => {
            let itemID = item.getAttribute('data-id');
            if (filteredStates.includes(parseInt(itemID, 10))) {
                item.classList.remove('hide');
            }
            else {
                item.classList.add('hide');
            }
        })
    }
}


function selectState(input) {
    selectedState = input.value;
    document.getElementById('selected-state-name').innerText = 'All Salons in ' + input.value;
    document.getElementById('selected-state-name').style.color = '#000';
    getStateSalons(selectedState);
    stateSelectBtn.click();
}


let numberOfSalons = null;

async function getStateSalons(state='') {
    document.getElementById('no-salon-text').classList.add('hide');
    document.getElementById('salon-loader').classList.remove('hide');
    document.querySelectorAll('.salon-card').forEach((card) => card.remove());
    
    salonListWrapper.innerHTML = '';
    salonsWrapper.classList.add('hide');
    selectedSalons.classList.add('hide');
    currentSelectedSalons = [];

    let token = getCookie('admin_access');
    let headers = {
        "Authorization": `Bearer ${token}`
    }

    try {
        let responseSalonList = await requestAPI(`${apiURL}/admin/salon-profiles?perPage=100&partnership_application__isnull=false&partnership_application__salon_address__state__in=${state}`, null, headers, 'GET');
        responseSalonList.json().then(function(res) {
            if (responseSalonList.status == 200 && res.data.length > 0) {
                numberOfSalons = res.data.length;
                addSalonList(res);
            }
            else {
                numberOfSalons = null;
                salonListWrapper.innerHTML = '<span class="hide" id="no-salon-text">No Salon</span>';
                document.getElementById('no-salon-text').classList.remove('hide');
            }
            document.getElementById('salon-loader').classList.add('hide');
            salonsWrapper.classList.remove('hide');
        })
    }
    catch (err) {
        salonListWrapper.innerHTML = '<span class="hide" id="no-salon-text">No Salon</span>';
        document.getElementById('no-salon-text').classList.remove('hide');
        document.getElementById('salon-loader').classList.add('hide');
        salonsWrapper.classList.remove('hide');
        numberOfSalons = null;
        console.log(err);
    }
}


function addSalonList(res) {
    salonsList = [];
    salonListWrapper.innerHTML = `<span class="hide" id="no-salon-text">No Salon</span>
                                    <div class="salon-list-item" data-id="all-salon-list-item">
                                        <label class="cursor-pointer" for="all-salon-id">
                                            <span class="all-select-option">All Salons</span>
                                        </label>
                                        <div class="cursor-pointer">
                                            <input type="checkbox" onchange="toggleAllSalons(this);" value="all_salons" id="all-salon-id" data-id="all-salon-id" name="all_salons" />
                                        </div>
                                    </div>`;
    res.data.forEach((salon) => {
        salonListWrapper.innerHTML += `<div class="salon-list-item salon-object" data-id="${salon.id}">
                                            <label class="cursor-pointer" for="salon-${salon.id}">
                                                <span>${salon.salon_name}</span>
                                            </label>
                                            <div class="cursor-pointer">
                                                <input type="checkbox" onchange="selectSalons(this);" value="${salon.id}" id="salon-${salon.id}" data-value="${salon.salon_name}" name="salons" />
                                            </div>
                                        </div>`;
        salonsList.push({id: salon.id, name:salon.salon_name});
    })
}


function toggleAllSalons(inputField) {
    if (inputField.checked) {
        currentSelectedSalons = [];
        document.querySelectorAll('input[name="salons"]').forEach((input) => {
            input.checked = true;
            currentSelectedSalons.push(input.value);
        })
    }
    else {
        currentSelectedSalons = [];
        document.querySelectorAll('input[name="salons"]').forEach((input) => {
            input.checked = false;
        })
    }

    displaySelectedSalons();
}


function selectSalons(inputField) {
    if (inputField.checked) {
        currentSelectedSalons.push(inputField.value);
        document.getElementById('all-salon-id').checked = currentSelectedSalons.length == numberOfSalons ? true : false;
    }
    else {
        const index = currentSelectedSalons.indexOf(inputField.value);
        if (index !== -1) {
            currentSelectedSalons.splice(index, 1);
            document.getElementById('all-salon-id').checked = false;
        }
    }
    displaySelectedSalons();
}


function displaySelectedSalons() {
    let allSalonDivs = document.querySelectorAll('.salon-list-item.salon-object');
    allSalonDivs.forEach((salon) => {
        let salonInput = salon.querySelector('input');
        let salonId = salonInput.value;
        let salonValue = salonInput.getAttribute('data-value');
        if (salonInput.checked) {
            let checkDuplicateCard = document.querySelector(`.salon-card[data-id="${salonId}"]`);
            if (checkDuplicateCard == null) {
                selectedSalons.innerHTML += `<div class="salon-card" data-id="${salonId}">
                                                <span title="${salonValue}">${salonValue}</span>
                                                <svg class="cursor-pointer" onclick="delSelectedSalon(event, ${salonId})" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                                                    <path d="M14.2992 9.85066C14.651 9.00138 14.832 8.09113 14.832 7.17188C14.832 5.31536 14.0945 3.53488 12.7818 2.22213C11.469 0.909373 9.68855 0.171875 7.83203 0.171875C5.97552 0.171875 4.19504 0.909373 2.88228 2.22213C1.56953 3.53488 0.832031 5.31536 0.832031 7.17188C0.832031 8.09113 1.01309 9.00138 1.36487 9.85066C1.71666 10.6999 2.23227 11.4716 2.88228 12.1216C3.53229 12.7716 4.30397 13.2872 5.15325 13.639C6.00253 13.9908 6.91278 14.1719 7.83203 14.1719C8.75128 14.1719 9.66154 13.9908 10.5108 13.639C11.3601 13.2872 12.1318 12.7716 12.7818 12.1216C13.4318 11.4716 13.9474 10.6999 14.2992 9.85066Z" fill="#D9D9D9"/>
                                                    <path d="M5.49805 9.50705L7.83165 7.17345M7.83165 7.17345L10.1653 4.83984M7.83165 7.17345L5.49805 4.83984M7.83165 7.17345L10.1653 9.50705" stroke="#3F3F46" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
                                            </div>`;
            }
            selectedSalons.classList.remove('hide');
        }
    })
}


function searchSalon(event) {
    let inputField = event.target;
    let filteredSalons = [];
    if (inputField.value == '') {
        filteredSalons = salonsList.map(salon => salon.id);
    }
    else {
        filteredSalons = salonsList.filter(salon => salon.name.toLowerCase().includes(inputField.value.toLowerCase() || inputField.value === '')).map(salon => salon.id);
    }

    if (filteredSalons.length == 0) {
        document.getElementById('no-salon-text').classList.remove('hide');
        document.querySelectorAll('.salon-list-item').forEach((item) => item.classList.add('hide'));
    }
    else {
        document.getElementById('no-salon-text').classList.add('hide');
        document.querySelectorAll('.salon-list-item').forEach((item) => {
            let itemID = item.getAttribute('data-id');
            if (filteredSalons.includes(parseInt(itemID, 10))) {
                item.classList.remove('hide');
            }
            else {
                item.classList.add('hide');
            }
        })
    }
}


function delSelectedSalon(event, id) {
    event.preventDefault();
    let divToDelete = event.target.closest('.salon-card');
    let allSalons = document.querySelectorAll('input[name="salons"]');
    allSalons.forEach((salon) => {
        let salonID = salon.value;
        if (salonID == id) {
            salon.checked = false;
            const index = currentSelectedSalons.indexOf(salon.value);
            if (index !== -1) {
                currentSelectedSalons.splice(index, 1);
                document.getElementById('all-salon-id').checked = false;
            }
        }
    })
    divToDelete.remove();
    if (document.querySelectorAll('.salon-card').length == 0) {
        selectedSalons.classList.add('hide');
        // addSalonsBtn = document.getElementById('add-salons-btn');
        // addSalonsBtn.style.background = '#9D9D9D';
        // addSalonsBtn.disabled = true;
    }
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
    if((!salonSelectBtn.contains(event.target)) && (!salonSearchWrapper.contains(event.target)) && (!salonSearchWrapper.classList.contains('hide'))) {
        salonSearchWrapper.classList.add('hide');
    }
    if((!stateSelectBtn.contains(event.target)) && (!stateSearchWrapper.contains(event.target)) && (!stateSearchWrapper.classList.contains('hide'))) {
        stateSearchWrapper.classList.add('hide');
    }
}

document.body.addEventListener('click', closeDropdowns);


salonSelectBtn.addEventListener('click', function() {
    if (salonSearchWrapper.classList.contains('hide')) {
        salonSearchWrapper.classList.remove('hide');
    }
    else {
        salonSearchWrapper.classList.add('hide');
    }
})


async function sendNotificationForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let button = form.querySelector('button[type="submit"]');
    let errorMsg = form.querySelector('.create-error-msg');
    let formData = new FormData(form);
    let data = formDataToObject(formData);

    if(form.querySelector('input[name="title"]').value.trim().length == 0) {
        errorMsg.classList.add('active');
        errorMsg.innerText = 'Enter valid title';
        return false;
    }
    else if (!/^[\x00-\xFF]+$/.test(form.querySelector('input[name="title"]').value)) {
        errorMsg.classList.add('active');
        errorMsg.innerText = 'Enter only ASCII characters';
        return false;
    }
    if (selectedState == null) {
        errorMsg.classList.add('active');
        errorMsg.innerText = 'Select a state';
        return false;
    }
    if (currentSelectedSalons.length == 0) {
        errorMsg.classList.add('active');
        errorMsg.innerText = 'Select atleast one salon';
        return false;
    }
    if (form.querySelector('textarea[name="text"]').value.trim().length == 0) {
        errorMsg.classList.add('active');
        errorMsg.innerText = 'Enter notification text';
        return false;
    }
    else if (!/^[\x00-\xFF]+$/.test(form.querySelector('textarea[name="text"]').value)) {
        errorMsg.classList.add('active');
        errorMsg.innerText = 'Enter only ASCII characters';
        return false;
    }

    try {

        let notificationData = {
            "target_type": currentSelectedSalons.length == numberOfSalons ? 'all_salons' : 'selected_salons',
            "title": data.title,
            "text": data.text,
            "salons": currentSelectedSalons,
            "state": selectedState
        }

        errorMsg.classList.remove('active');
        errorMsg.innerText = '';
        let token = getCookie('admin_access');
        let headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        };
        beforeLoad(button);
        let response = await requestAPI(`${apiURL}/admin/marketings`, JSON.stringify(notificationData), headers, 'POST');
        response.json().then(function(res) {

            if (response.status == 201) {
                form.reset();
                afterLoad(button, 'MESSAGE SENT');
                getData();
                setTimeout(() => {
                    document.querySelector('.salonMarketingNotification').click();
                }, 1500);
            }
            else {
                errorMsg.classList.add('active');
                afterLoad(button, 'Error');
                displayMessages(res.messages, errorMsg);
            }
        })
    }
    catch (err) {
        afterLoad(button, 'Error');
        console.log(err);
    }
}