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
    const tableBody = document.querySelector("#applicationsListTable tbody");
    tableBody.innerHTML = "<br><h2>Loading.....</h2><br>";

    await displayUserInfo(sessionData);
    await loadAllApplicationsByRecruiter();

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


// Load all applications for recruiter
window.currentJobId = null; // Initialize as null
window.currentApplicationId = null; // Initialize as null


// async function loadAllApplicationsByRecruiter() {
//     const sessionData = getUserSession();
//     const recruiterId = sessionData.userId;

//     if (!recruiterId) {
//         console.error("Recruiter ID not provided.");
//         return;
//     }

//     try {
//         const jobsQuery = query(
//             collection(db, "JobPostings"),
//             where("recruiterId", "==", recruiterId)
//         );
//         const jobsSnap = await getDocs(jobsQuery);

//         const jobDataMap = {};
//         jobsSnap.forEach((doc) => {
//             jobDataMap[doc.id] = doc.data().jobTitle;
//         });

//         if (Object.keys(jobDataMap).length === 0) {
//             console.log("No jobs found for this recruiter.");
//             return;
//         }

//         const applications = [];

//         for (const jobId of Object.keys(jobDataMap)) {
//             const applicationsRef = collection(db, "JobPostings", jobId, "Applications");
//             const applicationsQuery = query(applicationsRef, orderBy("appliedAt", "desc"));
//             const applicationsSnap = await getDocs(applicationsQuery);

//             applicationsSnap.forEach((doc) => {
//                 const applicationData = doc.data();
//                 applicationData.jobId = jobId;
//                 applicationData.jobTitle = jobDataMap[jobId];
//                 applicationData.id = doc.id;
//                 applications.push(applicationData);
//             });
//         }

//         applications.sort((a, b) => b.appliedAt.toDate() - a.appliedAt.toDate());

//         const tableBody = document.querySelector("#applicationsListTable tbody");
//         tableBody.innerHTML = "";

//         applications.forEach((applicationData) => {
//             const row = document.createElement("tr");

//             row.innerHTML = `
//                 <td>${applicationData.name}</td>
//                 <td>${applicationData.jobTitle || "N/A"}</td>
//                 <td>${applicationData.status}</td>
//                 <td>${applicationData.appliedAt.toDate().toLocaleDateString()}</td>
//                 <td><button onclick="viewApplicationDetails('${applicationData.jobId}', '${applicationData.id}')">View</button></td>
//             `;
//             console.log("1--", applicationData);

//             tableBody.appendChild(row);
//         });
//     } catch (error) {
//         console.error("Error loading all applications by recruiter: ", error);
//     }
// }


