import { auth, storage, db, signOut, getDoc, doc, onAuthStateChanged, getDocs, collection, query, where } from "./utils/utils.js";

console.log("user =>", auth)
console.log("db =>", db)
console.log("storage =>", storage)

const profileAvatar = document.getElementById("profile-avatar");
const mainlogin = document.getElementById("mainlogin");
const userImg = document.getElementById("userImage");
const img_green_dot = document.getElementById("img_green_dot");
const logoutButton = document.getElementById("logoutBtn");
const addProduct = document.getElementById("addProduct");
const myProduct = document.getElementById("myProduct")
const product_card_container = document.getElementById("product_card_container")
const userProfileDropdown = document.getElementById("userProfileDropdown");
const searchForm = document.getElementById("searchForm");
const searchQuery = document.getElementById("searchQuery");

document.addEventListener('DOMContentLoaded', () => {
  const userImage = document.getElementById('userImage');
  const userDropdown = document.getElementById('userDropdown');

  userImage.addEventListener('click', () => {
      userDropdown.classList.toggle('hidden');
  });

  document.addEventListener('click', (event) => {
      if (!userImage.contains(event.target) && !userDropdown.contains(event.target)) {
          userDropdown.classList.add('hidden');
      }
  });
});

getAllProducts();

mainlogin.addEventListener("click", () => {
  window.location.href = "auth/login/login.html"
})

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    mainlogin.style.display = "none";
    userImg.style.display = "inline-block"
    img_green_dot.style.display = "inline-block"
    getUserInfo(uid);
  } else {
    userProfileDropdown.style.display = "none"
    mainlogin.style.display = "inline-block"
    userImg.style.display = "none"
    img_green_dot.style.display = "none"
    addProduct.style.display = "none"
    myProduct.style.display = "none"
    logoutButton.style.display = "none"
  }
});


const handleLogout = () => {
  auth.signOut().then(() => {
      console.log("User signed out.");
  }).catch((error) => {
      console.error("Sign out error:", error);
  });
};

logoutButton.addEventListener('click', handleLogout);


function getUserInfo(uid) {
  const userRef = doc(db, "users", uid);
  getDoc(userRef).then((doc) => {
      if (doc.exists()) {
          const userData = doc.data();
          document.getElementById('userName').textContent = userData.fullName;
          document.getElementById('userEmail').textContent = userData.email;
          userImg.src = userData.img;
      } else {
          console.log("No such document!");
      }
  }).catch((error) => {
      console.error("Error getting user document:", error);
  });
}


async function getAllProducts() {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    product_card_container.innerHTML = "";
    querySnapshot.forEach((doc) => {
      const product = doc.data();
      renderProduct(product);
    });
  } catch (err) {
    alert(err);
  }
}

function renderProduct(product) {
  const { img, productName, productDesce, productPrice, productCategory } = product;
  const productCard = `<div class="bg-white shadow-md rounded-lg overflow-hidden w-full md:w-1/2 lg:w-1/3 xl:w-1/4 mb-4 m-5">
    <img src="${img}" alt="${productName} Image" class="w-full h-48 object-cover" />
    <div class="p-4">
        <h2 class="text-xl font-bold mb-2">${productName}</h2>
        <p class="text-gray-600 mb-2"><b>Description</b>: ${productDesce}</p>
        <p class="text-gray-600 mb-2"><b>Category</b>: ${productCategory}</p>
        <p class="text-gray-600 mb-2"><b>Price</b>: ${productPrice}</p>
        <div class="flex justify-between items-center">
            <button class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none">Add To Cart</button>
        </div>
    </div>
  </div>`;
  product_card_container.innerHTML += productCard;
}

searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const queryText = searchQuery.value.trim().toLowerCase();
  if (queryText) {
    await searchProducts(queryText);
  }
});

async function searchProducts(queryText) {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    product_card_container.innerHTML = "";
    let foundResults = false; // Flag to track if any products are found

    querySnapshot.forEach((doc) => {
      const product = doc.data();
      if (
        product.productName.toLowerCase().includes(queryText) ||
        product.productDesce.toLowerCase().includes(queryText) ||
        product.productCategory.toLowerCase().includes(queryText)
      ) {
        renderProduct(product);
        foundResults = true; // Set flag to true if a matching product is found
      }
    });

    // If no products are found, display a message
    if (!foundResults) {
      product_card_container.innerHTML = `<div class="text-center text-gray-600 py-4">No products found for '${queryText}'.</div>`;
    }

  } catch (err) {
    alert(err);
  }
}






