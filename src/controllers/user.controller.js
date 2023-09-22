const User = require("../models/User");

const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (user) {
      res.status(202).json({ Messege: "User Found", user });
    } else {
      res.status(404).json({ Messege: "User not found" });
    }
  } catch (err) {
    res.status(422).json({ Messege: "Something Went Wrong" });
  }
};

const edit = async (req, res) => {
    console.log("hi");
  const { Pic, Name, UserName, Address, CollegeName, Bio } = req.body;
  console.log(Pic, Name, UserName, Address, CollegeName, Bio );
  try {
    const user = await User.findByIdAndUpdate(req.user_id, { Pic, Name, UserName, Address, CollegeName, Bio } )
    if (user) {
      res.status(200).json({ Messege: "User Updated", user });
    } else {
      res.status(404).json({ Messege: "User not updated" });
    }
  } catch (err) {
    res.status(422).json({ Messege: "Something Went Wrong" });
  }
};

async function getUsersByCollegeEmail(req,res){
    const {email}=req.params;
    try{
      const users=await User.find({CollegeEmail:email});
    //   console.log(users);
      res.status(200).json({Messege: "Projects getting Successfull", data:users});
    }catch(err){
      res.status(422).json({ Messege: "Something Went Wrong" });
    }
  }

module.exports = { getUser, edit,getUsersByCollegeEmail };
