// Generic method to send request to APIs

async function requestAPI(url, data, headers, method) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: method,
        mode: 'cors',
        // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: headers,
        body: data,
    });
    return response; // parses JSON response into native JavaScript objects
}


function formDataToObject(formData) {
    let getData = {}
    formData.forEach(function(value, key) {
        getData[key] = value;
    });
    return getData
}


function clearFormData(formData){
    for(var a of formData.entries()){
        formData.delete(a[0])
    }
}


function beforeLoad(button) {
    button.querySelector('.btn-text').innerText = '';
    button.querySelector('.spinner-border').classList.remove('hide');
    button.disabled = true;
    button.style.cursor ='not-allowed';
}

function afterLoad(button, text) {
    button.querySelector('.btn-text').innerText = text;
    button.querySelector('span').classList.add('hide');
    button.disabled = false;
    button.style.cursor ='pointer';
}


function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
};


function setCookie(name, value, expiry) {
    if(name === 'access'){
        name = 'user_access_token'
    }else if(name === 'refresh'){
        name = 'user_refresh_token'
    }else{
        name=name
    }
    var date = new Date(expiry * 1000);
    expires = "; expires=" + date.toUTCString();
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}


function getCookie(name) {
    if(name === 'access'){
        name = 'user_access_token'
    }else if(name === 'refresh'){
        name = 'user_refresh_token'
    }else{
        name=name
    }
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}


function getAccessTokenFromCookie() {
    return getCookie('access');
}


function getRefreshTokenFromCookie() {
    return getCookie('refresh');
}


function getCookieExpirationTime(name) {
    if(name === 'access'){
        name = 'user_access_token'
    }else if(name === 'refresh'){
        name = 'user_refresh_token'
    }else{
        name=name
    }
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    return ca
}

const apiURL = window.API_BASE_URL;

async function onRefreshToken() {
    let refreshToken = getRefreshTokenFromCookie();
    let myData = {"refresh": `${refreshToken}`};
    let headers = {
        "Content-Type": "application/json",
    };
    let refreshResponse = await requestAPI(`${apiURL}/refresh`, JSON.stringify(myData), headers, 'POST');
    if(refreshResponse.status == 200) {
        refreshResponse.json().then(function(res) {
            const accessToken = parseJwt(res.access);
            setCookie("access", res.access, accessToken.exp);
        })
    }
    return refreshResponse;
}


async function onAdminRefreshToken() {
    let refreshToken = getCookie('admin_refresh');
    let myData = {"refresh": `${refreshToken}`};
    let headers = {
        "Content-Type": "application/json",
    };
    let refreshResponse = await requestAPI(`${apiURL}/refresh`, JSON.stringify(myData), headers, 'POST');
    if(refreshResponse.status == 200) {
        refreshResponse.json().then(function(res) {
            const accessToken = parseJwt(res.access);
            setCookie("admin_access", res.access, accessToken.exp);
        })
    }
    return refreshResponse; 
}


function clearTokens(){
    setCookie('access', '', 0);
    setCookie('refresh', '', 0);
}


function clearAdminTokens() {
    setCookie('admin_access', '', 0);
    setCookie('admin_refresh', '', 0);
}


function logout() {
    clearTokens();
    location.pathname = '/accounts/';
}


function adminLogout() {
    clearAdminTokens();
    location.pathname = '/signin/';
}


function getSearchURL(searchURL, baseURL) {
    try {
        let sourceParams = new URLSearchParams(searchURL.split('?')[1]);
        let destination = new URL(baseURL);
        if(sourceParams.get('page') == undefined) {
            sourceParams.append('page', '1');
        }
        sourceParams.forEach((value, key) => {
            if(destination.searchParams.has(key)) {
                destination.searchParams.set(key, value);
            }
            else {
                destination.searchParams.append(key, value);
            }
        })
        return destination.toString();
    }
    catch (err) {
        return null;
    }
}


function setParams(params, key, value) {
    let paramsList = params.split('&');
    // Create an object to store the parameters and their values
    let paramsObject = {};
    paramsList.forEach(param => {    
        let [key, value] = param.split('=');
        paramsObject[key] = value;
    });

    // Update the value for the key parameter
    paramsObject[key] = value;

    // Reconstruct the updated query string
    let updatedParams = Object.entries(paramsObject).map(([key, value]) => `${key}=${value}`).join('&');
    return updatedParams;
}


