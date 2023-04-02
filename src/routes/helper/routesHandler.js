// Internal Function
const sendError = (msg, type) => {
	return {
		error: {
			message: msg,
			[type && "type"]: type,
		},
	};
};

const sendSuccess = (msg) => {
	return {
		message: "success",
		data: msg,
	};
};

// ===============================================================================

// Export Function
const errorStatusHandler = (res, e) => {
	switch (e?.errors?.[0]?.type) {
		case "notNull Violation":
		case "unique violation":
			res.status(400).send(sendError(e.errors[0].message, e.errors[0].type));
			break;

		default:
			if (process.env.APP_ENV == "DEV") {
				console.log("Fatal Error : ", e);
				res.status(500).send(sendError("Fatal Error", e));
			} else {
				res.status(500).send(sendError("Server Error"));
			}
			break;
	}

	return null;
};

const successStatusHandler = (res, data) => {
	res.send(sendSuccess(data));
	return null;
};

module.exports = {
	errorStatusHandler,
	successStatusHandler,
};
