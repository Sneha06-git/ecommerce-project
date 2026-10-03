const User = require("../models/User");


// GET ALL CUSTOMERS

const getAllCustomers = (req, res) => {

    User.find({ role: "user" })
        .sort({ createdAt: -1 })
        .then((customers) => {

            res.render("admin/customers", {
                customers: customers
            });

        })
        .catch((error) => {

            console.log(error);

            res.status(500).send(
                "Failed to load customers"
            );

        });

};


module.exports = {
    getAllCustomers
};