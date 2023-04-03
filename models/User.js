// user.model.js
const mongoose = require('mongoose');
// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    phno: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    walletAddress: {
        type: String,
    },
    crops: [
        {
            type: String,
            _id: false
        }
    ],
    createdAt: {
        type: Date,
        default: () => Date.now(),
        immutable: true
    },
});

// Export the model
const User = mongoose.model("User", userSchema);

module.exports = User