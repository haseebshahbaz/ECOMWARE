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
  
  onAuthStateChanged(auth, (user) => {
    if (user) {
      getCartItems(user.uid);
    } else {
      cartContainer.innerHTML = "<p>Please log in to view your cart.</p>";
      cartSummary.innerHTML = "";
    }
  });
  
  async function getCartItems(uid) {
    const cartRef = doc(db, "carts", uid);
    const cartDoc = await getDoc(cartRef);
  
    if (cartDoc.exists()) {
      const products = cartDoc.data().products;
      console.log('Retrieved products:', products); // Debugging statement
      renderCartItems(products);
      renderCartSummary(products);
    } else {
      cartContainer.innerHTML = "<p>Your cart is empty.</p>";
      cartSummary.innerHTML = "";
    }
  }
  
  function renderCartItems(products) {
    const html = products.map((product, index) => {
      const quantity = product.quantity || 1; // Default quantity is 1 if undefined
      return `<div class="flex items-center justify-between bg-white p-4 mb-4 shadow rounded-lg">
        <img src="${product.img}" alt="${product.productName}" class="w-16 h-16 object-cover rounded-md">
        <div class="flex-grow ml-4">
          <h2 class="text-lg font-bold">${product.productName}</h2>
          <p class="text-gray-600">${product.productDesce}</p>
          <p class="text-gray-600"><b>Category</b>: ${product.productCategory}</p>
        </div>
        <div class="flex items-center">
          <button class="bg-gray-300 text-black px-2 py-1 rounded-l-md hover:bg-gray-400 focus:outline-none" onclick='decreaseQuantity(${index})'>-</button>
          <span class="px-4">${quantity}</span>
          <button class="bg-gray-300 text-black px-2 py-1 rounded-r-md hover:bg-gray-400 focus:outline-none" onclick='increaseQuantity(${index})'>+</button>
        </div>
        <div class="ml-4">
          <p class="text-lg font-bold">Rs${(product.productPrice * quantity).toFixed(2)}</p>
          <button class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none mt-2" onclick='removeFromCart(${index})'>Remove</button>
        </div>
      </div>`;
    }).join("");
  
    console.log('Rendered HTML:', html); // Debugging statement
    cartContainer.innerHTML = html;
  }
  
  function renderCartSummary(products) {
    const total = products.reduce((sum, product) => sum + (parseFloat(product.productPrice) * (product.quantity || 1)), 0);
    const totalItems = products.reduce((sum, product) => sum + (product.quantity || 1), 0);
  
    cartSummary.innerHTML = `<div class="flex justify-between items-center">
      <p class="text-lg font-bold">Total Items: ${totalItems}</p>
      <p class="text-lg font-bold">Total Price: Rs${total.toFixed(2)}</p>
      <button class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none">Proceed to Checkout</button>
    </div>`;
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
  