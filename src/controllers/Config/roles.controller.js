const express = require("express");
const { Roles } = require("../../models");
const { v4: uuidv4 } = require("uuid");
const { errorStatusHandler, successStatusHandler } = require("../../helper/responseHandler");

const app = express();

module.exports = {
	// Get All Data
	getAllRole: (req, res) => {
		Roles.findAll({})
			.then((result) => {
				successStatusHandler(res, result);
			})
			.catch((e) => {
				errorStatusHandler(res, e);
			});
	},

	// Create Role
	postCreateRole: (req, res) => {
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
	},
};
