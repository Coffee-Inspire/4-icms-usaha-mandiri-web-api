const express = require("express");
const router = express.Router();

const { getAllRole, getOneByID, postCreateRole } = require("../../controllers/Config/roles.controller");

router.get("/", getAllRole);
router.get("/id", getOneByID);
router.post("/create-role", postCreateRole);

module.exports = router;
