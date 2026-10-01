const mongoose = require("mongoose");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

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

const getAllProducts = (req, res) => {

    Product.find()
        .then((products) => {

            res.render("user/products", {
                products: products
            });

        })
        .catch((error) => {

            console.log(error);

            res.status(500).send(
                "Failed to load products"
            );

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

            // If user is not logged in,
            // their cart quantity is 0
            if (!req.session.userId) {

                return res.render("user/product", {
                    product: product,
                    cartQuantity: 0
                });

            }

            // Find current user's cart
            return Cart.findOne({
                user: req.session.userId
            })
                .then((cart) => {

                    let cartQuantity = 0;

                    if (cart) {

                        const cartProduct =
                            cart.products.find(
                                (item) =>
                                    item.product.toString() === productId
                            );

                        if (cartProduct) {
                            cartQuantity = cartProduct.quantity;
                        }
                    }

                    res.render("user/product", {
                        product: product,
                        cartQuantity: cartQuantity
                    });

                });

        })
        .catch((error) => {

            console.log(error);

            res.status(500).send(
                "Failed to load product"
            );

        });
};

module.exports = {
    addProduct,
    getProducts,
    getProductById,
    getAllProducts
};