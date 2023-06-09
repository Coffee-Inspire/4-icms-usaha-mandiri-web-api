const { Outgoing, OutgoingDetails, Stocks, Guests, Journal } = require("../../models");
const { errorStatusHandler, successStatusHandler } = require("../../helper/responseHandler");
const { sortFilterPaginateHandler } = require("../../helper/sortFilterPaginateHandler");
const { generateNoteSerial } = require("../../helper/generateNoteSerial");
const sequelize = require("../../config/db");

module.exports = {
	// Get All Data
	getAllRole: async (req, res) => {
		try {
			const paginate = await sortFilterPaginateHandler(req.query);

			const result =
				paginate.search === ""
					? await Outgoing.findAndCountAll({
							include: [Guests],
							order: [[paginate.filter, paginate.sort]],
							limit: paginate.limit,
							offset: paginate.offset,
					  })
					: await Outgoing.scope({ method: ["search", paginate.search] }).findAndCountAll({
							include: [Guests],
							order: [[paginate.filter, paginate.sort]],
							limit: paginate.limit,
							offset: paginate.offset,
					  });

			successStatusHandler(res, result);
		} catch (e) {
			errorStatusHandler(res, e);
		}
	},

	getDataSrouce: (req, res) => {
		Outgoing.findAll({
			attributes: [
				["id", "value"],
				["receipt_no", "label"],
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
	getOneByID: async (req, res) => {
		try {
			const { id } = req.query;

			let outgoingDetailsData = await OutgoingDetails.findAll({
				include: [Stocks],
				where: { outgoing_id: id },
			});

			let outgoing = await Outgoing.findOne({
				include: [Guests],
				where: { id },
			});

			if (!outgoingDetailsData || !outgoing) {
				errorStatusHandler(res, "", "ID_Not_Found");
				return;
			}

			successStatusHandler(res, {
				...outgoing.dataValues,
				outgoing_details: outgoingDetailsData,
			});
		} catch (error) {
			errorStatusHandler(res, error);
		}
	},

	// Create Role
	postCreate: async (req, res) => {
		try {
			const result = await sequelize.transaction(async (t) => {
				// 1.Generate Serial Note
				let lastNum = await Outgoing.findOne({
					attributes: ["receipt_no"],
					order: [["created_at", "DESC"]],
				});

				let generatedSerial = generateNoteSerial("jual", lastNum?.receipt_no);
				if (!generatedSerial) {
					throw new Error("Kesalahan pada generate serial Note");
				}

				// 2.Create Outgoing
				const outgoingData = await Outgoing.create(
					{
						...req.body.outgoing,
						receipt_no: generatedSerial,
					},
					{ transaction: t }
				);

				// 3.Reduce Stock qty (Looping Cart)
				// Check qty is ok ? && unit is same ? > Then Reduce qty
				// + Step 4

				let outgoingDetailsFrontend = [];
				let outgoingDetailsBuild = [];

				let stockCheck = await Promise.all(
					req.body.cart.map(async (item) => {
						let stockResult = await Stocks.findOne({
							where: { id: item.stock_id },
						});

						if (stockResult.unit === item.unit) {
							if (stockResult.qty < item.sold_qty) {
								throw "invalid_sold_qty";
							} else {
								outgoingDetailsFrontend.push({
									outgoing_id: outgoingData.id,
									stock_id: item.stock_id,
									stock: stockResult,
									sold_qty: item.sold_qty,
									sold_price: item.sold_price,
									total_amount: item.total_amount,
									unit: item.unit,
									stock: stockResult,
								});

								outgoingDetailsBuild.push({
									outgoing_id: outgoingData.id,
									stock_id: item.stock_id,
									sold_qty: item.sold_qty,
									sold_price: item.sold_price,
									total_amount: item.total_amount,
									unit: item.unit,
								});

								return {
									...stockResult.dataValues,
									qty: stockResult.qty - item.sold_qty,
								};
							}
						} else {
							throw "different_unit";
						}
					})
				);

				const stockDataUpdate = await Stocks.bulkCreate([...stockCheck], {
					updateOnDuplicate: ["id", "qty"],
					transaction: t,
				});

				// 4.Outgoing Details
				// let outgoingDetailsBuild = req.body.cart.map((item) => {
				// 	return {
				// 		outgoing_id: outgoingData.id,
				// 		stock_id: item.stock_id,
				// 		sold_qty: item.sold_qty,
				// 		sold_price: item.sold_price,
				// 		total_amount: item.total_amount,
				// 		unit: item.unit,
				// 	};
				// });

				const outgoingDetailsData = await OutgoingDetails.bulkCreate([...outgoingDetailsBuild], {
					transaction: t,
				});

				// 5.Journal
				// let lastBalance = await Journal.findOne({
				// 	attributes: ["balance"],
				// 	order: [["created_at", "DESC"]],
				// });

				// let currentBalance = lastBalance?.balance;
				// if (!currentBalance) {
				// 	currentBalance = 0;
				// }

				// - 0 untuk auto convert ke integer
				const journalData = await Journal.create(
					{
						note: "Penjualan",
						reference_id: generatedSerial,
						type: "CR",
						mutation: Number(outgoingData.total_sold),
						balance: Number(outgoingData.total_sold),
						paid_status: true,
						paid_date: new Date(),
					},
					{ transaction: t }
				);

				// Get Outgoing Data for Front-end (guest name)
				let guestData;
				if (outgoingData.guest_id) {
					guestData = await Guests.findOne({
						where: { id: outgoingData.guest_id },
					});
				}

				return {
					outgoingData: { ...outgoingData.dataValues, guest: guestData },
					outgoingDetailsFrontend,
					journalData,
				};
			});

			successStatusHandler(res, result);
		} catch (error) {
			errorStatusHandler(res, error);
		}
	},

	// Update Data
	putUpdateData: (req, res) => {
		const id = req.body.id;

		if (!id) return errorStatusHandler(res, "", "missing_body");

		Outgoing.findOne({ where: { id } }).then((result) => {
			if (!result) {
				errorStatusHandler(res, "", "not_found");
			} else {
				Outgoing.update({ note: req.body.note }, { where: { id } })
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

		Outgoing.destroy({
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
