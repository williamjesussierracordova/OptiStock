// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// https://firebase.google.com/docs/web/setup#available-libraries
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBE7RLk3Pi3NKugpFvNtu5FkL3LoXc8c-E",
    authDomain: "optistock-1bfea.firebaseapp.com",
    databaseURL: "https://optistock-1bfea-default-rtdb.firebaseio.com",
    projectId: "optistock-1bfea",
    storageBucket: "optistock-1bfea.firebasestorage.app",
    messagingSenderId: "938829623303",
    appId: "1:938829623303:web:b0a8542f1d29fd2d59faa2"
};

let app;
let db;
let auth;
let storage;

export function initializeFirebase() {
  if (!app) {
    try{
      app = initializeApp(firebaseConfig);
      db = getDatabase(app);
      auth = getAuth(app);
      storage = getStorage(app);
    }
     catch (error) {
      console.error("Error initializing Firebase:", error);
    }
  }
  return { app, db, auth };
}

export function getFirebaseDb() {
  if (!db) {
    initializeFirebase();
  }
  return db;
}

export function getFirebaseAuth() {
  if (!auth) {
    initializeFirebase();
  }
  return auth;
}

export function GetFirebaseStorage() {
  if (!storage) {
    storage = getStorage(app);
  }
  return storage;
}