window.onload = () => {
    getNotifications();
    convertDateTime();
}

async function printPackingSlip(button, id) {
    let buttonText = button.innerText;
    beforeLoad(button);
    let response = await requestAPI(`/get-packing-slip/${id}/`, null, {}, 'GET');
    response.json().then(function(res) {

        // Create options for pdf generation
        var options = {
            filename: 'generated-pdf.pdf',
            image: { type: 'jpeg', quality: '.98' },
            html2canvas: { scale: 2, useCORS: true, scrollY: 0, scrollX: 0, imageTimeout: 10000000, dpi:96 },
        };

        // Use html2pdf to generate the PDF
        // html2pdf().from(res.packing_data).set(options).save();

        html2pdf().from(res.packing_data).set(options).toPdf().get('pdf').then(function (pdf) {
            afterLoad(button, buttonText);
            window.open(pdf.output('bloburl'), '_blank');
        });

        // html2pdf().from(res.packing_data).set({ html2canvas: { scale: 4, useCORS: true } }).save();
        
        // var printWindow = window.open('', '_blank');
        // printWindow.document.write(res.packing_data);

        // // Trigger the print dialog
        // printWindow.print();
    })
}


function openShippingLabel(base64Image) {
    const newTabDocument = document.implementation.createHTMLDocument();
    const imgElement = newTabDocument.createElement("img");

    imgElement.src = "data:image/png;base64," + base64Image;
    imgElement.style.transform = 'rotate(90deg)';
    imgElement.style.position = 'relative';
    // imgElement.style.top = '150px';
    imgElement.style.width = '1000px';

    newTabDocument.body.style.display = 'flex';
    newTabDocument.body.style.justifyContent = 'center';
    newTabDocument.body.style.alignItems = 'center';
    newTabDocument.body.style.margin = '0px';
    newTabDocument.body.style.padding = '0px';

    newTabDocument.body.appendChild(imgElement);
    // console.log(newTabDocument.documentElement.outerHTML);
    const newTab = window.open();
    newTab.document.write(newTabDocument.documentElement.outerHTML);
    setTimeout(() => {
        newTab.print();
    }, 1000)
}


let generateLabelBtn = document.getElementById('generate-label-btn');
let userName = null;
let userPhone = null;
let userEmail = null;
let generateLabelData = {};
let orderId = null;

async function openGenerateShippingLabelModal(orderID, firstName, lastName, phone, email, address, city, state, zipcode, simple_rate_size) {
    orderId = orderID;
    userName = `${firstName} ${lastName}`;
    userPhone = phone;
    userEmail = email;
    let modal = document.getElementById('orderShippingLabel');
    let errorDiv = document.querySelector('.error-div');
    let errorMsg = document.querySelector('.generate-error-msg');
    let form = modal.querySelector('form');
    form.setAttribute('onsubmit', "generateShippingLabelForm(event)");
    let generateLabelLoader = document.getElementById('generate-loader');
    try {
        errorMsg.classList.remove('active');
        errorMsg.innerHTML = '';
        errorDiv.classList.add('hide');
        let token = getCookie('admin_access');
        let headers = {
            "Authorization": `Bearer ${token}`,
            "Content-Type": 'application/json'
        };
        generateLabelData = {
            address: address,
            city: city,
            state: getStateCode(state),
            zipcode: zipcode,
            simple_rate_size: simple_rate_size
        };
        generateLabelLoader.classList.remove('hide');
        generateLabelBtn.style.pointerEvents = 'none';
        let response = await requestAPI(`${apiURL}/admin/shippings/ups/rating`, JSON.stringify(generateLabelData), headers, 'POST');
        response.json().then(function(res) {
            if (response.status == 200) {
                let shippingSpeedsWrapper = document.getElementById('shipping-speeds');
                shippingSpeedsWrapper.innerHTML = '';
                res.data.forEach((shippingType, index) => {
                    shippingSpeedsWrapper.innerHTML += `<div class="shipping-type ${index != 0 ? "opacity-point-3-5" : ''}">
                                                            <div>
                                                                <input type="radio" data-cost="${shippingType.total_charges.monetary_value}" name="service_type" value="${shippingType.service.code}" id="type-${shippingType.service.description}" ${index == 0 ? "checked" : ''} />
                                                                <label for="type-${shippingType.service.description}">${shippingType.service.description}</label>
                                                            </div>
                                                            <span>$${shippingType.total_charges.monetary_value}</span>
                                                        </div>`;
                })
                document.getElementById('modal-shipping-price-field').innerText = '$' + res.data[0].total_charges.monetary_value;
                initializeShippingSpeeds();
                document.getElementById('generate-btn').style.pointerEvents = 'auto';
                document.getElementById('refresh-costs-btn').setAttribute('onclick', `refreshShippingCosts(this, '${address}', '${city}', '${state}', '${zipcode}');`);
                document.querySelector('.label-error-div').classList.add('hide');
                document.querySelector('.label-error-msg').classList.remove('active');
                document.querySelector('.label-error-msg').innerHTML = '';
                modal.addEventListener('hidden.bs.modal', event => {
                    form.reset();
                    form.removeAttribute('onsubmit');
                    shippingSpeedsWrapper.innerHTML = '';
                    document.getElementById('generate-btn').style.pointerEvents = 'auto';
                    document.getElementById('refresh-costs-btn').removeAttribute('onclick');
                    document.querySelector('.label-error-div').classList.add('hide');
                    document.querySelector('.label-error-msg').classList.remove('active');
                    document.querySelector('.label-error-msg').innerHTML = '';
                    document.getElementById('modal-tracker-field').innerText = 'N/A';
                    document.getElementById('modal-shipping-price-field').innerText = '$0';
                    userName = null;
                    userPhone = null;
                    userEmail = null;
                    generateLabelData = {};
                    orderID = null;
                })
                document.querySelector('.orderShippingLabel').click();
            }
            else if (response.status == 400) {
                errorDiv.classList.remove('hide');
                errorMsg.classList.add('active');
                let keys = Object.keys(res.messages);
                keys.forEach((key) => {
                    errorMsg.innerHTML += `${res.messages[key]} <br />`;
                })
            }
            generateLabelLoader.classList.add('hide');
            generateLabelBtn.style.pointerEvents = 'auto';
        })
    }
    catch (err) {
        generateLabelLoader.classList.add('hide');
        generateLabelBtn.style.pointerEvents = 'auto';
        console.log(err);
    }
}


