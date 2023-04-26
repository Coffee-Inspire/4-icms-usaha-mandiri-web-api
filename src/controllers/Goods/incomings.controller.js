const { Incoming, IncomingDetails, Stocks, Journal } = require("../../models");
const { errorStatusHandler, successStatusHandler } = require("../../helper/responseHandler");
const { paginationHandler } = require("../../helper/paginationHandler");
const { generateNote } = require("../../helper/generateNota");
const sequelize = require("../../config/db");

module.exports = {
	// Get All Data
	getAllRole: async (req, res) => {
		try {
			const { page, limit, sort, filter, search } = req.query;
			const paginate = await paginationHandler(Incoming, page, limit, sort, filter, search);

			const result =
				paginate.search === ""
					? await Incoming.findAndCountAll({
							order: [[paginate.filter, paginate.sort]],
							limit: paginate.limit,
							offset: paginate.offset,
					  })
					: await Incoming.scope({ method: ["search", search] }).findAndCountAll({
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
		Incoming.findOne({
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
		// Incoming.create({
		// 	...req.body,
		// 	id: uuidv4(),
		// })
		// 	.then((result) => {
		// 		successStatusHandler(res, result);
		// 	})
		// 	.catch((e) => {
		// 		errorStatusHandler(res, e);
		// 	});

		try {
			const result = await sequelize.transaction(async (t) => {
				// Generate Serial Note
				let lastNum = await Incoming.findOne({
					attributes: ["incoming_no"],
					order: [["created_at", "DESC"]],
				});

				let generatedSerial = generateNote("beli", lastNum?.incoming_no);
				if (!generatedSerial) {
					throw new Error("Kesalahan pada generate serial Note");
				}

				// Create Incoming
				const incomingData = await Incoming.create({
					...req.body.incoming,
					incoming_no: generatedSerial,
				});

				console.log("Incoming Data ", incomingData);
			});
		} catch (error) {
			console.log("error create roll");
			errorStatusHandler(res, error);
		}
	},

	// Update Data
	putUpdateData: (req, res) => {
		const id = req.body.id;

		if (!id) return errorStatusHandler(res, "", "missing_body");

		Incoming.findOne({ where: { id } }).then((result) => {
			if (!result) {
				errorStatusHandler(res, "", "not_found");
			} else {
				Incoming.update({ ...req.body }, { where: { id } })
					.then((result) => {
						successStatusHandler(res, "Success Update");
					})
					.catch((e) => {
						errorStatusHandler(res, e);
					});
			}
		});
	},

	deleteData: (req, res) => {
		const { id } = req.query;

		Incoming.destroy({
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
