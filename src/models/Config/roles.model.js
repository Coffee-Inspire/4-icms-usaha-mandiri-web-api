const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db.js");
const Users = require("./users.model");

const Roles = sequelize.define(
	"roles",
	{
		id: {
			type: DataTypes.CHAR,
			primaryKey: true,
			allowNull: false,
		},
		role_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		note: {
			type: DataTypes.TEXT,
		},
	},
	{
		indexes: [
			{
				name: "role_name",
				unique: true,
				fields: ["role_name"],
			},
		],
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
