const express = require("express");

const router = express.Router();

const {
    getAllProducts,
    getProductById
} = require("../controllers/productController");


router.get("/", getAllProducts);

// Individual product page
router.get("/:id",getProductById);

module.exports = router;