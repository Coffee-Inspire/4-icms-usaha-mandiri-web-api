const express = require("express");
const router = express.Router();

const {
	getAllRole,
	getOneByID,
	postCreate,
	putUpdateData,
	deleteData,
	getBalance,
} = require("../../controllers/Goods/journal.controller");

router.get("/", getAllRole);
router.get("/id", getOneByID);
router.post("/create", postCreate);
router.get("/getBalance", getBalance);
router.put("/update", putUpdateData);
// router.delete("/delete", deleteData);

module.exports = router;
