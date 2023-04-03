const { Router } = require("express")
const UserToken = require("../models/UserToken.js")
const jwt = require("jsonwebtoken")
const verifyRefreshToken = require("../utils/verifyRefreshToken.js")
// const { refreshTokenBodyValidation } = require("../utils/validationSchema.js")
const User = require("../models/User.js")
const { info, warn } = require("../utils/logger.js")

const router = Router();

// get new access token
router.post("/", async (req, res) => {
	verifyRefreshToken(req.cookies['refreshToken'])
		.then(async ({ tokenDetails, uid }) => {
			info(tokenDetails)
			const payload = { _id: tokenDetails._id, roles: tokenDetails.roles };
			const accessToken = jwt.sign(
				payload,
				process.env.ACCESS_TOKEN_PRIVATE_KEY,
				{ expiresIn: "60m" }
			);
			res.status(200).json({
				error: false,
				userId: uid,
				accessToken,
				message: "Access token created successfully",
			});
		})
		.catch((err) => res.status(400).json(err));
});

// logout
router.delete("/", async (req, res) => {
	try {
		const userToken = await UserToken.findOne({ token: req.cookies['refreshToken'] });
		if (!userToken)
			return res
				.status(200)
				.json({ error: false, message: "Logged Out Sucessfully" });

		await userToken.remove();
		res.cookie("refreshToken", "")
		res.status(200).json({ error: false, message: "Logged Out Sucessfully" });
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: true, message: "Internal Server Error" });
	}
});

module.exports = router;