const { Router } = require("express")
const User = require("../models/User.js")
const bcrypt = require("bcrypt")
const generateTokens = require("../utils/generateTokens.js")
const {
	signUpBodyValidation,
	logInBodyValidation,
} = require("../utils/validationSchema.js")
const Wallet = require("../models/Wallet.js")

const router = Router();

// signup
router.post("/signup", async (req, res) => {
	try {
		const { error } = signUpBodyValidation(req.body);
		if (error)
			return res
				.status(400)
				.json({ error: true, message: error.details[0].message });

		const user = await User.findOne({ email: req.body.email });
		if (user)
			return res
				.status(400)
				.json({ error: true, message: "User with given email already exist" });

		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		const userDoc = await new User({ ...req.body, password: hashPassword }).save();
		await new Wallet({ userId: userDoc._id }).save()
		res
			.status(201)
			.json({ error: false, message: "Account created sucessfully" });
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: true, message: "Internal Server Error" });
	}
});

// login
router.post("/login", async (req, res) => {
	try {
		const { error } = logInBodyValidation(req.body);
		if (error)
			return res
				.status(400)
				.json({ error: true, message: error.details[0].message });

		const user = await User.findOne({ email: req.body.email });
		if (!user)
			return res
				.status(401)
				.json({ error: true, message: "Invalid email or password. User with given email not found." });

		const verifiedPassword = await bcrypt.compare(
			req.body.password,
			user.password
		);
		if (!verifiedPassword)
			return res
				.status(401)
				.json({ error: true, message: "Invalid email or password"});

		const { accessToken, refreshToken } = await generateTokens(user);
		res
			.cookie("refreshToken", refreshToken, {
				maxAge: 604800000,// set desired expiration here
				httpOnly: true,
				secure: true,
				sameSite: "none",
			})
			.cookie("checkToken", true, {
				maxAge: 604800000,// same as above
				secure: true,
				sameSite: "none",
			})

		res.status(200).json({
			error: false,
			accessToken,
			refreshToken,
			message: "Logged in sucessfully",
		});

	} catch (err) {
		console.log(err);
		res.status(500).json({ error: true, message: "Internal Server Error" });
	}
});

module.exports = router;