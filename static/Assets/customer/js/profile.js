window.onload = () => {
    // getNotifications();
}


// Preview Image on profile form

function previewImage(event) {
    let image = event.currentTarget.files;
    let imageTag = document.getElementById('profile-image');
    imageTag.src = window.URL.createObjectURL(image[0]);
}


// Handling Profile Form

async function profileForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let nameField = form.querySelector('input[name="fullname"]');
    let currentPasswordField = form.querySelector('input[name="current_password"]');
    let newPasswordField = form.querySelector('input[name="new_password"]');
    let confirmPasswordField = form.querySelector('input[name="confirm_password"]');
    let errorMsg = form.querySelector('.error-msg');

    if(nameField.value.trim().length == 0) {
        errorMsg.innerText = 'Invalid name';
        errorMsg.classList.add('active');
        return false;
    }
    else {
        if (!(currentPasswordField.value == '' && newPasswordField.value == '' && confirmPasswordField.value == '')) {
            if (currentPasswordField.value.length < 8) {
                errorMsg.innerText = 'Current password must be atleast 8 characters';
                errorMsg.classList.add('active');
                return false;
            }
            else if (newPasswordField.value.length < 8) {
                errorMsg.innerText = 'New password must be atleast 8 characters';
                errorMsg.classList.add('active');
                return false;
            }
            else if (confirmPasswordField.value.length < 8) {
                errorMsg.innerText = 'Confirm password must be atleast 8 characters';
                errorMsg.classList.add('active');
                return false;
            }
            else if (newPasswordField.value != confirmPasswordField.value) {
                errorMsg.innerText = 'Passwords does not match';
                errorMsg.classList.add('active');
                return false;
            }
        }
        try {
            errorMsg.innerText = '';
            errorMsg.classList.remove('active');
            let token = getCookie('admin_access');
            let formData = new FormData(form);
            let headers = {
                "Authorization": `Bearer ${token}`,
            };
            let button = form.querySelector('button[type="submit"]');
            let buttonText = button.innerText;
            beforeLoad(button);
            let response = await requestAPI(`${apiURL}/me`, formData, headers, 'PATCH');
            response.json().then(function(res) {
                // console.log(res);
                if (response.status == 200) {
                    afterLoad(button, 'Changes Saved');
                    document.getElementById('nav-admin-name').innerText = res.fullname;
                    document.getElementById('nav-admin-image').src = res.user.profile_picture;
                    setTimeout(() => {
                        afterLoad(button, buttonText);
                    }, 1500)
                }
                else {
                    if (res.messages.current_password) {
                        errorMsg.classList.add('active');
                        res.messages.current_password.forEach((message) => {
                            errorMsg.innerHTML += `<b>Current Password:</b> ${message}. <br />`;
                        });
                    }
                    if (res.messages.new_password) {
                        errorMsg.classList.add('active');
                        res.messages.new_password.forEach((message) => {
                            errorMsg.innerHTML += `<b>New Password:</b> ${message}. <br />`;
                        });
                    }
                    if (res.messages.confirm_password) {
                        res.messages.confirm_password.forEach((message) => {
                            errorMsg.innerHTML += `<b>Confirm Password:</b> ${message}. <br />`;
                        });
                    }
                    afterLoad(button, buttonText);
                }
                // if(!res.success) {
                //     afterLoad(button, buttonText);
                //     return false;
                // }
                // else {
                //     afterLoad(button, buttonText);
                //     location.pathname = `${location.pathname}`;
                // }
            })
        }
        catch (err) {
            console.log(err);
        }
    }
}