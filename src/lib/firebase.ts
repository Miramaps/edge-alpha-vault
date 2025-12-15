// Firebase client SDK setup for client-side usage (if needed)
import { getAnalytics } from "firebase/analytics";
import { getApps, initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyA9TzLlUSRy0XltRphe3kacg7St8Y6W_NA",
    authDomain: "edge-c45aa.firebaseapp.com",
    databaseURL: "https://edge-c45aa-default-rtdb.firebaseio.com",
    projectId: "edge-c45aa",
    storageBucket: "edge-c45aa.appspot.com",
    messagingSenderId: "539116007262",
    appId: "1:539116007262:web:69ecbb0c4972e590a869cf",
    measurementId: "G-S12822EK5M"
};

let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    if (typeof window !== 'undefined') {
        getAnalytics(app);
    }
} else {
    app = getApps()[0];
}

export { app };
