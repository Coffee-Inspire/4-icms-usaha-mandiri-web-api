const { Users, Roles } = require("../../models");
const bcrypt = require("bcrypt");
const { errorStatusHandler, successStatusHandler } = require("../../helper/responseHandler");
const { paginationHandler } = require("../../helper/paginationHandler");

module.exports = {
	// Get All Data
	getAllUser: async (req, res) => {
		try {
			const { page, limit, sort, filter, search } = req.query;
			const paginate = await paginationHandler(Users, page, limit, sort, filter, search);

			const result =
				paginate.search === ""
					? await Users.findAndCountAll({
							include: Roles,
							attributes: { exclude: ["password"] },
							order: [[paginate.filter, paginate.sort]],
							limit: paginate.limit,
							offset: paginate.offset,
					  })
					: await Users.scope({ method: ["search", search] }).findAndCountAll({
							include: Roles,
							attributes: { exclude: ["password"] },
							order: [[paginate.filter, paginate.sort]],
							limit: paginate.limit,
							offset: paginate.offset,
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
				if (req?.payload?.payload?.role?.role_name === "Administrator") {
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

	deleteData: (req, res) => {
		const { id } = req.query;

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
