importScripts('https://www.gstatic.com/firebasejs/8.9.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.9.1/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyB4pcvdeVJmtSVTSjxyDg1nX5_MCbyBCSg",
  authDomain: "oshop-d014d.firebaseapp.com",
  databaseURL: "https://oshop-d014d-default-rtdb.firebaseio.com",
  projectId: "oshop-d014d",
  storageBucket: "oshop-d014d.appspot.com",
  messagingSenderId: "518036013869",
  appId: "1:518036013869:web:2deb19fcbf297f4826c9a4",
  measurementId: "G-8NKHFC5WMX"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});