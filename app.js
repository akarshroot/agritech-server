const express = require("express");
const cors = require("cors")
const { default: mongoose } = require("mongoose");
const web3Router=require("./controllers/web3Router");
const web3RouterFunding=require("./controllers/web3RouterFunding");
const User = require("./models/User.js");
const app = express()
const {info}=require("./utils/logger");

app.use(cors())
app.use(express.json())

mongoose.connect(`mongodb+srv://admin:${process.env.MONGO_PASS}@maincluster.yajbyem.mongodb.net/?retryWrites=true&w=majority`)

mongoose.connection.on('connected', function () {
    info('Mongoose connection open');
    // new User({
    //     name: "Test",
    //     email: "test@test.com",
    //     phno: 0,
    //     password: "test",
    // }).save()
});

app.get('/',(req,res) => {
    info("Home")
    res.send("Server")
})

app.use('/web3/wallet',web3Router)
app.use('/web3/fundingContracts',web3RouterFunding)




module.exports = app