function previewImage(event) {
    let imageInput = event.currentTarget;
    let image = imageInput.files;
    let imageTag = imageInput.closest('label').querySelector('.salon-image');
    imageTag.src = window.URL.createObjectURL(image[0]);
    imageTag.classList.remove('hide');
    imageInput.closest('label').querySelector('svg').style.display = 'none';
    imageInput.closest('label').querySelector('span').style.display = 'none';
}


function openCreateSalonModal() {
    let modal = document.getElementById('salonCreate');
    let form = modal.querySelector('form');
    form.setAttribute('onsubmit', 'createSalonForm(event)');
    let imageLabel = modal.querySelector('label');
    modal.addEventListener('hidden.bs.modal', event => {
        form.reset();
        imageLabel.querySelector('.salon-image').src = '';
        imageLabel.querySelector('.salon-image').classList.add('hide');
        imageLabel.querySelector('svg').style.display = "block";
        imageLabel.querySelector('span').style.display = "block";
        form.querySelector('.create-error-msg').innerHTML = '';
        form.querySelector('.btn-text').innerText = 'SAVE';
        form.querySelector('.create-error-msg').classList.remove('active');
    })
    document.querySelector('.salonCreate').click();
}


async function createSalonForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let imageInput = form.querySelector('#salon-image');
    let errorMsg = form.querySelector('.create-error-msg');
    let button = form.querySelector('button[type="submit"]');
    let buttonText = button.innerText;
    let formData = new FormData(form);
    let data = formDataToObject(formData);

    let checkValidations = true;
    errorMsg.innerHTML = '';
    if (data.person_name.trim().length == 0 || /^\+?\d{12,}$/.test(data.person_phone) == false || /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(data.person_email) == false || data.salon_name.trim().length == 0) {
        errorMsg.innerHTML += "General Information: Enter valid data in all fields <br />";
        checkValidations = false;
    }
    if (data.legal_name.trim().length == 0 || data.business_name.trim().length == 0 || data.tax_id.trim().length == 0 || data.street_number.trim().length == 0) {
        errorMsg.innerHTML += "Entity Information: Enter valid data in all fields <br />";
        checkValidations = false;
    }
    if (data.legal_street1.trim().length == 0 || data.legal_street2.trim().length == 0 || data.legal_city.trim().length == 0 || data.legal_state.trim().length == 0 || data.legal_zip_code.trim().length != 5 || data.legal_country.trim().length == 0) {
        errorMsg.innerHTML += "Legal Address: Enter valid data in all fields <br />";
        checkValidations = false;
    }
    if (imageInput.files.length == 0 || data.salon_website.trim().length == 0 || data.salon_map.trim().length == 0 || /^\+?\d{12,}$/.test(data.salon_phone) == false || data.salon_description.trim().length == 0) {
        errorMsg.innerHTML += "Salon Information: Enter valid data in all fields <br />";
        checkValidations = false;
    }
    if (data.salon_street1.trim().length == 0 || data.salon_street2.trim().length == 0 || data.salon_city.trim().length == 0 || data.salon_state.trim().length == 0 || data.salon_zip_code.trim().length != 5 || data.salon_country.trim().length == 0) {
        errorMsg.innerHTML += "Salon Address: Enter valid data in all fields <br />";
        checkValidations = false;
    }
    if (data.name_on_account.trim().length == 0 || data.bank_name.trim().length == 0 || data.routing_number.trim().length == 0 || data.account_number.trim().length == 0) {
        errorMsg.innerHTML += "Payment Detail: Enter valid data in all fields";
        checkValidations = false;
    }
    if (!checkValidations) {
        errorMsg.classList.add('active');
        return false;
    }
    else {
        try {
            errorMsg.classList.remove('active');
            let salonData = {
                "salon_name": data.salon_name,
                "contact_name": data.person_name,
                "user": {
                    "phone": data.person_phone,
                    "email": data.person_email
                },
                "partnership_application": {
                    "salon_website": data.salon_website,
                    "salon_phone": data.salon_phone,
                    "salon_map": data.salon_map,
                    "salon_description": data.salon_description,
                    "person_name": data.person_name,
                    "person_email": data.person_email,
                    "person_phone": data.person_phone,
                    "legal_name": data.legal_name,
                    "business_name": data.business_name,
                    "tax_id": data.tax_id,
                    "payment_type": data.payment_type,
                    "legal_address": {
                        "street1": data.legal_street1,
                        "street2": data.legal_street2,
                        "zip_code": data.legal_zip_code,
                        "city": data.legal_city,
                        "state": data.legal_state,
                        "country": data.legal_country
                    },
                    "salon_address": {
                        "street1": data.salon_street1,
                        "street2": data.salon_street2,
                        "zip_code": data.salon_zip_code,
                        "city": data.salon_city,
                        "state": data.salon_state,
                        "country": data.salon_country
                    },
                    "payment_address": {
                        "street1": data.salon_street1,
                        "street2": data.salon_street2,
                        "zip_code": data.salon_zip_code,
                        "city": data.salon_city,
                        "state": data.salon_state,
                        "country": data.salon_country
                    },
                    "other_information": {
                        "hear_about_us": "Current client",
                        "looking_in_mens_products": "",
                        "extra_info": "",
                        "annual_sales": 5000,
                        "number_of_location": 3
                    }
                }
            }
            let token = getCookie('admin_access');
            let headers = {
                "Authorization": `Bearer ${token}`,
                "Content-Type": 'application/json'
            }
            beforeLoad(button);
            let response = await requestAPI(`${apiURL}/admin/salon-profiles`, JSON.stringify(salonData), headers, 'POST');
            response.json().then(async function(res) {
                // console.log(res)

                if (response.status == 201) {
                    delete headers["Content-Type"];
                    let resp = await requestAPI(`${apiURL}/admin/salon-profiles/${res.data.id}`, formData, headers, 'PATCH');
                    resp.json().then(function(updateRes) {
                        // console.log(updateRes);

                        if (resp.status == 200) {
                            afterLoad(button, 'SAVED');
                            getData();
                            setTimeout(() => {
                                afterLoad(button, 'SAVE');
                                document.querySelector('.salonCreate').click();
                            }, 1000);
                        }
                        else {
                            afterLoad(button, 'ERROR');
                            errorMsg.classList.add('active');
                            let keys = Object.keys(updateRes.messages);
                            keys.forEach((key) => {
                                errorMsg.innerHTML += `${key}: ${updateRes.messages[key]} <br />`;
                            })        
                        }
                    })
                }
                else {
                    afterLoad(button, 'ERROR');
                    errorMsg.classList.add('active');
                    let keys = Object.keys(res.messages);
                    keys.forEach((key) => {
                        errorMsg.innerHTML += `${key}: ${res.messages[key]} <br />`;
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