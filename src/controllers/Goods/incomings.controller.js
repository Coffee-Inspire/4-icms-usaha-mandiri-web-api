const { Incoming, IncomingDetails, Stocks, Journal, Suppliers } = require("../../models");
const { errorStatusHandler, successStatusHandler } = require("../../helper/responseHandler");
const { paginationHandler } = require("../../helper/paginationHandler");
const { generateNoteSerial } = require("../../helper/generateNoteSerial");
const sequelize = require("../../config/db");
const { where } = require("sequelize");

module.exports = {
	// Get All Data
	getAllRole: async (req, res) => {
		try {
			const { page, limit, sort, filter, search } = req.query;
			const paginate = await paginationHandler(page, limit, sort, filter, search);

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
	getOneByID: async (req, res) => {
		try {
			const { id } = req.query;

			let incomingDetailsData = await IncomingDetails.findAll({
				include: [Stocks, Suppliers],
				where: { incoming_id: id },
			});

			let incomingData = await Incoming.findOne({
				where: { id },
			});

			if (!incomingDetailsData || !incomingData) {
				errorStatusHandler(res, "", "ID_Not_Found");
				return;
			}

			successStatusHandler(res, {
				...incomingData.dataValues,
				incoming_details: incomingDetailsData,
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
				let lastNum = await Incoming.findOne({
					attributes: ["incoming_no"],
					order: [["created_at", "DESC"]],
				});

				let generatedSerial = generateNoteSerial("beli", lastNum?.incoming_no);
				if (!generatedSerial) {
					throw new Error("Kesalahan pada generate serial Note");
				}

				// 2.Create Incoming
				const incomingData = await Incoming.create(
					{
						...req.body.incoming,
						incoming_no: generatedSerial,
					},
					{ transaction: t }
				);

				// 3.Data Detail (Check stock > Create or update stock data > create incoming details)
				// New Update (Auto Check for Create or Update stock data > create incoming details)

				let stockBuild = req.body.details.map((item) => {
					return {
						item_name: item.item_name,
						category_id: item.category_id,
						supplier_id: item.supplier_id,
						last_order_date: new Date(),
						unit: item.unit,
						price: item.price,
						purchase_price: item.purchase_price,
					};
				});

				const stockData = await Stocks.bulkCreate([...stockBuild], {
					updateOnDuplicate: ["category_id", "supplier_id", "last_order_date", "price"],
					transaction: t,
				});

				let incomingDetailsBuild = await Promise.all(
					req.body.details.map(async (item) => {
						let id_stock = await Stocks.findOne({
							attributes: ["id"],
							where: {
								item_name: item.item_name,
								unit: item.unit,
							},
						});

						if (!id_stock) {
							stockData.map((itemStock) => {
								if (itemStock.item_name === item.item_name && itemStock.unit === item.unit) {
									id_stock = { id: itemStock.id };
								}
							});
						}

						return {
							incoming_id: incomingData.id,
							stock_id: id_stock.id,
							purchase_qty: item.purchase_qty,
							receive_remain: item.purchase_qty,
							supplier_id: item.supplier_id,
							unit: item.unit,
							note: item.note,
							total_amount: item.total_amount,
							purchase_price: item.purchase_price,
						};
					})
				);

				const incomingDetailsData = await IncomingDetails.bulkCreate([...incomingDetailsBuild], {
					transaction: t,
				});

				// 4.Journal (Get last balance > create data for journal)
				let lastBalance = await Journal.findOne({
					attributes: ["balance"],
					order: [["created_at", "DESC"]],
				});

				let currentBalance = lastBalance?.balance;
				if (!currentBalance) {
					currentBalance = 0;
				}

				const journalData = await Journal.create(
					{
						note: "Pembelian",
						reference_id: generatedSerial,
						type: "DB",
						mutation: incomingData.total_purchase,
						balance: currentBalance - incomingData.total_purchase,
					},
					{ transaction: t }
				);

				return { incomingData, incomingDetailsData, journalData };
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

		Incoming.findOne({ where: { id } }).then((result) => {
			if (!result) {
				errorStatusHandler(res, "", "not_found");
			} else {
				Incoming.update(
					{
						status: req.body.status,
						note: req.body.note,
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
