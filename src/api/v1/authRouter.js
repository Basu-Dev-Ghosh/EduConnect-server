const express = require("express");
const router = express.Router();
const { signup, login, isAuth, logout } = require('../../controllers/auth.controller');
const auth = require("../../middlewares/Auth");

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.get('/isauth', auth, isAuth);



module.exports = router;