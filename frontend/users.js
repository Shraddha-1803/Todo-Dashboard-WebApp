const API = "http://localhost:5000/api/auth";

async function loadUsers() {
  const res = await fetch(`${API}/users`);
  const users = await res.json();

  const container = document.getElementById("usersContainer");

  container.innerHTML = users.map(user => `
    <div class="card">
      <img src="http://localhost:5000/uploads/${user.image}" />
      <h3>${user.name}</h3>
      <p>${user.email}</p>
    </div>
  `).join("");
}

loadUsers();