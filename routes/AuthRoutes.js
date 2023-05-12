const { Router } = require("express")
const User = require("../models/User.js")
const bcrypt = require("bcrypt")
const generateTokens = require("../utils/generateTokens.js");
const { addAccount } = require("../web3/web3Wallet.js");
const { info } = require("../utils/logger.js");
const Web3 = require("web3");
const web3 = require("../web3/web3.js");
const { sendMail, generateOTP } = require("../utils/email.js");
const OTP = require("../models/OTP.js");
// const {
// 	signUpBodyValidation,
// 	logInBodyValidation,
// } = require("../utils/validationSchema.js")

const router = Router();


// signup
router.post("/signup", async (req, res) => {
	try {
		const existing_user = await User.findOne({ email: req.body.email });
		if (existing_user)
			return res
				.status(400)
				.json({ error: true, message: "User with given email already exist" });
		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);
		const walletAddress = await addAccount(req.body.password)
		const value = "0x" + parseInt(Web3.utils.toWei("1", "ether")).toString(16)
		const tx = {
			from: process.env.BACKEND_COINBASE_WALLET_ADDRESS,
			to: walletAddress,
			value,
			gas: 1000000000,
			gasLimit: 210000,
		}
		const signedtx = await web3.eth.accounts.signTransaction(tx, process.env.BACKEND_COINBASE_WALLET_PRIVATEKEY)
		await web3.eth.sendSignedTransaction(signedtx.rawTransaction)
		const user = await new User({ ...req.body, password: hashPassword, walletAddress: walletAddress }).save();

		//email verification
		const code = await generateOTP(user._id)
		sendMail(req.body.email, code)

		res
			.status(201)
			.json({ error: false, message: "Account created sucessfully" });


	} catch (err) {
		console.log(err);
		res.status(500).json({ error: true, message: "Internal Server Error" });
	}
});

router.post("/otp/verify", async (req, res) => {
	try {
		const userId = req.body.userId
		const code = req.body.code
		const generatedOTP = await OTP.findOne({ user: userId })
		if (!generatedOTP) {
			res.status(400).json({ error: true, message: "OTP not generated or is expired." })
		}
		else {
			if (parseInt(code) === generatedOTP.otp) {
				await User.findOneAndUpdate({ _id: userId }, { verified: true })
				res.status(200).json({ error: false, message: "Email verified successfully!" })
			}
			else {
				res.status(400).json({ error: true, message: "Email verification failed. Invalid OTP." })
			}
		}
	} catch (error) {
		res.status(500).json({ error: true, message: "Internal Server Error." })
	}
})

// login
router.post("/login", async (req, res) => {
	try {
		// const { error } = logInBodyValidation(req.body);
		// if (error)
		// 	return res
		// 		.status(400)
		// 		.json({ error: true, message: error.details[0].message });

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
				.json({ error: true, message: "Invalid email or password" });

		const { accessToken, refreshToken } = await generateTokens(user);
		res
			.cookie("refreshToken", refreshToken, {
				maxAge: 604800000,// set desired expiration here
				httpOnly: true,
				secure: true,
				sameSite: "none",
			})
			.cookie("isLoggedIn", true, {
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