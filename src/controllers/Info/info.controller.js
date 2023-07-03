const { Journal, Incoming, Outgoing, Return, OutgoingDetails } = require("../../models");
const { errorStatusHandler, successStatusHandler } = require("../../helper/responseHandler");
const { sortFilterPaginateHandler } = require("../../helper/sortFilterPaginateHandler");
const sequelize = require("../../config/db");
const { Op } = require("sequelize");

module.exports = {
	// Get Activity Count
	getActivityCount: async (req, res) => {
		try {
			const paginate = await sortFilterPaginateHandler(req.query);

			const incomingCount = await Incoming.count({
				where: {
					createdAt: {
						[Op.between]: [paginate.startDate, paginate.endDate],
					},
				},
			});

			const outgoingCount = await Outgoing.count({
				where: {
					createdAt: {
						[Op.between]: [paginate.startDate, paginate.endDate],
					},
				},
			});

			const returnCount = await Return.count({
				include: {
					model: OutgoingDetails,
				},
				where: {
					createdAt: {
						[Op.between]: [paginate.startDate, paginate.endDate],
					},
				},
				group: [sequelize.col("outgoing_detail.outgoing_id")],
			});

			successStatusHandler(res, {
				totalIncoming: incomingCount,
				totalOutgoing: outgoingCount,
				totalReturn: returnCount.length,
			});
		} catch (e) {
			errorStatusHandler(res, e);
		}
	},

	// Journal Progress Count
	getJournalProgress: async (req, res) => {
		try {
			const paginate = await sortFilterPaginateHandler(req.query);

			const allCount = await Journal.count({
				where: {
					createdAt: {
						[Op.between]: [paginate.startDate, paginate.endDate],
					},
				},
			});

			const unpaidCount = await Journal.count({
				where: {
					[Op.and]: [
						{
							createdAt: {
								[Op.between]: [paginate.startDate, paginate.endDate],
							},
						},
						{ paid_status: 0 },
						{ [Op.not]: [{ mutation: 0 }] },
					],
				},
			});

			successStatusHandler(res, {
				allCount: allCount,
				unpaidCount: unpaidCount,
			});
		} catch (e) {
			errorStatusHandler(res, e);
		}
	},

	// Debts Data
	getDebts: async (req, res) => {
		try {
			const unpaidData = await Journal.findAll({
				where: {
					paid_status: 0,
				},
			});
			successStatusHandler(res, unpaidData);
		} catch (e) {
			errorStatusHandler(res, e);
		}
	},

	// Get Transactions SUM
	getTransactions: async (req, res) => {
		try {
			const paginate = await sortFilterPaginateHandler(req.query);

			const creditSum = await Journal.findOne({
				attributes: [[sequelize.fn("sum", sequelize.col("balance")), "balance"]],
				where: {
					[Op.and]: [
						{ type: "CR" },
						{
							createdAt: {
								[Op.between]: [paginate.startDate, paginate.endDate],
							},
						},
					],
				},
			});

			const debitsSum = await Journal.findOne({
				attributes: [[sequelize.fn("sum", sequelize.col("balance")), "balance"]],
				where: {
					[Op.and]: [
						{ type: "DB" },
						{
							createdAt: {
								[Op.between]: [paginate.startDate, paginate.endDate],
							},
						},
					],
				},
			});

			successStatusHandler(res, {
				credits: creditSum.balance,
				debits: debitsSum.balance,
			});
		} catch (e) {
			errorStatusHandler(res, e);
		}
	},

	// Get Current Profit SUM
	getCurrentProfit: async (req, res) => {
		try {
			const start = new Date().setHours(0, 0, 0);
			const end = new Date().setHours(23, 59, 59);

			const currentCR = await Journal.findOne({
				attributes: [[sequelize.fn("sum", sequelize.col("balance")), "balance"]],
				where: {
					[Op.and]: [
						{
							transaction_date: {
								[Op.between]: [start, end],
							},
						},
						{ type: "CR" },
					],
				},
				raw: true,
			});

			const currentDB = await Journal.findOne({
				attributes: [[sequelize.fn("sum", sequelize.col("balance")), "balance"]],
				where: {
					[Op.and]: [
						{
							paid_date: {
								[Op.between]: [start, end],
							},
						},
						{ type: "DB" },
					],
				},
				raw: true,
			});

			const currentProfit = Number(currentCR.balance) + Number(currentDB.balance);

			successStatusHandler(res, {
				value: currentProfit,
			});
		} catch (e) {
			errorStatusHandler(res, e);
		}
	},

	getProfits: async (req, res) => {
		try {
			let { startDate, endDate } = req.query;

			if (!startDate) {
				date = await Journal.findOne({
					attributes: ["created_at"],
					order: [["created_at", "ASC"]],
				});

				startDate = new Date(date.dataValues.created_at);
				startDate.setHours(0, 0, 0);
			}

			if (!endDate) {
				date = await Journal.findOne({
					attributes: ["created_at"],
					order: [["created_at", "DESC"]],
				});

				endDate = new Date(date.dataValues.created_at);
				endDate.setHours(0, 0, 0);
			}

			startDate = new Date(startDate);
			startDate.setHours(0, 0, 0);

			endDate = new Date(endDate);
			endDate.setHours(23, 59, 59);

			// const profitData = await Journal.findAll({
			// 	attributes: [[sequelize.fn("sum", sequelize.col("balance")), "balance"], "paid_date"],
			// 	where: {
			// 		paid_date: {
			// 			[Op.between]: [startDate, endDate],
			// 		},
			// 	},
			// 	group: [sequelize.fn("date", sequelize.col("paid_date"))],
			// 	raw: true,
			// });

			const profitData = await sequelize.query(
				`select date, sum(balance) as balance from 
			(select paid_date as 'date', sum(balance) as 'balance' from journal where type = 'DB' and paid_date is not null group by date(paid_date)
			union
			select transaction_date as 'date', sum(balance) as 'balance' from journal where type = 'CR' group by date(transaction_date)) t
			group by date(date)`,
				{
					type: sequelize.QueryTypes.SELECT,
				}
			);

			let profitFormatData = profitData.map((item) => {
				date = item.date.toLocaleDateString("es-CL");
				value = item.balance;
				return { date, value };
			});

			successStatusHandler(res, profitFormatData);
			// successStatusHandler(res, 0);
		} catch (e) {
			errorStatusHandler(res, e);
		}
	},
};
