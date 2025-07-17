import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
const firebaseConfig = {
  apiKey: "AIzaSyDBzcADrg2-w93PISf9UCSez2K57NOD2gY",
  authDomain: "studycraftai.firebaseapp.com",
  projectId: "studycraftai",
  storageBucket: "studycraftai.firebasestorage.app",
  messagingSenderId: "144897763457",
  appId: "1:144897763457:web:f6278879eea70fd3528580",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
