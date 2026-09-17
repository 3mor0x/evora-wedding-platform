import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCOvoDfKlxTXDbFdXLjJJZf6SEKeovr9TQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "wedding-invitations-plat-380fa.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://wedding-invitations-plat-380fa-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "wedding-invitations-plat-380fa",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "wedding-invitations-plat-380fa.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "658891002507",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:658891002507:web:902612aee780f74b783a8e"
};

// تهيئة تطبيق Firebase
const app = initializeApp(firebaseConfig);

// تصدير اتصال Realtime Database
export const rtdb = getDatabase(app);
export default app;