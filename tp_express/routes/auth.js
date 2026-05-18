const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/User");

const router = express.Router();


// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check user exists
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      username,
      password: hashedPassword
    });

    await user.save();

    res.status(201).json({
      message: "User created successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});


// LOGIN
router.post("/login", async (req, res) => {
  try {

    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    // Create session
    req.session.user = {
      id: user._id,
      username: user.username
    };

    res.json({
      message: "Login successful"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});


// LOGOUT
router.post("/logout", (req, res) => {
  req.session.destroy();

  res.json({
    message: "Logged out"
  });
});

module.exports = router;