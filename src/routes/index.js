const express = require("express");
const router = express.Router();

// Controller
const authRouter = require("./Auth/auth.router");
const usersRouter = require("./Config/users.router");
const roleRouter = require("./Config/roles.router");

router.use("/auth", authRouter);
router.use("/user", usersRouter);
router.use("/role", roleRouter);

// Develop Only
router.use("/tHisFoRDevELoPeR/auth", authRouter);
router.use("/tHisFoRDevELoPeR/user", usersRouter);
router.use("/tHisFoRDevELoPeR/role", roleRouter);

module.exports = router;
