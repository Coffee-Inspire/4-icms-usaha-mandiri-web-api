const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db.js");
const Stocks = require("./stocks.model");
const IncomingDetails = require("../Goods/IncomingDetails.model");

const Suppliers = sequelize.define(
	"Suppliers",
	{
		id: {
			type: DataTypes.CHAR,
			primaryKey: true,
			allowNull: false,
		},
		supplier_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		person_contact: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		company_contact: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		address: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		active_status: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
	},
	{
		freezeTableName: true,
		timestamps: true,
		underscored: true,
	}
);

Suppliers.hasMany(Stocks, {
	foreignKey: {
		name: "supplier_id",
		allowNull: false,
		freezeTableName: true,
		underscored: true,
	},
});

Stocks.belongsTo(Suppliers, {
	foreignKey: {
		name: "supplier_id",
		allowNull: false,
		freezeTableName: true,
		underscored: true,
	},
});

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

module.exports = Suppliers;
