const { DataTypes, Op } = require("sequelize");
const sequelize = require("../../config/db.js");
const Guests = require("../Inventory/guests.model.js");

const Outgoings = sequelize.define(
	"outgoings",
	{
		id: {
			type: DataTypes.CHAR,
			primaryKey: true,
			allowNull: false,
		},
		receipt_no: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		guest_id: {
			type: DataTypes.CHAR,
			allowNull: false,
		},
		total_sold: {
			type: DataTypes.DECIMAL(15),
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

Guests.hasMany(Outgoings, {
	foreignKey: {
		name: "guest_id",
		allowNull: false,
		freezeTableName: true,
		underscored: true,
	},
});

Outgoings.belongsTo(Guests, {
	foreignKey: {
		name: "guest_id",
		allowNull: false,
		freezeTableName: true,
		underscored: true,
	},
});

module.exports = Outgoings;
