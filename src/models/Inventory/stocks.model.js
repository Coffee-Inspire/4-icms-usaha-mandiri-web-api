const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db.js");
const IncomingDetails = require("../Goods/IncomingDetails.model");
const OutgoingDetails = require("../Goods/OutgoingsDetails.model");

const Stocks = sequelize.define(
	"Stocks",
	{
		id: {
			type: DataTypes.CHAR,
			primaryKey: true,
			allowNull: false,
		},
		item_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		category_id: {
			type: DataTypes.CHAR,
			allowNull: false,
		},
		supplier_id: {
			type: DataTypes.CHAR,
			allowNull: false,
		},
		note: {
			type: DataTypes.TEXT,
		},
		last_order_date: {
			type: DataTypes.DATE,
		},
		last_restock_date: {
			type: DataTypes.DATE,
		},
		qty: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		unit: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		hpp: {
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

Stocks.hasMany(IncomingDetails, {
	foreignKey: {
		name: "stock_id",
		allowNull: false,
		freezeTableName: true,
		underscored: true,
	},
});

IncomingDetails.belongsTo(Stocks, {
	foreignKey: {
		name: "stock_id",
		allowNull: false,
		freezeTableName: true,
		underscored: true,
	},
});

Stocks.hasMany(OutgoingDetails, {
	foreignKey: {
		name: "stock_id",
		allowNull: false,
		freezeTableName: true,
		underscored: true,
	},
});

OutgoingDetails.belongsTo(Stocks, {
	foreignKey: {
		name: "stock_id",
		allowNull: false,
		freezeTableName: true,
		underscored: true,
	},
});

module.exports = Stocks;
