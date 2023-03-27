const express = require("express");
const cors = require("cors")
const web3Router=require("./controller/web3Router");
const app = express()

app.use(cors())
app.use(express.json())

app.get('/',(req,res) => {
    console.log("Home")
    res.send("Server")
})
app.use('/web3',web3Router)

module.exports = app