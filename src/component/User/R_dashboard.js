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


window.addEventListener("load", async function () {
    const sessionData = getUserSession();
    if (!sessionData) {
        alert("User not logged in. Please log in to access this page.");
        return;
    }

    const tableBody = document.querySelector("#recentApplicationsTable tbody");
    tableBody.innerHTML = "<br> <h2>loading....</h2><br>";

    await displayUserInfo(sessionData);
    await updateJobOpeningsCount();
    await updateApplicantsCount();
    await getApplicationsByRecruiterId();
});

async function displayUserInfo(sessionData) {
    const docId = sessionData.name;
    const userDocRef = doc(db, "Recruiter", docId);

    try {
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
            const name = docSnap.data().name;
            const position = docSnap.data().position;

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

async function updateJobOpeningsCount() {
    const jobOpeningsCountElement = document.getElementById("jobOpeningsCount");
    const sessionData = getUserSession();
    const userId = sessionData.userId;

    try {
        const q = query(collection(db, "JobPostings"), where("recruiterId", "==", userId));
        const querySnapshot = await getDocs(q);

        jobOpeningsCountElement.textContent = querySnapshot.size || "0";
    } catch (error) {
        console.error("Error counting job openings:", error);
        jobOpeningsCountElement.textContent = "Error";
    }
}

async function updateApplicantsCount() {
    const applicantsCountElement = document.getElementById("applicationsCount"); // Element to display the count
    const sessionData = getUserSession();
    const userId = sessionData.userId;

    try {
        // Query the Applications collection based on recruiterId
        const applicantsQuery = query(collection(db, "Applications"), where("recruiterId", "==", userId));

        const applicantsSnapshot = await getDocs(applicantsQuery);

        // Check if any documents were retrieved
        if (!applicantsSnapshot.empty) {
            // Count the applicants based on the query result
            const totalApplicantsCount = applicantsSnapshot.size;
            applicantsCountElement.textContent = totalApplicantsCount || "0";
        } else {
            // No applicants found for this recruiter
            applicantsCountElement.textContent = "0";
        }
    } catch (error) {
        console.error("Error counting applicants:", error);
        applicantsCountElement.textContent = "Error";
    }
}


async function getApplicationsByRecruiterId() {
    try {
        // Get the recruiterId from session storage
        const userSession = getUserSession();
        const recruiterId = userSession.userId; // Adjust this based on your session structure

        console.log(recruiterId);

        // Reference to the Applications collection
        const applicationsRef = collection(db, 'Applications');

        // Create a query to filter applications by recruiterId
        const applicationsQuery = query(applicationsRef, where('recruiterId', '==', recruiterId));

        // Get the query snapshot
        const querySnapshot = await getDocs(applicationsQuery);
        

        // Check if there are any applications
        if (querySnapshot.empty) {
            console.log('No applications found for this recruiter.');
            return [];
        }

        // Process the query results
        const applications = [];
        querySnapshot.forEach(doc => {
            const applicationData = { id: doc.id, ...doc.data() };
            applications.push(applicationData);
            // Sort applications by applied date
            applications.sort((a, b) => b.appliedAt.toDate() - a.appliedAt.toDate());
            const recentApplications = applications.slice(0, 5); // Get the most recent 5 applications

            // Step 4: Update the table with recent applications
            const tableBody = document.querySelector("#recentApplicationsTable tbody");
            tableBody.innerHTML = "";

            recentApplications.forEach((applicationData) => {
                const row = document.createElement("tr");

                row.innerHTML = `
                <td>${applicationData.name}</td>
                <td>${applicationData.jobId || "N/A"}</td>
                <td>${applicationData.status}</td>
                <td>${applicationData.appliedAt.toDate().toLocaleDateString()}</td>
            `;
                tableBody.appendChild(row);
            });
        });
        return applications; // Return the list of applications
    } catch (error) {
        console.error('Error getting applications: ', error);
        throw error; // Optionally rethrow the error for further handling
    }
}


function getUserSession() {
    const userSession = sessionStorage.getItem('user');
    return userSession ? JSON.parse(userSession) : null;
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