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
    await loadInterviews();

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


async function loadInterviews() {
    const interviewsContainer = document.getElementById("interviewsContainer");

    const sessionData = getUserSession();
    const applicantId = sessionData.userId;

    console.log(applicantId);

    try {
        // Set up the query to filter interviews by applicantId
        const interviewsRef = collection(db, "Interview");
        const interviewsQuery = query(interviewsRef, where("applicantName", "==", applicantId));
        const interviewsSnapshot = await getDocs(interviewsQuery);

        // Clear previous data
        interviewsContainer.innerHTML = "";

        if (interviewsSnapshot.empty) {
            console.log(interviewsSnapshot.empty);

            interviewsContainer.innerHTML = `<p>No interviews found for this applicant.</p>`;
            return;
        }

        // Iterate over interview documents and display details
        interviewsSnapshot.forEach((doc) => {
            const interviewData = doc.data();

            // Create an interview detail card
            const interviewCard = document.createElement("div");
            interviewCard.className = "interview-card";
            interviewCard.innerHTML = `
                    <h2>Interview for: <span>${interviewData.jobId || 'N/A'}</span></h2> 
                    <p>Applicant Name: <span>${interviewData.applicantName || 'N/A'}</span></p>
                    <p>Scheduled Date: <span>${new Date(interviewData.interviewDate).toDateString() || 'N/A'}</span></p>
                    <p>Scheduled Time: <span>${interviewData.interviewTime.toLocaleString() || 'N/A'}</span></p>
                    <p>Interviewer: <span>${interviewData.interviewers[0] || 'N/A'}</span></p>
                    <p>Interview Mode: <span>${interviewData.interviewMode || 'N/A'}</span></p>
                    <p>Interview Location(if In-Person): <span>${interviewData.interviewLocation || 'N/A'}</span></p>
                    <p>Scheduled by Recruiter : <span>${interviewData.recruiterId || 'N/A'}</span></p>
                    <br>
                    <p>Status: <strong><span>${interviewData.status || 'N/A'}</span></strong></p>
                `;

            interviewsContainer.appendChild(interviewCard);
        });

    } catch (error) {
        console.error("Error loading interviews:", error);
        interviewsContainer.innerHTML = `<p>Error loading interview details. Please try again later.</p>`;
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