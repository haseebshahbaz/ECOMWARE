import { auth, db, storage, onAuthStateChanged } from "./utils/utils.js";

console.log("user =>", auth)
console.log("db =>", db)
console.log("storage =>", storage)

onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      const uid = user.uid;
      // ...
    } else {
      window.location.href = "/auth/login/login.html"
    }
  });
  

const logoutbutton = document.getElementById("logout-button");


logoutbutton.addEventListener("click", ()=>{
  auth.signOut().then(() => {
    console.log("User signed out.");
    // Redirect to login page or update UI accordingly
    window.location.href = '../../auth/login/login.html';
}).catch((error) => {
    console.error("Sign out error:", error);
})});




