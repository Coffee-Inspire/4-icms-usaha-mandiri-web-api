const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db.js");
const User = require("./user.model");

const Role = sequelize.define(
	"Role",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		roleName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		note: {
			type: DataTypes.TEXT,
		},
	},
	{
		freezeTableName: true,
		timestamps: true,
	}
);

Role.hasMany(User, {
	foreignKey: {
		name: "roleId",
		allowNull: false,
		freezeTableName: true,
	},
});

User.belongsTo(Role, {
	foreignKey: {
		name: "roleId",
		allowNull: false,
		freezeTableName: true,
	},
});

module.exports = Role;
