const { DataTypes, Op, Sequelize } = require("sequelize");
const sequelize = require("../../config/db.js");
const OutgoingDetails = require("./outgoingDetails.model.js");
const Outgoings = require("./outgoings.model.js");
const Stocks = require("../Inventory/stocks.model.js");

const Return = sequelize.define(
	"return",
	{
		id: {
			type: DataTypes.CHAR,
			primaryKey: true,
			allowNull: false,
			defaultValue: DataTypes.UUIDV4,
		},
		outgoingDetail_id: {
			type: DataTypes.CHAR,
			allowNull: false,
		},
		return_date: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
		status: {
			type: DataTypes.BOOLEAN,
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
					include: {
						model: OutgoingDetails,
						include: [Outgoings, Stocks],
					},
					where: {
						[Op.or]: [Sequelize.literal("`outgoing_detail->outgoing`.`receipt_no` LIKE '%" + value + "%'")],
					},
				};
			},
		},
	}
);

OutgoingDetails.hasMany(Return, {
	foreignKey: {
		name: "outgoingDetail_id",
	},
});

Return.belongsTo(OutgoingDetails, {
	foreignKey: {
		name: "outgoingDetail_id",
	},
});

module.exports = Return;
