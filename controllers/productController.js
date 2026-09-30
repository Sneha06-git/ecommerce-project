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

module.exports = {
    addProduct
};