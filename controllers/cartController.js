const Cart = require("../models/Cart");
const Product = require("../models/Product");


// =========================================================
// ADD PRODUCT TO CART
// =========================================================
const addToCart = (req, res) => {

    const userId = req.session.userId;
    const productId = req.body.productId;
    const quantity = Number(req.body.quantity);

    // Validate quantity
    if (!Number.isInteger(quantity) || quantity < 1) {

        return res.status(400).json({
            success: false,
            message: "Invalid quantity"
        });

    }

    Product.findById(productId)

        .then((product) => {

            if (!product) {

                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });

            }


            if (product.stock <= 0) {

                return res.status(400).json({
                    success: false,
                    message: "This product is out of stock"
                });

            }


            return Cart.findOne({
                user: userId
            })

                .then((cart) => {

                    // NO CART YET

                    if (!cart) {

                        if (quantity > product.stock) {

                            return res.status(400).json({
                                success: false,
                                message:
                                    `Only ${product.stock} item(s) available in stock`
                            });

                        }


                        const newCart = new Cart({

                            user: userId,

                            products: [
                                {
                                    product: productId,
                                    quantity: quantity
                                }
                            ]

                        });


                        return newCart.save()

                            .then(() => {

                                res.json({

                                    success: true,

                                    message:
                                        "Product added to cart",

                                    cartItemCount:
                                        quantity

                                });

                            });

                    }


                    // PRODUCT ALREADY IN CART

                    const existingProduct =
                        cart.products.find(
                            (item) =>
                                item.product.toString() === productId
                        );


                    if (existingProduct) {

                        const newQuantity =
                            existingProduct.quantity + quantity;


                        if (newQuantity > product.stock) {

                            return res.status(400).json({

                                success: false,

                                message:
                                    `Only ${product.stock} item(s) available in stock`

                            });

                        }


                        existingProduct.quantity =
                            newQuantity;

                    }


                    // NEW PRODUCT IN EXISTING CART

                    else {

                        if (quantity > product.stock) {

                            return res.status(400).json({

                                success: false,

                                message:
                                    `Only ${product.stock} item(s) available in stock`

                            });

                        }


                        cart.products.push({

                            product: productId,

                            quantity: quantity

                        });

                    }


                    return cart.save()

                        .then(() => {

                            let cartItemCount = 0;


                            cart.products.forEach((item) => {

                                cartItemCount +=
                                    item.quantity;

                            });


                            res.json({

                                success: true,

                                message:
                                    "Product added to cart",

                                cartItemCount:
                                    cartItemCount

                            });

                        });

                });

        })

        .catch((error) => {

            console.log(error);

            res.status(500).json({

                success: false,

                message:
                    "Failed to add product to cart"

            });

        });

};

// =========================================================
// VIEW CART
// =========================================================

const getCart = (req, res) => {

    const userId = req.session.userId;

    Cart.findOne({
        user: userId
    })
        .populate("products.product")

        .then((cart) => {

            if (!cart) {

                return res.render("user/cart", {
                    cart: null
                });

            }

            res.render("user/cart", {
                cart: cart
            });

        })

        .catch((error) => {

            console.log(error);

            res.status(500).send(
                "Failed to load cart"
            );

        });

};



module.exports = {
    addToCart,
    getCart
};