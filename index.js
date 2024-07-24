import {
  auth,
  db,
  signOut,
  getDoc,
  doc,
  onAuthStateChanged,
  getDocs,
  collection,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "./utils/utils.js";

console.log("user =>", auth);
console.log("db =>", db);


const profileAvatar = document.getElementById("profile-avatar");
const mainlogin = document.getElementById("mainlogin");
const userImg = document.getElementById("userImage");
const img_green_dot = document.getElementById("img_green_dot");
const logoutButton = document.getElementById("logoutBtn");
const addProduct = document.getElementById("addProduct");
const myProduct = document.getElementById("myProduct");
const product_card_container = document.getElementById("product_card_container");
const userProfileDropdown = document.getElementById("userProfileDropdown");
const searchForm = document.getElementById("searchForm");
const searchQuery = document.getElementById("searchQuery");
const productsSection = document.getElementById("productsSection");
const mainsSignUp = document.getElementById("mainsSignUp");

// Ensure `addToCart` is accessible globally
window.addToCart = async function(productId) {
  console.log("addToCart called with productId:", productId);
  const addToCartBtn = document.getElementById(`addToCartBtn-${productId}`);
  addToCartBtn.disabled = true;
  addToCartBtn.innerText = "Adding...";
  addToCartBtn.classList.add("bg-gray-500", "cursor-not-allowed");

  const user = auth.currentUser;
  if (!user) {
    alert("You need to be logged in to add products to the cart.");
    addToCartBtn.disabled = false;
    addToCartBtn.innerText = "Add to Cart";
    addToCartBtn.classList.remove("bg-gray-500", "cursor-not-allowed");
    return;
  }

  try {
    const productRef = doc(db, "products", productId);
    const productDoc = await getDoc(productRef);

    if (productDoc.exists()) {
      const product = productDoc.data();
      const cartRef = doc(db, "carts", user.uid);
      const cartDoc = await getDoc(cartRef);

      if (cartDoc.exists()) {
        await updateDoc(cartRef, {
          products: arrayUnion({ ...product, id: productId, quantity: 1 }),
        });
      } else {
        await setDoc(cartRef, {
          userId: user.uid,
          products: [{ ...product, id: productId, quantity: 1 }],
        });
      }

      
      addToCartBtn.innerText = "Added";
      addToCartBtn.classList.remove("bg-gray-500", "cursor-not-allowed");
      addToCartBtn.classList.add("bg-green-500");
      getCartItemsCount();
    } else {
      alert("Product not found.");
      addToCartBtn.disabled = false;
      addToCartBtn.innerText = "Add to Cart";
      addToCartBtn.classList.remove("bg-gray-500", "cursor-not-allowed");
    }
  } catch (error) {
    console.error("Error adding to cart: ", error);
    alert("There was an error adding the product to the cart. Please try again.");
    addToCartBtn.disabled = false;
    addToCartBtn.innerText = "Add to Cart";
    addToCartBtn.classList.remove("bg-gray-500", "cursor-not-allowed");
  }
};

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
  window.location.href = "auth/login/login.html";
});

mainsSignUp.addEventListener("click", () => {
  window.location.href = "auth/signup/signup.html";
});

// Call getAllProducts inside onAuthStateChanged to ensure products are loaded based on user state
onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    mainlogin.style.display = "none";
    mainsSignUp.style.display = "none";
    userImg.style.display = "inline-block";
    img_green_dot.style.display = "inline-block";
    getUserInfo(uid);
    getCartItemsCount(); // Ensure cart count is fetched on login
  } else {
    userProfileDropdown.style.display = "none";
    mainlogin.style.display = "inline-block";
    mainsSignUp.style.display = "inline-block";
    userImg.style.display = "none";
    img_green_dot.style.display = "none";
    addProduct.style.display = "none";
    myProduct.style.display = "none";
    logoutButton.style.display = "none";
    updateCartCount(0); // Reset cart count if user is logged out
  }
  getAllProducts(); // Ensure products are re-rendered based on user state
});

// Function to handle logout
const handleLogout = () => {
  signOut(auth).then(() => {
    console.log("User signed out.");
    updateCartCount(0); // Reset cart count on logout
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
    const user = auth.currentUser;
    let userCartProducts = [];

    if (user) {
      const cartRef = doc(db, "carts", user.uid);
      const cartDoc = await getDoc(cartRef);
      if (cartDoc.exists()) {
        userCartProducts = cartDoc.data().products.map(product => product.id);
      }
    }

    product_card_container.innerHTML = "";
    querySnapshot.forEach((doc) => {
      const product = doc.data();
      product.id = doc.id; // Add the product ID to the product object
      renderProduct(product, userCartProducts.includes(product.id));
    });
  } catch (err) {
    alert(err);
  }
}

function renderProduct(product, isInCart) {
  const { img, productName, productDesce, productPrice, productCategory, id } = product;
  const buttonText = isInCart ? "Added" : "Add to Cart";
  const buttonClass = isInCart ? "bg-green-500" : "bg-blue-500";
  const buttonDisabled = isInCart ? "disabled" : "";

  const productCard = `<div class="product-card bg-white rounded-lg shadow-lg p-2 text-center flex flex-col justify-between">
            <img class="w-full h-48 object-cover mb-4 rounded-t-lg" src="${img}" alt="${productName}">
            <div>
                <h2 class="text-xl font-bold mb-2">${productName}</h2>
                <p class="text-gray-700 mb-4">${productDesce}.</p>
                <p class="text-blue-500 font-bold mb-4">Rs: ${productPrice}</p>
            </div>
            <div class="flex justify-center mt-2">
                <button id="addToCartBtn-${id}" class="${buttonClass} text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none transition duration-300" ${buttonDisabled} onclick='addToCart("${id}")'>${buttonText}</button>
            </div>
        </div>`
  
  const container = document.getElementById('product_card_container');
  if (!container.classList.contains('container')) {
      container.classList.add('container', 'mx-auto', 'p-4', 'flex', 'flex-wrap', '-mx-2');
  }
  container.innerHTML += productCard;
}


searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const queryText = searchQuery.value.trim().toLowerCase();
  if (queryText) {
      await searchProducts(queryText);
      scrollToProducts();
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

function scrollToProducts() {
  productsSection.scrollIntoView({ behavior: 'smooth' });
}


// Function to update cart count in the navbar
function updateCartCount(count) {
  const cartCountElement = document.getElementById("cart-count");
  cartCountElement.textContent = count;
}

// Function to get cart items count
async function getCartItemsCount() {
  const user = auth.currentUser;
  if (!user) return;

  const cartRef = doc(db, "carts", user.uid);
  const cartDoc = await getDoc(cartRef);

  if (cartDoc.exists()) {
    const products = cartDoc.data().products;
    updateCartCount(products.length);
  } else {
    updateCartCount(0);
  }
}

// Event listener for cart icon click
document.getElementById("cart-icon").addEventListener("click", () => {
  window.location.href = "./my cart/cart.html";
});

// Initialize cart count on page load
document.addEventListener("DOMContentLoaded", () => {
  getCartItemsCount();
});
