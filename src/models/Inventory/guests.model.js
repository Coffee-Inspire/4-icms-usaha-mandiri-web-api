const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db.js");
const OutgoingDetails = require("../Goods/OutgoingDetails.model.js");

const Guests = sequelize.define(
	"Guests",
	{
		id: {
			type: DataTypes.CHAR,
			primaryKey: true,
			allowNull: false,
		},
		guest_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		contact: {
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
	},
	{
		freezeTableName: true,
		timestamps: true,
		underscored: true,
	}
);

Guests.hasMany(OutgoingDetails, {
	foreignKey: {
		name: "guest_id",
		allowNull: false,
		freezeTableName: true,
		underscored: true,
	},
});

OutgoingDetails.belongsTo(Guests, {
	foreignKey: {
		name: "guest_id",
		allowNull: false,
		freezeTableName: true,
		underscored: true,
	},
});

module.exports = Guests;
