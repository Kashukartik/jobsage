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


// Retrieve user session data
function getUserSession() {
    const userSession = sessionStorage.getItem('user');
    return userSession ? JSON.parse(userSession) : null;
}

window.submitFormData = async function (event) {
    event.preventDefault(); // Prevent form from reloading the page

    // Get the user session
    const sessionData = getUserSession();
    if (!sessionData) {
        alert("User not logged in. Please log in to submit your application.");
        return;
    }

    // Get form data
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const position = document.getElementById("position").value.trim();
    const role = document.querySelector("#role").value;
    const highestDegree = document.getElementById("highestDegree").value.trim();
    const institution = document.getElementById("institution").value.trim();
    const graduationYear = document.getElementById("graduationYear").value;
    const yearsExperience = document.getElementById("yearsExperience").value;
    const lastJobTitle = document.getElementById("lastJobTitle").value.trim();
    const lastEmployer = document.getElementById("lastEmployer").value.trim();
    const skills = document.getElementById("skills").value.trim();
    const linkedin = document.getElementById("linkedin").value.trim();
    const portfolio = document.getElementById("portfolio").value.trim();

    // Check if required fields are filled in
    if (!name || !role) {
        alert("Please fill in your name and select a role.");
        return;
    }

    try {
        // Prepare user data
        const userData = {
            sessionEmail: sessionData.email, // Add session user email to track who submitted
            role: role,
            name: name,
            email: email,
            phone: phone,
            position: position,
            highestDegree: highestDegree,
            institution: institution,
            graduationYear: graduationYear,
            yearsExperience: yearsExperience,
            lastJobTitle: lastJobTitle,
            lastEmployer: lastEmployer,
            skills: skills,
            linkedin: linkedin,
            portfolio: portfolio,
            submittedBy: sessionData.name // Example of adding session user’s name
        };

        // Determine collection based on role
        const collectionName = role === 'candidate' ? 'JobSeeker' : role === 'recruiter' ? 'Recruiter' : null;
        if (collectionName === null) {
            alert("Invalid role selected.");
            return;
        }

        // Set document in Firestore with `name` as document ID
        await setDoc(doc(db, collectionName, name), userData);

        console.log(`Document successfully written in ${collectionName} collection with ID: ${name}`);
        alert("Application submitted successfully!");

        if (role === 'candidate') {
            window.location.href = 'U_dashboard.html';
        } else if(role === 'recruiter') {
            window.location.href = 'R_dashboard.html';
        }

    } catch (error) {
        console.error("Error adding document: ", error);
        alert("Failed to submit the application. Please try again.");
    }
};

