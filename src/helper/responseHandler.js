// Internal Function
const sendError = (msg, type) => {
	return {
		error: {
			message: msg,
			[type && "type"]: type,
		},
	};
};

const sendSuccess = (msg, specialData) => {
	let sendData = Object.assign(
		{},
		{ message: "success" },
		{ data: msg },
		specialData && { [specialData.title]: specialData.data }
	);
	return sendData;
};

// ===============================================================================

// Export Function
const errorStatusHandler = (res, e, type) => {
	let typeStatus = type ? type : e?.errors?.[0]?.type;
	switch (typeStatus) {
		// sequlize error
		case "notNull Violation":
		case "unique violation":
			res.status(400).send(sendError(e.errors[0].message, e.errors[0].type));
			break;

		// auth error
		case "no auth":
			res.status(400).send(sendError("No Authorization / Invalid Authorization !"));
			break;
		case "login_failed":
			res.status(403).send(sendError("Mohon periksa kembali username dan password yang digunakan"));
			break;

		default:
			if (process.env.APP_ENV == "DEV") {
				console.log("Fatal Error : ", e);
				res.status(500).send(sendError("Developer Fatal Error", e));
			} else {
				res.status(500).send(sendError("Server Error"));
			}
			break;
	}

	return null;
};

const successStatusHandler = (res, data, specialData) => {
	if (!data) {
		res.send(sendSuccess([], specialData));
	} else {
		res.send(sendSuccess(data, specialData));
	}
	return null;
};

module.exports = {
	errorStatusHandler,
	successStatusHandler,
};
