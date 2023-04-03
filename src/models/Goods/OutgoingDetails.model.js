const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db.js");

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
	},
	{
		freezeTableName: true,
		timestamps: true,
		underscored: true,
	}
);

module.exports = OutgoingDetails;
