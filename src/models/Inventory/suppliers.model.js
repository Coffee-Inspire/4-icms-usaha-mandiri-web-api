const { DataTypes, Op } = require("sequelize");
const sequelize = require("../../config/db.js");

const Suppliers = sequelize.define(
	"suppliers",
	{
		id: {
			type: DataTypes.CHAR,
			primaryKey: true,
			allowNull: false,
			defaultValue: DataTypes.UUIDV4,
		},
		supplier_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		person_contact: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		company_contact: {
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
		status: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true,
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
							{ supplier_name: { [Op.substring]: value } },
							{ person_contact: { [Op.substring]: value } },
							{ company_contact: { [Op.substring]: value } },
							{ email: { [Op.substring]: value } },
							{ address: { [Op.substring]: value } },
						],
					},
				};
			},
		},
	}
);

module.exports = Suppliers;
