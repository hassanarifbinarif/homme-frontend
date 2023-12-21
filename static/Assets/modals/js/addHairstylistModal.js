let statusTypeDropdown = document.getElementById('status-type-dropdown');
let statusTypeDropdownBtn = document.getElementById('status-type');
let statusTypeOptions = document.querySelectorAll('input[name="status"]');

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
}

document.body.addEventListener('click', closeDropdowns);
statusTypeDropdownBtn.addEventListener('click', toggleDropdown);


function selectStatusType(event) {
    let inputElement = event.target;
    if(inputElement.checked) {
        document.getElementById('selected-status-type').innerText = inputElement.nextElementSibling.innerText;
        document.getElementById('selected-status-type').style.color = '#000';
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
    else if (/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(data.email) == false) {
        errorMsg.classList.add('active');
        errorMsg.innerHTML = 'Enter valid email';
        return false;
    }
    else if (data.status != 'active' && data.status != 'inactive' && data.status != 'leave') {
        errorMsg.classList.add('active');
        errorMsg.innerHTML = 'Select a status';
        return false;
    }
    else if (/^\+?\d{12,}$/.test(data.phone) == false) {
        errorMsg.classList.add('active');
        errorMsg.innerHTML = 'Enter valid phone';
        return false;
    }
    else if (data.address.trim().length == 0) {
        errorMsg.classList.add('active');
        errorMsg.innerHTML = 'Enter valid address';
        return false;
    }
    else if (data.city.trim().length == 0) {
        errorMsg.classList.add('active');
        errorMsg.innerHTML = 'Enter valid city name';
        return false;
    }
    else if (data.state.trim().length == 0) {
        errorMsg.classList.add('active');
        errorMsg.innerHTML = 'Enter valid state';
        return false;
    }
    else if (data.zip_code.trim().length != 5) {
        errorMsg.classList.add('active');
        errorMsg.innerHTML = 'Enter valid zipcode';
        return false;
    }
    else if (data.country.trim().length == 0) {
        errorMsg.classList.add('active');
        errorMsg.innerHTML = 'Enter valid country';
        return false;
    }
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