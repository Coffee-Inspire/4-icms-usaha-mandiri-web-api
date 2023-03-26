require("dotenv").config();
const { Sequelize } = require("sequelize");

const database = process.env.DATABASE_NAME;
const username = process.env.DATABASE_USER;
const password = process.env.DATABASE_PASS;

const sequelize = new Sequelize(database, username, password, {
	host: "localhost",
	dialect: "mysql",
	logging:
		process.env.APP_ENV === "DEBUG"
			? (...msg) => console.log(msg)
			: process.env.APP_ENV === "DEV"
			? console.log
			: false,
});

module.exports = sequelize;
