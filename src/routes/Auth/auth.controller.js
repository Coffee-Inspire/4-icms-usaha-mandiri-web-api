const express = require("express");
const { Users } = require("../../models");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { errorStatusHandler, successStatusHandler } = require("../helper/routesHandler");

const app = express();

// Create User / REGISTER
app.post("/createuser", (req, res) => {
	const { password } = req.body;
	const saltRounds = Number(process.env.SALT) ?? 10;

	bcrypt.hash(password, saltRounds, function (err, hashPassword) {
		if (err) {
			errorStatusHandler(res, err);
		} else {
			Users.create({
				...req.body,
				id: uuidv4(),
				password: hashPassword,
			})
				.then((result) => {
					successStatusHandler(res, result);
				})
				.catch((e) => {
					errorStatusHandler(res, e);
				});
		}
	});
});

// Login
app.post("/login", (req, res) => {
	const { username, password } = req.body;

	Users.findOne({
		where: {
			username,
		},
	})
		.then((result) => {
			if (!result) {
				// IF Data Empty
				successStatusHandler(res, "User / Password Wrong");
			} else {
				bcrypt.compare(password, result.password, (err, compareResult) => {
					if (err) {
						errorStatusHandler(res, err);
					} else {
						if (compareResult) {
							// IF COMPARE TRUE

							const privateKey = process.env.JWT_KEY;
							if (!privateKey) {
								errorStatusHandler(res, "No JWT KEY");
							} else {
								// Remove password
								const { password, ...payload } = result.get();
								jwt.sign({ payload }, privateKey, (err, token) => {
									if (err) {
										errorStatusHandler(res, err);
									} else {
										successStatusHandler(res, payload, { title: "token", data: token });
									}
								});
							}
						} else {
							// IF COMPARE FALSE
							successStatusHandler(res, "User / Password Wrong");
						}
					}
				});
			}
		})
		.catch((e) => {
			errorStatusHandler(res, e);
		});
});

module.exports = app;
