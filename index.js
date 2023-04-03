require("dotenv").config();
const http = require("http");
const app = require("./app.js")
const {info}=require("./utils/logger");

const server = http.createServer(app);

server.listen(process.env.PORT,()=>{
    info("Server running on port:",process.env.PORT);
})