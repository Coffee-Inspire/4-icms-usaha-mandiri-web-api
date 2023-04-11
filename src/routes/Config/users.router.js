const express = require("express");
const router = express.Router();

const { getAllUser, getOneByID, putUpdateData, deleteData } = require("../../controllers/Config/users.controller");

router.get("/", getAllUser);
router.get("/id", getOneByID);
router.put("/update", putUpdateData);
router.delete("/delete", deleteData);

module.exports = router;
