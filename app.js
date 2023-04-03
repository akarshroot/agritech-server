const express = require("express");
const cors = require("cors")
const web3Router = require("./controllers/web3Router");
const mongoose = require("mongoose");

const app = express()



app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    console.log("Home")
    res.send("Server")
})
app.use('/web3/wallet', web3Router)
app.use('/web3/fundingContracts', web3Router)

module.exports = app