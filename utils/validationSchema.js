const Joi = require("joi")
const passwordComplexity = require("joi-password-complexity")

const signUpBodyValidation = (body) => {
	const schema = Joi.object({
		firstName: Joi.string(),
		lastName: Joi.string(),
		about: Joi.string(),
		walletID: Joi.string(),
		profileComplete: Joi.boolean(),
		dob: Joi.date(),
		prevClients: Joi.array(),
		prevExp: Joi.array(),
		onRecHours: Joi.number(),
		rating: Joi.number(),
		totalEarnings: Joi.number(),
		email: Joi.string().email().required().label("Email"),
		password: passwordComplexity().required().label("Password"),
	});
	return schema.validate(body);
};

const bountyBodyValidation = (body) => {
	const schema = Joi.object({
		title: Joi.string(),
		desc: Joi.string(),
		tags: Joi.array(),
		jobID: Joi.string(),
		deadline: Joi.date(),
		currency: Joi.string(),
		budget: Joi.number(),
		payment: Joi.string(),
		author: Joi.allow(),
		isBounty: Joi.boolean(),
		isBid: Joi.boolean(),
		isProject: Joi.boolean(),
		hidden: Joi.boolean(),
		applicants: Joi.array(),
		status: Joi.string(),
		shortlist: Joi.array(),
		greaterThan24Hours: Joi.boolean(),
		projectId: Joi.allow()
	})
	return schema.validate(body)
}

const bidBodyValidation = (body) => {
	const schema = Joi.object({
		title: Joi.string(),
		desc: Joi.string(),
		tags: Joi.array(),
		jobID: Joi.allow(),
		deadline: Joi.date(),
		currency: Joi.string(),
		expectedAvgBid: Joi.number(),
		author: Joi.allow(),
		isBounty: Joi.boolean(),
		isBid: Joi.boolean(),
		isProject: Joi.boolean(),
		hidden: Joi.boolean(),
		applicants: Joi.array(),
		status: Joi.string(),
		shortlist: Joi.array(),
		greaterThan24Hours: Joi.boolean(),
		projectId: Joi.allow()
	})
	return schema.validate(body)
}

const projectBodyValidation = (body) => {
	const schema = Joi.object({
		title: Joi.string(),
		desc: Joi.string(),
		chatterId: Joi.allow(),
		author: Joi.allow(),
		hidden: Joi.boolean(),
		members: Joi.array(),
		jobs: Joi.array(),
		status: Joi.string(),
		noDeadline: Joi.boolean(),
		deadline: Joi.date(),
		tags: Joi.array()
	})
	return schema.validate(body)
}

const logInBodyValidation = (body) => {
	const schema = Joi.object({
		email: Joi.string().email().required().label("Email"),
		password: Joi.string().required().label("Password"),
	});
	return schema.validate(body);
};

const refreshTokenBodyValidation = (body) => {
	const schema = Joi.object({
		refreshToken: Joi.string().required().label("Refresh Token"),
	});
	return schema.validate(body);
};

module.exports = {
	signUpBodyValidation,
	logInBodyValidation,
	refreshTokenBodyValidation,
	bountyBodyValidation,
	bidBodyValidation,
	projectBodyValidation
};