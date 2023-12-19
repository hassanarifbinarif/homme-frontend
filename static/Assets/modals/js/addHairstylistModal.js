let statusTypeDropdown = document.getElementById('status-type-dropdown');
let statusTypeDropdownBtn = document.getElementById('status-type');
let statusTypeOptions = document.querySelectorAll('input[name="status_type_radio"]');

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

    if (data.fullname.trim().length == 0) {
        errorMsg.classList.add('active');
        errorMsg.innerHTML = 'Enter valid full name';
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
                    
                    hairStylistWrapper.innerHTML += `<span>${data.fullname}</span>`;
                    if (hairStylistWrapper.querySelector('.no-stylist')) {
                        hairStylistWrapper.querySelector('.no-stylist').classList.add('hide');
                    }

                    setTimeout(() => {
                        document.querySelector('.addHairstylist').click();
                    }, 1000)
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