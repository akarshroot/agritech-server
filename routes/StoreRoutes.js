const { Router } = require("express");
const Product = require("../models/Product");
const { err } = require("../utils/logger");
const Order = require("../models/Order");
const User = require("../models/User");
const { info } = require("console");
const Transaction = require("../models/Transaction");
const { TransferGaslessLy } = require("../web3/web3permit");
const { getBalance } = require("../web3/web3Wallet");

const router = Router();

// get new access token
router.get("/products/all", async (req, res) => {
    try {
        const skip =
            req.query.skip && /^\d+$/.test(req.query.skip) ? Number(req.query.skip) : 0

        const category = req.query.category ? req.query.category : "all"
        const products = await Product.find({ category: category }, undefined, { skip: skip, limit: 5 })

        res.status(200).json({ error: false, data: products })
    } catch (e) {
        err(e)
        res.status(500).send()
    }
});

router.get("/products/:id", async (req, res) => {
    try {
        const prodId = req.params.id

        const product = await Product.findOne({ _id: prodId })

        res.status(200).json({ error: false, data: product })
    } catch (e) {
        err(e)
        res.status(500).send()
    }
});

router.get("/category/", async (req, res) => {
    try {
        res.status(200).json({ error: false, data: ["All", "Seed", "Infrastructure", "Service", "Insecticide", "Pesticide", "Fungicide", "Herbicide", "Growth Promoters"] })
    } catch (e) {
        err(e)
        res.status(500).send()
    }
});

router.post("/order/create", async (req, res) => {
    try {
        const { userId, product, password } = req.body
        const order = await new Order({ product: req.body.product, user: req.body.userId }).save()
        const ADMIN_USER = await User.findById('643aa85e905bd156f4c63a28')
        const buyer = await User.findById(userId)
        const requiredProduct = await Product.findById(product)
        const price = requiredProduct.price
        const txHash = await TransferGaslessLy(
            buyer.walletAddress,
            process.env.BACKEND_COINBASE_WALLET_ADDRESS,
            price,
            password
        )
        const walletBalance = await getBalance(buyer.walletAddress)
        const tx = new Transaction({
            senderId: userId,
            receiverId: order._id,
            amount: price,
            txHash: txHash.transactionHash,
            balance: walletBalance
        })
        const savedTx = await tx.save();
        buyer.transactions.push(savedTx._id);
        buyer.orders.push(order._id)
        ADMIN_USER.transactions.push(savedTx._id);
        await buyer.save();
        await ADMIN_USER.save();
        res.status(200).json({ error: false, message: "Order created!" })
    } catch (e) {
        err(e)
        res.status(500).json({ error: true, message: "Internal Server Error" })
    }
})



module.exports = router;