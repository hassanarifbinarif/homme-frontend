let statusTypeDropdown = document.getElementById('status-type-dropdown');
let statusTypeDropdownBtn = document.getElementById('status-type');
let statusTypeOptions = document.querySelectorAll('input[name="status"]');
let pendingSupportDiv = document.getElementById('pending-support-div');


async function openSalonDetailModal(salonName, id) {
    let modal = document.getElementById('salonDetail');
    let form = modal.querySelector('form');
    let modalLoader = modal.querySelector('.modal-loader');
    let modalContent = modal.querySelector('.modal-content');
    let partnershipNullContent = modal.querySelector('#partnership-none');

    modal.addEventListener('hidden.bs.modal', event => {
        form.reset();
        form.removeAttribute("onsubmit");
        form.querySelector('.btn-text').innerText = 'SAVE';
        statusTypeDropdownBtn.classList.remove('hide');
        statusTypeDropdown.classList.remove('hide');
        pendingSupportDiv.classList.add('hide');
        modalLoader.classList.remove('hide');
        modalContent.classList.add('hide');
        modal.querySelector('.modal-body').classList.remove('hide');
        modal.querySelector('.modal-footer').classList.remove('hide');
        partnershipNullContent.classList.add('hide');
    })
    
    if (id == 'None') {
        modalLoader.classList.add('hide');
        modalContent.classList.remove('hide');
        modal.querySelector('.modal-body').classList.add('hide');
        modal.querySelector('.modal-footer').classList.add('hide');
        partnershipNullContent.classList.remove('hide');
        modal.querySelector('#header-salon-name').innerText = salonName;
        modal.querySelector('#salon-current-status').innerText = '()';
        document.querySelector('.salonDetail').click();
    }
    else {
        form.setAttribute('onsubmit', `salonDetailForm(event, '${id}')`);

        let token = getCookie('admin_access');
        let headers = {
            "Authorization": `Bearer ${token}`,
            "Content-Type": 'application/json'
        };
        document.querySelector('.salonDetail').click();
        let response = await requestAPI(`${apiURL}/admin/partnerships/${id}`, null, headers, 'GET');
        response.json().then(function(res) {

            if (response.status == 200) {
                modal.querySelector('#header-salon-name').innerText = salonName;
                modal.querySelector('#salon-current-status').innerText = '(' + captalizeFirstLetter(res.data.status) + ')';
                
                modal.querySelector('#general-info-name').innerText = res.data.person_name;
                modal.querySelector('#general-info-phone').innerText = res.data.person_phone;
                modal.querySelector('#general-info-email').innerText = res.data.person_email;

                modal.querySelector('#entity-info-name').innerText = res.data.legal_name;
                modal.querySelector('#entity-info-business-name').innerText = res.data.business_name;
                modal.querySelector('#entity-info-tax-id').innerText = res.data.tax_id;
                modal.querySelector('#entity-info-dunn-brad-number').innerText = res.data.street_number;

                modal.querySelector('#legal-address-1').innerText = res.data.legal_address.street1;
                modal.querySelector('#legal-address-2').innerText = res.data.legal_address.street2;
                modal.querySelector('#legal-city').innerText = res.data.legal_address.city;
                modal.querySelector('#legal-state').innerText = res.data.legal_address.state;
                modal.querySelector('#legal-zipcode').innerText = res.data.legal_address.zip_code;
                modal.querySelector('#legal-country').innerText = res.data.legal_address.country;

                modal.querySelector('#salon-addr-1').innerText = res.data.salon_address.street1;
                modal.querySelector('#salon-addr-2').innerText = res.data.salon_address.street2;
                modal.querySelector('#salon-addr-city').innerText = res.data.salon_address.city;
                modal.querySelector('#salon-addr-state').innerText = res.data.salon_address.state;
                modal.querySelector('#salon-addr-zipcode').innerText = res.data.salon_address.zip_code;
                modal.querySelector('#salon-addr-country').innerText = res.data.salon_address.country;

                modal.querySelector('#payment-info-account-type').innerText = captalizeFirstLetter(res.data.payment_type);
                if (res.data.payment_type == 'check') {
                    modal.querySelector('#payment-addr-1').innerText = res.data.payment_address.street1;
                    modal.querySelector('#payment-addr-2').innerText = res.data.payment_address.street2;
                    modal.querySelector('#payment-addr-city').innerText = res.data.payment_address.city;
                    modal.querySelector('#payment-addr-state').innerText = res.data.payment_address.state;
                    modal.querySelector('#payment-addr-zipcode').innerText = res.data.payment_address.zip_code;
                    modal.querySelector('#payment-addr-country').innerText = res.data.payment_address.country;

                    modal.querySelectorAll('div[data-type="for_cheque"]').forEach((div) => div.classList.remove('hide'));
                    modal.querySelectorAll('div[data-type="for_ach"]').forEach((div) => div.classList.add('hide'));
                }
                else {
                    modal.querySelector('#payment-info-name').innerText = res.data.name_on_account;
                    modal.querySelector('#payment-info-bank').innerText = res.data.bank_name;
                    modal.querySelector('#payment-info-routing-number').innerText = res.data.routing_number;
                    modal.querySelector('#payment-info-account-number').innerText = res.data.account_number;
                    modal.querySelectorAll('div[data-type="for_cheque"]').forEach((div) => div.classList.add('hide'));
                    modal.querySelectorAll('div[data-type="for_ach"]').forEach((div) => div.classList.remove('hide'));
                }
                modal.querySelectorAll('.table-text-overflow').forEach((span) => span.title = span.innerText);
                
                if (res.data.status == 'pending_support') {
                    statusTypeDropdownBtn.classList.add('hide');
                    statusTypeDropdown.classList.add('hide');
                    pendingSupportDiv.classList.remove('hide');
                    document.getElementById('status-type-pending-support').checked = true;
                }
                else {
                    modal.querySelector('#selected-status-type').innerText = captalizeFirstLetter(res.data.status);
                    modal.querySelector(`input[value="${res.data.status}"]`).checked = true;
                }
                modal.querySelector('input[name="admin_comment"]').value = res.data.admin_comment.trim();

                modalLoader.classList.add('hide');
                modalContent.classList.remove('hide');
            }
        })
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


async function salonDetailForm(event, id) {
    event.preventDefault();
    let form = event.currentTarget;
    let formData = new FormData(form);
    let data = formDataToObject(formData);
    let button = form.querySelector('button[type=submit]');
    let buttonText = button.innerText;
    try {
        let token = getCookie('admin_access');
        let headers = {
            "Authorization": `Bearer ${token}`,
            "Content-Type": 'application/json'
        };
        beforeLoad(button);
        let response = await requestAPI(`${apiURL}/admin/partnerships/${id}`, JSON.stringify(data), headers, 'PATCH');
        response.json().then(function(res) {
            if (response.status == 200) {
                afterLoad(button, 'SAVED');
                document.querySelector('#salon-current-status').innerText = '(' + captalizeFirstLetter(res.data.status) + ')';
                getData();
                setTimeout(() => {
                    afterLoad(button, 'SAVE');
                    document.querySelector('.salonDetail').click();
                }, 1000)
            }
            else {
                afterLoad(button, 'ERROR');
            }
        })
    }
    catch (err) {
        afterLoad(button, 'ERROR');
        console.log(err);
    }
}