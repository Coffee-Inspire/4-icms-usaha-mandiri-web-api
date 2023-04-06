const jwt = require("jsonwebtoken");
const { errorStatusHandler } = require("../helper/responseHandler");

const verifyToken = (req, res, next) => {
	const header = req.headers.authorization;
	if (!header) return errorStatusHandler(res, "", "no auth");

	const token = header.split(" ")[1];
	if (!token) return errorStatusHandler(res, "", "no auth");
	const privateKey = process.env.JWT_KEY;
	if (!privateKey) return errorStatusHandler(res, "No JWT KEY");

	jwt.verify(token, privateKey, (err, decoded) => {
		if (err) {
			return errorStatusHandler(res, err);
		} else {
			// disabled exp time
			// if (!decoded.exp) return errorStatusHandler(res, "", "no auth");

			req.payload = decoded;
			next();
		}
	});
};

module.exports = verifyToken;
