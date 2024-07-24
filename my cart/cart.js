import {
  auth,
  db,
  getDoc,
  doc,
  updateDoc,
  onAuthStateChanged
} from "../utils/utils.js";

const cartContainer = document.getElementById("cart-container");
const cartSummary = document.getElementById("cart-summary");
const emptyCartMessage = document.getElementById("empty-cart-message"); // Add this to your HTML

onAuthStateChanged(auth, (user) => {
  if (user) {
    getCartItems(user.uid);
  } else {
    cartContainer.innerHTML = "<p class='text-center text-gray-600'>Please log in to view your cart.</p>";
    cartSummary.innerHTML = "";
    emptyCartMessage.classList.remove("hidden");
    cartContainer.classList.add("hidden");
    cartSummary.classList.add("hidden");
  }
});

async function getCartItems(uid) {
  const cartRef = doc(db, "carts", uid);
  const cartDoc = await getDoc(cartRef);

  if (cartDoc.exists()) {
    const products = cartDoc.data().products;
    if (products.length > 0) {
      renderCartItems(products);
      renderCartSummary(products);
      emptyCartMessage.classList.add("hidden");
      cartContainer.classList.remove("hidden");
      cartSummary.classList.remove("hidden");
    } else {
      cartContainer.innerHTML = "";
      cartSummary.innerHTML = "";
      emptyCartMessage.classList.remove("hidden");
      cartContainer.classList.add("hidden");
      cartSummary.classList.add("hidden");
    }
  } else {
    cartContainer.innerHTML = "";
    cartSummary.innerHTML = "";
    emptyCartMessage.classList.remove("hidden");
    cartContainer.classList.add("hidden");
    cartSummary.classList.add("hidden");
  }
}

function renderCartItems(products) {
  const html = products.map((product, index) => {
    const quantity = product.quantity || 1;
    return `
      <div class="flex flex-col sm:flex-row items-center bg-white p-4 mb-4 shadow rounded-lg">
        <img src="${product.img}" alt="${product.productName}" class="w-16 h-16 object-cover rounded-md mb-2 sm:mb-0 sm:mr-4">
        <div class="flex-grow mb-2 sm:mb-0">
          <h2 class="text-lg font-bold">${product.productName}</h2>
          <p class="text-gray-600">${product.productDesce}</p>
          <p class="text-gray-600"><b>Category</b>: ${product.productCategory}</p>
        </div>
        <div class="flex items-center mb-2 sm:mb-0">
          <button class="bg-gray-300 text-black px-2 py-1 rounded-l-md hover:bg-gray-400 focus:outline-none" onclick='decreaseQuantity(${index})'>-</button>
          <span class="px-4">${quantity}</span>
          <button class="bg-gray-300 text-black px-2 py-1 rounded-r-md hover:bg-gray-400 focus:outline-none" onclick='increaseQuantity(${index})'>+</button>
        </div>
        <div class="ml-4 text-center sm:text-right">
          <p class="text-lg font-bold">Rs${(product.productPrice * quantity).toFixed(2)}</p>
          <button class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none mt-2" onclick='removeFromCart(${index})'>Remove</button>
        </div>
      </div>`;
  }).join("");

  cartContainer.innerHTML = html;
}

function renderCartSummary(products) {
  const total = products.reduce((sum, product) => sum + (parseFloat(product.productPrice) * (product.quantity || 1)), 0);
  const totalItems = products.reduce((sum, product) => sum + (product.quantity || 1), 0);

  cartSummary.innerHTML = `<div class="flex flex-col sm:flex-row justify-between items-center">
    <p class="text-lg font-bold">Total Items: ${totalItems}</p>
    <p class="text-lg font-bold">Total Price: Rs${total.toFixed(2)}</p>
    <button id="checkoutButton" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none mt-4 sm:mt-0">Proceed to Checkout</button>
  </div>`;

  document.getElementById('checkoutButton').addEventListener('click', () => {
    window.location.href = '../checkout/checkout.html';
  });
}

window.removeFromCart = async function(index) {
  console.log(`removeFromCart called with index: ${index}`);
  const user = auth.currentUser;
  if (!user) return;

  const cartRef = doc(db, "carts", user.uid);
  const cartDoc = await getDoc(cartRef);

  if (cartDoc.exists()) {
    const products = cartDoc.data().products;
    products.splice(index, 1); // Remove the product at the given index

    await updateDoc(cartRef, { products: products });
    getCartItems(user.uid);
  }
};

window.increaseQuantity = async function(index) {
  console.log(`increaseQuantity called with index: ${index}`);
  const user = auth.currentUser;
  if (!user) return;

  const cartRef = doc(db, "carts", user.uid);
  const cartDoc = await getDoc(cartRef);

  if (cartDoc.exists()) {
    const products = cartDoc.data().products;
    const product = products[index];

    if (product) {
      console.log(`Current quantity: ${product.quantity || 1}`);
      products[index] = { ...product, quantity: (product.quantity || 1) + 1 };

      await updateDoc(cartRef, { products: products });
      getCartItems(user.uid);
    }
  }
};

window.decreaseQuantity = async function(index) {
  console.log(`decreaseQuantity called with index: ${index}`);
  const user = auth.currentUser;
  if (!user) return;

  const cartRef = doc(db, "carts", user.uid);
  const cartDoc = await getDoc(cartRef);

  if (cartDoc.exists()) {
    const products = cartDoc.data().products;
    const product = products[index];

    if (product && (product.quantity || 1) > 1) {
      console.log(`Current quantity: ${product.quantity || 1}`);
      products[index] = { ...product, quantity: (product.quantity || 1) - 1 };

      await updateDoc(cartRef, { products: products });
      getCartItems(user.uid);
    }
  }
};
