import User from "../models/User";

const verifiedUser = async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.body.userId })
        if (!user) throw new Error("No such user found.")
        if (user.verified === false) throw new Error("Email not verified.")
        next();
    } catch (err) {
        res
            .status(403)
            .json({ error: true, message: "Access Denied: Please verify your email first.", dev_msg: err.message });
    }
};