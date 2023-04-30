// Config
const Users = require("./Config/users.model");
const Roles = require("./Config/roles.model");
const ItemCategories = require("./Config/itemCategories.model");

// Inventory
const Stocks = require("./Inventory/stocks.model");
const Guests = require("./Inventory/guests.model");
const Suppliers = require("./Inventory/suppliers.model");

// Goods
const IncomingDetails = require("./Goods/incomingDetails.model");
const Incoming = require("./Goods/incomings.model");
const OutgoingDetails = require("./Goods/outgoingDetails.model");
const Outgoing = require("./Goods/outgoings.model");
const Journal = require("./Goods/journal.model");

module.exports = {
	// Config
	Users,
	Roles,
	ItemCategories,

	// Inventory
	Stocks,
	Guests,
	Suppliers,

	// Goods
	IncomingDetails,
	Incoming,
	OutgoingDetails,
	Outgoing,
	Journal,
};
