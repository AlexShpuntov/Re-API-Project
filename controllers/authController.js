const User = require("../models/User");
const jwt = require("jsonwebtoken");

// handle errors
const handleErrors = (error) => {
    console.log("\n", error.message, "\n", error.code,"\n");
    let errors = { 
        email: "",
        password: "",
        name: "",
        surname: "",
        phone: ""
    };

    // incorrect email
    if (error.message === "Incorrect email") {
        errors.email = "That email is not registered";
    }

    // incorrect password
    if (error.message === "Incorrect password") {
        errors.password = "That password is incorrect";
    }

    // duplicate error code
    if (error.code === 11000) {
        const indexNames = Object.keys(error.keyPattern);
        indexNames.forEach((indexName) => {
            if (indexName === "email") {
                errors.email = "Email is already registered";
            } else if (indexName === "phone") {
                errors.phone = "Phone number is already registered";
            }
        });

        return errors;
    }    

    // validation errors
    if (error.message.includes("user validation failed")) {
        Object.values(error.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors;
};

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, "mettel bach secret", {
        expiresIn: maxAge
    });
}

module.exports.signup_get = (req, res) => {
    res.render("signup");
}

module.exports.signin_get = (req, res) => {
    res.render("signin");
}

module.exports.signup_post = async (req, res) => {
    const { email, password, name, surname, phone } = req.body;

    try {
        const user = await User.create({ email, password, name, surname, phone });
        const token = createToken(user._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id });
    } catch (error) {
        const errors = handleErrors(error);
        res.status(400).json({ errors });
    }
}

module.exports.signin_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });
    } catch (error) {
        const errors = handleErrors(error);
        res.status(400).json({ errors });
    }
}

module.exports.logout_get = (req, res) => {
    res.clearCookie("jwt");
    res.redirect("/");
}

module.exports.delete_account = async (req, res) => {
    const userId = req.params.id;

    try {
        await User.findByIdAndDelete(userId);
        res.clearCookie("jwt");
        res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports.update_profile = async (req, res) => {
    const userId = req.params.id;
    const { name, surname, phone, email, newPassword } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (name) user.name = name;
        if (surname) user.surname = surname;
        if (phone) user.phone = phone;
        if (email) user.email = email;
        if (newPassword) user.password = newPassword;

        await user.save();

        const token = createToken(user._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });

        res.status(200).json({ success: true, message: "Profile updated successfully" });
    } catch (error) {
        const errors = handleErrors(error);
        res.status(400).json({ errors });
    }
};