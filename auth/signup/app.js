import {
  auth,
  createUserWithEmailAndPassword,
  doc,
  setDoc,
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  db,
} from "../../utils/utils.js";

const signup_btn = document.getElementById("signup_btn");
const submit_btn = document.getElementById("submit_btn");

signup_btn.addEventListener("submit", function (e) {
  e.preventDefault();

  const fullName = e.target[0].value;
  const fatherName = e.target[1].value;
  const email = e.target[2].value;
  const password = e.target[3].value;
  const confirmPassword = e.target[4].value;
  const img = e.target[5].files[0];
  const submitBtn = e.target[6];

  const userInfo = {
    fullName,
    fatherName,
    email,
    password,
    confirmPassword,
    img,
  };

  submit_btn.disable = true;
  submit_btn.innerText = "Loading...."
  createUserWithEmailAndPassword(auth, email, password)
    .then((user) => {
      // Signed up
      console.log(user.user.uid);
      //Created User Ref
      const userRef = ref(storage, `user/${user.user.uid}`);
      //Upload Profile Pic
      uploadBytes(userRef, img)
        .then(() => {
          console.log("user image uploaded");
          //Getting the Profile Pic which we just Uploaded
          getDownloadURL(userRef)
            .then((url) => {
              console.log("url agaya =>", url);

              //Updated the userinfo object
              userInfo.img = url;

                //Created user document Ref
              const userDbRef = doc(db, "users", user.user.uid )

              //Set this doc to db
              setDoc(userDbRef , userInfo).then(()=>{
                console.log("user doc uploaed db");
                window.location.href = "/";
                submitBtn.disable = true
              })

            })
            .catch(() => {
              {alert(error)
                submit_btn.disable = false;
                submit_btn.innerText = "Submit"
              };
            });
        })
        .catch(() => {
            {alert(error)
                submit_btn.disable = false;
                submit_btn.innerText = "Submit"
              };
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
});

