const bcrypt = require("bcrypt");
const { errorStatusHandler } = require("./responseHandler");

const passwordCompare = (dataToCompare, password) => {
	bcrypt.compare(password, dataToCompare.password, (err, compareResult) => {
		if (err) {
			return { status: failed, msg: err };
		}

		if (compareResult) {
			return true;
		} else {
			errorStatusHandler(res, "", "login_failed");
			return false;
		}
	});
};

module.exports = {
	passwordCompare,
};

// FUNCTION UNDER STOP CONSTRUCTION
