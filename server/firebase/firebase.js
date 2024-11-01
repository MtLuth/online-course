const { getAnalytics } = require("firebase/analytics");
const { initializeApp } = require("firebase/app");
const { getDatabase } = require("firebase/database");

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "online-course-b98be.firebaseapp.com",
  projectId: "online-course-b98be",
  storageBucket: "online-course-b98be.appspot.com",
  messagingSenderId: "948562909891",
  appId: "1:948562909891:web:f092d8690b829afdd12076",
  measurementId: "G-BPTSV4QF32",
};

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
