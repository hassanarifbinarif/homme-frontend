let targetTypeDropdown = document.getElementById('target-type-dropdown');
let targetTypeDropdownBtn = document.getElementById('target-type');
let targetTypeOptions = document.querySelectorAll('input[name="target_type"]');

let addSalonsBtn = document.getElementById('add-salons-btn');
let salonListWrapper = document.getElementById('salon-list-items-wrapper');
let selectedSalons = document.getElementById('selected-salons');
let salonsList = [];

targetTypeDropdownBtn.addEventListener('click', toggleDropdown);


function openCreateNotificationModal(modalID) {
    let modal = document.querySelector(`#${modalID}`);
    let form = modal.querySelector("form");
    let errorMsg = form.querySelector('.create-error-msg');
    errorMsg.classList.remove('active');
    errorMsg.innerText = '';
    form.reset();
    form.setAttribute("onsubmit", `sendNotificationForm(event)`);
    form.querySelector('.btn-text').innerText = 'SEND';
    document.querySelector(`.${modalID}`).click();
}


async function populateDropdowns() {
    let token = getCookie('admin_access');
    let headers = {
        "Authorization": `Bearer ${token}`
    }
    let responseTargetTypes = await requestAPI(`${apiURL}/admin/marketings/target-types`, null , headers, 'GET');
    let responseSalonList = await requestAPI(`${apiURL}/admin/salon-profiles?perPage=100`, null, headers, 'GET');
    responseTargetTypes.json().then(function(res) {
        // console.log(res);
        if (responseTargetTypes.status == 200) {
            res.forEach((targetType) => {
                targetTypeDropdown.innerHTML += `<div class="radio-btn">
                                                    <input onchange="selectTargetType(event);" id="target-type-${targetType.value}" data-id="${targetType.value}" type="radio" value="${targetType.value}" name="target_type" />
                                                    <label for="target-type-${targetType.value}" class="radio-label">${targetType.name}</label>
                                                </div>`
            })
        }
    })

    responseSalonList.json().then(function(res) {
        // console.log(res);
        if (responseSalonList.status == 200) {
            res.data.forEach((salon) => {
                salonListWrapper.innerHTML += `<div class="salon-list-item" data-id="${salon.id}">
                                                    <label class="cursor-pointer" for="salon-${salon.id}">
                                                        <span>${salon.salon_name}</span>
                                                    </label>
                                                    <div class="cursor-pointer">
                                                        <input type="checkbox" value="${salon.salon_name}" id="salon-${salon.id}" data-id="${salon.id}" name="salons" />
                                                    </div>
                                                </div>`;
                salonsList.push({id: salon.id, name:salon.salon_name});
            })
            checkSelectedSalons();
        }
    })
}


function checkSelectedSalons() {
    let allsalons = document.querySelectorAll('input[name="salons"]');
    addSalonsBtn = document.getElementById('add-salons-btn');

    if(allsalons) {
        allsalons.forEach((checkbox) => {
            checkbox.addEventListener('change', function() {
                let checkedCount = 0;
                allsalons.forEach((checkbox) => {
                    if(checkbox.checked) {
                        checkedCount++;
                    }
                })
                // console.log(checkedCount);
                if(checkedCount > 0) {
                    addSalonsBtn.style.background = '#000093';
                    addSalonsBtn.disabled = false;
                }
                else {
                    addSalonsBtn.style.background = '#9D9D9D';
                    addSalonsBtn.disabled = true;
                }
            })
        })
    }
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
        // filteredSalons.forEach((salon) => {
        //     let salonDiv = document.querySelector(`.salon-list-item[data-id="${salon.id}"]`);
        //     // salonListWrapper.innerHTML += `<div class="salon-list-item" data-id="${salon.id}">
        //     //                                     <label for="salon-${salon.id}">
        //     //                                         <span>${salon.name}</span>
        //     //                                     </label>
        //     //                                     <div>
        //     //                                         <input type="checkbox" value=${salon.name} id="salon-${salon.id}" data-id="${salon.id}" name="salons" />
        //     //                                     </div>
        //     //                                 </div>`;
        // })
    }
    checkSelectedSalons();
}


