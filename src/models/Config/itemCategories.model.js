const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db.js");
const Stocks = require("../Inventory/stocks.model");

const ItemCategories = sequelize.define(
	"item_categories",
	{
		id: {
			type: DataTypes.CHAR,
			primaryKey: true,
			allowNull: false,
		},
		category_name: {
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
		underscored: true,
	}
);

ItemCategories.hasMany(Stocks, {
	foreignKey: {
		name: "category_id",
		allowNull: false,
		freezeTableName: true,
		underscored: true,
	},
});

Stocks.belongsTo(ItemCategories, {
	foreignKey: {
		name: "category_id",
		allowNull: false,
		freezeTableName: true,
		underscored: true,
	},
});

module.exports = ItemCategories;
