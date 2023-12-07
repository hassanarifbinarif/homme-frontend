function openCreateEventModal(modalID) {
    let modal = document.querySelector(`#${modalID}`);
    let form = modal.querySelector('form');
    form.setAttribute("onsubmit", 'createEventForm(event)');
    modal.addEventListener('hidden.bs.modal', event => {
        form.reset();
        form.removeAttribute("onsubmit");
        let label = modal.querySelector('label');
        label.querySelector('.event-img').src = '';
        label.querySelector('.event-img').classList.add('hide');
        label.querySelector('svg').style.display = 'block';
        label.querySelectorAll('span').forEach((span) => {
            span.style.display = 'block';
        })
        modal.querySelector('.btn-text').innerText = 'SAVE';
        document.querySelector('.error-div').classList.add('hide');
        document.querySelector('.create-error-msg').classList.remove('active');
        document.querySelector('.create-error-msg').innerText = "";
    })
    document.querySelector(`.${modalID}`).click();
}


function verifyEventImage(input) {
    if (input.files.length > 0) {
        let label = input.closest('label');
        let width = 330;
        let height = 330;
        const img = document.createElement('img');
        const selectedImage = input.files[0];
        const objectURL = URL.createObjectURL(selectedImage);
        let imageTag = label.querySelector('.event-img');
        img.onload = function handleLoad() {
            // console.log(`Width: ${img.width}, Height: ${img.height}`);
    
            if (img.width == width && img.height == height) {
                imageTag.src = objectURL;
                imageTag.classList.remove('hide');
                label.querySelector('svg').style.display = 'none';
                label.querySelectorAll('span').forEach((span) => {
                    span.style.display = 'none';
                })
                document.querySelector('.error-div').classList.add('hide');
                document.querySelector('.create-error-msg').classList.remove('active');
                document.querySelector('.create-error-msg').innerText = "";
            }
            else {
                URL.revokeObjectURL(objectURL);
                imageTag.classList.add('hide');
                label.querySelector('svg').style.display = 'block';
                label.querySelectorAll('span').forEach((span) => {
                    span.style.display = 'block';
                })
                document.querySelector('.error-div').classList.remove('hide');
                document.querySelector('.create-error-msg').classList.add('active');
                document.querySelector('.create-error-msg').innerText = "Image does not match supported dimensions: 330x330 px";
                input.value = null;
            }
        };
  
        img.src = objectURL;
    }
}


async function createEventForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let formData = new FormData(form);
    let data = formDataToObject(formData);
    let imageInput = form.querySelector('input[name="image"]');
    let button = form.querySelector('button[type="submit"]');
    let buttonText = button.innerText;
    let errorDiv = form.querySelector('.error-div');
    let errorMsg = form.querySelector('.create-error-msg');

    if (data.title.trim().length == 0) {
        errorDiv.classList.remove('hide');
        errorMsg.innerText = 'Enter valid title';
        errorMsg.classList.add('active');
        return false;
    }
    else if (data.description.trim().length == 0) {
        errorDiv.classList.remove('hide');
        errorMsg.innerText = 'Enter short description';
        errorMsg.classList.add('active');
        return false;
    }
    else if (data.long_description.trim().length == 0) {
        errorDiv.classList.remove('hide');
        errorMsg.innerText = 'Enter long description';
        errorMsg.classList.add('active');
        return false;
    }
    else if (data.venue.trim().length == 0) {
        errorDiv.classList.remove('hide');
        errorMsg.innerText = 'Enter venue';
        errorMsg.classList.add('active');
        return false;
    }
    else if (data.location.trim().length == 0) {
        errorDiv.classList.remove('hide');
        errorMsg.innerText = 'Enter venue address';
        errorMsg.classList.add('active');
        return false;
    }
    else if (data.rsvp.trim().length == 0) {
        errorDiv.classList.remove('hide');
        errorMsg.innerText = 'Enter rsvp link';
        errorMsg.classList.add('active');
        return false;
    }
    else if (imageInput.files.length == 0) {
        errorDiv.classList.remove('hide');
        errorMsg.innerText = 'Image with supported dimensions is required';
        errorMsg.classList.add('active');
        return false;
    }
    else {
        try {
            errorDiv.classList.add('hide');
            errorMsg.innerText = '';
            errorMsg.classList.remove('active');
            let token = getCookie('admin_access');
            let headers = {
                "Authorization": `Bearer ${token}`
            };
            beforeLoad(button);
            let response = await requestAPI(`${apiURL}/admin/content/events`, formData, headers, 'POST');
            // console.log(response);
            response.json().then(function(res) {
                // console.log(res);
                if (response.status == 201) {
                    getData();
                    afterLoad(button, 'SAVED');
                    form.removeAttribute('onsubmit');
                    setTimeout(() => {
                        afterLoad(button, 'SAVE');
                        document.querySelector('.eventCreate').click();
                    }, 1000)
                }
                else {
                    afterLoad(button, buttonText);
                    errorDiv.classList.remove('hide');
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