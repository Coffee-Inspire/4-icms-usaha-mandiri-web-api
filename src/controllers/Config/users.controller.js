const express = require("express");
const { Users, Roles } = require("../../models");
const { v4: uuidv4 } = require("uuid");
const { errorStatusHandler, successStatusHandler } = require("../../helper/responseHandler");

const app = express();

module.exports = {
	// Get All Data
	getAllUser: (req, res) => {
		Users.findAll({
			include: Roles,
		})
			.then((result) => {
				successStatusHandler(res, result);
			})
			.catch((e) => {
				errorStatusHandler(res, e);
			});
	},

	// Get Single Data
	getOneByID: (req, res) => {
		const id = req.params.id;
		Users.findOne({
			where: { id },
			include: Roles,
		})
			.then((result) => {
				successStatusHandler(res, result);
			})
			.catch((e) => {
				errorStatusHandler(res, e);
			});
	},
};