const emailRegex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i
const phoneRegex = /^(\+593|593|09)([2-9]\d{7})$/;
const locationRegex = /POINT \((-?\d+\.\d+) (-?\d+\.\d+)\)/;

let timeOut;

function isValidEmail(email) {
    let emailMsg = email.closest('form').querySelector('.email-msg');
    if(email.value.trim() == '') {
        emailMsg.innerText = 'Email is required!';
        return false;
    }
    else if(!emailRegex.test(email.value)) {
        emailMsg.innerText = 'Enter a valid email address!';
        return false;
    }
    else {
        email.classList.remove('input-error');
        emailMsg.innerText = '';
        emailMsg.classList.remove('active');
        if(timeOut) {
            clearTimeout(timeOut);
        }
        return true;
    }
}

function isValidPassword(password) {
    let passwordMsg = password.closest('.password-input').querySelector('.password-msg');
    if(password.value == '') {
        passwordMsg.innerText = 'Password is required!';
        return false;
    }
    else if(password.value.length < 8) {
        passwordMsg.innerText = 'Password must be atleast 8 characters!';
        return false;
    }
    else {
        password.classList.remove('input-error');
        passwordMsg.innerText = '';
        passwordMsg.classList.remove('active');
        if(timeOut) {
            clearTimeout(timeOut);
        }
        return true;
    }
}


function isValidName(name) {
    let nameMsg = name.nextElementSibling;
    if(name.value.trim().length == 0) {
        nameMsg.innerText = "Required Field!";
        return false;
    }
    else {
        name.classList.remove('input-error');
        nameMsg.innerText = '';
        nameMsg.classList.remove('active');
        if(timeOut) {
            clearTimeout(timeOut);
        }
        return true;
    }
}


function matchingPassword(password, confirmPassword) {
    let confirmPasswordMsg = confirmPassword.closest('.password-input').querySelector('.password-msg');
    if(password.value != confirmPassword.value) {
        confirmPasswordMsg.innerText = 'Passwords does not match';
        return false;
    }
    else {
        confirmPasswordMsg.innerText = '';
        confirmPasswordMsg.classList.remove('active');
        confirmPassword.classList.remove('input-error');
        if(timeOut) {
            clearTimeout(timeOut);
        }
        return true;
    }
}


function isValidNumber(number) {
    let numberMsg = number.nextElementSibling;
    if(number.value.trim().length == 0) {
        numberMsg.innerText = 'Required Field';
        return false;
    }
    else if(!(!isNaN(number.value) && /^\d+(\.\d+)?$/.test(number.value))) {
        numberMsg.innerText = 'Number must contain only digits';
    }
    // else if(!phoneRegex.test(number.value)) {
    //     numberMsg.innerText = 'Number is invalid!';
    //     return false;
    // }
    else {
        number.classList.remove('input-error');
        numberMsg.innerText = '';
        numberMsg.classList.remove('active');
        if(timeOut) {
            clearTimeout(timeOut);
        }
        return true;
    }
}


function isValidPhoneNumber(number) {
    let numberMsg = number.closest('.mobile-input').querySelector('.mobile-msg');
    if(number.value.trim().length == 0) {
        numberMsg.innerText = 'Required Field';
        return false;
    }
    else if(!(/^\d+(\.\d+)?$/.test(number.value.split('+')[1]))) {
        numberMsg.innerText = 'Number is invalid';
        return false;
    }
    else {
        number.classList.remove('input-error');
        numberMsg.innerText = '';
        numberMsg.classList.remove('active');
        if(timeOut) {
            clearTimeout(timeOut);
        }
        return true;
    }
}


function isValidImage(image) {
    let pictureMsg = image.closest('.image-input-container').querySelector('.picture-msg');
    if(image.files.length == 0) {
        pictureMsg.innerText = 'Image required!';
        return false;
    }
    else {
        image.classList.remove('input-error');
        pictureMsg.innerText = '';
        pictureMsg.classList.remove('active');
        return true;
    }
}


