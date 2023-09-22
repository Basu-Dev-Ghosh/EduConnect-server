const College = require('../models/College');
const User = require('../models/User')
const bcrypt = require('bcryptjs')



// Sign up user
const signup = async (req, res) => {

    console.log(req.body);
    const { Name, UserName, Email, Password,Type ,Pic,Address} = req.body;
    if(Type === "student"){
        try {
            
            const user = await User.findOne({ Email });
            if (user) {
                res.status(409).json({ Messege: "User already Exist!" });
            } else {
                const user = new User({ Name, UserName, Email, Password,Type });
                const token = await user.generateAuthToken();
                res.cookie("jwt", token, {
                    expires: new Date(Date.now() + 50000000),
                    sameSite: "None",
                    secure: true,
                    httpOnly: true,
                });
                await user.save();
                res.status(201).json({ Messege: "Registration Successfull", user });
            }
        } catch (err) {
            res.status(422).json({ Messege: "Something Went Wrong" });
        }
    }
    else{
        try {
            const college = await College.findOne({ CollegeEmail:Email });
            if (college) {
                res.status(409).json({ Messege: "College already Exist!" });
            } else {
                const college = new College({ 
                    CollegeName: Name, 
                    CollegeEmail: Email, 
                    Address,Password,Type });
                const token = await college.generateAuthToken();
                res.cookie("jwt", token, {
                    expires: new Date(Date.now() + 50000000),
                    sameSite: "None",
                    secure: true,
                    httpOnly: true,
                });
                await college.save();
                res.status(201).json({ Messege: "Registration Successfull", user:college });
            }
        } catch (err) {
            res.status(422).json({ Messege: "Something Went Wrong" });
        }
    }
    }
    

   

// Login user
const login = async (req, res) => {
    const { UserName, Password,Type } = req.body;
    if(Type==="student"){
        try {
            const user = await User.findOne({ UserName });
            if (user) {
                const bool = await bcrypt.compare(Password, user.Password);
                if (!bool) {
                    res.status(422).json({ Messege: "Username or Password incorrect" });
                } else {
                    const token = await user.generateAuthToken();
                   
                    res.cookie("jwt", token, {
                        expires: new Date(Date.now() + 50000000),
                        sameSite: "None",
                        secure: true,
                        httpOnly: true,
                    });
                    res.status(202).json({ Messege: "Log in succesfull", user });
                }
            } else {
                res.status(404).json({ Messege: "User not Found" });
            }
        } catch (err) {
            console.log(err);
            res.status(422).json({ Messege: "Something Went wrong" });
        }
    }
        else{
            try {
                const college = await User.findOne({ CollegeEmail:UserName });
                if (college) {
                    const bool = await bcrypt.compare(Password, college.Password);
                    if (!bool) {
                        res.status(422).json({ Messege: "CollegeEmail or Password incorrect" });
                    } else {
                        const token = await college.generateAuthToken();
                       
                        res.cookie("jwt", token, {
                            expires: new Date(Date.now() + 50000000),
                            sameSite: "None",
                            secure: true,
                            httpOnly: true,
                        });
                        res.status(202).json({ Messege: "Log in succesfull", user });
                    }
                } else {
                    res.status(404).json({ Messege: "User not Found" });
                }
            } catch (err) {
                console.log(err);
                res.status(422).json({ Messege: "Something Went wrong" });
            }
        }
    }
    

//Checking Authentication
const isAuth = (req, res) => {
    res.status(200).json({ Messege: "User Authenticated", token: req.token, user: req.rootUser });
}
//Logout user
const logout = async (req, res) => {
    res.clearCookie("jwt", {
        sameSite: "None",
        secure: true,
    });
    res.status(204).json({ Messege: "Log out successfull" });
}

module.exports = { signup, login, isAuth, logout }