function getStateCode(stateName) {
    let stateCode = stateName;
    statesList.forEach((state) => {
        if (state.name.toLowerCase() == stateName.toLowerCase() || state.abbreviation.toLowerCase() == stateName.toLowerCase()) {
            stateCode =  state.abbreviation;
        }
    })
    return stateCode;
}


function initializeShippingSpeeds() {
    let shippingSpeedInputs = document.querySelectorAll('input[name="service_type"]');
    shippingSpeedInputs.forEach((radioInput) => {
        radioInput.addEventListener('change', function() {
            document.querySelectorAll('input[name="service_type"]').forEach((input) => {
                let inputWrapper = input.closest('.shipping-type');
                if (input.checked) {
                    inputWrapper.classList.remove('opacity-point-3-5');
                    document.getElementById('modal-shipping-price-field').innerText = '$' + input.getAttribute('data-cost');
                }
                else {
                    inputWrapper.classList.add('opacity-point-3-5');
                }
            })
        })
    })
}


let boxSizeRadioBtn = document.querySelectorAll('input[name="simple_rate_size"]');
let customSizeInputDiv = document.querySelectorAll('.input-div');
boxSizeRadioBtn.forEach((radioBtn) => {
    radioBtn.addEventListener('click', function() {
        if (this.value == 'custom' || this.value == 'CUSTOM') {
            customSizeInputDiv.forEach((div) => {
                div.classList.remove('opacity-point-6');
                div.querySelectorAll('input').forEach((input) => {
                    input.readOnly = false;
                })
            })
        }
        else {
            customSizeInputDiv.forEach((div) => {
                div.classList.add('opacity-point-6');
                div.querySelectorAll('input').forEach((input) => {
                    input.readOnly = true;
                })
            })
        }
    })
})


async function refreshShippingCosts(element, address, city, state, zipcode) {
    let token = getCookie('admin_access');
    let headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": 'application/json'
    };
    let selectedRateSize = 'S';
    document.querySelectorAll('input[name="simple_rate_size"]').forEach((input) => {
        if (input.checked)
            selectedRateSize = input.value;
    })
    generateLabelData = {
        address: address,
        city: city,
        state: getStateCode(state),
        zipcode: zipcode,
        simple_rate_size: selectedRateSize
    };
    element.classList.add('divToRotate');
    let response = await requestAPI(`${apiURL}/admin/shippings/ups/rating`, JSON.stringify(generateLabelData), headers, 'POST');
    response.json().then(function(res) {
        if (response.status == 200) {
            let shippingSpeedsWrapper = document.getElementById('shipping-speeds');
            shippingSpeedsWrapper.innerHTML = '';
            res.data.forEach((shippingType, index) => {
                shippingSpeedsWrapper.innerHTML += `<div class="shipping-type ${index != 0 ? "opacity-point-3-5" : ''}">
                                                        <div>
                                                            <input type="radio" data-cost="${shippingType.total_charges.monetary_value}" name="service_type" value="${shippingType.service.code}" id="type-${shippingType.service.description}" ${index == 0 ? "checked" : ''} />
                                                            <label for="type-${shippingType.service.description}">${shippingType.service.description}</label>
                                                        </div>
                                                        <span>$${shippingType.total_charges.monetary_value}</span>
                                                    </div>`;
            })
            document.getElementById('modal-shipping-price-field').innerText = '$' + res.data[0].total_charges.monetary_value;
            initializeShippingSpeeds();
        }
        element.classList.remove('divToRotate');
    })
}


