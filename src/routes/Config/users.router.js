const express = require("express");
const router = express.Router();

const { getAllUser, getOneByID, putUpdateData } = require("../../controllers/Config/users.controller");

router.get("/", getAllUser);
router.get("/:id", getOneByID);
router.put("/update", putUpdateData);

module.exports = router;
