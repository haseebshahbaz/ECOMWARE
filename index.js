import { auth,
  storage,
  db,
  signOut,
  getDoc,
  doc,
  onAuthStateChanged,
  getDocs,
  collection,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "./utils/utils.js";

console.log("user =>", auth)
console.log("db =>", db)
console.log("storage =>", storage)

const profileAvatar = document.getElementById("profile-avatar");
const mainlogin = document.getElementById("mainlogin");
const userImg = document.getElementById("userImg");
const img_green_dot = document.getElementById("img_green_dot");
const logoutButton = document.getElementById("logout-button");
const addProduct = document.getElementById("addProduct");
const myProduct = document.getElementById("myProduct")
const product_card_container = document.getElementById("product_card_container")

getAllProducts();

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
      // window.location.href = "/auth/login/login.html"
      mainlogin.style.display = "inline-block"
      userImg.style.display = "none"
      img_green_dot.style.display = "none"
      addProduct.style.display = "none"
      myProduct.style.display = "none"
      logoutButton.style.display = "none"
    }
  });
  

const logoutbutton = document.getElementById("logout-button");


logoutbutton.addEventListener("click", ()=>{
  auth.signOut().then(() => {
    console.log("User signed out.");
    
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


async function getAllProducts() {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    // events_cards_container.innerHTML = "";
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`);

      const product = doc.data();

      console.log("product=>", product);

      const { img, productName, productDesce, productPrice, createdBy, createdByEmail, productCategory } = product;
      console.log(productCategory);

      const productCard =  `<div class="bg-white shadow-md rounded-lg overflow-hidden w-full md:w-1/2 lg:w-1/3 xl:w-1/4 mb-4 m-5">
    <img
        src="${img}"
        alt="${productName} Image"
        class="w-full h-48 object-cover"
    />
    <div class="p-4">
        <h2 class="text-xl font-bold mb-2">${productName}</h2>
        <p class="text-gray-600 mb-2"><b>Description</b>: ${productDesce}</p>
        <p class="text-gray-600 mb-2"><b>Category</b>: ${productCategory}</p>
        <p class="text-gray-600 mb-2"><b>Creator</b>: ${createdByEmail}</p>
        <p class="text-gray-600 mb-2"><b>Price</b>: ${productPrice}</p>
        <div class="flex justify-between items-center">
            <button class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none">Add To Cart</button>
        </div>
    </div>
</div>`
      product_card_container.innerHTML += productCard;
      console.log(product);
    });
  } catch (err) {
    alert(err);
  }
}






