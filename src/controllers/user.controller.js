const User = require('../models/User')



const getUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (user) {
            res.status(202).json({ Messege: "User Found", user })
        } else {
            res.status(404).json({ Messege: "User not found" })
        }

    } catch (err) {
        res.status(422).json({ Messege: "Something Went Wrong" });
    }

}


module.exports = { getUser }