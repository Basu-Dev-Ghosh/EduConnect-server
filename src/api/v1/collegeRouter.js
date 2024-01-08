const express = require("express");
const router = express.Router();
const {
  getAllColleges,
  getCollegeById,
} = require("../../controllers/college.controller");

router.get("/", getAllColleges);
router.get("/:email", getCollegeById);

module.exports = router;
