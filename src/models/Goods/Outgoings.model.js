const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db.js");
const OutgoingDetails = require("./OutgoingsDetails.model");

const Outgoings = sequelize.define(
	"Outgoings",
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

module.exports = Outgoings;
