// import axios from 'axios';

const emailInput = document.querySelector("#email-input");
const passwordInput = document.querySelector("#password-input");
const loginBtn = document.querySelector("#login-btn");
const forgotPasswordBtn = document.getElementById("forgot-password-button");

function successalert(msg) {
  const alertDiv = document.getElementById("success-alert");
  alertDiv.classList.remove("d-none");
  alertDiv.innerText = msg;
  setTimeout(() => {
    alertDiv.classList.add("d-none");
  }, 4000);
}

function failurealert(msg) {
  const errorAlertDiv = document.getElementById("failure-alert");
  errorAlertDiv.classList.remove("d-none");
  errorAlertDiv.innerText = msg;
  setTimeout(() => {
    errorAlertDiv.classList.add("d-none");
  }, 2000);
}

const modal = document.getElementById("forgot-password-modal");
const saveChangesBtn = document.getElementById("save-changes");
$(saveChangesBtn).on("click", function () {
  $(modal).modal("hide");
});

const closeModalBtn = document.getElementById("close-btn");
$(closeModalBtn).on("click", function () {
  $(modal).modal("hide");
});

forgotPasswordBtn.addEventListener("click", async () => {
  const forgotPasswordModal = new bootstrap.Modal(
    document.getElementById("forgot-password-modal")
  );
  forgotPasswordModal.show();

  const emailId = document.getElementById("forgot_pass_email");
  const saveChangesBtn = document.getElementById("save-changes");

  saveChangesBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    // modal.hide();
    try {
      const emailData = await axios.post(
        "http://localhost:3000/password/forgotPassword",
        { email: emailId.value }
      );
      console.log(emailData); //
      successalert("Reset password email sent");

      // alert("reset password email Sent");
    } catch (error) {
      failurealert("something went wrong");
    }
  });
});

loginBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const email = emailInput.value;
  const password = passwordInput.value;

  const loginData = {
    email: email,
    password: password,
  };

  if (email === "" || password === "") {
    failurealert("Enter all fields");
    // alert("Enter all fields");
  } else {
    try {
      const userDetails = await axios.post(
        "http://localhost:3000/users/login",
        loginData
      );

      if (userDetails.data.success) {
        successalert(userDetails.data.message);
        // alert(userDetails.data.message);
        console.log("USER DETAILS", userDetails);
        localStorage.setItem("token", userDetails.data.token);
        localStorage.setItem("isPremiumUser", userDetails.data.ispremiumUser);
        window.location.href = "../Expense/expense.html";
      } else {
        failurealert(userDetails.data.message);
        // alert();
      }
    } catch (err) {
      console.log(err);
      failurealert("An error occurred. Please try again.");

      // alert("An error occurred. Please try again.");
      // console.log(err);
    }
  }
});

document.getElementById("nav-signup-btn").addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "../Signup/signup.html";
});
