const { Incoming, IncomingDetails, Stocks, Journal } = require("../../models");
const { errorStatusHandler, successStatusHandler } = require("../../helper/responseHandler");
const { paginationHandler } = require("../../helper/paginationHandler");
const { generateNoteSerial } = require("../../helper/generateNoteSerial");
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

				console.log("asdada ", incomingData);
				console.log("asdada222 ", incomingData.id);

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

				// Tidak bisa dipakai karena update on duplicate, untuk taro id stock ke incoming details nanti tidak sama.
				const stockData = await Stocks.bulkCreate([...stockBuild], {
					updateOnDuplicate: ["category_id", "supplier_id", "last_order_date", "price"],
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

						console.log("id_stock ", incomingData.id);

						return {
							incoming_id: incomingData.id,
							stock_id: id_stock.id,
							purchase_qty: item.purchase_qty,
							supplier_id: item.supplier_id,
							unit: item.unit,
							note: item.note,
							total_amount: item.total_amount,
							purchase_price: item.purchase_price,
						};
					})
				);

				// console.log("CEK DATA ", incomingDetailsBuild);

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
						reference_id: incomingData.id,
						type: "DB",
						mutation: incomingData.total_purchase,
						balance: currentBalance - incomingData.total_purchase,
					},
					{ transaction: t }
				);
			});

			successStatusHandler(res, "success");
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
