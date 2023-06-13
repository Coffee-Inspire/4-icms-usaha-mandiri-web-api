const { DataTypes, Op } = require("sequelize");
const sequelize = require("../../config/db.js");
const Incoming = require("./incomings.model.js");
const Outgoing = require("./outgoings.model.js");

const Journal = sequelize.define(
	"journal",
	{
		id: {
			type: DataTypes.CHAR,
			primaryKey: true,
			allowNull: false,
			defaultValue: DataTypes.UUIDV4,
		},
		transaction_date: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
		note: {
			type: DataTypes.TEXT,
		},
		reference_id: {
			type: DataTypes.CHAR,
			allowNull: true,
		},
		type: {
			type: DataTypes.CHAR,
			allowNull: false,
		},
		mutation: {
			type: DataTypes.DECIMAL(15),
			allowNull: false,
		},
		balance: {
			type: DataTypes.DECIMAL(15),
			allowNull: false,
			defaultValue: 0,
		},
		version: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
		deadline_date: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		paid_status: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
			// Pembelian Default FALSE
			// Penjualan Default TRUE
		},
	},
	{
		indexes: [],
		freezeTableName: true,
		timestamps: true,
		underscored: true,
		version: true,
		scopes: {
			search(value) {
				return {
					where: {
						[Op.or]: [
							{ transaction_date: { [Op.substring]: value } },
							{ note: { [Op.substring]: value } },
							{ reference_id: { [Op.substring]: value } },
							{ type: { [Op.substring]: value } },
							{ mutation: { [Op.substring]: value } },
							{ balance: { [Op.substring]: value } },
						],
					},
				};
			},
		},
	}
);

module.exports = Journal;
