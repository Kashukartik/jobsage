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
    const showName = document.getElementById('name');
    showName.innerHTML = '<h4> loading......</h4>'

    await displayUserInfo(sessionData);
    await fetchAndDisplayJobSeekerDetails();

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


function fetchAndDisplayJobSeekerDetails() {
    const sessionData = getUserSession();
    const jobSeekerId = sessionData.userId; // Assumes userId is stored in session
    console.log(jobSeekerId);
    
    // Reference to the specific document in the JobSeeker collection
    const jobSeekerRef = doc(db, 'Recruiter', jobSeekerId); // Use doc() to refer to the document

    // Fetch the document
    getDoc(jobSeekerRef).then((doc) => {
        if (doc.exists()) {
            const data = doc.data();

            // Update profile information using innerHTML
            document.getElementById('name').innerHTML = data.name || 'N/A';
            document.getElementById('job-title').innerHTML = data.position || 'N/A';
            document.getElementById('email').innerHTML = data.email || 'N/A';
            document.getElementById('phone').innerHTML = data.phone || 'N/A';

            // Update LinkedIn link
            const linkedinLink = document.getElementById('linkedin-link');
            linkedinLink.href = data.linkedin || '#';
            linkedinLink.innerHTML = data.linkedin ? 'LinkedIn Profile' : 'LinkedIn Profile (Not Provided)';

            // Update about section
            document.getElementById('about').innerHTML = data.about || 'No information provided.';

            // Update experience section
            document.getElementById('last-job-title').innerHTML = `${data.lastJobTitle || 'N/A'} at ${data.lastEmployer || 'N/A'}`;
            document.getElementById('years-experience').innerHTML = `${data.yearsExperience || 'N/A'} years`;

            // Update education section
            document.getElementById('education').innerHTML = `<strong>${data.highestDegree || 'N/A'}</strong><br>Institution: ${data.institution || 'N/A'}, Graduated: ${data.graduationYear || 'N/A'}`;

            // Update skills section
            const skillsSection = document.getElementById('skills-list');
            skillsSection.innerHTML = ''; // Clear existing skills
            const skills = data.skills ? data.skills.split(',') : [];
            skills.forEach(skill => {
                skillsSection.innerHTML += `<li>${skill.trim()}</li>`;
            });

            // Update languages section
            const languagesSection = document.getElementById('languages-list');
            languagesSection.innerHTML = ''; // Clear existing languages
            const languages = data.languages ? data.languages.split(',') : ['English (Fluent)'];
            languages.forEach(language => {
                languagesSection.innerHTML += `<li>${language.trim()}</li>`;
            });

        } else {
            console.log('No such document!');
        }
    }).catch((error) => {
        console.log('Error getting document:', error);
    });
}





function loadProfileForEditing() {
    const sessionData = getUserSession();
    const jobSeekerId = sessionData.userId; // Assumes userId is stored in session
    console.log(jobSeekerId);
    
    // Reference to the specific document in the JobSeeker collection
    const jobSeekerRef = doc(db, 'Recruiter', jobSeekerId);

    // Fetch the document
    getDoc(jobSeekerRef).then((doc) => {
        if (doc.exists()) {
            const data = doc.data();

            // Populate the edit fields
            document.getElementById('edit-name').value = data.name || '';
            document.getElementById('edit-job-title').value = data.position || '';
            document.getElementById('edit-email').value = data.email || '';
            document.getElementById('edit-phone').value = data.phone || '';
            document.getElementById('edit-linkedin').value = data.linkedin || '';
            document.getElementById('edit-about').value = data.about || '';
            document.getElementById('edit-last-job-title').value = data.lastJobTitle || '';
            document.getElementById('edit-last-employer').value = data.lastEmployer || '';
            document.getElementById('edit-years-experience').value = data.yearsExperience || '';
            document.getElementById('edit-highest-degree').value = data.highestDegree || '';
            document.getElementById('edit-institution').value = data.institution || '';
            document.getElementById('edit-graduation-year').value = data.graduationYear || '';
            document.getElementById('edit-skills').value = data.skills || '';
            document.getElementById('edit-languages').value = data.languages || '';
        } else {
            console.log('No such document!');
        }
    }).catch((error) => {
        console.log('Error getting document:', error);
    });
}

window.saveProfileChanges = function () {
    const sessionData = getUserSession();
    const jobSeekerId = sessionData.userId; // Assumes userId is stored in session

    // Collect updated data from the form
    const updatedData = {
        name: document.getElementById('edit-name').value,
        position: document.getElementById('edit-job-title').value,
        email: document.getElementById('edit-email').value,
        phone: document.getElementById('edit-phone').value,
        linkedin: document.getElementById('edit-linkedin').value,
        about: document.getElementById('edit-about').value,
        lastJobTitle: document.getElementById('edit-last-job-title').value,
        lastEmployer: document.getElementById('edit-last-employer').value,
        yearsExperience: document.getElementById('edit-years-experience').value,
        highestDegree: document.getElementById('edit-highest-degree').value,
        institution: document.getElementById('edit-institution').value,
        graduationYear: document.getElementById('edit-graduation-year').value,
        skills: document.getElementById('edit-skills').value,
        languages: document.getElementById('edit-languages').value,
    };

    // Reference to the specific document in the JobSeeker collection
    const jobSeekerRef = doc(db, 'Recruiter', jobSeekerId);

    // Update the document with the new data
    setDoc(jobSeekerRef, updatedData, { merge: true })
        .then(() => {
            console.log('Profile updated successfully!');
            // Optionally, redirect or refresh the page to show updated profile
            document.getElementById('edit-profile-overlay').style.display = 'none'; // Hide the overlay
            window.location.reload()
        })
        .catch((error) => {
            console.error('Error updating profile:', error);
        });
}



window.openEditProfile = function () {
    document.getElementById('edit-profile-overlay').style.display = 'flex'; // Use flex to center
}

window.closeEditProfile = function () {
    document.getElementById('edit-profile-overlay').style.display = 'none'; // Hide the overlay
}

window.editProfile = function () {
    loadProfileForEditing(); // Load the profile data
    openEditProfile();       // Then open the overlay
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