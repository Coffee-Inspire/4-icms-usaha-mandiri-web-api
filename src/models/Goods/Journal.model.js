const { DataTypes, Op } = require("sequelize");
const sequelize = require("../../config/db.js");

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
			allowNull: false,
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
		version: true,
	}
);

module.exports = Journal;
