const express = require("express");
const router = express.Router();

const { postCreateUser, postLogin, postVerify } = require("../../controllers/Auth/auth.controller");

router.post("/createuser", postCreateUser);
router.post("/login", postLogin);
router.post("/verify", postVerify);

module.exports = router;
