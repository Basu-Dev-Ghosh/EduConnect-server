const express = require("express");
const router = express.Router();
const { signup, login, isAuth, logout } = require('../../controllers/auth.controller');
const auth = require("../../middlewares/Auth");
const auth2 = require("../../middlewares/Auth2");

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.get('/isauth', auth, isAuth);
router.get('/isauth/college', auth2, isAuth);



module.exports = router;