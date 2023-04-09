const express = require("express");
const { Users, Roles } = require("../../models");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
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

	// Update Data
	putUpdateData: (req, res) => {
		const id = req.body.id;
		const passCur = req.body.password_current;
		const passNew = req.body.password_new;
		const saltRounds = Number(process.env.SALT) ?? 10;

		if (!id) return errorStatusHandler(res, "", "missing_body");

		const updateData = (pass) => {
			Users.update({ ...req.body, [pass && "password"]: pass }, { where: { id } })
				.then((result) => {
					successStatusHandler(res, "Success Update");
				})
				.catch((e) => {
					errorStatusHandler(res, e);
				});
		};

		const hashNewPass = () => {
			bcrypt.hash(passNew, saltRounds, (err, hashPassword) => {
				if (err) {
					errorStatusHandler(res, err);
				} else {
					updateData(hashPassword);
				}
			});
		};

		Users.findOne({ where: { id } }).then((result) => {
			if (!result) {
				errorStatusHandler(res, "", "not_found");
			} else {
				// IF ADMIN update
				if (req?.payload?.payload?.role?.role_name === "Admin") {
					if (passNew) {
						hashNewPass();
					} else {
						updateData();
					}
				} else {
					bcrypt.compare(passCur, result.password, (err, compareResult) => {
						if (err) return errorStatusHandler(res, err);

						if (compareResult) {
							if (passNew) {
								hashNewPass();
							} else {
								updateData();
							}
						} else {
							errorStatusHandler(res, "", "compare_failed");
						}
					});
				}
			}
		});
	},
};
