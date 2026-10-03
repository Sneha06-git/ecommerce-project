const Cart = require("../models/Cart");

const cartMiddleware = (req, res, next) => {

    // If user is not logged in
    if (!req.session.userId) {
        res.locals.cartItemCount = 0;
        return next();
    }

    Cart.findOne({
        user: req.session.userId
    })
        .then((cart) => {

            let count = 0;

            if (cart) {

                cart.products.forEach((item) => {
                    count += item.quantity;
                });

            }

            res.locals.cartItemCount = count;

            next();

        })
        .catch((error) => {

            console.log(error);

            res.locals.cartItemCount = 0;

            next();

        });
};

module.exports = cartMiddleware;