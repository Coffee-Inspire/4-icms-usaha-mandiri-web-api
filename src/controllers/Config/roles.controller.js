const { Roles } = require("../../models");
const { errorStatusHandler, successStatusHandler } = require("../../helper/responseHandler");

module.exports = {
	// Get All Data
	getAllRole: (req, res) => {
		Roles.findAndCountAll({})
			.then((result) => {
				successStatusHandler(res, result);
			})
			.catch((e) => {
				errorStatusHandler(res, e);
			});
	},

	// Get Data Source
	getDataSrouce: (req, res) => {
		Roles.findAll({
			attributes: [
				["id", "value"],
				["role_name", "label"],
			],
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
		const { id } = req.query;
		Roles.findOne({
			where: { id },
		})
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
		})
			.then((result) => {
				successStatusHandler(res, result);
			})
			.catch((e) => {
				errorStatusHandler(res, e);
			});
	},
};
