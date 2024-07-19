import {
  ref,
  storage,
  uploadBytes,
  getDownloadURL,
  db,
  collection,
  addDoc,
  auth,
} from "../utils/utils.js";

console.log(auth);

const addProductForm = document.getElementById("addProductForm");
const addProductSubmit = document.getElementById("addProductSubmit");


addProductForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(e);

  const productInfo = {
      img: e.target[0].files[0],
      productName: e.target[1].value,
      productDesce: e.target[2].value,
      productPrice: e.target[3].value,
      productCategory: e.target[4].value,
      createdBy: auth.currentUser.uid,
      createdByEmail: auth.currentUser.email,
      likes: [],
  }

  console.log(productInfo);
  addProductSubmit.disabled = true; // Corrected the property name
  addProductSubmit.innerText = "Loading...";

  const imgRef = ref(storage, productInfo.img.name);
  uploadBytes(imgRef, productInfo.img).then(() => {
      console.log("File Upload Done");
      getDownloadURL(imgRef).then((url) => {
          console.log("Url received", url);
          productInfo.img = url;
          // add document to products collection
          const productCollection = collection(db, "products");
          addDoc(productCollection, productInfo).then(() => {
              console.log("Document ADDED");
              window.location.href = "../index.html";
          }).catch((error) => {
              console.error("Error adding document: ", error);
              addProductSubmit.disabled = false; // Re-enable the button in case of error
              addProductSubmit.innerText = "Add Product";
          });
      }).catch((error) => {
          console.error("Error getting download URL: ", error);
          addProductSubmit.disabled = false; // Re-enable the button in case of error
          addProductSubmit.innerText = "Add Product";
      });
  }).catch((error) => {
      console.error("Error uploading file: ", error);
      addProductSubmit.disabled = false; // Re-enable the button in case of error
      addProductSubmit.innerText = "Add Product";
  });
});
