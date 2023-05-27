const { DataTypes, Op } = require("sequelize");
const sequelize = require("../../config/db.js");
const OutgoingDetails = require("./outgoingDetails.model.js");

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
					},
					where: {
						[Op.or]: [
							{ transaction_date: { [Op.substring]: value } },
							{ note: { [Op.substring]: value } },
							{ reference_id: { [Op.substring]: value } },
							{ type: { [Op.substring]: value } },
							{ mutation: { [Op.substring]: value } },
							{ balance: { [Op.substring]: value } },
						],
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
