const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db.js");

const ItemCategory = sequelize.define(
	"item_category",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		categoryName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		note: {
			type: DataTypes.TEXT,
		},
	},
	{
		freezeTableName: true,
		timestamps: true,
	}
);

module.exports = ItemCategory;
