// Config
const Users = require("./Config/users.model");
const Roles = require("./Config/roles.model");
const ItemCategories = require("./Config/itemCategories.model");

// Inventory
const Stocks = require("./Inventory/stocks.model");
const Guests = require("./Inventory/guests.model");
const Suppliers = require("./Inventory/suppliers.model");

module.exports = {
	// Config
	Users,
	Roles,
	ItemCategories,

	// Inventory
	Stocks,
	Guests,
	Suppliers,
};
