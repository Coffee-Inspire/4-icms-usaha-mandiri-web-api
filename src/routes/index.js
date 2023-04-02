const express = require("express");
const router = express.Router();

// Controller
const authRouter = require("./Auth/auth.controller");
const usersRouter = require("./Config/users.controller");
const roleRouter = require("./Config/roles.controller");

router.use("/auth", authRouter);
router.use("/user", usersRouter);
router.use("/role", roleRouter);

module.exports = router;
