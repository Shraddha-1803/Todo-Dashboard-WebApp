const API = "http://localhost:5000/api/auth";

// ================= SIGNUP =================
document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  try {
    const res = await fetch(`${API}/signup`, {
      method: "POST",
      body: formData
    });

    const result = await res.json();

    if (!res.ok) {
      alert(result.message || "Signup failed");
      return;
    }

    alert("Signup successful! Please login.");

    // switch to login form automatically
    toggleBtn.click();

  } catch (err) {
    console.log(err);
    alert("Error during signup");
  }
});


// ================= LOGIN =================
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(e.target));

  try {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (!res.ok) {
      alert(result.message || "Login failed");
      return;
    }

    // ✅ Save user
    localStorage.setItem("user", JSON.stringify(result.user));

    // ✅ Redirect to profile page
    window.location.href = "../todo-webapp/index.html";

  } catch (err) {
    console.log(err);
    alert("Error during login");
  }
});


// ================= TOGGLE LOGIN/SIGNUP =================
const toggleBtn = document.getElementById("toggleBtn");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const formTitle = document.getElementById("formTitle");
const toggleText = document.getElementById("toggleText");

let isLogin = true;

toggleBtn.addEventListener("click", (e) => {
  e.preventDefault();

  isLogin = !isLogin;

  if (isLogin) {
    loginForm.classList.remove("hidden");
    signupForm.classList.add("hidden");
    formTitle.innerText = "Login";
    toggleText.innerText = "Don't have an account?";
    toggleBtn.innerText = "Signup";
  } else {
    loginForm.classList.add("hidden");
    signupForm.classList.remove("hidden");
    formTitle.innerText = "Signup";
    toggleText.innerText = "Already have an account?";
    toggleBtn.innerText = "Login";
  }
});


// ================= IMAGE PREVIEW =================
const imageInput = document.querySelector('input[name="image"]');
const previewImg = document.getElementById("previewImg");
const defaultIcon = document.getElementById("defaultIcon");

if (imageInput) {
  imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        previewImg.src = e.target.result;
        previewImg.style.display = "block";
        defaultIcon.style.display = "none";
      };

      reader.readAsDataURL(file);
    }
  });
}