// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  // apiKey: "AIzaSyASiOafNJ2ZkMn6Vk9ENoYA-_Rkt9wbLx8",
  // authDomain: "littlechat-f3d9a.firebaseapp.com",
  // databaseURL: "https://littlechat-f3d9a-default-rtdb.firebaseio.com",
  // projectId: "littlechat-f3d9a",
  // storageBucket: "littlechat-f3d9a.appspot.com",
  // messagingSenderId: "1098787410194",
  // appId: "1:1098787410194:web:3c7c9d9c59b84bc1fda3cb",
  // measurementId: "G-XZM6V7Q2MB"

  apiKey: "AIzaSyDaVQyvX5_OMToc6xyqggprMdUBVttTzCU",
  authDomain: "lama-chat-40ea7.firebaseapp.com",
  projectId: "lama-chat-40ea7",
  storageBucket: "lama-chat-40ea7.appspot.com",
  messagingSenderId: "66820694408",
  appId: "1:66820694408:web:bb5822ff7eb3258060da3d",
  measurementId: "G-EGR39531K7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const storage = getStorage();
export const db = getFirestore(app);
export const auth = getAuth(app);
