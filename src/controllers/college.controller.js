const College = require("../models/College");

async function getAllColleges(req, res) {
  try {
    const colleges = await College.find(
      {},
      { _id: 1, CollegeName: 1, CollegeEmail: 1,Address:1,Pic:1 }
    );
    res
      .status(200)
      .json({ Messege: "Projects getting Successfull", data: colleges });
  } catch (err) {
    console.log(err);
    res.status(422).json({ Messege: "Something Went Wrong" });
  }
}
async function getCollegeById(req, res) {
  const { email } = req.params;
  console.log(email);
  try {
    const college = await College.find({ CollegeEmail: email });
    console.log(college);
    res
      .status(200)
      .json({ Messege: "College getting Successfull", data: college[0] });
  } catch (err) {
    res.status(422).json({ Messege: "Something Went Wrong" });
  }
}

module.exports = { getAllColleges, getCollegeById };
