const { DataTypes, Op } = require("sequelize");
const sequelize = require("../../config/db.js");

const Journal = sequelize.define(
	"journal",
	{
		id: {
			type: DataTypes.CHAR,
			primaryKey: true,
			allowNull: false,
		},
		transaction_date: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		note: {
			type: DataTypes.TEXT,
		},
		reference_id: {
			type: DataTypes.CHAR,
			allowNull: false,
		},
		TYPE: {
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
		},
	},
	{
		indexes: [
			{
				name: "reference_id",
				unique: true,
				fields: ["reference_id"],
			},
		],
		freezeTableName: true,
		timestamps: true,
		underscored: true,
	}
);

module.exports = Journal;
