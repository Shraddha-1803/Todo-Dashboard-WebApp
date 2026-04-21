const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const upload = require("../middleware/upload");

const USERS_FILE = path.join(__dirname, "../users.json");

// Helper: read users safely
const getUsers = () => {
  try {
    if (!fs.existsSync(USERS_FILE)) return [];
    const data = fs.readFileSync(USERS_FILE);
    return data.length ? JSON.parse(data) : [];
  } catch (err) {
    console.log("Error reading users:", err);
    return [];
  }
};

// Helper: save users safely
const saveUsers = (users) => {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (err) {
    console.log("Error saving users:", err);
  }
};

// ================= SIGNUP =================
router.post("/signup", upload.single("image"), async (req, res) => {
  try {
    console.log("FILE:", req.file);

    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image not uploaded" });
    }

    let users = getUsers();

    // Check existing user
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: Date.now(),
      name,
      email,
      password: hashedPassword,
      image: req.file.filename
    };

    users.push(newUser);
    saveUsers(users);

    console.log("UPDATED USERS:", users);

    res.status(201).json({
      message: "Signup successful",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        image: newUser.image
      }
    });

  } catch (err) {
    console.log("Signup Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const users = getUsers();

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign({ id: user.id }, "secret", { expiresIn: "1h" });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image
      }
    });

  } catch (err) {
    console.log("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= GET ALL USERS =================
router.get("/users", (req, res) => {
  try {
    const users = getUsers();

    // remove passwords
    const safeUsers = users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      image: u.image
    }));

    res.json(safeUsers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

module.exports = router;