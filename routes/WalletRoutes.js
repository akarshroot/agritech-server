const { Router } = require("express")
const Razorpay = require('razorpay');
const bcrypt = require("bcrypt")
const { err, info } = require("../utils/logger");
const web3 = require("../web3/web3")
const {Caddress,CoinsABI,coinsOwnerAccount}=require("../web3/contracts/ABIs");
const auth=require("../middleware/auth");
const User=require("../models/User");

const router = Router();

// get new access token
router.post("/order/create",auth,async (req, res) => {
    try {
        const payingUser = await User.findById(req.user._id);
        const passwordMatching = await bcrypt.compare(req.body.password, payingUser.password)
        info('passwardMatching', passwordMatching)
        if(!passwordMatching){
            res.json({ 
                error: true,
                message: "Incorrect Password",
                signatureIsValid: false 
            })
            return;
        }
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

router.post("/payment/verify",auth,async (req, res) => {

    const body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
    const crypto = require("crypto");
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body.toString()).digest('hex');
    if (expectedSignature === req.body.razorpay_signature) {
        //transfer KCO from admin to user wallet
        const walletAddress = req.body.walletAddress
        const unlocked = await web3.eth.personal.unlockAccount(walletAddress,req.body.password,1000)
        if(!unlocked){
            res.status(400).json({ error: true, message: 'WrongPassword' })
        }
        const KCOcontract = new web3.eth.Contract(CoinsABI,Caddress)
        try{
            const response = await KCOcontract.methods.withDrawTokens(walletAddress,(req.body.amount-1)).send({
                from:coinsOwnerAccount
            })
            const tx = response.transactionHash
            info(tx)
            res.status(200).json({ 
                error: false,
                signatureIsValid: true, 
                txHash:tx
            })
        }catch(error){
            err(error.message)
            res.status(400).json({ error: true, signatureIsValid: false })
        }
        
    }
    else{
        res.status(400).json({ error: true, signatureIsValid: false })
    }
});


module.exports = router;