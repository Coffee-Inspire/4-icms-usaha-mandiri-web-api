const express = require("express");
const router = express.Router();

// Controller
const usersRouter = require("./users.controller");
const roleRouter = require("./roles.controller");

router.use("/user", usersRouter);
router.use("/role", roleRouter);

module.exports = router;
