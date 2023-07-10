const { Users, Roles } = require("../../models");
const bcrypt = require("bcrypt");
const { errorStatusHandler, successStatusHandler } = require("../../helper/responseHandler");
const { sortFilterPaginateHandler } = require("../../helper/sortFilterPaginateHandler");
const { Op } = require("sequelize");

module.exports = {
	// Get All Data
	getAllUser: async (req, res) => {
		try {
			const paginate = await sortFilterPaginateHandler(req.query);
			const result =
				paginate.search === ""
					? await Users.findAndCountAll({
							include: {
								model: Roles,
								where: {
									...paginate.role,
								},
							},
							attributes: { exclude: ["password"] },
							order: [[paginate.filter, paginate.sort]],
							limit: paginate.limit,
							offset: paginate.offset,
							where: {
								[Op.and]: [{ ...paginate.status }],
							},
					  })
					: await Users.scope({ method: ["search", paginate.search] }).findAndCountAll({
							include: {
								model: Roles,
								where: {
									...paginate.role,
								},
							},
							attributes: { exclude: ["password"] },
							order: [[paginate.filter, paginate.sort]],
							limit: paginate.limit,
							offset: paginate.offset,
							where: {
								...paginate.status,
							},
					  });

			successStatusHandler(res, result);
		} catch (e) {
			errorStatusHandler(res, e);
		}
	},

	// Get Single Data
	getOneByID: (req, res) => {
		const { id } = req.query;
		Users.findOne({
			include: Roles,
			where: { id },
			attributes: { exclude: ["password"] },
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

		if (Number(id) === 1) return errorStatusHandler(res, "super_user_delete");
		if (!id) return errorStatusHandler(res, "", "missing_body");

		Users.findOne({ where: { id } }).then((result) => {
			if (!result) {
				errorStatusHandler(res, "", "not_found");
			} else {
				Users.update({ ...req.body }, { where: { id } })
					.then((result) => {
						if (result[0] === 1) {
							successStatusHandler(res, "Success Update");
						} else {
							errorStatusHandler(res, "", "update_failed");
						}
					})
					.catch((e) => {
						errorStatusHandler(res, e);
					});
			}
		});
	},

	changePass: (req, res) => {
		const id = req.payload.id;
		const passCur = req.body.password_current;
		const passNew = req.body.password_new;
		const saltRounds = Number(process.env.SALT) ?? 10;

		console.log("cek saja ", Number(id));
		console.log("cek lagi ", Number(id) === 1);
		if (Number(id) === 1) return errorStatusHandler(res, "super_user_delete");
		if (!passCur || !passNew) return errorStatusHandler(res, "", "missing_body");

		Users.findOne({ where: { id } }).then((result) => {
			if (!result) {
				errorStatusHandler(res, "", "not_found");
				return;
			}

			bcrypt.compare(passCur, result.password, (err, compareResult) => {
				if (err) return errorStatusHandler(res, err);

				if (compareResult) {
					bcrypt.hash(passNew, saltRounds, (err, hashPassword) => {
						if (err) {
							errorStatusHandler(res, err);
						} else {
							Users.update({ password: hashPassword }, { where: { id } })
								.then((doneUpdate) => {
									if (doneUpdate[0] === 1) {
										successStatusHandler(res, "Success Update");
									} else {
										errorStatusHandler(res, "", "update_failed");
									}
								})
								.catch((e) => {
									errorStatusHandler(res, e);
								});
						}
					});
				} else {
					errorStatusHandler(res, "", "compare_failed");
				}
			});
		});
	},

	deleteData: (req, res) => {
		const { id } = req.query;

		if (Number(id) === 1) return errorStatusHandler(res, "super_user_delete");

		Users.destroy({
			where: { id },
		})
			.then((result) => {
				if (result === 1) {
					successStatusHandler(res, "Success Delete");
				} else {
					errorStatusHandler(res, "", "delete_failed");
				}
			})
			.catch((e) => {
				errorStatusHandler(res, e);
			});
	},
};
