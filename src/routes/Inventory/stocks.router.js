const express = require("express");
const router = express.Router();

const {
	getAllRole,
	getDataSrouce,
	getOneByID,
	postCreate,
	putUpdateData,
	deleteData,
} = require("../../controllers/Inventory/stocks.controller");

router.get("/", getAllRole);
router.get("/datasource", getDataSrouce);
router.get("/id", getOneByID);
router.post("/create", postCreate);
router.put("/update", putUpdateData);
router.delete("/delete", deleteData);

module.exports = router;
