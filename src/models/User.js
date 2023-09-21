const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
    },
    UserName: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        unique: true,
    },
    Password: {
        type: String,
    },
    Type: {
        type: String,
        default:'students',
        required:true,
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            },
        },
    ],
});
UserSchema.pre("save", async function (next) {
    if (this.isModified("Password")) {
        this.Password = await  bcrypt.hash(this.Password, 12);
        next();
    }
});
UserSchema.methods.generateAuthToken = async function () {
    try {
        const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (err) {
        return null;
    }
};
const User = new mongoose.model("User", UserSchema);
module.exports = User;