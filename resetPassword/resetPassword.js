
const resetIdLink = window.location.href.split('/');
const resetId = resetIdLink[resetIdLink.length - 1];

console.log("reSET LINK", resetIdLink);
console.log("reset id", resetId);

// const password = document.getElementById('password');
// const confirmPassword = document.getElementById('confirm-password');

// const resetPasswordBtn = document.getElementById('submitbtn');

// resetPasswordBtn.addEventListener("click", async (e) => {
//     e.preventDefault();
//     alert("reset button clicked");

//     if (!isValidUUID(resetId)) {
//         alert("Invalid reset ID");
//         return;
//     }
//     try {
//         if (password.value !== confirmPassword.value) {
//             alert("Password doesn't match");
//         } else {
//             const resetResponse = await axios.post("http://3.109.201.50:3000/password/reset", {
//                 resetId: resetId,
//                 newpassword: password.value
//             });

//             alert("Password Updated");
//         }

//         window.location.href = '../Login/login.html';
//     } catch (err) {
//         console.log(err);
//     }
// });

// function isValidUUID(uuid) {
//     const uuidRegex = /^[a-f\d]{8}-(?:[a-f\d]{4}-){3}[a-f\d]{12}$/i;
//     return uuidRegex.test(uuid);
// }