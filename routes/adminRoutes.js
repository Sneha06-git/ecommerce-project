const express = require("express");

const router = express.Router();

const adminMiddleware = require("../middleware/adminMiddleware");

const upload = require("../middleware/uploadMiddleware");

const {
    addProduct,
    getProducts
} = require("../controllers/productController");

const {
    getAllOrders,
    getAdminOrderDetails,
    updateOrderStatus
} = require("../controllers/orderController");

const {
    getAllCustomers
} = require("../controllers/adminController");

// ADMIN DASHBOARD

router.get(
    "/dashboard",
    adminMiddleware,
    (req, res) => {

        res.render("admin/dashboard", {
            userName: req.session.userName
        });

    }
);


// ADD PRODUCT PAGE

router.get(
    "/add-product",
    adminMiddleware,
    (req, res) => {

        res.render("admin/add-product");

    }
);


// ADD PRODUCT

router.post(
    "/add-product",
    adminMiddleware,
    upload.single("image"),
    addProduct
);


// ADMIN PRODUCTS

router.get(
    "/products",
    adminMiddleware,
    getProducts
);


// ADMIN ORDERS

router.get(
    "/orders",
    adminMiddleware,
    getAllOrders
);


// ADMIN ORDER DETAILS

router.get(
    "/orders/:id",
    adminMiddleware,
    getAdminOrderDetails
);

router.post(
    "/orders/:id/status",
    adminMiddleware,
    updateOrderStatus
);

router.get(
    "/customers",
    adminMiddleware,
    getAllCustomers
);

module.exports = router;