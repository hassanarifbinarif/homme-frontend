function openCreateSourceModal(modalId) {
    let modal = document.getElementById(`${modalId}`);
    let form = modal.querySelector('form');
    form.setAttribute('onsubmit', 'createSourceTypeForm(event);');
    modal.addEventListener('hidden.bs.modal', event => {
        form.reset();
        form.removeAttribute('onsubmit');
        form.querySelector('.create-error-msg').innerText = '';
        form.querySelector('.create-error-msg').classList.remove('active');
        form.querySelector('.btn-text').innerText = 'CREATE';
    })
    document.querySelector(`.${modalId}`).click();
}


async function createSourceTypeForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let errorMsg = form.querySelector('.create-error-msg');
    let formData = new FormData(form);
    let data = formDataToObject(formData);
    let button = form.querySelector('button[type="submit"]');
    let buttonText = button.innerText;

    if (data.name.trim().length == 0) {
        errorMsg.innerText = 'Enter valid source name';
        errorMsg.classList.add('active');
        return false;
    }
    // else if (data.embedded_string.trim().length == 0) {
    //     errorMsg.innerText = 'Enter valid embedded string';
    //     errorMsg.classList.add('active');
    //     return false;
    // }
    try {
        errorMsg.innerText = '';
        errorMsg.classList.remove('active');
        let token = getCookie('admin_access');
        let headers = {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        };
        beforeLoad(button);
        let response = await requestAPI(`${apiURL}/admin/sources/types`, JSON.stringify(data), headers, 'POST');
        response.json().then(function(res) {

            if (response.status == 201) {
                form.removeAttribute('onsubmit');
                afterLoad(button, 'CREATED');
                getSourceTypes();
                setTimeout(() => {
                    afterLoad(button, buttonText);
                    document.querySelector('.createSourceTypeModal').click();
                }, 1500)
            }
            else if (response.status == 400) {
                afterLoad(button, 'ERROR');
                let keys = Object.keys(res.messages);
                keys.forEach((key) => {
                    errorMsg.innerHTML += `${key}: ${res.messages[key]}. <br />`;
                })
                errorMsg.classList.add('active');
            }
            else {
                afterLoad(button, 'ERROR');
                errorMsg.innerText = 'Error occurred! Retry later';
                errorMsg.classList.add('active');
            }
        })
    }
    catch (err) {
        console.log(err);
        afterLoad(button, buttonText);
        errorMsg.innerText = 'Error occurred! Retry later';
        errorMsg.classList.add('active');
    }
}


function openUpdateSourceTypeModal(modalID, id, name) {
    let modal = document.querySelector(`#${modalID}`);
    let form = modal.querySelector('form');
    form.querySelector('input[name="name"]').value = name || '';
    form.setAttribute("onsubmit", `updateSourceTypeForm(event, ${id})`);
    modal.addEventListener('hidden.bs.modal', event => {
        form.reset();
        form.removeAttribute("onsubmit");
        modal.querySelector('.btn-text').innerText = 'SAVE';
    })
    document.querySelector(`.${modalID}`).click();
}

async function updateSourceTypeForm(event, id) {
    event.preventDefault();
    let form = event.currentTarget;
    let errorMsg = form.querySelector('.create-error-msg');
    let formData = new FormData(form);
    let data = formDataToObject(formData);
    let button = form.querySelector('button[type="submit"]');
    let buttonText = button.innerText;

    if (data.name.trim().length == 0) {
        errorMsg.innerText = 'Enter valid source name';
        errorMsg.classList.add('active');
        return false;
    }
    try {
        errorMsg.innerText = '';
        errorMsg.classList.remove('active');
        let token = getCookie('admin_access');
        let headers = {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        };
        beforeLoad(button);
        let response = await requestAPI(`${apiURL}/admin/sources/types/${id}`, JSON.stringify(data), headers, 'PATCH');
        response.json().then(function(res) {
            if (response.status == 200) {
                form.removeAttribute('onsubmit');
                afterLoad(button, 'SAVED');
                getSourceTypes();
                setTimeout(() => {
                    afterLoad(button, buttonText);
                    document.querySelector('.editSourceTypeModal').click();
                }, 1500)
            }
            else if (response.status == 400) {
                afterLoad(button, 'ERROR');
                let keys = Object.keys(res.messages);
                keys.forEach((key) => {
                    errorMsg.innerHTML += `${key}: ${res.messages[key]}. <br />`;
                })
                errorMsg.classList.add('active');
            }
            else {
                afterLoad(button, 'ERROR');
                errorMsg.innerText = 'Error occurred! Retry later';
                errorMsg.classList.add('active');
            }
        })
    }
    catch (err) {
        console.log(err);
        afterLoad(button, buttonText);
        errorMsg.innerText = 'Error occurred! Retry later';
        errorMsg.classList.add('active');
    }
}


function openDelSourceTypeModal(modalID, id) {
    let modal = document.querySelector(`#${modalID}`);
    let form = modal.querySelector('form');
    form.setAttribute("onsubmit", `delSourceTypeForm(event, ${id})`);
    modal.querySelector('#modal-header-text').innerText = 'Delete Source Type';
    modal.querySelector('#warning-statement').innerText = 'Are you sure you want to delete this source type?';
    modal.addEventListener('hidden.bs.modal', event => {
        form.reset();
        form.removeAttribute("onsubmit");
        modal.querySelector('#modal-header-text').innerText = '';
        modal.querySelector('#warning-statement').innerText = '';
        modal.querySelector('.btn-text').innerText = 'DELETE';
    })
    document.querySelector(`.${modalID}`).click();
}

async function delSourceTypeForm(event, id) {
    event.preventDefault();
    let form = event.currentTarget;
    let button = form.querySelector('button[type="submit"]');
    let buttonText = button.innerText;

    try {
        let token = getCookie('admin_access');
        let headers = {
            "Authorization": `Bearer ${token}`
        };
        beforeLoad(button);
        let response = await requestAPI(`${apiURL}/admin/sources/types/${id}`, null, headers, 'DELETE');
        // console.log(response);
        if (response.status == 204) {
            form.reset();
            form.removeAttribute("onsubmit");
            afterLoad(button, 'DELETED');
            getSourceTypes();
            setTimeout(() => {
                document.querySelector('.delModal').click();
            }, 1000)
        }
        else {
            afterLoad(button, 'Error');
        }
    }
    catch (err) {
        afterLoad(button, 'Error');
        console.log(res);
    }
}