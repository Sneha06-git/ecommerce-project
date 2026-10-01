const mongoose = require("mongoose");
const Product = require("../models/Product");


// ADD PRODUCT
const addProduct = (req, res) => {

    const {
        name,
        description,
        price,
        category,
        stock
    } = req.body;

    // Check required fields
    if (
        !name ||
        !description ||
        !price ||
        !category ||
        !stock
    ) {
        return res.redirect(
            "/admin/add-product?error=Please%20fill%20all%20fields"
        );
    }

    // Check image
    if (!req.file) {
        return res.redirect(
            "/admin/add-product?error=Please%20select%20a%20product%20image"
        );
    }

    const product = new Product({
        name: name,
        description: description,
        price: price,
        category: category,
        stock: stock,
        image: "/uploads/" + req.file.filename
    });

    product
        .save()
        .then(() => {

            res.redirect(
                "/admin/add-product?message=Product%20added%20successfully"
            );

        })
        .catch((error) => {

            console.log(error);

            res.redirect(
                "/admin/add-product?error=Failed%20to%20add%20product"
            );

        });
};

// GET ALL PRODUCTS
const getProducts = (req, res) => {

    Product.find()
        .then((products) => {

            res.render("admin/products", {
                products: products
            });

        })
        .catch((error) => {

            console.log(error);

            res.send("Failed to load products");

        });
};


// GET SINGLE PRODUCT
const getProductById = (req, res) => {

    const productId = req.params.id;

    // Check whether the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(404).send("Product not found");
    }

    Product.findById(productId)
        .then((product) => {

            if (!product) {
                return res.status(404).send("Product not found");
            }

            res.render("user/product", {
                product: product
            });

        })
        .catch((error) => {

            console.log(error);
            res.status(500).send("Failed to load product");

        });
};

module.exports = {
    addProduct,
    getProducts,
    getProductById
};