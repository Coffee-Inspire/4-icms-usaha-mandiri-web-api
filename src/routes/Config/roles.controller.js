const express = require("express");
const { Roles } = require("../../models");
const { v4: uuidv4 } = require("uuid");
const { errorStatusHandler, successStatusHandler } = require("../helper/routesHandler");

const app = express();

// Get All Data - DEVELOPER
app.get("/tHisFoRDevELoPeR", (req, res) => {
	Roles.findAll({})
		.then((result) => {
			successStatusHandler(res, result);
		})
		.catch((e) => {
			errorStatusHandler(res, e);
		});
});

// Create Role
app.post("/create-role", (req, res) => {
	Roles.create({
		...req.body,
		id: uuidv4(),
	})
		.then((result) => {
			successStatusHandler(res, result);
		})
		.catch((e) => {
			errorStatusHandler(res, e);
		});
});

module.exports = app;
