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

    const tbody = document.querySelector('#applicationsTable tbody');
    tbody.innerHTML = '<h2> Loading...</h2>';

    await displayUserInfo(sessionData);
    await fetchKeyMetrics();
    await fetchApplicationsOverTime();
    await fetchApplicationsByStatus();
    await fetchApplicationsTable();
});

async function displayUserInfo(sessionData) {
    const docId = sessionData.name;
    const userDocRef = doc(db, "users", docId);

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



async function fetchKeyMetrics() {

    const applicationsRef = collection(db, 'Applications');
    const interviewsRef = collection(db, 'Interviews');

    let totalApplications;
    let applicationsInProgress = 0;
    let hiredCandidates = 0;
    let rejectedCandidates = 0;

    try {
        const applicationsSnapshot = await getDocs(applicationsRef);
        totalApplications = applicationsSnapshot.size;
        console.log(totalApplications);


        applicationsSnapshot.forEach(doc => {
            const data = doc.data();

            if (data.status === "In Progress") applicationsInProgress++;
            else if (data.status === "offered") hiredCandidates++;
            else if (data.status === "rejected") rejectedCandidates++;
        });

        // Update key metrics in the dashboard
        document.getElementById('totalApplications').textContent = totalApplications;
        document.getElementById('applicationsInProgress').textContent = applicationsInProgress;
        document.getElementById('hiredCandidates').textContent = hiredCandidates;
        document.getElementById('rejectedCandidates').textContent = rejectedCandidates;
    } catch (error) {
        console.error("Error fetching metrics:", error);
    }
}


// Fetch and display applications table
async function fetchApplicationsTable() {
    const applicationsRef = collection(db, 'Applications');
    const tbody = document.querySelector('#applicationsTable tbody');
    tbody.innerHTML = ''; // Clear existing rows

    try {
        const snapshot = await getDocs(applicationsRef);
        snapshot.forEach(doc => {
            const data = doc.data();
            const row = document.createElement('tr');
            row.innerHTML = `
        <td>${data.applicantId || 'N/A'}</td>
        <td>${data.jobId || 'N/A'}</td>
        <td>${data.source || 'N/A'}</td>
        <td>${data.appliedAt.toDate().toLocaleDateString() || 'N/A'}</td>
        <td>${data.status || 'N/A'}</td>
        <td><button class="view-details" onclick="viewDetails('${doc.id}')">View Details</button></td>
      `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching applications:", error);
    }
}

// Initialize Firestore and Chart.js
const ctxApplicationsByStatus = document.getElementById('applicationsByStatusChart').getContext('2d');

async function fetchApplicationsByStatus() {
    const applicationsRef = collection(db, 'Applications');
    let statusCounts = {
        Applied: 0,
        "In Progress": 0,
        offered: 0,
        rejected: 0,
    };

    try {
        const applicationsSnapshot = await getDocs(applicationsRef);

        applicationsSnapshot.forEach(doc => {
            const data = doc.data();

            const status = data.status;
            // Dynamically add new status if it doesn't exist
            if (!statusCounts[status]) {
                statusCounts[status] = 0;
            }
            statusCounts[status]++;
        });


        console.log(statusCounts);


        // Update the chart with dynamic data
        const applicationsByStatusChart = new Chart(ctxApplicationsByStatus, {
            type: 'bar',
            data: {
                labels: ['New', 'In Progress', 'Hired', 'Rejected'],
                datasets: [{
                    label: 'Applications by Status',
                    data: [
                        statusCounts['Applied'],
                        statusCounts['In Progress'],
                        statusCounts['offered'],
                        statusCounts['rejected']
                    ],
                    backgroundColor: '#007bff',
                    borderRadius: 5,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: {
                            display: false,
                        },
                        ticks: {
                            color: '#6c757d',
                        },
                    },
                    y: {
                        grid: {
                            color: '#e9ecef',
                        },
                        ticks: {
                            color: '#6c757d',
                        },
                    },
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                },
            },
        });

    } catch (error) {
        console.error("Error fetching applications by status:", error);
    }
}

// Reference to the canvas for applications over time chart
const ctxApplicationsOverTime = document.getElementById('applicationsOverTimeChart').getContext('2d');

// Generate random dates within a specific range
function getRandomDate(startDate, endDate) {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    return new Date(start + Math.random() * (end - start)).toISOString().split('T')[0]; // Return only the date part
}

// Fetch applications and assign random dates
async function fetchApplicationsOverTime() {
    const applicationsRef = collection(db, 'Applications');
    let applicationsByDate = {};

    try {
        const snapshot = await getDocs(applicationsRef);

        // Assign each application a random date and count occurrences
        snapshot.forEach(doc => {
            const randomDate = getRandomDate('2024-08-01', '2024-08-31');

            if (!applicationsByDate[randomDate]) {
                applicationsByDate[randomDate] = 0;
            }
            applicationsByDate[randomDate]++;
        });

        // Prepare data for the chart
        const labels = Object.keys(applicationsByDate).sort(); // Dates sorted in ascending order
        const data = labels.map(date => applicationsByDate[date]);

        // Create the line chart
        const applicationsOverTimeChart = new Chart(ctxApplicationsOverTime, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Applications Over Time',
                    data: data,
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0, 123, 255, 0.2)',
                    borderWidth: 2,
                    pointBackgroundColor: '#007bff',
                    pointBorderColor: '#fff',
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: {
                            display: false,
                        },
                        ticks: {
                            color: '#6c757d',
                        },
                    },
                    y: {
                        grid: {
                            color: '#e9ecef',
                        },
                        ticks: {
                            color: '#6c757d',
                        },
                    },
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                },
            },
        });

    } catch (error) {
        console.error("Error fetching applications data:", error);
    }
}


