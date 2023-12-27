let entityDropdown = document.getElementById('entity-dropdown');
let entityField = document.getElementById('entity-field');

entityField.addEventListener('click', toggleDropdown);


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
    if ((!entityField.contains(event.target)) && entityDropdown.style.display == 'flex') {
        entityDropdown.style.display = 'none';
    }
}

document.body.addEventListener('click', closeDropdowns);


function selectEntity(inputField) {
    if (inputField.checked) {
        document.getElementById(`selected-entity-text`).innerText = inputField.nextElementSibling.innerText;
        document.getElementById(`selected-entity-text`).style.color = '#000';
    }
}


function openCreateSourceModal() {
    let modal = document.getElementById('createSource');
    let form = modal.querySelector('form');
    form.setAttribute('onsubmit', 'createSourceForm(event);');
    modal.addEventListener('hidden.bs.modal', event => {
        form.reset();
        form.removeAttribute('onsubmit');
        form.querySelector('.create-error-msg').innerText = '';
        form.querySelector('.create-error-msg').classList.remove('active');
        form.querySelector('.btn-text').innerText = 'CREATE';
        form.querySelector(`#selected-entity-text`).innerText = 'Select Entity';
        form.querySelector(`#selected-entity-text`).style.color = '#A9A9A9';
    })
    document.querySelector('.createSource').click();
}


async function createSourceForm(event) {
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
    else if (data.embedded_string.trim().length == 0) {
        errorMsg.innerText = 'Enter valid embedded string';
        errorMsg.classList.add('active');
        return false;
    }
    else if (!data.entity) {
        errorMsg.innerText = 'Select an entity';
        errorMsg.classList.add('active');
        return false;
    }
    else if (data.description.trim().length == 0) {
        errorMsg.innerText = 'Enter description';
        errorMsg.classList.add('active');
        return false;
    }
    else {
        try {
            errorMsg.innerText = '';
            errorMsg.classList.remove('active');
            let token = getCookie('admin_access');
            let headers = {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            };
            beforeLoad(button);
            let response = await requestAPI(`${apiURL}/admin/sources`, JSON.stringify(data), headers, 'POST');
            response.json().then(function(res) {

                if (response.status == 201) {
                    form.removeAttribute('onsubmit');
                    afterLoad(button, 'CREATED');
                    if (location.pathname == '/customers/') {
                        setTimeout(() => {
                            afterLoad(button, buttonText);
                            document.querySelector('.createSource').click();
                            location.href = location.origin + '/source/';
                        }, 1000)
                    }
                    else {
                        getData();
                        setTimeout(() => {
                            afterLoad(button, buttonText);
                            document.querySelector('.createSource').click();
                        }, 1500)
                    }
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
}