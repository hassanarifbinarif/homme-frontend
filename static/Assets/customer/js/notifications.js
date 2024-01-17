firebase.initializeApp(firebaseConfig);
firebase.analytics();

const messaging = firebase.messaging();

messaging.onMessage(function(payload) {
    console.log(payload);
    let badgeCount = JSON.parse(payload.data.data);
    updateCount(false, badgeCount.badge);
    // const notificationTitle = payload.notification.title;
    // const notificationOptions = {
    //     body: payload.notification.body
    // };
    if (!("Notification" in window)) {
        console.log("This browser does not support system notifications");
    }else if(Notification.permission === "denied"){
        Notification.requestPermission().then((permission) => {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                // var notification = new Notification(notificationTitle,notificationOptions);
                // notification.onclick = function(event) {
                    // event.preventDefault(); // preven
                    // notification.close();
                // }
            }
        });
    }
    else if (Notification.permission === "granted") {
        // var notification = new Notification(notificationTitle,notificationOptions);
        // notification.onclick = function(event) {
        //     event.preventDefault(); // prevent the browser from focusing the Notification's tab
        //     notification.close();
        // }
    }
});


if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register("/firebase-messaging-sw.js",{scope: '/'}).then(function(response) {
        // Service worker registration done
        console.log('Registration Successful', response);
        messaging.useServiceWorker(response)
        checkForFCMToken();

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

        // response.addEventListener('updatefound', () => {
        //     // A wild service worker has appeared in reg.installing!
        //     const newWorker = response.installing;
        //     response.update();
        
        //     newWorker.state;
        //     // "installing" - the install event has fired, but not yet complete
        //     // "installed"  - install complete
        //     // "activating" - the activate event has fired, but not yet complete
        //     // "activated"  - fully active
        //     // "redundant"  - discarded. Either failed install, or it's been
        //     //                replaced by a newer version
        
        //     newWorker.addEventListener('statechange', () => {
        //         console.log('new worker enabled', newWorker);
        //       // newWorker.state has changed
        //     });
        // });

    }, function(error) {
        // Service worker registration failed
        console.log('Registration Failed', error);
    })
}


async function checkForFCMToken() {
    let fcm_token = getStorage('fcm_token');
    if (fcm_token == null) {
        messaging.getToken({ vapidKey: vapidKey }).then((currentToken) => {
            if (currentToken) {
                console.log(currentToken);
                setStorage('fcm_token', currentToken);
                registerFCMToken(currentToken);
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
    }
}


async function registerFCMToken(fcmToken) {
    let token = getCookie('admin_access');
    let headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    };
    let data = { "registration_id": fcmToken, "type": "web" };
    try {
        let response = await requestAPI(`${apiURL}/users/devices`, JSON.stringify(data), headers, 'POST');
    }
    catch (err) {
        console.log(err);
    }
}


async function deleteDevice() {
    let fcm_token = getStorage('fcm_token');
    if (fcm_token != null) {
        let token = getCookie('admin_access');
        let headers = { "Authorization": `Bearer ${token}` };
        try {
            let response = await requestAPI(`${apiURL}/users/devices/${fcm_token}`, null, headers, 'DELETE');
        }
        catch (err) {
            console.log(err);
        }
    }
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
    getCountAndDisplay();
};

// Handle errors
request.onerror = function(event) {
    console.error("Database error: " + event.target.errorCode);
};


function initializeCount() {
    const transaction = db.transaction([storeName], "readwrite");
    const objectStore = transaction.objectStore(storeName);

    const initialData = {
        count: 0,
    };

    const addRequest = objectStore.add(initialData);

    addRequest.onsuccess = function() {
        console.log("Count initialized successfully");
    };

    addRequest.onerror = function() {
        console.error("Error initializing count");
    };
}


function getCountAndDisplay() {
    const transaction = db.transaction([storeName], "readonly");
    const objectStore = transaction.objectStore(storeName);

    const getRequest = objectStore.get(1);

    getRequest.onsuccess = function(event) {
        const result = event.target.result;
        if (result) {
            if (result.count > 0) {
                document.getElementById('header-notification-quantity-wrapper').classList.remove('hide');
                document.getElementById('header-notification-quantity').innerText = result.count;
            }
            console.log("Current count:", result.count);
        } else {
            console.error("Count not found");
        }
    };

    getRequest.onerror = function() {
        console.error("Error getting count");
    };
}

function updateCount(clearCount=false, badgeCount=0) {
    const transaction = db.transaction([storeName], "readwrite");
    const objectStore = transaction.objectStore(storeName);

    // const getRequest = objectStore.get(1);

    if (clearCount) {
        const updateRequest = objectStore.put({ id: 1, count: 0 });
        updateRequest.onsuccess = function() {
            document.getElementById('header-notification-quantity-wrapper').classList.add('hide');
            document.getElementById('header-notification-quantity').innerText = 0;
            console.log("Count updated successfully");
        };
    }
    else {
        const updateRequest = objectStore.put({ id: 1, count: badgeCount });

        updateRequest.onsuccess = function() {
            document.getElementById('header-notification-quantity-wrapper').classList.remove('hide');
            document.getElementById('header-notification-quantity').innerText = badgeCount;
            console.log("Count updated successfully");
        };
    }

    // const updateRequest = objectStore.put({ id: 1, count: newCount });

    // updateRequest.onsuccess = function() {
    //     console.log("Count updated successfully");
    // };

    // updateRequest.onerror = function() {
    //     console.error("Error updating count");
    // };
}

document.addEventListener("visibilitychange", function(event) {
    if (document.visibilityState == 'visible') {
        getCountAndDisplay();
    }
    else if (document.visibilityState == 'hidden') {
        notificationDataWrapper.classList.add('hide');
    }
});