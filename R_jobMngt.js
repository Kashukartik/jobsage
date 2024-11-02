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


// async function loadJobCards() {
//     const jobCardsContainer = document.getElementById("jobCardsContainer");

//     try {
//         const querySnapshot = await getDocs(collection(db, "JobPostings"));

//         // Clear existing job cards
//         jobCardsContainer.innerHTML = "";

//         querySnapshot.forEach((doc) => {
//             const jobData = doc.data();

//             // Create card elements
//             const jobCard = document.createElement("div");
//             jobCard.className = "job-card";

//             jobCard.innerHTML = `
//                 <h2 class="job-title">Job Title: <span id="cardJobTitle">${jobData.jobTitle}</span></h2>
//                 <p class="job-description">Description: <span id="cardJobDescription">${jobData.jobDescription}</span></p>
//                 <p class="job-department">Department: <span id="cardDepartment">${jobData.department}</span></p>
//                 <p class="job-location">Location: <span id="cardJobLocation">${jobData.jobLocation}</span></p>
//                 <p class="employment-type">Employment Type: <span id="cardEmploymentType">${jobData.employmentType}</span></p>
//                 <p class="salary-range">Salary Range: <span id="cardSalaryRange">${jobData.salaryRange}</span></p>
//                 <p class="application-deadline">Application Deadline: <span id="cardApplicationDeadline">${jobData.applicationDeadline}</span></p>
//                 <p class="required-qualifications">Required Qualifications: <span id="cardRequiredQualifications">${jobData.requiredQualifications}</span></p>
//                 <p class="preferred-qualifications">Preferred Qualifications: <span id="cardPreferredQualifications">${jobData.preferredQualifications || 'N/A'}</span></p>
//                 <p class="responsibilities">Responsibilities: <span id="cardResponsibilities">${jobData.responsibilities}</span></p>
//                 <p class="job-status">Status: <span id="cardJobStatus">${jobData.status}</span></p>
//                 <div class="card-actions">
//                     <button style="background-color: gray;" onclick="editJob('${doc.id}')">Edit</button>
//                     <button style="background-color: red;" onclick="deleteJob('${doc.id}')">Delete</button>
//                     <button style="background-color:deepskyblue;" onclick="unpublishJob('${doc.id}')">Unpublish</button>
//                     <button onclick="publishJob('${doc.id}')">Publish</button>
//                 </div>
//             `;

//             jobCardsContainer.appendChild(jobCard);
//         });
//     } catch (error) {
//         console.error("Error loading job cards: ", error);
//     }
// }

// Function to be called on page load or after a job is added
window.onload = loadJobCards();


// function to edit Jobs
// window.editJob = async function (jobId) {
//     // Fetch job data from Firestore
//     const jobDoc = await getDoc(doc(db, "JobPostings", jobId));
    
//     if (jobDoc.exists()) {
//         const jobData = jobDoc.data();

//         // Populate the edit form with existing job data
//         document.getElementById("editJobTitle").value = jobData.jobTitle;
//         document.getElementById("editJobDescription").value = jobData.jobDescription;
//         document.getElementById("editDepartment").value = jobData.department;
//         document.getElementById("editJobLocation").value = jobData.jobLocation;
//         document.getElementById("editEmploymentType").value = jobData.employmentType;
//         document.getElementById("editSalaryRange").value = jobData.salaryRange;
//         document.getElementById("editApplicationDeadline").value = jobData.applicationDeadline;
//         document.getElementById("editRequiredQualifications").value = jobData.requiredQualifications;
//         document.getElementById("editPreferredQualifications").value = jobData.preferredQualifications || '';
//         document.getElementById("editResponsibilities").value = jobData.responsibilities;


//         window.currentJobId = jobId;
         
//         // Show the modal
//         document.getElementById("editJobModal").style.display = "flex";
//     } else {
//         console.log("No such document!");
//     }
// }

// function to Update the Jobs
// window.updateJob = async function (event) {
//     event.preventDefault(); // Prevent form from reloading the page

//     // Get job ID from the form (you may want to store it in a hidden input field)
//     const jobId =  window.currentJobId/* Get the job ID from a hidden field or closure */;
    
//     // Collect updated job data
//     const updatedJobData = {
//         jobTitle: document.getElementById("editJobTitle").value,
//         jobDescription: document.getElementById("editJobDescription").value,
//         department: document.getElementById("editDepartment").value,
//         jobLocation: document.getElementById("editJobLocation").value,
//         employmentType: document.getElementById("editEmploymentType").value,
//         salaryRange: document.getElementById("editSalaryRange").value,
//         applicationDeadline: document.getElementById("editApplicationDeadline").value,
//         requiredQualifications: document.getElementById("editRequiredQualifications").value,
//         preferredQualifications: document.getElementById("editPreferredQualifications").value,
//         responsibilities: document.getElementById("editResponsibilities").value,
//         status: "Published" // Or whatever status you want to set
//     };