async function generateShippingLabelForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let formData = new FormData(form);
    let data = formDataToObject(formData);
    let button = form.querySelector('button[type="submit"]');
    let buttonText = button.innerText;
    let errorDiv = form.querySelector('.label-error-div');
    let errorMsg = form.querySelector('.label-error-msg');

    data.address = generateLabelData.address;
    data.city = generateLabelData.city;
    data.state = generateLabelData.state;
    data.zipcode = generateLabelData.zipcode;
    data.to_name = userName;
    data.to_phone = userPhone;
    data.to_email = userEmail;

    if (data.simple_rate_size.toLowerCase() == 'custom') {
        if (data.package_length.trim().length == 0) {
            errorDiv.classList.remove('hide');
            errorMsg.classList.add('active');
            errorMsg.innerText = 'Length required';
            return false;
        }
        if (data.package_width.trim().length == 0) {
            errorDiv.classList.remove('hide');
            errorMsg.classList.add('active');
            errorMsg.innerText = 'Width required';
            return false;
        }
        if (data.package_height.trim().length == 0) {
            errorDiv.classList.remove('hide');
            errorMsg.classList.add('active');
            errorMsg.innerText = 'Depth required';
            return false;
        }
    }
    else {
        delete data.package_length;
        delete data.package_width;
        delete data.package_height;
        delete data.packaging_type;
    }
    try {
        errorDiv.classList.add('hide');
        errorMsg.classList.remove('active');
        errorMsg.innerHTML = '';
        let token = getCookie('admin_access');
        let headers = {
            "Authorization": `Bearer ${token}`,
            "Content-Type": 'application/json'
        };
        beforeLoad(button);
        let response = await requestAPI(`${apiURL}/admin/shippings/ups/shipping`, JSON.stringify(data), headers, 'POST');
        response.json().then(async function(res) {
            if (response.status == 200) {
                document.getElementById('modal-tracker-field').innerText = res.data.tracking_number;
                document.getElementById('modal-shipping-price-field').innerText = '$' + res.data.total;
                document.getElementById('before-label').classList.add('hide');
                document.getElementById('shipping-speed').innerText = res.data.service_type_name;
                document.getElementById('tracking-id').innerText = res.data.tracking_number;
                document.getElementById('shipping-price').innerText = res.data.total;
                document.getElementById('shipping-label-btn').setAttribute('onclick', `openShippingLabel('${res.data.shipping_label}')`);
                document.getElementById('after-label').classList.remove('hide');
                
                button.style.pointerEvents = 'none';
                document.getElementById('refresh-costs-btn').removeAttribute('onclick');
                form.removeAttribute('onsubmit');
                let patchOrderResponse = await requestAPI(`${apiURL}/admin/orders/${orderId}`, JSON.stringify({"order_shipping": res.data.id, "status": "delivered"}), headers, 'PATCH');
                patchOrderResponse.json().then(function(res) {
                    document.getElementById('resend-email-btn').setAttribute('onclick', `resendEmail(this, '${orderId}')`);
                    if (patchOrderResponse.status == 200) {
                        afterLoad(button, 'GENERATED');
                    }
                })
            }
            else {
                let keys = Object.keys(res.messages);
                errorMsg.classList.add('active');
                errorDiv.classList.remove('hide');
                keys.forEach((key) => {
                    errorMsg.innerHTML += `${key}: ${res.messages[key]} <br />`;
                })
                afterLoad(button, 'ERROR');
            }
        })
    }
    catch (err) {
        console.log(err);
        afterLoad(button, 'ERROR');
    }
}


async function resendEmail(button, id) {
    let buttonText = button.innerText;
    try {
        let token = getCookie('admin_access');
        let headers = {
            "Authorization": `Bearer ${token}`,
            "Content-Type": 'application/json'
        };
        beforeLoad(button);
        let response = await requestAPI(`${apiURL}/admin/orders/${id}/resend-shipping-confirmation`, null, headers, 'POST');
        if (response.status == 200) {
            afterLoad(button, 'EMAIL RESENT');
        }
        else {
            afterLoad(button, 'ERROR');
            setTimeout(() => {
                afterLoad(button, 'RESEND EMAIL');
            }, 2000)
        }
    }
    catch (err) {
        afterLoad(button, 'ERROR');
        setTimeout(() => {
            afterLoad(button, 'RESEND EMAIL');
        }, 2000)
        console.log(err);
    }
}


