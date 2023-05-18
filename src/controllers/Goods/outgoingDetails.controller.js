const { OutgoingDetails, Outgoing, Stocks } = require("../../models");
const { errorStatusHandler, successStatusHandler } = require("../../helper/responseHandler");
const { sortFilterPaginateHandler } = require("../../helper/sortFilterPaginateHandler");

module.exports = {
	// Get All Data
	getAllRole: async (req, res) => {
		try {
			const paginate = await sortFilterPaginateHandler(req.query);

			const result =
				paginate.search === ""
					? await OutgoingDetails.findAndCountAll({
							include: [Outgoing, Stocks],
							order: [[paginate.filter, paginate.sort]],
							limit: paginate.limit,
							offset: paginate.offset,
					  })
					: await OutgoingDetails.scope({ method: ["search", search] }).findAndCountAll({
							include: [Outgoing, Stocks],
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
		OutgoingDetails.findOne({
			include: [Outgoing, Stocks],
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
		OutgoingDetails.create({
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

		OutgoingDetails.findOne({ where: { id } }).then((result) => {
			if (!result) {
				errorStatusHandler(res, "", "not_found");
			} else {
				OutgoingDetails.update({ ...req.body }, { where: { id } })
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

		OutgoingDetails.destroy({
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
