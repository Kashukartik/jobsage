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

window.saveAsDraft = function () {
    saveJobData(new Event("submit"), true); // Trigger saveJobData with draft flag
}


// Function to retrieve user session data
function getUserSession() {
    const userSession = sessionStorage.getItem('user');
    return userSession ? JSON.parse(userSession) : null;
}


window.saveJobData = async function(event, isDraft = false) {
    event.preventDefault(); // Prevent form from reloading the page

    // Collect form data
    const jobTitle = document.getElementById("jobTitle").value;
    const jobDescription = document.getElementById("jobDescription").value;
    const department = document.getElementById("department").value;
    const jobLocation = document.getElementById("jobLocation").value;
    const employmentType = document.getElementById("employmentType").value;
    const salaryRange = document.getElementById("salaryRange").value;
    const applicationDeadline = document.getElementById("applicationDeadline").value;
    const requiredQualifications = document.getElementById("requiredQualifications").value;
    const preferredQualifications = document.getElementById("preferredQualifications").value;
    const responsibilities = document.getElementById("responsibilities").value;

    // Get recruiter information from the session
    const sessionData = getUserSession(); // Assuming you have a function to get user session
    const userId = sessionData.userId;
    const recruiterId = sessionData ? userId : null; // Use email or another unique identifier

    try {
        // Save document in Firestore with jobTitle as the document ID
        await setDoc(doc(db, "JobPostings", jobTitle), {
            jobTitle,
            jobDescription,
            department,
            jobLocation,
            employmentType,
            salaryRange,
            applicationDeadline,
            requiredQualifications,
            preferredQualifications,
            responsibilities,
            status: isDraft ? "Draft" : "Published", // Mark as Draft or Published
            recruiterId // Attach recruiter ID to the job document
        });

        alert(`Job ${isDraft ? "saved as draft" : "published"} successfully!`);
        window.location.href = 'R_jobMngt.html';
    } catch (error) {
        console.error("Error saving job data: ", error);
        alert("Failed to save the job data. Please try again.");
    }
}

window.onload = async function () {
    // Retrieve session data
    const sessionData = getUserSession();
    if (!sessionData) {
        alert("User not logged in. Please log in to access this page.");
        return;
    }

    // Use session user’s name or email as the document ID if applicable
    const docId = sessionData.name;  // Adjust if document ID uses a different field, like email
    const userDocRef = doc(db, "Recruiter", docId); // Reference to the document in "Recruiter" collection

    try {
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            // Retrieve specific fields (name, position)
            const name = docSnap.data().name;
            const position = docSnap.data().position;

            console.log("Name:", name);
            console.log("Position:", position);

            // Display name and position on the webpage
            document.getElementById("user-name").innerText = name;
            document.getElementById("user-designation").innerText = position;
        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.error("Error fetching document: ", error);
    }
};

// Function to handle user sign out
window.signOut = async function () {
    // Clear session data
    clearUserSession(); // Function to clear your session storage or cookies
    alert("You have successfully signed out.");
    window.location.href = 'index.html'; // Change to your login page URL
};

// Attach the sign out logic to the logout link
document.getElementById("nav-logout").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent default anchor click behavior
    signOut(); // Call the sign-out function
});

// Function to clear user session (example implementation)
function clearUserSession() {
    // Clear specific session data (localStorage, sessionStorage, cookies, etc.)
    localStorage.removeItem('userSession'); // Adjust based on your implementation
    sessionStorage.clear(); // Clear session storage if you're using it
    // Optionally clear cookies if you're using them
}

document.getElementById('nav-settings').onclick = function(event) {
    event.preventDefault(); // Prevent default link behavior
    openSettings(); // Call function to open settings
};

function openSettings() {
    document.getElementById('settingsSlide').style.display = 'block'; // Show the settings slide
}

window.closeSettings = function () {
    document.getElementById('settingsSlide').style.display = 'none'; // Hide the settings slide
}

// Close the settings slide when clicking outside the content
window.onclick = function(event) {
    const settingsPanel = document.getElementById('settingsSlide');
    if (event.target === settingsPanel) {
        closeSettings();
    }
};