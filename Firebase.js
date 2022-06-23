/** @format */

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import * as firebase from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCCWvVHPKsd7B8nQn9ANwvN-m_gUgAcax0",
  authDomain: "fanounee-f2959.firebaseapp.com",
  projectId: "fanounee-f2959",
  storageBucket: "fanounee-f2959.appspot.com",
  messagingSenderId: "250954469139",
  appId: "1:250954469139:web:536073af39fa4cb97414e6",
  measurementId: "G-6T92CVW7MH",
};

if (firebase.getApps().length < 1) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