function addSelectedSalons(event) {
    event.preventDefault();
    let allSalonDivs = document.querySelectorAll('.salon-list-item');
    allSalonDivs.forEach((salon) => {
        let salonInput = salon.querySelector('input');
        let salonId = salonInput.getAttribute('data-id');
        let salonValue = salonInput.value;
        if (salonInput.checked) {
            let checkDuplicateCard = document.querySelector(`.salon-card[data-id="${salonId}"]`);
            if (checkDuplicateCard == null) {
                selectedSalons.innerHTML += `<div class="salon-card" data-id="${salonId}">
                                                <span>${salonValue}</span>
                                                <svg class="cursor-pointer" onclick="delSelectedSalon(event, ${salonId})" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                                                    <path d="M14.2992 9.85066C14.651 9.00138 14.832 8.09113 14.832 7.17188C14.832 5.31536 14.0945 3.53488 12.7818 2.22213C11.469 0.909373 9.68855 0.171875 7.83203 0.171875C5.97552 0.171875 4.19504 0.909373 2.88228 2.22213C1.56953 3.53488 0.832031 5.31536 0.832031 7.17188C0.832031 8.09113 1.01309 9.00138 1.36487 9.85066C1.71666 10.6999 2.23227 11.4716 2.88228 12.1216C3.53229 12.7716 4.30397 13.2872 5.15325 13.639C6.00253 13.9908 6.91278 14.1719 7.83203 14.1719C8.75128 14.1719 9.66154 13.9908 10.5108 13.639C11.3601 13.2872 12.1318 12.7716 12.7818 12.1216C13.4318 11.4716 13.9474 10.6999 14.2992 9.85066Z" fill="#D9D9D9"/>
                                                    <path d="M5.49805 9.50705L7.83165 7.17345M7.83165 7.17345L10.1653 4.83984M7.83165 7.17345L5.49805 4.83984M7.83165 7.17345L10.1653 9.50705" stroke="#3F3F46" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
                                            </div>`;
            }
            selectedSalons.classList.remove('hide');
        }
    })
    salonSelectBtn.click();
}


function delSelectedSalon(event, id) {
    event.preventDefault();
    let divToDelete = event.target.closest('.salon-card');
    let allSalons = document.querySelectorAll('input[name="salons"]');
    allSalons.forEach((salon) => {
        let salonID = salon.getAttribute('data-id');
        if (salonID == id) {
            salon.checked = false;
        }
    })
    divToDelete.remove();
    if (document.querySelectorAll('.salon-card').length == 0) {
        selectedSalons.classList.add('hide');
    }
    checkSelectedSalons();
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
    if((!targetTypeDropdownBtn.contains(event.target)) && targetTypeDropdown.style.display == 'flex') {
        targetTypeDropdown.style.display = 'none';
    }
}

document.body.addEventListener('click', closeDropdowns);


let salonsWrapper = document.getElementById('salons-wrapper');
let salonSelectBtn = document.getElementById('salon-select-btn');
salonSelectBtn.addEventListener('click', function() {
    let salonSearchWrapper = document.getElementById('salon-search-wrapper');
    if (salonSearchWrapper.classList.contains('hide')) {
        salonSearchWrapper.classList.remove('hide');
    }
    else {
        salonSearchWrapper.classList.add('hide');
    }
})


function selectTargetType(event) {
    let inputElement = event.target;
    if(inputElement.checked) {
        document.getElementById('selected-target-type').innerText = inputElement.nextElementSibling.innerText;
        document.getElementById('selected-target-type').style.color = '#000';
        if (inputElement.value == 'all_users_by_salon') {
            salonsWrapper.classList.remove('hide');
        }
        else {
            salonsWrapper.classList.add('hide');
        }
    }
}


async function sendNotificationForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let button = form.querySelector('button[type="submit"]');
    let errorMsg = form.querySelector('.create-error-msg');
    let formData = new FormData(form);
    formData.delete('search');
    let data = formDataToObject(formData);
    let finalSelectedSalons = [];
    if(form.querySelector('input[name="title"]').value.trim().length == 0) {
        errorMsg.classList.add('active');
        errorMsg.innerText = 'Enter valid title';
        return false;
    }
    else if (!data.target_type) {
        errorMsg.classList.add('active');
        errorMsg.innerText = 'Select a target type';
        return false;
    }
    else if (data.target_type == 'all_users_by_salon') {
        let allSelectedSalons = document.querySelectorAll('.salon-card');
        allSelectedSalons.forEach((salon) => {
            let salonID = salon.getAttribute('data-id');
            finalSelectedSalons.push(parseInt(salonID));
        })
        if (finalSelectedSalons.length == 0) {
            errorMsg.classList.add('active');
            errorMsg.innerText = 'Select target salons';
            return false;
        }
        data.salons = finalSelectedSalons;
    }
    else if (form.querySelector('textarea[name="text"]').value.trim().length == 0) {
        errorMsg.classList.add('active');
        errorMsg.innerText = 'Enter notification text';
        return false;
    }
    else if (!/^[ -~]*$/.test(form.querySelector('textarea[name="text"]').value)) {
        errorMsg.classList.add('active');
        errorMsg.innerText = 'Enter only ASCII characters';
        return false;
    }
    // console.log(data);
    else {
        try {
            errorMsg.classList.remove('active');
            errorMsg.innerText = '';
            let token = getCookie('admin_access');
            let headers = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            };
            beforeLoad(button);
            let response = await requestAPI(`${apiURL}/admin/marketings`, JSON.stringify(data), headers, 'POST');
            response.json().then(function(res) {
                // console.log(res);
                if (response.status == 201) {
                    afterLoad(button, 'MESSAGE SENT');
                    getData();
                    setTimeout(() => {
                        document.querySelector('.marketingNotification').click();
                        form.reset();
                    }, 1500);
                }
                else {
                    let keys = Object.keys(res.messages);
                    keys.forEach((key) => {
                        errorMsg.classList.add('active');
                        errorMsg.innerHTML += `${key}: ${res.messages[key]}. <br />`;
                    })
                    afterLoad(button, 'Error');
                }
            })
        }
        catch (err) {
            console.log(err);
        }
    }
}