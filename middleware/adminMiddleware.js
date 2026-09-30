const adminMiddleware = (req, res, next) => {

    if (req.session.userId && req.session.userRole === "admin") {
        next();
    } else {
        res.redirect("/auth/login?error=Admin%20access%20required");
    }
};

module.exports = adminMiddleware;