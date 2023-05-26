const { DataTypes, Op } = require("sequelize");
const sequelize = require("../../config/db.js");
const Stocks = require("../Inventory/stocks.model.js");
const Outgoings = require("./outgoings.model.js");

const OutgoingDetails = sequelize.define(
	"outgoing_details",
	{
		id: {
			type: DataTypes.CHAR,
			primaryKey: true,
			allowNull: false,
			defaultValue: DataTypes.UUIDV4,
		},
		outgoing_id: {
			type: DataTypes.CHAR,
			allowNull: false,
		},
		stock_id: {
			type: DataTypes.CHAR,
			allowNull: false,
		},
		sold_qty: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		sold_price: {
			type: DataTypes.DECIMAL(15),
			allowNull: false,
		},
		total_amount: {
			type: DataTypes.DECIMAL(15),
			allowNull: false,
		},
		unit: {
			type: DataTypes.CHAR,
			allowNull: false,
		},
		return_qty: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
	},
	{
		indexes: [],
		freezeTableName: true,
		timestamps: true,
		underscored: true,
		scopes: {
			search(value) {
				return {
					include: [
						{
							model: Outgoings,
							where: {
								[Op.or]: [{ receipt_no: { [Op.substring]: value } }],
							},
							required: false,
						},
						{
							model: Stocks,
							where: {
								[Op.or]: [{ item_name: { [Op.substring]: value } }],
							},
							required: false,
						},
					],
					where: {
						[Op.or]: [
							{ sold_qty: { [Op.substring]: value } },
							{ sold_price: { [Op.substring]: value } },
							{ total_amount: { [Op.substring]: value } },
							{ unit: { [Op.substring]: value } },
						],
					},
				};
			},
		},
	}
);

Stocks.hasMany(OutgoingDetails, {
	foreignKey: {
		name: "stock_id",
		allowNull: false,
		freezeTableName: true,
		underscored: true,
	},
});

OutgoingDetails.belongsTo(Stocks, {
	foreignKey: {
		name: "stock_id",
		allowNull: false,
		freezeTableName: true,
		underscored: true,
	},
});

Outgoings.hasMany(OutgoingDetails, {
	foreignKey: {
		name: "outgoing_id",
		allowNull: false,
		freezeTableName: true,
		underscored: true,
	},
});

OutgoingDetails.belongsTo(Outgoings, {
	foreignKey: {
		name: "outgoing_id",
		allowNull: false,
		freezeTableName: true,
		underscored: true,
	},
});

module.exports = OutgoingDetails;
