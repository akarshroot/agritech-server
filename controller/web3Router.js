const getFunction=require("../web3/web3")

const web3Router = require("express").Router()

web3Router.get("/getBalance/:id", async (req,res) => {
    const amount = await getFunction(req.params.id)
    console.log(amount)
    const resData = {amount}
    console.log(resData)
    res.status(200).send(resData)
})

module.exports = web3Router