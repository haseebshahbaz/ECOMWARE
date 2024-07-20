import { auth, db, collection, query, where, getDocs, onAuthStateChanged } from "../utils/utils.js";

document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            alert('You need to be logged in to view your order history.');
            window.location.href = '../auth/login/login.html';
            return;
        }

        const ordersRef = collection(db, 'orders');
        const q = query(ordersRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);

        const orderHistoryContainer = document.getElementById('order-history');

        if (!orderHistoryContainer) {
            console.error('order-history element not found');
            return;
        }

        querySnapshot.forEach(doc => {
            const orderData = doc.data();
            let totalAmount = orderData.products.reduce((sum, product) => sum + (product.productPrice * product.quantity), 0);

            const orderElement = document.createElement('div');
            orderElement.className = "mb-4 p-4 bg-gray-100 rounded shadow";
            orderElement.innerHTML = `
                <h3 class="text-xl font-semibold">Order ID: ${orderData.orderId}</h3>
                <p>Order Date: ${new Date(orderData.orderDate.seconds * 1000).toLocaleDateString()}</p>
                <p>Status: ${orderData.status}</p>
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
            `;
            orderHistoryContainer.appendChild(orderElement);
        });
    });
});
