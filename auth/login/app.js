import { auth, getAuth, signInWithEmailAndPassword } from "../../utils/utils.js";


const login_btn = document.getElementById("login_btn");

login_btn.addEventListener("submit", function (e) {
    e.preventDefault();
    console.log(e)
    const email = e.target[0].value;
    const password = e.target[1].value;
    
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        // const user = userCredential.user;
        window.location.href = "/"
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
});

