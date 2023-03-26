const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db.js");

const User = sequelize.define(
	"User",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		userName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		roleId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		fullName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		contact: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		address: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		activeStatus: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
	},
	{
		freezeTableName: true,
		timestamps: true,
	}
);

module.exports = User;
