const { Journal, Incoming, Outgoing } = require("../../models");
const { errorStatusHandler, successStatusHandler } = require("../../helper/responseHandler");
const { sortFilterPaginateHandler } = require("../../helper/sortFilterPaginateHandler");
const sequelize = require("../../config/db");
const { Op } = require("sequelize");

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
								[Op.and]: [{ ...paginate.journalType }, { [Op.not]: [{ mutation: 0 }] }],
							},
					  })
					: await Journal.scope({ method: ["search", paginate.search] }).findAndCountAll({
							order: [[paginate.filter, paginate.sort]],
							limit: paginate.limit,
							offset: paginate.offset,
							where: {
								[Op.and]: [{ ...paginate.journalType }, { [Op.not]: [{ mutation: 0 }] }],
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
			where: { [Op.and]: [{ id }, { [Op.not]: [{ mutation: 0 }] }] },
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
		// let lastBalance = await Journal.findOne({
		// 	attributes: ["balance"],
		// 	order: [["created_at", "DESC"]],
		// });

		// let currentBalance = lastBalance?.balance;
		// if (!currentBalance) {
		// 	currentBalance = 0;
		// }

		// let currentBalance = awaitJournal.findOne({
		// 	attributes: [[sequelize.fn("sum", sequelize.col("balance")), "balance"]],
		// 	order: [["created_at", "DESC"]],
		// });

		let balance;
		// if (req.body.type === "CR") {
		// 	console.log("cr");
		balance = Number(req.body.mutation);
		// } else {
		// 	console.log("db");
		// 	balance = req.body.mutation;
		// 	console.log(balance);
		// }

		console.log(balance);

		Journal.create({
			note: req.body.note,
			type: req.body.type,
			mutation: req.body.mutation,
			balance: balance,
			deadline_date: req.body.deadline_date,
			paid_status: req.body.paid_status,
			[req.body.paid_status === true && "paid_date"]: req.body.paid_date || new Date(),
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
				if (result.paid_status === true) {
					return errorStatusHandler(res, "transaction_closed");
				}

				Journal.update(
					{
						paid_status: req.body.paid_status,
						paid_date: req.body.paid_status === true ? new Date() : null,
					},
					{ where: { id } }
				)
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
			attributes: [[sequelize.fn("sum", sequelize.col("balance")), "balance"]],
			order: [["created_at", "DESC"]],
		})
			.then((result) => {
				if (result) {
					successStatusHandler(res, { balance: Number(result.balance) });
				} else {
					successStatusHandler(res, { balance: 0 });
				}
			})
			.catch((e) => {
				errorStatusHandler(res, e);
			});
	},
};
