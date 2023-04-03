const Project = require("../models/Project");

const roleCheck = () => {
	return async (req, res, next) => {
		const roles = ["Admin", "Manager"]
		const project = await Project.findById({ _id: req.body.projectId })
		const memberData = project.members.find(member => member.memberId == req.body.author)
		if (memberData) {
			if (roles.includes(memberData.memberRole))
				next()
		}
		else
			res.status(400).json({ error: true, message: "You are not authorized" });
	};
};

module.exports = roleCheck;
