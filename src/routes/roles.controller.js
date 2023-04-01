const express = require("express");
const { Roles } = require("../models/");
const { uuid } = require("uuidv4");
const { errorStatusHandler } = require("./helper/errorHandler");

const app = express();

// Create Role
app.post("/create-role", (req, res) => {
	Roles.create({
		...req.body,
		id: uuid(),
	})
		.then((result) => {
			res.send(result);
		})
		.catch((e) => {
			errorStatusHandler(res, e);
		});
});

module.exports = app;
