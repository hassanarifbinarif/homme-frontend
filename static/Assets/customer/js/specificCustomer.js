let commentsWrapper = document.getElementById('comments-wrapper');
let showCommentsCheckbox = document.getElementById('comment-checkbox');

let commentWrapper = document.getElementById('comments-wrapper');
let commentLoader = document.getElementById('comment-loader');
let noCommentDiv = document.getElementById('no-comment-div');
let allCommentData = [];

let timelineDataURL = `/admin/users/activities?ordering=-created_at&user=${specific_cust_id}&perPage=1000`;


showCommentsCheckbox.addEventListener('change', function() {
    if (this.checked) {
        commentsWrapper.classList.remove('hide');
    }
    else {
        commentsWrapper.classList.add('hide');
    }
})


window.onload = () => {
    getNotifications();
    getRelativeTime(document.getElementById('customer-joining-time').getAttribute('data-value'));
    populateSalonDropdown();
    populateStatesAndCountriesDropdown();
    getTimelineData();
}


async function getTimelineData() {
    commentLoader.classList.remove('hide');
    commentWrapper.classList.add('hide');
    noCommentDiv.classList.add('hide');

    try {
        let token = getCookie('admin_access');
        let headers = {
            "Authorization": `Bearer ${token}`
        };
        let response = await requestAPI(`${apiURL}${timelineDataURL}`, null, headers, 'GET');
        response.json().then(function(res) {

            if (response.status == 200 && res.data.length > 0) {
                allCommentData = [...res.data];
                populateTimeline(res.data);
                commentLoader.classList.add('hide');
                commentWrapper.classList.remove('hide');
                noCommentDiv.classList.add('hide');
            }
            else {
                commentLoader.classList.add('hide');
                noCommentDiv.classList.remove('hide');
            }
        })
    }
    catch (err) {
        commentLoader.classList.add('hide');
        noCommentDiv.classList.remove('hide');
        console.log(err);
    }
}


let groupedComments = {}

function populateTimeline(data) {
    groupedComments = groupCommentsByDate(data);
    commentWrapper.innerHTML = '';

    for (const [date, comments] of Object.entries(groupedComments)) {
        const ul = document.createElement("ul");
        ul.classList.add('timeline', 'see');

        let dateParagraph = document.createElement("p");
        dateParagraph.textContent = getCommentMonthAndDate(date);
        ul.appendChild(dateParagraph);

        let commentDiv = document.createElement('div');
        ul.appendChild(commentDiv);
        commentWrapper.appendChild(ul);

        comments.forEach(commentData => {
            commentDiv.insertAdjacentHTML('beforeend', `<li>
                                                            <div>
                                                                <pre>${commentData.message}</pre>
                                                            </div>
                                                            <div class="comment-time">${getCommentTime(commentData.created_at)}</div>
                                                        </li>`);
        });
    }
}


function groupCommentsByDate(comments) {
    const grouped = {};
    comments.forEach(comment => {
        const date = new Date(comment.created_at);
        const localeDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        const dateString = localeDate.toISOString().split('T')[0];
        if (!grouped[dateString]) {
            grouped[dateString] = [];
        }
        grouped[dateString].push(comment);
    });
    return grouped;
}


function addNewComment(newComment) {
    const date = new Date(newComment.created_at);
    const abcDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    const localDate = new Date(abcDate).toISOString().split('T')[0];

    allCommentData.unshift(newComment);
    populateTimeline(allCommentData);
    noCommentDiv.classList.add('hide');
    commentWrapper.classList.remove('hide');
}


const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function getCommentMonthAndDate(dateString) {
    let dateObject = new Date(dateString);
    let localeDateObject = new Date(dateObject.toLocaleString());

    const month = monthNames[localeDateObject.getMonth()];
    const day = localeDateObject.getDate();

    return `${month} ${day}`;
}


function getCommentTime(dateString) {
    let dateObject = new Date(dateString);
    let localeDateObject = new Date(dateObject.toLocaleString());

    const hours = localeDateObject.getHours();
    const minutes = localeDateObject.getMinutes();

    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    const result = `${formattedHours}:${formattedMinutes} ${ampm}`;

    return result
}


async function commentForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let commenTextarea = document.getElementById('comment-textarea');
    let errorMsg = document.querySelector('.comment-error-msg');
    let button = document.getElementById('comment-post-btn');
    let buttonText = button.innerText;

    if (commenTextarea.value.trim().length == 0) {
        errorMsg.innerHTML = 'Enter valid comment';
        errorMsg.classList.add('active');
        return false;
    }

    try {
        let data = { "data": { "comment": commenTextarea.value }, user: specific_cust_id };
        errorMsg.innerHTML = '';
        errorMsg.classList.remove('active');

        let token = getCookie('admin_access');
        let headers = {
            "Authorization": `Bearer ${token}`,
            "Content-Type": 'application/json'
        };

        beforeLoad(button);
        let response = await requestAPI(`${apiURL}/admin/users/activities`, JSON.stringify(data), headers, 'POST');
        response.json().then(function(res) {
            if (response.status == 201) {
                button.style.pointerEvents = 'none';
                afterLoad(button, 'POSTED');
                form.reset();
                addNewComment(res.data);
                setTimeout(() => {
                    afterLoad(button, 'POST');
                    button.style.pointerEvents = 'auto';
                }, 1200)
            }
            else {
                errorMsg.classList.add('active');
                afterLoad(button, 'ERROR');
                displayMessages(res.messages, errorMsg);
            }
        })
    }
    catch (err) {
        errorMsg.classList.add('active');
        afterLoad(button, 'ERROR');
        displayMessages(res.messages, errorMsg);
        console.log(err);
    }
}


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


