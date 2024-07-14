import { auth, db, storage, onAuthStateChanged, doc , getDoc,} from "./utils/utils.js";

console.log("user =>", auth)
console.log("db =>", db)
console.log("storage =>", storage)

const profileAvatar = document.getElementById("profile-avatar");
const mainlogin = document.getElementById("mainlogin");
const userImg = document.getElementById("userImg");
const img_green_dot = document.getElementById("img_green_dot");

mainlogin.addEventListener("click", ()=>{
  window.location.href = "auth/login/login.html"
})
onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      const uid = user.uid;
      mainlogin.style.display = "none";
      userImg.style.display = "inline-block"
      img_green_dot.style.display = "inline-block"
      getUserInfo(uid);
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
    window.location.href = '/auth/login/login.html';
}).catch((error) => {
    console.error("Sign out error:", error);
})});


function getUserInfo(uid) {
  const userRef = doc(db, "users", uid);
  getDoc(userRef).then((data) => {
    console.log("data==>", data.id);
    console.log("data==>", data.data());
    userImg.src = data.data()?.img;
    
  });
}

