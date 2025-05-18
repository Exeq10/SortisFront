
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging ,getToken,onMessage} from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "sortis-web-notifications.firebaseapp.com",
  projectId: "sortis-web-notifications",
  storageBucket: "sortis-web-notifications.firebasestorage.app",
  messagingSenderId: "73419944736",
  appId: "1:73419944736:web:6dcb67879dd9807dd25d45",
  measurementId: "G-Y6H8YZTQJK"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const messaging = getMessaging(app);



export {messaging, getToken, onMessage};  