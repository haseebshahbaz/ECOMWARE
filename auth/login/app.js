import { auth, getAuth, signInWithEmailAndPassword } from "../../utils/utils.js";


const login_btn = document.getElementById("login_btn");
const login_submit = document.getElementById("login_submit");
const mainlogin = document.getElementById("mainlogin");


login_btn.addEventListener("submit", function (e) {
    e.preventDefault();
    console.log(e)
    const email = e.target[0].value;
    const password = e.target[1].value;
    
    login_submit.disable = true;
    login_submit.innerText = "Loading..."
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        
        window.location.href = "/"
        
        
        // ...
      })
      .catch((error) => {
        login_submit.disable = false;
        login_submit.innerText = "Sign in"

        const errorMessage = document.getElementById("error-message");
        errorMessage.innerText = "Incorrect Creditionals";
      });
});

