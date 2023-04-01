const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db.js");
const Users = require("./users.model");

const Roles = sequelize.define(
	"Roles",
	{
		id: {
			type: DataTypes.CHAR,
			primaryKey: true,
			allowNull: false,
		},
		role_name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
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

Roles.hasMany(Users, {
	foreignKey: {
		name: "role_id",
		allowNull: false,
		freezeTableName: true,
		underscored: true,
	},
});

Users.belongsTo(Roles, {
	foreignKey: {
		name: "role_id",
		allowNull: false,
		freezeTableName: true,
		underscored: true,
	},
});

module.exports = Roles;
