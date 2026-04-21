const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  window.location.href = "index.html";
}

// show user
document.getElementById("profileImg").src =
  `http://localhost:5000/uploads/${user.image}`;
document.getElementById("name").innerText = user.name;
document.getElementById("email").innerText = user.email;

// logout
function logout() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}

// go to users page
function goToUsers() {
  window.location.href = "users.html";
}