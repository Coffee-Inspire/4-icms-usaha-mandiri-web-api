const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth.middleware");

// Controller
const authRouter = require("./Auth/auth.router");
const usersRouter = require("./Config/users.router");
const roleRouter = require("./Config/roles.router");
const itemCategoryRouter = require("./Config/itemCategories.router");

const stockRouter = require("./Inventory/stocks.router");
const guestRouter = require("./Inventory/guests.router");
const suppliersRouter = require("./Inventory/suppliers.router");

const incomingRouter = require("./Goods/incomings.router");
const incomingDetailsRouter = require("./Goods/incomingsDetails.router");
const outgoingRouter = require("./Goods/outgoings.router");
const outgoingDetailsRouter = require("./Goods/outgoingDetails.router");
const journalRouter = require("./Goods/journal.router");

router.use("/auth", authRouter);
router.use("/user", verifyToken, usersRouter);
router.use("/role", verifyToken, roleRouter);
router.use("/category", verifyToken, itemCategoryRouter);

router.use("/stock", verifyToken, stockRouter);
router.use("/guest", verifyToken, guestRouter);
router.use("/supplier", verifyToken, suppliersRouter);

router.use("/incomings", verifyToken, incomingRouter);
router.use("/incomingDetails", verifyToken, incomingDetailsRouter);
router.use("/outgoings", verifyToken, outgoingRouter);
router.use("/outgoingDetails", verifyToken, outgoingDetailsRouter);
router.use("/journal", verifyToken, journalRouter);

// Develop Only
// router.use("/tHisFoRDevELoPeR/auth", authRouter);
// router.use("/tHisFoRDevELoPeR/user", usersRouter);
// router.use("/tHisFoRDevELoPeR/role", roleRouter);
// router.use("/tHisFoRDevELoPeR/category", itemCategoryRouter);
// router.use("/tHisFoRDevELoPeR/supplier", stockRouter);
// router.use("/tHisFoRDevELoPeR/supplier", guestRouter);
// router.use("/tHisFoRDevELoPeR/supplier", suppliersRouter);

module.exports = router;
