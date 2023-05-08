const { IncomingDetails, Incoming, Stocks, Suppliers } = require("../../models");
const { errorStatusHandler, successStatusHandler } = require("../../helper/responseHandler");
const { paginationHandler } = require("../../helper/paginationHandler");
const sequelize = require("../../config/db");

module.exports = {
	// Get All Data
	getAllRole: async (req, res) => {
		try {
			const { page, limit, sort, filter, search } = req.query;
			const paginate = await paginationHandler(page, limit, sort, filter, search);

			const result =
				paginate.search === ""
					? await IncomingDetails.findAll({
							include: [Incoming, Stocks, Suppliers],
							order: [[paginate.filter, paginate.sort]],
							limit: paginate.limit,
							offset: paginate.offset,
					  })
					: await IncomingDetails.scope({ method: ["search", search] }).findAll({
							include: [Incoming, Stocks, Suppliers],
							order: [[paginate.filter, paginate.sort]],
							limit: paginate.limit,
							offset: paginate.offset,
					  });

			successStatusHandler(res, result, {
				title: "dataLength",
				data: paginate.dataLength,
			});
		} catch (e) {
			errorStatusHandler(res, e);
		}
	},

	// Get Single Data
	getOneByID: (req, res) => {
		const { id } = req.query;
		IncomingDetails.findOne({
			include: [Incoming, Stocks, Suppliers],
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
	// postCreate: (req, res) => {
	// 	IncomingDetails.create({
	// 		...req.body,
	// 	})
	// 		.then((result) => {
	// 			successStatusHandler(res, result);
	// 		})
	// 		.catch((e) => {
	// 			errorStatusHandler(res, e);
	// 		});
	// },

	// Update Data
	putUpdateData: async (req, res) => {
		try {
			const id = req.body.id;

			if (!id) return errorStatusHandler(res, "", "missing_body");

			const result = await sequelize.transaction(async (t) => {
				let incomingDetailsData = await IncomingDetails.findOne({ where: { id } });
				if (!incomingDetailsData) {
					errorStatusHandler(res, "", "not_found");
					return;
				}

				// Cek sisa barang apakah minus ?
				if (incomingDetailsData.receive_remain - req.body.received_qty < 0) {
					throw new Error("invalid_receive_qty");
				}

				let incomingDetailsDataUpdate = await IncomingDetails.update(
					{
						received_qty: incomingDetailsData.received_qty - 0 + (req.body.received_qty - 0),
						receive_remain: incomingDetailsData.receive_remain - req.body.received_qty,
						arrive_date: new Date(),
					},
					{
						where: { id },
						transaction: t,
					}
				);

				let stockData = await Stocks.findOne({ where: { id: incomingDetailsData.stock_id } });

				let stockDataUpdate = await Stocks.update(
					{
						qty: stockData.qty - 0 + (req.body.received_qty - 0),
						last_restock_date: new Date(),
					},
					{
						where: { id: incomingDetailsData.stock_id },
						transaction: t,
					}
				);
			});

			successStatusHandler(res, "Success Update");
		} catch (error) {
			errorStatusHandler(res, "", "update_failed");
		}
	},

	deleteData: (req, res) => {
		const { id } = req.query;

		IncomingDetails.destroy({
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
