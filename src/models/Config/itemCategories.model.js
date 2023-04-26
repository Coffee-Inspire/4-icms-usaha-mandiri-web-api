const { DataTypes, Op } = require("sequelize");
const sequelize = require("../../config/db.js");

const ItemCategories = sequelize.define(
	"item_categories",
	{
		id: {
			type: DataTypes.CHAR,
			primaryKey: true,
			allowNull: false,
			defaultValue: DataTypes.UUIDV4,
		},
		category_name: {
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
				name: "category_name",
				unique: true,
				fields: ["category_name"],
			},
		],
		freezeTableName: true,
		timestamps: true,
		underscored: true,
		scopes: {
			search(value) {
				return {
					where: {
						[Op.or]: [{ category_name: { [Op.substring]: value } }, { note: { [Op.substring]: value } }],
					},
				};
			},
		},
	}
);

module.exports = ItemCategories;
