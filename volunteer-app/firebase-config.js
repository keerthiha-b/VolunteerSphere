import { initializeApp } from 'firebase/app';

// Importing the services you want to use
import { getFirestore } from "firebase/firestore";  
import { getAuth } from "firebase/auth";

// Firebase configuration from your Firebase project settings
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  databaseURL: "https://your-database-url.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

// Export the Firebase app if needed elsewhere in your project
export default app;
