import {
  auth,
  createUserWithEmailAndPassword,
  doc,
  setDoc,
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  db,
} from "../../utils/utils.js";

const submit_btn = document.getElementById("submit_btn");

submit_btn.addEventListener("click", function (e) {
  e.preventDefault();

  const fullName = document.getElementById("fullName").value;
  const fatherName = document.getElementById("fatherName").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const img = document.getElementById("img").files[0];

  if (!fullName || !fatherName || !email || !password || !confirmPassword || !img) {
    alert("All fields are required.");
    return;
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  const userInfo = {
    fullName,
    fatherName,
    email,
    password,
    img,
  };

  submit_btn.disabled = true;
  submit_btn.innerText = "Loading...";

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("User signed up:", user.uid);

      const userRef = ref(storage, `user/${user.uid}`);
      
      uploadBytes(userRef, img)
        .then(() => {
          console.log("User image uploaded successfully");
          getDownloadURL(userRef)
            .then((url) => {
              userInfo.img = url;

              const userDocRef = doc(db, "users", user.uid);

              setDoc(userDocRef, userInfo)
                .then(() => {
                  console.log("User info saved to Firestore");
                  // Redirect to home page
                  window.location.href = "../../index.html";
                })
                .catch((error) => {
                  console.error("Error saving user info to Firestore:", error.message);
                  alert("Error saving user info to Firestore");
                });
            })
            .catch((error) => {
              console.error("Error getting download URL:", error.message);
              alert("Error getting download URL");
            });
        })
        .catch((error) => {
          console.error("Error uploading image:", error.message);
          alert("Error uploading image");
        });
    })
    .catch((error) => {
      console.error("Error signing up:", error.message);
      alert("Error signing up: " + error.message);
    })
    .finally(() => {
      // This part ensures the button state until the redirection
      // You can adjust the timing of the timeout as needed
      setTimeout(() => {
        submit_btn.disabled = false;
        submit_btn.innerText = "Sign Up";
      }, 20000); // Adjust the timeout as per your application's needs
    });
});

function togglePasswordVisibility(id) {
  const passwordInput = document.getElementById(id);
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
  } else {
    passwordInput.type = "password";
  }
}

// Add event listeners to toggle password visibility
document.getElementById('togglePassword').addEventListener('click', () => togglePasswordVisibility('password'));
document.getElementById('toggleConfirmPassword').addEventListener('click', () => togglePasswordVisibility('confirmPassword'));
