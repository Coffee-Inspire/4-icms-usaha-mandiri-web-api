const { DataTypes, Op } = require("sequelize");
const sequelize = require("../../config/db.js");
const Incoming = require("./incomings.model.js");
const Outgoing = require("./outgoings.model.js");

const Journal = sequelize.define(
	"journal",
	{
		id: {
			type: DataTypes.CHAR,
			primaryKey: true,
			allowNull: false,
			defaultValue: DataTypes.UUIDV4,
		},
		transaction_date: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
		note: {
			type: DataTypes.TEXT,
		},
		reference_id_incoming: {
			type: DataTypes.CHAR,
			allowNull: true,
		},
		reference_id_outgoing: {
			type: DataTypes.CHAR,
			allowNull: true,
		},
		type: {
			type: DataTypes.CHAR,
			allowNull: false,
		},
		mutation: {
			type: DataTypes.DECIMAL(15),
			allowNull: false,
		},
		balance: {
			type: DataTypes.DECIMAL(15),
			allowNull: false,
			defaultValue: 0,
		},
		version: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
	},
	{
		indexes: [],
		freezeTableName: true,
		timestamps: true,
		underscored: true,
		version: true,
		scopes: {
			search(value) {
				return {
					include: [
						{
							model: Incoming,
							where: {
								[Op.or]: [{ incoming_no: { [Op.substring]: value } }],
							},
							required: false,
						},
						{
							model: Outgoing,
							where: {
								[Op.or]: [{ receipt_no: { [Op.substring]: value } }],
							},
							required: false,
						},
					],
					where: {
						[Op.or]: [
							{ transaction_date: { [Op.substring]: value } },
							{ note: { [Op.substring]: value } },
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

Incoming.hasOne(Journal, {
	foreignKey: {
		name: "reference_id_incoming",
		allowNull: true,
	},
});

Journal.belongsTo(Incoming, {
	foreignKey: {
		name: "reference_id_incoming",
		allowNull: true,
	},
});

Outgoing.hasOne(Journal, {
	foreignKey: {
		name: "reference_id_outgoing",
		allowNull: true,
	},
});

Journal.belongsTo(Outgoing, {
	foreignKey: {
		name: "reference_id_outgoing",
		allowNull: true,
	},
});

module.exports = Journal;