window.viewDetails = async function (applicantId) {
    document.getElementById('applicationDetailsModal').style.display = 'flex'; // Show the modal

    try {
        // 1. Fetch application details
        const applicationRef = doc(db, 'Applications', applicantId);
        const applicationSnapshot = await getDoc(applicationRef);

        if (applicationSnapshot.exists()) {
            const applicationData = applicationSnapshot.data();

            // Populate application info
            document.getElementById('applicantName').textContent = applicationData.name || 'N/A';
            document.getElementById('positionApplied').textContent = applicationData.jobId || 'N/A';
            document.getElementById('source').textContent = applicationData.source || 'N/A';
            document.getElementById('dateApplied').textContent = applicationData.appliedAt.toDate() || 'N/A';
            document.getElementById('currentStatus').textContent = applicationData.status || 'N/A';
        }

        // 2. Fetch status history from interviews collection
        const interviewsRef = collection(db, 'Interview');
        const interviewsQuery = query(interviewsRef, where('applicantId', '==', applicantId));
        const interviewsSnapshot = await getDocs(interviewsQuery);

        const statusHistoryTable = document.getElementById('statusHistory').getElementsByTagName('tbody')[0];
        statusHistoryTable.innerHTML = ''; // Clear any existing rows

        if (interviewsSnapshot.empty) {
            // No interviews found, add a row indicating no data
            const noDataRow = document.createElement('tr');
            noDataRow.innerHTML = `
                <td colspan="3">No interviews scheduled.</td>
            `;
            statusHistoryTable.appendChild(noDataRow);
        } else {
            interviewsSnapshot.forEach(doc => {
                const interviewData = doc.data();

                // Create a new row element
                const row = document.createElement('tr');
                // Set the inner HTML of the row with interview data
                row.innerHTML = `
                    <td>${interviewData.interviewDate || 'N/A'}</td>
                    <td>${interviewData.status || 'Interview Scheduled'}</td>
                    <td>${interviewData.notes || 'No additional notes'}</td>
                `;

                // Append the new row to the status history table
                statusHistoryTable.appendChild(row);
            });

        }

        } catch (error) {
            console.error("Error fetching application details:", error);
        }
    }


document.getElementById('closeModalButton').addEventListener('click', function () {
        document.getElementById('applicationDetailsModal').style.display = 'none'; // Hide the modal
    });

    // Optionally, close the modal when clicking outside the modal content
    document.getElementById('applicationDetailsModal').addEventListener('click', function (e) {
        if (e.target === this) {
            this.style.display = 'none'; // Hide the modal if clicking outside of it
        }
    });



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