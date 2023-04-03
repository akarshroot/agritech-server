require("dotenv").config();
const http = require("http");
const app = require("./app.js");
const { default: mongoose } = require("mongoose");
const User = require("./models/User.js");

const server = http.createServer(app);

server.listen(process.env.PORT, () => {
    console.log("Server running on port:", process.env.PORT);
})


mongoose.connect(`mongodb+srv://admin:${process.env.MONGO_PASS}@maincluster.yajbyem.mongodb.net/?retryWrites=true&w=majority`);

mongoose.connection.on('connected', function () {
    console.log('Mongoose connection open');
    // new User({
    //     name: "Test",
    //     email: "test@test.com",
    //     phno: 0,
    //     password: "test",
    // }).save()
});