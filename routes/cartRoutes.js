const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    addToCart,
    getCart,
    updateCart,
    removeFromCart
} = require("../controllers/cartController");


// ADD PRODUCT
router.post(
    "/add",
    authMiddleware,
    addToCart
);


// VIEW CART
router.get(
    "/",
    authMiddleware,
    getCart
);


// UPDATE QUANTITY
router.post(
    "/update",
    authMiddleware,
    updateCart
);


// REMOVE PRODUCT
router.post(
    "/remove",
    authMiddleware,
    removeFromCart
);


module.exports = router;