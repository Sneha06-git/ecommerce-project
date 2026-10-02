const Cart = require("../models/Cart");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");


// SHOW CHECKOUT PAGE
const getCheckout = (req, res) => {

    const userId = req.session.userId;

    Promise.all([
        User.findById(userId),
        Cart.findOne({ user: userId }).populate("products.product")
    ])
        .then(([user, cart]) => {

            if (!user) {
                return res.redirect(
                    "/auth/login?error=User%20not%20found"
                );
            }

            if (!cart || cart.products.length === 0) {
                return res.redirect(
                    "/cart"
                );
            }

            res.render("user/checkout", {
                user: user,
                cart: cart
            });

        })
        .catch((error) => {

            console.log(error);

            res.status(500).send(
                "Failed to load checkout"
            );

        });
};


// PLACE COD ORDER
const placeOrder = (req, res) => {

    const userId = req.session.userId;

    const {
        name,
        phone,
        address,
        paymentMethod
    } = req.body;

    if (!name || !phone || !address) {

        return res.redirect(
            "/orders/checkout?error=Please%20fill%20all%20customer%20details"
        );

    }

    Cart.findOne({
        user: userId
    })
        .populate("products.product")
        .then((cart) => {

            if (!cart || cart.products.length === 0) {

                return res.redirect(
                    "/cart"
                );

            }

            let totalAmount = 0;
            const orderProducts = [];

            for (const item of cart.products) {

                const product = item.product;

                if (!product) {
                    return res.redirect(
                        "/cart?error=Product%20no%20longer%20exists"
                    );
                }

                if (item.quantity > product.stock) {

                    return res.redirect(
                        `/products/${product._id}?error=Only%20${product.stock}%20item(s)%20available`
                    );

                }

                totalAmount +=
                    product.price * item.quantity;

                orderProducts.push({
                    product: product._id,
                    name: product.name,
                    price: product.price,
                    quantity: item.quantity
                });

            }

            const newOrder = new Order({

                user: userId,

                products: orderProducts,

                totalAmount: totalAmount,

                customerDetails: {
                    name: name,
                    phone: phone,
                    address: address
                },

                paymentMethod:
                    paymentMethod || "COD",

                paymentStatus:
                    paymentMethod === "ONLINE"
                        ? "Pending"
                        : "Pending",

                orderStatus: "Placed"

            });

            return newOrder.save()
                .then((savedOrder) => {

                    const stockUpdates =
                        cart.products.map((item) => {

                            return Product.findByIdAndUpdate(
                                item.product._id,
                                {
                                    $inc: {
                                        stock: -item.quantity
                                    }
                                }
                            );

                        });

                    return Promise.all(stockUpdates)
                        .then(() => {

                            return Cart.findOneAndDelete({
                                user: userId
                            });

                        })
                        .then(() => {

                            res.redirect(
                                `/orders/success/${savedOrder._id}`
                            );

                        });

                });

        })
        .catch((error) => {

            console.log(error);

            res.status(500).send(
                "Failed to place order"
            );

        });

};

const getOrderSuccess = (req, res) => {

    const orderId = req.params.id;

    Order.findOne({
        _id: orderId,
        user: req.session.userId
    })
        .then((order) => {

            if (!order) {
                return res.status(404).send(
                    "Order not found"
                );
            }

            res.render("user/order-success", {
                order: order
            });

        })
        .catch((error) => {

            console.log(error);

            res.status(500).send(
                "Failed to load order"
            );

        });

};

const getMyOrders = (req, res) => {

    const userId = req.session.userId;

    Order.find({
        user: userId
    })
        .sort({ createdAt: -1 })
        .then((orders) => {

            res.render("user/orders", {
                orders: orders
            });

        })
        .catch((error) => {

            console.log(error);

            res.status(500).send(
                "Failed to load orders"
            );

        });

};

module.exports = {
    getCheckout,
    placeOrder,
    getOrderSuccess,
    getMyOrders
};