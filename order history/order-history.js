import { auth, db, collection, query, where, getDocs, onAuthStateChanged } from "../utils/utils.js";

document.addEventListener('DOMContentLoaded', () => {
    const orderHistoryContainer = document.getElementById('order-history');
    const loadingSpinner = document.getElementById('loading-spinner');

    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            alert('You need to be logged in to view your order history.');
            window.location.href = '../auth/login/login.html';
            return;
        }

        try {
            const ordersRef = collection(db, 'orders');
            const q = query(ordersRef, where('userId', '==', user.uid));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                orderHistoryContainer.innerHTML = '<p class="text-gray-500">You have no orders yet.</p>';
                loadingSpinner.classList.add('hidden');
                orderHistoryContainer.classList.remove('hidden');
                return;
            }

            querySnapshot.forEach(doc => {
                const orderData = doc.data();
                let totalAmount = orderData.products.reduce((sum, product) => sum + (product.productPrice * product.quantity), 0);

                let orderDate = 'N/A';
                if (orderData.orderDate && orderData.orderDate.seconds) {
                    orderDate = new Date(orderData.orderDate.seconds * 1000).toLocaleDateString();
                }

                const orderElement = document.createElement('div');
                orderElement.className = "mb-4 p-4 bg-gray-100 rounded shadow";
                orderElement.innerHTML = `
                    <h3 class="text-xl font-semibold cursor-pointer order-toggle">Order ID: ${orderData.orderId || 'N/A'}</h3>
                    <div class="order-details hidden">
                        <p>Order Date: ${orderDate}</p>
                        <p>Status: ${orderData.status || 'N/A'}</p>
                        <div class="mt-2">
                            ${orderData.products.map(product => `
                                <div class="flex justify-between items-center mb-2">
                                    <div class="flex items-center">
                                        <img src="${product.img}" alt="${product.productName}" class="w-12 h-12 mr-2">
                                        <div>
                                            <p>${product.productName}</p>
                                            <p>Quantity: ${product.quantity}</p>
                                        </div>
                                    </div>
                                    <span>Rs${product.productPrice * product.quantity}</span>
                                </div>
                            `).join('')}
                        </div>
                        <p class="mt-4 font-bold">Total Amount: Rs${totalAmount}</p>
                    </div>
                `;
                orderHistoryContainer.appendChild(orderElement);

                // Add toggle functionality
                const toggleButton = orderElement.querySelector('.order-toggle');
                const orderDetails = orderElement.querySelector('.order-details');
                toggleButton.addEventListener('click', () => {
                    orderDetails.classList.toggle('hidden');
                });
            });

            loadingSpinner.classList.add('hidden');
            orderHistoryContainer.classList.remove('hidden');
        } catch (error) {
            console.error("Error fetching order history:", error);
            alert("Error fetching order history. Please try again later.");
        }
    });
});
