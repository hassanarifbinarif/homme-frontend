// Show/hide password functionality

let passwordIcon = document.querySelector(".hide-password-field");

passwordIcon.addEventListener("click", function () {
    try {
        const passwordField = this.nextElementSibling;
        if (this.classList.contains("fa-eye")) {
            this.classList.remove("fa-eye");
            passwordField.type = "password";
        } else {
            this.classList.add("fa-eye");
            passwordField.type = "text";
        }
    } catch (err) {
        console.log(err);
    }
});

// Handling Login Form

async function loginForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let emailField = form.querySelector('input[name="email"]');
    let emailMsg = form.querySelector(".email-msg");
    let passwordField = form.querySelector('input[name="password"]');
    let passwordMsg = form.querySelector(".password-msg");
    let button = form.querySelector('button[type="submit"]');
    let buttonText = button.innerText;

    if (!isValidEmail(emailField)) {
        emailField.classList.add("input-error");
        emailMsg.classList.add("active");
        emailField.addEventListener("input", function () {
            if (isValidEmail(this)) {
                this.classList.remove("input-error");
            } else {
                let inputField = this;
                if (timeOut) {
                    clearTimeout(timeOut);
                }
                timeOut = setTimeout(function () {
                    inputField.classList.add("input-error");
                    emailMsg.classList.add("active");
                }, 1000);
            }
        });
        return false;
    } else if (!isValidPassword(passwordField)) {
        passwordField.classList.add("input-error");
        passwordMsg.classList.add("active");
        passwordField.addEventListener("input", function () {
            if (isValidPassword(this)) {
                this.classList.remove("input-error");
            } else {
                let inputField = this;
                if (timeOut) {
                    clearTimeout(timeOut);
                }
                timeOut = setTimeout(function () {
                    inputField.classList.add("input-error");
                    passwordMsg.classList.add("active");
                }, 1000);
            }
        });
        return false;
    } else {
        try {
            beforeLoad(button);
            let formData = new FormData(form);
            let data = formDataToObject(formData);
            let headers = {
                "Content-Type": "application/json",
                "X-CSRFToken": data.csrfmiddlewaretoken,
            };
            let response = await requestAPI(`${apiURL}/auth/admin/login`, JSON.stringify(data), headers, "POST");
            // console.log(response);
            response.json().then(async function (res) {
                if (response.status == 400) {
                    if(res.messages.password) {
                        passwordField.classList.add("input-error");
                        passwordMsg.classList.add("active");
                        res.messages.password.forEach((message) => {
                            passwordMsg.innerHTML += `${message}. <br />`;
                        });
                    }
                    else if(res.messages.email) {
                        emailField.classList.add("input-error");
                        emailMsg.classList.add("active");
                        res.messages.email.forEach((message) => {
                            emailMsg.innerHTML += `${message}. <br />`;
                        });
                    }
                    afterLoad(button, buttonText);
                } else if (response.status == 200) {
                    emailMsg.innerText = "";
                    passwordMsg.innerText = "";
                    emailMsg.classList.remove("active");
                    passwordMsg.classList.remove("active");
                    afterLoad(button, buttonText);
                    const accessToken = parseJwt(res.access);
                    const refreshToken = parseJwt(res.refresh);
                    setCookie("admin_access", res.access, accessToken.exp);
                    setCookie("admin_refresh", res.refresh, refreshToken.exp);
                    location.href = location.origin + "/";
                    // let header = {
                    //     "Authorization": `Bearer ${res.access}`,
                    // };
                    // let checkAdmin = await requestAPI(`${apiURL}/me`, null, header, "GET");
                    // console.log(checkAdmin);
                    // checkAdmin.json().then(function (validRes) {
                    //     console.log(validRes);
                    //     // if (validRes.key == "validations") {
                    //     //     emailMsg.classList.add("active");
                    //     //     let key = Object.keys(validRes.messages);
                    //     //     emailMsg.innerText = `Could not login. ${
                    //     //         validRes.messages[key[0]]
                    //     //     }`;
                    //     //     afterLoad(button, buttonText);
                    //     // } else {
                    //     //     emailMsg.innerText = "";
                    //     //     passwordMsg.innerText = "";
                    //     //     emailMsg.classList.remove("active");
                    //     //     passwordMsg.classList.remove("active");
                    //     //     afterLoad(button, buttonText);
                    //     //     const accessToken = parseJwt(res.access);
                    //     //     const refreshToken = parseJwt(res.refresh);
                    //     //     // setCookie("admin_access", res.access, accessToken.exp);
                    //     //     // setCookie("admin_refresh", res.refresh, refreshToken.exp);
                    //     //     // location.href = location.origin + "/administration/dashboard";
                    //     // }
                    // });
                } else {
                    passwordMsg.innerText =
                        "An error occured. Please try again";
                    passwordMsg.classList.add("active");
                    afterLoad(button, buttonText);
                }
            });
        } catch (err) {
            console.log(err);
            afterLoad(button, "Error occurred! Retry later");
            setTimeout(() => {
                afterLoad(button, buttonText);
            }, 2000);
        }
    }
}
