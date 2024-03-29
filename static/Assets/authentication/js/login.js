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



firebase.initializeApp(firebaseConfig);
firebase.analytics();

const messaging = firebase.messaging();


// // Getting FCM Token

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register("/firebase-messaging-sw.js",{scope: '/'}).then(function(response) {
        // Service worker registration done
        console.log('Registration Successful', response);

        response.onupdatefound = () => {
            const installingWorker = response.installing;
            installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed' &&
                    navigator.serviceWorker.controller) {
                    // TODO: Preferably, display a message asking the user to reload...
                    location.reload();
                }
            };
        };

        messaging.useServiceWorker(response);
        messaging.getToken({ vapidKey: vapidKey }).then((currentToken) => {
            if (currentToken) {
                console.log(currentToken);
            } else {
                console.log('No registration token available. Request permission to generate one.');
            }
        }).catch((err) => {
            console.log('An error occurred while retrieving token. ', err);
        });
        
        messaging.requestPermission().then(function () {
            console.log("Notification permission granted.");
            return messaging.getToken()
        }).catch(function (err) {
            console.log("Unable to get permission to notify.", err);
        });

        response.onupdatefound = () => {
            const installingWorker = response.installing;
            installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed' &&
                    navigator.serviceWorker.controller) {
                    // Preferably, display a message asking the user to reload...
                    location.reload();
                }
            };
        };
    }, function(error) {
      // Service worker registration failed
      console.log('Registration Failed', error);
    })
}


if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      console.log(`A service worker is active: ${registration.active}`);
      
      // At this point, you can call methods that require an active
      // service worker, like registration.pushManager.subscribe()
    });
} else {
    console.error("Service workers are not supported.");
}


const request = indexedDB.open(dbName, dbVersion);

// Handle database creation or upgrade
request.onupgradeneeded = function(event) {
    db = event.target.result;
    // Create an object store with an auto-incrementing keyPath
    const objectStore = db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });

    // Add a count field to the object store
    objectStore.createIndex("count", "count", { unique: true });

    objectStore.add({count:0});
    console.log('in upgrade needed');
};

// Handle successful database open
request.onsuccess = function(event) {
    db = event.target.result;
    console.log('in success');
};

// Handle errors
request.onerror = function(event) {
    console.error("Database error: " + event.target.errorCode);
};