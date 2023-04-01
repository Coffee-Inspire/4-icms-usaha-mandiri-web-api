const express = require("express");
const { Users } = require("../models/");
const { uuid } = require("uuidv4");
const { errorStatusHandler } = require("./helper/errorHandler");

const app = express();

// Create User
app.post("/create-user", (req, res) => {
	// User.create({ ...req.body })
	// 	.then((result) => {
	// 		errorStatusHandler("bisa ???");
	// 		res.send(result);
	// 	})
	// 	.catch((e) => {
	// 		console.log("Error at Create User", e);
	// 		res.status(500).send(e);
	// 	});
	errorStatusHandler("woke");
	res.send("woke");
});

// Login
app.post("/login", (req, res) => {});

module.exports = app;
