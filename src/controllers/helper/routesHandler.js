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
const errorStatusHandler = (res, e) => {
	switch (e?.errors?.[0]?.type) {
		case "notNull Violation":
		case "unique violation":
			res.status(400).send(sendError(e.errors[0].message, e.errors[0].type));
			break;

		default:
			if (process.env.APP_ENV == "DEVz") {
				console.log("Fatal Error : ", e);
				res.status(500).send(sendError("Fatal Error", e));
			} else {
				res.status(500).send(sendError("Server Error"));
			}
			break;
	}

	return null;
};

const successStatusHandler = (res, data, specialData) => {
	res.send(sendSuccess(data, specialData));
	return null;
};

module.exports = {
	errorStatusHandler,
	successStatusHandler,
};
