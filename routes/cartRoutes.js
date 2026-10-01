const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    addToCart,
    getCart
} = require("../controllers/cartController");

// Add product to cart
router.post(
    "/add",
    authMiddleware,
    addToCart
);

// View cart
router.get(
    "/",
    authMiddleware,
    getCart
);

module.exports = router;