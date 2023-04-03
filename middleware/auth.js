const jwt = require("jsonwebtoken")

const auth = async (req, res, next) => {
	const token = req.header("Authorization");
	if (!token)
		return res
			.status(403)
			.json({ error: true, message: "Access Denied: No token provided" });

	try {
		const tokenDetails = jwt.verify(
			token,
			process.env.ACCESS_TOKEN_PRIVATE_KEY
		);
		req.user = tokenDetails;
		next();
	} catch (err) {
		res
			.status(403)
			.json({ error: true, message: "Access Denied: Invalid token", dev_msg: err.message });
	}
};

module.exports = auth;
