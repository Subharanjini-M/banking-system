import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { 
  getFirestore,  getDoc, getDocs,doc, 
  setDoc, updateDoc,collection,query,
  where, addDoc,Timestamp
}from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBgpSvom8ueimZlSO7mvqsMqcwUXBOxHU0",
  authDomain: "project-2-db936.firebaseapp.com",
  projectId: "project-2-db936",
  storageBucket: "project-2-db936.firebasestorage.app",
  messagingSenderId: "81374427945",
  appId: "1:81374427945:web:7c5983898a8efc44e65538"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export {getDoc,getDocs,addDoc, query, doc,Timestamp, where,setDoc,updateDoc,collection} ;
