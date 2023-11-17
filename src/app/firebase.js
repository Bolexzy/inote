// Import the functions you need from the SDKs you need
// import { Collections } from "@mui/icons-material";
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDdrcik8mF0XjyQs79OaFYD2gWI2Qu9PoA",
  authDomain: "inote-f7b45.firebaseapp.com",
  projectId: "inote-f7b45",
  storageBucket: "inote-f7b45.appspot.com",
  messagingSenderId: "354445173071",
  appId: "1:354445173071:web:333526508b6fafd0e1653a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const notesCollection = collection(db, "notes");
