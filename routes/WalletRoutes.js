const { Router } = require("express")
const Razorpay = require('razorpay');
const { err, info } = require("../utils/logger");

const router = Router();

// get new access token
router.post("/order/create", async (req, res) => {
    try {
        const data = req.body
        const instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET })
        const options = {
            amount: parseInt(data.amount) * 100,  // amount in the smallest currency unit
            currency: data.currency,
            receipt: data.receipt
        };
        instance.orders.create(options, function (err, order) {
            if (err) throw err
            res.status(200).json({ error: false, data: order })
        });
    } catch (error) {
        err(error)
        res.status(500).json({ error: true, message: "Internal Server Error" })
    }
});

router.post("/payment/verify", (req, res) => {

    const body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
    const crypto = require("crypto");
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body.toString()).digest('hex');
    if (expectedSignature === req.body.razorpay_signature) {
        //transfer KCO from admin to user wallet
        //const walletAddress = body.walletAddress
        res.status(200).json({ error: false, signatureIsValid: true })
    }
    else res.status(400).json({ error: true, signatureIsValid: false })
});


module.exports = router;