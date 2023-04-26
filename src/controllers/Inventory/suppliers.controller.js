const { Suppliers } = require("../../models");
const { v4: uuidv4 } = require("uuid");
const { errorStatusHandler, successStatusHandler } = require("../../helper/responseHandler");
const { paginationHandler } = require("../../helper/paginationHandler");

module.exports = {
	// Get All Data
	getAllRole: async (req, res) => {
		try {
			const { page, limit, sort, filter, search } = req.query;
			const paginate = await paginationHandler(Suppliers, page, limit, sort, filter, search);

			const result =
				paginate.search === ""
					? await Suppliers.findAndCountAll({
							order: [[paginate.filter, paginate.sort]],
							limit: paginate.limit,
							offset: paginate.offset,
					  })
					: await Suppliers.scope({ method: ["search", search] }).findAndCountAll({
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
		Suppliers.findAll({
			attributes: [
				["id", "value"],
				["supplier_name", "label"],
			],
			where: {
				active_status: true,
			},
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
		Suppliers.findOne({
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
		Suppliers.create({
			...req.body,
			id: uuidv4(),
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

		Suppliers.findOne({ where: { id } }).then((result) => {
			if (!result) {
				errorStatusHandler(res, "", "not_found");
			} else {
				Suppliers.update({ ...req.body }, { where: { id } })
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

		Suppliers.destroy({
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
