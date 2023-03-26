require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const Port = process.env.PORT || 3000;

console.log(process.env.PORT);
console.log(process.env.APP_ENV);

// Settings
const sequelize = require("./src/config/db");
// const routes = require("./src/routes");
const { User, Role, ItemCategory } = require("./src/models/index.js");

app.use(cors());
app.use(express.json());
// app.use(routes);

async function serverStart() {
	try {
		// Connect Database
		await sequelize.authenticate();
		console.log("Connection has been established successfully.");

		// Sync Model Tabel
		await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
		await User.sync({ force: true });
		await Role.sync({ force: true });
		await ItemCategory.sync({ force: true });
		await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

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
