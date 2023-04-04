require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const Port = process.env.PORT || 3000;

// Settings
const sequelize = require("./src/config/db");
const routes = require("./src/routes");
const {
	Users,
	Roles,
	ItemCategories,
	Stocks,
	Guests,
	Suppliers,
	IncomingDetails,
	Incoming,
	OutgoingDetails,
	Outgoing,
	Journal,
} = require("./src/models/index.js");

app.use(cors());
app.use(express.json());
app.use("/stageapi/icmsmandiri", routes);

async function serverStart() {
	try {
		// Connect Database
		await sequelize.authenticate();
		console.log("Connection has been established successfully.");

		// Sync Model Tabel
		await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
		// Rebuild Table (delete data)
		// await Users.sync({ force: true });
		// await Roles.sync({ force: true });
		// await ItemCategories.sync({ force: true });
		// await Stocks.sync({ force: true });
		// await Guests.sync({ force: true });
		// await Suppliers.sync({ force: true });
		// await IncomingDetails.sync({ force: true });
		// await Incoming.sync({ force: true });
		// await OutgoingDetails.sync({ force: true });
		// await Outgoing.sync({ force: true });
		// await Journal.sync({ force: true });

		// Sync Table
		await Users.sync({ alter: true });
		await Roles.sync({ alter: true });
		await ItemCategories.sync({ alter: true });
		await Stocks.sync({ alter: true });
		await Guests.sync({ alter: true });
		await Suppliers.sync({ alter: true });
		await IncomingDetails.sync({ alter: true });
		await Incoming.sync({ alter: true });
		await OutgoingDetails.sync({ alter: true });
		await Outgoing.sync({ alter: true });
		await Journal.sync({ alter: true });
		await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

		// Tes
		// Role.create({ roleName: "tes" });

		console.log("All model were synchronized successfully");
	} catch (error) {
		console.error("Unable to connect to the database : ", error);
	}
}

serverStart();

app.listen(Port, () => {
	console.log("server running at ", Port);
});
