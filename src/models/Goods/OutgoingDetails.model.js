const { DataTypes, Op } = require("sequelize");
const sequelize = require("../../config/db.js");
const Stocks = require("../Inventory/stocks.model.js");
const Outgoings = require("./Outgoings.model.js");

const OutgoingDetails = sequelize.define(
	"outgoing_details",
	{
		id: {
			type: DataTypes.CHAR,
			primaryKey: true,
			allowNull: false,
		},
		outgoing_id: {
			type: DataTypes.CHAR,
			allowNull: false,
		},
		stock_id: {
			type: DataTypes.CHAR,
			allowNull: false,
		},
		sold_qty: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		sold_price: {
			type: DataTypes.DECIMAL(15),
			allowNull: false,
		},
		total_amount: {
			type: DataTypes.DECIMAL(15),
			allowNull: false,
		},
		unit: {
			type: DataTypes.CHAR,
			allowNull: false,
		},
	},
	{
		freezeTableName: true,
		timestamps: true,
		underscored: true,
	}
);

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

Outgoings.hasMany(OutgoingDetails, {
	foreignKey: {
		name: "outgoing_id",
		allowNull: false,
		freezeTableName: true,
		underscored: true,
	},
});

OutgoingDetails.belongsTo(Outgoings, {
	foreignKey: {
		name: "outgoing_id",
		allowNull: false,
		freezeTableName: true,
		underscored: true,
	},
});

module.exports = OutgoingDetails;
