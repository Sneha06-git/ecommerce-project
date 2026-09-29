const User = require("../models/User");
const bcrypt = require("bcrypt");

// REGISTER USER
const registerUser = (req, res) => {
    const { name, email, password, phone, address } = req.body;

    // Check if all fields are filled
    if (!name || !email || !password || !phone || !address) {
        return res.redirect("/auth/register?error=Please%20fill%20all%20fields");
    }

    // Check if user already exists
    User.findOne({ email: email })
        .then((existingUser) => {
            if (existingUser) {
                return res.redirect("/auth/register?error=User%20already%20exists");
            }

            // Hash password
            return bcrypt.hash(password, 10);
        })
        .then((hashedPassword) => {
            if (!hashedPassword) return;

            // Create new user
            const newUser = new User({
                name: name,
                email: email,
                password: hashedPassword,
                phone: phone,
                address: address
            });

            return newUser.save();
        })
        .then((user) => {
            if (!user) return;

           res.redirect("/auth/register?message=Registration%20successful");
        })
        .catch((error) => {
            console.log(error);
            res.redirect("/auth/register?error=Registration%20failed");
        });
};


/// LOGIN USER
const loginUser = (req, res) => {
    const { email, password } = req.body;
    
    // Check if fields are filled
    if (!email || !password) {
        return res.redirect( "/auth/login?error=Please%20enter%20email%20and%20password");
    }

    // Find user by email
    User.findOne({ email: email })
        .then((user) => {
            
            if (!user) {
                throw new Error("Invalid email or password");
            }

            // Compare password
            return bcrypt.compare(password, user.password)
                .then((isMatch) => {

                    if (!isMatch) {
                        throw new Error("Invalid email or password");
                    }

                    // Create session
                    req.session.userId = user._id;
                    req.session.userName = user.name;
                    req.session.userRole = user.role;

                    return req.session.save();
                });
        })
        .then(() => {
            res.redirect("/auth/login?message=Login%20successful");
        })
        .catch((error) => {
            console.log(error.message);

            res.redirect(
                "/auth/login?error=Invalid%20email%20or%20password"
            );
        });
};


// LOGOUT USER
const logoutUser = (req, res) => {
    req.session.destroy((error) => {

        if (error) {
            console.log(error);

            return res.redirect("/auth/login?error=Logout%20failed");
        }

        res.redirect("/auth/login?message=Logout%20successful");
    });
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser
};