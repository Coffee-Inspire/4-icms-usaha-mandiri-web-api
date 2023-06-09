const { DataTypes, Op } = require("sequelize");
const sequelize = require("../../config/db.js");

const Incomings = sequelize.define(
	"incomings",
	{
		id: {
			type: DataTypes.CHAR,
			primaryKey: true,
			allowNull: false,
			defaultValue: DataTypes.UUIDV4,
		},
		purchase_date: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
		incoming_no: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		total_purchase: {
			type: DataTypes.DECIMAL(15),
			allowNull: false,
		},
		note: {
			type: DataTypes.TEXT,
		},
		status: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		deadline_date: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: false,
		},
	},
	{
		indexes: [
			{
				name: "incoming_no",
				unique: true,
				fields: ["incoming_no"],
			},
		],
		freezeTableName: true,
		timestamps: true,
		underscored: true,
		scopes: {
			search(value) {
				return {
					where: {
						[Op.or]: [
							{ purchase_date: { [Op.substring]: value } },
							{ incoming_no: { [Op.substring]: value } },
							{ total_purchase: { [Op.substring]: value } },
							{ note: { [Op.substring]: value } },
						],
					},
				};
			},
		},
	}
);

module.exports = Incomings;
