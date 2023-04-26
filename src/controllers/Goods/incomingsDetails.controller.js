const { IncomingDetails } = require("../../models");
const { errorStatusHandler, successStatusHandler } = require("../../helper/responseHandler");
const { paginationHandler } = require("../../helper/paginationHandler");

module.exports = {
	// Get All Data
	getAllRole: async (req, res) => {
		try {
			const { page, limit, sort, filter, search } = req.query;
			const paginate = await paginationHandler(IncomingDetails, page, limit, sort, filter, search);

			const result =
				paginate.search === ""
					? await IncomingDetails.findAll({
							order: [[paginate.filter, paginate.sort]],
							limit: paginate.limit,
							offset: paginate.offset,
					  })
					: await IncomingDetails.scope({ method: ["search", search] }).findAll({
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
		IncomingDetails.create({
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

		IncomingDetails.findOne({ where: { id } }).then((result) => {
			if (!result) {
				errorStatusHandler(res, "", "not_found");
			} else {
				IncomingDetails.update({ ...req.body }, { where: { id } })
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