//     try {
//         // Update the document in Firestore
//         await updateDoc(doc(db, "JobPostings", jobId), updatedJobData);
//         alert("Job updated successfully!");

//         // Close the modal and reload the job cards
//         closeModal();
//         loadJobCards(); // Reload job cards to show the updated information
//     } catch (error) {
//         console.error("Error updating job data: ", error);
//         alert("Failed to update job data. Please try again.");
//     }
// }


// function to delete the Jobs
// window.deleteJob = async function (jobId) {
//     const jobDocRef = doc(db, "JobPostings", jobId); // Create a reference to the job document

//     try {
//         await deleteDoc(jobDocRef); // Delete the document from Firestore
//         console.log("Job deleted successfully:", jobId);

//         // Optionally refresh the job cards to reflect the deletion
//         loadJobCards();
//     } catch (error) {
//         console.error("Error deleting job:", error);
//         alert("Failed to delete the job. Please try again.");
//     }
// }

// function to Unpublish the jobs
// window.unpublishJob = async function (jobId) {
//     const jobDocRef = doc(db, "JobPostings", jobId); // Create a reference to the job document

//     try {
//         // Update the status of the job to "Draft" in Firestore
//         await updateDoc(jobDocRef, { status: "Draft" });
//         console.log("Job unpublished successfully:", jobId);

//         // Optionally refresh the job cards to reflect the status update
//         loadJobCards();
//     } catch (error) {
//         console.error("Error unpublishing job:", error);
//         alert("Failed to unpublish the job. Please try again.");
//     }
// };

// function to publish the jobs
// window.publishJob = async function (jobId) {
//     // Reference to the specific job document in Firestore
//     const jobDocRef = doc(db, "JobPostings", jobId);

//     try {
//         // Update the status of the job to "Published" in Firestore
//         await updateDoc(jobDocRef, { status: "Published" });
//         console.log("Job published successfully:", jobId);

//         // Optionally refresh the job cards to reflect the status update
//         loadJobCards();
//     } catch (error) {
//         console.error("Error publishing job:", error);
//         alert("Failed to publish the job. Please try again.");
//     }
// }


// function to load the user details
// window.onload = async function () {
//     const docId = "MAMA"; // Replace with the actual document ID you want to retrieve
//     const userDocRef = doc(db, "Recruiter", docId); // Reference to the document in "Users" collection

//     try {
//         const docSnap = await getDoc(userDocRef);

//         if (docSnap.exists()) {
//             // Retrieve only the `name` and `position` fields
//             const name = docSnap.data().name;
//             const position = docSnap.data().position;

//             console.log("Name:", name);
//             console.log("Position:", position);

//             // Display name and position on the webpage
//             document.getElementById("user-name").innerText = `${name}`;
//             document.getElementById("user-designation").innerText = `${position}`;
//             document.querySelector("#welcome-heading").innerHTML = `Welcome, ${name} !`;
//         } else {
//             console.log("No such document!");
//         }
//     } catch (error) {
//         console.error("Error fetching document: ", error);
//     }
// };




// Function to retrieve user session data
function getUserSession() {
    const userSession = sessionStorage.getItem('user');
    return userSession ? JSON.parse(userSession) : null;
}

// display the user details
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

async function loadJobCards() {
    const jobCardsContainer = document.getElementById("jobCardsContainer");
    jobCardsContainer.innerHTML = "<h2>Loading......</h2>"
    const sessionData = getUserSession();
    const userId = sessionData.userId;

    // Check if session data is available
    if (!sessionData || sessionData.role !== 'recruiter') {
        alert("User not logged in or not a recruiter. Please log in as a recruiter to access job postings.");
        return;
    }

    try {
        // Create a query to get job postings for the logged-in recruiter
        const q = query(collection(db, "JobPostings"), where("recruiterId", "==", userId)); // Assuming email is used as recruiterId
        const querySnapshot = await getDocs(q);

        // Clear existing job cards
        jobCardsContainer.innerHTML = "";
        

        // Check if there are no job postings
        if (querySnapshot.empty) {
            jobCardsContainer.innerHTML = "<p>No job postings found for this recruiter.</p>";
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

            // Show action buttons for recruiters
            jobCard.innerHTML += `
                <div class="card-actions">
                    <button style="background-color: gray;" onclick="editJob('${doc.id}')">Edit</button>
                    <button style="background-color: red;" onclick="deleteJob('${doc.id}')">Delete</button>
                    <button style="background-color: deepskyblue;" onclick="unpublishJob('${doc.id}')">Unpublish</button>
                    <button onclick="publishJob('${doc.id}')">Publish</button>
                </div>
            `;

            jobCardsContainer.appendChild(jobCard);
        });
    } catch (error) {
        console.error("Error loading job cards: ", error);
    }
}

