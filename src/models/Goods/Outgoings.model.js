const { DataTypes, Op } = require("sequelize");
const sequelize = require("../../config/db.js");
const Guests = require("../Inventory/guests.model.js");

const Outgoings = sequelize.define(
	"outgoings",
	{
		id: {
			type: DataTypes.CHAR,
			primaryKey: true,
			allowNull: false,
			defaultValue: DataTypes.UUIDV4,
		},
		sold_date: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
		receipt_no: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		guest_id: {
			type: DataTypes.CHAR,
		},
		total_sold: {
			type: DataTypes.DECIMAL(15),
			allowNull: false,
		},
		note: {
			type: DataTypes.TEXT,
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
							model: Guests,
							where: {
								[Op.or]: [{ guest_name: { [Op.substring]: value } }],
							},
							required: false,
						},
					],
					where: {
						[Op.or]: [
							{ receipt_no: { [Op.substring]: value } },
							{ total_sold: { [Op.substring]: value } },
							{ note: { [Op.substring]: value } },
						],
					},
				};
			},
		},
	}
);

Guests.hasMany(Outgoings, {
	foreignKey: {
		name: "guest_id",
	},
});

Outgoings.belongsTo(Guests, {
	foreignKey: {
		name: "guest_id",
	},
});

module.exports = Outgoings;
