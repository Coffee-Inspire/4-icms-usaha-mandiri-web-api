const { DataTypes, Op } = require("sequelize");
const sequelize = require("../../config/db.js");

const Roles = sequelize.define(
	"roles",
	{
		id: {
			type: DataTypes.CHAR,
			primaryKey: true,
			allowNull: false,
			defaultValue: DataTypes.UUIDV4,
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
		freezeTableName: true,
		timestamps: true,
		underscored: true,
		scopes: {},
	}
);

// Roles.hasMany(Users, {
// 	foreignKey: {
// 		name: "role_id",
// 		allowNull: false,
// 		freezeTableName: true,
// 		underscored: true,
// 	},
// });

// Users.belongsTo(Roles, {
// 	foreignKey: {
// 		name: "role_id",
// 		allowNull: false,
// 		freezeTableName: true,
// 		underscored: true,
// 	},
// });

module.exports = Roles;
