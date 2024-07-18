// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";
// import {
//   getAuth,
//   onAuthStateChanged,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signOut,
// } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
// import {
//   getFirestore,
//   doc,
//   setDoc,
//   getDoc,
//   getDocs,
//   collection,
//   addDoc,
//   updateDoc,
//   arrayUnion,
//   arrayRemove,
//   query,
//   where,
//   deleteDoc,
// } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
// import {
//   getStorage,
//   ref,
//   uploadBytes,
//   getDownloadURL,
// } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-storage.js";

// const firebaseConfig = {
//   apiKey: "AIzaSyBGmasueDL9QjzWn4JwRGOu-VHrA0C0cGM",
//   authDomain: "blogwebsite-9e83d.firebaseapp.com",
//   projectId: "blogwebsite-9e83d",
//   storageBucket: "blogwebsite-9e83d.appspot.com",
//   messagingSenderId: "132531049866",
//   appId: "1:132531049866:web:fe4ea1b3941691779e6473",
//   measurementId: "G-4HF8W8DW9S",
// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);
// const storage = getStorage(app);
// const analytics = getAnalytics(app);

// export {
//   auth,
//   db,
//   storage,
//   onAuthStateChanged,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   doc,
//   setDoc,
//   ref,
//   uploadBytes,
//   getDownloadURL,
//   signOut,
//   getDoc,
//   collection,
//   addDoc,
//   getDocs,
//   updateDoc,
//   arrayUnion,
//   arrayRemove,
//   query,
//   where,
//   deleteDoc,
// };

// export async function getUserProducts(userId) {
//   try {
//     const q = query(collection(db, "products"), where("createdBy", "==", userId));
//     const querySnapshot = await getDocs(q);
//     const products = [];
//     querySnapshot.forEach((doc) => {
//       products.push({ id: doc.id, ...doc.data() });
//     });
//     return products;
//   } catch (error) {
//     console.error("Error fetching user products: ", error);
//     return [];
//   }
// }

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  addDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  query,
  where,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBGmasueDL9QjzWn4JwRGOu-VHrA0C0cGM",
  authDomain: "blogwebsite-9e83d.firebaseapp.com",
  projectId: "blogwebsite-9e83d",
  storageBucket: "blogwebsite-9e83d.appspot.com",
  messagingSenderId: "132531049866",
  appId: "1:132531049866:web:fe4ea1b3941691779e6473",
  measurementId: "G-4HF8W8DW9S",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export {
  auth,
  db,
  storage,
  onAuthStateChanged,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  doc,
  setDoc,
  ref,
  uploadBytes,
  getDownloadURL,
  signOut,
  getDoc,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  arrayUnion,
  arrayRemove,
  query,
  where,
  deleteDoc,
};

export async function getUserProducts(userId) {
  try {
    const q = query(collection(db, "products"), where("createdBy", "==", userId));
    const querySnapshot = await getDocs(q);
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    return products;
  } catch (error) {
    console.error("Error fetching user products: ", error);
    return [];
  }
}

export async function deleteProduct(productId) {
  try {
    await deleteDoc(doc(db, "products", productId));
    console.log(`Product with ID ${productId} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting product: ", error);
  }
}

export async function updateProduct(productId, updatedData) {
  try {
    await updateDoc(doc(db, "products", productId), updatedData);
    console.log(`Product with ID ${productId} updated successfully.`);
  } catch (error) {
    console.error("Error updating product: ", error);
  }
}
