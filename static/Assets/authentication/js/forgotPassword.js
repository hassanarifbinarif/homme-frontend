async function forgotPasswordForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let emailField = form.querySelector('input[name="email"]');
    let emailMsg = form.querySelector(".email-msg");
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
    } else {
        try {
            emailField.classList.remove("input-error");
            emailMsg.classList.remove("active");
            emailMsg.innerText = '';
            beforeLoad(button);
            let formData = new FormData(form);
            let data = formDataToObject(formData);
            data.otp_type = 'forgot';
            let headers = {
                "Content-Type": "application/json",
            };
            let response = await requestAPI(`${apiURL}/auth/otp/send`, JSON.stringify(data), headers, "POST");
            // console.log(response);
            response.json().then(async function (res) {
                // console.log(res);
                if (response.status == 400) {
                    if(res.messages.email) {
                        emailField.classList.add("input-error");
                        emailMsg.classList.add("active");
                        res.messages.email.forEach((message) => {
                            emailMsg.innerHTML += `${message}. <br />`;
                        });
                    }
                    afterLoad(button, buttonText);
                } else if (response.status == 200) {
                    emailMsg.innerText = "";
                    emailMsg.classList.remove("active");
                    afterLoad(button, 'CODE SENT');
                    sessionStorage.setItem("em", `${data.email}`);
                    location.href = location.origin + "/verify-code/";
                } else {
                    emailMsg.innerText = "An error occured. Please try again";
                    emailMsg.classList.add("active");
                    afterLoad(button, buttonText);
                }
            });
        } catch (err) {
            console.log(err);
            afterLoad(button, "Error! Retry later");
            setTimeout(() => {
                afterLoad(button, buttonText);
            }, 2000);
        }
    }
}