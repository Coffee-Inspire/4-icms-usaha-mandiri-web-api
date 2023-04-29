const { DataTypes, Op } = require("sequelize");
const sequelize = require("../../config/db.js");
const Suppliers = require("./suppliers.model.js");
const ItemCategories = require("../Config/itemCategories.model.js");

const Stocks = sequelize.define(
	"stocks",
	{
		id: {
			type: DataTypes.CHAR,
			primaryKey: true,
			allowNull: false,
			defaultValue: DataTypes.UUIDV4,
		},
		item_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		category_id: {
			type: DataTypes.CHAR,
			allowNull: false,
		},
		supplier_id: {
			type: DataTypes.CHAR,
			allowNull: false,
		},
		note: {
			type: DataTypes.TEXT,
		},
		last_order_date: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
		last_restock_date: {
			type: DataTypes.DATE,
		},
		qty: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
		unit: {
			type: DataTypes.CHAR,
			allowNull: false,
		},
		price: {
			type: DataTypes.DECIMAL(15),
			allowNull: false,
		},
		purchase_price: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		indexes: [
			{
				name: "update_on_duplicate",
				unique: true,
				fields: ["item_name", "unit"],
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
							model: ItemCategories,
							where: {
								[Op.or]: [{ category_name: { [Op.substring]: value } }],
							},
							required: false,
						},
						{
							model: Suppliers,
							where: {
								[Op.or]: [{ supplier_name: { [Op.substring]: value } }],
							},
							required: false,
						},
					],
					where: {
						[Op.or]: [
							{ item_name: { [Op.substring]: value } },
							{ note: { [Op.substring]: value } },
							{ last_order_date: { [Op.substring]: value } },
							{ last_restock_date: { [Op.substring]: value } },
							{ qty: { [Op.substring]: value } },
							{ unit: { [Op.substring]: value } },
							{ price: { [Op.substring]: value } },
						],
					},
				};
			},
		},
	}
);

Suppliers.hasMany(Stocks, {
	foreignKey: {
		name: "supplier_id",
		allowNull: false,
		freezeTableName: true,
		underscored: true,
	},
	onDelete: "restrict",
});

Stocks.belongsTo(Suppliers, {
	foreignKey: {
		name: "supplier_id",
		allowNull: false,
		freezeTableName: true,
		underscored: true,
	},
	onDelete: "restrict",
});

ItemCategories.hasMany(Stocks, {
	foreignKey: {
		name: "category_id",
		allowNull: false,
		freezeTableName: true,
		underscored: true,
	},
	onDelete: "restrict",
});

Stocks.belongsTo(ItemCategories, {
	foreignKey: {
		name: "category_id",
		allowNull: false,
		freezeTableName: true,
		underscored: true,
	},
	onDelete: "restrict",
});

module.exports = Stocks;
