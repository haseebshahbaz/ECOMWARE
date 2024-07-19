import { auth, getUserProducts, onAuthStateChanged, deleteProduct, updateProduct } from '../utils/utils.js';

async function displayMyProducts(userId) {
  try {
    const products = await getUserProducts(userId);
    const myProductsContainer = document.getElementById('product_card_container');
    myProductsContainer.innerHTML = ''; // Clear previous products if any

    products.forEach((product) => {
      const productElement = document.createElement('div');
      productElement.className = 'bg-white shadow-md rounded-lg overflow-hidden w-full md:w-1/2 lg:w-1/3 xl:w-1/4 mb-2 m-5';
      productElement.innerHTML = `
        <img src="${product.img}" alt="Product Image" class="w-full h-48 object-cover" />
        <div class="p-4">
          <h2 class="text-xl font-bold mb-2">${product.productName}</h2>
          <p class="text-gray-600 mb-2"><b>Description</b>: ${product.productDesce}</p>
          <p class="text-gray-600 mb-2"><b>Category</b>: ${product.productCategory}</p>
          <p class="text-gray-600 mb-2"><b>Creator</b>: ${product.createdByEmail}</p>
          <p class="text-gray-600 mb-2"><b>Price</b>: ${product.productPrice}</p>
          <button data-product-id="${product.id}" class="updateProductButton bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600">Update</button>
          <button data-product-id="${product.id}" class="deleteProductButton bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">Delete</button>
        </div>`;
      myProductsContainer.appendChild(productElement);
    });

    // Add event listeners for delete buttons
    const deleteButtons = document.querySelectorAll('.deleteProductButton');
    deleteButtons.forEach(button => {
      button.addEventListener('click', async (e) => {
        const productId = e.target.getAttribute('data-product-id');
        await deleteProduct(productId);
        displayMyProducts(userId); // Refresh the product list
      });
    });

    // Add event listeners for update buttons
    const updateButtons = document.querySelectorAll('.updateProductButton');
    updateButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const productId = e.target.getAttribute('data-product-id');
        const product = products.find(p => p.id === productId);
        openUpdateModal(product);
      });
    });
  } catch (error) {
    console.error("Error displaying products: ", error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      displayMyProducts(user.uid);
    } else {
      console.log('User not logged in');
    }
  });
});

function openUpdateModal(product) {
  const updateModal = document.getElementById('updateModal');
  const updateProductId = document.getElementById('updateProductId');
  const updateProductName = document.getElementById('updateProductName');
  const updateProductDesce = document.getElementById('updateProductDesce');
  const updateProductPrice = document.getElementById('updateProductPrice');
  const updateProductCategory = document.getElementById('updateProductCategory');

  // Ensure these elements exist
  if (updateProductId && updateProductName && updateProductDesce && updateProductPrice && updateProductCategory) {
    updateProductId.value = product.id;
    updateProductName.value = product.productName;
    updateProductDesce.value = product.productDesce;
    updateProductPrice.value = product.productPrice;
    updateProductCategory.value = product.productCategory;

    updateModal.style.display = 'block';

    document.getElementById('saveProductBtn').onclick = async () => {
      const updatedData = {
        productName: updateProductName.value,
        productDesce: updateProductDesce.value,
        productPrice: updateProductPrice.value,
        productCategory: updateProductCategory.value,
      };
      await updateProduct(product.id, updatedData);
      updateModal.style.display = 'none';
      displayMyProducts(auth.currentUser.uid); // Refresh the product list
    };

    document.getElementById('closeModal').onclick = () => {
      updateModal.style.display = 'none';
    };

    window.onclick = (event) => {
      if (event.target === updateModal) {
        updateModal.style.display = 'none';
      }
    };
  } else {
    console.error("Modal elements not found");
  }
}