let salonDropdown = document.getElementById('salon-dropdown');
let salonField = document.getElementById('salon-field');
let salonData = {};
let selectedSalon = null;


async function populateSalonDropdown() {
    let token = getCookie('admin_access');
    let headers = {
        "Authorization": `Bearer ${token}`
    }
    let responseSalonList = await requestAPI(`${apiURL}/admin/salon-profiles?ordering=-created_at&user__is_blocked=false&page=1&perPage=1000`, null, headers, 'GET');
    responseSalonList.json().then(function(res) {
        salonData = [...res.data];
        res.data.forEach((salon) => {
            salonDropdown.insertAdjacentHTML('beforeend', `<div class="radio-btn salon-item-list" data-id="${salon.id}">
                                                                <input onchange="selectSalon(event);" id="cust-${salon.id}" type="radio" value="${salon.id}" name="salon" />
                                                                <label for="cust-${salon.id}" class="radio-label">${salon.salon_name}</label>
                                                            </div>`);
        })
    })
}


function selectSalon(event) {
    let inputElement = event.target;
    if(inputElement.checked) {
        salonField.value = inputElement.nextElementSibling.innerText;
        selectedSalon = inputElement.value;
    }
}


salonField.addEventListener('focus', function() {
    salonDropdown.style.display = 'flex';
})

salonField.addEventListener('blur', function(event) {
    setTimeout(() => {
        salonDropdown.style.display = 'none';
    }, 200);
})

salonField.addEventListener('input', function() {
    let filteredSalon = [];
    filteredSalon = salonData.filter(salon => salon.salon_name.toLowerCase().includes(this.value.toLowerCase())).map((salon => salon.id));
    if (filteredSalon.length == 0) {
        document.getElementById('no-salon-text').classList.remove('hide');
        document.querySelectorAll('.salon-item-list').forEach((item) => item.classList.add('hide'));
    }
    else {
        document.getElementById('no-salon-text').classList.add('hide');
        document.querySelectorAll('.salon-item-list').forEach((item) => {
            let itemID = item.getAttribute('data-id');
            if (filteredSalon.includes(parseInt(itemID, 10))) {
                item.classList.remove('hide');
            }
            else {
                item.classList.add('hide');
            }
        })
    }
})


function openUpdateCustomerModal(event, id, first_name, last_name, phone, email) {
    let salonId = event.target.closest('div').getAttribute('data-salon');
    let modal = document.querySelector(`#createCustomer`);
    let form = modal.querySelector('form');
    
    form.setAttribute("onsubmit", `updateCustomerForm(event, ${id})`);
    modal.querySelector('.btn-text').innerText = 'UPDATE';
    modal.querySelector('#customer-modal-header-text').innerText = 'Update Customer';
    modal.querySelector('.referral-input-div').classList.add('hide');
    form.querySelector('input[name="first_name"]').value = first_name;
    form.querySelector('input[name="last_name"]').value = last_name;
    form.querySelector('input[name="phone"]').value = phone;
    form.querySelector('input[name="email"]').value = email;
    form.querySelector('input[name="password"]').classList.add('hide');
    form.querySelector('input[name="confirm_password"]').classList.add('hide');
    
    if (salonId != 'null') {
        form.querySelectorAll('input[name="salon"]').forEach((input) => {
            if (input.value == salonId) {
                input.checked = true;
                selectedSalon = input.value;
                salonField.value = input.nextElementSibling.innerText;
            }
        })
    }

    modal.addEventListener('hidden.bs.modal', event => {
        form.reset();
        form.removeAttribute("onsubmit");
        form.querySelector('input[name="password"]').classList.remove('hide');
        form.querySelector('input[name="confirm_password"]').classList.remove('hide');
        modal.querySelector('.btn-text').innerText = 'UPDATE';
        modal.querySelector('#customer-modal-header-text').innerText = 'Add New Customer';
        modal.querySelector('.referral-input-div').classList.remove('hide');
        document.querySelector('.create-error-msg').classList.remove('active');
        document.querySelector('.create-error-msg').innerText = "";
        selectedSalon = null;
        salonField.value = '';
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
    else if (phoneRegex.test(data.phone) == false) {
        errorMsg.innerText = 'Please enter a valid number with country code';
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
                    email: data.email,
                }
            };

            if (selectedSalon != null)
                customerData.salon = parseInt(selectedSalon);

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

                    document.getElementById('customer-first-last-name-field').innerText = `${res.data.first_name} ${res.data.last_name}`;
                    document.getElementById('customer-email-field').innerText = res.data.user.email;
                    document.getElementById('customer-phone-field').innerText = res.data.user.phone;

                    document.querySelector('div[data-salon]').setAttribute('onclick', `openUpdateCustomerModal(event, '${res.data.id}', '${res.data.first_name}', '${res.data.last_name}', '${res.data.user.phone}', '${res.data.user.email}')`);

                    if (res.data.salon) {
                        document.querySelector('div[data-salon]').setAttribute('data-salon', res.data.salon.id);
                    }
                    
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