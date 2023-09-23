const College = require("../models/College");


async function getAllColleges(req, res) {
    console.log('hi');
  try {
    const colleges = await College.find(
      {},
      { _id: 1, CollegeName: 1, CollegeEmail: 1 }
    );
    console.log(colleges);
    //   console.log(users);
    res.status(200).json({ Messege: "Projects getting Successfull", data: colleges });
  } catch (err) {
    console.log(err);
    res.status(422).json({ Messege: "Something Went Wrong" });
  }
}

module.exports = { getAllColleges };