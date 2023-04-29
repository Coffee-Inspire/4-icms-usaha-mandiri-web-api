const { DataTypes, Op } = require("sequelize");
const sequelize = require("../../config/db.js");

// UNDER WATCH, MAYBE NOT GONNA USE IT

const Balance = sequelize.define(
	"balance",
	{
		id: {
			type: DataTypes.CHAR,
			primaryKey: true,
			allowNull: false,
			defaultValue: DataTypes.UUIDV4,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		balance: {
			type: DataTypes.DECIMAL(15),
			allowNull: false,
			defaultValue: 0,
		},
	},
	{
		indexes: [],
		freezeTableName: true,
		timestamps: true,
		underscored: true,
		version: true,
	}
);

module.exports = Balance;
