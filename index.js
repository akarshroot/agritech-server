require("dotenv").config();
const http = require("http");
const app = require("./app.js")
const { info } = require("./utils/logger");
const { Server } = require("socket.io");
const campaignUpdateListener = require("./utils/campaignUpdateListener.js");

const io = new Server();

const server = http.createServer(app);

campaignUpdateListener(io)
io.listen(5000, { cors: { origin: "*" } })

server.listen(process.env.PORT, async () => {
    info("Server running on port:", process.env.PORT);
})