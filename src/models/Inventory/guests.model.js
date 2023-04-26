const { DataTypes, Op } = require("sequelize");
const sequelize = require("../../config/db.js");

const Guests = sequelize.define(
	"guests",
	{
		id: {
			type: DataTypes.CHAR,
			primaryKey: true,
			allowNull: false,
			defaultValue: DataTypes.UUIDV4,
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
		scopes: {
			search(value) {
				return {
					where: {
						[Op.or]: [
							{ guest_name: { [Op.substring]: value } },
							{ contact: { [Op.substring]: value } },
							{ email: { [Op.substring]: value } },
							{ address: { [Op.substring]: value } },
						],
					},
				};
			},
		},
	}
);

module.exports = Guests;
