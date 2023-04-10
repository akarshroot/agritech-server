const express = require("express");
const cors = require("cors")
const { default: mongoose } = require("mongoose");
const web3Router = require("./routes/web3Router");
const web3RouterFunding = require("./routes/web3RouterFunding");
const app = express()
const { info } = require("./utils/logger");
const authRoutes = require("./routes/AuthRoutes")
const userRoutes = require("./routes/UserRoutes")
const storeRoutes = require("./routes/StoreRoutes")
const walletRoutes = require("./routes/WalletRoutes")
const refreshTokenRoute = require("./routes/refreshToken")
const cookies = require("cookie-parser");
const web3RouterVoting=require("./routes/web3RouterVoting");

app.use(cookies());
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

app.get('/', (req, res) => {
    info("Home")
    res.send("AgriTech Server")
})

// setAddress().then(() => {
app.use('/api/web3/wallet', web3Router)
app.use('/api/web3/fundingContracts', web3RouterFunding)
app.use('/api/web3/votingContracts', web3RouterVoting)
// })
app.use("/api/auth", authRoutes)
app.use("/api/refreshToken", refreshTokenRoute)
app.use("/api/user", userRoutes)
app.use("/api/store", storeRoutes)
app.use("/api/wallet/", walletRoutes)


module.exports = app