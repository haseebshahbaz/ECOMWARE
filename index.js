
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

// Ensure `addToCart` is accessible globally
window.addToCart = async function(productId) {
  console.log("addToCart called with productId:", productId);
  const addToCartBtn = document.getElementById("addToCartBtn");
  addToCartBtn.disabled = true;
  addToCartBtn.innerText = "Adding"
  const user = auth.currentUser;
  if (!user) {
    alert("You need to be logged in to add products to the cart.");
    return;
  }

  const productRef = doc(db, "products", productId);
  const productDoc = await getDoc(productRef);

  if (productDoc.exists()) {
    const product = productDoc.data();
    const cartRef = doc(db, "carts", user.uid);
    const cartDoc = await getDoc(cartRef);

    if (cartDoc.exists()) {
      await updateDoc(cartRef, {
        products: arrayUnion({...product, id: productId, quantity: 1}),
      });
    } else {
      await setDoc(cartRef, {
        userId: user.uid,
        products: [{...product, id: productId, quantity: 1}],
      });
    }
    alert("Product added to cart!");
    addToCartBtn.innerText = "Added"
    getCartItemsCount();
  } else {
    alert("Product not found.");
  }
};

// window.addToCart = async function(productId) {
//   console.log("addToCart called with productId:", productId);

//   // Find the button by ID and ensure it's present
//   const addToCartBtn = document.getElementById("addToCartBtn");
//   if (!addToCartBtn) {
//     console.error("Button element with ID 'addToCartBtn' not found.");
//     return;
//   }

//   // Disable the button and set the text to "Adding..."
//   addToCartBtn.disabled = true;
//   addToCartBtn.innerText = "Adding...";

//   const user = auth.currentUser;
//   if (!user) {
//     alert("You need to be logged in to add products to the cart.");
//     addToCartBtn.disabled = false;
//     addToCartBtn.innerText = "Add to Cart";
//     return;
//   }

//   try {
//     const productRef = doc(db, "products", productId);
//     const productDoc = await getDoc(productRef);

//     if (!productDoc.exists()) {
//       alert("Product not found.");
//       addToCartBtn.innerText = "Add to Cart";
//       return;
//     }

//     const product = productDoc.data();
//     const cartRef = doc(db, "carts", user.uid);
//     const cartDoc = await getDoc(cartRef);

//     let products;
//     if (cartDoc.exists()) {
//       products = cartDoc.data().products || [];
//       const productIndex = products.findIndex(item => item.id === productId);

//       if (productIndex > -1) {
//         // Product already in cart, update quantity
//         products[productIndex].quantity = (products[productIndex].quantity || 1) + 1;
//         await updateDoc(cartRef, { products });
//       } else {
//         // Add new product to cart
//         products.push({ ...product, id: productId, quantity: 1 });
//         await updateDoc(cartRef, { products });
//       }
//     } else {
//       // Create a new cart with the product
//       products = [{ ...product, id: productId, quantity: 1 }];
//       await setDoc(cartRef, { userId: user.uid, products });
//     }

//     alert("Product added to cart!");
//     addToCartBtn.innerText = "Added";
//   } catch (error) {
//     console.error("Error adding to cart: ", error);
//     alert("There was an error adding the product to the cart. Please try again.");
//     addToCartBtn.innerText = "Add to Cart";
//   } finally {
//     // Ensure the button is re-enabled if not already set to "Added"
//     if (addToCartBtn.innerText !== "Added") {
//       addToCartBtn.innerText = "Add to Cart";
//     }
//     addToCartBtn.disabled = false;
//   }
// };





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

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    mainlogin.style.display = "none";
    userImg.style.display = "inline-block";
    img_green_dot.style.display = "inline-block";
    getUserInfo(uid);
    getCartItemsCount(); // Ensure cart count is fetched on login
  } else {
    userProfileDropdown.style.display = "none";
    mainlogin.style.display = "inline-block";
    userImg.style.display = "none";
    img_green_dot.style.display = "none";
    addProduct.style.display = "none";
    myProduct.style.display = "none";
    logoutButton.style.display = "none";
    updateCartCount(0); // Reset cart count if user is logged out
  }
});

const handleLogout = () => {
  signOut(auth).then(() => {
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
      product.id = doc.id; // Add the product ID to the product object
      renderProduct(product);
    });
  } catch (err) {
    alert(err);
  }
}

function renderProduct(product) {
  const { img, productName, productDesce, productPrice, productCategory, id } = product;
  const productCard = `<div class="bg-white shadow-md rounded-lg overflow-hidden w-full md:w-1/2 lg:w-1/3 xl:w-1/4 mb-4 m-5">
    <img src="${img}" alt="${productName} Image" class="w-full h-48 object-cover" />
    <div class="p-4">
        <h2 class="text-xl font-bold mb-2">${productName}</h2>
        <p class="text-gray-600 mb-2"><b>Description</b>: ${productDesce}</p>
        <p class="text-gray-600 mb-2"><b>Category</b>: ${productCategory}</p>
        <p class="text-gray-600 mb-2"><b>Price</b>: ${productPrice}</p>
        <div class="flex justify-between items-center">
            <button id="addToCartBtn" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none" onclick='addToCart("${id}")'>Add To Cart</button>
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
