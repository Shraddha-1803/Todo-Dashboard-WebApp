const router = require("express").Router();
const fs = require("fs");
const path = require("path");

const TODOS_FILE = path.join(__dirname, "../todos.json");

// helpers
const getTodos = () => JSON.parse(fs.readFileSync(TODOS_FILE));
const saveTodos = (todos) =>
  fs.writeFileSync(TODOS_FILE, JSON.stringify(todos, null, 2));

// GET TODOS (by user)
router.get("/:email", (req, res) => {
  const todos = getTodos();
  const userTodos = todos.filter(t => t.email === req.params.email);
  res.json(userTodos);
});

// ADD TODO
router.post("/", (req, res) => {
  const todos = getTodos();

  const newTodo = {
    id: Date.now(),
    ...req.body
  };

  todos.push(newTodo);
  saveTodos(todos);

  res.json(newTodo);
});

// UPDATE TODO
router.put("/:id", (req, res) => {
  let todos = getTodos();

  todos = todos.map(t =>
    t.id == req.params.id ? { ...t, ...req.body } : t
  );

  saveTodos(todos);
  res.json({ message: "Updated" });
});

// DELETE TODO
router.delete("/:id", (req, res) => {
  let todos = getTodos();

  todos = todos.filter(t => t.id != req.params.id);

  saveTodos(todos);
  res.json({ message: "Deleted" });
});

module.exports = router;