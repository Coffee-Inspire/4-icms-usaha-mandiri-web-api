const express = require("express");
const { Users, Roles } = require("../../models");
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
			include: Roles,
		})
			.then((result) => {
				if (!result) {
					// IF Data Empty
					errorStatusHandler(res, "", "login_failed");
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

									if (!payload.active_status) {
										return errorStatusHandler(res, "", "user_disabled");
									}

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
								errorStatusHandler(res, "", "login_failed");
							}
						}
					});
				}
			})
			.catch((e) => {
				errorStatusHandler(res, e);
			});
	},

	// Verify User
	postVerify: (req, res) => {
		const token = req.body.token;
		if (!token) return errorStatusHandler(res, "", "no auth");

		const privateKey = process.env.JWT_KEY;
		if (!privateKey) return errorStatusHandler(res, "Server Error");

		jwt.verify(token, privateKey, (err, decoded) => {
			if (err) {
				return errorStatusHandler(res, "", "no auth");
			} else {
				// disabled exp time
				// if (!decoded.exp) return errorStatusHandler(res, "", "no auth");

				successStatusHandler(res, decoded);
			}
		});
	},
};
