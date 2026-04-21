const API = "http://localhost:5000/api/todos";
const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  window.location.href = "../frontend/index.html";
}

// PROFILE UI
document.getElementById("navProfileImg").src =
  `http://localhost:5000/uploads/${user.image}`;
document.getElementById("navName").innerText = user.name;

document.getElementById("dropImg").src =
  `http://localhost:5000/uploads/${user.image}`;
document.getElementById("dropName").innerText = user.name;

// PROFILE ACTIONS
function toggleProfile() {
  document.getElementById("dropdown").classList.toggle("hidden");
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "../frontend/index.html";
}

function goToUsers() {
  window.location.href = "../frontend/users.html";
}

// STATE
let todos = [];

// FETCH TODOS
async function fetchTodos() {
  const res = await fetch(`${API}/${user.email}`);
  todos = await res.json();
  renderTodos();
}

// RENDER TODOS (CARD UI)
function renderTodos() {
  const todoList = document.getElementById("todo-list");

  const total = todos.length;
  const completed = todos.filter(t => t.completed).length;
  const pending = total - completed;

  document.getElementById("totalCount").innerText = total;
  document.getElementById("doneCount").innerText = completed;
  document.getElementById("pendingCount").innerText = pending;

  const percent = total === 0 ? 0 : (completed / total) * 100;
  const bar = document.getElementById("progressBar");

  bar.style.width = percent + "%";

  if (percent < 40) bar.style.background = "#ef4444";
  else if (percent < 80) bar.style.background = "#f59e0b";
  else bar.style.background = "#10b981";

  if (todos.length === 0) {
    todoList.innerHTML = `<p style="text-align:center;">No tasks yet</p>`;
    return;
  }

  todoList.innerHTML = todos.map(todo => `
    <div class="todo-card ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
      
      ${todo.image ? `<img src="${todo.image}">` : ""}

      <div class="todo-content">
        <div class="todo-title">${todo.text}</div>
        <div class="todo-meta">
          ${todo.dueDate || ""} • 
          <span class="${todo.priority}">${todo.priority}</span>
        </div>
      </div>

      <div class="todo-actions">
        <input type="checkbox" ${todo.completed ? "checked" : ""}
          onchange="toggleTodo('${todo.id}', ${todo.completed})">

        <button onclick="deleteTodo('${todo.id}')">🗑️</button>
      </div>
    </div>
  `).join("");
}

// ADD TODO
async function addTodo() {
  const text = document.getElementById("todo-input").value.trim();
  const dueDate = document.getElementById("due-date").value;
  const priority = document.getElementById("priority").value;
  const file = document.getElementById("task-image").files[0];

  if (!text) {
    alert("Enter a task!");
    return;
  }

  let imageURL = "";

  if (file) {
    imageURL = URL.createObjectURL(file);
  }

  const tempTodo = {
    id: Date.now(),
    text,
    dueDate,
    priority,
    completed: false,
    image: imageURL
  };

  todos.unshift(tempTodo);
  renderTodos();

  document.getElementById("todo-input").value = "";
  document.getElementById("due-date").value = "";
  document.getElementById("task-image").value = "";

  await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      ...tempTodo,
      email: user.email
    })
  });

  fetchTodos();
}

// TOGGLE
async function toggleTodo(id, completed) {
  todos = todos.map(t =>
    t.id == id ? { ...t, completed: !completed } : t
  );
  renderTodos();

  await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed: !completed })
  });
}

// DELETE
async function deleteTodo(id) {
  todos = todos.filter(t => t.id != id);
  renderTodos();

  await fetch(`${API}/${id}`, {
    method: "DELETE"
  });
}

// EVENTS
document.getElementById("add-btn").addEventListener("click", addTodo);

document.getElementById("todo-input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTodo();
});

// INIT
fetchTodos();