function openUpdateCustomerModal(id, userEmail, userPhone) {
    let modal = document.querySelector(`#createCustomer`);
    let form = modal.querySelector('form');
    
    form.setAttribute("onsubmit", `updateCustomerForm(event, ${id})`);
    modal.querySelector('.btn-text').innerText = 'UPDATE';
    modal.querySelector('#customer-modal-header-text').innerText = 'Update Customer';
    modal.querySelector('.referral-input-div').classList.add('hide');
    form.querySelector('input[name="first_name"]').classList.add('hide');
    form.querySelector('input[name="last_name"]').classList.add('hide');
    form.querySelector('input[name="phone"]').value = userPhone;
    form.querySelector('input[name="email"]').value = userEmail;
    form.querySelector('input[name="password"]').classList.add('hide');
    form.querySelector('input[name="confirm_password"]').classList.add('hide');
    form.querySelector('.selection-div').classList.add('hide');
    form.querySelector('.additional-inputs').classList.add('hide');

    modal.addEventListener('hidden.bs.modal', event => {
        form.reset();
        form.removeAttribute("onsubmit");
        form.querySelector('input[name="password"]').classList.remove('hide');
        form.querySelector('input[name="confirm_password"]').classList.remove('hide');
        form.querySelector('input[name="first_name"]').classList.remove('hide');
        form.querySelector('input[name="last_name"]').classList.remove('hide');
        form.querySelector('.selection-div').classList.remove('hide');
        form.querySelector('.additional-inputs').classList.remove('hide');
        modal.querySelector('.btn-text').innerText = 'UPDATE';
        modal.querySelector('#customer-modal-header-text').innerText = 'Add New Customer';
        modal.querySelector('.referral-input-div').classList.remove('hide');
        document.querySelector('.create-error-msg').classList.remove('active');
        document.querySelector('.create-error-msg').innerText = "";
    })

    document.querySelector(`.createCustomer`).click();
}


async function updateCustomerForm(event, id) {
    event.preventDefault();
    let form = event.currentTarget;
    let formData = new FormData(form);
    let data = formDataToObject(formData);
    let button = form.querySelector('button[type="submit"]');
    let errorMsg = form.querySelector('.create-error-msg');

    if (phoneRegex.test(data.phone) == false) {
        errorMsg.innerText = 'Please enter a valid number with country code';
        errorMsg.classList.add('active');
        return false;
    }
    else if (emailRegex.test(data.email) == false) {
        errorMsg.innerText = 'Enter valid email';
        errorMsg.classList.add('active');
        return false;
    }
    else {
        try {
            let customerData = {
                user: {
                    phone: data.phone,
                    email: data.email,
                }
            };

            errorMsg.innerText = '';
            errorMsg.classList.remove('active');
            let token = getCookie('admin_access');
            let headers = {
                "Authorization": `Bearer ${token}`,
                "Content-Type": 'application/json'
            };
            beforeLoad(button);
            let response = await requestAPI(`${apiURL}/admin/user-profiles/${id}`, JSON.stringify(customerData), headers, 'PATCH');
            response.json().then(function(res) {
                
                if (response.status == 200) {
                    form.reset();
                    form.removeAttribute('onsubmit');

                    document.getElementById('current-user-email').innerText = res.data.user.email;
                    document.getElementById('current-user-phone').innerText = res.data.user.phone;
                    document.querySelector('#contact-edit-btn').setAttribute('onclick', `openUpdateCustomerModal(${res.data.id}, '${res.data.user.email}', '${res.data.user.phone}')`);
                    
                    afterLoad(button, 'UPDATED');
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


function convertDateTime() {
    let times = document.querySelectorAll('.time-value');
    times.forEach((dateTime) => {
        const inputDate = new Date(dateTime.textContent);
        const formattedTime = new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: 'numeric',
            hour12: true,
        }).format(inputDate);
        
        const result = `${formattedTime}`;

        dateTime.textContent = result;
    })

    let dates = document.querySelectorAll('.date-value');
    dates.forEach((dateTime) => {
        const inputDate = new Date(dateTime.textContent);

        const day = new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(inputDate);
        const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(inputDate);
        const year = new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(inputDate);
        const result = `${month} ${day}, ${year}`;

        dateTime.textContent = result;
    })
}