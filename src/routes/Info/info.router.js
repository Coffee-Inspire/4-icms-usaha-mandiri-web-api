const express = require("express");
const router = express.Router();

const {
	getActivityCount,
	getJournalProgress,
	getDebts,
	getTransactions,
	getCurrentProfit,
	getProfits,
} = require("../../controllers/Info/info.controller");

router.get("/activityCount", getActivityCount);
router.get("/journalProgress", getJournalProgress);
router.get("/debts", getDebts);
router.get("/transactions", getTransactions);
router.get("/currentProfit", getCurrentProfit);
router.get("/profits", getProfits);

// router.get("/", getAllRole);
// router.get("/datasource", getDataSrouce);
// router.get("/id", getOneByID);
// router.post("/create", postCreate);
// router.put("/update", putUpdateData);
// router.delete("/delete", deleteData);

module.exports = router;
