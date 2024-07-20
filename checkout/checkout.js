import { auth, db, doc, getDoc, updateDoc, addDoc, collection, onAuthStateChanged } from "../utils/utils.js";

document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            alert('You need to be logged in to proceed to checkout.');
            window.location.href = '../auth/login/login.html';
            return;
        }

        const cartRef = doc(db, 'carts', user.uid);
        const cartDoc = await getDoc(cartRef);

        if (cartDoc.exists()) {
            const cartData = cartDoc.data();
            const checkoutDetails = document.getElementById('checkout-details');

            if (!checkoutDetails) {
                console.error('checkout-details element not found');
                return;
            }

            let totalAmount = 0;

            cartData.products.forEach(product => {
                const productElement = document.createElement('div');
                productElement.className = "mb-4 p-4 bg-gray-100 rounded flex justify-between items-center";
                productElement.innerHTML = `
                    <div class="flex items-center">
                        <img src="${product.img}" alt="${product.productName}" class="w-16 h-16 mr-4">
                        <div>
                            <p>${product.productName}</p>
                            <p>Quantity: ${product.quantity}</p>
                        </div>
                    </div>
                    <span>Rs${product.productPrice * product.quantity}</span>
                `;
                checkoutDetails.appendChild(productElement);
                totalAmount += product.productPrice * product.quantity;
            });

            // Display the total amount
            const totalAmountElement = document.createElement('div');
            totalAmountElement.className = "mt-4 p-4 bg-gray-100 rounded text-right font-bold";
            totalAmountElement.innerHTML = `Total Amount: Rs${totalAmount}`;
            checkoutDetails.appendChild(totalAmountElement);

            const addressForm = document.getElementById('address-form');
            if (addressForm && cartData.address) {
                addressForm.fullName.value = cartData.address.fullName || '';
                addressForm.address.value = cartData.address.address || '';
                addressForm.city.value = cartData.address.city || '';
                addressForm.state.value = cartData.address.state || '';
                addressForm.zip.value = cartData.address.zip || '';
                addressForm.phone.value = cartData.address.phone || '';
            }

            if (addressForm) {
                addressForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const form = e.target;
                    const address = {
                        fullName: form.fullName.value,
                        address: form.address.value,
                        city: form.city.value,
                        state: form.state.value,
                        zip: form.zip.value,
                        phone: form.phone.value
                    };

                    const updateButton = form.querySelector('button[type="submit"]');
                    const originalButtonText = updateButton.textContent;
                    updateButton.disabled = true;
                    updateButton.textContent = 'Updating...';

                    await updateDoc(cartRef, { address });

                    updateButton.textContent = 'Updated!';
                    setTimeout(() => {
                        updateButton.textContent = originalButtonText;
                        updateButton.disabled = false;
                    }, 2000);

                    alert('Address updated successfully!');
                });
            } else {
                console.error('address-form element not found');
            }

            const confirmOrderBtn = document.getElementById('confirm-order-btn');
            if (confirmOrderBtn) {
                confirmOrderBtn.addEventListener('click', async () => {
                    const cartSnapshot = await getDoc(cartRef);
                    const updatedCartData = cartSnapshot.data();

                    if (!updatedCartData.address) {
                        alert('Please update your address before confirming the order.');
                        return;
                    }

                    const selectedPaymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
                    if (!selectedPaymentMethod) {
                        alert('Please select a payment method.');
                        return;
                    }

                    const paymentMethod = selectedPaymentMethod.value;

                    const orderId = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

                    confirmOrderBtn.disabled = true;
                    const originalButtonText = confirmOrderBtn.textContent;
                    confirmOrderBtn.textContent = 'Processing...';

                    await addDoc(collection(db, 'orders'), {
                        userId: user.uid,
                        products: updatedCartData.products,
                        address: updatedCartData.address,
                        paymentMethod,
                        orderId,
                        orderDate: new Date(),
                        status: 'Confirmed'
                    });

                    await updateDoc(cartRef, { products: [] });

                    confirmOrderBtn.textContent = 'Confirmed!';
                    setTimeout(() => {
                        confirmOrderBtn.textContent = originalButtonText;
                        confirmOrderBtn.disabled = false;
                    }, 2000);

                    document.getElementById('checkout-container').classList.add('hidden');
                    document.getElementById('order-id').textContent = orderId;
                    document.getElementById('confirmation-message').classList.remove('hidden');
                });
            } else {
                console.error('confirm-order-btn element not found');
            }
        } else {
            console.error('Cart document does not exist');
        }
    });
});
