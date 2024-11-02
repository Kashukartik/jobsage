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
    const tableBody = document.querySelector("#interviewsTable tbody");
    tableBody.innerHTML = "<br> <h2> loading.....</h2><br>";

    await displayUserInfo(sessionData);
    await upcomingInterviewsCount();
    await loadAllInterviewsByRecruiter();

});


// display the user details
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

async function upcomingInterviewsCount() {
    // Retrieve the recruiterId from the user session
    const sessionData = getUserSession(); // Ensure this function is defined to retrieve session data
    const recruiterId = sessionData.userId; // Adjust based on your session structure

    console.log(recruiterId);

    if (!recruiterId) {
        console.error("Recruiter ID not found in session.");
        alert("Recruiter information is missing. Please log in.");
        return 0; // Return 0 if recruiter ID is not found
    }

    try {
        // Reference to the Interview collection
        const interviewsRef = collection(db, "Interview");

        // Create a query to filter interviews by recruiterId
        const interviewsQuery = query(interviewsRef, where("recruiterId", "==", recruiterId));

        // Get the query snapshot
        const querySnapshot = await getDocs(interviewsQuery);

        console.log(querySnapshot.size);

        // Return the count of interviews
        document.getElementById("interviewsCountDisplay").textContent = querySnapshot.size; // Update the span with the count

    } catch (error) {
        console.error("Error counting upcoming interviews: ", error);
        return 0; // Return 0 in case of an error
    }
}



window.currentInterviewId = null;



