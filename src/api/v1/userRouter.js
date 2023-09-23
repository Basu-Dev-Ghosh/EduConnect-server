const express = require("express");
const router = express.Router();
const { getUser,edit, getUsersByCollegeEmail,getAllColleges } = require('../../controllers/user.controller');
const auth = require("../../middlewares/Auth");
const auth2 = require("../../middlewares/Auth2");


router.get('/:id', getUser)
router.post('/edit',auth, edit)
router.get('/college/:email',auth2, getUsersByCollegeEmail)






module.exports = router;