const { Stocks, ItemCategories, Suppliers } = require("../../models");
const { errorStatusHandler, successStatusHandler } = require("../../helper/responseHandler");
const { paginationHandler } = require("../../helper/paginationHandler");

module.exports = {
	// Get All Data
	getAllRole: async (req, res) => {
		try {
			const { page, limit, sort, filter, search } = req.query;
			const paginate = await paginationHandler(Stocks, page, limit, sort, filter, search);

			const result =
				paginate.search === ""
					? await Stocks.findAndCountAll({
							include: [ItemCategories, Suppliers],
							order: [[paginate.filter, paginate.sort]],
							limit: paginate.limit,
							offset: paginate.offset,
					  })
					: await Stocks.scope({ method: ["search", search] }).findAndCountAll({
							include: [ItemCategories, Suppliers],
							order: [[paginate.filter, paginate.sort]],
							limit: paginate.limit,
							offset: paginate.offset,
					  });

			successStatusHandler(res, result);
		} catch (e) {
			errorStatusHandler(res, e);
		}
	},

	// Get Data Source
	getDataSrouce: (req, res) => {
		Stocks.findAll({
			attributes: [
				["id", "value"],
				["item_name", "label"],
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
	getOneByID: (req, res) => {
		const { id } = req.query;
		Stocks.findOne({
			include: [ItemCategories, Suppliers],
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
	postCreate: (req, res) => {
		Stocks.create({
			...req.body,
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

		Stocks.findOne({ where: { id } }).then((result) => {
			if (!result) {
				errorStatusHandler(res, "", "not_found");
			} else {
				Stocks.update({ ...req.body }, { where: { id } })
					.then((result) => {
						successStatusHandler(res, "Success Update");
					})
					.catch((e) => {
						errorStatusHandler(res, e);
					});
			}
		});
	},

	// Delete Data
	deleteData: (req, res) => {
		const { id } = req.query;

		Stocks.destroy({
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
