const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db.js");
const IncomingDetails = require("./IncomingDetails.model");

const Incomings = sequelize.define(
	"Incomings",
	{
		id: {
			type: DataTypes.CHAR,
			primaryKey: true,
			allowNull: false,
		},
		incoming_no: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		total_purchase: {
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

module.exports = Incomings;
