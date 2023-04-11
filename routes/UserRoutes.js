const { Router } = require("express")
const User = require("../models/User.js")
const auth = require("../middleware/auth.js")
const { info, err } = require("../utils/logger.js");
const Campaign = require("../models/Campaign.js");
const { default: mongoose } = require("mongoose");
const Cart = require("../models/Cart.js");

const router = Router();

router.post("/data", auth, async (req, res) => {
    try {
        const id = req.body.userId
        const user = await User.findOne({ _id: id })
        if (!user) res.status(400).json({ error: true, message: "User not found." })
        else {
            user.password = undefined
            res.status(200).json({
                error: false,
                data: user
            })
        }
    } catch (error) {
        err(error)
        res.status(500).json({ error: true, message: "Internal Server Error" })
    }
})

router.post("/campaigns", auth, async (req, res) => {
    try {
        const id = req.body.userId
        const campaigns = await Campaign.find({ manager: id })
        info(campaigns)
        if (!campaigns) res.status(200).json({ error: true, message: "No campaigns found." })
        else {
            res.status(200).json({
                error: false,
                data: campaigns
            })
        }
    } catch (error) {
        err(error)
        res.status(500).json({ error: true, message: "Internal Server Error" })
    }
})

router.post("/cart", auth, async (req, res) => {
    try {
        const id = req.body.userId
        const productId = req.body.productId
        const cart = await Cart({ownerId: id, product: productId}).save()
        if (!cart) res.status(200).json({ error: true, message: "No cart found." })
        else {
            res.status(200).json({
                error: false,
                message: "Cart Updated"
            })
        }
    } catch (error) {
        err(error)
        res.status(500).json({ error: true, message: "Internal Server Error" })
    }
})

//possible vulnerability, may be able to access other's cart
router.get("/cart", auth, async (req, res) => {
    try {
        const id = new mongoose.Types.ObjectId(req.query.user)
        const cart = await Cart.find({ ownerId: id }).populate({path: "product"})
        let total = 0;
        cart.forEach((item) => {total += item.product.price})
        if (!cart) res.status(200).json({ error: true, message: "No cart found." })
        else {
            res.status(200).json({
                error: false,
                data: cart ? cart : [],
                cartTotal: total
            })
        }
    } catch (error) {
        err(error)
        res.status(500).json({ error: true, message: "Internal Server Error" })
    }
})

router.delete("/cart/:id", auth, async (req, res) => {
    try {
        const id = req.params.id
        const cart = await Cart.deleteOne({ _id: id })
        if (!cart) res.status(200).json({ error: true, message: "No item found." })
        else {
            res.status(200).json({
                error: false,
                message: "Item removed successfully"
            })
        }
    } catch (error) {
        err(error)
        res.status(500).json({ error: true, message: "Internal Server Error" })
    }
})

module.exports = router