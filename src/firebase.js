// firebase.js

import { initializeApp } from "firebase/app";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCOuHPX0CuQT3f1hN5_dngWrVylz9i6BUc",
  authDomain: "fir-test-5cd20.firebaseapp.com",
  projectId: "fir-test-5cd20",
  storageBucket: "fir-test-5cd20.appspot.com",
  messagingSenderId: "448927451546",
  appId: "1:448927451546:web:0428cbe322dd4ed3599223"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;