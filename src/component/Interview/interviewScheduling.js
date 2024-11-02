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

window.addEventListener("load", async function () {
    const sessionData = getUserSession();
    if (!sessionData) {
        alert("User not logged in. Please log in to access this page.");
        return;
    }

    await displayUserInfo(sessionData);
    await fetchApplicantAndJobData();

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

// Function to fetch applicants and jobs and populate select options


async function fetchApplicantAndJobData() {
    const applicantSelect = document.getElementById("applicantName");
    const jobSelect = document.getElementById("jobTitle");

    // Retrieve the recruiterId from the user session
    const sessionData = getUserSession(); // Ensure getUserSession() is defined to retrieve session data
    const recruiterId = sessionData ? sessionData.userId : null;

    console.log("1--", recruiterId);

    if (!recruiterId) {
        console.error("Recruiter ID not found in session.");
        alert("Recruiter information is missing. Please log in.");
        return;
    }

    try {
        // Define a query to fetch job details based on recruiterId
        const jobCollectionRef = collection(db, "JobPostings");
        const jobQuery = query(jobCollectionRef, where("recruiterId", "==", recruiterId));
        const jobSnapshot = await getDocs(jobQuery);

        if (jobSnapshot.empty) {
            alert("No jobs found for this recruiter.");
            return;
        }

        // Clear existing options in the dropdowns before populating
        jobSelect.innerHTML = "";
        applicantSelect.innerHTML = "";

        const jobIds = []; // Array to hold job IDs for filtering applicants

        jobSnapshot.forEach(async (jobDoc) => {
            const jobData = jobDoc.data();
            const jobId = jobDoc.id;

            // Populate job titles in the dropdown
            const jobOption = document.createElement("option");
            jobOption.value = jobId;
            jobOption.textContent = jobData.jobTitle || "Unknown Job";
            jobSelect.appendChild(jobOption);
            
            jobIds.push(jobId); // Add jobId to the array for later use
        });

        // Fetch applicants based on the job IDs associated with this recruiter
        const applicationsCollectionRef = collection(db, "Applications");
        const applicantsQuery = query(applicationsCollectionRef, where("jobId", "in", jobIds)); // Filter by jobId
        const applicantsSnapshot = await getDocs(applicantsQuery);

        if (applicantsSnapshot.empty) {
            alert("No applicants found for the jobs posted by this recruiter.");
            return;
        }

        applicantsSnapshot.forEach(applicantDoc => {
            const applicantData = applicantDoc.data();
            // Populate applicants in the dropdown
            const applicantOption = document.createElement("option");
            applicantOption.value = applicantDoc.id; // Assuming applicantDoc.id as unique ID
            applicantOption.textContent = `${applicantData.name} --- ${applicantDoc.id}` || "Unknown Applicant";
            applicantSelect.appendChild(applicantOption);
        });

    } catch (error) {
        console.error("Error fetching job or applicant data:", error);
        alert("Failed to load job or applicant data. Please try again.");
    }
}






// Form submission handler for storing interview details
document.getElementById("schedulingForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get values from form inputs
    const applicantId = document.getElementById("applicantName").value;
    const jobId = document.getElementById("jobTitle").value;
    const interviewDate = document.getElementById("interviewDate").value;
    const interviewTime = document.getElementById("interviewTime").value;
    const interviewers = Array.from(document.getElementById("interviewers").selectedOptions).map(option => option.value);
    const interviewMode = document.getElementById("interviewMode").value;
    const interviewLocation = document.getElementById("interviewLocation").value || null;

    // Retrieve the recruiterId from the user session
    const sessionData = getUserSession(); // Ensure this function is defined to retrieve session data
    const recruiterId = sessionData ? sessionData.userId : null; // Adjust based on your session structure

    // Create references for job and recruiter
    const jobRef = doc(db, "JobPostings", jobId); // Reference to the job document
    const recruiterRef = doc(db, "Recruiter", recruiterId); // Reference to the recruiter document

    if (!recruiterId) {
        alert("Recruiter information is missing. Please log in.");
        return;
    }

    // Fetch applicant name and create application reference
    let applicantName = "Unknown Applicant"; // Default value
    let applicationRef; // Declare applicationRef to store the reference
    try {
        applicationRef = doc(db, "Applications", applicantId); // Get a reference to the application document
        const applicantDoc = await getDoc(applicationRef); // Fetch applicant document
        if (applicantDoc.exists()) {
            applicantName = applicantDoc.data().name; // Retrieve the applicant's name
        } else {
            alert("Applicant not found.");
            return;
        }
    } catch (error) {
        console.error("Error fetching applicant data:", error);
        alert("Failed to retrieve applicant data. Please try again.");
        return;
    }

    const interviewData = {
        applicantId,
        applicantName,
        jobId,
        jobRef,
        interviewDate,
        interviewTime,
        interviewers,
        interviewMode,
        interviewLocation: interviewMode === 'in_person' ? interviewLocation : null,
        scheduledAt: new Date().toISOString(),
        recruiterId,
        recruiterRef, // Add recruiterId to the interview data
        applicationRef: applicationRef // Add application reference to the interview data
    };

    try {
        // Create a reference to a document in the "Interview" collection with the ID as applicantId
        const interviewDocRef = doc(db, "Interview", applicantId);
        await setDoc(interviewDocRef, interviewData);

        alert("Interview scheduled successfully!");
        document.getElementById("schedulingForm").reset();
        window.location.href = 'R_interviewDashboard.html';
    } catch (error) {
        console.error("Error scheduling interview:", error);
        alert("Failed to schedule interview. Please try again.");
    }
});



// Toggle location input based on interview mode
document.getElementById("interviewMode").addEventListener("change", (e) => {
    document.getElementById("locationGroup").style.display = e.target.value === "in_person" ? "block" : "none";
});


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