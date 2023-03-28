const {getBalance}=require("../web3/web3Wallet")

const web3Router = require("express").Router()

web3Router.get("/getBalance/:id", async (req,res) => {
    const amount = await getBalance(req.params.id)
    console.log(amount)
    const resData = {amount}
    console.log(resData)
    res.status(200).send(resData)
})

module.exports = web3Router