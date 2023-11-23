function togglePasswordField(event) {
    let element = event.target;
    try {
        const passwordField = element.nextElementSibling;
        if (element.classList.contains("fa-eye")) {
            element.classList.remove("fa-eye");
            passwordField.type = "password";
        } else {
            element.classList.add("fa-eye");
            passwordField.type = "text";
        }
    } catch (err) {
        console.log(err);
    }
}


async function resetPasswordForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let newPasswordField = form.querySelector('input[name="password"]');
    let confirmPasswordField = form.querySelector('input[name=confirm_password]');
    let newPasswordMsg = form.querySelector('.new_password');
    let confirmPasswordMsg = form.querySelector('.confirm_password');

    if (!isValidPassword(newPasswordField)) {
        newPasswordField.classList.add("input-error");
        newPasswordMsg.classList.add("active");
        newPasswordField.addEventListener("input", function () {
            if (isValidPassword(this)) {
                this.classList.remove("input-error");
            } else {
                let inputField = this;
                if (timeOut) {
                    clearTimeout(timeOut);
                }
                timeOut = setTimeout(function () {
                    inputField.classList.add("input-error");
                    newPasswordMsg.classList.add("active");
                }, 1000);
            }
        });
        return false;
    }
    else if (!isValidPassword(confirmPasswordField)) {
        confirmPasswordField.classList.add("input-error");
        confirmPasswordMsg.classList.add("active");
        confirmPasswordField.addEventListener("input", function () {
            if (isValidPassword(this)) {
                this.classList.remove("input-error");
            } else {
                let inputField = this;
                if (timeOut) {
                    clearTimeout(timeOut);
                }
                timeOut = setTimeout(function () {
                    inputField.classList.add("input-error");
                    confirmPasswordMsg.classList.add("active");
                }, 1000);
            }
        });
        return false;
    }
    else if (!matchingPassword(newPasswordField, confirmPasswordField)) {
        confirmPasswordMsg.classList.add("active");
        confirmPasswordField.classList.add("input-error");
        return false;
    }
    else {
        newPasswordMsg.innerText = '';
        confirmPasswordMsg.innerText = '';
        newPasswordMsg.classList.remove('active');
        confirmPasswordMsg.classList.remove('active');

        try {
            let button = form.querySelector('button[type="submit"]');
            let buttonText = button.innerText;
            let formData = new FormData(form);
            let data = formDataToObject(formData);
            data.email = sessionStorage.getItem('em');
            data.verification_token = sessionStorage.getItem('to');
            let headers = {
                "Content-Type": "application/json"
            };
            beforeLoad(button);
            let response = await requestAPI(`${apiURL}/auth/forgot-password`, JSON.stringify(data), headers, 'POST');
            console.log(response);
            response.json().then(function(res) {
                console.log(res);
                if (response.status == 400) {
                    if(res.messages.password) {
                        newPasswordField.classList.add("input-error");
                        newPasswordMsg.classList.add("active");
                        res.messages.password.forEach((message) => {
                            newPasswordMsg.innerHTML += `${message}. <br />`;
                        });
                    }
                    afterLoad(button, buttonText);
                }
                else if (response.status == 200) {
                    afterLoad(button, 'PASSWORD RESET');
                    form.reset();
                    button.disabled = true;
                    sessionStorage.clear();
                    setTimeout(() => {
                        afterLoad(button, buttonText);
                        location.href = location.origin + '/signin/';
                    }, 1500)
                }
                else {
                    afterLoad(button, buttonText);
                    confirmPasswordMsg.innerText = 'Error occured! Retry.';
                    confirmPasswordMsg.classList.add('active');
                }
            })
        }
        catch (err) {
            console.log(err);
            afterLoad(button, buttonText);
            confirmPasswordMsg.innerText = 'Error occured! Retry.';
            confirmPasswordMsg.classList.add('active');
        }
    }
}