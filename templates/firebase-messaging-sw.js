self.addEventListener("notificationclick", (event) => {
    console.log("Click:", event.notification);
    event.notification.close();
    event.waitUntil(clients.matchAll({ type: "window" }).then((clientList) => {
        for (const client of clientList) {
            if (client.url.includes(self.location.origin) && "focus" in client) return client.focus();
        }
        if (clients.openWindow && Boolean(self.location.origin)) return clients.openWindow(self.location.origin);
    }).catch(err => {
        console.log("There was an error waitUntil:", err);
    }));
});


importScripts("https://www.gstatic.com/firebasejs/8.6.3/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.6.3/firebase-messaging.js");


let dbNames = "notifyDatabase";
let storeNameInSW = "notificationCount";
let dbInSW;

self.addEventListener("activate", event => {
    event.waitUntil(clients.claim());
});

self.addEventListener("install", event => {
    self.skipWaiting();
});

const dbrequest = indexedDB.open(dbNames, 1);

dbrequest.onsuccess = function(event) { 
    dbInSW = event.target.result; 
};

function updateCount(newCount) {
    const transaction = dbInSW.transaction([storeNameInSW], "readwrite");
    const objectStore = transaction.objectStore(storeNameInSW);
    const updateRequest = objectStore.put({ id: 1, count: newCount });
}

var firebaseConfig = {
    apiKey: "AIzaSyB82Y7WJcq5dXGXlrGeBxXd2w8-FF8iwnw",
    authDomain: "my-project-1532425885608.firebaseapp.com",
    databaseURL: "",
    projectId: "my-project-1532425885608",
    storageBucket: "my-project-1532425885608.appspot.com",
    messagingSenderId: "812117382239",
    appId: "1:812117382239:web:2e832dd7308e24a7f4b7ea",
    measurementId: "G-81E7VHXFBJ"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log("Received background message", payload);
    const notificationData = JSON.parse(payload.data.data);
    updateCount(notificationData.badge);
    const notificationOption = {
        body: payload.notification.body
    };
});
