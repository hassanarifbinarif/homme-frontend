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