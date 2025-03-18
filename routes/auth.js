const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "my_super_secret_key";


router.post("/register", async (req, res) => {
    /* #swagger.tags = ['Authentication']
        #swagger.summary = "Register a new user"
    */

  try {
    const { username, email, password, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    // Create new user
    const user = await User.create({ username, email, password, role });
    res.status(201).json({ message: "User registered successfully" , user });
  } catch (error) {
    res.status(500).json({ error: "Registration failed", details: error.message });
  }
});

// 📌 Login User
router.post("/login", async (req, res) => {
    /* #swagger.tags = ['Authentication']
        #swagger.summary = "Login a user"
    */
  try {
    const { email, password } = req.body;
    

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRATION });

    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ error: "Login failed", details: error.message });
  }
});

module.exports = router;
