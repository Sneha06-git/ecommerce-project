const express = require("express");

const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
    registerUser,
    loginUser,
    logoutUser
} = require("../controllers/authController");

// Registration page
router.get("/register", (req, res) => {
    res.render("auth/register");
});

// Registration form
router.post("/register", registerUser);

// Login page
router.get("/login", (req, res) => {
    res.render("auth/login");
});

// Login form
router.post("/login", loginUser);

// Logout
router.get("/logout", logoutUser);

// User dashboard
router.get("/dashboard", authMiddleware, (req, res) => {
    res.render("user/dashboard", {
        userName: req.session.userName
    });
});

module.exports = router;