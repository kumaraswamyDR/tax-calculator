import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, updateDoc, onSnapshot } from "firebase/firestore";
import TaxCalculator from "./TaxCalculator";

const firebaseConfig = {
  apiKey: "AIzaSyD4cxAdVXyr-TwF7RrGJksSAkvRUUIK3p8",
  authDomain: "taxcalculator-a43a5.firebaseapp.com",
  projectId: "taxcalculator-a43a5",
  storageBucket: "taxcalculator-a43a5.firebasestorage.app",
  messagingSenderId: "869739835253",
  appId: "1:869739835253:web:af8929b88222f1c40f2d3c",
  measurementId: "G-N3R3589X2B",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function App() {
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    const countRef = doc(db, "visitors", "count");

    // Real-time listener for visitor count
    const unsubscribe = onSnapshot(countRef, (docSnap) => {
      if (docSnap.exists()) {
        setVisitorCount(docSnap.data().count);
      }
    });

    // Increment count when user visits
    const incrementVisitorCount = async () => {
      try {
        const countSnap = await getDoc(countRef);
        if (countSnap.exists()) {
          const currentCount = countSnap.data().count || 0;
          await updateDoc(countRef, { count: currentCount + 1 });
        } else {
          await setDoc(countRef, { count: 1 });
        }
      } catch (error) {
        console.error("Error updating visitor count:", error);
      }
    };

    incrementVisitorCount();

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      {/* Styled Visitor Counter */}
      <div className="relative flex items-center bg-white shadow-md rounded-full px-6 py-3">
        <div className="relative flex items-center justify-center w-10 h-10">
          <div className="absolute w-10 h-10 bg-red-500 rounded-full opacity-30 animate-ping"></div>
          <div className="absolute w-6 h-6 bg-red-500 rounded-full opacity-50"></div>
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
        </div>
        <p className="text-lg font-semibold text-gray-700 ml-3">
          <span className="text-red-500 text-xl font-bold">{visitorCount > 0 ? visitorCount : ''}</span> users have explored our site!
        </p>
        <span className="ml-3 text-green-500 text-xl">✔</span>
      </div>

      {/* Tax Calculator Component */}
      <TaxCalculator />
    </div>
  );
}

export default App;
