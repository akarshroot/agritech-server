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
const managementRoutes = require("./routes/ManagementRoutes")
const refreshTokenRoute = require("./routes/refreshToken")
const cookies = require("cookie-parser");
const path = require("path")
const web3RouterVoting = require("./routes/web3RouterVoting");
const generalDataRoutes = require("./routes/GeneralDataRoutes");

app.use(cookies());
app.use(cors({ 
  origin: [
    "http://localhost:3000",
    "http://localhost:3003",
    "https://platform-agritech.web.app",
    "https://35.192.7.28/"
  ],
  credentials: true
 }))
app.use(express.json())
app.use(express.static('build'));

mongoose.connect(`mongodb+srv://admin:${process.env.MONGO_PASS}@maincluster.yajbyem.mongodb.net/?retryWrites=true&w=majority`)

mongoose.connection.on('connected', async function () {
  info('Mongoose connection open');
});
app.use('/api/web3/wallet', web3Router)
app.use('/api/web3/fundingContracts', web3RouterFunding)
app.use('/api/web3/votingContracts', web3RouterVoting)
app.use("/api/auth", authRoutes)
app.use("/api/refreshToken", refreshTokenRoute)
app.use("/api/user", userRoutes)
app.use("/api/management", managementRoutes)
app.use("/api/store", storeRoutes)
app.use("/api/wallet/", walletRoutes)
app.use("/api/data/", generalDataRoutes)

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/build/index.html'));
});
module.exports = app