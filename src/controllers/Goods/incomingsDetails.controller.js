const { IncomingDetails, Incoming, Stocks, Suppliers, Journal } = require("../../models");
const { errorStatusHandler, successStatusHandler } = require("../../helper/responseHandler");
const { sortFilterPaginateHandler } = require("../../helper/sortFilterPaginateHandler");
const sequelize = require("../../config/db");

module.exports = {
	// Get All Data
	getAllRole: async (req, res) => {
		try {
			const paginate = await sortFilterPaginateHandler(req.query);

			const result =
				paginate.search === ""
					? await IncomingDetails.findAll({
							include: [Incoming, Stocks, Suppliers],
							order: [[paginate.filter, paginate.sort]],
							limit: paginate.limit,
							offset: paginate.offset,
					  })
					: await IncomingDetails.scope({ method: ["search", paginate.search] }).findAll({
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

				// Jika transaksinya tutup, tidak bisa melakukan perubahan
				if (incomingDetailsData.deadline_date) {
					errorStatusHandler(res, "", "transaction_closed");
					return;
				}

				// Cek sisa barang apakah minus ?
				if (incomingDetailsData.receive_remain - req.body.received_qty < 0) {
					throw new Error("invalid_receive_qty");
				}

				let incomingDetailsDataUpdate = await IncomingDetails.update(
					{
						received_qty: Number(incomingDetailsData.received_qty) + Number(req.body.received_qty),
						receive_remain: Number(incomingDetailsData.receive_remain) - Number(req.body.received_qty),
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

				// Update Data Journal
				let incomingData = await Incoming.findOne({
					where: { id: incomingDetailsData.incoming_id },
				});

				let journalData = await Journal.findOne({
					where: { reference_id: incomingData.incoming_no },
				});

				// calculate mutation and balance
				let mutation =
					Number(journalData.mutation) + Number(req.body.received_qty) * Number(incomingDetailsData.purchase_price);

				let journalDataUpdate = await Journal.update(
					{
						mutation,
						balance: 0 - mutation,
					},
					{
						where: { id: journalData.id },
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
