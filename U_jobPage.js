import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc, setDoc, doc, getDocs, getDoc, updateDoc, deleteDoc, query, orderBy, where, onSnapshot } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";


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
const storage = getStorage(app);

// Function to be called on page load or after a job is added

async function loadJobCards() {
    const sessionData = getUserSession();

    const jobCardsContainer = document.getElementById("jobCardsContainer");

    // Assume you have a function to get the current user's applicantId
    const applicantId = sessionData.userId; // Implement this function based on your auth logic

    try {
        // Build query with filters
        let jobsQuery = collection(db, "JobPostings");
 
        const querySnapshot = await getDocs(jobsQuery);
        jobCardsContainer.innerHTML = "";

        if (querySnapshot.empty) {
            const noJobsMessage = document.createElement("p");
            noJobsMessage.innerHTML = `<h2>No jobs available.</h2>`;
            jobCardsContainer.appendChild(noJobsMessage);
            return;
        }

        // Fetch applications for the current user
        const applicationsQuery = query(collection(db, "Applications"), where("applicantId", "==", applicantId));
        const applicationsSnapshot = await getDocs(applicationsQuery);

        // Collect applied job IDs
        const appliedJobIds = new Set();
        applicationsSnapshot.forEach(app => {
            appliedJobIds.add(app.data().jobId); // Assuming each application has a jobId field
        });

        querySnapshot.forEach((doc) => {
            const jobData = doc.data();
            const jobStatus = jobData.status;

            // Only show jobs that are published and not applied for
            if (jobStatus === "Published" && !appliedJobIds.has(doc.id)) {
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
                    <p class="responsibilities">Responsibilities: <span id="cardResponsibilities">${jobData.responsibilities}</span></p>`;

                jobCard.innerHTML += `<button onclick="applyJob('${doc.id}')">Apply</button>`;

                jobCardsContainer.appendChild(jobCard);
            }
        });

        if (jobCardsContainer.childElementCount === 0) {
            const noAvailableJobsMessage = document.createElement("p");
            noAvailableJobsMessage.innerHTML = `<h2>No available job postings that you can apply for.</h2>`;
            jobCardsContainer.appendChild(noAvailableJobsMessage);
        }

    } catch (error) {
        console.error("Error loading job cards: ", error);
    }
}












// Function to retrieve user session data
function getUserSession() {
    const userSession = sessionStorage.getItem('user');
    return userSession ? JSON.parse(userSession) : null;
}

// display the user data
window.onload = async function () {
    // Retrieve user session for authorization
    const sessionData = getUserSession();

    if (!sessionData) {
        console.log("No user session found.");
        // Optionally redirect to login page or display a message
        return;
    }

    const docId = sessionData.name; // Assuming the user object in session contains the name

    // Initialize userDocRef based on role
    let userDocRef;
    if (sessionData.role === "job-seeker") {
        userDocRef = doc(db, "JobSeeker", docId);
    } else if (sessionData.role === "recruiter") {
        userDocRef = doc(db, "Recruiter", docId);
    }

    // Proceed only if userDocRef is defined
    if (!userDocRef) {
        console.log("User role is not defined or recognized.");
        return;
    }

    try {
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            // Retrieve only the `name` and `position` fields
            const { name, position } = docSnap.data();
            // Update the UI with the user's name and position
            console.log("Name:", name);
            console.log("Position:", position);

            // Display name and position on the webpage
            document.getElementById("user-name").innerText = name;
            document.getElementById("user-designation").innerText = position;

            await loadJobCards();
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

window.applyJob = async function (jobId) {
    alert("PRESSED");

    console.log("1-Session Storage Data:", sessionStorage.getItem('userSession'));

    const userSession = getUserSession();

    console.log("2-User Session Data:", userSession);

    console.log("3-Session data on call:", userSession.userId);
    // Check if userSession and userSession.userId are valid
    if (!userSession || !userSession.userId) {
        console.error("User session is invalid or user ID is missing.");
        alert("Please log in to apply for this job.");
        return; // Exit the function if user session is not available
    }

    const userDocRef = doc(db, "JobSeeker", userSession.userId);

    console.log("4 ------", userDocRef);


    try {
        const userDoc = await getDoc(userDocRef);
        let userName = '', userEmail = '', userPhone = '';

        if (userDoc.exists()) {
            const userData = userDoc.data();
            userName = userData.name || '';
            userEmail = userData.email || '';
            userPhone = userData.phone || '';
        }

        const jobDocRef = doc(db, "JobPostings", jobId);
        const jobDoc = await getDoc(jobDocRef);

        window.currentJobId = jobId;
        console.log("5 -- ", jobId);


        if (jobDoc.exists()) {
            const jobData = jobDoc.data();

            // Update the job details in the form
            document.getElementById("jobTitle").innerText = `${jobData.jobTitle}`;
            document.getElementById("jobDescription").innerText = `${jobData.jobDescription}`;
            document.getElementById("jobDepartment").innerText = `${jobData.department}`;

            // Display the application form
            document.querySelector(".apply-job").style.display = "flex";
        } else {
            console.log("Job not found!");
        }
    } catch (error) {
        console.error("Error fetching data: ", error);
    }
};

// Function to submit job application
window.submitJobApplication = async function (event) {
    event.preventDefault(); // Prevent form from reloading the page

    const jobId = window.currentJobId; // Retrieve jobId from the global variable
    if (!jobId) {
        alert("Job ID not found.");
        return;
    }

    // Retrieve the current user session
    const sessionData = getUserSession();
    if (!sessionData) {
        alert("User session not found. Please log in.");
        return;
    }

    const userId = sessionData.userId; // Assuming sessionData has a userId field
    console.log("00--", userId);

    const userRef = doc(db, "JobSeeker", userId); // Reference to the user's document in JobSeeker collection


    // Reference to the job document in JobPostings collection
    const jobRef = doc(db, "JobPostings", jobId);
    const jobDoc = await getDoc(jobRef);
    console.log("6--", jobDoc.data());
    console.log("7--", jobRef.docId);


    // Fetch job details to get the recruiter ID
    let recruiterRef;
    try {
        const jobSnap = await getDoc(jobRef);
        if (jobSnap.exists()) {
            const jobData = jobSnap.data();
            if (jobData.recruiterId) {
                recruiterRef = doc(db, "Recruiter", jobData.recruiterId); // Reference to the recruiter's document
            } else {
                alert("Recruiter ID not found in job details.");
                return;
            }
        } else {
            alert("Job not found.");
            return;
        }
    } catch (error) {
        console.error("Error fetching job details: ", error);
        alert("Failed to retrieve job details. Please try again.");
        return;
    }


    // Collect application data
    const applicantData = {
        name: document.getElementById("applicantName").value,
        email: document.getElementById("applicantEmail").value,
        phone: document.getElementById("applicantPhone").value,
        coverLetter: document.getElementById("coverLetter").value,
        portfolio: document.getElementById("portfolio").value,
        linkedin: document.getElementById("linkedin").value,
        jobSeekerRef: userRef, // Reference to JobSeeker document
        jobRef: jobRef, // Reference to JobPostings document
        recruiterRef: recruiterRef, // Reference to Recruiter document
        status: "Applied",
    };

    const applicantId = applicantData.name;

    // Collect resume file
    const resumeFile = document.getElementById("resume").files[0];
    if (!resumeFile) {
        alert("Please upload your resume.");
        return;
    }

    try {
        // Upload the resume to Firebase Storage
        const storageRef = ref(storage, `resumes/${resumeFile.name}`);
        await uploadBytes(storageRef, resumeFile);

        // Get the download URL
        const resumeURL = await getDownloadURL(storageRef);

        // Create a new document in the "Applications" collection
        // Use a combination of jobId and applicantId for unique identification
        const applicationRef = doc(collection(db, "Applications"), `${jobId}_${applicantId}`);

        // Add the application data to the document
        await setDoc(applicationRef, {
            ...applicantData,
            resumeURL,
            jobId,       // Reference to the specific job
            applicantId, // Reference to the applicant
            userId,
            appliedAt: new Date(),
        });


        alert("Application submitted successfully!");
        document.querySelector(".apply-job").style.display = "none"; // Hide the application form after submission
    } catch (error) {
        console.error("Error submitting job application: ", error);
        alert("Failed to submit the application. Please try again.");
    }
}

window.closeModal = function () {
    document.querySelector(".apply-job").style.display = "none";
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