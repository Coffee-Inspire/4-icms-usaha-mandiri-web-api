const { Op } = require("sequelize");
const sequelize = require("../config/db");

// const paginationHandler = async (page = 1, limit = 10, sort = "DESC", filter = "created_at", search = "") => {
const sortFilterPaginateHandler = async ({
	page = 1,
	limit = 10,
	sort = "DESC",
	filter = "created_at",
	search = "",
	qty = "",
	status = "",
	journalType = "",
	role = "",
	paidStatus = "",

	startDate = new Date("0000"),
	endDate = new Date(),
}) => {
	// Offset
	const offset = (page - 1) * limit;

	// Supplier
	status =
		status === "active"
			? {
					status: true,
			  }
			: status === "inactive"
			? {
					status: false,
			  }
			: status === "pending"
			? {
					status: null,
			  }
			: (status = "");

	// Qty
	qty =
		qty === "ready"
			? {
					qty: { [Op.gte]: 80 },
			  }
			: qty === "limited"
			? {
					qty: { [Op.between]: [1, 79] },
			  }
			: qty === "empty"
			? {
					qty: { [Op.eq]: 0 },
			  }
			: (qty = "");

	// Sort
	sort = sort === "asc" ? "ASC" : "DESC";

	// Journal Type
	journalType =
		journalType === "db"
			? {
					type: "DB",
			  }
			: journalType === "cr"
			? {
					type: "CR",
			  }
			: (journalType = "");

	// Paid Status
	paidStatus =
		paidStatus === "true"
			? {
					paid_status: true,
			  }
			: paidStatus === "false"
			? {
					paid_status: false,
			  }
			: (paidStatus = "");

	// Role
	if (role != "") {
		role = {
			role_name: role,
		};
	}

	// ============================================================ FILTER ============================================================
	if (filter === "return_receipt_no") {
		filter = sequelize.col("outgoing_detail.outgoing.receipt_no");
	}

	return {
		page: parseInt(page),
		limit: parseInt(limit),
		offset: parseInt(offset),
		sort,
		filter,
		search,
		qty,
		status,
		journalType,
		role,
		paidStatus,

		startDate,
		endDate,
	};
};

module.exports = {
	sortFilterPaginateHandler,
};
