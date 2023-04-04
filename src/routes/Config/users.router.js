const express = require("express");
const router = express.Router();

const { getAllUser } = require("../../controllers/Config/users.controller");

router.get("/", getAllUser);

module.exports = router;
