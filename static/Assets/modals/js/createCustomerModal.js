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
    })
    document.querySelector(`.createCustomer`).click();
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
                        errorMsg.innerHTML += `${key}: ${res.messages[key]} <br />`;
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