const express = require("express");
const router = express.Router();

const {
	getAllRole,
	getOneByID,
	getDataSrouce,
	postCreate,
	putUpdateData,
	deleteData,
} = require("../../controllers/Config/itemCategories.controller");

router.get("/", getAllRole);
router.get("/id", getOneByID);
router.get("/datasource", getDataSrouce);
router.post("/create", postCreate);
router.put("/update", putUpdateData);
router.delete("/delete", deleteData);

module.exports = router;
