const express = require("express");

const router = express.Router();

const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
    addProduct,
    getProducts
} = require("../controllers/productController");


// Admin dashboard
router.get("/dashboard", adminMiddleware, (req, res) => {
    res.render("admin/dashboard", {
        userName: req.session.userName
    });
});

// Add product page
router.get("/add-product", adminMiddleware, (req, res) => {
    res.render("admin/add-product");
});

// Add product
router.post(
    "/add-product",
    adminMiddleware,
    upload.single("image"),
    addProduct
);

// View all products
router.get(
    "/products",
    adminMiddleware,
    getProducts
);


module.exports = router;