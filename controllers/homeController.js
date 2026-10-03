const Product = require("../models/Product");

const getHome = (req, res) => {
    Product.find()
        .sort({ createdAt: -1 })
        .limit(8)
        .then((products) => {
            res.render("home", {
                featuredProducts: products
            });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send("Failed to load home page");
        });
};

module.exports = {
    getHome
};