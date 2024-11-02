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
    await loadApplications();

});

async function displayUserInfo(sessionData) {
    const docId = sessionData.name;
    const userDocRef = doc(db, "JobSeeker", docId);

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


async function loadApplications() {
    const applicationsContainer = document.getElementById("applicationsContainer");
    const noApplicationsMessage = document.getElementById("noApplicationsMessage");

    // Assume you have a function to get the current user's applicantId
    const sessionData = getUserSession();
    const applicantId = sessionData.userId; // Implement this function based on your auth logic

    try {
        // Fetch applications for the current user
        const applicationsQuery = query(collection(db, "Applications"), where("applicantId", "==", applicantId));
        const querySnapshot = await getDocs(applicationsQuery);

        // Clear the loading message
        noApplicationsMessage.style.display = 'none';
        applicationsContainer.innerHTML = "";

        if (querySnapshot.empty) {
            const noAppsMessage = document.createElement("p");
            noAppsMessage.innerHTML = `<h2>You have no applications yet.</h2>`;
            applicationsContainer.appendChild(noAppsMessage);
            return;
        }


        for (const doc of querySnapshot.docs) {
            const applicationData = doc.data();
            const jobId = applicationData.jobId; // Get the jobId to fetch job details
            const applicationId = doc.id; // Get unique applicationId

            const applicationCard = document.createElement("div");
            applicationCard.className = "application-card";
            applicationCard.innerHTML = `
                <h2>Job Title: <span>${applicationData.jobId || 'N/A'}</span></h2>
                <p>Application Status: <span>${applicationData.status || 'N/A'}</span></p>
                <p>Applied On: <span>${new Date(applicationData.appliedAt.seconds * 1000).toLocaleString() || 'N/A'}</span></p>
                <p>Applicant Name: <span>${applicationData.name || 'N/A'}</span></p>
                <p>Email: <span>${applicationData.email || 'N/A'}</span></p>
                <button type="button" onclick="ViewDetails('${applicationId}')">View Details</button>
            `;

            applicationsContainer.appendChild(applicationCard);
        }



    } catch (error) {
        console.error("Error loading applications: ", error);
    }
}


window.ViewDetails = async function (applicantId) {
    const applicantDetailsContainer = document.getElementById("applicantDetailsContainer");
    const modal = document.getElementById("applicantDetailsModal");
    applicantDetailsContainer.innerHTML = "<h2>Loading...</h2>";
    modal.style.display = "flex"; // Show the modal

    try {
        console.log("Fetching details for applicantId:", applicantId); // Debug applicantId

        // Fetch the application document directly using applicantId
        const applicationDoc = await getDoc(doc(db, "Applications", applicantId));

        if (!applicationDoc.exists()) {
            applicantDetailsContainer.innerHTML = `<p>No application found for this applicant.</p>`;
            return;
        }

        const applicationData = applicationDoc.data();
        const jobId = applicationData.jobId;
        console.log("Job ID:", jobId);

        // Fetch the job details using the jobId
        const jobDoc = await getDoc(doc(db, "JobPostings", jobId));
        const jobData = jobDoc.exists() ? jobDoc.data() : {};
        // Clear previous details to avoid duplication
        applicantDetailsContainer.innerHTML = "";

        // Display the applicant and job details in an overlay
        const detailsCard = document.createElement("div");
        detailsCard.className = "details-card";
        detailsCard.innerHTML = `
            <h2>Application Details for: <span>${applicationData.name || 'N/A'}</span></h2>
            <p>Applicant ID: <span>${applicationData.applicantId || 'N/A'}</span></p>
            <p>Email: <span>${applicationData.email || 'N/A'}</span></p>
            <p>Phone: <span>${applicationData.phone || 'N/A'}</span></p>
            <p>LinkedIn: <span>${applicationData.linkedin || 'N/A'}</span></p>
            <p>Portfolio: <span>${applicationData.portfolio || 'N/A'}</span></p>
            <p>Cover Letter: <span>${applicationData.coverLetter || 'N/A'}</span></p>
            <p>Resume: <a href="${applicationData.resumeURL || '#'}" target="_blank">View Resume</a></p>
            <p>Job Title: <span>${jobData.jobTitle || 'N/A'}</span></p>
            <p>Application Status: <span>${applicationData.status || 'N/A'}</span></p>
            <p>Applied On: <span>${new Date(applicationData.appliedAt.seconds * 1000).toLocaleString() || 'N/A'}</span></p>
        `;

        applicantDetailsContainer.appendChild(detailsCard);

    } catch (error) {
        console.error("Error retrieving applicant details:", error);
        applicantDetailsContainer.innerHTML = `<p>Error loading details. Please try again later.</p>`;
    }
}




window.closeModal = function () {
    const modal = document.getElementById("applicantDetailsModal");
    modal.style.display = "none"; // Hide the modal
}

// Close the modal when clicking outside of the modal content
window.onclick = function (event) {
    const modal = document.getElementById("applicantDetailsModal");
    if (event.target === modal) {
        modal.style.display = "none"; // Hide the modal
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