const { Return, OutgoingDetails, Stocks, Guests, Outgoing, Journal } = require("../../models");
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
					? await Return.findAndCountAll({
							include: {
								model: OutgoingDetails,
								include: [Outgoing, Stocks],
							},
							order: [[paginate.filter, paginate.sort]],
							limit: paginate.limit,
							offset: paginate.offset,
							where: {
								...paginate.status,
							},
					  })
					: await Return.scope({ method: ["search", paginate.search] }).findAndCountAll({
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
		Return.findOne({
			include: OutgoingDetails,
			where: { id },
		})
			.then((result) => {
				successStatusHandler(res, result);
			})
			.catch((e) => {
				errorStatusHandler(res, e);
			});
	},

	// Create Data
	postCreate: async (req, res) => {
		const id = req.body.id;
		const return_qty = req.body.return_qty;

		if (!id || !return_qty || return_qty === "") return errorStatusHandler(res, "", "missing_body");

		try {
			checkData = await OutgoingDetails.findOne({ where: { id } });

			// Jika tidak ada data Outgoin Details
			if (!checkData) throw "not_found";

			// Pengecekan jumlah return yang diminta apakah melebihi jumlah barang waktu dibeli
			if (
				Number(checkData.return_qty) + Number(checkData.return_pending) + Number(return_qty) <=
					Number(checkData.sold_qty) &&
				return_qty > 0
			) {
				updateData = await OutgoingDetails.update(
					{ return_pending: Number(checkData.return_pending) + Number(return_qty) },
					{ where: { id } }
				);
				if (updateData[0] == 1) {
					createData = await Return.create({ outgoingDetail_id: id, qty: return_qty });

					listOutgoingDetailsFamilyData = await OutgoingDetails.findAll({
						include: [Stocks],
						where: { outgoing_id: checkData.outgoing_id },
					});

					let outgoing = await Outgoing.findOne({
						include: [Guests],
						where: { id: checkData.outgoing_id },
					});

					successStatusHandler(res, {
						return: createData,
						outgoing: outgoing,
						outgoing_details: listOutgoingDetailsFamilyData,
					});
				} else {
					throw "create_failed";
				}
			} else {
				throw "invalid_return_qty";
			}
		} catch (error) {
			return errorStatusHandler(res, error);
		}
	},

	// Update Status
	putUpdateData: async (req, res) => {
		const id = req.body.id;
		const status = req.body.status;

		if (status !== true && status !== false) return errorStatusHandler(res, "", "missing_body");

		try {
			returnData = await Return.findOne({ where: { id } });

			if (!(returnData.status === null)) {
				throw "status_fixed";
			}

			if (status) {
				await sequelize.transaction(async (t) => {
					// Update status Return menjaid True
					updateData = await Return.update({ status }, { where: { id }, transaction: t });
					if (updateData[0] == 1) {
						const outgoingDetailData = await OutgoingDetails.findOne({ where: { id: returnData.outgoingDetail_id } });

						// Update Stock
						const stock_id = outgoingDetailData.stock_id;
						const return_qty = Number(returnData.qty);

						const stockData = await Stocks.findOne({ where: { id: stock_id } });
						const updateStockUpdate = await Stocks.update(
							{
								qty: Number(stockData.qty) + return_qty,
							},
							{ where: { id: stock_id }, transaction: t }
						);

						if (!updateStockUpdate[0] == 1) throw "update_failed";

						// Update OutgoingDetails return qty
						const outgoingDetailUpdate = await OutgoingDetails.update(
							{
								return_qty: Number(outgoingDetailData.return_qty) + return_qty,
								return_pending: Number(outgoingDetailData.return_pending) - return_qty,
							},
							{ where: { id: returnData.outgoingDetail_id }, transaction: t }
						);

						if (!outgoingDetailUpdate[0] == 1) throw "update_failed";

						// Create Transaction DB
						const outgoingData = await Outgoing.findOne({ where: { id: outgoingDetailData.outgoing_id } });
						const sold_price = outgoingDetailData.sold_price;
						const total_return = Number(sold_price) * return_qty;

						// const journalLastBalance = awaitJournal.findOne({
						// 	attributes: [[sequelize.fn("sum", sequelize.col("balance")), "balance"]],
						// 	order: [["created_at", "DESC"]],
						// });

						// const currentBalance = Number(journalLastBalance.balance);

						createJournalCreate = await Journal.create(
							{
								note: "Retur barang",
								reference_id: outgoingData.receipt_no,
								type: "DB",
								mutation: Number(total_return),
								balance: 0 - Number(total_return),
							},
							{ transaction: t }
						);

						return successStatusHandler(res, "Success Update");
					} else {
						return errorStatusHandler(res, "", "update_failed");
					}
				});
			} else {
				// Update OutgoingDetail minus pending qty
				await sequelize.transaction(async (t) => {
					const return_qty = Number(returnData.qty);
					const outgoingDetailData = await OutgoingDetails.findOne({ where: { id: returnData.outgoingDetail_id } });

					const outgoingDetailUpdate = await OutgoingDetails.update(
						{
							return_pending: Number(outgoingDetailData.return_pending) - return_qty,
						},
						{ where: { id: returnData.outgoingDetail_id }, transaction: t }
					);

					if (!outgoingDetailUpdate[0] == 1) throw "update_failed";

					// Update Return status to False
					updateData = await Return.update({ status }, { where: { id }, transaction: t });
					if (updateData[0] == 1) {
						return successStatusHandler(res, "Success Update");
					} else {
						return errorStatusHandler(res, "", "update_failed");
					}
				});
			}
		} catch (error) {
			return errorStatusHandler(res, error);
		}
	},
};
