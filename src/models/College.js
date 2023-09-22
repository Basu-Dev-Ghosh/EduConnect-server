const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const CollegeSchema = new mongoose.Schema({
  CollegeName: {
    type: String,
    required: true,
    default:"",
  },
//   UserName: {
//     type: String,
//     required: true,
//     minlength: 3,
//   },
  CollegeEmail: {
    type: String,
    require: true,
    unique: true,
  },
  Pic: {
    type: String,
    default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.japanpowered.com%2Fanime-articles%2Fanime-high-school&psig=AOvVaw0eRzmDPeRlg1oaddo_Zkwb&ust=1695465074897000&source=images&cd=vfe&ved=0CBAQjRxqFwoTCPC7ud2BvoEDFQAAAAAdAAAAABAH",
  },
//   CollegeName: {
//     type: String,
//     default: "",
//   },
//   Bio: {
//     type: String,
//     default: "",
//   },
//   ReviewCount: {
//     type: Number,
//     default: 0,
//   },
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
    default: "college",
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
},  { timestamps: true });
CollegeSchema.pre("save", async function (next) {
  if (this.isModified("Password")) {
    this.Password = await bcrypt.hash(this.Password, 12);
    next();
  }
});
CollegeSchema.methods.generateAuthToken = async function () {
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
const College = new mongoose.model("College", CollegeSchema);
module.exports = College;
