const express = require("express");
const { Users } = require("../../models");
const { v4: uuidv4 } = require("uuid");
const { errorStatusHandler, successStatusHandler } = require("../helper/routesHandler");

const app = express();

// Get All Data - DEVELOPER
app.get("/tHisFoRDevELoPeR", (req, res) => {
	Users.findAll({})
		.then((result) => {
			successStatusHandler(res, result);
		})
		.catch((e) => {
			errorStatusHandler(res, e);
		});
});

module.exports = app;
