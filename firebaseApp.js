import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAXyNIs8IdVUQ72h6TNs5r06UbgtNqWjd0",
  authDomain: "todo-105c9.firebaseapp.com",
  projectId: "todo-105c9",
  storageBucket: "todo-105c9.appspot.com",
  messagingSenderId: "682481802490",
  appId: "1:682481802490:web:aef9beff5fbcc06bf0bd43",
  measurementId: "G-Y2Y73SD0V3",
};

// Your web app's Firebase configuration
export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
