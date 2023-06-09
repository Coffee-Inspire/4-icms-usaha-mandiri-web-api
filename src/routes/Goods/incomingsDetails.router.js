const express = require("express");
const router = express.Router();

const {
	getAllRole,
	getOneByID,
	postCreate,
	putUpdateData,
	deleteData,
} = require("../../controllers/Goods/incomingsDetails.controller");

router.get("/", getAllRole);
router.get("/id", getOneByID);
// router.post("/create", postCreate);
router.put("/update", putUpdateData);
router.delete("/delete", deleteData);

module.exports = router;
