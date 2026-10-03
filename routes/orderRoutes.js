const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    getCheckout,
    placeOrder,
    getOrderSuccess,
    getMyOrders,
    getOrderDetails
} = require("../controllers/orderController");

router.get(
    "/",
    authMiddleware,
    getMyOrders
);

router.get(
    "/checkout",
    authMiddleware,
    getCheckout
    
);

router.post(
    "/place",
    authMiddleware,
    placeOrder
);

router.get(
    "/success/:id",
    authMiddleware,
    getOrderSuccess
);

router.get("/:id", authMiddleware, getOrderDetails);

module.exports = router;
