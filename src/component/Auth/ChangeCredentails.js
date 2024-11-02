import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc, setDoc, doc, getDocs, getDoc, updateDoc, deleteDoc, query, orderBy, where, onSnapshot } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyB_w8OzEj_oPhr8v_SY9Dj00B-fKdtPr8o",
    authDomain: "simple-92a80.firebaseapp.com",
    databaseURL: "https://simple-92a80-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "simple-92a80",
    storageBucket: "simple-92a80.appspot.com",
    messagingSenderId: "93667770846",
    appId: "1:93667770846:web:bdca6b2512665d87cf9d4f",
    measurementId: "G-KY8B95HGN6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


function getUserSession() {
    const userSession = sessionStorage.getItem('user');
    return userSession ? JSON.parse(userSession) : null;
}

window.addEventListener("load", async function () {
    const sessionData = getUserSession();
    if (!sessionData) {
        alert("User not logged in. Please log in to access this page.");
        return;
    }

    loadProfileForEditing();
});

function loadProfileForEditing() {
    const sessionData = getUserSession(); // Retrieve the user session data
    const userId = sessionData.userId; // Get the user ID from session data
    console.log(userId); // Log the user ID for debugging purposes
    
    // Reference to the specific document in the JobSeeker collection
    const userRef = doc(db, "users", userId);
    
    // Fetch the document from Firestore
    getDoc(userRef).then((doc) => { // Use getDoc() for fetching the document
        if (doc.exists()) { // Check if the document exists
            const data = doc.data(); // Get the document data
            // Populate the form fields with the existing user data
            document.getElementById('edit-name').value = data.name || '';
            document.getElementById('edit-email').value = data.email || '';
            document.getElementById('edit-password').value = data.password || '';
        } else {
            console.log('No such document!'); // Log if the document doesn't exist
        }
    }).catch((error) => {
        console.log('Error getting document:', error); // Handle any errors that occur
    });
}


window.saveProfileChanges = function () {
    const sessionData = getUserSession();
    const userId = sessionData.userId;

    // Get the updated data from the input fields
    const updatedData = {
        name: document.getElementById('edit-name').value,
        email: document.getElementById('edit-email').value,
        password: document.getElementById('edit-password').value, // Assuming you want to update this in the db
    };

    // Confirm if the user wants to change the password
    const confirmChange = confirm("Do you want to change your password?");
    const userRef = doc(db, "users", userId); // Correctly reference the user document

    if (confirmChange) {
        // Only update the password if the user confirmed
        updateDoc(userRef, updatedData)
            .then(() => {
                alert('Profile updated successfully!');
                // Optionally redirect to the profile page
                window.location.href = 'U_dashboard.html';
            })
            .catch((error) => {
                console.error('Error updating document: ', error);
            });
    } else {
        // If they do not want to change the password, do not include it in the update
        const { password, ...dataWithoutPassword } = updatedData;
        updateDoc(userRef, dataWithoutPassword) // Use updateDoc instead of userRef.update
            .then(() => {
                alert('Profile updated successfully without changing the password!');
                window.location.href = 'U_dashboard.html';
            })
            .catch((error) => {
                console.error('Error updating document: ', error);
            });
    }
};
