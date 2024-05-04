const mongoose = require("mongoose");
const { isEmail, isMobilePhone, isAlpha } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please enter an email"],
        unique: true,
        lowercase: [true, "Please, only lowercase"],
        validate: [(isEmail), "Please enter a valid email"],
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        minLength: [6, "Minimum password length is 6 characters"],
    },
    name: {
        type: String,
        required: [true, "Please enter a name"],
        validate: [(isAlpha), "Please enter a valid name"],
    },
    surname: {
        type: String,
        required: [true, "Please enter a surname"],
        validate: [(isAlpha), "Please enter a valid surname"],
    },
    phone: {
        type: String,
        required: [true, "Please enter a phone"],
        unique: true,
        validate: [(isMobilePhone), "Please enter a valid phone number"],
    },
    wallet: {
        PLN: {
            type: Number,
            default: 0
        },
        UAH: {
            type: Number,
            default: 0
        },
        USD: {
            type: Number,
            default: 0
        },
        EUR: {
            type: Number,
            default: 0
        }
    }
});

// fire a function after doc saved to db
userSchema.post("save", function (doc, next) {
    console.log("\nNew user was created & saved", doc, "\n");
    next();
});

// fire a function before doc saved to db 
userSchema.pre("save", async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// static method to login user
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error("Incorrect password");
    }
    throw Error("Incorrect email");
}

const User = mongoose.model("user", userSchema);

module.exports = User;