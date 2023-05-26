const { DataTypes, Op } = require("sequelize");
const sequelize = require("../../config/db.js");

const Return = sequelize.define(
	"return",
	{
		id: {
			type: DataTypes.CHAR,
			primaryKey: true,
			allowNull: false,
			defaultValue: DataTypes.UUIDV4,
		},
		outgoingDetail_id: {
			type: DataTypes.CHAR,
			allowNull: false,
		},
		return_date: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
		status: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
		},
	},
	{
		indexes: [],
		freezeTableName: true,
		timestamps: true,
		underscored: true,
	}
);
