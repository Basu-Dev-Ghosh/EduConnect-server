const express = require("express");
const router = express.Router();
const { getUser,edit } = require('../../controllers/user.controller');
const auth = require("../../middlewares/Auth");

router.get('/:id', getUser)
router.post('/edit',auth, edit)





module.exports = router;