function isCheckboxChecked(checkbox) {
    if(checkbox.checked) {
        checkbox.classList.remove('input-error');
        return true;
    }
    else {
        checkbox.classList.add('input-error');
        return false;
    }
}


function getLatLngFromString(locationString) {
    const match = locationString.match(locationRegex);
    if (match && match.length === 3) {
        const latitude = parseFloat(match[1]);
        const longitude = parseFloat(match[2]);
        return {lat: latitude, lng: longitude};
    } else {
        console.log("Could not extract latitude and longitude.");
    }
}


function roundDecimalPlaces(number) {
    let value = parseFloat(number);
    let roundedValue = Math.round(value * 100) / 100;
    return roundedValue.toFixed(2);
}


function captalizeFirstLetter(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}


let sideSwitchBtn = document.getElementById('side-switch-btn');
let sideSwitchDropdown = document.getElementById('side-switch-dropdown');


function toggleSideSwitchDropdown() {
    if (sideSwitchDropdown.classList.contains('hide')) {
        sideSwitchDropdown.classList.remove('hide');
    }
    else {
        sideSwitchDropdown.classList.add('hide');
    }
}


function switchSide(event) {
    // event.preventDefault();
    let element = event.target;
    let currentSide = document.getElementById('current-panel-side');
    if (currentSide.innerText != element.innerText) {
        if (element.innerText == 'CUSTOMER APP') {
            location.pathname = '/';
        }
        else {
            location.pathname = '/consumer/';
        }
    }
}


let notificationIcon = document.getElementById('notification-icon');
let notificationDataWrapper = document.getElementById('notification-data-wrapper');
let notificationCloseBtn = document.getElementById('notification-close-btn');

notificationIcon.addEventListener('click', toggleNotifications);
notificationCloseBtn.addEventListener('click', toggleNotifications);

function toggleNotifications() {
    if (notificationDataWrapper.classList.contains('hide')) {
        notificationDataWrapper.classList.remove('hide');
    }
    else {
        notificationDataWrapper.classList.add('hide');
    }
}


function closeSideSwitchDropdown(event) {
    if((!sideSwitchBtn.contains(event.target)) && (!sideSwitchDropdown.classList.contains('hide'))) {
        sideSwitchDropdown.classList.add('hide');
    }
    else if((!notificationDataWrapper.contains(event.target)) && (!notificationIcon.contains(event.target)) && (!notificationDataWrapper.classList.contains('hide'))) {
        notificationDataWrapper.classList.add('hide');
    }
}

document.body.addEventListener('click', closeSideSwitchDropdown);


function searchCustomerForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let searchField = form.querySelector('input[name="search"]');

    if (searchField.value.trim().length == 0) {
        // console.log('here');
        const urlObj = new URL(location.href);
        urlObj.searchParams.delete('search');
        location.href = urlObj.toString();
    }
    else {
        let url = location.origin + '/customers/' + location.search;
        const urlObj = new URL(url);
        urlObj.searchParams.set('search', searchField.value);
        location.href = urlObj.toString();
        // location.pathname = `/customers/?search=${searchField.value}`;
    }
}


async function getNotifications() {
    let token = getCookie('admin_access');
    let headers = {
        "Authorization": `Bearer ${token}`
    };
    let response = await requestAPI(`${apiURL}/admin/notifications?page=1&perPage=1000&ordering=-created_at`, null, headers, 'GET');
    response.json().then(function(res) {
        if (response.status == 200) {
            let notificationData = document.getElementById('notification-data');
            res.data.forEach((notification) => {
                const dateTime = new Date(notification.created_at);
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                const formattedDate = dateTime.toLocaleDateString(undefined, options);
                notificationData.innerHTML += `<div class="notification-card" ${notification.source == 'order' ? `onclick = "location.pathname = '/specific-order/${notification.ref_id}/'"` : ''}>
                                                    <div>
                                                        <div>
                                                            <span>${notification.title}</span>
                                                            <span>${formattedDate}</span>
                                                        </div>
                                                        <span>${notification.message}</span>
                                                    </div>
                                                </div>`;
            })
        }
    })
}