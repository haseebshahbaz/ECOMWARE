# ECOMWARE

## Overview
ECOMWARE is a comprehensive ecommerce website designed to provide a seamless shopping experience. The project includes features such as product listing, user product management, shopping cart management, checkout process, and order history.

## Features
- **Product Listing**: Browse a variety of products with detailed information and images.
- **User Product Management**: Users can add their products and view them in the 'My Products' section.
- **Shopping Cart**: Add products to the cart, update quantities, and view the total cost.
- **Checkout Process**: Enter shipping details, review the order, and confirm the purchase.
- **Order History**: View past orders with details such as order ID, products purchased, and total amount.
- **User Authentication**: Sign up, log in, and manage user profiles.
- **Search Functionality**: Search for products based on name, description, or category.

## Folder Structure

### Root Directory

- **index.html**: The main HTML file that sets up the structure of the website, including the navbar, product display section, and other key elements.

### /src

- **index.js**: The main JavaScript file that handles dynamic functionality, including user authentication, product display, cart management, and more.

  - **User Authentication**: Handles user sign-in, sign-out, and user state changes.
  - **Product Display**: Fetches and displays products from Firestore.
  - **Cart Management**: Manages adding products to the cart, updating cart counts, and navigating to the cart page.
  - **Search Functionality**: Implements search functionality to filter and display products based on user queries.
  
- **utils.js**: Utility file that initializes Firebase services and provides helper functions for interacting with Firestore.

  - **Firebase Initialization**: Initializes Firebase app, Firestore, Authentication, Storage, and Analytics.
  - **Helper Functions**: Includes functions for fetching user products, deleting products, and updating products in Firestore.

### /components
Contains reusable components used throughout the application.

- **Navbar.js**: Navigation bar component that includes links to the home page, cart, and order history.
- **ProductCard.js**: Component for displaying individual product information.
- **CartItem.js**: Component for displaying items in the shopping cart.

### /pages
Contains the main pages of the application.

- **Home.js**: Home page displaying all available products.
- **MyProducts.js**: Page where users can view products they have added.
- **AddProduct.js**: Page for users to add new products.
- **Cart.js**: Shopping cart page where users can review and modify their cart.
- **Checkout.js**: Checkout page where users enter shipping information and confirm their order.
- **OrderHistory.js**: Page displaying the user's past orders.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/haseebshahbaz/ECOMWARE.git
   
## Usage
1. Visit the home page to browse available products.
2. Add products to your cart and proceed to the checkout when ready.
3. Enter your shipping details and confirm your order.
4. View your past orders in the Order History page.
5. Add new products through the Add Product page and view them in My Products.

# Contributing
Contributions are welcome! Please create a pull request or open an issue for any changes or improvements.


# Detailed Description of Main Files
index.html
The main HTML structure for the application, including:

# Navbar: 
Navigation links for home, cart, and order history.

# Product Section: 
Displays products available for purchase.

# Search Bar: 
Allows users to search for products.

# User Profile: 
Displays user information when logged in.


# User Authentication: Sign-in, sign-out, and state change handling.
Product Fetching and Display: Retrieves products from Firestore and displays them.
Cart Management: Adds products to the cart and updates cart count.
Search Functionality: Filters products based on user search queries.
Event Listeners: Handles various user interactions like clicking the cart icon or logging out.
utils.js
Utility functions and Firebase configuration:

# Firebase Initialization: Sets up Firebase services.
Helper Functions:
getUserProducts(userId): Fetches products created by a specific user.
deleteProduct(productId): Deletes a product from Firestore.
updateProduct(productId, updatedData): Updates product information in Firestore.

