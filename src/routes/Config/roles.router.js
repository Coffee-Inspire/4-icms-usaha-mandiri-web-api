const express = require("express");
const router = express.Router();

const { getAllRole, postCreateRole } = require("../../controllers/Config/roles.controller");

router.get("/", getAllRole);
router.post("/create-role", postCreateRole);

module.exports = router;
