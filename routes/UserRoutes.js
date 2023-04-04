const { Router } = require("express")
const User = require("../models/User.js")
const auth = require("../middleware/auth.js")
const { info, err } = require("../utils/logger.js");

const router = Router();

router.post("/data", auth, async (req, res) => {
    try {
        const id = req.body.userId
        const user = await User.findOne({_id: id})
        if(!user) res.status(400).json({error: true, message: "User not found."})
        else {
            user.password = undefined
            res.status(200).json({
                error: false,
                data: user
            })
        }
    } catch (error) {
        err(error)
        res.status(500).json({error: true, message: "Internal Server Error"})
    }
})

module.exports = router