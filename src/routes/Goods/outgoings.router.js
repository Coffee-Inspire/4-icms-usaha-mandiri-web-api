const express = require("express");
const router = express.Router();

const {
	getAllRole,
	getOneByID,
	postCreate,
	putUpdateData,
	getDataSrouce,
	deleteData,
} = require("../../controllers/Goods/outgoings.controller");

router.get("/", getAllRole);
router.get("/datasource", getDataSrouce);
router.get("/id", getOneByID);
router.post("/create", postCreate);
router.put("/update", putUpdateData);
// router.delete("/delete", deleteData);

module.exports = router;
