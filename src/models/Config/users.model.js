const { DataTypes, Op, Model } = require("sequelize");
const sequelize = require("../../config/db.js");
const Roles = require("./roles.model.js");

const Users = sequelize.define(
	"users",
	{
		id: {
			type: DataTypes.CHAR,
			primaryKey: true,
			allowNull: false,
			defaultValue: DataTypes.UUIDV4,
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		role_id: {
			type: DataTypes.CHAR,
			allowNull: false,
		},
		fullname: {
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
		status: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
	},
	{
		indexes: [
			{
				name: "username",
				unique: true,
				fields: ["username"],
			},
			{
				name: "email",
				unique: true,
				fields: ["email"],
			},
		],
		freezeTableName: true,
		timestamps: true,
		underscored: true,
		scopes: {
			search(value) {
				return {
					include: [
						{
							model: Roles,
							where: {
								[Op.or]: [{ role_name: { [Op.substring]: value } }],
							},
							required: false,
						},
					],
					where: {
						[Op.or]: [
							{ username: { [Op.substring]: value } },
							{ fullname: { [Op.substring]: value } },
							{ email: { [Op.substring]: value } },
							{ contact: { [Op.substring]: value } },
							{ address: { [Op.substring]: value } },
						],
					},
				};
			},
		},
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

module.exports = Users;
