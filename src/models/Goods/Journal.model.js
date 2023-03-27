const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db.js");

const Journal = sequelize.define(
	"Journal",
	{
		id: {
			type: DataTypes.CHAR,
			primaryKey: true,
			allowNull: false,
		},
		note: {
			type: DataTypes.TEXT,
		},
		reference_id: {
			type: DataTypes.CHAR,
			unique: true,
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
		freezeTableName: true,
		timestamps: true,
		underscored: true,
	}
);

module.exports = Journal;
