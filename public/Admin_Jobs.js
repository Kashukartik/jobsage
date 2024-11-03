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
    
    await displayUserInfo(sessionData);
    await loadJobCards();

});

async function displayUserInfo(sessionData) {
    const docId = sessionData.name;
    const userDocRef = doc(db, "users", docId);

    try {
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
            const name = docSnap.data().name;
            const position = docSnap.data().position;
            console.log();
            
            document.getElementById("user-name").innerText = name;
            document.getElementById("user-designation").innerText = position;
            document.querySelector("#welcome-heading").innerHTML = `Welcome, ${name}!`;
        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.error("Error fetching document: ", error);
    }
}



async function loadJobCards() {
    const jobCardsContainer = document.getElementById("jobCardsContainer");
    jobCardsContainer.innerHTML = "<h2>Loading......</h2>"
    const sessionData = getUserSession();
    const userId = sessionData.userId;

    // Check if session data is available
    if (!sessionData ) {
        alert("User not logged in or not a recruiter. Please log in as a recruiter to access job postings.");
        return;
    }

    try {
        // Create a query to get job postings for the logged-in recruiter
        const q = collection(db, "JobPostings"); // Assuming email is used as recruiterId
        const querySnapshot = await getDocs(q);

        // Clear existing job cards
        jobCardsContainer.innerHTML = "";
        

        // Check if there are no job postings
        if (querySnapshot.empty) {
            jobCardsContainer.innerHTML = "<p>No job postings found for the recruiters.</p>";
            return;
        }

        querySnapshot.forEach((doc) => {
            const jobData = doc.data();

            // Create card elements
            const jobCard = document.createElement("div");
            jobCard.className = "job-card";

            jobCard.innerHTML = `
                <h2 class="job-title">Job Title: <span id="cardJobTitle">${jobData.jobTitle}</span></h2>
                <p class="job-description">Description: <span id="cardJobDescription">${jobData.jobDescription}</span></p>
                <p class="job-department">Department: <span id="cardDepartment">${jobData.department}</span></p>
                <p class="job-location">Location: <span id="cardJobLocation">${jobData.jobLocation}</span></p>
                <p class="employment-type">Employment Type: <span id="cardEmploymentType">${jobData.employmentType}</span></p>
                <p class="salary-range">Salary Range: <span id="cardSalaryRange">${jobData.salaryRange}</span></p>
                <p class="application-deadline">Application Deadline: <span id="cardApplicationDeadline">${jobData.applicationDeadline}</span></p>
                <p class="required-qualifications">Required Qualifications: <span id="cardRequiredQualifications">${jobData.requiredQualifications}</span></p>
                <p class="preferred-qualifications">Preferred Qualifications: <span id="cardPreferredQualifications">${jobData.preferredQualifications || 'N/A'}</span></p>
                <p class="responsibilities">Responsibilities: <span id="cardResponsibilities">${jobData.responsibilities}</span></p>
                <p class="job-status">Status: <span id="cardJobStatus">${jobData.status}</span></p>
            `;

            jobCardsContainer.appendChild(jobCard);
        });
    } catch (error) {
        console.error("Error loading job cards: ", error);
    }
}


// Function to handle user sign out
window.signOut = async function () {
    // Clear session data
    clearUserSession(); // Function to clear your session storage or cookies
    alert("You have successfully signed out.");
    window.location.href = 'index.html'; // Change to your login page URL
};

// Attach the sign out logic to the logout link
document.getElementById("nav-logout").addEventListener("click", function (event) {
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




