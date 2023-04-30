const sequelize = require("../config/db");

const paginationHandler = async (page = 1, limit = 10, sort = "DESC", filter = "created_at", search = "") => {
	// const dataLength = await model.count({});
	const offset = (page - 1) * limit;

	sort = sort === "old" ? "ASC" : "DESC";

	return {
		page: parseInt(page),
		limit: parseInt(limit),
		offset: parseInt(offset),
		sort,
		filter,
		search,
	};
};

module.exports = {
	paginationHandler,
};
