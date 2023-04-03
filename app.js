const express = require("express");
const cors = require("cors")
const mongoose = require("mongoose")
const web3Router=require("./controllers/web3Router");
const web3RouterFunding=require("./controllers/web3RouterFunding");
const app = express()
const {info}=require("./utils/logger");

app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://localhost:27017').then(() =>{
    info('Connected to dataBase')
    app.get('/',(req,res) => {
        info("Home")
        res.send("Server")
    })
    app.use('/web3/wallet',web3Router)
    app.use('/web3/fundingContracts',web3RouterFunding)
})


module.exports = app