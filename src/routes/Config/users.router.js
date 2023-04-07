const express = require("express");
const router = express.Router();

const { getAllUser, getOneByID } = require("../../controllers/Config/users.controller");

router.get("/", getAllUser);
router.get("/:id", getOneByID);

module.exports = router;
