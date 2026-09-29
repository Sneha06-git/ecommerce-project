const authMiddleware = (req, res, next) => {

    if (req.session.userId) {
        next();
    } else {
        res.redirect("/auth/login?error=Please%20login%20first");
    }
};

module.exports = authMiddleware;