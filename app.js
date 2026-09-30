const express = require("express");
const dotenv = require("dotenv");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 4000;


// DATABASE

connectDB();


// VIEW ENGINE
app.set("view engine", "ejs");
app.set("views", "./views");


// MIDDLEWARE

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
// SESSION

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,

        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI
        }),

        cookie: {
            maxAge: 1000 * 60 * 60 * 24
        }
    })
);

// AUTH ROUTES
app.use("/auth", authRoutes);

// ADMIN ROUTES
app.use("/admin", adminRoutes);


// HOME PAGE
app.get("/", (req, res) => {
    res.send("E-Commerce Website is running!");
});

// 404

app.use((req, res) => {
    res.status(404).send("Page not found");
});


// START SERVER

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});