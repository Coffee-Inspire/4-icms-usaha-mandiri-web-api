require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const Port = process.env.PORT || 3000;

console.log(process.env.PORT);
console.log(process.env.APP_ENV);

// Settings
const sequelize = require("./src/config/db");
const routes = require("./src/routes");
const { Users, Roles, ItemCategories, Stocks, Guests, Suppliers } = require("./src/models/index.js");
const { uuid } = require("uuidv4");

app.use(cors());
app.use(express.json());
app.use(routes);

async function serverStart() {
	try {
		// Connect Database
		await sequelize.authenticate();
		console.log("Connection has been established successfully.");

		// Sync Model Tabel
		await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
		await Users.sync({ force: true });
		await Roles.sync({ force: true });
		await ItemCategories.sync({ force: true });
		await Stocks.sync({ force: true });
		await Guests.sync({ force: true });
		await Suppliers.sync({ force: true });
		await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

		// Tes
		// Role.create({ roleName: "tes" });

		// await User.sync({ alter: true });
		console.log("All model were synchronized successfully");
	} catch (error) {
		console.error("Unable to connect to the database : ", error);
	}
}

serverStart();

app.listen(Port, () => {
	console.log("server running at ", Port);
});
