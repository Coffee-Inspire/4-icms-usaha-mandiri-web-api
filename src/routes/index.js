const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth.middleware");

// Controller
const authRouter = require("./Auth/auth.router");
const usersRouter = require("./Config/users.router");
const roleRouter = require("./Config/roles.router");
const itemCategoriesRouter = require("./Config/itemCategories.router");

router.use("/auth", authRouter);
router.use("/user", verifyToken, usersRouter);
router.use("/role", verifyToken, roleRouter);
router.use("/categories", verifyToken, itemCategoriesRouter);

// Develop Only
router.use("/tHisFoRDevELoPeR/auth", authRouter);
router.use("/tHisFoRDevELoPeR/user", usersRouter);
router.use("/tHisFoRDevELoPeR/role", roleRouter);

module.exports = router;
