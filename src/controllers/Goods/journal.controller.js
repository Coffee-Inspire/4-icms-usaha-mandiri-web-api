const { Journal, Incoming, Outgoing } = require("../../models");
const { errorStatusHandler, successStatusHandler } = require("../../helper/responseHandler");
const { sortFilterPaginateHandler } = require("../../helper/sortFilterPaginateHandler");

module.exports = {
	// Get All Data
	getAllRole: async (req, res) => {
		try {
			const paginate = await sortFilterPaginateHandler(req.query);

			const result =
				paginate.search === ""
					? await Journal.findAndCountAll({
							order: [[paginate.filter, paginate.sort]],
							limit: paginate.limit,
							offset: paginate.offset,
							where: {
								...paginate.journalType,
							},
					  })
					: await Journal.scope({ method: ["search", paginate.search] }).findAndCountAll({
							order: [[paginate.filter, paginate.sort]],
							limit: paginate.limit,
							offset: paginate.offset,
							where: {
								...paginate.journalType,
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
		Journal.findOne({
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
	postCreate: async (req, res) => {
		let lastBalance = await Journal.findOne({
			attributes: ["balance"],
			order: [["created_at", "DESC"]],
		});

		let currentBalance = lastBalance?.balance;
		if (!currentBalance) {
			currentBalance = 0;
		}

		Journal.create({
			note: req.body.note,
			type: req.body.type,
			mutation: req.body.mutation,
			balance: currentBalance - req.body.mutation,
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

		if (!id) return errorStatusHandler(res, "", "missing_body");

		Journal.findOne({ where: { id } }).then((result) => {
			if (!result) {
				errorStatusHandler(res, "", "not_found");
			} else {
				Journal.update({ ...req.body }, { where: { id } })
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

	deleteData: (req, res) => {
		const { id } = req.query;

		Journal.destroy({
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

	getBalance: (req, res) => {
		Journal.findOne({
			attributes: ["balance"],
			order: [["created_at", "DESC"]],
		})
			.then((result) => {
				if (result) {
					successStatusHandler(res, result);
				} else {
					successStatusHandler(res, { balance: "0" });
				}
			})
			.catch((e) => {
				errorStatusHandler(res, e);
			});
	},
};
