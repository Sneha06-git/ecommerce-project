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
                return res.redirect("/cart");
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


    // =========================
    // BASIC CUSTOMER VALIDATION
    // =========================

    const customerName = name ? name.trim() : "";
    const customerPhone = phone ? phone.trim() : "";
    const customerAddress = address ? address.trim() : "";


    if (!customerName || !customerPhone || !customerAddress) {

        return res.redirect(
            "/orders/checkout?error=Please%20fill%20all%20customer%20details"
        );

    }


    // =========================
    // PHONE VALIDATION
    // =========================

    if (!/^[0-9]{10}$/.test(customerPhone)) {

        return res.redirect(
            "/orders/checkout?error=Please%20enter%20a%20valid%2010-digit%20phone%20number"
        );

    }


    // =========================
    // PAYMENT METHOD VALIDATION
    // =========================

    if (paymentMethod !== "COD") {

        return res.redirect(
            "/orders/checkout?error=Only%20Cash%20on%20Delivery%20is%20available"
        );

    }


    // =========================
    // FIND USER CART
    // =========================

    Cart.findOne({
        user: userId
    })
        .populate("products.product")
        .then((cart) => {

            if (!cart || cart.products.length === 0) {

                return res.redirect("/cart");

            }


            // =========================
            // CALCULATE ORDER TOTAL
            // =========================

            let totalAmount = 0;

            const orderProducts = [];


            for (const item of cart.products) {

                const product = item.product;


                // Product no longer exists
                if (!product) {

                    return res.redirect(
                        "/cart?error=Product%20no%20longer%20exists"
                    );

                }


                // Quantity validation
                if (
                    !Number.isInteger(item.quantity) ||
                    item.quantity <= 0
                ) {

                    return res.redirect(
                        "/cart?error=Invalid%20product%20quantity"
                    );

                }


                // Stock validation
                if (item.quantity > product.stock) {

                    return res.redirect(
                        `/products/${product._id}?error=Only%20${product.stock}%20item(s)%20available`
                    );

                }


                // Calculate total using database price
                totalAmount +=
                    product.price * item.quantity;


                // Save product snapshot in order
                orderProducts.push({

                    product: product._id,

                    name: product.name,

                    price: product.price,

                    quantity: item.quantity

                });

            }


            // =========================
            // CREATE ORDER
            // =========================

            const newOrder = new Order({

                user: userId,

                products: orderProducts,

                totalAmount: totalAmount,

                customerDetails: {

                    name: customerName,

                    phone: customerPhone,

                    address: customerAddress

                },

                paymentMethod: "COD",

                paymentStatus: "Pending",

                orderStatus: "Placed"

            });


            return newOrder.save()

                .then((savedOrder) => {


                    // =========================
                    // REDUCE PRODUCT STOCK
                    // =========================

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


                            // =========================
                            // CLEAR USER CART
                            // =========================

                            return Cart.findOneAndDelete({
                                user: userId
                            });

                        })

                        .then(() => {


                            // =========================
                            // ORDER SUCCESS PAGE
                            // =========================

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


// SHOW ORDER SUCCESS
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


// SHOW USER ORDERS
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


// SHOW ALL ORDERS FOR ADMIN
const getAllOrders = (req, res) => {

    Order.find()
        .populate("user")
        .sort({ createdAt: -1 })
        .then((orders) => {

            res.render("admin/orders", {
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


// SHOW ADMIN ORDER DETAILS
const getAdminOrderDetails = (req, res) => {

    const orderId = req.params.id;

    Order.findById(orderId)
        .populate("user")
        .then((order) => {

            if (!order) {

                return res.status(404).send(
                    "Order not found"
                );

            }

            res.render("admin/order-details", {
                order: order
            });

        })
        .catch((error) => {

            console.log(error);

            res.status(500).send(
                "Failed to load order details"
            );

        });

};


// UPDATE ORDER STATUS
const updateOrderStatus = (req, res) => {

    const orderId = req.params.id;

    const { orderStatus } = req.body;


    // =========================
    // ALLOWED ORDER STATUSES
    // =========================

    const allowedStatuses = [

        "Placed",

        "Processing",

        "Shipped",

        "Delivered",

        "Cancelled"

    ];


    if (!allowedStatuses.includes(orderStatus)) {

        return res.status(400).send(
            "Invalid order status"
        );

    }


    Order.findByIdAndUpdate(

        orderId,

        {
            orderStatus: orderStatus
        },

        { new: true }

    )
        .then((order) => {

            if (!order) {

                return res.status(404).send(
                    "Order not found"
                );

            }

            res.redirect(
                `/admin/orders/${order._id}`
            );

        })
        .catch((error) => {

            console.log(error);

            res.status(500).send(
                "Failed to update order status"
            );

        });

};


module.exports = {

    getCheckout,
    placeOrder,
    getOrderSuccess,
    getMyOrders,
    getAllOrders,
    getAdminOrderDetails,
    updateOrderStatus
};