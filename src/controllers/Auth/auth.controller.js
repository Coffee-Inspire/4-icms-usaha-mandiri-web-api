const express = require("express");
const { Users } = require("../../models");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { errorStatusHandler, successStatusHandler } = require("../../helper/responseHandler");

const app = express();

module.exports = {
	// Create User / REGISTER
	postCreateUser: (req, res) => {
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
	},

	// Login
	postLogin: (req, res) => {
		const { username, password } = req.body;

		Users.findOne({
			where: {
				username,
			},
		})
			.then((result) => {
				if (!result) {
					// IF Data Empty
					successStatusHandler(res, "Mohon periksa kembali username dan password yang digunakan");
				} else {
					bcrypt.compare(password, result.password, (err, compareResult) => {
						if (err) {
							errorStatusHandler(res, err);
						} else {
							if (compareResult) {
								// IF COMPARE TRUE
								const privateKey = process.env.JWT_KEY;
								if (!privateKey) {
									errorStatusHandler(res, "Server Error no Auth Key");
								} else {
									// Remove password
									const { password, ...payload } = result.get();
									// disabled exp
									// exp 60 * 60 = 3600 (1 hour)
									jwt.sign(
										{
											// exp: Math.floor(Date.now() / 1000) + 3600 * 3,
											payload,
										},
										privateKey,
										(err, token) => {
											if (err) {
												errorStatusHandler(res, err);
											} else {
												successStatusHandler(res, payload, { title: "token", data: token });
											}
										}
									);
								}
							} else {
								// IF COMPARE FALSE
								successStatusHandler(res, "Mohon periksa kembali username dan password yang digunakan");
							}
						}
					});
				}
			})
			.catch((e) => {
				errorStatusHandler(res, e);
			});
	},
};