async function loadAllInterviewsByRecruiter() {
    const sessionData = getUserSession();
    const recruiterId = sessionData ? sessionData.userId : null;

    if (!recruiterId) {
        console.error("Recruiter ID not provided.");
        return;
    }

    try {
        // Query to get all interviews for the recruiter
        const interviewsRef = collection(db, "Interview");
        const interviewsQuery = query(interviewsRef, where("recruiterId", "==", recruiterId));
        const interviewsSnap = await getDocs(interviewsQuery);

        const interviews = [];
        const jobRefs = new Set();
        const applicantIds = new Set();

        // First pass to collect jobRef and applicantId
        interviewsSnap.forEach((doc) => {
            const interviewData = doc.data();
            interviewData.id = doc.id; // Add document ID for actions
            interviews.push(interviewData);

            jobRefs.add(interviewData.jobRef); // Collect jobRef for querying jobs
            applicantIds.add(interviewData.applicantId); // Collect applicantId for querying applicants
        });

        if (interviews.length === 0) {
            console.log("No interviews found for this recruiter.");
            return;
        }

        // Query jobs based on job references
        const jobsMap = {};
        for (const jobRef of jobRefs) {
            const jobDoc = await getDoc(jobRef);
            if (jobDoc.exists()) {
                jobsMap[jobDoc.id] = jobDoc.data().jobTitle; // Map jobRef to jobTitle
            }
        }

        // Query applicants based on applicant IDs
        const applicantsMap = {};
        if (applicantIds.size > 0) {
            const applicantsQuery = query(collection(db, "JobSeeker"), where("applicantId", "in", Array.from(applicantIds)));
            const applicantsSnap = await getDocs(applicantsQuery);
            applicantsSnap.forEach((applicantDoc) => {
                applicantsMap[applicantDoc.id] = applicantDoc.data().name; // Map applicantId to applicantName
            });
        }

        // Now enrich interviews with job and applicant details
        interviews.forEach((interviewData) => {
            // Assuming jobRef is a DocumentReference
            const jobId = interviewData.jobRef.id; // Extract job ID from the reference
            interviewData.jobTitle = jobsMap[jobId] || "N/A"; // Set job title
        });

        // Sort interviews by interview date
        interviews.sort((a, b) => new Date(a.interviewDate) - new Date(b.interviewDate));

        const tableBody = document.querySelector("#interviewsTable tbody");
        tableBody.innerHTML = ""; // Clear existing rows

        interviews.forEach((interviewData) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${interviewData.applicantName || "N/A"}</td>
                <td>${interviewData.jobTitle || "N/A"}</td>
                <td>${new Date(interviewData.interviewDate).toLocaleDateString() || "N/A"}</td>
                <td>${interviewData.interviewTime || "N/A"}</td>
                <td>${interviewData.status || "Scheduled"}</td>
                <td>
                    <button class="view" onclick="showInterviewDetails('${interviewData.id}')">View</button>
                    <button class="reschedule" onclick="rescheduleInterview('${interviewData.id}')">Reschedule</button>
                    <button class="cancel" onclick="cancelInterview('${interviewData.id}')">Cancel</button>
                </td>
            `;

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error loading interviews: ", error);
    }
}


window.showInterviewDetails = async function (interviewId) {
    const interviewDetailsContainer = document.querySelector('.interview-details-container');

    // Reference to the interview document in Firestore
    const interviewRef = doc(db, "Interview", interviewId);
    try {
        const interviewDoc = await getDoc(interviewRef);
        if (interviewDoc.exists()) {
            const interviewData = interviewDoc.data();

            // Populate the interview details in the overlay
            document.getElementById("interviewers").innerText = interviewData.interviewers.join(", ") || "N/A";
            document.getElementById("interviewMode").innerText = interviewData.interviewMode || "N/A";
            document.getElementById("interviewDate").innerText = interviewData.interviewDate ? new Date(interviewData.interviewDate).toLocaleDateString() : "N/A";
            document.getElementById("interviewTime").innerText = interviewData.interviewTime || "N/A";
            document.getElementById("interviewLocation").innerText = interviewData.interviewLocation || "N/A";

            // Fetching job details
            const jobRef = interviewData.jobRef; // Assuming jobRef is a DocumentReference
            const jobDoc = await getDoc(jobRef);
            if (jobDoc.exists()) {
                const jobData = jobDoc.data();
                document.getElementById("jobTitle").innerText = jobData.jobTitle || "N/A";
                document.getElementById("jobDepartment").innerText = jobData.department || "N/A"; // Assuming the field name is department
                document.getElementById("jobLocation").innerText = jobData.location || "N/A"; // Assuming the field name is location
            } else {
                document.getElementById("jobTitle").innerText = "N/A";
                document.getElementById("jobDepartment").innerText = "N/A";
                document.getElementById("jobLocation").innerText = "N/A";
            }

            // Fetching applicant details from the standalone Applications collection
            const applicantRef = doc(db, "Applications", interviewData.applicantId); // Directly reference the Applications collection
            console.log("--", applicantRef);

            const applicantDoc = await getDoc(applicantRef);
            console.log("11--", applicantDoc.exists());

            if (applicantDoc.exists()) {
                const applicantData = applicantDoc.data();
                document.getElementById("applicantName").innerText = applicantData.name || "N/A";
                document.getElementById("applicantEmail").innerText = applicantData.email || "N/A";
                document.getElementById("applicantPhone").innerText = applicantData.phone || "N/A";
            } else {
                document.getElementById("applicantName").innerText = "N/A";
                document.getElementById("applicantEmail").innerText = "N/A";
                document.getElementById("applicantPhone").innerText = "N/A";
            }

            // Show the overlay
            interviewDetailsContainer.style.display = "flex";
        } else {
            console.error("No interview data found for the specified ID.");
            alert("Interview details not found.");
        }
    } catch (error) {
        console.error("Error fetching interview details: ", error);
        alert("Failed to load interview details. Please try again.");
    }
};



// Close functionality (optional: add a close button to each overlay)
window.closeOverlay1 = function () {
    document.querySelector(".interview-details-container").style.display = "none";
    rescheduleContainer.style.display = "none";
}


// Function to close the reschedule overlay
window.closeOverlay2 = function () {
    const rescheduleContainer = document.getElementById("rescheduleContainer");
    rescheduleContainer.style.display = "none"; // Hides the overlay
}

// Function to handle rescheduling an interview
window.rescheduleInterview = async function (interviewId) {
    const rescheduleContainer = document.getElementById("rescheduleContainer");
    rescheduleContainer.style.display = "flex"; // 'flex' enables overlay styling
    const newDate = document.getElementById("newDate").value;
    const newTime = document.getElementById("newTime").value;
    const newLocation = document.getElementById("interviewLocation").value; // Assuming you're adding a field for location

    if (!newDate || !newTime) {
        alert("Please provide both new date and time for the interview.");
        return;
    }

    try {
        // Reference to the interview document
        const interviewRef = doc(db, "Interview", interviewId);
        const interviewSnap = await getDoc(interviewRef);

        if (interviewSnap.exists()) {
            // Update the interview details in Firestore
            await updateDoc(interviewRef, {
                interviewDate: newDate,
                interviewTime: newTime,
                interviewLocation: newLocation // Update location if applicable
            });
            alert("Interview rescheduled successfully!");
            window.location.reload(); // Refresh the page or update the UI as needed
        } else {
            console.error("Interview not found for ID:", interviewId);
            alert("Interview not found. Please try again.");
        }
    } catch (error) {
        console.error("Error rescheduling interview:", error);
        alert("Failed to reschedule the interview. Please try again.");
    }
}



window.cancelInterview = async function (interviewId) {
    const confirmation = confirm("Are you sure you want to cancel this interview?");
    
    if (!confirmation) {
        return; // Exit the function if the user does not confirm
    }

    try {
        // Reference to the interview document in Firestore
        const interviewRef = doc(db, "Interview", interviewId);
        
        // Delete the interview document
        await deleteDoc(interviewRef);
        
        alert("Interview canceled successfully!");
        window.location.reload(); // Refresh the page or update the UI as needed
    } catch (error) {
        console.error("Error canceling interview: ", error);
        alert("Failed to cancel the interview. Please try again.");
    }
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