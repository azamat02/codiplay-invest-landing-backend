// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore, doc, getDoc, collection, query, where, getDocs, setDoc, updateDoc} from "firebase/firestore";
import {generateUniqueCode} from "./index.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCcdlgWDXcX8oyIC0H9MU-MAI2wHc2XVng",
    authDomain: "fortune-wheel-e898f.firebaseapp.com",
    projectId: "fortune-wheel-e898f",
    storageBucket: "fortune-wheel-e898f.appspot.com",
    messagingSenderId: "802301957216",
    appId: "1:802301957216:web:058f3d35a25fc39a9adf05"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)

async function getDocument(collectionPath, docId) {
    const docRef = doc(db, collectionPath, docId);
    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            return docSnap.data();
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error getting document:", error);
    }
}

export async function getRecordByColumn(collectionName, columnName, columnValue) {
    const q = query(collection(db, collectionName), where(columnName, "==", columnValue));
    const querySnapshot = await getDocs(q);

    const records = [];
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        records.push({ id: doc.id, ...doc.data() });
    });

    return records; // This will be an array of all records matching the query
}

export async function createRecord(email, code) {
    const docRef = doc(db, 'codes', code); // Use the generated code as the document ID

    await setDoc(docRef, {
        email: email,
        code: code,
        used: false,
        date: new Date(),
        result: ''
    });

    return code; // Return the generated code
}

// Function to update the record if the code is not used
export async function updateRecordIfNotUsed(code, result) {
    // Reference to the 'codes' collection
    const codesRef = collection(db, 'codes');

    // Create a query to find the document with the matching 'code'
    const q = query(codesRef, where('code', '==', code));

    try {
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            // No matching document found
            return { success: false, message: 'Code not found' };
        }

        // Assuming 'code' values are unique, there should only be one document
        const docSnapshot = querySnapshot.docs[0];

        if (docSnapshot.data().used) {
            // Code is already used
            return { success: false, message: 'Code already used' };
        }

        // Document reference for the found document
        const docRef = doc(db, 'codes', docSnapshot.id);

        // Update the document to set 'used' to true and update 'result'
        await updateDoc(docRef, {
            used: true,
            result: result
        });

        return { success: true, message: 'Code updated successfully' };
    } catch (error) {
        console.error('Error updating record:', error);
        return { success: false, message: 'Error updating code' };
    }
}