window.editJob = async function (jobId) {
    // Check session data for role
    const sessionData = getUserSession();
    if (!sessionData || sessionData.role !== 'recruiter') {
        alert("You are not authorized to edit job postings.");
        return;
    }

    // Fetch job data from Firestore
    const jobDoc = await getDoc(doc(db, "JobPostings", jobId));
    
    if (jobDoc.exists()) {
        const jobData = jobDoc.data();

        // Populate the edit form with existing job data
        document.getElementById("editJobTitle").value = jobData.jobTitle;
        document.getElementById("editJobDescription").value = jobData.jobDescription;
        document.getElementById("editDepartment").value = jobData.department;
        document.getElementById("editJobLocation").value = jobData.jobLocation;
        document.getElementById("editEmploymentType").value = jobData.employmentType;
        document.getElementById("editSalaryRange").value = jobData.salaryRange;
        document.getElementById("editApplicationDeadline").value = jobData.applicationDeadline;
        document.getElementById("editRequiredQualifications").value = jobData.requiredQualifications;
        document.getElementById("editPreferredQualifications").value = jobData.preferredQualifications || '';
        document.getElementById("editResponsibilities").value = jobData.responsibilities;

        // Set the job ID for use during save
        window.currentJobId = jobId;

        // Show the modal for editing
        document.getElementById("editJobModal").style.display = "flex";
    } else {
        console.log("No such document!");
    }
}

window.updateJob = async function (event) {
    event.preventDefault(); // Prevent form from reloading the page

    // Check session data for authorization
    const sessionData = getUserSession();
    if (!sessionData || sessionData.role !== 'recruiter') {
        alert("You are not authorized to update job postings.");
        return;
    }

    // Get job ID from the global variable set during editJob
    const jobId = window.currentJobId;
    
    // Collect updated job data
    const updatedJobData = {
        jobTitle: document.getElementById("editJobTitle").value,
        jobDescription: document.getElementById("editJobDescription").value,
        department: document.getElementById("editDepartment").value,
        jobLocation: document.getElementById("editJobLocation").value,
        employmentType: document.getElementById("editEmploymentType").value,
        salaryRange: document.getElementById("editSalaryRange").value,
        applicationDeadline: document.getElementById("editApplicationDeadline").value,
        requiredQualifications: document.getElementById("editRequiredQualifications").value,
        preferredQualifications: document.getElementById("editPreferredQualifications").value,
        responsibilities: document.getElementById("editResponsibilities").value,
        status: "Published" // Or whatever status you want to set
    };

    try {
        // Update the document in Firestore
        await updateDoc(doc(db, "JobPostings", jobId), updatedJobData);
        alert("Job updated successfully!");

        // Close the modal and reload the job cards
        closeModal();
        loadJobCards(); // Reload job cards to show the updated information
    } catch (error) {
        console.error("Error updating job data: ", error);
        alert("Failed to update job data. Please try again.");
    }
};

window.deleteJob = async function (jobId) {
    // Check session data for authorization
    const sessionData = getUserSession();
    if (!sessionData || sessionData.role !== 'recruiter') {
        alert("You are not authorized to delete job postings.");
        return;
    }

    const jobDocRef = doc(db, "JobPostings", jobId); // Create a reference to the job document

    try {
        await deleteDoc(jobDocRef); // Delete the document from Firestore
        console.log("Job deleted successfully:", jobId);

        // Optionally refresh the job cards to reflect the deletion
        loadJobCards();
    } catch (error) {
        console.error("Error deleting job:", error);
        alert("Failed to delete the job. Please try again.");
    }
};

window.unpublishJob = async function (jobId) {
    // Check session data for authorization
    const sessionData = getUserSession();
    if (!sessionData || sessionData.role !== 'recruiter') {
        alert("You are not authorized to unpublish job postings.");
        return;
    }

    const jobDocRef = doc(db, "JobPostings", jobId); // Create a reference to the job document

    try {
        // Update the status of the job to "Draft" in Firestore
        await updateDoc(jobDocRef, { status: "Draft" });
        console.log("Job unpublished successfully:", jobId);

        // Optionally refresh the job cards to reflect the status update
        loadJobCards();
    } catch (error) {
        console.error("Error unpublishing job:", error);
        alert("Failed to unpublish the job. Please try again.");
    }
};

window.publishJob = async function (jobId) {
    // Check session data for authorization
    const sessionData = getUserSession();
    if (!sessionData || sessionData.role !== 'recruiter') {
        alert("You are not authorized to publish job postings.");
        return;
    }

    // Reference to the specific job document in Firestore
    const jobDocRef = doc(db, "JobPostings", jobId);

    try {
        // Update the status of the job to "Published" in Firestore
        await updateDoc(jobDocRef, { status: "Published" });
        console.log("Job published successfully:", jobId);

        // Optionally refresh the job cards to reflect the status update
        loadJobCards();
    } catch (error) {
        console.error("Error publishing job:", error);
        alert("Failed to publish the job. Please try again.");
    }
};

// function to close the Edit window
window.closeModal = function() {
    document.getElementById("editJobModal").style.display = "none";
}


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