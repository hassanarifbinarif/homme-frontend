let commentsWrapper = document.getElementById('comments-wrapper');
let showCommentsCheckbox = document.getElementById('comment-checkbox');

showCommentsCheckbox.addEventListener('change', function() {
    if (this.checked) {
        commentsWrapper.classList.remove('hide');
    }
    else {
        commentsWrapper.classList.add('hide');
    }
})


function getRelativeTime(dateTime) {
    const today = new Date();
    const timezoneOffset = today.getTimezoneOffset() * 60000;
    const date = new Date();
    const oldDate = new Date(`${dateTime}`);
    const timestamp = date.getTime() - timezoneOffset;
    const oldTimestamp = oldDate.getTime() - timezoneOffset;
    const seconds = Math.floor(timestamp / 1000);
    const oldSeconds = Math.floor(oldTimestamp / 1000);
    const difference = seconds - oldSeconds;
    let output = ``;
    if (difference < 60) {
        // Less than a minute has passed:
        output = `Customer for ${difference} seconds`;
    } else if (difference < 3600) {
        // Less than an hour has passed:
        output = `Customer for ${Math.floor(difference / 60)} minutes`;
    } else if (difference < 86400) {
        // Less than a day has passed:
        output = `Customer for ${Math.floor(difference / 3600)} hours`;
    } else if (difference < 2620800) {
        // Less than a month has passed:
        output = `Customer for ${Math.floor(difference / 86400)} days`;
    } else if (difference < 31449600) {
        // Less than a year has passed:
        output = `Customer for ${Math.floor(difference / 2620800)} months`;
    } else {
        // More than a year has passed:
        output = `Customer for ${Math.floor(difference / 31449600)} years`;
    }
    // console.log(output);
    document.getElementById('customer-joining-time').innerText = output;
}

window.onload = () => {
    getNotifications();
    getRelativeTime(document.getElementById('customer-joining-time').getAttribute('data-value'));
}


function seeOrders(id) {
    location.pathname = `/orders/${id}/`;
}


let editCustomerNotesBtn = document.getElementById('edit-customer-notes');
let updateCustomerWrapper = document.getElementById('edit-customer-notes-btn');
if (editCustomerNotesBtn)
    editCustomerNotesBtn.addEventListener('click', toggleCustomerNotesInputs);

function toggleCustomerNotesInputs() {
    let label = document.getElementById('image-label');
    let labelWrapper = label.closest('.label-wrapper');
    if (updateCustomerWrapper.classList.contains('hide')) {
        updateCustomerWrapper.classList.remove('hide');
        document.getElementById('notes-textarea').value = document.getElementById('notes-paragraph').innerText == 'No notes recorded' ? '' : document.getElementById('notes-paragraph').innerText;
        document.getElementById('notes-paragraph').classList.add('hide');
        document.getElementById('notes-textarea').classList.remove('hide');
        autoResize(document.getElementById('notes-textarea'));
        document.getElementById('notes-textarea').focus();
        if (labelWrapper.getAttribute('data-status') == 'image-none') {
            document.getElementById('no-style-image-txt').classList.add('hide');
        }
        else if (labelWrapper.getAttribute('data-status') == 'image-contains') {
            label.setAttribute('for', 'style_image');
        }
        label.classList.remove('hide');
    }
    else {
        updateCustomerWrapper.classList.add('hide');
        document.getElementById('notes-textarea').value = '';
        document.getElementById('notes-paragraph').classList.remove('hide');
        document.getElementById('notes-textarea').classList.add('hide');
        if (labelWrapper.getAttribute('data-status') == 'image-none') {
            document.getElementById('no-style-image-txt').classList.remove('hide');
            label.classList.add('hide');
        }
        else if (labelWrapper.getAttribute('data-status') == 'image-contains') {
            label.setAttribute('for', '');
        }
    }
}


function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}


