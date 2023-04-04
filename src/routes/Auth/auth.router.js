const express = require("express");
const router = express.Router();

const { postCreateUser, postLogin } = require("../../controllers/Auth/auth.controller");

router.post("/createuser", postCreateUser);
router.post("/login", postLogin);

module.exports = router;
