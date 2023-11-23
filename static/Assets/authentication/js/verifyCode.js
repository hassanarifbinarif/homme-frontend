async function resendVerificationCode(event) {
    let data = {};
    data.email = sessionStorage.getItem('em');
    if (!data.email) {
        document.querySelector('.code-msg').innerText = 'Cannot send otp code. Retry forget password.'
        document.querySelector('.code-msg').classList.add('active');
    }
    else {
        try {
            document.querySelector('.code-msg').innerText = '';
            document.querySelector('.code-msg').classList.remove('active');
            data.otp_type = 'forgot';
            let headers = {
                "Content-Type": "application/json"
            };
            let button = event.target.closest('button');
            let buttonText = button.innerText;
            beforeLoad(button);
            let response = await requestAPI(`${apiURL}/auth/otp/send`, JSON.stringify(data), headers, 'POST');
            // console.log(response);
            response.json().then(function(res) {
                // console.log(res);
                if (response.status == 200) {
                    afterLoad(button, 'Code Resent');
                    setTimeout(() => {
                        afterLoad(button, buttonText);
                    }, 1000)
                }
                else {
                    afterLoad(button, buttonText);
                    document.querySelector('.code-msg').innerText = 'Error while trying to send code.'
                    document.querySelector('.code-msg').classList.add('active');
                }
            })
        }
        catch (err) {
            console.log(err);
            afterLoad(button, buttonText);
            document.querySelector('.code-msg').innerText = 'Error while trying to send code.'
            document.querySelector('.code-msg').classList.add('active');
        }
    }
}


async function verifyCodeForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let codeField = form.querySelector('input[name="otp_code"]');
    let codeMsg = form.querySelector(".code-msg");
    let button = form.querySelector('button[type="submit"]');
    let buttonText = button.innerText;
    
    try {
        codeField.classList.remove("input-error");
        codeMsg.classList.remove("active");
        codeMsg.innerText = '';
        beforeLoad(button);
        let formData = new FormData(form);
        let data = formDataToObject(formData);
        data.email = sessionStorage.getItem('em');
        data.otp_type = 'forgot';
        let headers = {
            "Content-Type": "application/json",
        };
        let response = await requestAPI(`${apiURL}/auth/otp/verify`, JSON.stringify(data), headers, "PATCH");
        // console.log(response);
        response.json().then(async function (res) {
            // console.log(res);
            if (response.status == 400) {
                if(res.messages.otp_code) {
                    codeField.classList.add("input-error");
                    codeMsg.classList.add("active");
                    codeMsg.innerText = `${res.messages.otp_code}`;
                    // res.messages.otp_code.forEach((message) => {
                    //     codeMsg.innerHTML += `${message}. <br />`;
                    // });
                }
                afterLoad(button, buttonText);
            } else if (response.status == 200) {
                codeMsg.innerText = "";
                codeMsg.classList.remove("active");
                sessionStorage.setItem('to', `${res.data.verification_token}`);
                afterLoad(button, 'VERIFIED');
                location.href = location.origin + "/reset-password/";
            } else {
                codeMsg.innerText = "An error occured. Please try again";
                codeMsg.classList.add("active");
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