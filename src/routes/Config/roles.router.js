const express = require("express");
const router = express.Router();

const { getAllRole, getDataSrouce, getOneByID, postCreateRole } = require("../../controllers/Config/roles.controller");

router.get("/", getAllRole);
router.get("/datasource", getDataSrouce);
router.get("/id", getOneByID);
router.post("/create-role", postCreateRole);

module.exports = router;
