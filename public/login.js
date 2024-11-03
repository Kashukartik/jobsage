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


window.login = async function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Input validation
    if (!email || !password) {
        alert("Please fill in all fields");
        return;
    }

    try {
        // Query Firestore to find user by email
        const userRef = collection(db, "users");
        const querySnapshot = await getDocs(query(userRef, where("email", "==", email)));

        let userFound = false;
        let userRole = '';
        let noOfTime = 0;
        let userDocId;
        let userName;

        querySnapshot.forEach((doc) => {
            const userData = doc.data();
            // Match user with email and password
            if (userData.password === password) {
                userFound = true;
                userRole = userData.role;
                noOfTime = userData.noOfTime || 0;  // Default to 0 if undefined
                userDocId = doc.id; // Store document ID for updating
                userName = userData.name;

                // Save session if user is found
                saveUserSession(userData, userDocId); // Pass userDocId to the function

            }
        });

        if (userFound) {
            // Role-based redirection and noOfTime update
            if (userRole === 'job-seeker') {
                if (noOfTime === 0) {
                    noOfTime++;
                    await updateDoc(doc(db, "users", userDocId), { noOfTime });
                    alert(`Welcome ${userName}, Successfully logged in`);
                    window.location.href = "U_info_FORM.html";
                } else {
                    alert("You are being redirected to the Job Seeker Dashboard");
                    window.location.href = "U_dashboard.html";
                }
            } else if (userRole === 'recruiter') {
                if (noOfTime === 0) {
                    noOfTime++;
                    await updateDoc(doc(db, "users", userDocId), { noOfTime });
                    alert(`Welcome ${userName}, Successfully logged in`);
                    window.location.href = "R_info_FORM.html";
                } else {
                    alert("You are being redirected to the Recruiter Dashboard");
                    window.location.href = "R_dashboard.html";
                }
            } else if (userRole === 'admin') {
                alert(`Welcome Admin - ${userName}, Successfully logged in`);
                window.location.href = "Admin_dashboard.html";
            }
        } else {
            alert("Invalid email or password");
        }
    } catch (error) {
        console.error("Error logging in: ", error);
        alert("Error logging in. Please try again.");
    }
};

// Function to save user session
function saveUserSession(userData, userDocId) {
    // Create a session object
    const userSession = {
        userId: userDocId, // Use document ID as user ID
        email: userData.email,
        name: userData.name,
        role: userData.role,
    };

    // Store user session in sessionStorage
    sessionStorage.setItem('user', JSON.stringify(userSession));
    console.log('User session stored:', userSession);
}