function previewImage(event) {
    let imageInput = event.currentTarget;
    let image = imageInput.files;
    let imageTag = imageInput.closest('label').querySelector('.hairstyle-image');
    imageTag.src = window.URL.createObjectURL(image[0]);
    imageTag.classList.remove('hide');
    imageInput.closest('label').querySelector('svg').style.display = 'none';
}


async function customerNotesForm(event, id) {
    event.preventDefault();
    let form = event.currentTarget;
    let formData = new FormData(form);
    let button = form.querySelector('button[type="submit"]');
    let buttonText = button.innerText;
    let label = form.querySelector('label');
    try {
        let token = getCookie('admin_access');
        let headers = {
            "Authorization": `Bearer ${token}`
        };
        beforeLoad(button);
        let response = await requestAPI(`${apiURL}/admin/salons/customers/${id}`, formData, headers, 'PATCH');
        response.json().then(function(res) {
            if (response.status == 200) {
                afterLoad(button, 'SAVE');
                if (res.data.style_image) {
                    label.closest('.label-wrapper').setAttribute('data-status', 'image-contains');
                    if (document.getElementById('no-style-image-txt')) {
                        document.getElementById('no-style-image-txt').remove();
                    }
                }
                if (res.data.notes.trim().length == 0) {
                    document.getElementById('notes-paragraph').innerText = 'No notes recorded';
                }
                else {
                    document.getElementById('notes-paragraph').innerText = res.data.notes;
                }
                toggleCustomerNotesInputs();
            }
            else {
                afterLoad(button, 'ERROR');
            }
        })
    }
    catch (err) {
        afterLoad(button, buttonText);
        console.log(err);
    }
}


function openUpdateCustomerModal(id, first_name, last_name, phone, email) {
    let modal = document.querySelector(`#createCustomer`);
    let form = modal.querySelector('form');
    
    form.setAttribute("onsubmit", `updateCustomerForm(event, ${id})`);
    modal.querySelector('.btn-text').innerText = 'UPDATE';
    modal.querySelector('#customer-modal-header-text').innerText = 'Update Customer';
    form.querySelector('input[name="first_name"]').value = first_name;
    form.querySelector('input[name="last_name"]').value = last_name;
    form.querySelector('input[name="phone"]').value = phone;
    form.querySelector('input[name="email"]').value = email;

    modal.addEventListener('hidden.bs.modal', event => {
        form.reset();
        form.removeAttribute("onsubmit");
        modal.querySelector('.btn-text').innerText = 'ADD';
        modal.querySelector('#customer-modal-header-text').innerText = 'Add New Customer';
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
    else {
        try {
            let customerData = {
                first_name: data.first_name,
                last_name: data.last_name,
                user: {
                    phone: data.phone,
                    email: data.email
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
            // console.log(response);
            response.json().then(function(res) {
                
                if (response.status == 200) {
                    form.reset();
                    form.removeAttribute('onsubmit');

                    document.getElementById('customer-first-last-name-field').innerText = `${res.data.first_name} ${res.data.last_name}`;
                    document.getElementById('customer-email-field').innerText = res.data.user.email;
                    document.getElementById('customer-phone-field').innerText = res.data.user.phone;
                    
                    afterLoad(button, 'UPDATED');
                    setTimeout(() => {
                        document.querySelector('.createCustomer').click();
                    }, 1000)
                }
                else {
                    afterLoad(button, 'ERROR');
                    let keys = Object.keys(res.messages);
                    keys.forEach((key) => {
                        if (typeof res.messages[key] === 'object') {
                            const nestedKeys = Object.keys(res.messages[key]);
                            nestedKeys.forEach((nestedKey) => {
                                errorMsg.innerHTML += `${nestedKey}: ${res.messages[key][nestedKey][0]} <br />`;
                            });
                        }
                    })
                    // keys.forEach((key) => {
                    //     errorMsg.innerHTML += `${key}: ${res.messages[key]} <br />`;
                    // })
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