async function loadAllApplicationsByRecruiter() {
    // Get the recruiterId from session storage
    const userSession = getUserSession();
    const recruiterId = userSession.userId;

    if (!recruiterId) {
        console.error("Recruiter ID not provided.");
        return;
    }

    try {
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


            applications.sort((a, b) => b.appliedAt.toDate() - a.appliedAt.toDate());

            const tableBody = document.querySelector("#applicationsListTable tbody");
            tableBody.innerHTML = "";

            applications.forEach((applicationData) => {
                const row = document.createElement("tr");
                
                row.innerHTML = `
                <td>${applicationData.name}</td>
                <td>${applicationData.jobId || "N/A"}</td>
                <td>${applicationData.status}</td>
                <td>${applicationData.appliedAt.toDate().toLocaleDateString()}</td>
                <td><button onclick="viewApplicationDetails('${applicationData.id}')">View</button></td>
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

window.viewApplicationDetails = async function (applicationId) {

    window.currentApplicationId = applicationId;
    try {
        const applicationRef = doc(db, "Applications", applicationId); // Directly reference the Applications collection
        const applicationSnap = await getDoc(applicationRef);

        if (applicationSnap.exists()) {
            const applicationData = applicationSnap.data();

            document.getElementById("applicantName").textContent = applicationData.name;
            document.getElementById("applicantEmail").textContent = applicationData.email;
            document.getElementById("applicantPhone").textContent = applicationData.phone;
            document.getElementById("coverLetter").textContent = applicationData.coverLetter || "N/A";
            document.getElementById("portfolio").textContent = applicationData.portfolio || "N/A";
            document.getElementById("linkedin").textContent = applicationData.linkedin || "N/A";
            document.getElementById("resumeLink").setAttribute("href", applicationData.resumeURL || "#");

            // Get job details based on jobId from applicationData
            const jobRef = doc(db, "JobPostings", applicationData.jobId);
            const jobSnap = await getDoc(jobRef);
            if (jobSnap.exists()) {
                const jobData = jobSnap.data();
                document.getElementById("jobTitle").textContent = jobData.jobTitle || "N/A";
                document.getElementById("jobDepartment").textContent = jobData.department || "N/A";
                document.getElementById("jobLocation").textContent = jobData.jobLocation || "N/A";
                document.getElementById("jobDescription").textContent = jobData.jobDescription || "N/A";
                document.getElementById("jobRequirements").textContent = jobData.requirements || "N/A";
                document.getElementById("jobSalary").textContent = jobData.salaryRange || "N/A";
                document.getElementById("jobType").textContent = jobData.employmentType || "N/A";
                document.getElementById("jobPostedDate").textContent = jobData.applicationDeadline || "N/A";
            } else {
                console.error("Job not found for ID: ", applicationData.jobId);
            }

            document.getElementById("currentStatus").textContent = applicationData.status;
            document.getElementById("notesTextarea").value = applicationData.notes || "";
            document.querySelector(".overlay").style.display = "flex";
        } else {
            console.error("Application not found.");
        }
    } catch (error) {
        console.error("Error loading application details: ", error);
    }
}

// Function to save the updated status
window.saveStatus = async function () {
    const newStatus = document.getElementById("statusDropdown").value;

    const applicationId = window.currentApplicationId; // Access from window object

    try {
        // Directly reference the application in the Applications collection
        const applicationRef = doc(db, "Applications", applicationId);
        await updateDoc(applicationRef, {
            status: newStatus,
        });

        document.getElementById("currentStatus").textContent = newStatus;
        alert("Status updated successfully!");
        window.location.reload(); // Optionally reload to refresh data
    } catch (error) {
        console.error("Error updating status: ", error);
    }
}


// Function to save notes
window.saveNotes = async function () {
    const notes = document.getElementById("notesTextarea").value;

    const applicationId = window.currentApplicationId; // Access from window object

    try {
        // Directly reference the application in the Applications collection
        const applicationRef = doc(db, "Applications", applicationId);
        await updateDoc(applicationRef, {
            notes: notes,
        });
        alert("Notes saved successfully!");
        window.location.reload(); // Optionally reload to refresh data
    } catch (error) {
        console.error("Error saving notes: ", error);
    }
}


window.closeOverlay = function () {
    document.querySelector(".overlay").style.display = "none"; // Hide overlay
}


// Load application details when the page loads
// function () {
//     const jobId = "YOUR_JOB_ID_HERE"; // Replace with actual job ID
//     const applicationId = "YOUR_APPLICATION_ID_HERE"; // Replace with actual application ID
//     loadApplicationDetails(jobId, applicationId);

//     // Attach event listeners to buttons
//     document.getElementById("saveStatus").onclick = function () {
//         saveStatus(jobId, applicationId);
//     };
//     document.getElementById("saveNotes").onclick = function () {
//         saveNotes(jobId, applicationId);
//     };
// };

window.onload = async function countApplicationsByRecruiter() {
    const userSession = getUserSession();
    const recruiterId = userSession.userId;

    if (!recruiterId) {
        console.error("Recruiter ID not found.");
        return;
    }

    try {
        // Reference to the Applications collection
        const applicationsRef = collection(db, "Applications");

        // Create a query to filter applications by recruiterId
        const applicationsQuery = query(applicationsRef, where('recruiterId', '==', recruiterId));

        // Get the query snapshot
        const querySnapshot = await getDocs(applicationsQuery);

        // Get the number of applications
        const numberOfApplications = querySnapshot.size;

        // Update the HTML to show the number of applications
        document.getElementById("applicationsCount").innerText = `${numberOfApplications}`;
    } catch (error) {
        console.error("Error fetching applications count: ", error);
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
