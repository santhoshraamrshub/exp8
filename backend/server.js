const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const SECRET = "mysecretkey";

// Dummy users (RBAC)
const users = [
  { id: 1, username: "admin", password: "1234", role: "admin" },
  { id: 2, username: "user", password: "1234", role: "user" }
];

// 🔐 LOGIN API
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token });
});

// 🔐 AUTH MIDDLEWARE
function authenticate(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ error: "Invalid token" });
  }
}

// 🔐 RBAC MIDDLEWARE
function authorize(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: "Access denied" });
    }
    next();
  };
}

// 🔐 ROUTES
app.get("/api/user", authenticate, (req, res) => {
  res.json({ message: "User Dashboard" });
});

app.get("/api/admin", authenticate, authorize("admin"), (req, res) => {
  res.json({ message: "Admin Dashboard" });
});

// 🚀 START SERVER
app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});