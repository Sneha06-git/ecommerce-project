const express = require("express");

const router = express.Router();

const {
    getProductById
} = require("../controllers/productController");


// Individual product page
router.get(
    "/:id",
    getProductById
);


module.exports = router;