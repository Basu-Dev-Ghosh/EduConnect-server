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
    minlength: 3,
  },
  Email: {
    type: String,
    require: true,
    unique: true,
  },
  Pic: {
    type: String,
    default: "",
  },
  CollegeName: {
    type: String,
    default: "",
  },
  Bio: {
    type: String,
    default: "",
  },
  ReviewCount: {
    type: Number,
    default: 0,
  },
  Address:{
    type: String,
    default: "",
  },
  Password: {
    type: String,
    minlength: 6,
  },
  Type: {
    type: String,
    default: "students",
    required: true,
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
    this.Password = await bcrypt.hash(this.Password, 12);
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
    console.log(err);
    return null;
  }
};
const User = new mongoose.model("User", UserSchema);
module.exports = User;
