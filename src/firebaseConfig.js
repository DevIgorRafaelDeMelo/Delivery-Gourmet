import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD18JVpF5hkbUQFl-GdYTjgRl_-yETls7A",
  authDomain: "dba-beer.firebaseapp.com",
  projectId: "dba-beer",
  storageBucket: "dba-beer.firebasestorage.app",
  messagingSenderId: "12044494944",
  appId: "1:12044494944:web:57177a46c272fadc3cfb05",
  measurementId: "G-S40ZC8YN3R",
};

const app = initializeApp(firebaseConfig);
const DB = getFirestore(app);
const storage = getStorage(app);

export { DB, storage };
