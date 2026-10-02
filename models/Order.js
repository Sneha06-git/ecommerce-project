const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },

                name: {
                    type: String,
                    required: true
                },

                price: {
                    type: Number,
                    required: true
                },

                quantity: {
                    type: Number,
                    required: true
                }
            }
        ],

        totalAmount: {
            type: Number,
            required: true
        },

        customerDetails: {
            name: {
                type: String,
                required: true
            },

            phone: {
                type: String,
                required: true
            },

            address: {
                type: String,
                required: true
            }
        },

        paymentMethod: {
            type: String,
            enum: ["COD", "ONLINE"],
            required: true
        },

        paymentStatus: {
            type: String,
            enum: ["Pending", "Paid", "Failed"],
            default: "Pending"
        },

        orderStatus: {
            type: String,
            enum: [
                "Placed",
                "Processing",
                "Shipped",
                "Delivered",
                "Cancelled"
            ],
            default: "Placed"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Order", orderSchema);