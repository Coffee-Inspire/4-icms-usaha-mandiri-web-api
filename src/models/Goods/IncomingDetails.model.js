const { DataTypes, Op } = require("sequelize");
const sequelize = require("../../config/db.js");
const Suppliers = require("../Inventory/suppliers.model.js");
const Stocks = require("../Inventory/stocks.model.js");
const Incomings = require("./Incomings.model.js");

const IncomingDetails = sequelize.define(
	"incoming_details",
	{
		id: {
			type: DataTypes.CHAR,
			primaryKey: true,
			allowNull: false,
		},
		incoming_id: {
			type: DataTypes.CHAR,
			allowNull: false,
		},
		stock_id: {
			type: DataTypes.CHAR,
			allowNull: false,
		},
		purchase_qty: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		supplier_id: {
			type: DataTypes.CHAR,
			allowNull: false,
		},
		arrive_date: {
			type: DataTypes.DATE,
		},
		received_qty: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		unit: {
			type: DataTypes.CHAR,
			allowNull: false,
		},
		total_amount: {
			type: DataTypes.DECIMAL(15),
			allowNull: false,
		},
		receive_remain: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
	},
	{
		freezeTableName: true,
		timestamps: true,
		underscored: true,
	}
);

Suppliers.hasMany(IncomingDetails, {
	foreignKey: {
		name: "supplier_id",
		allowNull: false,
		freezeTableName: true,
		underscored: true,
	},
});

IncomingDetails.belongsTo(Suppliers, {
	foreignKey: {
		name: "supplier_id",
		allowNull: false,
		freezeTableName: true,
		underscored: true,
	},
});

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

Incomings.hasMany(IncomingDetails, {
	foreignKey: {
		name: "incoming_id",
		allowNull: false,
		freezeTableName: true,
		underscored: true,
	},
});

IncomingDetails.belongsTo(Incomings, {
	foreignKey: {
		name: "incoming_id",
		allowNull: false,
		freezeTableName: true,
		underscored: true,
	},
});

module.exports = IncomingDetails;
