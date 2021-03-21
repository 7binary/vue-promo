// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/7.21.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.21.1/firebase-messaging.js');

const config = {
  apiKey: '',
  authDomain: 'vue-promo.firebaseapp.com',
  databaseURL: 'https://vue-promo.firebaseio.com',
  projectId: 'vue-promo',
  storageBucket: 'vue-promo.appspot.com',
  messagingSenderId: '71066749120',
  appId: '1:71066749120:web:03ee796adc7b752bdf0525',
  measurementId: 'G-JDMPRZETHX',
};
firebase.initializeApp(config);

const messaging = firebase.messaging();
